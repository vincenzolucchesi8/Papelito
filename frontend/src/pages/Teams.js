import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useGame } from '../context/GameContext';
import { ChevronLeft, Shuffle, Users2 } from 'lucide-react';
import { toast } from 'sonner';

const Teams = () => {
  const { gameState, updateGameState } = useGame();
  const [assignmentMode, setAssignmentMode] = useState(null);
  const [teams, setTeams] = useState({ A: [], B: [] });
  const [teamNames, setTeamNames] = useState({ 
    A: gameState.teamNames?.A || 'Equipo A', 
    B: gameState.teamNames?.B || 'Equipo B' 
  });

  const autoAssignTeams = () => {
    const shuffled = [...gameState.players].sort(() => Math.random() - 0.5);
    const teamA = [];
    const teamB = [];
    
    shuffled.forEach((player, index) => {
      if (index % 2 === 0) {
        teamA.push(player);
      } else {
        teamB.push(player);
      }
    });

    setTeams({ A: teamA, B: teamB });
    setAssignmentMode('auto');
    toast.success('Equipos asignados automáticamente');
  };

  const manualAssignTeams = () => {
    setAssignmentMode('manual');
    setTeams({ A: [], B: [] });
  };

  const moveToTeam = (player, team) => {
    setTeams((prev) => {
      // Remove from both teams first
      const newA = prev.A.filter((p) => p !== player);
      const newB = prev.B.filter((p) => p !== player);
      
      // Add to selected team
      if (team === 'A') {
        return { A: [...newA, player], B: newB };
      } else {
        return { A: newA, B: [...newB, player] };
      }
    });
  };

  const handleConfirm = () => {
    if (teams.A.length === 0 || teams.B.length === 0) {
      toast.error('Ambos equipos deben tener al menos un jugador');
      return;
    }
    
    if (teams.A.length + teams.B.length !== gameState.players.length) {
      toast.error('Todos los jugadores deben estar en un equipo');
      return;
    }

    updateGameState({
      teams,
      teamNames, // Guardar nombres personalizados
      screen: 'papelitos-input',
    });
  };

  const unassignedPlayers = gameState.players.filter(
    (p) => !teams.A.includes(p) && !teams.B.includes(p)
  );

  return (
    <div className="h-screen p-3 flex flex-col overflow-hidden">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 gap-3 overflow-hidden">
        {/* Header - Compact */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateGameState({ screen: 'configuration' })}
            className="btn-paper h-9 w-9"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Equipos</h1>
            <p className="text-muted-foreground text-xs">Divide a los jugadores</p>
          </div>
        </div>

        {/* Assignment Mode Selection */}
        {!assignmentMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col justify-center"
          >
            <Card className="paper-card border-2 border-border">
              <CardContent className="p-4 space-y-3 relative z-10">
                <Button
                  onClick={autoAssignTeams}
                  size="lg"
                  className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 text-base"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Asignación Automática
                </Button>
                <Button
                  onClick={manualAssignTeams}
                  variant="outline"
                  size="lg"
                  className="w-full btn-paper border-2 font-semibold h-14 text-base"
                >
                  <Users2 className="w-5 h-5 mr-2" />
                  Asignación Manual
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Team Names Input - Compact */}
        {assignmentMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="shrink-0"
          >
            <Card className="paper-card border border-primary/30">
              <CardContent className="p-3 relative z-10">
                <p className="text-xs text-muted-foreground mb-2">Nombres de Equipos (opcional)</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Equipo A"
                    value={teamNames.A}
                    onChange={(e) => setTeamNames({ ...teamNames, A: e.target.value || 'Equipo A' })}
                    className="border h-9 text-sm"
                  />
                  <Input
                    placeholder="Equipo B"
                    value={teamNames.B}
                    onChange={(e) => setTeamNames({ ...teamNames, B: e.target.value || 'Equipo B' })}
                    className="border h-9 text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Manual Assignment - Unassigned Players - Compact */}
        {assignmentMode === 'manual' && unassignedPlayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="shrink-0"
          >
            <Card className="paper-card border border-border">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm">Sin asignar ({unassignedPlayers.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-1.5 relative z-10 max-h-32 overflow-y-auto">
                {unassignedPlayers.map((player) => (
                  <div
                    key={player}
                    className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                  >
                    <span className="font-medium truncate">{player}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => moveToTeam(player, 'A')}
                        className="btn-paper bg-primary text-primary-foreground h-7 px-2 text-xs"
                      >
                        A
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveToTeam(player, 'B')}
                        className="btn-paper border h-7 px-2 text-xs"
                      >
                        B
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Teams Display - Compact */}
        {assignmentMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-2 flex-1 min-h-0 overflow-hidden"
          >
            {/* Team A */}
            <Card className="paper-card border border-primary flex flex-col min-h-0">
              <CardHeader className="bg-primary/10 p-2 shrink-0">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="truncate">{teamNames.A}</span>
                  <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs px-1.5">
                    {teams.A.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 relative z-10 flex-1 min-h-0 overflow-y-auto">
                {teams.A.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">Sin jugadores</p>
                ) : (
                  <div className="space-y-1">
                    {teams.A.map((player, index) => (
                      <div
                        key={player}
                        className="p-1.5 bg-primary/5 rounded border border-primary/20 flex items-center justify-between"
                      >
                        <span className="font-medium text-xs truncate">{player}</span>
                        {assignmentMode === 'manual' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveToTeam(player, 'B')}
                            className="h-5 w-5 p-0 text-xs"
                          >
                            →
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team B */}
            <Card className="paper-card border border-accent flex flex-col min-h-0">
              <CardHeader className="bg-accent/10 p-2 shrink-0">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="truncate">{teamNames.B}</span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs px-1.5">
                    {teams.B.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 relative z-10 flex-1 min-h-0 overflow-y-auto">
                {teams.B.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">Sin jugadores</p>
                ) : (
                  <div className="space-y-1">
                    {teams.B.map((player, index) => (
                      <div
                        key={player}
                        className="p-1.5 bg-accent/5 rounded border border-accent/20 flex items-center justify-between"
                      >
                        <span className="font-medium text-xs truncate">{player}</span>
                        {assignmentMode === 'manual' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveToTeam(player, 'A')}
                            className="h-5 w-5 p-0 text-xs"
                          >
                            ←
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Confirm Button - Compact */}
        {assignmentMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2 shrink-0"
          >
            {assignmentMode === 'auto' && (
              <Button
                onClick={autoAssignTeams}
                variant="outline"
                size="sm"
                className="w-full btn-paper border h-9 text-sm"
              >
                <Shuffle className="w-3 h-3 mr-1.5" />
                Mezclar de Nuevo
              </Button>
            )}
            <Button
              onClick={handleConfirm}
              disabled={teams.A.length === 0 || teams.B.length === 0 || unassignedPlayers.length > 0}
              size="lg"
              className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12"
            >
              Confirmar Equipos
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Teams;