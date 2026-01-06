import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useGame } from '../context/GameContext';
import { Clock, CheckCircle2, Eye, EyeOff, AlertTriangle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
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

const TurnScreen = () => {
  const { gameState, updateGameState, markPapelitoCorrecto, nextTurn, resetGame } = useGame();
  
  // Inicializar con tiempo guardado si existe (continuación de ronda anterior)
  const savedTime = sessionStorage.getItem('startWithTime');
  const initialTime = savedTime && parseInt(savedTime) > 0 
    ? parseInt(savedTime) 
    : gameState.config.turnTime;
  
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPapelitoIndex, setCurrentPapelitoIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [turnEnded, setTurnEnded] = useState(false);
  const revealButtonRef = useRef(null);
  
  // Limpiar tiempo guardado después de usarlo
  useEffect(() => {
    if (savedTime) {
      sessionStorage.removeItem('startWithTime');
    }
  }, []);

  const currentPool = gameState.roundPools[gameState.currentRound] || [];
  const currentPapelito = currentPool[currentPapelitoIndex];
  const currentTeam = gameState.currentTeam;
  const currentTeamPlayers = gameState.teams[currentTeam];
  const currentPlayer = currentTeamPlayers[gameState.currentPlayerIndex];
  const teamName = gameState.teamNames?.[currentTeam] || `Equipo ${currentTeam}`;

  const totalTime = gameState.config.turnTime;
  const progress = (timeLeft / totalTime) * 100;
  const isUrgent = timeLeft <= 10;

  // Timer effect
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Play paper sound on mount (if enabled)
  useEffect(() => {
    if (gameState.config.soundEnabled) {
      // Paper shuffle sound would play here
    }
  }, []);

  // Handle reveal button press
  const handleRevealPress = () => {
    setIsRevealing(true);
  };

  const handleRevealRelease = () => {
    setIsRevealing(false);
  };

  // Global listeners for touch/mouse release
  useEffect(() => {
    const handleGlobalRelease = () => {
      setIsRevealing(false);
    };

    window.addEventListener('mouseup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);
    window.addEventListener('touchcancel', handleGlobalRelease);

    return () => {
      window.removeEventListener('mouseup', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
      window.removeEventListener('touchcancel', handleGlobalRelease);
    };
  }, []);

  const handleTimeUp = () => {
    setIsRunning(false);
    setTurnEnded(true);
    
    // Alerta visual y sonora
    if (gameState.config.soundEnabled) {
      // Reproducir sonido de alarma
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGnOPyvmwhBziK0fPTgjMGHm7A7+OZSR0KT6Pd8bllHgU7k9z0yoA');
      audio.play().catch(() => {});
    }
    
    // Alerta visual con toast
    toast.error('⏰ ¡SE ACABÓ EL TIEMPO!', {
      duration: 3000,
      style: {
        background: '#dc2626',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
      },
    });
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleAdivinado = () => {
    if (!currentPapelito) return;

    markPapelitoCorrecto(currentPapelito);
    
    if (gameState.config.soundEnabled) {
      // Success sound would play here
    }

    // Check if pool is empty after marking
    const updatedPool = currentPool.filter((p) => p.id !== currentPapelito.id);
    
    if (updatedPool.length === 0) {
      // Pool vacío - verificar si hay más rondas
      if (gameState.currentRound < 3) {
        // Guardar tiempo restante para siguiente ronda
        sessionStorage.setItem('remainingTime', timeLeft.toString());
        
        // Hay más rondas - continuar con tiempo restante
        toast.success(`¡Ronda ${gameState.currentRound} completada! Continuando...`);
        
        // Avanzar a siguiente ronda automáticamente
        setTimeout(() => {
          updateGameState({ 
            currentRound: gameState.currentRound + 1,
            screen: 'round-start' 
          });
        }, 1500);
      } else {
        // Última ronda completada
        sessionStorage.removeItem('remainingTime');
        toast.success('¡Todas las rondas completadas!');
        setTimeout(() => {
          updateGameState({ screen: 'final' });
        }, 1500);
      }
    } else {
      // Siguiente papelito
      setCurrentPapelitoIndex(0);
      setIsRevealing(false);
      toast.success('¡Correcto! +1 punto');
    }
  };

  const handleEndTurn = () => {
    nextTurn();
    updateGameState({ screen: 'round-start' });
  };

  const handleRestart = () => {
    sessionStorage.clear();
    resetGame();
  };

  if (!currentPapelito) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="paper-card max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4 relative z-10">
            <AlertTriangle className="w-16 h-16 mx-auto text-warning" />
            <h2 className="text-2xl font-bold">No hay más papelitos</h2>
            <p className="text-muted-foreground">La ronda ha terminado</p>
            <Button
              onClick={() => updateGameState({ screen: 'round-end' })}
              className="btn-paper bg-primary text-primary-foreground"
            >
              Continuar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div>
            <Badge
              className={`${
                currentTeam === 'A'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground'
              } px-3 py-1 text-sm font-bold`}
            >
              {teamName}
            </Badge>
            <div className="text-lg font-semibold mt-1">{currentPlayer}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Ronda {gameState.currentRound}</div>
            <div className="text-sm font-medium">
              {currentPool.length} papelitos restantes
            </div>
          </div>
        </div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card
            className={`paper-card border-2 ${
              isUrgent ? 'border-destructive timer-urgent' : 'border-border'
            }`}
          >
            <CardContent className="p-6 space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={`w-5 h-5 ${isUrgent ? 'text-destructive' : 'text-primary'}`} />
                  <span className="text-sm font-medium text-muted-foreground">
                    Tiempo {initialTime > gameState.config.turnTime ? '⭐ BONUS' : ''}
                  </span>
                </div>
                <div
                  className={`text-4xl font-bold ${
                    isUrgent ? 'text-destructive' : 'text-foreground'
                  }`}
                >
                  {timeLeft}s
                </div>
              </div>
              <Progress
                value={progress}
                className="h-3"
                indicatorClassName={isUrgent ? 'bg-destructive' : 'bg-primary'}
              />
              {initialTime > gameState.config.turnTime && (
                <p className="text-xs text-center text-primary font-semibold">
                  ¡Continuando desde ronda anterior!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Papelito Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPapelito.id}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="paper-elevated border-2 border-primary bg-gradient-to-br from-card to-secondary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-primary text-primary font-semibold">
                    Papelito #{currentPool.length - currentPapelitoIndex}
                  </Badge>
                  <div className="text-xs text-muted-foreground font-medium">
                    {isRevealing ? '👁️ Visible' : '🔒 Oculto'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                {!isRevealing ? (
                  <div className="py-16 text-center space-y-4">
                    <EyeOff className="w-20 h-20 mx-auto text-muted-foreground opacity-50" />
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-foreground">
                        Mantén presionado el botón
                      </p>
                      <p className="text-sm text-muted-foreground">
                        para ver la respuesta y restricciones
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Respuesta */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                        Respuesta
                      </Label>
                      <div className="p-6 bg-primary/10 rounded-xl border-2 border-primary/30">
                        <p className="text-3xl font-bold text-center text-foreground">
                          {currentPapelito.respuesta}
                        </p>
                      </div>
                    </div>

                    {/* Restricciones */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold uppercase tracking-wide flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        Palabras Prohibidas
                      </Label>
                      <div className="space-y-2">
                        {currentPapelito.restricciones.map((restriccion, index) => (
                          <div
                            key={index}
                            className="p-3 bg-destructive/10 rounded-lg border border-destructive/30"
                          >
                            <p className="text-base font-semibold text-destructive text-center">
                              {restriccion}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {!isRunning && !turnEnded && (
            <Button
              onClick={handleStart}
              size="lg"
              className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-16 text-lg"
            >
              Iniciar Cronómetro
            </Button>
          )}

          {isRunning && !turnEnded && (
            <>
              {/* Hold to reveal button - Fixed version */}
              <div className="relative">
                <Button
                  ref={revealButtonRef}
                  onMouseDown={handleRevealPress}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleRevealPress();
                  }}
                  size="lg"
                  variant="outline"
                  className={`w-full btn-paper border-2 font-bold h-16 text-base transition-colors ${
                    isRevealing 
                      ? 'bg-primary/20 border-primary' 
                      : 'border-primary hover:bg-primary/5'
                  }`}
                  style={{ userSelect: 'none', touchAction: 'none' }}
                >
                  <Eye className="w-5 h-5 mr-2" />
                  {isRevealing ? '👁️ Mostrando...' : '🔒 Mantener para Ver'}
                </Button>
              </div>
              
              <Button
                onClick={handleAdivinado}
                size="lg"
                className="w-full btn-paper bg-success hover:bg-success/90 text-white font-bold h-20 text-xl"
              >
                <CheckCircle2 className="w-6 h-6 mr-2" />
                ADIVINADO (+1)
              </Button>
            </>
          )}

          {turnEnded && (
            <Button
              onClick={handleEndTurn}
              size="lg"
              className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-16 text-lg"
            >
              Siguiente Turno
            </Button>
          )}
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="paper-card border border-primary/30">
            <CardContent className="p-4 text-center relative z-10">
              <div className="text-xs text-muted-foreground mb-1">
                {gameState.teamNames?.A || 'Equipo A'}
              </div>
              <div className="text-2xl font-bold text-primary">{gameState.scores.A}</div>
            </CardContent>
          </Card>
          <Card className="paper-card border border-accent/30">
            <CardContent className="p-4 text-center relative z-10">
              <div className="text-xs text-muted-foreground mb-1">
                {gameState.teamNames?.B || 'Equipo B'}
              </div>
              <div className="text-2xl font-bold text-accent">{gameState.scores.B}</div>
            </CardContent>
          </Card>
        </div>

        {/* Restart Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full btn-paper border border-muted-foreground/30 text-muted-foreground hover:border-destructive hover:text-destructive"
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              Reiniciar Partida
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="paper-card max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Reiniciar partida?</AlertDialogTitle>
              <AlertDialogDescription>
                Se perderá todo el progreso actual. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="btn-paper">Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleRestart}
                className="btn-paper bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sí, reiniciar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const Label = ({ children, className = '' }) => (
  <div className={`text-sm font-medium ${className}`}>{children}</div>
);

export default TurnScreen;