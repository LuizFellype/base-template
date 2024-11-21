import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getPredecessor = (letter) => {
  const index = alphabet.indexOf(letter);
  return index > 0 ? alphabet[index - 1] : "Z";
};

const getSuccessor = (letter) => {
  const index = alphabet.indexOf(letter);
  return index < 25 ? alphabet[index + 1] : "A";
};

const LetterInput = ({ label, value, onChange, isCorrect }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium">{label}</label>
    <Input
      value={value}
      onChange={onChange}
      className={`w-16 text-center text-2xl ${
        isCorrect === false ? "border-red-500" : ""
      }`}
      maxLength={1}
    />
  </div>
);

export default function App() {
  const [currentLetter, setCurrentLetter] = useState("");
  const [predecessor, setPredecessor] = useState("");
  const [successor, setSuccessor] = useState("");
  const [isCorrect, setIsCorrect] = useState({ pred: null, succ: null });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    generateRandomLetter();
  }, []);

  const generateRandomLetter = () => {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    setCurrentLetter(alphabet[randomIndex]);
    setPredecessor("");
    setSuccessor("");
    setIsCorrect({ pred: null, succ: null });
    setShowSuccess(false);
  };

  const handleInputChange = (type, value) => {
    const uppercaseValue = value.toUpperCase();
    if (type === "pred") {
      setPredecessor(uppercaseValue);
    } else {
      setSuccessor(uppercaseValue);
    }
    setShowSuccess(false);
    setIsCorrect((prev) => ({ ...prev, [type]: null }));
  };

  const checkAnswers = () => {
    const correctPred = getPredecessor(currentLetter);
    const correctSucc = getSuccessor(currentLetter);
    const predCorrect = predecessor === correctPred;
    const succCorrect = successor === correctSucc;

    setIsCorrect({ pred: predCorrect, succ: succCorrect });
    setShowSuccess(predCorrect && succCorrect);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Leaning Alphabet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <span className="text-6xl font-bold">{currentLetter}</span>
          </div>
          <div className="flex justify-center space-x-8">
            <LetterInput
              label="Predecessor"
              value={predecessor}
              onChange={(e) => handleInputChange("pred", e.target.value)}
              isCorrect={isCorrect.pred}
            />
            <LetterInput
              label="Successor"
              value={successor}
              onChange={(e) => handleInputChange("succ", e.target.value)}
              isCorrect={isCorrect.succ}
            />
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={checkAnswers}>Check</Button>
            <Button onClick={generateRandomLetter} variant="outline">
              New Letter
            </Button>
          </div>
          {showSuccess && (
            <Alert className="bg-green-100 border-green-500">
              <AlertDescription className="text-green-700">
                Congratulations! Both answers are correct.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}