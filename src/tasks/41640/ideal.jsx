import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getRandomLetter() {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

const LetterInput = ({ label, value, onChange, isWrong, onFocus }) => (
    <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <Input
            value={value}
            onChange={onChange}
            className={`w-16 text-center text-2xl ${isWrong ? "border-red-500" : ""
                }`}
            maxLength={1}
            onFocus={onFocus}
        />
    </div>
);

const useControlForm = () => {
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

    return {
        currentLetter, setCurrentLetter,
        predecessor, setPredecessor,
        successor, setSuccessor,
        success, setSuccess,
        error, setError,
    }
}

function AlphabetCard() {
    const { currentLetter, setCurrentLetter,
        predecessor, setPredecessor,
        successor, setSuccessor,
        success, setSuccess,
        error, setError, } = useControlForm()

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
                <CardTitle className="text-2xl font-bold text-center">Alphabet Challenge</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl text-center mb-4">{currentLetter}</div>
                <div className="flex justify-center space-x-8">
                    <LetterInput
                        label="Predecessor"
                        value={predecessor}
                        onChange={(e) => setPredecessor(e.target.value)}
                        isWrong={error.predecessor}
                        onFocus={() => setError({ ...error, predecessor: false })}
                    />
                    <LetterInput
                        label="Successor"
                        value={successor}
                        onChange={(e) => setSuccessor(e.target.value)}
                        isWrong={error.successor}
                        onFocus={() => setError({ ...error, successor: false })}
                    />
                </div>
                {success && <Alert className="bg-green-100 border-green-500 mt-2">
                    <AlertDescription className="text-green-700">
                        Congratulations! Both answers are correct.
                    </AlertDescription>
                </Alert>}
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