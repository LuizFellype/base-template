import React, { useState, useMemo, useCallback } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function App() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([null, null]);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(0);
  const [history, setHistory] = useState([]);
  const [replay, setReplay] = useState(null);

  const currentPlayer = useMemo(() => selectedPlayers[turn % 2], [selectedPlayers, turn]);
  const winner = useMemo(() => calculateWinner(board), [board]);

  const handlePlayerAdd = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    if (name && !players.includes(name)) {
      setPlayers(prev => [...prev, name]);
      e.target.name.value = '';
    }
  };

  const handleSelectPlayer = (index, player) => {
    const newSelection = [...selectedPlayers];
    newSelection[index] = player;
    setSelectedPlayers(newSelection);
  };

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = currentPlayer[0].toUpperCase();
    setBoard(newBoard);
    setTurn(turn + 1);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(0);
    setSelectedPlayers([null, null]);
  };

  const saveMatch = () => {
    setHistory(prev => [...prev, { players: selectedPlayers, board }]);
    resetGame();
  };

  const replayMatch = (match) => {
    setReplay({ ...match, step: 0, intervalId: setInterval(() => {
      setReplay(prev => {
        if (prev.step >= 9 || calculateWinner(prev.board.slice(0, prev.step + 1))) {
          clearInterval(prev.intervalId);
          return null;
        }
        return { ...prev, step: prev.step + 1 };
      });
    }, 1500)});
  };

  const stopReplay = () => {
    if (replay) clearInterval(replay.intervalId);
    setReplay(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Tic Tac Toe</h1>
      <form onSubmit={handlePlayerAdd} className="mb-4">
        <Input type="text" name="name" placeholder="Enter player name" className="mb-2" />
        <Button type="submit">Add Player</Button>
      </form>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {[0, 1].map(i => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Player {i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <select onChange={e => handleSelectPlayer(i, e.target.value)} value={selectedPlayers[i] || ''}>
                <option value="">Select Player</option>
                {players.map(player => <option key={player}>{player}</option>)}
              </select>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedPlayers.filter(Boolean).length === 2 && (
        <>
          <div className="mb-4">
            {selectedPlayers.map((player, idx) => 
              <span key={idx} className="mr-4">{player} ({idx === turn % 2 ? 'X' : 'O'})</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {board.map((cell, idx) => (
              <div 
                key={idx} 
                className="bg-gray-100 aspect-square flex items-center justify-center text-4xl font-bold cursor-pointer hover:bg-gray-200"
                onClick={() => handleClick(idx)}
              >
                {cell}
              </div>
            ))}
          </div>
          {winner && <p className="mb-4 font-bold">{winner} wins!</p>}
          {!winner && board.every(cell => cell) && <p className="mb-4">It's a tie!</p>}
          <Button onClick={saveMatch} disabled={!!winner || board.every(cell => cell)}>Save Match</Button>
        </>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Match History</h2>
        <Accordion type="single" collapsible>
          {history.map((match, index) => (
            <AccordionItem value={`match-${index}`} key={index}>
              <AccordionTrigger onClick={() => replay ? stopReplay() : replayMatch(match)}>
                {match.players.join(' vs ')} - {calculateWinner(match.board) || 'Tie'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-2">
                  {replay ? match.board.slice(0, replay.step + 1).map((cell, idx) => 
                    <div key={idx} className="bg-gray-100 aspect-square flex items-center justify-center text-lg">
                      {cell}
                    </div>
                  ) : match.board.map((cell, idx) => 
                    <div key={idx} className="bg-gray-100 aspect-square flex items-center justify-center text-lg">
                      {cell}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;