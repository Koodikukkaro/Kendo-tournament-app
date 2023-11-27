import { Route, Controller, Get, Path, Tags, Security, Body, Post, Put, Response } from "tsoa";
import { TournamentService } from "../services/tournamentService.js";
import { Tournament } from "../models/tournamentModel.js";
import { ObjectIdString } from "../models/requestModel.js";
import { AddPlayerRequest } from "../models/tournamentModel.js";
import NotFoundError from "../errors/NotFoundError.js";


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

  @Security("jwt")
  @Put("{tournamentId}/addPlayer")
  @Tags("Tournament")
  @Response(404, "Not Found")
  @Response(400, "Bad Request")
  @Response(500, "Internal Server Error")
  public async addPlayerToTournament(
    @Path() tournamentId: ObjectIdString,
    @Body() requestBody: AddPlayerRequest
  ): Promise<Tournament | { message: string }> {
    try {
      const result = await this.service.addPlayerToTournament(tournamentId, requestBody.playerId);
      this.setStatus(200); // OK status
      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.setStatus(404); // Not Found
      } else if (error instanceof Error) {
        this.setStatus(400); // Bad Request or other appropriate status
      }
      else {
        this.setStatus(500);
      }
      const errObj = error as Error;
      return { message: errObj.message };
    }
  }

  private get service(): TournamentService {
    return new TournamentService();
  }
}
