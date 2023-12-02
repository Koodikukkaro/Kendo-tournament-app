import NotFoundError from "../errors/NotFoundError.js";
import {
  TournamentModel,
  type Tournament,
  type UnsavedMatch,
  TournamentType,
  type ExtendedMatch
} from "../models/tournamentModel.js";
import UserModel from "../models/userModel.js";
import BadRequestError from "../errors/BadRequestError.js";
import { type Types, type Document } from "mongoose";
import MatchModel from "../models/matchModel.js";

export class TournamentService {

  public async getTournamentById(id: string): Promise<Tournament> {
    // const tournament = await TournamentModel.findById(id).exec();
    const tournament = await TournamentModel.findById(id)
      .populate('players') // Populate the players array with User documents
      .populate({
        path: 'matchSchedule', // Populate the matchSchedule array
        populate: {
          path: 'players.id', // Target the id field in the players subdocument
          model: 'User' // Specify the model to use for population
        }
      })
      .exec();


    if (tournament === null || tournament === undefined) {
      throw new NotFoundError({
        message: "Tournament not found"
      });
    }

    // let tournamentObject: Tournament & Document = tournament.toObject();
    // tournamentObject = await this.tournamentToObject(tournamentObject);
    return tournament.toObject();
  }

  public async createTournament(
    tournamentData: Tournament
  ): Promise<Tournament> {
    if (
      tournamentData.tournamentType === TournamentType.Playoff &&
      !this.isPowerOfTwo(tournamentData.maxPlayers)
    ) {
      throw new BadRequestError({
        message:
          "Invalid number of players for a playoff tournament. The total number of players must be a power of 2."
      });
    } else if (tournamentData.tournamentType === TournamentType.RoundRobin) {
      this.calculateRoundRobinMatches(tournamentData.maxPlayers);
    }

    const startDate = new Date(tournamentData.startDate);
    const endDate = new Date(tournamentData.endDate);

    if (startDate >= endDate) {
      throw new BadRequestError({
        message: "Invalid tournament dates. The start date must be before the end date."
      });
    }
    const newTournament = await TournamentModel.create(tournamentData);
    return await newTournament.toObject();
  }

  public async addPlayerToTournament(
    tournamentId: string,
    playerId: Types.ObjectId
  ): Promise<Tournament> {
    const tournament = await TournamentModel.findById(tournamentId).exec();

    if (tournament === null || tournament === undefined) {
      throw new NotFoundError({
        message: "Tournament not found"
      });
    }

    const player = await UserModel.findById(playerId).exec();
    if (player === null || player === undefined) {
      throw new NotFoundError({
        message: "Player not found"
      });
    }

    if (tournament.players.includes(playerId)) {
      throw new BadRequestError({
        message: "Player already registered in the tournament"
      });
    }

    const currentDate = new Date();
    const startDate = new Date(tournament.startDate);
    if (currentDate > startDate) {
      throw new BadRequestError({
        message: `Cannot add new players as the tournament has already started on ${startDate.toDateString()}`
      });
    }

    if (tournament.players.length >= tournament.maxPlayers) {
      throw new BadRequestError({
        message: "Tournament has reached its maximum number of players"
      });
    }

    tournament.players.push(playerId);
    await tournament.save();

    if (tournament.players.length > 1) {
      const newMatchIds = await this.generateTournamentSchedule(tournament, player.id);
      if (newMatchIds.length !== 0) {
        tournament.matchSchedule.push(...newMatchIds);
        await tournament.save();
      }
    }
    return await tournament.toObject();
  }

  public async addMatchToTournament(
    tournamentId: string,
    unsavedMatch: UnsavedMatch
  ): Promise<Tournament> {
    // custom add match to tournament
    const tournament = await TournamentModel.findById(tournamentId).exec();
    if (tournament === null || tournament === undefined) {
      throw new NotFoundError({
        message: "Tournament not found"
      });
    }

    // validation
    for (let i = 0; i < unsavedMatch.players.length; i += 1) {
      if (!tournament.players.includes(unsavedMatch.players[i].id)) {
        const user = await UserModel.findById(
          unsavedMatch.players[i].id
        ).exec();

        if (user === null || user === undefined) {
          throw new NotFoundError({
            message: "Player not found!"
          });
        }
        throw new BadRequestError({
          message: `Cannot create the match: ${user.firstName} ${user.lastName} is not registered for this tournament.`
        });
      }
    }

    const newMatch = await MatchModel.create(unsavedMatch);
    tournament.matchSchedule.push(newMatch._id);
    await tournament.save();
    return await tournament.toObject();
  }

  private async generateTournamentSchedule(
    tournament: Tournament,
    newPlayer: Types.ObjectId,
  ): Promise<Types.ObjectId[]> {
    let matches: UnsavedMatch[] = [];
    switch (tournament.tournamentType) {
      case TournamentType.RoundRobin:
        matches = this.generateRoundRobinSchedule(tournament.players, newPlayer);
        break;
      case TournamentType.Playoff:
        matches = await this.generatePlayoffSchedule(tournament.players, tournament.matchSchedule);
        break;
    }

    if (matches.length === 0) {
      return [];
    }

    const matchDocuments = await MatchModel.insertMany(matches);
    return matchDocuments.map(doc => doc._id);
  }


  private generateRoundRobinSchedule(
    playerIds: Types.ObjectId[],
    newPlayer: Types.ObjectId,
  ): UnsavedMatch[] {
    const matches: UnsavedMatch[] = [];
    for (let i = 0; i < playerIds.length; i++) {
      if (!playerIds[i].equals(newPlayer)) {
        matches.push({
          players: [
            { id: newPlayer, points: [], color: "red" },
            { id: playerIds[i], points: [], color: "white" }
          ],
          type: "group",
          admin: null,
          elapsedTime: 0,
          timerStartedTimestamp: null
        });
      }
    }
    return matches;
  }

  private async generatePlayoffSchedule(
    playerIds: Types.ObjectId[],
    previousMatches: Types.ObjectId[],
  ): Promise<UnsavedMatch[]> {
    const matches: UnsavedMatch[] = [];
    const playerSet = new Set<Types.ObjectId>();

    const matchDatas = await MatchModel.find({
      _id: { $in: previousMatches }
    }).exec();

    for (const matchData of matchDatas) {
      matchData.players.forEach(player => playerSet.add(player.id));
    }
    const extraPlayers = playerIds.filter(id => !playerSet.has(id.toString()));

    if (extraPlayers.length === 2) {
      matches.push({
        players: [
          { id: extraPlayers[0], points: [], color: "red" },
          { id: extraPlayers[1], points: [], color: "white" }
        ],
        type: "playoff",
        admin: null,
        elapsedTime: 0,
        timerStartedTimestamp: null
      });
    }

    return matches;
  }


  private isPowerOfTwo(n: number): boolean {
    if (n <= 0) {
      return false;
    }
    return (n & (n - 1)) === 0;
  }

  private calculateRoundRobinMatches(playerCount: number): number {
    if (playerCount < 2) {
      throw new BadRequestError({
        message:
          "At least two players are required for a round robin tournament."
      });
    }
    return (playerCount * (playerCount - 1)) / 2;
  }

  private async tournamentToObject(
    tournamentObject: Tournament & Document
  ): Promise<Tournament & Document> {
    const playerIds = tournamentObject.players;
    const players = await UserModel.find({
      _id: { $in: playerIds }
    })
      .select("firstName lastName _id")
      .exec();

    tournamentObject.playerDetails = players.map((player) => ({
      firstName: player.firstName,
      lastName: player.lastName,
      id: player._id
    }));

    const matches = await MatchModel.find({
      _id: { $in: tournamentObject.matchSchedule }
    }).exec();

    const extendedMatches: ExtendedMatch[] = [];

    for (const match of matches) {
      const playerIds = match.players.map(player => player.id);
      const playersDetails = await UserModel.find({
        _id: { $in: playerIds }
      })
        .select("firstName lastName _id")
        .exec();

      const extendedPlayers = playersDetails.map((player) => ({
        id: player._id,
        firstName: player.firstName,
        lastName: player.lastName
      }));


      let winnerDetails = null;
      if (match.winner !== null && match.winner !== undefined) {
        const winner = await UserModel.findById(match.winner)
          .select("firstName lastName _id")
          .exec();
        winnerDetails = {
          id: winner._id,
          firstName: winner.firstName,
          lastName: winner.lastName
        };
      }

      extendedMatches.push({
        ...match.toObject(),
        playersDetails: extendedPlayers,
        winnerDetails
      });
    }

    tournamentObject.matchScheduleDetails = extendedMatches;
    return tournamentObject;
  }
}
