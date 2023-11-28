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
import { CreateTournamentRequest } from "../models/requestModel.js";

export class TournamentService {
  public async getTournamentById(id: string): Promise<Tournament> {
    const tournament = await TournamentModel.findById(id).exec();

    if (tournament === null || tournament === undefined) {
      throw new NotFoundError({
        message: "Tournament not found"
      });
    }

    return await tournament.toObject();
  }

  public async getAllTournaments(limit: number): Promise<Tournament[]> {
    const tournaments = await TournamentModel.find().limit(limit).exec();

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
      this.calculateRoundRobinMatches(tournamentData.maxPlayers); // this will throw error if players < 2
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

    // Check if player exists in the UserModel
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

    // Check if the tournament has reached its maximum number of players
    if (tournament.players.length >= tournament.maxPlayers) {
      throw new BadRequestError({
        message: "Tournament has reached its maximum number of players"
      });
    }

    tournament.players.push(player.id);
    await tournament.save();
  }


  // update - add custom match
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


  public async generateTournamentSchedule(
    tournamentId: string
  ): Promise<Tournament> {
    const tournament = await TournamentModel.findById(tournamentId).exec();

    if (tournament === null || tournament === undefined) {
      throw new NotFoundError({
        message: "Tournament not found"
      });
    }

    if (tournament.players.length !== tournament.maxPlayers) {
      throw new BadRequestError({
        message: "Tournament player count has not reached the maximum capacity"
      });
    }

    let matches: UnsavedMatch[] = [];

    switch (tournament.type) {
      case TournamentType.RoundRobin:
        if (
          this.calculateRoundRobinMatches(tournament.maxPlayers) ===
          tournament.matchSchedule.length
        ) {
          throw new BadRequestError({
            message:
              "We have already created the match schedule for this tournament."
          });
        }
        matches = this.generateRoundRobinSchedule(tournament.players);
        break;
      case TournamentType.Playoff:
        matches = await this.generatePlayoffSchedule(
          tournament.players,
          tournament.matchSchedule
        );
        break;
    }

    // Create Match documents for each match
    for (const match of matches) {
      const matchDocument = await MatchModel.create(match);
      tournament.matchSchedule.push(matchDocument._id);
    }

    await tournament.save();
    return await tournament.toObject();
  }

  // private function
  private generateRoundRobinSchedule(
    playerIds: Types.ObjectId[]
  ): UnsavedMatch[] {
    const matches: UnsavedMatch[] = [];
    for (let i = 0; i < playerIds.length; i++) {
      for (let j = i + 1; j < playerIds.length; j++) {
        matches.push({
          players: [
            { id: playerIds[i], points: [], color: "red" },
            { id: playerIds[j], points: [], color: "white" }
          ],
          type: "group", // decide what this is going to be.
          admin: null, // this has to be an ID.
          elapsedTime: 0,
          timerStartedTimestamp: null
          // Set other Match fields as necessary
        });
      }
    }
    return matches;
  }

  // private function
  private async generatePlayoffSchedule(
    playerIds: Types.ObjectId[],
    previousMatches: Types.ObjectId[]
  ): Promise<UnsavedMatch[]> {
    const matches: UnsavedMatch[] = [];
    let currentRoundPlayers = [];
    // check if there's any previous matches.
    if (previousMatches.length === 0) {
      // work with original list
      currentRoundPlayers = [...playerIds];
    } else {
      const matchPromises = previousMatches.map(
        async (matchId) => await MatchModel.findById(matchId).exec()
      );
      const matchDatas = await Promise.all(matchPromises);

      for (const matchData of matchDatas) {
        const winnerId = matchData?.winner;
        if (winnerId === null || winnerId === undefined) {
          throw new BadRequestError({
            message:
              "Cannot create a new round because the last round of the playoffs is not yet complete."
          });
        }
        currentRoundPlayers.push(winnerId);
      }
    }

    for (let i = 0; i < playerIds.length; i += 2) {
      // only works in power of 2.
      matches.push({
        players: [
          { id: playerIds[i], points: [], color: "red" },
          { id: playerIds[i + 1], points: [], color: "white" }
        ],
        type: "playoff", // decide what this is going to be.
        admin: null, // this has to be an ID.
        elapsedTime: 0,
        timerStartedTimestamp: null
        // Set other Match fields as necessary
      });
    }
    return matches;
  }

  // private utility function
  private isPowerOfTwo(n: number): boolean {
    if (n <= 0) {
      return false;
    }
    return (n & (n - 1)) === 0;
  }

  // private utility function
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
