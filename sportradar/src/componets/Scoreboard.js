import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';

export default function Scoreboard() {
  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({ homeTeam: '', awayTeam: '' });

  const startMatch = () => {
    if (newMatch.homeTeam && newMatch.awayTeam) {
      setMatches([
        ...matches,
        {
          ...newMatch,
          homeScore: 0,
          awayScore: 0,
          startTime: new Date(),
          id: Date.now()
        }
      ]);
      setNewMatch({ homeTeam: '', awayTeam: '' });
    }
  };

  const updateScore = (id, homeScore, awayScore) => {
    setMatches(matches.map(match => 
      match.id === id 
        ? { ...match, homeScore: parseInt(homeScore), awayScore: parseInt(awayScore) }
        : match
    ));
  };

  const finishMatch = (id) => {
    setMatches(matches.filter(match => match.id !== id));
  };

  const getSortedMatches = () => {
    return [...matches].sort((a, b) => {
      const totalScoreA = a.homeScore + a.awayScore;
      const totalScoreB = b.homeScore + b.awayScore;
      if (totalScoreB !== totalScoreA) {
        return totalScoreB - totalScoreA;
      }
      return b.startTime - a.startTime;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Live Football World Cup Scoreboard</h1>
      
      {/* New Match Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Start New Match</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Home Team"
            value={newMatch.homeTeam}
            onChange={(e) => setNewMatch({ ...newMatch, homeTeam: e.target.value })}
            className="flex-1 border rounded p-2"
          />
          <input
            type="text"
            placeholder="Away Team"
            value={newMatch.awayTeam}
            onChange={(e) => setNewMatch({ ...newMatch, awayTeam: e.target.value })}
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={startMatch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Start Match
          </button>
        </div>
      </div>

      {/* Live Matches */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Live Matches</h2>
        {getSortedMatches().map(match => (
          <div key={match.id} className="border rounded-lg p-4 mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                <div className="text-right">{match.homeTeam}</div>
                <div className="flex justify-center gap-4">
                  <input
                    type="number"
                    value={match.homeScore}
                    onChange={(e) => updateScore(match.id, e.target.value, match.awayScore)}
                    className="w-16 text-center border rounded p-1"
                    min="0"
                  />
                  <span className="font-bold">-</span>
                  <input
                    type="number"
                    value={match.awayScore}
                    onChange={(e) => updateScore(match.id, match.homeScore, e.target.value)}
                    className="w-16 text-center border rounded p-1"
                    min="0"
                  />
                </div>
                <div className="text-left">{match.awayTeam}</div>
              </div>
              <button
                onClick={() => finishMatch(match.id)}
                className="ml-4 text-red-500 hover:text-red-600"
                title="Finish Match"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-sm text-gray-500 text-center">
              Total Score: {match.homeScore + match.awayScore}
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No matches in progress
          </div>
        )}
      </div>
    </div>
  );
}