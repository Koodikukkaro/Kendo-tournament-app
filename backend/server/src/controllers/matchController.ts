import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Route,
  Security,
  Tags
} from "tsoa";
import { type Match } from "../models/matchModel.js";
import { MatchService } from "../services/matchService.js";
import {
  AddPointRequest,
  CreateMatchRequest,
  ObjectIdString
} from "../models/requestModel.js";
import { io } from "../socket.js";

@Route("match")
export class MatchController extends Controller {
  /*
   * Create a new Kendo match.
   */
  @Post()
  @Tags("Match")
  @Security("jwt")
  public async createMatch(
    @Body() requestBody: CreateMatchRequest
  ): Promise<Match> {
    this.setStatus(200);
    return await this.service.createMatch(requestBody);
  }

  /*
   * Retrieve details of a specific Kendo match.
   */
  @Get("{matchId}")
  @Tags("Match")
  public async getMatch(@Path() matchId: ObjectIdString): Promise<Match> {
    this.setStatus(200);
    return await this.service.getMatchById(matchId);
  }

  /*
   * Delete a Kendo match.
   */
  @Delete("{matchId}")
  @Tags("Match")
  @Security("jwt")
  public async deleteMatch(@Path() matchId: ObjectIdString): Promise<void> {
    this.setStatus(204);
    await this.service.deleteMatchById(matchId);
  }

  /*
   * Start the timer for the specified Kendo match.
   */
  @Patch("{matchId}/start-timer")
  @Tags("Match")
  @Security("jwt")
  public async startTimer(@Path() matchId: ObjectIdString): Promise<void> {
    this.setStatus(204);

    const match = await this.service.startTimer(matchId);

    io.to(matchId).emit("start-timer", match);
  }

  /*
   * Stop the timer for the specified Kendo match.
   */
  @Patch("{matchId}/stop-timer")
  @Tags("Match")
  @Security("jwt")
  public async stopTimer(@Path() matchId: ObjectIdString): Promise<void> {
    this.setStatus(204);

    const match = await this.service.stopTimer(matchId);

    io.to(matchId).emit("stop-timer", match);
  }

  /*
   * Add a point to the specified Kendo match.
   */
  @Patch("{matchId}/points")
  @Tags("Match")
  @Security("jwt")
  public async addPoint(
    @Path() matchId: ObjectIdString,
    @Body() updateMatchRequest: AddPointRequest
  ): Promise<void> {
    this.setStatus(204);

    const match = await this.service.addPointToMatchById(
      matchId,
      updateMatchRequest
    );

    io.to(matchId).emit("add-point", match);
  }

  /*
   * Add a time keeper to the specified Kendo match
   */
  @Patch("{matchId}/add-timekeeper")
  @Tags("Match")
  @Security("jwt")
  public async addTimeKeeperToMatch(
    @Path() matchId: ObjectIdString,
    @Body() request: { timeKeeperId: ObjectIdString }
  ): Promise<void> {
    this.setStatus(204);
    const match = await this.service.addTimeKeeperToMatch(
      matchId,
      request.timeKeeperId
    );

    io.to(matchId).emit("add-timekeeper", match);
  }

  /*
   * Remove the time keeper from the specified Kendo match
   */
  @Patch("{matchId}/remove-timekeeper")
  @Tags("Match")
  @Security("jwt")
  public async deleteTimeKeeperFromMatch(
    @Path() matchId: ObjectIdString
  ): Promise<void> {
    this.setStatus(204);

    const match = await this.service.deleteTimeKeeperFromMatch(matchId);

    io.to(matchId).emit("remove-timekeeper", match);
  }

  /*
   * Add a point maker to the specified Kendo match
   */
  @Patch("{matchId}/add-pointmaker")
  @Tags("Match")
  @Security("jwt")
  public async addPointMakerToMatch(
    @Path() matchId: ObjectIdString,
    @Body() request: { pointMakerId: ObjectIdString }
  ): Promise<void> {
    this.setStatus(204);

    const match = await this.service.addPointMakerToMatch(
      matchId,
      request.pointMakerId
    );

    io.to(matchId).emit("add-pointmaker", match);
  }

  /*
   * Remove the point maker from the specified Kendo match
   */
  @Patch("{matchId}/remove-pointmaker")
  @Tags("Match")
  @Security("jwt")
  public async deletePointMakerFromMatch(
    @Path() matchId: ObjectIdString
  ): Promise<void> {
    this.setStatus(204);

    const match = await this.service.deletePointMakerFromMatch(matchId);

    io.to(matchId).emit("remove-pointmaker", match);
  }

  private get service(): MatchService {
    return new MatchService();
  }
}
