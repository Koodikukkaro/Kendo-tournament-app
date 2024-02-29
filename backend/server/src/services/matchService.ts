import MatchModel, {
  type MatchPlayer,
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
import { Types } from "mongoose";
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
      comment: requestBody.comment,
      officials: requestBody.officials,
      timeKeeper: requestBody.timeKeeper,
      pointMaker: requestBody.pointMaker
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
    const MATCH_TIME = 300;

    if (match === null) {
      throw new NotFoundError({
        message: `Match not found for ID: ${id}`
      });
    }

    if (match.winner !== undefined || match.elapsedTime === MATCH_TIME) {
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
    match.isTimerOn = true;

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

    match.elapsedTime += elapsedMilliseconds;
    // Reset the timer timestamp
    match.timerStartedTimestamp = null;
    // Mark the timer to be off
    match.isTimerOn = false;
    await match.save();

    return await match.toObject();
  }

  // Every time adding point is done in frontend, this function handles it
  // It adds the point to a match, adds the point to a player,
  // checks if the match is finished and saves the match
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

  public async addTimeKeeperToMatch(
    matchId: string,
    timeKeeperId: string
  ): Promise<Match> {
    const match = await MatchModel.findById(matchId).exec();

    if (match === null) {
      throw new NotFoundError({
        message: `Match not found for ID: ${matchId}`
      });
    }

    if (match.winner !== undefined) {
      throw new BadRequestError({
        message: "Finished matches cannot be edited"
      });
    }

    // Set the time keeper
    match.timeKeeper = new Types.ObjectId(timeKeeperId);

    await match.save();

    return await match.toObject();
  }

  public async addPointMakerToMatch(
    matchId: string,
    pointMakerId: string
  ): Promise<Match> {
    const match = await MatchModel.findById(matchId).exec();

    if (match === null) {
      throw new NotFoundError({
        message: `Match not found for ID: ${matchId}`
      });
    }

    if (match.winner !== undefined) {
      throw new BadRequestError({
        message: "Finished matches cannot be edited"
      });
    }

    // Set the point maker
    match.pointMaker = new Types.ObjectId(pointMakerId);

    await match.save();

    return await match.toObject();
  }

  public async deleteTimeKeeperFromMatch(matchId: string): Promise<Match> {
    const match = await MatchModel.findById(matchId).exec();

    if (match === null) {
      throw new NotFoundError({
        message: `Match not found for ID: ${matchId}`
      });
    }

    if (match.winner !== undefined) {
      throw new BadRequestError({
        message: "Finished matches cannot be edited"
      });
    }

    // Remove time keeper's id
    match.timeKeeper = undefined;

    await match.save();

    return await match.toObject();
  }

  public async deletePointMakerFromMatch(matchId: string): Promise<Match> {
    const match = await MatchModel.findById(matchId).exec();

    if (match === null) {
      throw new NotFoundError({
        message: `Match not found for ID: ${matchId}`
      });
    }

    if (match.winner !== undefined) {
      throw new BadRequestError({
        message: "Finished matches cannot be edited"
      });
    }

    // Remove point maker's id
    match.pointMaker = undefined;

    await match.save();

    return await match.toObject();
  }

  // Check if there is a tie or an overtime whne time has ended
  public async checkForTie(id: string): Promise<void> {
    const match = await MatchModel.findById(id).exec();

    if (match !== null) {
      const player1: MatchPlayer = match.players[0] as MatchPlayer;
      const player2: MatchPlayer = match.players[1] as MatchPlayer;
      const { player1CalculatedScore, player2CalculatedScore } =
        this.calculateScore(player1.points, player2.points);

      // When time ends, the player with more points wins
      // (rounded down because one hansoku doesn't count)
      if (
        Math.floor(player1CalculatedScore) > Math.floor(player2CalculatedScore)
      ) {
        match.winner = player1.id;
        match.endTimestamp = new Date();
        if (match.type === "playoff") {
          await this.createPlayoffSchedule(match.id, player1.id);
        }
      } else if (
        Math.floor(player2CalculatedScore) > Math.floor(player1CalculatedScore)
      ) {
        match.winner = player2.id;
        match.endTimestamp = new Date();
        if (match.type === "playoff") {
          await this.createPlayoffSchedule(match.id, player2.id);
        }
      }

      // If the points are the same, it's a tie (in round robin)
      else if (match.type === "group") {
        match.endTimestamp = new Date();
      }

      // If it's a playoff, an overtime will start
      // TODO: Handling this
      else if (match.type === "playoff") {
        console.log("Overtime");
      }
      match.player1Score = Math.floor(player1CalculatedScore);
      match.player2Score = Math.floor(player2CalculatedScore);

      await match.save();
    }
  }

  private async checkMatchOutcome(match: Match): Promise<void> {
    const MAXIMUM_POINTS = 2;
    const player1: MatchPlayer = match.players[0] as MatchPlayer;
    const player2: MatchPlayer = match.players[1] as MatchPlayer;
    const { player1CalculatedScore, player2CalculatedScore } =
      this.calculateScore(player1.points, player2.points);

    // Check if player 1 or 2 has 2 points and wins
    if (player1CalculatedScore >= MAXIMUM_POINTS) {
      match.winner = player1.id;
      match.endTimestamp = new Date();
      await this.createPlayoffSchedule(match.id, player1.id);
    } else if (player2CalculatedScore >= MAXIMUM_POINTS) {
      match.winner = player2.id;
      match.endTimestamp = new Date();
      await this.createPlayoffSchedule(match.id, player2.id);
    }

    match.player1Score = Math.floor(player1CalculatedScore);
    match.player2Score = Math.floor(player2CalculatedScore);
  }

  private calculateScore(
    player1Points: MatchPoint[],
    player2Points: MatchPoint[]
  ): { player1CalculatedScore: number; player2CalculatedScore: number } {
    let player1CalculatedScore = 0;
    let player2CalculatedScore = 0;

    player1Points.forEach((point: MatchPoint) => {
      if (point.type === "hansoku") {
        player2CalculatedScore += 0.5;
      } else {
        player1CalculatedScore++;
      }
    });

    player2Points.forEach((point: MatchPoint) => {
      if (point.type === "hansoku") {
        player1CalculatedScore += 0.5;
      } else {
        player2CalculatedScore++;
      }
    });

    return { player1CalculatedScore, player2CalculatedScore };
  }

  // Add assigned point to the correct player
  private assignPoint(
    match: Match,
    point: MatchPoint,
    pointColor: PlayerColor
  ): void {
    const player1: MatchPlayer = match.players[0] as MatchPlayer;
    const player2: MatchPlayer = match.players[1] as MatchPlayer;
    const pointWinner = player1.color === pointColor ? player1 : player2;
    pointWinner.points.push(point);
  }

  private async createPlayoffSchedule(
    matchId: Types.ObjectId,
    winnerId: Types.ObjectId
  ): Promise<void> {
    const tournament = await TournamentModel.findOne({
      matchSchedule: matchId
    })
      .populate<{
        matchSchedule: Match[];
      }>({
        path: "matchSchedule",
        model: "Match"
      })
      .exec();

    if (tournament?.type !== TournamentType.Playoff) {
      return;
    }

    const playedMatches = tournament.matchSchedule;

    const currentMatch = playedMatches.find(
      (match) => match.id.toString() === matchId.toString()
    );
    if (currentMatch === null || currentMatch === undefined) {
      throw new NotFoundError({
        message: "Match not found in tournament schedule"
      });
    }
    const currentRound = currentMatch.tournamentRound;
    const nextRound = currentRound + 1;

    const winners = playedMatches
      .filter((match) => match.tournamentRound === currentRound && match.winner)
      .map((match) => match.winner)
      .filter((winner): winner is Types.ObjectId => winner != null);

    // Find eligible winners who don't have a match in the next round
    const eligibleWinners = winners.filter((winner) => {
      if (winner === null || winner === undefined) {
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
      if (
        pairWithWinnerId !== null &&
        pairWithWinnerId !== undefined &&
        !pairWithWinnerId.equals(winnerId)
      ) {
        // Create a new match.
        const newMatch = {
          players: [
            { id: winnerId, points: [], color: "white" },
            { id: pairWithWinnerId, points: [], color: "red" }
          ],
          type: "playoff",
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
      await tournament.save();
    }
  }
}
