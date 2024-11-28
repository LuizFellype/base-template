import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CELL_COUNT = 6;
const INTERVAL = 1000;

const Cell = ({ isActive, onClick, keyboardKey }) => (
  <button
    className={`w-full h-16 sm:h-24 rounded-lg transition-colors ${
      isActive ? "bg-green-500" : "bg-gray-300"
    }`}
    onClick={onClick}
  >
    {keyboardKey}
  </button>
);

const GameBoard = ({ layout, activeCell, onCellClick }) => {
  const cells = Array.from({ length: CELL_COUNT }, (_, i) => i);
  const keyboardKeys = ["A", "S", "D", "F", "G", "H"];

  return (
    <div className={`grid ${layout === "flex" ? "grid-cols-6" : "grid-cols-3 grid-rows-2"} gap-2`}>
      {cells.map((cell) => (
        <Cell
          key={cell}
          isActive={cell === activeCell}
          onClick={() => onCellClick(cell)}
          keyboardKey={keyboardKeys[cell]}
        />
      ))}
    </div>
  );
};

const ScoreBoard = ({ rights, wrongs, missed }) => (
  <div className="flex justify-around mb-4">
    <div>Right: {rights}</div>
    <div>Wrong: {wrongs}</div>
    <div>Missed: {missed}</div>
  </div>
);

const MatchHistory = ({ history }) => {
  const averageRightPercentage =
    history.length > 0
      ? (
          (history.reduce((sum, match) => sum + match.rights, 0) /
            history.reduce((sum, match) => sum + match.total, 0)) *
          100
        ).toFixed(2)
      : 0;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Match History</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Average Right Percentage: {averageRightPercentage}%</div>
        {history.map((match, index) => (
          <div key={index} className="mt-2">
            Match {index + 1}: Right: {match.rights}, Wrong: {match.wrongs}, Missed: {match.missed}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [layout, setLayout] = useState("flex");
  const [activeCell, setActiveCell] = useState(0);
  const [score, setScore] = useState({ rights: 0, wrongs: 0, missed: 0 });
  const [isRunning, setIsRunning] = useState(true);
  const [history, setHistory] = useState([]);

  const generateNewActiveCell = useCallback(() => {
    let newCell;
    do {
      newCell = Math.floor(Math.random() * CELL_COUNT);
    } while (newCell === activeCell);
    return newCell;
  }, [activeCell]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setActiveCell((prevCell) => {
        const newCell = generateNewActiveCell();
        setScore((prevScore) => ({ ...prevScore, missed: prevScore.missed + 1 }));
        return newCell;
      });
    }, INTERVAL);

    return () => clearInterval(intervalId);
  }, [isRunning, generateNewActiveCell]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const keyIndex = ["a", "s", "d", "f", "g", "h"].indexOf(e.key.toLowerCase());
      if (keyIndex !== -1) {
        handleCellClick(keyIndex);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeCell]);

  const handleCellClick = (cellIndex) => {
    if (cellIndex === activeCell) {
      setScore((prevScore) => ({ ...prevScore, rights: prevScore.rights + 1 }));
    } else {
      setScore((prevScore) => ({ ...prevScore, wrongs: prevScore.wrongs + 1 }));
    }
  };

  const handleSave = () => {
    const total = score.rights + score.wrongs + score.missed;
    setHistory((prevHistory) => [...prevHistory, { ...score, total }]);
  };

  const handleReset = () => {
    setScore({ rights: 0, wrongs: 0, missed: 0 });
    setActiveCell(generateNewActiveCell());
  };

  const handleToggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Finger Reflex Game</h1>
      <div className="mb-4">
        <Select value={layout} onValueChange={setLayout}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flex">Layout Flex</SelectItem>
            <SelectItem value="grid">Layout Grid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScoreBoard {...score} />
      <GameBoard layout={layout} activeCell={activeCell} onCellClick={handleCellClick} />
      <div className="mt-4 flex justify-between">
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleReset}>Reset Game</Button>
        <Button onClick={handleToggleRunning}>{isRunning ? "Stop" : "Start"}</Button>
      </div>
      <MatchHistory history={history} />
    </div>
  );
}