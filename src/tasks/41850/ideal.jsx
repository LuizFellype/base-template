import React, { useState, memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const initialPlayerStats = {
  points: 0,
  assists: 0,
  blocks: 0,
  rebounds: 0,
};

const initialTeamStats = {
  name: "",
  players: [
    { name: "Player 1", ...initialPlayerStats },
    { name: "Player 2", ...initialPlayerStats },
    { name: "Player 3", ...initialPlayerStats },
  ],
  totalPoints: 0,
  totalAssists: 0,
  totalBlocks: 0,
  totalRebounds: 0,
};

const StatButton = ({ onClick, children }) => (
  <Button
    className="px-2 py-1 text-xs"
    variant="outline"
    onClick={onClick}
  >
    {children}
  </Button>
);

const PlayerStats = ({ player, updateStat }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg">{player.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(player).map(([stat, value]) => {
          if (stat === "name") return null;
          return (
            <div key={stat} className="flex flex-col items-center">
              <span className="font-semibold">{stat.charAt(0).toUpperCase() + stat.slice(1)}: {value}</span>
              <div className="flex space-x-2 mt-1">
                <StatButton onClick={() => updateStat(1, stat)}>+1</StatButton>
                <StatButton onClick={() => updateStat(-1, stat)}>-1</StatButton>
                {stat === "points" && (
                  <StatButton onClick={() => updateStat(2, stat)}>+2</StatButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

const MatchDetails = ({ team }) => {
    return (<div className="grid grid-cols-2">
        <span>Points: {team.totalPoints || 0}.</span>
        <span>Assistances: {team.totalAssists || 0}.</span>
        <span>Blocks: {team.totalBlocks || 0}.</span>
        <span>Rebounds: {team.totalRebounds || 0}.</span>
        {/* Add more detailed stats here if needed */}
    </div>)
}

const TeamStats = memo(({ team, onUpdateStat }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{team.name}</CardTitle>
      <MatchDetails team={team} />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {team.players.map((player, index) => (
          <PlayerStats
            key={index}
            player={player}
            updateStat={(value, stat) => onUpdateStat(index, value, stat)}
          />
        ))}
      </div>
    </CardContent>
  </Card>
));

const MatchHistory = memo(({ matches }) => (
  <Accordion type="single" collapsible className="w-full">
    {matches.map((match, index) => (
      <AccordionItem key={index} value={`item-${index}`}>
        <AccordionTrigger className="font-normal" >
        Match {index + 1}: 
        
        <span className={match.team1.totalPoints > match.team2.totalPoints ? "font-bold" : ""}>
            {match.team1.name} ({match.team1.totalPoints})
        </span> 
        
        vs 
        
        <span className={match.team2.totalPoints > match.team1.totalPoints ? "font-bold" : ""}>
         ({match.team2.totalPoints}) {match.team2.name} 
        </span>
        </AccordionTrigger>

        <AccordionContent>
          <div className="flex justify-between">
            <MatchDetails team={match.team1} />
            <MatchDetails team={match.team2} />
          </div>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
));

const calculateTotalStats = (team) => (statsKey) =>
    team.players.reduce((sum, player) => sum + player[statsKey], 0) || 0;


const updateStat = (team, playerIndex, value, stat) => {
    const updatedPlayers = [...team.players];
    updatedPlayers[playerIndex] = {
    ...updatedPlayers[playerIndex],
    [stat]: Math.max(0, updatedPlayers[playerIndex][stat] + value),
    };

    const teamUpdated = {...team, players: updatedPlayers }
    const totalTeamStatics = calculateTotalStats(teamUpdated)

    return { 
        ...teamUpdated,
        totalPoints: totalTeamStatics('points'), 
        totalAssists: totalTeamStatics('assists'), 
        totalBlocks: totalTeamStatics('blocks'), 
        totalRebounds: totalTeamStatics('rebounds'), 
        // Add more detailed stats here if needed
    };
};

const initTeamState = (name) => {
    return {
        ...initialTeamStats,
        name
    }
}
export default function App() {
  const [team1, setTeam1] = useState(initTeamState('Team 1'));
  const [team2, setTeam2] = useState(initTeamState('Team 2'));
  const [matches, setMatches] = useState([]);

  const updateTeam1Stat = useCallback((playerIndex, value, stat) => {
    setTeam1(updateStat(team1, playerIndex, value, stat))
  }, [team1])

  const updateTeam2Stat = useCallback((playerIndex, value, stat) => {
    setTeam2(updateStat(team2, playerIndex, value, stat))
  }, [team2])

  const saveMatch = () => {
    const newMatch = {
      team1,
      team2,
    };

    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);

    // Reset the game
    setTeam1({ ...initialTeamStats, name: "Team 1" });
    setTeam2({ ...initialTeamStats, name: "Team 2" });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">3x3 Basketball Match Statistics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TeamStats team={team1} onUpdateStat={updateTeam1Stat} />
        <TeamStats team={team2} onUpdateStat={updateTeam2Stat} />
      </div>
      <Button className="w-full my-4" onClick={saveMatch}>
        Save Match
      </Button>
      <h2 className="text-xl font-semibold mb-2">Match History</h2>
      <MatchHistory matches={matches} />
    </div>
  );
}