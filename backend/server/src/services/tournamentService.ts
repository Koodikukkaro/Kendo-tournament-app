import NotFoundError from "../errors/NotFoundError.js";
import {
  TournamentModel,
  type Tournament,
  type UnsavedMatch,
  TournamentType
} from "../models/tournamentModel.js";
import UserModel from "../models/userModel.js";
import BadRequestError from "../errors/BadRequestError.js";
import { type Types } from "mongoose";
import MatchModel from "../models/matchModel.js";

export class TournamentService {
  public async getTournamentById(id: string): Promise<Tournament> {
    const tournament = await TournamentModel.findById(id)
      .populate("players")
      .populate({
        path: "matchSchedule",
        model: "Match"
      })
      .exec();

    if (tournament === null || tournament === undefined) {
      throw new NotFoundError({
        message: "Tournament not found"
      });
    }

    return await tournament.toObject();
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
        message:
          "Invalid tournament dates. The start date must be before the end date."
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
      const newMatchIds = await this.generateTournamentSchedule(
        tournament,
        player.id
      );
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
    const tournament = await TournamentModel.findById(tournamentId).exec();
    if (tournament === null || tournament === undefined) {
      throw new NotFoundError({
        message: "Tournament not found"
      });
    }

    const currentDate = new Date();
    const startDate = new Date(tournament.startDate);
    if (currentDate > startDate) {
      throw new BadRequestError({
        message: `Cannot add new players as the tournament has already started on ${startDate.toDateString()}`
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
    newPlayer: Types.ObjectId
  ): Promise<Types.ObjectId[]> {
    let matches: UnsavedMatch[] = [];
    switch (tournament.tournamentType) {
      case TournamentType.RoundRobin:
        matches = this.generateRoundRobinSchedule(
          tournament.players,
          newPlayer
        );
        break;
      case TournamentType.Playoff:
        matches = await this.generatePlayoffSchedule(
          tournament.players,
          tournament.matchSchedule
        );
        break;
    }

    if (matches.length === 0) {
      return [];
    }

    const matchDocuments = await MatchModel.insertMany(matches);
    return matchDocuments.map((doc) => doc._id);
  }

  private generateRoundRobinSchedule(
    playerIds: Types.ObjectId[],
    newPlayer: Types.ObjectId
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
    previousMatches: Types.ObjectId[]
  ): Promise<UnsavedMatch[]> {
    const matches: UnsavedMatch[] = [];
    const playerSet = new Set<Types.ObjectId>();

    const matchDatas = await MatchModel.find({
      _id: { $in: previousMatches }
    }).exec();

    for (const matchData of matchDatas) {
      matchData.players.forEach((player) => playerSet.add(player.id));
    }
    const extraPlayers = playerIds.filter((id) => !playerSet.has(id));

    if (extraPlayers.length === 2) {
      matches.push({
        players: [
          { id: extraPlayers[0], points: [], color: "red" },
          { id: extraPlayers[1], points: [], color: "white" }
        ],
        type: "playoff",
        admin: null,
        elapsedTime: 0,
        timerStartedTimestamp: null,
        tournamentRound: 1
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
}
