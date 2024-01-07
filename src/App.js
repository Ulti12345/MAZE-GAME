import { useState, useMemo, useEffect } from "react";
import { generateMaze, solve } from "./util";
import "./style.css";
import React from 'react';

function App() {
  const [gameId, setGameId] = useState(1);
  const [status, setStatus] = useState("playing");

  const [size, setSize] = useState(5);
  const [cheatMode, setCheatMode] = useState(false);

  const [userPosition, setUserPosition] = useState([0, 0]);

  const maze = useMemo(() => generateMaze(size, size), [size, gameId]);

  const solution = useMemo(() => {
    const s = new Set();
    const solutionPath = solve(maze, userPosition[0], userPosition[1]);
    solutionPath.forEach((path) => {
      const [x, y] = path;
      s.add(String(x) + "-" + String(y));
    });
    return s;
  }, [size, userPosition[0], userPosition[1], gameId]);

  useEffect(() => {
    const lastRow = maze.length - 1;
    const lastCol= maze[0].length - 1;
    if (userPosition[0] === lastRow && userPosition[1] === lastCol) {
      setStatus("won");
    }
  }, [userPosition[0], userPosition[1]]);

  const makeClassName = (i, j) => {
    const rows = maze.length;
    const cols = maze[0].length;
    let arr = [];
    if (maze[i][j][0] === 0) {
      arr.push("topWall");
    }
    if (maze[i][j][1] === 0) {
      arr.push("rightWall");
    }
    if (maze[i][j][2] === 0) {
      arr.push("bottomWall");
    }
    if (maze[i][j][3] === 0) {
      arr.push("leftWall");
    }
    if (i === rows - 1 && j === cols - 1) {
      arr.push("destination");
    }
    if (i === userPosition[0] && j === userPosition[1]) {
      arr.push("currentPosition");
    }

    if (cheatMode && solution.has(String(i) + "-" + String(j))) {
      arr.push("sol");
    }
    return arr.join(" ");
  };

  const handleMove = (e) => {
    e.preventDefault();
    if (status !== "playing") {
      return;
    }
    const key = e.code;

    const [i, j] = userPosition;
    if ((key === "ArrowUp" || key === "KeyW") && maze[i][j][0] === 1) {
      setUserPosition([i - 1, j]);
    }
    if ((key === "ArrowRight" || key === "KeyD") && maze[i][j][1] === 1) {
      setUserPosition([i, j + 1]);
    }
    if ((key === "ArrowDown" || key === "KeyS") && maze[i][j][2] === 1) {
      setUserPosition([i + 1, j]);
    }
    if ((key === "ArrowLeft" || key === "KeyA") && maze[i][j][3] === 1) {
      setUserPosition([i, j - 1]);
    }
  };

  /**const handleUpdateSettings = () => {
    setSize((prevSize) => Math.min(prevSize + 10, 40));;
    setUserPosition([0, 0]);
    setStatus("playing");
    setGameId(gameId + 1);
  };*/

  const handleUpdateSettings = () => {
      if (size === 20) {
        setStatus("won");
        alert("Congratulations! You've completed all levels! Press to try again.");
        setSize(5);
        setGameId(1);
      }
  
      setSize((prevSize) => (prevSize === 20 ? 5 : prevSize + 5));
      setUserPosition([0, 0]);
      setStatus("playing");
      setGameId((prevId) => prevId + 1);
    };
  

  const content = gameId === 1 ? (
    <div>
      <p>TUTORIAL</p>
      <p>Game Controls</p>
      <p>W,S,A,D or UP, LEFT, RIGHT, BOTTOM ARROW</p>
    </div>
  ) : (
    <p>Level {gameId - 1}</p>
  );

  return (
   <div className="App" onKeyDown={handleMove} tabIndex={-1}>
      {content}
      <table id="maze">
        <tbody>
          {maze.map((row, i) => (
            <tr key={`row-${i}`}>
              {row.map((cell, j) => (
                <td key={`cell-${i}-${j}`} className={makeClassName(i, j)}>
                  <div />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {status !== "playing" && (
        <div className="info" onClick={handleUpdateSettings}>
          <p>You won!</p>
          {gameId !== 4 && (
          <>
            <p>LEVEL {gameId} UNLOCKED - Click here to Continue</p>
          </>
          )}
        </div>
      )}
    </div>
  )};

/**
 * for demonstration purposes
 <div>
  <label htmlFor="cheatMode">Cheat mode</label>
  <input
    type="checkbox"
    name="cheatMode"
    onChange={(e) => setCheatMode(e.target.checked)}
  />
 </div>
 */

export default App