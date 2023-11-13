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
  @Security("jwt", ["official"])
  @Post()
  @Tags("Match")
  public async createMatch(
    @Body() requestBody: CreateMatchRequest
  ): Promise<Match> {
    this.setStatus(200);
    return await this.service.createMatch(requestBody);
  }

  /*
   * Retrieve details of a specific Kendo match.
   */
  @Get("{id}")
  @Tags("Match")
  public async getMatch(@Path() id: ObjectIdString): Promise<Match> {
    this.setStatus(200);
    return await this.service.getMatchById(id);
  }

  /*
   * Delete a Kendo match.
   */
  @Security("jwt", ["official"])
  @Delete("{id}")
  @Tags("Match")
  public async deleteMatch(@Path() id: ObjectIdString): Promise<void> {
    this.setStatus(204);
    await this.service.deleteMatchById(id);
  }

  /*
   * Start the timer for the specified Kendo match.
   */
  @Security("jwt", ["official"])
  @Patch("{id}/start-timer")
  @Tags("Match")
  public async startTimer(@Path() id: ObjectIdString): Promise<void> {
    this.setStatus(204);

    const match = await this.service.startTimer(id);

    io.to(match.id).emit("start-timer", match);
  }

  /*
   * Stop the timer for the specified Kendo match.
   */
  @Security("jwt", ["official"])
  @Patch("{id}/stop-timer")
  @Tags("Match")
  public async stopTimer(@Path() id: ObjectIdString): Promise<void> {
    this.setStatus(204);

    const match = await this.service.stopTimer(id);

    io.to(match.id).emit("stop-timer", match);
  }

  /*
   * Add a point to the specified Kendo match.
   */
  @Security("jwt", ["official"])
  @Patch("{id}/points")
  @Tags("Match")
  public async addPoint(
    @Path() id: ObjectIdString,
    @Body() updateMatchRequest: AddPointRequest
  ): Promise<void> {
    this.setStatus(204);

    const match = await this.service.addPointToMatchById(
      id,
      updateMatchRequest
    );

    io.to(match.id).emit("add-point", match);
  }

  private get service(): MatchService {
    return new MatchService();
  }
}
