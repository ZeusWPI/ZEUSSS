import { PrismaClient } from "@prisma/client";

export async function createPouleMatches(prisma: PrismaClient, teams: number[], poule: any) {
  for (const team1id of teams) {
    for (const team2id of teams) {
      if (team1id < team2id) {
        const pouleMatch = await prisma.pouleMatch.create({
          data: {
            pouleId: poule.id,
            date: null,
          },
        });

        await prisma.pouleMatchTeam.create({
          data: {
            pouleMatchId: pouleMatch.id,
            teamId: team1id,
            score: null,
          },
        });

        await prisma.pouleMatchTeam.create({
          data: {
            pouleMatchId: pouleMatch.id,
            teamId: team2id,
            score: null,
          },
        });
      }
    }
  }

  return {
    id: poule.id,
    name: poule.name,
    teams: await Promise.all(
      teams.map(
        async (teamId: number) =>
          await prisma.team.findFirst({
            where: {
              id: teamId,
            },
          })
      )
    ),
  };
}
