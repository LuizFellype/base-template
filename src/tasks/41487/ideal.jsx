import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colors = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Green', hex: '#008000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Violet', hex: '#EE82EE' },
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function RainbowGame() {
  const [currentColors, setCurrentColors] = useState([]);
  const [targetColorName, setTargetColorName] = useState('');
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffledColors = shuffleArray(colors).slice(0, 3);
    setCurrentColors(shuffledColors);
    setTargetColorName(shuffledColors[Math.floor(Math.random() * 3)].name);
    setMessage('');
    setIsCorrect(null);
  };

  const checkColor = (colorName) => {
    if (colorName === targetColorName) {
      setMessage('Correct! Well done!');
      setIsCorrect(true);
    } else {
      setMessage('Oops, try again!');
      setIsCorrect(false);
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-10 sm:mt-20 flex items-center flex-col">
      <CardHeader>
        <CardTitle>Which color is {targetColorName}?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {currentColors.map(color => (
          <Button 
            key={color.name} 
            onClick={() => checkColor(color.name)} 
            style={{ backgroundColor: color.hex, color: 'white' }}
            className="w-24 h-24 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            &nbsp;
          </Button>
        ))}
        {message && (
          <p className={`text-${isCorrect ? 'green' : 'red'}-500`}>{message}</p>
        )}
      </CardContent>
      <Button onClick={resetGame} className="mt-4 mb-4">New Colors</Button>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <RainbowGame />
    </div>
  );
}