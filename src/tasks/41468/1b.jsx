import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const players = [
  { name: "Alice", attack: 4, defense: 3, longDistance: 5 },
  { name: "Bob", attack: 3, defense: 5, longDistance: 2 },
  { name: "Charlie", attack: 5, defense: 2, longDistance: 4 },
  { name: "Diana", attack: 2, defense: 4, longDistance: 3 },
  { name: "Ethan", attack: 4, defense: 4, longDistance: 4 },
  { name: "Fiona", attack: 3, defense: 3, longDistance: 5 },
  { name: "George", attack: 5, defense: 3, longDistance: 3 },
  { name: "Hannah", attack: 2, defense: 5, longDistance: 4 },
  { name: "Ian", attack: 4, defense: 2, longDistance: 5 },
  { name: "Julia", attack: 3, defense: 4, longDistance: 4 },
  { name: "Kevin", attack: 5, defense: 5, longDistance: 2 },
  { name: "Laura", attack: 4, defense: 3, longDistance: 4 },
];

const PlayerCard = ({ player, onSelect, isSelected }) => (
  <Card
    className={`cursor-pointer ${
      isSelected ? "border-2 border-blue-500" : ""
    }`}
    onClick={onSelect}
  >
    <CardHeader>
      <CardTitle>{player.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Attack: {player.attack}</p>
      <p>Defense: {player.defense}</p>
      <p>Long Distance: {player.longDistance}</p>
    </CardContent>
  </Card>
);

const TeamList = ({ teams, onBattle }) => (
  <div className="mt-4">
    <h2 className="text-xl font-bold mb-2">Teams</h2>
    {teams.map((team, index) => (
      <div key={index} className="mb-2">
        <h3 className="font-semibold">{team.name}</h3>
        <ul>
          {team.players.map((player, playerIndex) => (
            <li key={playerIndex}>{player.name}</li>
          ))}
        </ul>
        <Button onClick={() => onBattle(team)} className="mt-2">
          Battle
        </Button>
      </div>
    ))}
  </div>
);

const BattleHistory = ({ history }) => (
  <div className="mt-4">
    <h2 className="text-xl font-bold mb-2">Battle History</h2>
    {history.map((battle, index) => (
      <div key={index} className="mb-2">
        <p>
          {battle.team1.name} ({battle.team1Wins}) vs {battle.team2.name} (
          {battle.team2Wins})
        </p>
        <p className="font-semibold">
          Winner:{" "}
          <span className="text-green-500">
            {battle.winner ? battle.winner.name : "Draw"}
          </span>
        </p>
      </div>
    ))}
  </div>
);

const BattleDialog = ({ isOpen, onClose, battleResult }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Battle Result</DialogTitle>
      </DialogHeader>
      {battleResult && (
        <div>
          <h3 className="font-semibold mb-2">
            {battleResult.team1.name} vs {battleResult.team2.name}
          </h3>
          {battleResult.comparisons.map((comparison, index) => (
            <div key={index} className="mb-2">
              <p>
                {comparison.player1.name} vs {comparison.player2.name}:
              </p>
              <ul>
                {Object.entries(comparison.results).map(([skill, winner]) => (
                  <li key={skill}>
                    {skill}: {winner}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="font-semibold mt-4">
            Result: {battleResult.team1.name} ({battleResult.team1Wins}) -{" "}
            {battleResult.team2.name} ({battleResult.team2Wins})
          </p>
          <p className="font-semibold text-green-500">
            Winner:{" "}
            {battleResult.winner ? battleResult.winner.name : "Draw"}
          </p>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default function App() {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState([]);
  const [battleTeams, setBattleTeams] = useState([]);
  const [battleHistory, setBattleHistory] = useState([]);
  const [showBattleDialog, setShowBattleDialog] = useState(false);
  const [battleResult, setBattleResult] = useState(null);

  useEffect(() => {
    if (battleTeams.length === 2) {
      const result = simulateBattle(battleTeams[0], battleTeams[1]);
      setBattleResult(result);
      setBattleHistory((prev) => [...prev, result]);
      setShowBattleDialog(true);
      setBattleTeams([]);
    }
  }, [battleTeams]);

  const handlePlayerSelect = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
    } else if (selectedPlayers.length < 3) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleCreateTeam = () => {
    if (selectedPlayers.length === 3 && teamName) {
      setTeams([...teams, { name: teamName, players: selectedPlayers }]);
      setSelectedPlayers([]);
      setTeamName("");
    }
  };

  const handleBattle = (team) => {
    setBattleTeams((prev) => [...prev, team]);
  };

  const simulateBattle = (team1, team2) => {
    let team1Wins = 0;
    let team2Wins = 0;
    const comparisons = team1.players.map((player1, index) => {
      const player2 = team2.players[index];
      const results = {
        attack: player1.attack > player2.attack ? player1.name : player2.name,
        defense: player1.defense > player2.defense ? player1.name : player2.name,
        longDistance:
          player1.longDistance > player2.longDistance
            ? player1.name
            : player2.name,
      };
      Object.values(results).forEach((winner) => {
        if (winner === player1.name) team1Wins++;
        else team2Wins++;
      });
      return { player1, player2, results };
    });

    const winner = team1Wins > team2Wins ? team1 : team2Wins > team1Wins ? team2 : null;

    return { team1, team2, comparisons, team1Wins, team2Wins, winner };
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">3x3 Battle Bet</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {players.map((player) => (
          <PlayerCard
            key={player.name}
            player={player}
            onSelect={() => handlePlayerSelect(player)}
            isSelected={selectedPlayers.includes(player)}
          />
        ))}
      </div>
      <div className="mt-4">
        <Input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleCreateTeam} disabled={selectedPlayers.length !== 3 || !teamName}>
          Create Team
        </Button>
      </div>
      <TeamList teams={teams} onBattle={handleBattle} />
      <BattleHistory history={battleHistory} />
      <BattleDialog
        isOpen={showBattleDialog}
        onClose={() => setShowBattleDialog(false)}
        battleResult={battleResult}
      />
    </div>
  );
}