import React from "react";
import { Link } from "react-router-dom";
import type { User } from "../types/types";

interface NavProps {
  currentUser: User | null;
  onLogout: () => void;
}

const Nav: React.FC<NavProps> = ({ currentUser, onLogout }) => {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/play">Play</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        {currentUser?.role === "admin" && (
          <Link to="/admin">Manage Riddles</Link>
        )}
        {!currentUser ? (
          <Link to="/auth">Login / Register</Link>
        ) : (
          <>
            <span>
              Hello, {currentUser.username} ({currentUser.role})
            </span>
            <button onClick={onLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Nav;
