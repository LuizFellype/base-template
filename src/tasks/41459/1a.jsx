import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleOperation = (operation) => {
    setInput((prevInput) => prevInput + operation);
  };

  const calculateResult = () => {
    try {
      // Using eval() for simplicity, but it's not recommended for production
      const calculatedResult = eval(input);
      setResult(calculatedResult);
    } catch (error) {
      setResult("Error");
    }
  };

  const clearInput = () => {
    setInput("");
    setResult(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Kid's Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter numbers..."
            className="text-lg"
          />
          <div className="grid grid-cols-4 gap-2">
            {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
              <Button
                key={num}
                onClick={() => setInput((prev) => prev + num)}
                className="text-lg"
              >
                {num}
              </Button>
            ))}
            <Button onClick={() => handleOperation("+")} className="text-lg">
              +
            </Button>
            <Button onClick={() => handleOperation("-")} className="text-lg">
              -
            </Button>
            <Button onClick={calculateResult} className="text-lg col-span-2">
              =
            </Button>
          </div>
          <Button onClick={clearInput} className="w-full text-lg">
            Clear
          </Button>
          {result !== null && (
            <div
              className={`text-2xl font-bold text-center ${
                result >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              Result: {result}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Calculator />
    </div>
  );
}