import NotFoundError from "../errors/NotFoundError.js";
import {
  TournamentModel,
  type Tournament,
  type UnsavedMatch,
  TournamentType
} from "../models/tournamentModel.js";
import UserModel, { type User } from "../models/userModel.js";
import BadRequestError from "../errors/BadRequestError.js";
import { Types } from "mongoose";
import MatchModel, { MatchType } from "../models/matchModel.js";
import { type CreateTournamentRequest } from "../models/requestModel.js";
import { type Match, type MatchPlayer } from "../models/matchModel.js";

export class TournamentService {
  public async getTournamentById(id: string): Promise<Tournament> {
    const tournament = await TournamentModel.findById(id)
      .populate<{ creator: User }>({ path: "creator", model: "User" })
      .populate<{ players: User[] }>({ path: "players", model: "User" })
      .populate<{
        matchSchedule: Match[];
      }>({
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

  public async getAllTournaments(limit: number): Promise<Tournament[]> {
    const tournaments = await TournamentModel.find()
      .limit(limit)
      .populate<{ creator: User }>({ path: "creator", model: "User" })
      .populate<{ players: User[] }>({ path: "players", model: "User" })
      .populate<{
        matchSchedule: Match[];
      }>({
        path: "matchSchedule",
        model: "Match"
      })
      .exec();

    if (tournaments === null || tournaments === undefined) {
      throw new NotFoundError({
        message: "No tournaments found"
      });
    }

    return tournaments.map((tournament) => tournament.toObject());
  }

  public async createTournament(
    tournamentData: CreateTournamentRequest,
    creator: string
  ): Promise<Tournament> {
    if (!tournamentData.differentOrganizer) {
      const organizer = await UserModel.findById(creator).exec();

      if (organizer === null) {
        // This should never throw due to the endpoint requiring authentication.
        throw new NotFoundError({
          message: "No user data found for the organizer."
        });
      }

      tournamentData.organizerEmail = organizer.email;
      tournamentData.organizerPhone = organizer.phoneNumber;
    }

    if (
      tournamentData.type === TournamentType.Playoff &&
      !this.isPowerOfTwo(tournamentData.maxPlayers)
    ) {
      throw new BadRequestError({
        message:
          "Invalid number of players for a playoff tournament. The total number of players must be a power of 2."
      });
    } else if (tournamentData.type === TournamentType.RoundRobin) {
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

    const newTournament = await TournamentModel.create({
      ...tournamentData,
      creator
    });

    return await newTournament.toObject();
  }

  public async addPlayerToTournament(
    tournamentId: string,
    playerId: string
  ): Promise<void> {
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

    // Check if the player is already in the tournament
    if (tournament.players.includes(player.id)) {
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

    tournament.players.push(player.id);

    // Adding new player to preliminary requires redoing all groups and matches,
    // perhaps a better way would be possible?
    if(tournament.type === TournamentType.PreliminiaryPlayoff){
      tournament.groups = this.dividePlayersIntoGroups(tournament.players as Types.ObjectId[], tournament.groupsSizePreference);
      await MatchModel.deleteMany({tournamentId : tournament.id});
      
      tournament.matchSchedule = [];
    }
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

    for (const player of unsavedMatch.players) {
      // player.id is a String from the requestBody. conversion is necessary here.
      const playerId = new Types.ObjectId(player.id);

      if (!tournament.players.includes(playerId)) {
        const user = await UserModel.findById(playerId).exec();

        if (user === null || user === undefined) {
          throw new NotFoundError({
            message: "Player not found!"
          });
        }
        throw new BadRequestError({
          message: `Cannot create the match: Player: ${user.firstName} ${user.lastName} is not registered for this tournament.`
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
    switch (tournament.type) {
      case TournamentType.RoundRobin:
        matches = TournamentService.generateRoundRobinSchedule(
          tournament.players as Types.ObjectId[],
          newPlayer,
          tournament.id
        );
        break;
      case TournamentType.Playoff:
        matches = await this.generatePlayoffSchedule(
          tournament.players as Types.ObjectId[],
          tournament.matchSchedule as Types.ObjectId[],
          tournament.id
        );
        break;
      case TournamentType.PreliminiaryPlayoff:
        
        for (const group of tournament.groups){
          let addedPlayers : Types.ObjectId[] = [];
          for(const player of group){
            let groupMatches = TournamentService.generateRoundRobinSchedule(
              addedPlayers as Types.ObjectId[],
              player,
              tournament.id,
              "preliminary"
            );
            matches.push(...groupMatches);
            addedPlayers.push(player);
          }
          
        }
        break;
    }

    if (matches.length === 0) {
      return [];
    }
    const matchDocuments = await MatchModel.insertMany(matches);
    return matchDocuments.map((doc) => doc._id);
  }

  public static generateRoundRobinSchedule(
    playerIds: Types.ObjectId[],
    newPlayer: Types.ObjectId,
    tournament: Types.ObjectId,
    tournamentType: MatchType = "group",
    tournamentRound: number = 1
  ): UnsavedMatch[] {
    const matches: UnsavedMatch[] = [];
    for (const playerId of playerIds) {
      if (!playerId.equals(newPlayer)) {
        matches.push({
          players: [
            { id: newPlayer, points: [], color: "white" },
            { id: playerId, points: [], color: "red" }
          ],
          type: tournamentType,
          elapsedTime: 0,
          timerStartedTimestamp: null,
          tournamentRound: tournamentRound,
          tournamentId: tournament
        });
      }
    }
    return matches;
  }

  private async generatePlayoffSchedule(
    playerIds: Types.ObjectId[],
    previousMatches: Types.ObjectId[],
    tournament: Types.ObjectId
  ): Promise<UnsavedMatch[]> {
    const matches: UnsavedMatch[] = [];
    const playerSet = new Set<string>();

    const matchDatas = await MatchModel.find({
      _id: { $in: previousMatches }
    }).exec();

    for (const matchData of matchDatas) {
      matchData.players.forEach((player) => {
        const playerAsMatchPlayer = player as MatchPlayer;
        if (
          playerAsMatchPlayer.id !== null &&
          playerAsMatchPlayer.id !== undefined
        ) {
          playerSet.add((player as MatchPlayer).id.toString());
        }
      });
    }
    const extraPlayers = [];
    for (const id of playerIds) {
      if (!playerSet.has(id.toString())) {
        extraPlayers.push(id);
      }
    }

    if (extraPlayers.length === 2) {
      matches.push({
        players: [
          { id: extraPlayers[0], points: [], color: "white" },
          { id: extraPlayers[1], points: [], color: "red" }
        ],
        type: "playoff",
        elapsedTime: 0,
        timerStartedTimestamp: null,
        tournamentRound: 1,
        tournamentId: tournament
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

  private dividePlayersIntoGroups(players: Types.ObjectId[], preferredGroupSize: number): Types.ObjectId[][] {
    const totalPlayers = players.length;
    const numGroups = Math.ceil(totalPlayers / preferredGroupSize);
  
    const groups: Types.ObjectId[][] = Array.from({ length: numGroups }, () => []);
  
    for (let i = 0; i < totalPlayers; i++) {
      const currentPlayer = players[i];
      const groupIndex = i % numGroups;
  
      groups[groupIndex].push(currentPlayer);
    }
  
    return groups;
  }
 
}
