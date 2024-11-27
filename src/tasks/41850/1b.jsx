import React, { useState, useEffect } from "react";
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
      <div className="grid grid-cols-2 gap-2">
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

const TeamStats = ({ team, updateStat }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{team.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {team.players.map((player, index) => (
          <PlayerStats
            key={index}
            player={player}
            updateStat={(value, stat) => updateStat(team.name, index, value, stat)}
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

const MatchHistory = ({ matches }) => (
  <Accordion type="single" collapsible className="w-full">
    {matches.map((match, index) => (
      <AccordionItem key={index} value={`item-${index}`}>
        <AccordionTrigger>
          Match {index + 1}: {match.team1.name} vs {match.team2.name}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex justify-between">
            <div className={match.team1.totalPoints > match.team2.totalPoints ? "font-bold" : ""}>
              {match.team1.name}: {match.team1.totalPoints} points
            </div>
            <div className={match.team2.totalPoints > match.team1.totalPoints ? "font-bold" : ""}>
              {match.team2.name}: {match.team2.totalPoints} points
            </div>
          </div>
          {/* Add more detailed stats here if needed */}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default function App() {
  const [team1, setTeam1] = useState({ ...initialTeamStats, name: "Team 1" });
  const [team2, setTeam2] = useState({ ...initialTeamStats, name: "Team 2" });
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const savedMatches = localStorage.getItem("basketballMatches");
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }
  }, []);

  const updateStat = (teamName, playerIndex, value, stat) => {
    const updateTeam = (team) => {
      const updatedPlayers = [...team.players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        [stat]: Math.max(0, updatedPlayers[playerIndex][stat] + value),
      };
      return { ...team, players: updatedPlayers };
    };

    if (teamName === "Team 1") {
      setTeam1(updateTeam(team1));
    } else {
      setTeam2(updateTeam(team2));
    }
  };

  const saveMatch = () => {
    const calculateTotalPoints = (team) =>
      team.players.reduce((sum, player) => sum + player.points, 0);

    const newMatch = {
      team1: { name: team1.name, totalPoints: calculateTotalPoints(team1) },
      team2: { name: team2.name, totalPoints: calculateTotalPoints(team2) },
      // Add more detailed stats here if needed
    };

    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
    localStorage.setItem("basketballMatches", JSON.stringify(updatedMatches));

    // Reset the game
    setTeam1({ ...initialTeamStats, name: "Team 1" });
    setTeam2({ ...initialTeamStats, name: "Team 2" });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">3x3 Basketball Match Statistics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TeamStats team={team1} updateStat={updateStat} />
        <TeamStats team={team2} updateStat={updateStat} />
      </div>
      <Button className="w-full my-4" onClick={saveMatch}>
        Save Match
      </Button>
      <h2 className="text-xl font-semibold mb-2">Match History</h2>
      <MatchHistory matches={matches} />
    </div>
  );
}