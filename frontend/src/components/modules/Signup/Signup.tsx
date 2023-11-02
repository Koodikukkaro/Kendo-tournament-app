import React from "react";
import "./signup.css";

const Signup: React.FC = () => {
  /* replace nulls with some fetch calls */
  const tournamentName = null;
  const startDate = null;
  const endDate = null;
  const playerName = null;
  const playerEmail = null;
  const playerClub = null;
  const playerRank = null;

  const handleClick = (): void => {
    /* go back to last page or submit sign up */
  };

  return (
    <div>
      <h1 className="header">Sign up for {tournamentName}</h1>
      <p className="subtext">You are signing up for {tournamentName}:</p>
      <p className="dates">
        {startDate} - {endDate}
      </p>
      <p className="moreinfo">
        Want more information on this tournament? <a href="url">Click here</a>
      </p>
      <br />
      <p className="subtext">The information you are signing up with:</p>
      <p className="playerinfo">
        Name: {playerName} <br />
        Email: {playerEmail} <br />
        <br />
        Club: {playerClub}
        <br />
        Dan-rank: {playerRank}
        <br />
      </p>
      <br />
      <div className="field">
        <button id="btnBack" onClick={handleClick}>
          Back
        </button>
        <button id="btnSignup" onClick={handleClick}>
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Signup;
