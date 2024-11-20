import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value.replace(/[^0-9+\-*/.]/g, ''));
  };

  const calculate = useCallback(() => {
    try {
      // Using eval for simplicity; in production, use a safer method like a math library or custom parser
      const res = eval(input);
      setResult(res);
    } catch (e) {
      setResult('Error');
    }
  }, [input]);

  const getResultColor = () => {
    if (result === 'Error') return 'text-red-500';
    return result >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-blue-50 p-4 sm:p-8">
      <div className="w-full max-w-xs">
        <Input 
          type="text" 
          value={input} 
          onChange={handleInputChange} 
          placeholder="Type your calculation"
          className="mb-4 text-right"
        />
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button onClick={() => setInput(input + '+')}>+</Button>
          <Button onClick={() => setInput(input + '-')}>-</Button>
        </div>
        <Button onClick={calculate} className="w-full mb-2">Calculate</Button>
        {result !== null && (
          <div className={`text-2xl font-bold text-center ${getResultColor()}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Calculator />
    </div>
  );
}