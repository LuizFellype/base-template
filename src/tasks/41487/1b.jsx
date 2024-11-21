import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const rainbowColors = [
  { name: "Red", hex: "#FF0000" },
  { name: "Orange", hex: "#FF7F00" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Green", hex: "#00FF00" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Indigo", hex: "#4B0082" },
  { name: "Violet", hex: "#9400D3" },
];

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function ColorButton({ color, onClick, disabled }) {
  return (
    <Button
      className="w-full h-20 sm:h-24 text-white font-bold text-lg sm:text-xl"
      style={{ backgroundColor: color.hex }}
      onClick={() => onClick(color)}
      disabled={disabled}
    >
      {color.name}
    </Button>
  );
}

function GameResult({ isCorrect, correctColor, onNextRound }) {
  return (
    <Alert className={isCorrect ? "bg-green-100" : "bg-red-100"}>
      <AlertTitle className={`text-lg ${isCorrect ? "text-green-700" : "text-red-700"}`}>
        {isCorrect ? "Correct!" : "Incorrect!"}
      </AlertTitle>
      <AlertDescription className={isCorrect ? "text-green-600" : "text-red-600"}>
        {isCorrect
          ? "Great job! You selected the right color."
          : `The correct color was ${correctColor.name}.`}
      </AlertDescription>
      <Button className="mt-2" onClick={onNextRound}>
        Next Round
      </Button>
    </Alert>
  );
}

export default function App() {
  const [gameColors, setGameColors] = useState([]);
  const [targetColor, setTargetColor] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const shuffled = shuffleArray(rainbowColors);
    const newGameColors = shuffled.slice(0, 3);
    setGameColors(newGameColors);
    setTargetColor(newGameColors[Math.floor(Math.random() * 3)]);
    setGameResult(null);
  };

  const handleColorClick = (selectedColor) => {
    const isCorrect = selectedColor.name === targetColor.name;
    setGameResult({ isCorrect, correctColor: targetColor });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center">
            Rainbow Color Naming Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameResult === null ? (
            <>
              <p className="text-lg sm:text-xl text-center mb-4">
                Select the color: <strong>{targetColor?.name}</strong>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {gameColors.map((color) => (
                  <ColorButton
                    key={color.name}
                    color={color}
                    onClick={handleColorClick}
                    disabled={false}
                  />
                ))}
              </div>
            </>
          ) : (
            <GameResult
              isCorrect={gameResult.isCorrect}
              correctColor={gameResult.correctColor}
              onNextRound={startNewRound}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}