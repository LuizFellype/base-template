import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CELLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const LAYOUTS = {
  flex: { rows: 1, cols: 6 },
  grid: { rows: 2, cols: 3 }
};

function App() {
  const [layout, setLayout] = useState('flex');
  const [activeCell, setActiveCell] = useState(null);
  const [previousCell, setPreviousCell] = useState(null);
  const [score, setScore] = useState({ right: 0, wrong: 0, missed: 0 });
  const [matches, setMatches] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const handleCellClick = (cell) => {
    if (!isRunning) return;
    if (cell === activeCell) {
      setScore(prev => ({...prev, right: prev.right + 1}));
    } else {
      setScore(prev => ({...prev, wrong: prev.wrong + 1}));
    }
  };

  const handleKeyPress = useCallback((event) => {
    if (!isRunning) return;
    const key = event.key.toUpperCase();
    if (CELLS.includes(key)) {
      handleCellClick(key);
    }
  }, [isRunning]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        let newCell;
        do {
          newCell = CELLS[Math.floor(Math.random() * CELLS.length)];
        } while (newCell === previousCell);
        setPreviousCell(activeCell);
        setActiveCell(newCell);
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, activeCell, previousCell]);

  const startStopGame = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setScore({ right: 0, wrong: 0, missed: 0 });
    }
  };

  const resetGame = () => {
    setScore({ right: 0, wrong: 0, missed: 0 });
    setActiveCell(null);
    setPreviousCell(null);
    setIsRunning(false);
  };

  const saveMatch = () => {
    setMatches(prev => [...prev, { ...score, date: new Date() }]);
  };

  const averageRightPercentage = () => {
    if (matches.length === 0) return 0;
    const totalRights = matches.reduce((sum, match) => sum + match.right, 0);
    const totalSelections = matches.reduce((sum, match) => sum + match.right + match.wrong + match.missed, 0);
    return (totalRights / totalSelections) * 100 || 0;
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Reflex Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block mb-2">Layout:</label>
            <Button variant="outline" onClick={() => setLayout('flex')} className={layout === 'flex' ? 'bg-green-500 text-white' : ''}>Flex</Button>
            <Button variant="outline" onClick={() => setLayout('grid')} className={layout === 'grid' ? 'bg-green-500 text-white ml-2' : 'ml-2'}>Grid</Button>
          </div>
          <div className="flex justify-between mb-4">
            <span>Right: {score.right}</span>
            <span>Wrong: {score.wrong}</span>
            <span>Missed: {score.missed}</span>
          </div>
          <div className={layout === 'flex' ? 'flex flex-row space-x-2' : 'grid grid-cols-3 gap-2'}>
            {CELLS.map(cell => (
              <div 
                key={cell} 
                className={`w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center text-2xl sm:text-4xl font-bold cursor-pointer border rounded ${activeCell === cell ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                onClick={() => handleCellClick(cell)}
              >
                {cell}
              </div>
            ))}
          </div>
          <div className="mt-4 space-x-2">
            <Button onClick={saveMatch}>Save</Button>
            <Button onClick={resetGame}>Reset</Button>
            <Button onClick={startStopGame}>{isRunning ? 'Stop' : 'Start'}</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          {matches.map((match, index) => (
            <div key={index} className="mb-2">
              <p>Right: {match.right}, Wrong: {match.wrong}, Missed: {match.missed}, Date: {match.date.toLocaleString()}</p>
            </div>
          ))}
          <p>Average Right: {averageRightPercentage().toFixed(2)}%</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;