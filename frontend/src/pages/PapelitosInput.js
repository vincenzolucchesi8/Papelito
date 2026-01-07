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

  // Pantalla de privacidad - Compact
  if (showHandoff) {
    return (
      <div className="h-screen p-4 flex items-center justify-center bg-muted">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="paper-card border-2 border-primary">
            <CardContent className="p-6 text-center space-y-4 relative z-10">
              <div className="text-5xl">🔒</div>
              <h2 className="text-xl font-bold text-foreground">
                Turno de: {currentPlayer}
              </h2>
              <p className="text-sm text-muted-foreground">
                Asegúrate de que solo tú puedas ver la pantalla
              </p>
              <p className="text-sm text-muted-foreground">
                Debes escribir <span className="font-bold text-primary">{papelitosNeeded}</span> papelitos
              </p>
              <Button
                onClick={() => setShowHandoff(false)}
                size="lg"
                className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12"
              >
                Estoy Listo
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen p-3 flex flex-col overflow-hidden">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 gap-2 overflow-hidden">
        {/* Header - Compact */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateGameState({ screen: 'teams' })}
            className="btn-paper h-9 w-9"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{currentPlayer}</h1>
            <p className="text-muted-foreground text-xs">
              Jugador {currentPlayerIndex + 1}/{gameState.players.length}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-bold text-primary">{currentPapelitos.length}/{papelitosNeeded}</div>
          </div>
        </div>

        {/* Alert - Compact */}
        {papelitosRemaining > 0 && (
          <div className="p-2 bg-primary/10 rounded border border-primary/30 shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary shrink-0" />
              <p className="text-xs font-medium">
                Te faltan <span className="text-primary font-bold">{papelitosRemaining}</span> papelito{papelitosRemaining !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Input Form - Compact */}
        <Card className="paper-card border border-border flex-1 min-h-0 flex flex-col overflow-hidden">
          <CardHeader className="p-3 pb-2 shrink-0">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-primary" />
              Nuevo Papelito
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 relative z-10 flex-1 min-h-0 overflow-y-auto space-y-2">
            {/* Respuesta */}
            <div className="space-y-1">
              <Label htmlFor="respuesta" className="text-sm font-semibold">
                Respuesta
              </Label>
              <Input
                id="respuesta"
                placeholder="Ej: Harry Potter"
                value={formData.respuesta}
                onChange={(e) => setFormData({ ...formData, respuesta: e.target.value })}
                className="border h-9 text-sm"
              />
            </div>

            {/* Restricciones */}
            {!gameState.config.easyMode && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-destructive">
                  Palabras Prohibidas
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <Input
                      key={num}
                      placeholder={`#${num}`}
                      value={formData[`restriccion${num}`]}
                      onChange={(e) =>
                        setFormData({ ...formData, [`restriccion${num}`]: e.target.value })
                      }
                      className="border h-8 text-xs"
                    />
                  ))}
                </div>
              </div>
            )}

            {gameState.config.easyMode && (
              <div className="p-2 bg-success/10 rounded border border-success/30">
                <p className="text-xs text-success font-medium text-center">
                  😊 Modo Fácil: Solo la respuesta
                </p>
              </div>
            )}

            <Button
              onClick={addPapelito}
              disabled={currentPapelitos.length >= papelitosNeeded}
              className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 text-sm"
            >
              {currentPapelitos.length >= papelitosNeeded 
                ? `Límite (${papelitosNeeded}/${papelitosNeeded})`
                : `Agregar (${currentPapelitos.length}/${papelitosNeeded})`
              }
            </Button>

            {/* Current Papelitos List - Inside same card */}
            {currentPapelitos.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Tus papelitos:</p>
                <div className="space-y-1">
                  {currentPapelitos.map((papelito, index) => (
                    <div
                      key={papelito.id}
                      className="p-1.5 bg-secondary rounded border border-border text-xs"
                    >
                      <span className="font-semibold">{papelito.respuesta}</span>
                      {papelito.restricciones.length > 0 && (
                        <span className="text-destructive ml-1">
                          ({papelito.restricciones.join(', ')})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Player Button - Compact */}
        {currentPapelitos.length === papelitosNeeded && (
          <Card className="paper-card border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10 shrink-0">
            <CardContent className="p-3 text-center space-y-2 relative z-10">
              <p className="text-sm font-semibold">
                {nextPlayerName ? (
                  <>Pasa el celular a <span className="text-primary">{nextPlayerName}</span></>
                ) : (
                  '¡Todos listos!'
                )}
              </p>
              <Button
                onClick={nextPlayer}
                size="lg"
                className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
              >
                {nextPlayerName ? `Turno de ${nextPlayerName}` : 'Iniciar Juego'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PapelitosInput;