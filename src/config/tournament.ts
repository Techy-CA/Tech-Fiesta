export const TOURNAMENT_RULES = {
  maxTeams: 5,
  rosterSize: 5,
  playoffCut: 4,
  pointsPerWin: 3,
  pointsPerLoss: 0,
  groupFormat: 'BO1' as const,
  semifinalFormat: 'BO3' as const,
  finalFormat: 'BO5' as const,
  firstMatchTime: '11:00',
  matchIntervalMinutes: 45,
}

export const groupFixtureCount = (teams: number) => (teams * (teams - 1)) / 2
