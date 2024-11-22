import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";


function App() {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('shoppingList')) || []);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, { text: inputValue, status: 'todo', id: Date.now() }]);
      setInputValue('');
    }
  };

  const updateItem = (id, status) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: status } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const completeList = () => {
    // Here you would typically save to a backend or update state for history
    alert('List completed! View history for details.');
  };

  const stats = {
    todo: items.filter(item => item.status === 'todo').length,
    done: items.filter(item => item.status === 'done').length,
    deleted: items.filter(item => item.status === 'deleted').length,
  };

  const totalItems = items.length;
  const percentages = {
    todo: totalItems ? (stats.todo / totalItems * 100).toFixed(2) : 0,
    done: totalItems ? (stats.done / totalItems * 100).toFixed(2) : 0,
    deleted: totalItems ? (stats.deleted / totalItems * 100).toFixed(2) : 0,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-lg mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Shopping List Organizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Add new item"
              className="flex-grow mr-2"
            />
            <Button onClick={addItem}>Add</Button>
          </div>
          {['todo', 'done', 'deleted'].map(status => (
            <div key={status} className="mb-4">
              <h2 className="text-lg font-semibold mb-2 capitalize">{status} Items</h2>
              {items.filter(item => item.status === status).map(item => (
                <div key={item.id} className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded">
                  <span className={item.status === 'done' ? 'line-through' : ''}>{item.text}</span>
                  <div>
                    {item.status !== 'done' && <Button onClick={() => updateItem(item.id, 'done')}>Done</Button>}
                    {item.status !== 'deleted' && <Button onClick={() => updateItem(item.id, 'deleted')}>Delete</Button>}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div>
            <p>Todo: {percentages.todo}% | Done: {percentages.done}% | Deleted: {percentages.deleted}%</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={completeList}>Complete List</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function HistoryPage() {
  // Placeholder for history functionality
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-lg mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Shopping List History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you would display historical data.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ShoppingListApp() {
  const [page, setPage] = useState('list');

  return (
    <div>
      {page === 'list' ? 
        <App /> : 
        <HistoryPage />
      }
      <div className="fixed bottom-4 right-4">
        <Button onClick={() => setPage(page === 'list' ? 'history' : 'list')}>
          Go to {page === 'list' ? 'History' : 'List'}
        </Button>
      </div>
    </div>
  );
}