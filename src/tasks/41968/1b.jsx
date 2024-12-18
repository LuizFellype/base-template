import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const usePlayerSelection = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");

  const addPlayer = useCallback(() => {
    if (newPlayer && !players.includes(newPlayer)) {
      setPlayers([...players, newPlayer]);
      setNewPlayer("");
    }
  }, [newPlayer, players]);

  const selectPlayer = useCallback((player) => {
    if (selectedPlayers.length < 2 && !selectedPlayers.includes(player)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  }, [selectedPlayers]);

  return { players, selectedPlayers, newPlayer, setNewPlayer, addPlayer, selectPlayer };
};

const useGameLogic = (selectedPlayers) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [winner, setWinner] = useState(null);

  const checkWinner = useCallback((board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
      [0, 4, 8], [2, 4, 6] // Diagonal
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.every(cell => cell) ? 'Tie' : null;
  }, []);

  const handleCellClick = useCallback((index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = selectedPlayers[currentPlayer][0].toUpperCase();
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(1 - currentPlayer);
    }
  }, [board, currentPlayer, selectedPlayers, winner, checkWinner]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(0);
    setWinner(null);
  }, []);

  return { board, currentPlayer, winner, handleCellClick, resetGame };
};

const useMatchHistory = () => {
  const [matches, setMatches] = useState([]);

  const saveMatch = useCallback((players, board, winner) => {
    setMatches([...matches, { players, board, winner }]);
  }, [matches]);

  return { matches, saveMatch };
};

const PlayerSelection = ({ players, selectedPlayers, newPlayer, setNewPlayer, addPlayer, selectPlayer }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Player Selection</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex mb-2">
        <Input
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Enter player name"
          className="mr-2"
        />
        <Button onClick={addPlayer}>Add Player</Button>
      </div>
      <div className="flex flex-wrap">
        {players.map((player) => (
          <Button
            key={player}
            onClick={() => selectPlayer(player)}
            disabled={selectedPlayers.includes(player)}
            className="m-1"
          >
            {player}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

const GameBoard = ({ board, handleCellClick }) => (
  <div className="grid grid-cols-3 gap-2 mb-4">
    {board.map((cell, index) => (
      <Button
        key={index}
        onClick={() => handleCellClick(index)}
        className="h-16 text-2xl font-bold"
      >
        {cell}
      </Button>
    ))}
  </div>
);

const MatchHistory = ({ matches }) => (
  <Accordion type="single" collapsible className="w-full">
    {matches.map((match, index) => (
      <AccordionItem key={index} value={`item-${index}`}>
        <AccordionTrigger>
          {match.players[0]} vs {match.players[1]} - Winner: {match.winner === 'Tie' ? 'Tie' : match.players[match.winner === match.players[0][0] ? 0 : 1]}
        </AccordionTrigger>
        <AccordionContent>
          <ReplayBoard initialBoard={match.board} />
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

const ReplayBoard = ({ initialBoard }) => {
  const [replayBoard, setReplayBoard] = useState(Array(9).fill(null));
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < 9 && initialBoard[step]) {
      const timer = setTimeout(() => {
        setReplayBoard(prev => {
          const newBoard = [...prev];
          newBoard[step] = initialBoard[step];
          return newBoard;
        });
        setStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, initialBoard]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {replayBoard.map((cell, index) => (
        <div key={index} className="h-16 border flex items-center justify-center text-2xl font-bold">
          {cell}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const { players, selectedPlayers, newPlayer, setNewPlayer, addPlayer, selectPlayer } = usePlayerSelection();
  const { board, currentPlayer, winner, handleCellClick, resetGame } = useGameLogic(selectedPlayers);
  const { matches, saveMatch } = useMatchHistory();

  const handleSaveMatch = useCallback(() => {
    if (winner) {
      saveMatch(selectedPlayers, board, winner);
      resetGame();
    }
  }, [winner, selectedPlayers, board, saveMatch, resetGame]);

  const gameStatus = useMemo(() => {
    if (winner === 'Tie') return "It's a tie!";
    if (winner) return `${selectedPlayers[selectedPlayers[0][0] === winner ? 0 : 1]} wins!`;
    return `${selectedPlayers[currentPlayer]}'s turn`;
  }, [winner, selectedPlayers, currentPlayer]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Tic Tac Toe</h1>
      <PlayerSelection
        players={players}
        selectedPlayers={selectedPlayers}
        newPlayer={newPlayer}
        setNewPlayer={setNewPlayer}
        addPlayer={addPlayer}
        selectPlayer={selectPlayer}
      />
      {selectedPlayers.length === 2 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{gameStatus}</CardTitle>
          </CardHeader>
          <CardContent>
            <GameBoard board={board} handleCellClick={handleCellClick} />
            <Button onClick={handleSaveMatch} disabled={!winner}>Save Match</Button>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <MatchHistory matches={matches} />
        </CardContent>
      </Card>
    </div>
  );
}