import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function generateRandomNumbers() {
  const numbers = [];
  while (numbers.length < 3) {
    const num = Math.floor(Math.random() * 100) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
}

function NumberCard({ number, onClick }) {
  return (
    <Card
      className="w-full sm:w-1/3 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <CardTitle className="text-4xl">{number}</CardTitle>
      </CardHeader>
    </Card>
  );
}


function ResultAlert({ success, highestNumber }) {
  if (success === null) return null;

  return (
    <Alert className={success ? "bg-green-100" : "bg-red-100"}>
      <AlertTitle>{success ? "Success!" : "Oops!"}</AlertTitle>
      <AlertDescription>
        {success
          ? `You found the highest number: ${highestNumber}`
          : `That's not the highest number. Try again!`}
      </AlertDescription>
    </Alert>
  );
}

export default function App() {
  const [numbers, setNumbers] = useState([]);
  const [success, setSuccess] = useState(null);
  const [gameCount, setGameCount] = useState(0);

  useEffect(() => {
    setNumbers(generateRandomNumbers());
  }, [gameCount]);

  const handleNumberClick = (clickedNumber) => {
    const highestNumber = Math.max(...numbers);
    setSuccess(clickedNumber === highestNumber);
  };

  const resetGame = () => {
    setSuccess(null);
    setGameCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Find the Highest Number
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {numbers.map((number, index) => (
              <NumberCard
                key={index}
                number={number}
                onClick={() => handleNumberClick(number)}
              />
            ))}
          </div>
          <ResultAlert success={success} highestNumber={Math.max(...numbers)} />
          {success !== null && (
            <Button onClick={resetGame} className="w-full">
              Play Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
