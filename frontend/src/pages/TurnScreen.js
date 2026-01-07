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

  // Handle time up - declare before timer effect
  const handleTimeUp = React.useCallback(() => {
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
  }, [gameState.config.soundEnabled]);

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
  }, [isRunning, timeLeft, handleTimeUp]);

  // Play paper sound on mount (if enabled)
  useEffect(() => {
    if (gameState.config.soundEnabled) {
      // Paper shuffle sound would play here
    }
  }, [gameState.config.soundEnabled]);

  // Handle reveal button press
  const handleRevealPress = () => {
    setIsRevealing(true);
  };

  const handleRevealRelease = () => {
    setIsRevealing(false);
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

  const handleFalta = () => {
    // Detener el timer
    setIsRunning(false);
    setTurnEnded(true);
    
    // El papelito NO se marca como adivinado (vuelve al pool)
    // NO se suma punto
    
    if (gameState.config.soundEnabled) {
      // Sonido de error/buzzer
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGnOPyvmwhBziK0fPTgjMGHm7A7+OZSR0KT6Pd8bllHgU7k9z0yoA');
      audio.play().catch(() => {});
    }
    
    // Alerta visual - mensaje según el modo
    const message = gameState.config.easyMode 
      ? '⚠️ FALTA! Mencionaron la respuesta'
      : '⚠️ FALTA! Mencionaron palabra prohibida';
    
    toast.error(message, {
      duration: 3000,
      style: {
        background: '#dc2626',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
      },
    });
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
    <div className="h-screen p-3 flex flex-col overflow-hidden">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 gap-2 overflow-hidden">
        {/* Header Info - Compact */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Badge
              className={`${
                currentTeam === 'A'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground'
              } px-2 py-0.5 text-xs font-bold`}
            >
              {teamName}
            </Badge>
            <span className="text-sm font-semibold">{currentPlayer}</span>
          </div>
          <div className="text-right text-xs">
            <span className="text-muted-foreground">R{gameState.currentRound} · </span>
            <span className="font-medium">{currentPool.length} restantes</span>
          </div>
        </div>

        {/* Timer - Compact */}
        <Card
          className={`paper-card border shrink-0 ${
            isUrgent ? 'border-destructive timer-urgent' : 'border-border'
          }`}
        >
          <CardContent className="p-3 relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Clock className={`w-4 h-4 ${isUrgent ? 'text-destructive' : 'text-primary'}`} />
                <span className="text-xs text-muted-foreground">
                  {initialTime > gameState.config.turnTime ? '⭐ BONUS' : 'Tiempo'}
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  isUrgent ? 'text-destructive' : 'text-foreground'
                }`}
              >
                {timeLeft}s
              </div>
            </div>
            <Progress
              value={progress}
              className="h-2"
              indicatorClassName={isUrgent ? 'bg-destructive' : 'bg-primary'}
            />
          </CardContent>
        </Card>

        {/* Papelito Card - Compact */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPapelito.id}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-h-0"
          >
            <Card className="paper-elevated border border-primary bg-gradient-to-br from-card to-secondary h-full flex flex-col">
              <CardHeader className="pb-1 pt-2 px-3 shrink-0">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-primary text-primary text-xs font-semibold px-2 py-0">
                    #{currentPool.length - currentPapelitoIndex}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {isRevealing ? '👁️' : '🔒'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 relative z-10 p-3 pt-1 overflow-y-auto">
                {!isRevealing ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-4">
                    <EyeOff className="w-12 h-12 text-muted-foreground opacity-50 mb-2" />
                    <p className="text-sm font-semibold text-foreground">
                      Mantén presionado para ver
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Respuesta */}
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                      <p className="text-xs text-muted-foreground mb-1">Respuesta</p>
                      <p className="text-xl font-bold text-center text-foreground">
                        {currentPapelito.respuesta}
                      </p>
                    </div>

                    {/* Restricciones */}
                    {currentPapelito.restricciones && currentPapelito.restricciones.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-destructive flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Prohibidas
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {currentPapelito.restricciones.map((restriccion, index) => (
                            <div
                              key={index}
                              className="p-1.5 bg-destructive/10 rounded border border-destructive/30 text-center"
                            >
                              <p className="text-xs font-semibold text-destructive truncate">
                                {restriccion}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Easy Mode */}
                    {(!currentPapelito.restricciones || currentPapelito.restricciones.length === 0) && (
                      <div className="p-2 bg-success/10 rounded border border-success/30">
                        <p className="text-xs text-success font-semibold text-center">
                          😊 Modo Fácil
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons - Compact */}
        <div className="space-y-2 shrink-0">
          {!isRunning && !turnEnded && (
            <Button
              onClick={handleStart}
              size="lg"
              className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base"
            >
              Iniciar Cronómetro
            </Button>
          )}

          {isRunning && !turnEnded && (
            <>
              {/* Hold to reveal button - Fixed for mobile text selection */}
              <div 
                className="relative select-none"
                style={{ 
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                <Button
                  ref={revealButtonRef}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleRevealPress();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRevealPress();
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  size="lg"
                  variant="outline"
                  className={`w-full btn-paper border-2 font-bold h-12 text-sm transition-colors select-none ${
                    isRevealing 
                      ? 'bg-primary/20 border-primary' 
                      : 'border-primary hover:bg-primary/5'
                  }`}
                  style={{ 
                    userSelect: 'none', 
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    touchAction: 'manipulation',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                  }}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  {isRevealing ? '👁️ Mostrando...' : '🔒 Mantener para Ver'}
                </Button>
              </div>
              
              {/* ADIVINADO Button - GREEN */}
              <Button
                onClick={handleAdivinado}
                size="lg"
                className="w-full btn-paper bg-success hover:bg-success/90 text-white font-bold h-14 text-lg shadow-md"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                ADIVINADO (+1)
              </Button>
              
              {/* Falta Button - RED */}
              <Button
                onClick={handleFalta}
                size="lg"
                variant="destructive"
                className="w-full btn-paper bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold h-10 text-sm"
              >
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                {gameState.config.easyMode 
                  ? 'FALTA (Dijo la Respuesta)' 
                  : 'FALTA (Palabra Prohibida)'}
              </Button>
            </>
          )}

          {turnEnded && (
            <Button
              onClick={handleEndTurn}
              size="lg"
              className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base"
            >
              Siguiente Turno
            </Button>
          )}
        </div>

        {/* Score Display - Compact */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <Card className="paper-card border border-primary/30">
            <CardContent className="p-2 text-center relative z-10">
              <div className="text-xs text-muted-foreground">
                {gameState.teamNames?.A || 'Equipo A'}
              </div>
              <div className="text-xl font-bold text-primary">{gameState.scores.A}</div>
            </CardContent>
          </Card>
          <Card className="paper-card border border-accent/30">
            <CardContent className="p-2 text-center relative z-10">
              <div className="text-xs text-muted-foreground">
                {gameState.teamNames?.B || 'Equipo B'}
              </div>
              <div className="text-xl font-bold text-accent">{gameState.scores.B}</div>
            </CardContent>
          </Card>
        </div>

        {/* Restart Button - Smaller */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-destructive text-xs h-8 shrink-0"
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
  );
};

const Label = ({ children, className = '' }) => (
  <div className={`text-sm font-medium ${className}`}>{children}</div>
);

export default TurnScreen;