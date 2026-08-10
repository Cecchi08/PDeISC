import { useState } from 'react';
import { useTheme } from './theme/context';
import './App.css';

// Componente para cada celda (cuadrado) del tablero
function Square({ value, onSquareClick }: { value: string | null, onSquareClick: () => void }) {
  // Asigna clase css para colorear X u O
  const valueClass = value === 'X' ? 'x' : value === 'O' ? 'o' : '';
  return (
    <button className={`square ${valueClass}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Componente del Tablero que renderiza las 9 celdas y el estado del juego
function Board({ xIsNext, squares, onPlay }: { xIsNext: boolean, squares: (string | null)[], onPlay: (nextSquares: (string | null)[]) => void }) {
  
  // Maneja el clic en una celda específica
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  // Determina el estado actual para mostrar en el título del tablero
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = '🏆 Ganador: ' + winner;
  } else if (!squares.includes(null)) {
    status = '🤝 Empate';
  } else {
    status = 'Siguiente: ' + (xIsNext ? 'X' : 'O');
  }

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

// Componente principal del Juego
export default function Game() {
  const { dark, toggle } = useTheme();
  
  // Estado para el historial de movimientos y el turno actual
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Agrega un nuevo movimiento al historial
  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Reinicia el tablero y borra todo el historial
  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // Permite viajar en el tiempo a movimientos anteriores
  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  // Genera la lista de botones para viajar en el tiempo
  const moves = history.map((_squares, move) => {
    let description;
    if (move > 0) {
      description = 'Ir al mov. #' + move;
    } else {
      description = 'Reiniciar juego';
    }
    return (
      <li key={move}>
        <button
          className="move-btn"
          onClick={() => (move === 0 ? resetGame() : jumpTo(move))}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="app">
      {/* Botón flotante para cambiar de tema */}
      <button className="theme-toggle" onClick={toggle} title="Cambiar tema">
        {dark ? '☀️' : '🌙'}
      </button>

      <h1 className="page-title">Ta-Te-Ti Arcade</h1>
      <p className="subtitle">Desafía a tu oponente y conquista la grilla de neón.</p>

      {/* Contenedor principal que agrupa el tablero y el historial */}
      <div className="game-container">

        {/* Panel central con el tablero */}
        <div className="main-panel">
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          </div>
        </div>
        
        {/* Panel derecho con el historial de la partida */}
        <div className="history-panel">
          <div className="game-info">
            <h3>Historial</h3>
            <ol>{moves}</ol>
          </div>
        </div>
        
      </div>
    </div>
  );
}

// Función auxiliar para calcular si hay un ganador
function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
    [0, 4, 8], [2, 4, 6],            // Diagonales
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
