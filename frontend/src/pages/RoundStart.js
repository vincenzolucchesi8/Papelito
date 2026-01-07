import React from 'react';
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
  
  // Detectar si venimos de una ronda anterior con tiempo restante
  const savedTime = typeof window !== 'undefined' ? sessionStorage.getItem('remainingTime') : null;
  const timeRemaining = savedTime && parseInt(savedTime) > 0 ? parseInt(savedTime) : null;

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
    <div className="h-screen p-3 flex flex-col overflow-hidden">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 gap-3">
        {/* Round Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center shrink-0"
        >
          <Badge className="px-4 py-1 text-sm bg-primary text-primary-foreground font-bold">
            Ronda {gameState.currentRound} de 3
          </Badge>
        </motion.div>

        {/* Main Card - Compact */}
        <Card className="paper-card border-2 border-primary flex-1 min-h-0 flex flex-col">
          <CardContent className="p-4 flex flex-col flex-1 min-h-0 relative z-10">
            {/* Icon & Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-full shrink-0">
                <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  {currentRoundInfo.title}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {currentRoundInfo.description}
                </p>
              </div>
            </div>

            {/* Rules - Scrollable if needed */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <h3 className="font-semibold text-sm mb-2">Reglas:</h3>
              <ul className="space-y-1.5 text-sm">
                {currentRoundInfo.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0">•</span>
                    <span className="text-xs">{rule}</span>
                  </li>
                ))}
              </ul>
              
              {/* Tips */}
              <div className="mt-3 space-y-1.5">
                <div className="p-2 bg-primary/10 rounded border border-primary/30">
                  <p className="text-xs font-semibold text-primary">
                    💡 Mantén presionado para ver el papelito
                  </p>
                </div>
                <div className="p-2 bg-destructive/10 rounded border border-destructive/30">
                  <p className="text-xs font-semibold text-destructive">
                    {gameState.config.easyMode 
                      ? '⚠️ Si dices la respuesta: "FALTA"'
                      : '⚠️ Palabra prohibida: "FALTA"'}
                  </p>
                </div>
              </div>
            </div>

            {/* Scores - Compact */}
            <div className="pt-3 border-t border-border mt-3 shrink-0">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-primary/5 rounded border border-primary/20">
                  <div className="text-xs text-muted-foreground">
                    {gameState.teamNames?.A || 'Equipo A'}
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {gameState.scores.A}
                  </div>
                </div>
                <div className="p-2 bg-accent/5 rounded border border-accent/20">
                  <div className="text-xs text-muted-foreground">
                    {gameState.teamNames?.B || 'Equipo B'}
                  </div>
                  <div className="text-xl font-bold text-accent">
                    {gameState.scores.B}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons - Compact */}
        <div className="space-y-2 shrink-0">
          <Button
            onClick={handleStart}
            size="lg"
            className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base shadow-lg"
          >
            Iniciar Turno
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-destructive h-8 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reiniciar Partida
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

export default RoundStart;