// DO NOT EDIT THIS FILE.
// ===================================

import React, { useState, useEffect } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FolderTree, File, AlertTriangle } from 'lucide-react';
import './index.css';

const getHierarchy = (tasks) => {
  const hierarchy = {};
  tasks.forEach(task => {
    const parts = task.fullPath.split('/');
    let current = hierarchy;
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? task : {};
      }
      current = current[part];
    });
  });
  return hierarchy
}
const Preview_Runner_Do_Not_Edit = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [showHierarchy, setShowHierarchy] = useState(false);

  const hierarchy = getHierarchy(tasks)

  useEffect(() => {
    const importTasks = async () => {
      const taskModules = import.meta.glob('./tasks/**/*.jsx');
      const loadedTasks = [];

      for (const path in taskModules) {
        try {
          const module = await taskModules[path]();
          const pathParts = path.split('/');
          const taskId = pathParts[2];
          const fileName = pathParts.pop();

          loadedTasks.push({
            id: taskId,
            name: fileName,
            component: module.default,
            fullPath: path,
            isValid: !!module.default
          });
        } catch (error) {
          console.error(`Error loading module at ${path}:`, error);
          loadedTasks.push({
            id: path,
            name: path.split('/').pop(),
            fullPath: path,
            isValid: false
          });
        }
      }

      setTasks(loadedTasks.sort((a, b) => a.fullPath.localeCompare(b.fullPath)));
      if (loadedTasks.length > 0) {
        setCurrentTask(loadedTasks.find(task => task.isValid) || loadedTasks[0]);
      }
    };

    importTasks();
  }, []);

  const onTaskClick = (taskContent) => () => {
    setCurrentTask(taskContent);
    if (!taskContent.isValid) {
      console.warn(`Invalid or empty task: ${taskContent.fullPath}`);
    }
  }

  const FolderHierarchy = () => {
    const renderFolder = (folder, path = '') => {
      return (
        <ul className="pl-4">
          {Object.entries(folder).map(([name, content]) => (
            <li key={`${path}/${name}`} className="my-1">
              {typeof content === 'object' && !content.fullPath ? (
                <>
                  <span className="flex items-center text-white">
                    <FolderTree size={16} className="mr-1" />
                    {name}
                  </span>
                  {renderFolder(content, `${path}/${name}`)}
                </>
              ) : (
                <span
                  className={`flex items-center cursor-pointer ${content.isValid
                    ? currentTask && content.fullPath === currentTask.fullPath
                      ? 'font-bold text-green-400 hover:text-green-400'
                      : 'text-white hover:text-green-200'
                    : 'text-yellow-300 hover:text-yellow-100'
                    }`}
                  onClick={onTaskClick(content)}
                >
                  {content.isValid ? (
                    <File size={16} className="mr-1" />
                  ) : (
                    <AlertTriangle size={16} className="mr-1" />
                  )}
                  {name}
                </span>
              )}
            </li>
          ))}
        </ul>
      );
    };

    return renderFolder(hierarchy);
  };

  const allModels = Object.entries(hierarchy?.['.']?.tasks[currentTask?.id] || {})

  const taskSelection = (<div className='bg-slate-400 bg-opacity-10 fixed bottom-4 z-10 left-4 p-1'>
    <button
      onClick={() => setShowHierarchy((prev) => !prev)}
      className="p-2 bg-black bg-opacity-10 rounded "
    >
      {currentTask && (
        <>
          Task {currentTask.id}: <span className="font-bold">{currentTask.name}</span>
        </>
      )}

    </button>

    <div className='flex justify-between mt-2'>
      {allModels?.map(([fileName, content]) => {
        return <button className={`${content.name === currentTask.name ? 'hidden' : ''} rounded bg-slate-700 bg-opacity-5 p-1`} key={`${currentTask?.id}_${fileName}`} onClick={onTaskClick(content)}>{fileName}</button>
      })}
    </div>
  </div>)

  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="flex-grow">
        {currentTask && currentTask.isValid && currentTask.component && (
          <currentTask.component />
        )}
        {currentTask && !currentTask.isValid && (
          <div className="text-yellow-800 flex items-center">
            <AlertTriangle size={24} className="mr-2" />
            This task is invalid or empty. Please check the file: {currentTask.fullPath}
          </div>
        )}
      </div>

      {taskSelection}

      {showHierarchy && (
        <div className="fixed bottom-16 left-4 p-4 bg-black bg-opacity-75 backdrop-blur-md rounded max-h-[70vh] w-[300px] overflow-auto">
          <h3 className="text-lg font-semibold mb-2 text-white">Select Preview File</h3>
          <FolderHierarchy />
        </div>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Preview_Runner_Do_Not_Edit />
  </StrictMode>
);