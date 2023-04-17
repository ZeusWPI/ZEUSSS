import { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/db";
import { BracketMatch } from "@prisma/client";
import { createBracketTree } from "../bracket";

const publicRouter: FastifyPluginAsync = async server => {
  server.get<{ Params: { league: string } }>("/bracket/:league/matches", async (request, reply) => {
    const bracketMatches = await prisma.bracketMatch.findMany({
      where: {
        league: request.params.league,
      },
      include: {
        BracketMatchTeam: {
          include: {
            team: true,
          },
          orderBy: {
            id: "asc",
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    if (bracketMatches.length === 0) {
      return reply.status(404).send({ message: "Er bestaat geen bracket voor deze league" });
    }

    bracketMatches.sort((m1, m2) => {
      if (m1.parentId === null) return -1;
      if (m2.parentId === null) return 1;
      return m2.parentId - m1.parentId;
    });

    const strippedMatches = bracketMatches.map(bm => {
      const match: Omit<BracketMatch, "BracketMatchTeam"> & { teams: TeamWScore[] } = {
        ...bm,
        teams: bm.BracketMatchTeam.map(bmt => ({ score: bmt.score ?? 0, ...bmt.team })),
      };
      // @ts-ignore
      delete match.BracketMatchTeam;
      return match;
    });

    // Make frontend life easier
    const bracketTree: Brackets.MatchNode[][] = createBracketTree(strippedMatches);
    return reply.status(200).send(bracketTree[0]);
  });
};

const adminRouter: FastifyPluginAsync = async server => {
  server.post("/bracket", async (request: any, reply) => {
    const amount: number = request.body.amount;
    const league: string = request.body.league;

    if (league.length === 0) {
      reply.status(400).send({ message: "league should not be empty" });
      return;
    }

    const bracketMatchForLeague = await prisma.bracketMatch.findFirst({
      where: {
        league,
      },
    });

    if (bracketMatchForLeague) {
      reply.status(400).send({ message: "league already has a bracket" });
      return;
    }

    if (2 ** Math.round(Math.log2(amount)) !== amount) {
      reply.status(400).send({ message: "amount should be a power of 2" });
      return;
    }

    const initializeBracketRecursive = async (n: number, parent: null | BracketMatch) => {
      if (n === 1) {
        // End recursion.
      } else if (n === 2) {
        await prisma.bracketMatch.create({
          data: {
            parentId: parent === null ? null : parent.id,
            league,
            date: null,
          },
        });
      } else {
        const new_parent = await prisma.bracketMatch.create({
          data: {
            parentId: parent === null ? null : parent.id,
            league,
            date: null,
          },
        });
        const half = n / 2;
        await initializeBracketRecursive(half, new_parent);
        await initializeBracketRecursive(half, new_parent);
      }
    };

    await initializeBracketRecursive(amount, null);
    reply.send({ message: "created" });
  });

  server.patch<{ Params: { matchId: string }; Body: { teams?: number[]; date?: string } }>(
    "/bracket/matches/:matchId",
    async (request, reply) => {
      const bracketMatch = await prisma.bracketMatch.findFirst({
        where: {
          id: Number(request.params.matchId),
        },
      });
      if (!bracketMatch) {
        return reply.status(400).send({
          message: `Match with id ${request.params.matchId} does not exist`,
        });
      }
      if (request.body.teams) {
        await prisma.bracketMatchTeam.deleteMany({
          where: {
            teamId: {
              notIn: request.body.teams,
            },
          },
        });
        const existingTeams = await prisma.bracketMatchTeam.findMany({
          where: {
            teamId: {
              in: request.body.teams,
            },
          },
        });
        const idsToCreate = request.body.teams.filter(tId => !existingTeams.find(exTeam => exTeam.id === tId));
        await prisma.bracketMatchTeam.createMany({
          data: idsToCreate.map(id => ({ teamId: id, bracketMatchId: bracketMatch.id })),
          skipDuplicates: true,
        });
      }
      if (request.body.date) {
        await prisma.bracketMatch.update({
          where: {
            id: bracketMatch.id,
          },
          data: {
            date: new Date(request.body.date),
          },
        });
      }
    }
  );
  server.patch("/bracket/matches/:matchId/teams/:teamId", async (request: any, reply) => {
    // Check if matchId belongs to teamId
    let bracketMatchTeam = await prisma.bracketMatchTeam.findFirst({
      where: {
        bracketMatchId: parseInt(request.params.matchId),
        teamId: parseInt(request.params.teamId),
      },
    });
    if (!bracketMatchTeam) {
      reply.status(400).send({
        message: `Team with id ${request.params.teamId} not found in match ${request.params.matchId}.`,
      });
      return;
    }

    // Check if score is given
    if (request.body.score !== undefined) {
      bracketMatchTeam = await prisma.bracketMatchTeam.update({
        where: {
          id: bracketMatchTeam.id,
        },
        data: {
          score: request.body.score,
        },
      });
    }
    reply.send(bracketMatchTeam);
  });
};

export const bracketRouter = {
  public: publicRouter,
  admin: adminRouter,
};
