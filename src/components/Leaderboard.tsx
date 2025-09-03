import React, { useState, useEffect } from "react";
import { loadPlayers } from "../api/riddleService";
import type { Player } from "../types/types";

const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const data = await loadPlayers();
      if (data) {
        setPlayers(
          data.sort((a, b) => {
            const timeA = Object.values(a.times).reduce(
              (sum, cur) => sum + cur,
              0
            );
            const timeB = Object.values(b.times).reduce(
              (sum, cur) => sum + cur,
              0
            );
            return timeA - timeB;
          })
        );
      } else {
        setError("Error loading leaderboard.");
      }
      setLoading(false);
    };
    fetchPlayers();
  }, []);

  if (loading) return <div className="container">Loading leaderboard...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container leaderboard-page">
      <h2>Leaderboard</h2>

      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Total Time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>
                {Object.values(player.times)
                  .reduce((sum, cur) => sum + cur, 0)
                  .toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
