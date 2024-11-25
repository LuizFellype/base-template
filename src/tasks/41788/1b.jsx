import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const TASK_TYPES = ["Feature", "Bug", "Spike"];
const PRIORITIES = ["Priority 1", "Priority 2", "Priority 3"];
const STATUSES = ["Todo", "WIP", "Review", "Validation", "Done", "Deleted"];

function TaskForm({ onAddTask }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(TASK_TYPES[0]);
  const [priority, setPriority] = useState(PRIORITIES[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({ name, description, type, priority, status: "Todo" });
    setName("");
    setDescription("");
    setType(TASK_TYPES[0]);
    setPriority(PRIORITIES[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Select value={type} onValueChange={setType}>
        <SelectTrigger>
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          {TASK_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger>
          <SelectValue placeholder="Select Priority" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITIES.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">Add Task</Button>
    </form>
  );
}

function TaskCard({ task, onOpenDetails }) {
  return (
    <Card className="mb-2 cursor-pointer" onClick={() => onOpenDetails(task)}>
      <CardHeader>
        <CardTitle className="text-sm">{task.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs">{task.priority}</p>
      </CardContent>
    </Card>
  );
}

function TaskDetailsModal({ task, isOpen, onClose, onUpdate }) {
  const [editedTask, setEditedTask] = useState(task);

  const handleUpdate = () => {
    onUpdate(editedTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={editedTask.name}
            onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
          />
          <Textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          />
          <Select
            value={editedTask.type}
            onValueChange={(value) => setEditedTask({ ...editedTask, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {TASK_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={editedTask.priority}
            onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={editedTask.status}
            onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Organizer</h1>
      <TaskForm onAddTask={addTask} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
        {STATUSES.map((status) => (
          <div key={status}>
            <h2 className="text-lg font-semibold mb-2">{status}</h2>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <TaskCard key={task.id} task={task} onOpenDetails={openTaskDetails} />
              ))}
          </div>
        ))}
      </div>
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={closeTaskDetails}
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}