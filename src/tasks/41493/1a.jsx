import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function NumberGame() {
  const [number, setNumber] = useState(0);
  const [predecessor, setPredecessor] = useState('');
  const [successor, setSuccessor] = useState('');
  const [predecessorCorrect, setPredecessorCorrect] = useState(null);
  const [successorCorrect, setSuccessorCorrect] = useState(null);

  useEffect(() => {
    // Generate a random number between 1 and 100 when the component mounts
    setNumber(Math.floor(Math.random() * 100) + 1);
  }, []);

  const checkAnswers = () => {
    const pred = number - 1;
    const succ = number + 1;
    setPredecessorCorrect(pred.toString() === predecessor);
    setSuccessorCorrect(succ.toString() === successor);
  };

  const newNumber = () => {
    setNumber(Math.floor(Math.random() * 100) + 1);
    setPredecessor('');
    setSuccessor('');
    setPredecessorCorrect(null);
    setSuccessorCorrect(null);
  };

  return (
    <Card className="w-full max-w-sm mx-auto mt-10 sm:mt-20">
      <CardHeader>
        <CardTitle>Recognize Numbers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-4xl mb-4">{number}</div>
        <div className="flex flex-col space-y-2">
          <Input 
            type="number" 
            placeholder="Predecessor" 
            value={predecessor}
            onChange={(e) => setPredecessor(e.target.value)}
            className={`border-2 ${predecessorCorrect === true ? 'border-green-500' : predecessorCorrect === false ? 'border-red-500' : 'border-gray-300'}`}
          />
          <Input 
            type="number" 
            placeholder="Successor" 
            value={successor}
            onChange={(e) => setSuccessor(e.target.value)}
            className={`border-2 ${successorCorrect === true ? 'border-green-500' : successorCorrect === false ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
        <div className="mt-4 space-x-2 flex justify-center">
          <Button onClick={checkAnswers}>Check</Button>
          <Button onClick={newNumber}>New Number</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <NumberGame />
    </div>
  );
}