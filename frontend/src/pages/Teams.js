import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateGameState({ screen: 'configuration' })}
            className="btn-paper"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Equipos</h1>
            <p className="text-muted-foreground text-sm">Divide a los jugadores</p>
          </div>
        </div>

        {/* Assignment Mode Selection */}
        {!assignmentMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="paper-card border-2 border-border">
              <CardContent className="p-6 space-y-4 relative z-10">
                <Button
                  onClick={autoAssignTeams}
                  size="lg"
                  className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-16 text-base"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Asignación Automática
                </Button>
                <Button
                  onClick={manualAssignTeams}
                  variant="outline"
                  size="lg"
                  className="w-full btn-paper border-2 font-semibold h-16 text-base"
                >
                  <Users2 className="w-5 h-5 mr-2" />
                  Asignación Manual
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Manual Assignment - Unassigned Players */}
        {assignmentMode === 'manual' && unassignedPlayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="paper-card border-2 border-border">
              <CardHeader>
                <CardTitle className="text-base">Jugadores sin asignar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 relative z-10">
                {unassignedPlayers.map((player) => (
                  <div
                    key={player}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="font-medium">{player}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => moveToTeam(player, 'A')}
                        className="btn-paper bg-primary text-primary-foreground"
                      >
                        Equipo A
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveToTeam(player, 'B')}
                        className="btn-paper border-2"
                      >
                        Equipo B
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Teams Display */}
        {assignmentMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {/* Team A */}
            <Card className="paper-card border-2 border-primary">
              <CardHeader className="bg-primary/10">
                <CardTitle className="flex items-center justify-between">
                  <span>Equipo A</span>
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {teams.A.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 relative z-10">
                {teams.A.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Sin jugadores
                  </p>
                ) : (
                  teams.A.map((player, index) => (
                    <motion.div
                      key={player}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-primary/5 rounded-lg border border-primary/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{player}</span>
                        {assignmentMode === 'manual' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveToTeam(player, 'B')}
                            className="h-8 text-xs"
                          >
                            → B
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Team B */}
            <Card className="paper-card border-2 border-accent">
              <CardHeader className="bg-accent/10">
                <CardTitle className="flex items-center justify-between">
                  <span>Equipo B</span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {teams.B.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 relative z-10">
                {teams.B.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Sin jugadores
                  </p>
                ) : (
                  teams.B.map((player, index) => (
                    <motion.div
                      key={player}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-accent/5 rounded-lg border border-accent/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{player}</span>
                        {assignmentMode === 'manual' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveToTeam(player, 'A')}
                            className="h-8 text-xs"
                          >
                            ← A
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Confirm Button */}
        {assignmentMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {assignmentMode === 'auto' && (
              <Button
                onClick={autoAssignTeams}
                variant="outline"
                className="w-full btn-paper border-2"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Mezclar de Nuevo
              </Button>
            )}
            <Button
              onClick={handleConfirm}
              disabled={teams.A.length === 0 || teams.B.length === 0 || unassignedPlayers.length > 0}
              size="lg"
              className="w-full btn-paper bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14"
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