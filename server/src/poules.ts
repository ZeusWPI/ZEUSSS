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

export async function matchesHaveBeenPlayed(prisma: PrismaClient, pouleId: number): Promise<boolean> {
  const pouleMatches = await prisma.pouleMatch.findMany({
    where: {
      pouleId: pouleId,
    },
  });
  for (const pouleMatch of pouleMatches) {
    // Check if there exists a score for a poule match team
    const pouleMatchTeam = await prisma.pouleMatchTeam.findFirst({
      where: {
        pouleMatchId: pouleMatch.id,
        score: {
          not: null,
        },
      },
    });
    if (pouleMatchTeam !== null) {
      return true;
    }
  }
  return false;
}

export async function deletePouleMatchesAndTeams(prisma: PrismaClient, pouleId: number) {
  // Delete all poule match teams
  await prisma.pouleMatchTeam.deleteMany({
    where: {
      pouleMatch: {
        pouleId: pouleId,
      },
    },
  });

  // Delete all poule matches
  await prisma.pouleMatch.deleteMany({
    where: {
      pouleId: pouleId,
    },
  });
}
