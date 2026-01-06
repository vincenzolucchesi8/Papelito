import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useGame } from '../context/GameContext';
import { HelpCircle, Users, Clock, Zap } from 'lucide-react';
import { CrumpledPaperIcon } from '../components/CrumpledPaperIcon';

const Home = () => {
  const { updateGameState, resetGame } = useGame();

  const handleNewGame = () => {
    resetGame();
    updateGameState({ screen: 'configuration' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative paper elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-card rounded-lg opacity-20 rotate-12"
        animate={{ rotate: [12, 15, 12], y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-lg opacity-20 -rotate-12"
        animate={{ rotate: [-12, -15, -12], y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <motion.div
            animate={{ rotate: [0, 3, -3, 0], y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <CrumpledPaperIcon size={100} className="mx-auto" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground text-shadow-soft">
            Papelito
          </h1>
          <p className="text-muted-foreground text-lg">
            El juego de adivinar en equipo
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="paper-card border-2 border-border">
            <CardContent className="p-8 space-y-6 relative z-10">
              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Juego en un solo dispositivo</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>3 rondas emocionantes</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Turnos con tiempo límite</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleNewGame}
                  size="lg"
                  className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg h-14 shadow-md"
                >
                  Nueva Partida
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full btn-paper border-2 font-medium"
                    >
                      <HelpCircle className="w-5 h-5 mr-2" />
                      Cómo Jugar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto paper-card">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Cómo Jugar Papelito</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-sm relative z-10">
                      <div>
                        <h3 className="font-semibold text-base mb-2">Objetivo</h3>
                        <p className="text-muted-foreground">
                          Adivina palabras o personajes en equipo siguiendo las reglas de cada ronda.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-base mb-2">Preparación</h3>
                        <p className="text-muted-foreground">
                          Cada jugador escribe varios "papelitos" con una respuesta y 3 palabras prohibidas (restricciones).
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-base mb-2">Las 3 Rondas</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li><span className="font-medium text-foreground">Ronda 1:</span> Descripción libre (sin mencionar la respuesta ni restricciones)</li>
                          <li><span className="font-medium text-foreground">Ronda 2:</span> Una sola palabra como pista</li>
                          <li><span className="font-medium text-foreground">Ronda 3:</span> Solo actuación (sin hablar)</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-base mb-2">Durante el Turno</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• El reloj cuenta el tiempo del turno</li>
                          <li>• Da pistas según la ronda actual</li>
                          <li>• NO puedes decir la respuesta ni las restricciones</li>
                          <li>• Al adivinar, presiona "ADIVINADO" para el siguiente papelito</li>
                          <li>• Si no adivinan, el papelito vuelve al juego más tarde</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-base mb-2">Ganar</h3>
                        <p className="text-muted-foreground">
                          El equipo con más puntos al final de las 3 rondas gana.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground"
        >
          Juega con amigos y familia • Mobile-first
        </motion.p>
      </div>
    </div>
  );
};

export default Home;