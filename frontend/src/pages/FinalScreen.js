import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useGame } from '../context/GameContext';
import { Trophy, Sparkles, Home, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const FinalScreen = () => {
  const { gameState, resetGame, updateGameState } = useGame();

  const winnerTeam =
    gameState.scores.A > gameState.scores.B
      ? 'A'
      : gameState.scores.B > gameState.scores.A
      ? 'B'
      : null;
  const winnerScore = winnerTeam ? gameState.scores[winnerTeam] : null;
  const loserScore = winnerTeam
    ? gameState.scores[winnerTeam === 'A' ? 'B' : 'A']
    : null;
  const isDraw = !winnerTeam;

  // Trigger confetti on mount
  React.useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#E07B53', '#D99E82', '#E8A87C'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#E07B53', '#D99E82', '#E8A87C'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleNewGame = () => {
    resetGame();
    updateGameState({ screen: 'home' });
  };

  return (
    <div className="min-h-screen p-4 py-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative Elements */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full"
        animate={{ scale: [1, 1.3, 1], rotate: [360, 180, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-2xl w-full space-y-6 relative z-10">
        {/* Winner Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <Trophy className="w-20 h-20 mx-auto text-primary mb-4" />
          </motion.div>
          <Badge className="px-6 py-2 text-xl bg-primary text-primary-foreground font-bold">
            {isDraw ? '¡Empate!' : `¡Equipo ${winnerTeam} Gana!`}
          </Badge>
        </motion.div>

        {/* Winner Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="paper-elevated border-2 border-primary bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-8 space-y-8 relative z-10">
              {/* Winner Display */}
              {!isDraw ? (
                <div className="text-center space-y-4">
                  <Sparkles className="w-10 h-10 mx-auto text-primary" />
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    {gameState.teamNames?.[winnerTeam] || `Equipo ${winnerTeam}`}
                  </h1>
                  <div className="space-y-1">
                    <p className="text-6xl md:text-7xl font-bold text-primary">
                      {winnerScore}
                    </p>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">
                      Puntos
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    ¡Empate Perfecto!
                  </h1>
                  <div className="space-y-1">
                    <p className="text-6xl md:text-7xl font-bold text-primary">
                      {gameState.scores.A}
                    </p>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">
                      Puntos cada uno
                    </p>
                  </div>
                </div>
              )}

              {/* Final Scores */}
              <div className="pt-6 border-t border-border">
                <h3 className="text-center text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                  Puntaje Final
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-6 rounded-xl border-2 text-center ${
                      winnerTeam === 'A'
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <div className="text-sm text-muted-foreground font-semibold mb-2">
                      Equipo A
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      {gameState.scores.A}
                    </div>
                  </div>
                  <div
                    className={`p-6 rounded-xl border-2 text-center ${
                      winnerTeam === 'B'
                        ? 'bg-accent/10 border-accent'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <div className="text-sm text-muted-foreground font-semibold mb-2">
                      Equipo B
                    </div>
                    <div className="text-4xl font-bold text-accent">
                      {gameState.scores.B}
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-4 pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Team A */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">Equipo A</h4>
                    <div className="space-y-1">
                      {gameState.teams.A.map((player) => (
                        <div
                          key={player}
                          className="text-sm py-1 px-2 bg-primary/5 rounded border border-primary/20"
                        >
                          {player}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Team B */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">Equipo B</h4>
                    <div className="space-y-1">
                      {gameState.teams.B.map((player) => (
                        <div
                          key={player}
                          className="text-sm py-1 px-2 bg-accent/5 rounded border border-accent/20"
                        >
                          {player}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            onClick={handleNewGame}
            size="lg"
            className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-16 text-lg shadow-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Nueva Partida
          </Button>
          <Button
            onClick={() => updateGameState({ screen: 'home' })}
            variant="outline"
            size="lg"
            className="w-full btn-paper border-2 font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al Inicio
          </Button>
        </motion.div>

        {/* Footer Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground"
        >
          ¡Gracias por jugar Papelito! 🎮
        </motion.p>
      </div>
    </div>
  );
};

export default FinalScreen;