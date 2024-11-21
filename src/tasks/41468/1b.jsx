import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function NumberCard({ number, onClick, isHighest }) {
  return (
    <Card className="w-full sm:w-1/3 m-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">
          {number}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onClick} 
          className={`w-full ${isHighest ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Choose
        </Button>
      </CardContent>
    </Card>
  );
}

function Message({ type, onClose }) {
  const messages = {
    success: 'Correct! You chose the highest number.',
    failure: 'Oops! That was not the highest number.'
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <p>{messages[type]}</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    </div>
  );
}

export default function App() {
  const [numbers, setNumbers] = useState([]);
  const [showMessage, setShowMessage] = useState(null);

  useEffect(() => {
    generateNumbers();
  }, []);

  const generateNumbers = () => {
    let nums = [];
    while (nums.length < 3) {
      const r = Math.floor(Math.random() * 100) + 1;
      if (nums.indexOf(r) === -1) nums.push(r);
    }
    setNumbers(nums.sort((a, b) => b - a)); // Sort in descending order to easily know the highest
  };

  const checkNumber = (selectedNumber) => {
    if (selectedNumber === numbers[0]) {
      setShowMessage('success');
    } else {
      setShowMessage('failure');
    }
  };

  const resetGame = () => {
    setShowMessage(null);
    generateNumbers();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-2">
      <h1 className="text-2xl font-bold mb-4">Find the Highest Number</h1>
      <div className="flex flex-wrap justify-center">
        {numbers.map((num, index) => (
          <NumberCard 
            key={num} 
            number={num} 
            onClick={() => checkNumber(num)} 
            isHighest={index === 0}
          />
        ))}
      </div>
      {showMessage && <Message type={showMessage} onClose={resetGame} />}
      {!showMessage && (
        <Button onClick={resetGame} className="mt-4">
          New Numbers
        </Button>
      )}
    </div>
  );
}