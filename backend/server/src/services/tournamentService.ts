import NotFoundError from "../errors/NotFoundError.js";
import { type CreateTournamentRequest } from "../models/requestModel.js";
import { TournamentModel, type Tournament } from "../models/tournamentModel.js";
import UserModel from "../models/userModel.js";
import BadRequestError from "../errors/BadRequestError.js";
import { type Types } from "mongoose";

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

    const newTournament = await TournamentModel.create({
      ...tournamentData,
      creator
    });

    return await newTournament.toObject();
  }

  // update - add players
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

    // Check if player exists in the UserModel
    const player = await UserModel.findById(playerId).exec();
    if (player === null || player === undefined) {
      throw new NotFoundError({
        message: "Player not found"
      });
    }

    // Check if the player is already in the tournament
    if (tournament.players.includes(playerId)) {
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

    tournament.players.push(playerId);
    await tournament.save();

    return await tournament.toObject();
  }
}
