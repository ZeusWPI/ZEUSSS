import { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/db";
import { PouleMatch, PouleMatchTeam, Team } from "@prisma/client";
import { createPouleMatches, deletePouleMatchesAndTeams, matchesHaveBeenPlayed } from "../poules";
import dayjs from "dayjs";

const publicRouter: FastifyPluginAsync = async server => {
  server.get<{ Querystring: { league: string } }>("/poules", async (request, reply) => {
    const poules = await prisma.poule.findMany({
      select: {
        id: true,
        name: true,
        PouleMatch: {
          include: {
            PouleMatchTeam: {
              select: {
                score: true,
                team: {
                  select: {
                    id: true,
                    name: true,
                    league: true,
                  },
                },
              },
              orderBy: {
                id: "asc",
              },
            },
          },
        },
      },
      where: {
        league: request.query.league,
      },
      orderBy: {
        id: "asc",
      },
    });

    const mapped_poules = poules.map(p => {
      const poule_teams = p.PouleMatch.reduce<TeamWScore[]>((arr, match) => {
        // Score should be based on typical poule points: 3 for a win, 1 for a draw, 0 for a loss
        if (
          match.date === null ||
          match.PouleMatchTeam.length === 0 ||
          match.PouleMatchTeam.every(pmt => pmt.score === null)
        ) {
          match.PouleMatchTeam.forEach(dbTeam => {
            const team = arr.find(t => t.id === dbTeam.team.id);
            if (!team) {
              arr.push({ ...dbTeam.team, score: 0 });
            }
          });
          return arr;
        }

        const firstScore = match.PouleMatchTeam[0].score;
        if (match.PouleMatchTeam.every(pmt => pmt.score === firstScore)) {
          match.PouleMatchTeam.forEach(dbTeam => {
            const team = arr.find(t => t.id === dbTeam.team.id);
            if (team) {
              team.score += 1;
            } else {
              arr.push({ ...dbTeam.team, score: 1 });
            }
          });
          return arr;
        }

        // Find winner
        const winner = match.PouleMatchTeam.reduce(
          (winner, pmt) => {
            if (pmt === null || pmt.score === null) {
              return winner;
            }
            if (winner === null || winner.score === null) {
              return pmt;
            }
            if (pmt.score > winner.score) {
              return pmt;
            }
            return winner;
          },
          null as {
            team: {
              id: number;
              name: string;
              league: string;
            };
            score: number | null;
          } | null
        );

        match.PouleMatchTeam.forEach(dbTeam => {
          const team = arr.find(t => t.id === dbTeam.team.id);
          const score = dbTeam.team.id === winner?.team.id ? 3 : 0;
          if (team) {
            team.score += score;
          } else {
            arr.push({ ...dbTeam.team, score });
          }
        });

        return arr;
      }, []);
      return {
        id: p.id,
        name: p.name,
        teams: poule_teams,
      };
    });

    reply.send(mapped_poules);
  });
  server.get("/poules/:pouleId/matches", async (request: any, reply) => {
    // Check if poule exists
    const poule = await prisma.poule.findFirst({
      where: {
        id: parseInt(request.params.pouleId),
      },
    });
    if (!poule) {
      reply.code(404).send();
      return;
    }

    // Get list of matches
    const pouleMatches = await prisma.pouleMatch.findMany({
      where: {
        pouleId: parseInt(request.params.pouleId),
      },
      include: {
        PouleMatchTeam: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                league: true,
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const pouleMatchesFormatted = pouleMatches
      .map(pm => {
        return {
          id: pm.id,
          date: pm.date,
          location: pm.location,
          teams: pm.PouleMatchTeam.map(pmt => {
            return {
              id: pmt.team.id,
              name: pmt.team.name,
              score: pmt.score,
              league: pmt.team.league,
            };
          }),
        };
      })
      .sort((pm1, pm2) => {
        if (pm1.date && !pm2.date) return 1;
        if (pm2.date && !pm1.date) return -1;
        if (pm2.date && pm1.date) return pm2.date.getTime() - pm1.date.getTime();
        const pm1HasScore = pm1.teams.some(t => t.score !== null);
        const pm2HasScore = pm2.teams.some(t => t.score !== null);
        if (pm1HasScore && !pm2HasScore) return -1;
        if (!pm1HasScore && pm2HasScore) return 1;
        return 0;
      });

    reply.send(pouleMatchesFormatted);
  });

  server.get<{ Querystring: { count: string; league: string } }>("/poules/matches", async (req, res) => {
    const count = parseInt(req.query.count);
    if (!count) {
      return res.status(200).send([]);
    }

    const matches = await prisma.pouleMatch.findMany({
      where: {
        AND: {
          NOT: {
            OR: [
              {
                date: null,
              },
              {
                date: {
                  gte: new Date(),
                },
              },
            ],
          },
          poule: {
            league: req.query.league,
          },
        },
      },
      include: {
        PouleMatchTeam: {
          include: {
            team: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: count,
    });

    // Extra filter is needed because this is not posible in prisma unless you use rawQuery
    const now = dayjs();
    return matches
      .filter(match => dayjs(match.date).add(30, "minute").isBefore(now))
      .map(
        (
          match: PouleMatch & {
            teams?: (Team & { score: number | null })[];
            PouleMatchTeam?: (PouleMatchTeam & { team: Team })[];
          }
        ) => {
          match.teams = match.PouleMatchTeam?.map(pmt => ({ ...pmt.team, score: pmt.score })) ?? [];
          delete match.PouleMatchTeam;
          return match;
        }
      );
  });
};

const adminRouter: FastifyPluginAsync = async server => {
  server.post<{ Body: { name: string; league: string; teams: number[] } }>("/poules", async (request, reply) => {
    // Check if at least 2 teams are given
    if (request.body.teams.length < 2) {
      reply.status(400).send({ message: "At least 2 teams are required." });
      return;
    }

    // Checking if teams exist
    for (const teamId of request.body.teams) {
      const exists = !!(await prisma.team.findFirst({
        where: {
          id: teamId,
        },
      }));
      if (!exists) {
        reply.status(400).send({ message: `Team with id ${teamId} does not exists.` });
        return;
      }
      const alreadyAssigned = await prisma.pouleMatchTeam.findFirst({
        where: {
          teamId,
        },
      });
      if (alreadyAssigned) {
        reply.status(400).send({ message: `Team with id ${teamId} is already assigned to another pool.` });
        return;
      }
    }

    // Create a new poule
    const poule = await prisma.poule.create({
      data: {
        name: request.body.name,
        league: request.body.league,
      },
    });

    const result = await createPouleMatches(prisma, request.body.teams, poule);
    reply.send(result);
  });

  server.patch("/poules/:id", async (request: any, reply) => {
    // Check that poule exists
    let poule = await prisma.poule.findFirst({
      where: {
        id: parseInt(request.params.id),
      },
    });
    const pouleExists = !!poule;
    if (!pouleExists) {
      reply.status(400).send({ message: "Poule does not exist." });
      return;
    }

    // If name is given, update poule name
    if (request.body.name !== undefined) {
      poule = await prisma.poule.update({
        where: {
          id: parseInt(request.params.id),
        },
        data: {
          name: request.body.name,
        },
      });
    }

    // If teams are given, update poule teams
    if (request.body.teams !== undefined) {
      // Check if at least 2 teams are given
      if (request.body.teams.length < 2) {
        reply.status(400).send({ message: "At least 2 teams are required." });
        return;
      }

      // Checking if teams exist
      for (const teamId of request.body.teams) {
        const exists = !!(await prisma.team.findFirst({
          where: {
            id: teamId,
          },
        }));
        if (!exists) {
          reply.status(400).send({ message: `Team with id ${teamId} does not exists.` });
          return;
        }
      }

      // Check if matches have already been played (score !== null)
      const illegalToDelete = await matchesHaveBeenPlayed(prisma, parseInt(request.params.id));
      if (illegalToDelete) {
        reply.status(400).send({ message: "Matches have already been played." });
        return;
      }

      // Delete all poule matches and teams
      await deletePouleMatchesAndTeams(prisma, parseInt(request.params.id));

      // Create new poule matches
      const result = await createPouleMatches(prisma, request.body.teams, poule);
      reply.send(result);
      return;
    }
    reply.send(poule);
  });
  server.patch<{
    Body: { date: string; scores: Record<number, number>; location?: string };
    Params: { matchId: string; pouleId: string };
  }>("/poules/:pouleId/matches/:matchId", async (request, reply) => {
    // Check if matchId belongs to pouleId
    let pouleMatch = await prisma.pouleMatch.findFirst({
      where: {
        id: parseInt(request.params.matchId),
        pouleId: parseInt(request.params.pouleId),
      },
    });
    if (!pouleMatch) {
      reply.status(400).send({
        message: `Match with id ${request.params.matchId} not found in poule ${request.params.pouleId}.`,
      });
      return;
    }

    const dataToUpdate: Partial<PouleMatch> = {};
    if (request.body.date) {
      dataToUpdate.date = new Date(request.body.date);
    }
    if (request.body.location) {
      dataToUpdate.location = request.body.location;
    }
    if (Object.keys(dataToUpdate).length === 0) {
      return reply.status(400).send({ message: "body has nothing to update" });
    }

    pouleMatch = await prisma.pouleMatch.update({
      where: {
        id: parseInt(request.params.matchId),
      },
      data: dataToUpdate,
    });

    for (const teamId in request.body.scores) {
      const pouleMatchTeam = await prisma.pouleMatchTeam.findFirst({
        where: {
          teamId: parseInt(teamId),
          pouleMatchId: parseInt(request.params.matchId),
        },
      });
      if (!pouleMatchTeam) {
        return reply.status(400).send({
          message: `${teamId} is not a player in the match ${request.params.matchId} in pool ${request.params.pouleId}`,
        });
      }
      await prisma.pouleMatchTeam.update({
        where: {
          id: parseInt(teamId),
        },
        data: {
          score: request.body.scores[Number(teamId)],
        },
      });
    }

    reply.send(pouleMatch);
  });
  server.patch("/poules/:pouleId/matches/:matchId/teams/:teamId", async (request: any, reply) => {
    // Check if matchId belongs to pouleMatchId and pouleId
    let pouleMatchTeam = await prisma.pouleMatchTeam.findFirst({
      where: {
        pouleMatchId: parseInt(request.params.matchId),
        teamId: parseInt(request.params.teamId),
        pouleMatch: {
          pouleId: parseInt(request.params.pouleId),
        },
      },
    });
    if (!pouleMatchTeam) {
      reply.status(400).send({
        message: `Team with id ${request.params.teamId} not found in match ${request.params.matchId} in poule ${request.params.pouleId}.`,
      });
      return;
    }

    // Check if score is given
    if (request.body.score !== undefined) {
      pouleMatchTeam = await prisma.pouleMatchTeam.update({
        where: {
          id: pouleMatchTeam.id,
        },
        data: {
          score: request.body.score,
        },
      });
    }
    reply.send(pouleMatchTeam);
  });
  server.delete("/poules/:pouleId", async (request: any, reply) => {
    // Check that poule exists
    const poule = await prisma.poule.findFirst({
      where: {
        id: parseInt(request.params.pouleId),
      },
    });
    const pouleExists = !!poule;
    if (!pouleExists) {
      return;
    }

    // Check if matches have already been played (score !== null)
    const illegalToDelete = await matchesHaveBeenPlayed(prisma, poule.id);
    if (illegalToDelete) {
      reply.status(400).send({ message: "Matches have already been played." });
      return;
    }

    // Delete all poule matches and teams
    await deletePouleMatchesAndTeams(prisma, poule.id);

    // Delete poule
    await prisma.poule.delete({
      where: {
        id: poule.id,
      },
    });

    reply.status(200);
  });
};

export const poulesRouter = {
  public: publicRouter,
  admin: adminRouter,
};
