import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <>
      <h2>Riddle Game</h2>
      <div className="container home-page">
        <div className="button-group">
          <Link to="/play">
            <button className="primary-btn">Play</button>
          </Link>
          <Link to="/auth">
            <button className="secondary-btn">Login / Register</button>
          </Link>
          <Link to="/leaderboard">
            <button className="secondary-btn">Leaderboard</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
