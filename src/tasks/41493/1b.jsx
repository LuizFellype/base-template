import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NumberInput = ({ value, onChange, isCorrect }) => {
  const borderColor = isCorrect === null ? "border-gray-300" :
    isCorrect ? "border-green-500" : "border-red-500";

  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full text-center text-2xl ${borderColor}`}
    />
  );
};

const GameCard = () => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [predecessor, setPredecessor] = useState("");
  const [successor, setSuccessor] = useState("");
  const [isPredecessorCorrect, setIsPredecessorCorrect] = useState(null);
  const [isSuccessorCorrect, setIsSuccessorCorrect] = useState(null);

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 98) + 1; // Generate number between 1 and 99
  };

  useEffect(() => {
    setCurrentNumber(generateRandomNumber());
    setPredecessor("");
    setSuccessor("");
    setIsPredecessorCorrect(null);
    setIsSuccessorCorrect(null);
  }, []);

  const checkAnswers = () => {
    setIsPredecessorCorrect(Number(predecessor) === currentNumber - 1);
    setIsSuccessorCorrect(Number(successor) === currentNumber + 1);
  };

  const nextRound = () => {
    setCurrentNumber(generateRandomNumber());
    setPredecessor("");
    setSuccessor("");
    setIsPredecessorCorrect(null);
    setIsSuccessorCorrect(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Recognizing Numbers Around
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-center">{currentNumber}</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Predecessor
            </label>
            <NumberInput
              value={predecessor}
              onChange={setPredecessor}
              isCorrect={isPredecessorCorrect}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Successor
            </label>
            <NumberInput
              value={successor}
              onChange={setSuccessor}
              isCorrect={isSuccessorCorrect}
            />
          </div>
        </div>
        <div className="flex justify-center space-x-2">
          <Button onClick={checkAnswers}>Check</Button>
          <Button onClick={nextRound}>Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <GameCard />
    </div>
  );
}