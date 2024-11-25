import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const statuses = ['Todo', 'WIP', 'Review', 'Validation', 'Done', 'Deleted'];

function TaskForm({ onSubmit, initialValues = {} }) {
  const [task, setTask] = useState(initialValues);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({...task, status: initialValues.status || 'Todo'});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        value={task.name || ''} 
        onChange={e => setTask({...task, name: e.target.value})} 
        placeholder="Task Name" 
        required 
      />
      <Textarea 
        value={task.description || ''} 
        onChange={e => setTask({...task, description: e.target.value})} 
        placeholder="Description" 
      />
      <Select value={task.type} onChange={value => setTask({...task, type: value})}>
        <SelectItem value="Feature">Feature</SelectItem>
        <SelectItem value="Bug">Bug</SelectItem>
        <SelectItem value="Spike">Spike</SelectItem>
      </Select>
      <Select value={task.priority} onChange={value => setTask({...task, priority: value})}>
        <SelectItem value="Priority 1">Priority 1</SelectItem>
        <SelectItem value="Priority 2">Priority 2</SelectItem>
        <SelectItem value="Priority 3">Priority 3</SelectItem>
      </Select>
      <Button type="submit">Submit</Button>
    </form>
  );
}

function TaskItem({ task, onEdit }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card onClick={() => setOpen(true)} className="cursor-pointer">
        <CardHeader>
          <CardTitle>{task.name}</CardTitle>
          <CardDescription>Priority: {task.priority}</CardDescription>
        </CardHeader>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>Edit or update task status.</DialogDescription>
          </DialogHeader>
          <TaskForm 
            initialValues={task} 
            onSubmit={(updatedTask) => {
              onEdit(updatedTask);
              setOpen(false);
            }} 
          />
          <Select 
            value={task.status} 
            onChange={status => onEdit({...task, status})}
          >
            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </Select>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addTask = (newTask) => {
    setTasks([...tasks, {...newTask, id: Date.now()}]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => setShowForm(!showForm)} className="mb-4">
        {showForm ? 'Hide Form' : 'Add New Task'}
      </Button>
      {showForm && <TaskForm onSubmit={addTask} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statuses.map(status => (
          <div key={status} className="space-y-4">
            <h2 className="text-xl font-bold">{status}</h2>
            {tasks.filter(t => t.status === status).map(task => (
              <TaskItem key={task.id} task={task} onEdit={updateTask} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}