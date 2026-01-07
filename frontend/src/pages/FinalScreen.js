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
    <div className="h-screen p-3 flex flex-col overflow-hidden relative">
      {/* Decorative Elements - Smaller */}
      <motion.div
        className="absolute top-5 left-5 w-20 h-20 bg-primary/10 rounded-full"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-10 right-5 w-16 h-16 bg-accent/10 rounded-full"
        animate={{ scale: [1, 1.3, 1], rotate: [360, 180, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 gap-3 justify-center relative z-10">
        {/* Winner Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-center"
        >
          <Trophy className="w-12 h-12 mx-auto text-primary mb-2" />
          <Badge className="px-4 py-1 text-base bg-primary text-primary-foreground font-bold">
            {isDraw ? '¡Empate!' : `¡${gameState.teamNames?.[winnerTeam] || `Equipo ${winnerTeam}`} Gana!`}
          </Badge>
        </motion.div>

        {/* Winner Card - Compact */}
        <Card className="paper-elevated border border-primary bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-4 space-y-4 relative z-10">
            {/* Winner Display */}
            {!isDraw ? (
              <div className="text-center space-y-2">
                <Sparkles className="w-6 h-6 mx-auto text-primary" />
                <p className="text-4xl font-bold text-primary">{winnerScore}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Puntos</p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">¡Empate!</h1>
                <p className="text-4xl font-bold text-primary">{gameState.scores.A}</p>
                <p className="text-xs text-muted-foreground">cada uno</p>
              </div>
            )}

            {/* Final Scores - Compact */}
            <div className="pt-3 border-t border-border">
              <h3 className="text-center text-xs font-semibold text-muted-foreground mb-2 uppercase">
                Puntaje Final
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`p-3 rounded-lg border text-center ${
                    winnerTeam === 'A'
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="text-xs text-muted-foreground font-semibold mb-1">
                    {gameState.teamNames?.A || 'Equipo A'}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {gameState.scores.A}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg border text-center ${
                    winnerTeam === 'B'
                      ? 'bg-accent/10 border-accent'
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="text-xs text-muted-foreground font-semibold mb-1">
                    {gameState.teamNames?.B || 'Equipo B'}
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    {gameState.scores.B}
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members - Compact */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h4 className="font-semibold text-xs text-muted-foreground mb-1">
                  {gameState.teamNames?.A || 'Equipo A'}
                </h4>
                <div className="space-y-0.5">
                  {gameState.teams.A.map((player) => (
                    <div
                      key={player}
                      className="text-xs py-0.5 px-1.5 bg-primary/5 rounded border border-primary/20 truncate"
                    >
                      {player}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-xs text-muted-foreground mb-1">
                  {gameState.teamNames?.B || 'Equipo B'}
                </h4>
                <div className="space-y-0.5">
                  {gameState.teams.B.map((player) => (
                    <div
                      key={player}
                      className="text-xs py-0.5 px-1.5 bg-accent/5 rounded border border-accent/20 truncate"
                    >
                      {player}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons - Compact */}
        <div className="space-y-2">
          <Button
            onClick={handleNewGame}
            size="lg"
            className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base shadow-lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Nueva Partida
          </Button>
          <Button
            onClick={() => updateGameState({ screen: 'home' })}
            variant="outline"
            className="w-full btn-paper border h-10 text-sm"
          >
            <Home className="w-4 h-4 mr-2" />
            Inicio
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          ¡Gracias por jugar! 🎮
        </p>
      </div>
    </div>
  );
};

export default FinalScreen;