import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function PlayerStat({ player, updateStat }) {
  const handleChange = (stat, value) => {
    updateStat(player.id, stat, value);
  };

  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{player.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {['points', 'assistance', 'blocks', 'bounce'].map(stat => (
          <div key={stat} className="flex justify-between items-center mb-2">
            <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}:</span>
            <div>
              <Button onClick={() => handleChange(stat, -1)}>-</Button>
              <span className="mx-2">{player[stat]}</span>
              <Button onClick={() => handleChange(stat, 1)}>+</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Team({ team, updateStat }) {
  const teamStats = team.reduce((acc, player) => {
    ['points', 'assistance', 'blocks', 'bounce'].forEach(stat => {
      acc[stat] = (acc[stat] || 0) + player[stat];
    });
    return acc;
  }, {});

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">{team[0].teamName}</h2>
      {team.map(player => <PlayerStat key={player.id} player={player} updateStat={updateStat} />)}
      <div className="mt-4">
        {Object.entries(teamStats).map(([stat, value]) => 
          <p key={stat}>{stat}: {value}</p>
        )}
      </div>
    </div>
  );
}

function MatchHistory({ matches, showMatch }) {
  return (
    <Accordion type="single" collapsible>
      {matches.map((match, index) => (
        <AccordionItem value={`match-${index}`} key={index}>
          <AccordionTrigger onClick={() => showMatch(match)}>
            {match.teamA[0].teamName} vs {match.teamB[0].teamName} - Winner: {match.winner}
          </AccordionTrigger>
          <AccordionContent>
            <p>Points: Team A: {match.teamAPoints}, Team B: {match.teamBPoints}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function App() {
  const [teamA, setTeamA] = useState([{id: 1, name: 'Player A1', teamName: 'Team A', points: 0, assistance: 0, blocks: 0, bounce: 0}, /* ... */]);
  const [teamB, setTeamB] = useState([{id: 4, name: 'Player B1', teamName: 'Team B', points: 0, assistance: 0, blocks: 0, bounce: 0}, /* ... */]);
  const [matches, setMatches] = useState([]);
  const [viewMatch, setViewMatch] = useState(null);

  useEffect(() => {
    const savedMatches = JSON.parse(localStorage.getItem('basketballMatches') || '[]');
    setMatches(savedMatches);
  }, []);

  const updateStat = (id, stat, value) => {
    const updateTeam = team => team.map(player => 
      player.id === id ? {...player, [stat]: Math.max(0, player[stat] + value)} : player
    );
    setTeamA(teamA => updateTeam(teamA));
    setTeamB(teamB => updateTeam(teamB));
  };

  const saveMatch = () => {
    const teamAPoints = teamA.reduce((sum, player) => sum + player.points, 0);
    const teamBPoints = teamB.reduce((sum, player) => sum + player.points, 0);
    const newMatch = {
      teamA, teamB, teamAPoints, teamBPoints,
      winner: teamAPoints > teamBPoints ? 'Team A' : 'Team B',
    };
    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
    localStorage.setItem('basketballMatches', JSON.stringify(updatedMatches));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between">
        <Team team={teamA} updateStat={updateStat} />
        <Team team={teamB} updateStat={updateStat} />
      </div>
      <Button onClick={saveMatch} className="mt-4 w-full">Save Match</Button>
      <h3 className="text-lg font-semibold mt-4">Match History</h3>
      <MatchHistory matches={matches} showMatch={setViewMatch} />
      {viewMatch && (
        <div className="mt-4">
          <h3>Match Details</h3>
          {/* Here you would display detailed stats of the match */}
        </div>
      )}
    </div>
  );
}