import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useGame } from '../context/GameContext';
import { Trophy, TrendingUp, ArrowRight } from 'lucide-react';

const RoundEnd = () => {
  const { gameState, updateGameState, nextRound } = useGame();
  
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

  return (
    <div className="min-h-screen p-4 py-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Round Complete Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Badge className="px-6 py-2 text-lg bg-success text-white font-bold">
            ¡Ronda {gameState.currentRound} Completada!
          </Badge>
        </motion.div>

        {/* Scores Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="paper-card border-2 border-border">
            <CardContent className="p-8 space-y-6 relative z-10">
              {/* Title */}
              <div className="text-center space-y-2">
                <Trophy className="w-12 h-12 mx-auto text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Puntajes
                </h1>
              </div>

              {/* Score Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-6 rounded-xl border-2 ${
                    leadingTeam === 'A'
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground font-semibold">Equipo A</div>
                    <div className="text-5xl font-bold text-primary">
                      {gameState.scores.A}
                    </div>
                    {leadingTeam === 'A' && (
                      <Badge className="bg-primary text-primary-foreground">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Líder
                      </Badge>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-6 rounded-xl border-2 ${
                    leadingTeam === 'B'
                      ? 'bg-accent/10 border-accent'
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground font-semibold">Equipo B</div>
                    <div className="text-5xl font-bold text-accent">
                      {gameState.scores.B}
                    </div>
                    {leadingTeam === 'B' && (
                      <Badge className="bg-accent text-accent-foreground">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Líder
                      </Badge>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Status Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-4 border-t border-border"
              >
                {leadingTeam ? (
                  <p className="text-lg font-medium">
                    Equipo {leadingTeam} va{' '}
                    <span
                      className={leadingTeam === 'A' ? 'text-primary' : 'text-accent'}
                    >
                      {scoreDiff} punto{scoreDiff !== 1 ? 's' : ''}
                    </span>{' '}
                    adelante
                  </p>
                ) : (
                  <p className="text-lg font-medium text-foreground">
                    ¡Están empatados!
                  </p>
                )}
              </motion.div>

              {/* Next Round Info */}
              {hasMoreRounds && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center space-y-2 pt-2"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Próxima: Ronda {gameState.currentRound + 1}</span>
                  </div>
                  {timeRemaining && (
                    <p className="text-xs text-primary font-semibold">
                      ⏱️ Tiempo bonus: {timeRemaining}s restantes
                    </p>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={handleNext}
            size="lg"
            className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-16 text-lg shadow-lg"
          >
            {hasMoreRounds ? 'Siguiente Ronda' : 'Ver Resultado Final'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RoundEnd;