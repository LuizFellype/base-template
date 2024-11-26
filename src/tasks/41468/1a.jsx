import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const generateRandomPlayer = () => ({
  id: Math.random().toString(36).substr(2, 9),
  name: `Player ${Math.floor(Math.random() * 100)}`,
  attack: Math.floor(Math.random() * 6),
  defense: Math.floor(Math.random() * 6),
  longDistance: Math.floor(Math.random() * 6),
});

const PlayerCard = ({ player, onSelect, selected }) => (
  <Card className={`mb-4 ${selected ? 'border-2 border-blue-500' : ''}`}>
    <CardHeader>
      <CardTitle>{player.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Attack: {player.attack}</p>
      <p>Defense: {player.defense}</p>
      <p>Long Distance: {player.longDistance}</p>
    </CardContent>
    <CardFooter>
      <Button onClick={() => onSelect(player)}>{selected ? 'Deselect' : 'Select'}</Button>
    </CardFooter>
  </Card>
);

function TeamList({ teams, onBattle }) {
  return (
    <div className="mt-8">
      {teams.map((team, index) => (
        <div key={index} className="mb-2 flex items-center">
          <span className="mr-2">{team.name}:</span>
          {team.players.map(p => <span key={p.id} className="ml-1">{p.name}</span>)}
          {index < teams.length - 1 && <Button onClick={() => onBattle(team, teams[index + 1])} className="ml-2">Battle</Button>}
        </div>
      ))}
    </div>
  );
}

function BattleDialog({ open, onClose, team1, team2, result }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Battle Result</DialogTitle>
        </DialogHeader>
        <div>
          {result.map((r, idx) => (
            <div key={idx}>
              <p>{r.winner ? `Winner: ${r.winner.name}` : 'Draw'} - {r.skill}</p>
            </div>
          ))}
          <p className="font-bold mt-2">
            {team1.name} Wins: {result.filter(r => r.winner === team1.players[r.playerIndex]).length} | 
            {team2.name} Wins: {result.filter(r => r.winner === team2.players[r.playerIndex]).length}
          </p>
          <p className="font-bold">Winner: {result.filter(r => r.winner === team1.players[r.playerIndex]).length > result.filter(r => r.winner === team2.players[r.playerIndex]).length ? team1.name : team2.name}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [players, setPlayers] = useState(Array.from({length: 12}, generateRandomPlayer));
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [battleResult, setBattleResult] = useState(null);
  const [battleHistory, setBattleHistory] = useState([]);

  const handlePlayerSelect = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== player));
    } else if (selectedPlayers.length < 3) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const createTeam = () => {
    if (selectedPlayers.length === 3 && teamName) {
      setTeams([...teams, { name: teamName, players: selectedPlayers }]);
      setSelectedPlayers([]);
      setTeamName('');
    }
  };

  const battleTeams = (team1, team2) => {
    const result = team1.players.map((player, idx) => {
      const opponent = team2.players[idx];
      let winner = null;
      if (player.attack > opponent.attack) winner = player;
      else if (player.attack < opponent.attack) winner = opponent;
      return { skill: 'Attack', winner, playerIndex: idx };
    });
    setBattleResult(result);
    setBattleHistory([...battleHistory, { team1: team1.name, team2: team2.name, result }]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} onSelect={handlePlayerSelect} selected={selectedPlayers.includes(player)} />
        ))}
      </div>
      <div className="mt-4">
        <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" className="mb-2" />
        <Button onClick={createTeam} disabled={selectedPlayers.length !== 3 || !teamName}>Create Team</Button>
      </div>
      <TeamList teams={teams} onBattle={battleTeams} />
      <BattleDialog open={!!battleResult} onClose={() => setBattleResult(null)} team1={teams[teams.length - 2]} team2={teams[teams.length - 1]} result={battleResult || []} />
      <div className="mt-8">
        <h2 className="text-lg font-bold">Battle History</h2>
        {battleHistory.map((battle, idx) => (
          <div key={idx} className="mt-2">
            <p>{battle.team1} vs {battle.team2} - Winner: <span className={battle.result.filter(r => r.winner === teams.find(t => t.name === battle.team1).players[r.playerIndex]).length > battle.result.filter(r => r.winner === teams.find(t => t.name === battle.team2).players[r.playerIndex]).length ? 'font-bold text-green-500' : 'font-bold text-red-500'}>{battle.result.filter(r => r.winner === teams.find(t => t.name === battle.team1).players[r.playerIndex]).length > battle.result.filter(r => r.winner === teams.find(t => t.name === battle.team2).players[r.playerIndex]).length ? battle.team1 : battle.team2}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}