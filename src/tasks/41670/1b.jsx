import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

const GameCard = React.memo(({ color, isFlipped, onClick }) => (
  <Card className={`w-20 h-20 sm:w-24 sm:h-24 m-2 transition-transform transform ${isFlipped ? 'rotate-y-180' : ''}`} onClick={onClick}>
    <CardContent className="p-0">
      <div className={`${color} ${isFlipped ? 'block' : 'hidden'} w-full h-full`}></div>
      <div className={`w-full h-full bg-gray-200 backface-hidden ${isFlipped ? 'hidden' : 'block'}`}></div>
    </CardContent>
  </Card>
));

const GameStats = ({ gamesPlayed, roundsPerGame, averageRounds }) => (
  <div className="mt-4 text-sm">
    <p>Games Played: {gamesPlayed}</p>
    <p>Rounds per Game: {roundsPerGame.join(', ')}</p>
    <p>Average Rounds: {averageRounds.toFixed(2)}</p>
  </div>
);

export default function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [rounds, setRounds] = useState(0);
  const [gameStats, setGameStats] = useState({ games: 0, rounds: [], totalRounds: 0 });

  // Initialize or reset the game
  useEffect(() => {
    const initializeCards = () => {
      const newCards = COLORS.flatMap(color => 
        [{ color, id: Math.random() }, { color, id: Math.random() }]
      ).sort(() => Math.random() - 0.5);
      setCards(newCards);
      setFlipped([]);
      setMatched([]);
      setRounds(0);
    };
    
    initializeCards();
  }, [gameStats.games]);

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      setTimeout(() => {
        const [first, second] = flipped;
        if (cards[first].color === cards[second].color) {
          setMatched(prev => [...prev, first, second]);
        }
        setFlipped([]);
        setRounds(rounds => rounds + 1);
      }, 1000);
    }
  }, [flipped, cards]);

  // Check if game is over
  useEffect(() => {
    if (matched.length === cards.length) {
      alert(`You won in ${rounds} rounds! Starting new game...`);
      setGameStats(prev => ({
        ...prev,
        games: prev.games + 1,
        rounds: [...prev.rounds, rounds],
        totalRounds: prev.totalRounds + rounds
      }));
    }
  }, [matched.length, rounds, cards.length]);

  const handleCardClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      setFlipped(prev => [...prev, index]);
    }
  };

  const averageRounds = useMemo(() => 
    gameStats.games ? gameStats.totalRounds / gameStats.games : 0, 
    [gameStats.games, gameStats.totalRounds]
  );

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Match the Cards</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-2">
          {cards.map((card, index) => 
            <GameCard 
              key={card.id} 
              color={card.color} 
              isFlipped={flipped.includes(index) || matched.includes(index)} 
              onClick={() => handleCardClick(index)}
            />
          )}
        </CardContent>
      </Card>
      <GameStats 
        gamesPlayed={gameStats.games} 
        roundsPerGame={gameStats.rounds} 
        averageRounds={averageRounds} 
      />
    </div>
  );
}