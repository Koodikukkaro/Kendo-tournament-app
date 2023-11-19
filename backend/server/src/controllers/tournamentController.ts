import { Route, Controller, Get, Path, Tags, Security, Body, Post } from "tsoa";
import { TournamentService } from "../services/tournamentService.js";
import { Tournament } from "../models/tournamentModel.js";
import { ObjectIdString } from "../models/requestModel.js";

@Route("tournament")
export class TournamentController extends Controller {
  @Security("jwt")
  @Get("{id}")
  @Tags("Tournament")
  public async getTournament(@Path() id: ObjectIdString): Promise<Tournament> {
    this.setStatus(200);
    return await this.service.getTournamentById(id);
  }

  @Security("jwt")
  @Post("create")
  @Tags("Tournament")
  public async createTournament(
    @Body() tournamentData: Tournament
  ): Promise<Tournament> {
    this.setStatus(201); // Created status

    return await this.service.createTournament(tournamentData);
  }

  // // @Security("jwt")
  // @Get("all")
  // @Tags("Tournament")
  // public async getAllTournaments(): Promise<Tournament[]> {
  //     console.log("getAllTournaments TOURNAMENT");
  //     return await this.service.getAllTournaments();
  // }

  // // @Security("jwt")
  // @Get("running")
  // @Tags("Tournament")
  // public async getRunningTournaments(): Promise<Tournament[]> {
  //     return await this.service.getRunningTournaments();
  // }

  // // @Security("jwt")
  // @Get("upcoming")
  // @Tags("Tournament")
  // public async getUpcomingTournaments(): Promise<Tournament[]> {
  //     return await this.service.getUpcomingTournaments();
  // }

  private get service(): TournamentService {
    return new TournamentService();
  }
}
