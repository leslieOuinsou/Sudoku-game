// Constantes pour les niveaux de difficulté
export const DIFFICULTY_LEVELS = {
  easy: { name: 'Facile', cellsToRemove: 30 },
  medium: { name: 'Moyen', cellsToRemove: 40 },
  hard: { name: 'Difficile', cellsToRemove: 50 },
  expert: { name: 'Expert', cellsToRemove: 60 }
};

// Cache pour les grilles vides
const emptyBoardCache = Array(9).fill().map(() => Array(9).fill(0));

// Générer une grille vide 9x9 (optimisé avec cache)
export const createEmptyBoard = () => {
  return emptyBoardCache.map(row => [...row]);
};

// Vérifier si un nombre est valide dans une position (optimisé)
export const isValid = (grid, row, col, num) => {
  // Vérifier la ligne
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Vérifier la colonne
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Vérifier la boîte 3x3 (optimisé avec calcul direct)
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
};

// Algorithme de résolution du Sudoku (backtracking optimisé)
export const solveSudoku = (grid) => {
  const emptyCells = [];
  
  // Trouver toutes les cellules vides d'abord
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
  }
  
  // Fonction récursive optimisée
  const solve = (index) => {
    if (index === emptyCells.length) {
      return true;
    }
    
    const [row, col] = emptyCells[index];
    
    for (let num = 1; num <= 9; num++) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        if (solve(index + 1)) {
          return true;
        }
        grid[row][col] = 0;
      }
    }
    
    return false;
  };
  
  return solve(0);
};

// Générer une grille Sudoku valide (optimisé)
export const generateSudoku = (difficulty = 'medium') => {
  const board = createEmptyBoard();
  const solution = createEmptyBoard();
  
  // Remplir la diagonale principale avec des nombres aléatoires
  for (let i = 0; i < 9; i++) {
    const num = Math.floor(Math.random() * 9) + 1;
    board[i][i] = num;
    solution[i][i] = num;
  }
  
  // Résoudre le Sudoku
  solveSudoku(solution);
  
  // Copier la solution dans le plateau
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      board[i][j] = solution[i][j];
    }
  }
  
  // Retirer des nombres selon la difficulté (optimisé)
  const cellsToRemove = DIFFICULTY_LEVELS[difficulty].cellsToRemove;
  const positions = [];
  
  // Créer un tableau de toutes les positions
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }
  
  // Mélanger les positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  // Retirer les cellules
  for (let i = 0; i < cellsToRemove; i++) {
    const [row, col] = positions[i];
    board[row][col] = 0;
  }
  
  return { board, solution };
};

// Vérifier si le jeu est gagné (optimisé)
export const checkWin = (currentBoard, solution) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (currentBoard[i][j] !== solution[i][j]) {
        return false;
      }
    }
  }
  return true;
};

// Formater le temps en format MM:SS (optimisé)
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Fonction utilitaire pour calculer la progression
export const calculateProgress = (board) => {
  return board.flat().filter(cell => cell !== 0).length;
};

// Fonction utilitaire pour vérifier si une cellule est modifiable
export const isCellEditable = (board, row, col) => {
  return board[row][col] === 0;
}; 