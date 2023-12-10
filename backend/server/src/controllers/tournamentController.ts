import {
  Route,
  Controller,
  Get,
  Path,
  Tags,
  Security,
  Body,
  Post,
  Put,
  Request,
  Query
} from "tsoa";
import { TournamentService } from "../services/tournamentService.js";
import { UnsavedMatch } from "../models/tournamentModel.js";
import type { Tournament } from "../models/tournamentModel.js";
import {
  CreateTournamentRequest,
  ObjectIdString,
  SignupForTournamentRequest
} from "../models/requestModel.js";
import type { JwtPayload } from "jsonwebtoken";
import type * as express from "express";

@Route("tournaments")
export class TournamentController extends Controller {
  @Get("{tournamentId}")
  @Tags("Tournaments")
  public async getTournament(
    @Path() tournamentId: ObjectIdString
  ): Promise<Tournament> {
    this.setStatus(200);
    return await this.service.getTournamentById(tournamentId);
  }

  @Get()
  @Tags("Tournaments")
  public async getTournaments(
    @Query() limit: number = 20
  ): Promise<Tournament[]> {
    this.setStatus(200);
    return await this.service.getAllTournaments(limit);
  }

  @Post()
  @Tags("Tournaments")
  @Security("jwt")
  public async createTournament(
    @Request() request: express.Request & { user: JwtPayload },
    @Body() tournamentData: CreateTournamentRequest
  ): Promise<Tournament> {
    this.setStatus(201);

    const creator = request.user.id;

    return await this.service.createTournament(tournamentData, creator);
  }

  @Put("{tournamentId}/sign-up")
  @Tags("Tournaments")
  @Security("jwt")
  public async signUpForTournament(
    @Path() tournamentId: ObjectIdString,
    @Body() requestBody: SignupForTournamentRequest
  ): Promise<void> {
    this.setStatus(204);
    await this.service.addPlayerToTournament(
      tournamentId,
      requestBody.playerId
    );
  }

  @Put("{tournamentId}/manual-schedule")
  @Tags("Tournaments")
  @Security("jwt")
  public async manualSchedule(
    @Path() tournamentId: ObjectIdString,
    @Body() requestBody: UnsavedMatch
  ): Promise<Tournament> {
    const result = await this.service.addMatchToTournament(
      tournamentId,
      requestBody
    );
    this.setStatus(201);
    return result;
  }

  private get service(): TournamentService {
    return new TournamentService();
  }
}
