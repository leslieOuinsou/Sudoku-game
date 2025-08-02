// Constantes du jeu Sudoku
export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;

// Niveaux de difficulté
export const DIFFICULTY_LEVELS = {
  easy: { name: 'Facile', cellsToRemove: 30, color: '#28a745' },
  medium: { name: 'Moyen', cellsToRemove: 40, color: '#ffc107' },
  hard: { name: 'Difficile', cellsToRemove: 50, color: '#fd7e14' },
  expert: { name: 'Expert', cellsToRemove: 60, color: '#dc3545' }
};

// Messages du jeu
export const GAME_MESSAGES = {
  congratulations: 'Félicitations !',
  winMessage: 'Vous avez résolu le Sudoku en',
  errors: 'Erreurs',
  newGame: 'Nouvelle Partie',
  start: 'Commencer',
  chooseDifficulty: 'Choisissez la difficulté',
  clear: 'Effacer',
  solution: 'Solution'
};

// Couleurs du thème
export const THEME_COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#495057',
  white: '#ffffff',
  black: '#333333'
};

// Animations
export const ANIMATIONS = {
  fadeIn: 'fadeIn 0.5s ease-out',
  fadeInFast: 'fadeIn 0.3s ease-out',
  slideUp: 'slideUp 0.3s ease-out',
  bounce: 'bounce 0.6s ease-out'
};

// Breakpoints responsive
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024
}; 