import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useGame } from '../context/GameContext';
import { ChevronLeft, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const PapelitosInput = () => {
  const { gameState, updateGameState } = useGame();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [allPapelitos, setAllPapelitos] = useState([]);
  const [currentPapelitos, setCurrentPapelitos] = useState([]);
  const [showHandoff, setShowHandoff] = useState(true); // Pantalla de privacidad
  const [formData, setFormData] = useState({
    respuesta: '',
    restriccion1: '',
    restriccion2: '',
    restriccion3: '',
  });

  const currentPlayer = gameState.players[currentPlayerIndex];
  const papelitosNeeded = gameState.config.papelitosPerPlayer;
  const papelitosRemaining = papelitosNeeded - currentPapelitos.length;

  const validatePapelito = () => {
    const { respuesta, restriccion1, restriccion2, restriccion3 } = formData;

    // Check if respuesta is filled
    if (!respuesta.trim()) {
      toast.error('Debes escribir una respuesta');
      return false;
    }

    // Si no es easy mode, validar restricciones
    if (!gameState.config.easyMode) {
      if (!restriccion1.trim() || !restriccion2.trim() || !restriccion3.trim()) {
        toast.error('Completa todas las restricciones');
        return false;
      }

      const respuestaLower = respuesta.trim().toLowerCase();
      const r1 = restriccion1.trim().toLowerCase();
      const r2 = restriccion2.trim().toLowerCase();
      const r3 = restriccion3.trim().toLowerCase();

      // Check for duplicate restrictions
      if (r1 === r2 || r1 === r3 || r2 === r3) {
        toast.error('Las restricciones no pueden repetirse');
        return false;
      }

      // Check if restrictions match respuesta
      if (r1 === respuestaLower || r2 === respuestaLower || r3 === respuestaLower) {
        toast.error('Las restricciones no pueden ser iguales a la respuesta');
        return false;
      }
    }

    return true;
  };

  const addPapelito = () => {
    if (currentPapelitos.length >= papelitosNeeded) {
      toast.error(`Ya alcanzaste el límite de ${papelitosNeeded} papelitos`);
      return;
    }
    
    if (!validatePapelito()) return;

    const newPapelito = {
      id: `${currentPlayer}-${Date.now()}`,
      respuesta: formData.respuesta.trim(),
      restricciones: gameState.config.easyMode 
        ? [] // Easy mode: sin restricciones
        : [
            formData.restriccion1.trim(),
            formData.restriccion2.trim(),
            formData.restriccion3.trim(),
          ],
      createdBy: currentPlayer,
    };

    setCurrentPapelitos([...currentPapelitos, newPapelito]);
    setFormData({
      respuesta: '',
      restriccion1: '',
      restriccion2: '',
      restriccion3: '',
    });
    toast.success('Papelito agregado');
  };

  const nextPlayer = () => {
    if (currentPapelitos.length < papelitosNeeded) {
      toast.error(`Te faltan ${papelitosRemaining} papelito${papelitosRemaining !== 1 ? 's' : ''}`);
      return;
    }

    const updatedAllPapelitos = [...allPapelitos, ...currentPapelitos];
    setAllPapelitos(updatedAllPapelitos);
    setCurrentPapelitos([]);

    if (currentPlayerIndex < gameState.players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setShowHandoff(true); // Mostrar pantalla de privacidad
    } else {
      // All players done
      updateGameState({
        papelitos: updatedAllPapelitos,
        screen: 'round-start',
      });
    }
  };

  const nextPlayerName =
    currentPlayerIndex < gameState.players.length - 1
      ? gameState.players[currentPlayerIndex + 1]
      : null;

  // Pantalla de privacidad
  if (showHandoff) {
    return (
      <div className="min-h-screen p-4 py-8 flex items-center justify-center bg-muted">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="paper-card border-2 border-primary">
            <CardContent className="p-8 text-center space-y-6 relative z-10">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-foreground">
                Turno de: {currentPlayer}
              </h2>
              <p className="text-muted-foreground">
                Asegúrate de que solo tú puedas ver la pantalla
              </p>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Debes escribir <span className="font-bold text-primary">{papelitosNeeded}</span> papelitos
                </p>
              </div>
              <Button
                onClick={() => setShowHandoff(false)}
                size="lg"
                className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14"
              >
                Estoy Listo, Comenzar
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateGameState({ screen: 'teams' })}
            className="btn-paper"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{currentPlayer}</h1>
            <p className="text-muted-foreground text-sm">
              Jugador {currentPlayerIndex + 1} de {gameState.players.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{currentPapelitos.length}</div>
            <div className="text-xs text-muted-foreground">de {papelitosNeeded}</div>
          </div>
        </div>

        {/* Alert */}
        {papelitosRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="paper-card border-2 border-primary bg-primary/5">
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    Te faltan <span className="text-primary font-bold">{papelitosRemaining}</span> papelito
                    {papelitosRemaining !== 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="paper-card border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Nuevo Papelito
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {/* Respuesta */}
              <div className="space-y-2">
                <Label htmlFor="respuesta" className="text-base font-semibold">
                  Respuesta (palabra o personaje)
                </Label>
                <Input
                  id="respuesta"
                  placeholder="Ej: Harry Potter"
                  value={formData.respuesta}
                  onChange={(e) => setFormData({ ...formData, respuesta: e.target.value })}
                  className="border-2 h-12 text-base"
                />
              </div>

              {/* Restricciones */}
              {!gameState.config.easyMode && (
                <div className="space-y-3 pt-2">
                  <Label className="text-base font-semibold text-destructive">
                    Palabras Prohibidas (3 restricciones)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    No se puede mencionar la respuesta ni estas palabras
                  </p>
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="space-y-1">
                      <Label htmlFor={`restriccion${num}`} className="text-sm">
                        Restricción {num}
                      </Label>
                      <Input
                        id={`restriccion${num}`}
                        placeholder={`Palabra prohibida ${num}`}
                        value={formData[`restriccion${num}`]}
                        onChange={(e) =>
                          setFormData({ ...formData, [`restriccion${num}`]: e.target.value })
                        }
                        className="border-2"
                      />
                    </div>
                  ))}
                </div>
              )}

              {gameState.config.easyMode && (
                <div className="p-3 bg-success/10 rounded-lg border border-success/30">
                  <p className="text-sm text-success font-medium text-center">
                    😊 Modo Fácil: Solo escribe la respuesta
                  </p>
                </div>
              )}

              <Button
                onClick={addPapelito}
                disabled={currentPapelitos.length >= papelitosNeeded}
                size="lg"
                className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentPapelitos.length >= papelitosNeeded 
                  ? `Límite Alcanzado (${papelitosNeeded}/${papelitosNeeded})`
                  : `Agregar Papelito (${currentPapelitos.length}/${papelitosNeeded})`
                }
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Papelitos List */}
        {currentPapelitos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="paper-card border-2 border-border">
              <CardHeader>
                <CardTitle className="text-base">Tus Papelitos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 relative z-10">
                {currentPapelitos.map((papelito, index) => (
                  <div
                    key={papelito.id}
                    className="p-3 bg-secondary rounded-lg border border-border"
                  >
                    <div className="font-semibold text-sm">{papelito.respuesta}</div>
                    {papelito.restricciones.length > 0 && (
                      <div className="text-xs text-destructive mt-1">
                        Prohibido: {papelito.restricciones.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Next Player Button */}
        {currentPapelitos.length === papelitosNeeded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="paper-card border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="p-6 text-center space-y-3 relative z-10">
                <p className="text-lg font-semibold">
                  {nextPlayerName ? (
                    <>
                      ¡Listo! Pasa el celular a <span className="text-primary">{nextPlayerName}</span>
                    </>
                  ) : (
                    '¡Todos listos! Comencemos el juego'
                  )}
                </p>
                <Button
                  onClick={nextPlayer}
                  size="lg"
                  className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14"
                >
                  {nextPlayerName ? `Turno de ${nextPlayerName}` : 'Iniciar Juego'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PapelitosInput;