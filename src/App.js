import { useState } from 'react';
import './App.css';

//edustaa jokaista laudan neliötä
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  //Event handeleri klikkaukselle
  function handleClick(i) {
    //onko voittajaa tai onko ruutu jo täytetty
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    //laittaa "X" tai "O" riippuen kenen vuoro on (xIsNext)
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    //kutsutaan onPlay funktio päivitetyillä ruuduilla
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !squares.includes(null) && !winner;

  //näyttää pelin tämän hetkisen statuksen
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isDraw) {
    status = 'It\'s a draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  //pelilaudan ja ruutujen renderöinti
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

//voitto ruutu jos on voittaja tai tasapeli
function WinnerScreen({ onReset }) {
  return (
    <div className="winner-screen">
      <button onClick={onReset}>Reset</button>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  //jos xIsNext on True on "X" vuoro
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);
  const isDraw = !currentSquares.includes(null) && !winner;

  //päivittää historia listaan nykyisen siirron ja kertoo kenen vuoro on seuraavaksi
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  //event handler pelin resettaukseen
  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  //pelin lopetus ruutu, ilmoittaa voittajan jos on, muuten tasapeli
  let resultScreen;
  if (winner) {
    resultScreen = <WinnerScreen result={`Winner: ${winner}`} onReset={handleReset} />;
  } else if (isDraw) {
    resultScreen = <WinnerScreen result="It's a draw!" onReset={handleReset} />;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        {resultScreen}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  //Määritetään kaikki tavat voittaa 
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  //Tsekataan onko jokaisessa ruudussa sama kuvio X tai O
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  //null jos ei ole voittajaa
  return null;
}