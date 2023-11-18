import NotFoundError from "../errors/NotFoundError.js";
import { TournamentModel, type Tournament } from "../models/tournamentModel.js";

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

  // listing
  // public async getAllTournaments(): Promise<Tournament[]> {
  //     console.log("I am in get all tournament service")
  //     return await TournamentModel.find().exec();
  // }

  // // all running
  // public async getRunningTournaments(): Promise<Tournament[]> {
  //     const currentDate = new Date();

  //     return await TournamentModel.find({
  //         startDate: { $lte: currentDate },
  //         endDate: { $gte: currentDate }
  //     }).exec();
  // }

  // // all future tournaments
  // public async getUpcomingTournaments(): Promise<Tournament[]> {
  //     const currentDate = new Date();

  //     return await TournamentModel.find({
  //         startDate: { $gt: currentDate }
  //     }).exec();
  // }
}
