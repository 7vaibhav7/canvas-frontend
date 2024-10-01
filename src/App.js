import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontStyle, setFontStyle] = useState('normal');
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedText, setDraggedText] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });


  const drawText = (ctx, x, y, text, fontSize, fontStyle) => {
    ctx.font = `${fontStyle} ${fontSize}px Arial`;
    ctx.fillText(text, x, y);
  };


  const addText = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const x = 50; 
    const y = 100;

    drawText(ctx, x, y, text, fontSize, fontStyle);

    const newHistory = [...history, { text, x, y, fontSize, fontStyle }];
    setHistory(newHistory);
    setRedoStack([]);
  };

  
  const undo = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const lastItem = newHistory.pop();
      setHistory(newHistory);
      setRedoStack([...redoStack, lastItem]);
      redraw(newHistory);
    }
  };


  const redo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const lastUndone = newRedoStack.pop();
      setRedoStack(newRedoStack);

      const newHistory = [...history, lastUndone];
      setHistory(newHistory);
      redraw(newHistory);
    }
  };


  const redraw = (drawHistory) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawHistory.forEach(({ text, x, y, fontSize, fontStyle }) => {
      drawText(ctx, x, y, text, fontSize, fontStyle);
    });
  };

  
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    history.forEach((item, index) => {
   
      if (
        x >= item.x - 50 && x <= item.x + 50 &&
        y >= item.y - 20 && y <= item.y + 20
      ) {
        setDraggedText(index);
        setMousePos({ x, y });
        setIsDragging(true);
      }
    });
  };

 
  const handleMouseMove = (e) => {
    if (isDragging && draggedText !== null) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newHistory = [...history];
      newHistory[draggedText] = {
        ...newHistory[draggedText],
        x: x - 25,
        y: y + 10,
      };
      setHistory(newHistory);
      redraw(newHistory);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedText(null);
    }
  };

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        width="400"
        height="600"
        className="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addText}>Add Text</button>

        <label>Font Size:</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        />

        <label>Font Style:</label>
        <select
          value={fontStyle}
          onChange={(e) => setFontStyle(e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="bold">Bold</option>
          <option value="bold italic">Bold Italic</option>
        </select>

        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
    </div>
  );
}

export default App;
