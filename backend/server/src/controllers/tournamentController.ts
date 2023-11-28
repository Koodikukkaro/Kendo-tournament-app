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
import {
  type Tournament,
  AddPlayerRequest
} from "../models/tournamentModel.js";
import {
  CreateTournamentRequest,
  ObjectIdString
} from "../models/requestModel.js";
import { type JwtPayload } from "jsonwebtoken";
import type * as express from "express";

@Route("tournaments")
export class TournamentController extends Controller {
  @Get("{id}")
  @Tags("Tournaments")
  public async getTournament(@Path() id: ObjectIdString): Promise<Tournament> {
    this.setStatus(200);
    return await this.service.getTournamentById(id);
  }

  @Get()
  @Tags("Tournaments")
  public async getTournaments(
    @Query() limit: number = 20
  ): Promise<Tournament[]> {
    this.setStatus(200);
    return await this.service.getAllTournaments(limit);
  }

  @Security("jwt")
  @Post("create")
  @Tags("Tournaments")
  public async createTournament(
    @Request() request: express.Request & { user: JwtPayload },
    @Body() tournamentData: CreateTournamentRequest
  ): Promise<Tournament> {
    this.setStatus(201);

    const creator = request.user.id;

    return await this.service.createTournament(tournamentData, creator);
  }

  @Security("jwt")
  @Put("{tournamentId}/addPlayer")
  @Tags("Tournaments")
  public async addPlayerToTournament(
    @Path() tournamentId: ObjectIdString,
    @Body() requestBody: AddPlayerRequest
  ): Promise<Tournament> {
    const result = await this.service.addPlayerToTournament(
      tournamentId,
      requestBody.playerId
    );
    this.setStatus(200); // OK status
    return result;
  }

  private get service(): TournamentService {
    return new TournamentService();
  }
}
