import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Home from './pages/Home';
import Configuration from './pages/Configuration';
import Teams from './pages/Teams';
import PapelitosInput from './pages/PapelitosInput';
import RoundStart from './pages/RoundStart';
import TurnScreen from './pages/TurnScreen';
import RoundEnd from './pages/RoundEnd';
import FinalScreen from './pages/FinalScreen';
import { GameProvider, useGame } from './context/GameContext';
import './App.css';

const AppContent = () => {
  const { gameState } = useGame();

  const renderScreen = () => {
    switch (gameState.screen) {
      case 'home':
        return <Home />;
      case 'configuration':
        return <Configuration />;
      case 'teams':
        return <Teams />;
      case 'papelitos-input':
        return <PapelitosInput />;
      case 'round-start':
        return <RoundStart />;
      case 'turn':
        return <TurnScreen />;
      case 'round-end':
        return <RoundEnd />;
      case 'final':
        return <FinalScreen />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      <Toaster position="top-center" richColors />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </Router>
  );
};

export default App;