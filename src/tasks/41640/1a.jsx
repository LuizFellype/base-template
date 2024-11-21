import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getRandomLetter() {
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function AlphabetCard() {
  const [currentLetter, setCurrentLetter] = useState(getRandomLetter());
  const [predecessor, setPredecessor] = useState('');
  const [successor, setSuccessor] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({ predecessor: false, successor: false });

  useEffect(() => {
    if (predecessor && successor) {
      const isCorrect = 
        predecessor.toUpperCase() === alphabet[(alphabet.indexOf(currentLetter) - 1 + 26) % 26] &&
        successor.toUpperCase() === alphabet[(alphabet.indexOf(currentLetter) + 1) % 26];
      setSuccess(isCorrect);
      setError({
        predecessor: predecessor && predecessor.toUpperCase() !== alphabet[(alphabet.indexOf(currentLetter) - 1 + 26) % 26],
        successor: successor && successor.toUpperCase() !== alphabet[(alphabet.indexOf(currentLetter) + 1) % 26]
      });
    } else {
      setSuccess(false);
    }
  }, [predecessor, successor, currentLetter]);

  const reset = () => {
    setCurrentLetter(getRandomLetter());
    setPredecessor('');
    setSuccessor('');
    setSuccess(false);
    setError({ predecessor: false, successor: false });
  };

  return (
    <Card className="max-w-sm mx-auto mt-10 sm:max-w-lg">
      <CardHeader>
        <CardTitle>Alphabet Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl text-center mb-4">{currentLetter}</div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input 
            placeholder="Predecessor"
            value={predecessor}
            onChange={(e) => setPredecessor(e.target.value)}
            className={`${error.predecessor ? 'border-red-500' : ''} flex-1`}
            onFocus={() => setError({...error, predecessor: false})}
          />
          <Input 
            placeholder="Successor"
            value={successor}
            onChange={(e) => setSuccessor(e.target.value)}
            className={`${error.successor ? 'border-red-500' : ''} flex-1`}
            onFocus={() => setError({...error, successor: false})}
          />
        </div>
        {success && <p className="text-green-500 text-center mt-4">Correct!</p>}
        <Button onClick={reset} className="mt-4 w-full">Next Letter</Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <AlphabetCard />
    </div>
  );
}