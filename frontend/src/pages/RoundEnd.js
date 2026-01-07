import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useGame } from '../context/GameContext';
import { Trophy, TrendingUp, ArrowRight, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

const RoundEnd = () => {
  const { gameState, updateGameState, nextRound, resetGame } = useGame();
  
  // Detectar si venimos de una ronda anterior con tiempo restante
  const savedTime = sessionStorage.getItem('remainingTime');
  const timeRemaining = savedTime && parseInt(savedTime) > 0 ? parseInt(savedTime) : null;

  const hasMoreRounds = gameState.currentRound < 3;
  const leadingTeam = gameState.scores.A > gameState.scores.B ? 'A' : gameState.scores.B > gameState.scores.A ? 'B' : null;
  const scoreDiff = Math.abs(gameState.scores.A - gameState.scores.B);

  const handleNext = () => {
    if (hasMoreRounds) {
      nextRound();
      updateGameState({ screen: 'round-start' });
    } else {
      updateGameState({ screen: 'final' });
    }
  };

  const handleRestart = () => {
    sessionStorage.clear();
    resetGame();
  };

  return (
    <div className="h-screen p-3 flex flex-col overflow-hidden">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 gap-3 justify-center">
        {/* Round Complete Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <Badge className="px-4 py-1 text-sm bg-success text-white font-bold">
            ¡Ronda {gameState.currentRound} Completada!
          </Badge>
        </motion.div>

        {/* Scores Card - Compact */}
        <Card className="paper-card border border-border">
          <CardContent className="p-4 space-y-4 relative z-10">
            {/* Title */}
            <div className="text-center">
              <Trophy className="w-8 h-8 mx-auto text-primary mb-1" />
              <h1 className="text-xl font-bold text-foreground">Puntajes</h1>
            </div>

            {/* Score Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-lg border ${
                  leadingTeam === 'A'
                    ? 'bg-primary/10 border-primary'
                    : 'bg-muted border-border'
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-xs text-muted-foreground font-semibold">{gameState.teamNames?.A || 'Equipo A'}</div>
                  <div className="text-3xl font-bold text-primary">
                    {gameState.scores.A}
                  </div>
                  {leadingTeam === 'A' && (
                    <Badge className="bg-primary text-primary-foreground text-xs px-1.5">
                      <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                      Líder
                    </Badge>
                  )}
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border ${
                  leadingTeam === 'B'
                    ? 'bg-accent/10 border-accent'
                    : 'bg-muted border-border'
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-xs text-muted-foreground font-semibold">{gameState.teamNames?.B || 'Equipo B'}</div>
                  <div className="text-3xl font-bold text-accent">
                    {gameState.scores.B}
                  </div>
                  {leadingTeam === 'B' && (
                    <Badge className="bg-accent text-accent-foreground text-xs px-1.5">
                      <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                      Líder
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="text-center py-2 border-t border-border">
              {leadingTeam ? (
                <p className="text-sm font-medium">
                  {gameState.teamNames?.[leadingTeam] || `Equipo ${leadingTeam}`} va{' '}
                  <span className={leadingTeam === 'A' ? 'text-primary' : 'text-accent'}>
                    +{scoreDiff}
                  </span>{' '}
                  adelante
                </p>
              ) : (
                <p className="text-sm font-medium text-foreground">¡Empate!</p>
              )}
            </div>

            {/* Next Round Info */}
            {hasMoreRounds && (
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full border border-border text-xs">
                  <ArrowRight className="w-3 h-3 text-primary" />
                  <span className="font-medium">Próxima: Ronda {gameState.currentRound + 1}</span>
                </div>
                {timeRemaining && (
                  <p className="text-xs text-primary font-semibold mt-1">
                    ⏱️ Bonus: {timeRemaining}s
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Buttons - Compact */}
        <div className="space-y-2">
          <Button
            onClick={handleNext}
            size="lg"
            className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base shadow-lg"
          >
            {hasMoreRounds ? 'Siguiente Ronda' : 'Ver Resultado'}
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-destructive h-8 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reiniciar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="paper-card max-w-xs">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base">¿Reiniciar partida?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  Se perderá todo el progreso.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="btn-paper h-9 text-sm">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleRestart}
                  className="btn-paper bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 text-sm"
                >
                  Reiniciar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default RoundEnd;