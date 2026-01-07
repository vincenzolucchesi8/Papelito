import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { useGame } from '../context/GameContext';
import { ChevronLeft, Plus, X, Clock, FileText, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

const Configuration = () => {
  const { gameState, updateGameState } = useGame();
  const [turnTime, setTurnTime] = useState(gameState.config.turnTime);
  const [papelitosPerPlayer, setPapelitosPerPlayer] = useState(gameState.config.papelitosPerPlayer);
  const [soundEnabled, setSoundEnabled] = useState(gameState.config.soundEnabled);
  const [easyMode, setEasyMode] = useState(gameState.config.easyMode || false);
  const [players, setPlayers] = useState(gameState.players.length > 0 ? gameState.players : []);
  const [newPlayerName, setNewPlayerName] = useState('');

  const timeOptions = [30, 45, 60, 90];
  const papelitosOptions = [2, 3, 4, 5];

  const addPlayer = () => {
    const trimmed = newPlayerName.trim();
    if (!trimmed) {
      toast.error('Por favor ingresa un nombre');
      return;
    }
    if (players.includes(trimmed)) {
      toast.error('Este jugador ya existe');
      return;
    }
    setPlayers([...players, trimmed]);
    setNewPlayerName('');
    toast.success(`${trimmed} agregado`);
  };

  const removePlayer = (name) => {
    setPlayers(players.filter((p) => p !== name));
    toast.info(`${name} eliminado`);
  };

  const handleContinue = () => {
    if (players.length < 4) {
      toast.error('Se necesitan al menos 4 jugadores');
      return;
    }
    updateGameState({
      config: { turnTime, papelitosPerPlayer, soundEnabled, easyMode },
      players,
      screen: 'teams',
    });
  };

  return (
    <div className="min-h-screen p-3 py-4 flex flex-col">
      <div className="max-w-2xl mx-auto w-full space-y-3 flex-1 flex flex-col">
        {/* Header - Compact */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateGameState({ screen: 'home' })}
            className="btn-paper h-9 w-9"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground text-xs">Prepara tu partida</p>
          </div>
        </div>

        {/* Compact Grid for Config Options */}
        <div className="grid grid-cols-2 gap-2">
          {/* Time Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="paper-card border border-border">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="flex items-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs">Tiempo/Turno</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 relative z-10">
                <div className="grid grid-cols-2 gap-1.5">
                  {timeOptions.map((time) => (
                    <Button
                      key={time}
                      variant={turnTime === time ? 'default' : 'outline'}
                      size="sm"
                      className={`btn-paper text-xs h-8 ${
                        turnTime === time
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border'
                      }`}
                      onClick={() => setTurnTime(time)}
                    >
                      {time}s
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Papelitos per Player */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="paper-card border border-border">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="flex items-center gap-1.5 text-sm">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-xs">Papelitos/Jug.</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 relative z-10">
                <div className="grid grid-cols-2 gap-1.5">
                  {papelitosOptions.map((num) => (
                    <Button
                      key={num}
                      variant={papelitosPerPlayer === num ? 'default' : 'outline'}
                      size="sm"
                      className={`btn-paper text-xs h-8 ${
                        papelitosPerPlayer === num
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border'
                      }`}
                      onClick={() => setPapelitosPerPlayer(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Toggles - Ultra Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="paper-card border border-border">
            <CardContent className="p-3 space-y-2.5 relative z-10">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-sm">Sonidos</span>
                </Label>
                <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
              
              {/* Easy Mode Toggle */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex-1 pr-3">
                  <Label htmlFor="easyMode" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                    <span>{easyMode ? '😊' : '🔥'}</span>
                    <span className="text-sm">Modo Fácil</span>
                  </Label>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                    {easyMode ? 'Sin restricciones' : 'Con 3 restricciones'}
                  </p>
                </div>
                <Switch id="easyMode" checked={easyMode} onCheckedChange={setEasyMode} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Players Input - Compact with flex-1 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col min-h-0"
        >
          <Card className="paper-card border border-border flex flex-col h-full">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Jugadores (mín. 4)</span>
                {players.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">{players.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2 relative z-10 flex-1 flex flex-col min-h-0">
              {/* Add player input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre del jugador"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  className="border h-9 text-sm"
                />
                <Button onClick={addPlayer} size="sm" className="btn-paper bg-primary h-9 w-9 p-0 shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Players list - Scrollable area */}
              {players.length > 0 && (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
                    {players.map((player, index) => (
                      <motion.div
                        key={player}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex items-center justify-between p-2 bg-secondary rounded border border-border text-sm"
                      >
                        <span className="font-medium text-sm">{player}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlayer(player)}
                          className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    {players.length * papelitosPerPlayer} papelitos total
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Continue Button - Fixed at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="pt-2"
        >
          <Button
            onClick={handleContinue}
            disabled={players.length < 4}
            size="lg"
            className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 text-base"
          >
            Continuar a Equipos
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Configuration;
