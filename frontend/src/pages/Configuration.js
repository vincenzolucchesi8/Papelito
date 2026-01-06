import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateGameState({ screen: 'home' })}
            className="btn-paper"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground text-sm">Prepara tu partida</p>
          </div>
        </div>

        {/* Time Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="paper-card border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-primary" />
                Tiempo por Turno
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-4 gap-3">
                {timeOptions.map((time) => (
                  <Button
                    key={time}
                    variant={turnTime === time ? 'default' : 'outline'}
                    className={`btn-paper ${
                      turnTime === time
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-2'
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="paper-card border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Papelitos por Jugador
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-4 gap-3">
                {papelitosOptions.map((num) => (
                  <Button
                    key={num}
                    variant={papelitosPerPlayer === num ? 'default' : 'outline'}
                    className={`btn-paper ${
                      papelitosPerPlayer === num
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-2'
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

        {/* Sound Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="paper-card border-2 border-border">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="flex items-center gap-2 text-base font-medium cursor-pointer">
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-primary" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  )}
                  Sonidos de Papel
                </Label>
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Players Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="paper-card border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Jugadores (mínimo 4)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {/* Add player input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre del jugador"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  className="border-2"
                />
                <Button onClick={addPlayer} size="icon" className="btn-paper bg-primary">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {/* Players list */}
              {players.length > 0 && (
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <motion.div
                      key={player}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border"
                    >
                      <span className="font-medium">{player}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePlayer(player)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}

              {players.length > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  {players.length} jugador{players.length !== 1 ? 'es' : ''} • Total de {players.length * papelitosPerPlayer} papelitos
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleContinue}
            disabled={players.length < 4}
            size="lg"
            className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14"
          >
            Continuar a Equipos
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Configuration;