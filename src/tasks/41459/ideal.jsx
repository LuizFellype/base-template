import React, { useState, useMemo, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ShoppingListItem = ({ item, onToggle, onDelete, onEdit, isActionDisabled }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(item.text);

    const handleEdit = () => {
        onEdit(item.id, editedText);
        setIsEditing(false);
    };

    return (
        <div className="flex items-center justify-between p-2 border-b">
            {isEditing ? (
                <Input
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    onBlur={handleEdit}
                    autoFocus
                />
            ) : (
                <>
                    <div className="flex items-center">
                        <Checkbox
                            checked={item.done}
                            onCheckedChange={() => onToggle(item.id)}
                            className="mr-2"
                            disabled={isActionDisabled}
                        />
                        <span className={item.done || item.deleted ? "line-through" : ""}>{item.text}</span>
                    </div>
                    <div>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} disabled={isActionDisabled}>
                            Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} disabled={isActionDisabled}>
                            Delete
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

const ShoppingList = memo(({ items, onToggle, onDelete, onEdit, isActionDisabled }) => {
    return (
        <div className="space-y-2">
            {items.map((item) => (
                <ShoppingListItem
                    key={item.id}
                    item={item}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    isActionDisabled={isActionDisabled}
                />
            ))}
        </div>
    );
});

const Statistics = ({ items }) => {
    const total = items.length;
    const done = items.filter((item) => item.done).length;
    const deleted = items.filter((item) => item.deleted).length;
    const todo = total - done - deleted;

    const percentage = (value) => !total ? 0 : ((value / total) * 100).toFixed(2);

    return (
        <div className="mt-4 text-sm">
            <p>To do: {percentage(todo)}%</p>
            <p>Done: {percentage(done)}%</p>
            <p>Deleted: {percentage(deleted)}%</p>
        </div>
    );
};

const History = ({ completedLists }) => {
    const calculateAverage = (key) => {
        const sum = completedLists.reduce((acc, list) => {
            const total = list.items.length;
            const count = list.items.filter((item) => key === 'todo' ? !item.done && !item.deleted : item[key]).length;
            return acc + (count / total) * 100;
        }, 0);
        return !completedLists.length ? 0 : (sum / completedLists.length).toFixed(2);
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Shopping History</h2>
            <div className="mb-4">
                <p>Average Done: {calculateAverage("done")}%</p>
                <p>Average To Do: {calculateAverage("todo")}%</p>
                <p>Average Deleted: {calculateAverage("deleted")}%</p>
            </div>
            {completedLists.map((list, index) => (
                <Card key={index} className="mb-4">
                    <CardHeader>
                        <CardTitle>List {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ShoppingList items={list.items} isActionDisabled />
                        <Statistics items={list.items} />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default function App() {
    const [items, setItems] = useState([]);
    const [input, setInput] = useState("");
    const [completedLists, setCompletedLists] = useState([]);

    const addItem = () => {
        if (input.trim()) {
            setItems([...items, { id: Date.now(), text: input, done: false, deleted: false }]);
            setInput("");
        }
    };

    const { 
        toggleItem,
        deleteItem,
        editItem 
    } = useMemo(() => {
        const toggleItem = (id) => {
            setItems(items.map((item) => (item.id === id ? { ...item, done: !item.done, deleted: false } : item)));
        };
    
        const deleteItem = (id) => {
            setItems(items.map((item) => (item.id === id ? { ...item, deleted: true, done: false } : item)));
        };
    
        const editItem = (id, newText) => {
            setItems(items.map((item) => (item.id === id ? { ...item, text: newText } : item)));
        };

        return { 
            toggleItem,
            deleteItem,
            editItem
        }
    }, [items]) 

    const {
        todoList,
        doneList,
        deletedList
    } = useMemo(() => {
        return {
            todoList: items.filter((item) => !item.done && !item.deleted),
            doneList: items.filter((item) => item.done),
            deletedList: items.filter((item) => item.deleted)
        }
    }, [items])


    const completeList = () => {
        setCompletedLists([...completedLists, {
            items: [
                ...todoList,
                ...doneList,
                ...deletedList
            ]
        }]);
        setItems([]);
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-3xl font-bold mb-4">aShopping List Organizer</h1>
            <Tabs defaultValue="list">
                <TabsList className="mb-4">
                    <TabsTrigger value="list">Current List</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shopping List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex mb-4">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Add an item"
                                    className="mr-2"
                                />
                                <Button onClick={addItem}>Add</Button>
                            </div>
                            <ShoppingList
                                items={todoList}
                                onToggle={toggleItem}
                                onDelete={deleteItem}
                                onEdit={editItem}
                            />
                            <h3 className="font-bold mt-4 mb-2">Done Items</h3>
                            <ShoppingList
                                items={doneList}
                                onToggle={toggleItem}
                                onDelete={deleteItem}
                                onEdit={editItem}
                            />
                            <h3 className="font-bold mt-4 mb-2">Deleted Items</h3>
                            <ShoppingList
                                items={deletedList}
                                onToggle={toggleItem}
                                onDelete={deleteItem}
                                onEdit={editItem}
                            />
                            <Statistics items={items} />
                            <Button onClick={completeList} className="mt-4">
                                Complete List
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <History completedLists={completedLists} />
                </TabsContent>
            </Tabs>
        </div>
    );
}