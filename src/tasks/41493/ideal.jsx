import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import './ideal.css'
const allowedEvents = ['insertText', 'deleteContentBackward']
const NumberInput = ({ value, onChange, isCorrect }) => {
    const borderColor = isCorrect === null ? "border-gray-300" :
        isCorrect ? "border-green-500" : "border-red-500";
    return (
        <Input
            type="number"
            value={value}
            onChange={(e) => allowedEvents.includes(e.nativeEvent.inputType) && onChange(e.target.value)}
            className={`w-full text-center text-2xl ${borderColor} no-arrows`}
        />
    );
};
const generateRandomNumber = () => {
    return Math.floor(Math.random() * 98) + 1; // Generate number between 1 and 99
};
const GameCard = () => {
    const [currentNumber, setCurrentNumber] = useState(() => generateRandomNumber());
    const [predecessor, setPredecessor] = useState("");
    const [successor, setSuccessor] = useState("");
    const [isPredecessorCorrect, setIsPredecessorCorrect] = useState(null);
    const [isSuccessorCorrect, setIsSuccessorCorrect] = useState(null);
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
    const handlePredecessor = useCallback((value) => {
        isPredecessorCorrect !== null && setIsPredecessorCorrect(null);
        setPredecessor(value)
    }, [isPredecessorCorrect])
    
    const handleSuccessor = useCallback((value) => {
        isSuccessorCorrect !== null && setIsSuccessorCorrect(null);
        setSuccessor(value)
    }, [isSuccessorCorrect])

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
                            onChange={handlePredecessor}
                            isCorrect={isPredecessorCorrect}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Successor
                        </label>
                        <NumberInput
                            value={successor}
                            onChange={handleSuccessor}
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