import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

const STORAGE_KEY = 'papelito_game_state';

const initialState = {
  screen: 'home',
  config: {
    turnTime: 60,
    papelitosPerPlayer: 3,
    soundEnabled: true,
  },
  players: [],
  teams: { A: [], B: [] },
  papelitos: [],
  currentRound: 1,
  currentTeam: 'A',
  currentPlayerIndex: 0,
  scores: { A: 0, B: 0 },
  roundPools: {},
  guessedInRound: [],
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updates) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(initialState);
  };

  const startNewRound = () => {
    // Create pool for new round with all papelitos not guessed yet in this round
    const pool = [...gameState.papelitos].sort(() => Math.random() - 0.5);
    setGameState((prev) => ({
      ...prev,
      roundPools: {
        ...prev.roundPools,
        [prev.currentRound]: pool,
      },
      guessedInRound: [],
    }));
  };

  const markPapelitoCorrecto = (papelito) => {
    setGameState((prev) => {
      const newPool = prev.roundPools[prev.currentRound].filter(
        (p) => p.id !== papelito.id
      );
      return {
        ...prev,
        scores: {
          ...prev.scores,
          [prev.currentTeam]: prev.scores[prev.currentTeam] + 1,
        },
        roundPools: {
          ...prev.roundPools,
          [prev.currentRound]: newPool,
        },
        guessedInRound: [...prev.guessedInRound, papelito.id],
      };
    });
  };

  const nextTurn = () => {
    setGameState((prev) => {
      const nextTeam = prev.currentTeam === 'A' ? 'B' : 'A';
      const teamSize = prev.teams[nextTeam].length;
      let nextPlayerIndex = prev.currentPlayerIndex;
      
      if (nextTeam === 'A' && prev.currentTeam === 'B') {
        nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.teams.A.length;
      } else if (nextTeam === 'B' && prev.currentTeam === 'A') {
        nextPlayerIndex = prev.currentPlayerIndex % prev.teams.B.length;
      }

      return {
        ...prev,
        currentTeam: nextTeam,
        currentPlayerIndex: nextPlayerIndex,
      };
    });
  };

  const nextRound = () => {
    setGameState((prev) => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      guessedInRound: [],
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        updateGameState,
        resetGame,
        startNewRound,
        markPapelitoCorrecto,
        nextTurn,
        nextRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};