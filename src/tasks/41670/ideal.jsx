import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];

const GameCard = React.memo(({ color, isFlipped, onClick }) => {
  return (
    <Card
      className={`w-24 h-32 cursor-pointer transition-all duration-300 ${
        isFlipped ? color : "bg-gray-300"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4"></CardContent>
    </Card>
  );
});

const shuffleCards = () => {
  return [...colors, ...colors]
    .sort(() => Math.random() - 0.5)
    .map((color) => ({ color, isFlipped: false }));
};

export default function App() {
  const [cards, setCards] = useState(shuffleCards());
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [rounds, setRounds] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [games, setGames] = useState([]);

  const handleCardClick = useCallback(
    (index) => {
      if (flippedIndices.length === 2 || cards[index].isFlipped) return;

      const newCards = [...cards];
      newCards[index].isFlipped = true;
      setCards(newCards);

      const newFlippedIndices = [...flippedIndices, index];
      setFlippedIndices(newFlippedIndices);

      if (newFlippedIndices.length === 2) {
        setRounds((prev) => prev + 1);

        if (cards[newFlippedIndices[0]].color === cards[newFlippedIndices[1]].color) {
          setFlippedIndices([]);
          if (newCards.every((card) => card.isFlipped)) {
            setGameOver(true);
          }
        } else {
          setTimeout(() => {
            const resetCards = [...newCards];
            newFlippedIndices.forEach((i) => {
              resetCards[i].isFlipped = false;
            });
            setCards(resetCards);
            setFlippedIndices([]);
          }, 1000);
        }
      }
    },
    [cards, flippedIndices]
  );

  const startNewGame = useCallback(() => {
    setGames((prev) => [...prev, rounds]);
    setCards(shuffleCards());
    setFlippedIndices([]);
    setRounds(0);
    setGameOver(false);
  }, [rounds]);

  const averageRounds = useMemo(() => {
    return games.length > 0 ? (games.reduce((a, b) => a + b, 0) / games.length).toFixed(2) : 0;
  }, [games]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Guess Matching Cards</h1>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {cards.map((card, index) => (
            <GameCard
              key={index}
              color={card.color}
              isFlipped={card.isFlipped}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
        <div className="text-center mb-6">
          <p className="text-xl font-semibold">Rounds: {rounds}</p>
        </div>
        {gameOver && (
          <Alert className="mb-6">
            <AlertTitle>Congratulations!</AlertTitle>
            <AlertDescription>
              You completed the game in {rounds} rounds.
              <Button className="mt-2" onClick={startNewGame}>
                Start New Game
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Game Statistics</h2>
          <p>Games Played: {games.length}</p>
          <p>Rounds per Game: {!games.length ? 0 : games.join(", ")}</p>
          <p>Average Rounds: {averageRounds}</p>
        </div>
      </div>
    </div>
  );
}