import MatchModel, {
  type Match,
  type MatchPoint,
  type PlayerColor
} from "../models/matchModel.js";
import NotFoundError from "../errors/NotFoundError.js";
import BadRequestError from "../errors/BadRequestError.js";
import {
  type CreateMatchRequest,
  type AddPointRequest
} from "../models/requestModel.js";

// Note by Samuel:
// There's something missing about mongoose validation if using update.
// => Used find and save. => TODO: need for transactions. Until
// the DB has been configured for a replica set, testing transactions
// is not possible. The transactions have been commented out in the code.
export class MatchService {
  public async createMatch(requestBody: CreateMatchRequest): Promise<Match> {
    const newMatch = await MatchModel.create({
      type: requestBody.matchType,
      players: requestBody.players,
      comment: requestBody.comment
    });

    return await newMatch.toObject();
  }

  public async getMatchById(id: string): Promise<Match> {
    const match = await MatchModel.findById(id).exec();

    if (match === null) {
      throw new NotFoundError({
        code: 404,
        message: `Match not found for ID: ${id}`
      });
    }

    return await match.toObject();
  }

  public async deleteMatchById(id: string): Promise<void> {
    const result = await MatchModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundError({
        code: 404,
        message: `Match not found for ID: ${id}`
      });
    }
  }

  public async startTimer(id: string): Promise<void> {
    const match = await MatchModel.findById(id).exec();

    if (match === null) {
      throw new NotFoundError({
        message: `Match not found for ID: ${id}`
      });
    }

    if (match.winner !== undefined) {
      throw new BadRequestError({
        message: "Finished matches cannot be edited"
      });
    }

    if (match.timerStartedTimestamp !== null) {
      throw new BadRequestError({
        message: `Timer is already started for the match`
      });
    }

    // Set the initial start timestamp if it's the first start
    if (match.startTimestamp === undefined) {
      match.startTimestamp = new Date();
    }

    // Mark the timer as started
    match.timerStartedTimestamp = new Date();

    await match.save();
  }

  public async stopTimer(id: string): Promise<void> {
    const match = await MatchModel.findById(id).exec();

    if (match === null) {
      throw new NotFoundError({
        message: `Match not found for ID: ${id}`
      });
    }

    if (match.winner !== undefined) {
      throw new BadRequestError({
        message: "Finished matches cannot be edited"
      });
    }

    // Check if the match has a start timestamp and the timer has been started
    if (
      match.startTimestamp === undefined ||
      match.timerStartedTimestamp === null
    ) {
      throw new BadRequestError({
        message: `Timer has not been started for the match`
      });
    }

    // Calculate the time elapsed
    const currentTime = new Date();
    const elapsedMilliseconds =
      currentTime.getTime() - match.timerStartedTimestamp.getTime();

    // Reset the timer timestamp
    match.elapsedTime += elapsedMilliseconds;
    match.timerStartedTimestamp = null;
    await match.save();
  }

  public async addPointToMatchById(
    id: string,
    requestBody: AddPointRequest
  ): Promise<void> {
    const matchToUpdate = await MatchModel.findById(id);

    if (matchToUpdate === null) {
      throw new NotFoundError({
        message: `Match not found for ID: ${id}`
      });
    }

    if (matchToUpdate.winner !== undefined) {
      throw new BadRequestError({
        message: "Finished matches cannot be edited"
      });
    }

    const { pointType, pointColor } = requestBody;

    const newPoint: MatchPoint = {
      type: pointType,
      timestamp: new Date()
    };

    this.assignPoint(matchToUpdate, newPoint, pointColor);

    this.checkMatchOutcome(matchToUpdate);

    await matchToUpdate.save();
  }

  private assignPoint(
    match: Match,
    point: MatchPoint,
    pointColor: PlayerColor
  ): void {
    const [player1, player2] = match.players;
    const pointWinner = player1.color === pointColor ? player1 : player2;
    pointWinner.points.push(point);
  }

  private checkMatchOutcome(match: Match): void {
    const MAXIMUM_POINTS = 2;
    const [player1, player2] = match.players;
    let player1Points = 0;
    let player2Points = 0;

    player1.points.forEach((point: MatchPoint) => {
      if (point.type === "hansoku") {
        // In case of hansoku, the opponent recieves half a point.
        player2Points += 0.5;
      } else {
        // Otherwise give one point to the player.
        player1Points++;
      }
    });

    player2.points.forEach((point: MatchPoint) => {
      if (point.type === "hansoku") {
        player1Points += 0.5;
      } else {
        player2Points++;
      }
    });

    if (player1Points >= MAXIMUM_POINTS) {
      match.winner = player1.id;
      match.endTimestamp = new Date();
    } else if (player2Points >= MAXIMUM_POINTS) {
      match.winner = player2.id;
      match.endTimestamp = new Date();
    }
  }
}
