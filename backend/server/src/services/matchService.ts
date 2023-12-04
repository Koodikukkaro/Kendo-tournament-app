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
import { type Types } from "mongoose";
import { TournamentModel, TournamentType } from "../models/tournamentModel.js";

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
      admin: requestBody.admin,
      comment: requestBody.comment,
      officials: requestBody.officials
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

  public async startTimer(id: string): Promise<Match> {
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

    return await match.toObject();
  }

  public async stopTimer(id: string): Promise<Match> {
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

    return await match.toObject();
  }

  public async addPointToMatchById(
    id: string,
    requestBody: AddPointRequest
  ): Promise<Match> {
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

    const { pointType, pointColor } = requestBody;

    const newPoint: MatchPoint = {
      type: pointType,
      timestamp: new Date()
    };

    this.assignPoint(match, newPoint, pointColor);

    await this.checkMatchOutcome(match);

    await match.save();

    return await match.toObject();
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

  private async checkMatchOutcome(match: Match): Promise<void> {
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
      await this.createPlayoffSchedule(match.id, player1.id);
    } else if (player2Points >= MAXIMUM_POINTS) {
      match.winner = player2.id;
      match.endTimestamp = new Date();
      await this.createPlayoffSchedule(match.id, player2.id);
    }
  }

  private async createPlayoffSchedule(
    matchId: Types.ObjectId,
    winnerId: Types.ObjectId
  ): Promise<void> {
    const tournament = await TournamentModel.findOne({
      matchSchedule: matchId
    })
      .populate({
        path: "matchSchedule",
        model: "Match"
      })
      .exec();

    if (tournament?.tournamentType !== TournamentType.Playoff) {
      return;
    }

    const playedMatches = tournament.matchSchedule as unknown as Match[];

    // Find the current round from the match
    const currentMatch = playedMatches.find((match) =>
      match.id.equals(matchId)
    );
    if (currentMatch === null || currentMatch === undefined) {
      throw new NotFoundError({
        message: "Match not found in tournament schedule"
      });
    }
    let currentRound = currentMatch.tournamentRound;
    if (currentRound === undefined) {
      currentRound = 1;
    }
    const nextRound = currentRound + 1;

    // Filter for winners in the current round
    const winners = playedMatches
      .filter((match) => match.tournamentRound === currentRound && match.winner)
      .map((match) => match.winner)
      .filter((winner): winner is Types.ObjectId => winner != null);

    // Find eligible winners who don't have a match in the next round
    const eligibleWinners = winners.filter((winner) => {
      if (!winner) {
        return false;
      }
      return !playedMatches.some(
        (match) =>
          match.tournamentRound === nextRound &&
          match.players.some(
            (player) => player.id.toString() === winner.toString()
          )
      );
    });

    // Pair current winner with eligible winners for the next round
    for (const pairWithWinnerId of eligibleWinners) {
      if (pairWithWinnerId && !pairWithWinnerId.equals(winnerId)) {
        // Create a new match
        const newMatch = {
          players: [
            { id: winnerId, points: [], color: "red" },
            { id: pairWithWinnerId, points: [], color: "white" }
          ],
          type: "playoff",
          admin: null,
          elapsedTime: 0,
          timerStartedTimestamp: null,
          tournamentRound: nextRound
        };

        const matchDocuments = await MatchModel.create(newMatch);
        tournament.matchSchedule.push(matchDocuments.id);
      }
    }

    // Save the tournament if new matches were added
    if (eligibleWinners.length > 0) {
      await TournamentModel.findByIdAndUpdate(tournament._id, {
        matchSchedule: tournament.matchSchedule
      });
    }
  }
}
