import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Route,
  Tags
} from "tsoa";
import { type Match } from "../models/matchModel.js";
import { MatchService } from "../services/matchService.js";
import {
  AddPointRequest,
  CreateMatchRequest,
  ObjectIdString
} from "../models/requestModel.js";

@Route("match")
export class MatchController extends Controller {
  /*
   * Create a new Kendo match.
   */
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
  @Delete("{id}")
  @Tags("Match")
  public async deleteMatch(@Path() id: ObjectIdString): Promise<void> {
    this.setStatus(204);
    await this.service.deleteMatchById(id);
  }


  /*
   * Add a point to the specified Kendo match.
   */
  @Patch("{id}/points")
  @Tags("Match")
  public async addPoint(
    @Path() id: ObjectIdString,
    @Body() updateMatchRequest: AddPointRequest
  ): Promise<void> {
    this.setStatus(204);
    await this.service.addPointToMatchById(id, updateMatchRequest);
  }

  private get service(): MatchService {
    return new MatchService();
  }
}
