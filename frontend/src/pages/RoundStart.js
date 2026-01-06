import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useGame } from '../context/GameContext';
import { MessageCircle, Hand, Zap, RotateCcw } from 'lucide-react';
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

const RoundStart = () => {
  const { gameState, updateGameState, startNewRound, resetGame } = useGame();
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Detectar si venimos de una ronda anterior con tiempo restante
  useEffect(() => {
    const savedTime = sessionStorage.getItem('remainingTime');
    if (savedTime && parseInt(savedTime) > 0) {
      setTimeRemaining(parseInt(savedTime));
    }
  }, []);

  const handleRestart = () => {
    sessionStorage.clear();
    resetGame();
  };

  const roundRules = {
    1: {
      title: 'Ronda 1: Descripción Libre',
      icon: MessageCircle,
      description: 'Describe la respuesta con todas las palabras que quieras',
      rules: [
        'Puedes usar frases completas',
        'NO puedes decir la respuesta',
        'NO puedes decir ninguna de las 3 restricciones',
        'Usa sinónimos, ejemplos, y descripciones',
      ],
    },
    2: {
      title: 'Ronda 2: Una Sola Palabra',
      icon: Zap,
      description: 'Solo puedes decir UNA palabra como pista',
      rules: [
        'Únicamente UNA palabra por papelito',
        'NO puedes decir la respuesta',
        'NO puedes decir ninguna de las restricciones',
        'Elige la palabra más representativa',
      ],
    },
    3: {
      title: 'Ronda 3: Actuación',
      icon: Hand,
      description: 'Solo puedes actuar, sin hablar ni hacer sonidos',
      rules: [
        'NO puedes hablar ni hacer sonidos',
        'Usa gestos y mímica',
        'Puedes señalar objetos del entorno',
        'Sé creativo con tus movimientos',
      ],
    },
  };

  const currentRoundInfo = roundRules[gameState.currentRound];
  const Icon = currentRoundInfo.icon;

  const handleStart = () => {
    startNewRound();
    // Pasar el tiempo restante si existe
    if (timeRemaining) {
      sessionStorage.setItem('startWithTime', timeRemaining.toString());
    }
    updateGameState({ screen: 'turn' });
  };

  return (
    <div className="min-h-screen p-4 py-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Round Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Badge className="px-6 py-2 text-lg bg-primary text-primary-foreground font-bold">
            Ronda {gameState.currentRound} de 3
          </Badge>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="paper-card border-2 border-primary">
            <CardContent className="p-8 space-y-6 relative z-10">
              {/* Icon */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="p-6 bg-primary/10 rounded-full"
                >
                  <Icon className="w-16 h-16 text-primary" strokeWidth={1.5} />
                </motion.div>
              </div>

              {/* Title */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {currentRoundInfo.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {currentRoundInfo.description}
                </p>
              </div>

              {/* Rules */}
              <div className="space-y-3 pt-4">
                <h3 className="font-semibold text-lg">Reglas:</h3>
                <ul className="space-y-2">
                  {currentRoundInfo.rules.map((rule, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3 text-base"
                    >
                      <span className="text-primary font-bold flex-shrink-0">•</span>
                      <span>{rule}</span>
                    </motion.li>
                  ))}
                </ul>
                
                {/* Important note about holding button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-4 space-y-2"
                >
                  <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                    <p className="text-sm font-semibold text-primary">
                      💡 Mantén presionado el botón para ver el papelito durante tu turno
                    </p>
                  </div>
                  {!gameState.config.easyMode && (
                    <div className="p-4 bg-destructive/10 rounded-lg border-2 border-destructive/30">
                      <p className="text-sm font-semibold text-destructive">
                        ⚠️ Si mencionas palabra prohibida: presiona "FALTA" para ceder el turno
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Scores */}
              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">
                      {gameState.teamNames?.A || 'Equipo A'}
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {gameState.scores.A}
                    </div>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="text-sm text-muted-foreground mb-1">
                      {gameState.teamNames?.B || 'Equipo B'}
                    </div>
                    <div className="text-3xl font-bold text-accent">
                      {gameState.scores.B}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            onClick={handleStart}
            size="lg"
            className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-16 text-lg shadow-lg"
          >
            Iniciar Turno
          </Button>
          
          {/* Restart Button with Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="w-full btn-paper border-2 border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar Partida
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="paper-card">
              <AlertDialogHeader>
                <AlertDialogTitle>¿Reiniciar partida?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se perderá todo el progreso actual: puntajes, rondas y papelitos. Esta acción no se puede deshacer.
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
        </motion.div>
      </div>
    </div>
  );
};

export default RoundStart;