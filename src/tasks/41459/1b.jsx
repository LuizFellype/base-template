import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleNumberClick = (value) => {
    setInput(input + value);
  };

  const handleOperation = (operation) => {
    if (input === '') return;
    setInput(input + ' ' + operation + ' ');
  };

  const calculate = () => {
    try {
      // Replace 'x' with '*' for multiplication
      const calculatedResult = eval(input.replace(/x/g, '*'));
      setResult(calculatedResult);
    } catch (e) {
      setResult('Error');
    }
  };

  const clear = () => {
    setInput('');
    setResult(null);
  };

  const resultColor = result >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <Card className="max-w-sm mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle>Kids Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        
        <Input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type numbers and operations"
          className="mb-4"
        />
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[7, 8, 9, '+', 4, 5, 6, '-', 1, 2, 3, 'x', '.', 0, 'C', '=']
            .map(num => (
              <Button 
                key={num} 
                onClick={() => {
                  if (num === '=') calculate();
                  else if (num === 'C') clear();
                  else if (num === '+' || num === '-' || num === 'x') handleOperation(num);
                  else handleNumberClick(num);
                }}
                variant={num === '=' ? "secondary" : "default"}
              >
                {num}
              </Button>
            ))}
        </div>
        {result !== null && (
          <p className={`text-2xl font-bold text-center ${resultColor}`}>
            Result: {result}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Calculator />
    </div>
  );
}