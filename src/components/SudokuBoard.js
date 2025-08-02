import React, { useState, useCallback, useMemo } from 'react';
import './SudokuBoard.css';
import { 
  DIFFICULTY_LEVELS, 
  createEmptyBoard, 
  generateSudoku, 
  checkWin, 
  formatTime 
} from '../utils/sudokuUtils';
import { useTimer } from '../hooks/useTimer';

const SudokuBoard = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [solution, setSolution] = useState(createEmptyBoard());
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const { timer, isTimerRunning, startTimer, stopTimer, resetTimer } = useTimer();

  // Mémoiser les valeurs calculées
  const gameInfo = useMemo(() => ({
    timer: formatTime(timer),
    mistakes,
    difficulty: DIFFICULTY_LEVELS[difficulty].name,
    progress: board.flat().filter(cell => cell !== 0).length
  }), [timer, mistakes, difficulty, board]);

  // Optimiser la génération du Sudoku
  const handleGenerateSudoku = useCallback(() => {
    const { board: newBoard, solution: newSolution } = generateSudoku(difficulty);
    
    setBoard(newBoard);
    setSolution(newSolution);
    setGameStarted(true);
    resetTimer();
    startTimer();
    setMistakes(0);
    setGameWon(false);
    setSelectedCell(null);
    setShowMenu(false);
  }, [difficulty, resetTimer, startTimer]);

  // Optimiser la sélection de cellule
  const handleCellClick = useCallback((row, col) => {
    if (!gameStarted || gameWon) return;
    setSelectedCell({ row, col });
  }, [gameStarted, gameWon]);

  // Optimiser la saisie de nombre
  const handleNumberInput = useCallback((number) => {
    if (!selectedCell || !gameStarted || gameWon) return;
    
    const { row, col } = selectedCell;
    
    // Vérifier si la cellule est modifiable (pas une cellule initiale)
    const initialBoard = board.map(row => row.map(cell => cell));
    if (initialBoard[row][col] !== 0) return;
    
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      newBoard[row][col] = number;
      
      // Vérifier si le nombre est correct
      if (number !== solution[row][col]) {
        setMistakes(prev => prev + 1);
      }
      
      // Vérifier si le jeu est gagné
      if (checkWin(newBoard, solution)) {
        setGameWon(true);
        stopTimer();
      }
      
      return newBoard;
    });
  }, [selectedCell, gameStarted, gameWon, solution, stopTimer]);

  // Optimiser la réinitialisation
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setSolution(createEmptyBoard());
    setSelectedCell(null);
    setGameStarted(false);
    resetTimer();
    setMistakes(0);
    setGameWon(false);
    setShowMenu(false);
    setShowHelp(false);
    setShowStats(false);
  }, [resetTimer]);

  // Optimiser la navigation
  const goToMainMenu = useCallback(() => {
    setShowMenu(false);
    setShowHelp(false);
    setShowStats(false);
    resetGame();
  }, [resetGame]);

  const showHelpModal = useCallback(() => {
    setShowHelp(true);
    setShowMenu(false);
  }, []);

  const showStatsModal = useCallback(() => {
    setShowStats(true);
    setShowMenu(false);
  }, []);

  // Optimiser la sauvegarde
  const saveGame = useCallback(() => {
    const gameState = {
      board,
      solution,
      difficulty,
      timer,
      mistakes,
      date: new Date().toISOString()
    };
    localStorage.setItem('sudokuGameState', JSON.stringify(gameState));
    alert('Partie sauvegardée !');
  }, [board, solution, difficulty, timer, mistakes]);

  // Optimiser le chargement
  const loadGame = useCallback(() => {
    const savedState = localStorage.getItem('sudokuGameState');
    if (savedState) {
      const gameState = JSON.parse(savedState);
      setBoard(gameState.board);
      setSolution(gameState.solution);
      setDifficulty(gameState.difficulty);
      setGameStarted(true);
      setMistakes(gameState.mistakes);
      startTimer();
      setShowMenu(false);
    } else {
      alert('Aucune partie sauvegardée trouvée.');
    }
  }, [startTimer]);

  // Optimiser le partage
  const shareGame = useCallback(() => {
    const shareData = {
      title: 'Jeu Sudoku',
      text: `J'ai résolu un Sudoku ${DIFFICULTY_LEVELS[difficulty].name} en ${formatTime(timer)} avec ${mistakes} erreurs !`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.text);
      alert('Informations copiées dans le presse-papiers !');
    }
  }, [difficulty, timer, mistakes]);

  // Mémoiser les boutons de difficulté
  const difficultyButtons = useMemo(() => 
    Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
      <button 
        key={key}
        onClick={() => setDifficulty(key)} 
        className={difficulty === key ? 'active' : ''}
      >
        {level.name}
      </button>
    )), [difficulty]);

  // Mémoiser les boutons numériques
  const numberButtons = useMemo(() => 
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
      <button
        key={num}
        className="number-button"
        onClick={() => handleNumberInput(num)}
      >
        {num}
      </button>
    )), [handleNumberInput]);

  // Mémoiser les cellules du plateau
  const boardCells = useMemo(() => 
    board.map((row, rowIndex) => (
      <div key={rowIndex} className="board-row">
        {row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'selected' : ''} ${
              (rowIndex + 1) % 3 === 0 ? 'border-bottom' : ''
            } ${(colIndex + 1) % 3 === 0 ? 'border-right' : ''} ${
              board[rowIndex][colIndex] === 0 ? 'empty' : 'filled'
            }`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {cell !== 0 ? cell : ''}
          </div>
        ))}
      </div>
    )), [board, selectedCell, handleCellClick]);

  return (
    <div className="sudoku-container">
      {/* Header avec navigation */}
      <div className="game-header">
        <div className="header-top">
          <button 
            className="nav-button menu-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰ Menu
          </button>
          <h1>Sudoku</h1>
          <button 
            className="nav-button help-button"
            onClick={showHelpModal}
          >
            ❓ Aide
          </button>
        </div>
        
        <div className="game-info">
          <div className="timer">Temps: {gameInfo.timer}</div>
          <div className="mistakes">Erreurs: {gameInfo.mistakes}</div>
          <div className="difficulty">Niveau: {gameInfo.difficulty}</div>
        </div>
      </div>

      {/* Menu de navigation */}
      {showMenu && (
        <div className="navigation-menu">
          <div className="menu-content">
            <h3>Menu Principal</h3>
            <div className="menu-buttons">
              <button onClick={handleGenerateSudoku} className="menu-btn primary">
                🎮 Nouvelle Partie
              </button>
              <button onClick={loadGame} className="menu-btn secondary">
                📂 Charger Partie
              </button>
              {gameStarted && (
                <button onClick={saveGame} className="menu-btn secondary">
                  💾 Sauvegarder
                </button>
              )}
              <button onClick={showStatsModal} className="menu-btn secondary">
                📊 Statistiques
              </button>
              <button onClick={shareGame} className="menu-btn secondary">
                📤 Partager
              </button>
              <button onClick={goToMainMenu} className="menu-btn danger">
                🏠 Menu Principal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'aide */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>❓ Comment Jouer</h2>
            <div className="help-content">
              <h3>Règles du Sudoku :</h3>
              <ul>
                <li>Remplissez chaque ligne avec les chiffres 1 à 9</li>
                <li>Remplissez chaque colonne avec les chiffres 1 à 9</li>
                <li>Remplissez chaque boîte 3x3 avec les chiffres 1 à 9</li>
                <li>Chaque chiffre ne peut apparaître qu'une seule fois par ligne, colonne et boîte</li>
              </ul>
              
              <h3>Contrôles :</h3>
              <ul>
                <li><strong>Clic</strong> : Sélectionner une cellule</li>
                <li><strong>Chiffres 1-9</strong> : Entrer un nombre</li>
                <li><strong>Effacer</strong> : Supprimer un nombre</li>
                <li><strong>Solution</strong> : Voir la solution complète</li>
              </ul>
              
              <h3>Niveaux de difficulté :</h3>
              <ul>
                <li><strong>Facile</strong> : 30 cellules vides</li>
                <li><strong>Moyen</strong> : 40 cellules vides</li>
                <li><strong>Difficile</strong> : 50 cellules vides</li>
                <li><strong>Expert</strong> : 60 cellules vides</li>
              </ul>
            </div>
            <button onClick={() => setShowHelp(false)} className="close-button">
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal des statistiques */}
      {showStats && (
        <div className="modal-overlay" onClick={() => setShowStats(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>📊 Statistiques</h2>
            <div className="stats-content">
              <div className="stat-item">
                <span className="stat-label">Temps actuel :</span>
                <span className="stat-value">{gameInfo.timer}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Erreurs :</span>
                <span className="stat-value">{gameInfo.mistakes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Niveau :</span>
                <span className="stat-value">{gameInfo.difficulty}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Progression :</span>
                <span className="stat-value">{gameInfo.progress}/81</span>
              </div>
            </div>
            <button onClick={() => setShowStats(false)} className="close-button">
              Fermer
            </button>
          </div>
        </div>
      )}

      {!gameStarted ? (
        <div className="start-screen">
          <h2>Choisissez la difficulté</h2>
          <div className="difficulty-buttons">
            {difficultyButtons}
          </div>
          <button className="start-button" onClick={handleGenerateSudoku}>
            Commencer
          </button>
        </div>
      ) : (
        <>
          <div className="board-container">
            <div className="sudoku-board">
              {boardCells}
            </div>
          </div>

          <div className="number-pad">
            {numberButtons}
            <button
              className="number-button clear"
              onClick={() => handleNumberInput(0)}
            >
              Effacer
            </button>
          </div>

          <div className="game-controls">
            <button className="control-button" onClick={resetGame}>
              Nouvelle Partie
            </button>
            <button className="control-button" onClick={() => setBoard(solution)}>
              Solution
            </button>
            <button className="control-button" onClick={saveGame}>
              Sauvegarder
            </button>
            <button className="control-button" onClick={shareGame}>
              Partager
            </button>
          </div>

          {gameWon && (
            <div className="win-message">
              <h2>Félicitations !</h2>
              <p>Vous avez résolu le Sudoku en {gameInfo.timer}</p>
              <p>Erreurs: {gameInfo.mistakes}</p>
              <div className="win-buttons">
                <button onClick={resetGame}>Nouvelle Partie</button>
                <button onClick={shareGame}>Partager</button>
                <button onClick={goToMainMenu}>Menu Principal</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SudokuBoard; 