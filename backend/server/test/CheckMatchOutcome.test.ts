import { expect } from 'chai';
import { MatchService } from '../src/services/matchService'; 
import { Match, MatchPlayer, MatchPoint } from '../src/models/matchModel'; 
import { Types } from "mongoose";


describe('checkMatchOutcome', () => {
  it('should declare player 1 as winner when player 1 gets MAXIMUM_POINTS', async () => {
    const p1ObjectId = new Types.ObjectId();
    const p2ObjectId = new Types.ObjectId();
    const MatchObjectId = new Types.ObjectId();
    const match: Match = {
        players: [
            { id: p1ObjectId, points: [{ type: 'men' }, { type: 'do' }], color: 'red' } as MatchPlayer,
            { id: p2ObjectId, points: [], color: 'white' } as MatchPlayer,
        ],
        elapsedTime: 0,
        id: MatchObjectId,
        timerStartedTimestamp: null,
        type: 'group',
        tournamentId: new Types.ObjectId,
        officials: [],
        tournamentRound: 0
    };

    MatchService.checkMatchOutcome(match);

    expect(match.winner).to.equal(1);
    expect(match.endTimestamp).to.be.an.instanceOf(Date);
    expect(match.elapsedTime).to.be.above(0);
    // Check if timer stops?
  });

  it('should end the game when elapsedTime is MATCH_TIME', async () => {
    const p1ObjectId = new Types.ObjectId();
    const p2ObjectId = new Types.ObjectId();
    const MatchObjectId = new Types.ObjectId();
    const match: Match = {
        players: [
            { id: p1ObjectId, points: [{ type: 'men' }], color: 'red' } as MatchPlayer,
            { id: p2ObjectId, points: [{ type: 'do' }], color: 'white' } as MatchPlayer,
        ],
        elapsedTime: 300,
        id: MatchObjectId,
        timerStartedTimestamp: null,
        type: 'group',
        tournamentId: new Types.ObjectId,
        officials: [],
        tournamentRound: 0
    };

      MatchService.checkMatchOutcome(match);
      expect(match.endTimestamp).to.be.an.instanceOf(Date);
  })
  
});
