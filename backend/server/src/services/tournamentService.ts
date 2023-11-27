import NotFoundError from "../errors/NotFoundError.js";
import { TournamentModel, type Tournament } from "../models/tournamentModel.js";
import UserModel from "../models/userModel.js";

export class TournamentService {
  // read
  public async getTournamentById(id: string): Promise<Tournament> {
    const tournament = await TournamentModel.findById(id).exec();

    if (tournament === null || tournament === undefined) {
      throw new NotFoundError({
        message: "Tournament not found"
      });
    }

    return await tournament.toObject();
  }

  // create
  public async createTournament(
    tournamentData: Tournament
  ): Promise<Tournament> {
    // maybe add created_by? not sure.
    const newTournament = await TournamentModel.create(tournamentData);
    return await newTournament.toObject();
  }

  // update - add players
  public async addPlayerToTournament(
    tournamentId: string,
    playerId: string
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
      throw new Error("Player already registered in the tournament");
    }

    // Check if the tournament has reached its maximum number of players
    if (tournament.players.length >= tournament.maxPlayers) {
      throw new Error("Tournament has reached its maximum number of players");
    }

    tournament.players.push(playerId);
    await tournament.save();

    return await tournament.toObject();
  }
}
