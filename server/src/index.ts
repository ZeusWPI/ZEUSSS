import fastify from "fastify";
import { type BracketMatch, PrismaClient } from "@prisma/client";
import fastify_static from "@fastify/static";
import * as path from "path";
import { createPouleMatches, deletePouleMatchesAndTeams, matchesHaveBeenPlayed } from "./poules";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prisma = new PrismaClient();
const server = fastify();

server.register(fastify_static, {
  root: path.join(process.cwd(), "public"),
  prefix: "/public/",
});

server.get("/", (_, res) => {
  res.sendFile("index.html");
});

server.register(
  (instance, opts, next) => {
    // GET requests
    instance.get("/teams", async (request: any, reply) => {
      if (request.query.league) {
        const teams = await prisma.team.findMany({
          where: {
            league: request.query.league,
          },
        });
        reply.send(teams);
      } else {
        const teams = await prisma.team.findMany();
        reply.send(teams);
      }
    });
    instance.get("/teams/:id", async (request: any, reply) => {
      const team = await prisma.team.findFirst({
        where: {
          id: parseInt(request.params.id),
        },
      });

      if (!team) {
        reply.code(404).send();
        return;
      }

      reply.send(team);
    });
    instance.get("/poules", async (request, reply) => {
      const poules = await prisma.poule.findMany({
        select: {
          id: true,
          name: true,
          PouleMatch: {
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
              },
            },
          },
        },
      });

      const mapped_poules = poules.map(p => {
        return {
          id: p.id,
          name: p.name,
          teams: p.PouleMatch.flatMap(pm => pm.PouleMatchTeam.map(pmt => pmt.team)),
        };
      });

      reply.send(mapped_poules);
    });
    instance.get("/poules/:id", async (request: any, reply) => {
      type PouleTeam = {
        id: number;
        name: string;
        league: string;
      };

      type CompletePoule = {
        id: number;
        name: string;
        teams: PouleTeam[];
        matches: string;
      };

      const id_param = parseInt(request.params.id);

      const poule = await prisma.poule.findFirst({
        where: {
          id: id_param,
        },
        select: {
          id: true,
          name: true,
          PouleMatch: {
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
              },
            },
          },
        },
      });

      if (!poule) {
        reply.code(404).send();
        return;
      }

      const poule_teams = poule.PouleMatch.flatMap(pm => pm.PouleMatchTeam.map(pmt => pmt.team));

      const complete_poule: CompletePoule = {
        id: id_param,
        name: poule.name,
        teams: poule_teams,
        matches: `/poules/${poule.id}/matches`,
      };

      reply.send(complete_poule);
    });
    instance.get("/poules/:pouleId/matches", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/poules/:pouleId/matches/:matchId", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/bracket", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/bracket/matches", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/bracket/matches/:matchId", async (request, reply) => {
      // TODO: implement
    });

    // POST requests
    instance.post("/teams", async (request: any, reply) => {
      // Create a new team
      const team = await prisma.team.create({
        data: {
          name: request.body.name,
          league: request.body.league,
        },
      });
      reply.send(team);
    });
    instance.post("/poules", async (request: any, reply) => {
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

      // Create a new poule
      const poule = await prisma.poule.create({
        data: {
          name: request.body.name,
        },
      });

      const result = await createPouleMatches(prisma, request.body.teams, poule);
      reply.send(result);
    });

    instance.post("/bracket", async (request: any, reply) => {
      const amount: number = request.body.amount;
      const league: string = request.body.league;

      if (league.length === 0) {
        reply.status(400).send({ message: "league should not be empty" });
        return;
      }

      const bracketMatchesForLeague = await prisma.bracketMatch.findMany({
        where: {
          league: league,
        },
      });

      if (bracketMatchesForLeague.length !== 0) {
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
              league: league,
              date: null,
            },
          });
        } else {
          const new_parent = await prisma.bracketMatch.create({
            data: {
              parentId: parent === null ? null : parent.id,
              league: league,
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

    // PATCH requests
    instance.patch("/teams/:teamId", async (request: any, reply) => {
      // Update a team's name and/or league (league only if team not used in a poule yet)
      if (request.body.league !== undefined) {
        const teamIsUsed = !!(await prisma.pouleMatchTeam.findFirst({
          where: {
            teamId: parseInt(request.params.teamId),
          },
        }));
        if (teamIsUsed) {
          reply.status(400).send({ message: "Team is already used in a poule." });
          return;
        }
      }

      const data: any = {};
      if (request.body.name !== undefined) {
        data["name"] = request.body.name;
      }
      if (request.body.league !== undefined) {
        data["league"] = request.body.league;
      }

      // Update a team's name and/or league
      const team = await prisma.team.update({
        where: {
          id: parseInt(request.params.teamId),
        },
        data: data,
      });

      reply.send(team);
    });
    instance.patch("/poules/:id", async (request: any, reply) => {
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
    instance.patch("/poules/:pouleId/matches/:matchId", async (request, reply) => {
      // TODO: implement
    });
    instance.patch("/poules/:pouleId/matches/:matchId/:teamId", async (request, reply) => {
      // TODO: implement
    });
    instance.patch("/bracket/matches/:matchId", async (request, reply) => {
      // TODO: implement
    });
    instance.patch("/bracket/matches/:matchId/:teamId", async (request, reply) => {
      // TODO: implement
    });

    // DELETE requests
    instance.delete("/teams/:teamId", async (request: any, reply) => {
      // Only delete if no poule matches are using this team
      const teamIsUsed = !!(await prisma.pouleMatchTeam.findFirst({
        where: {
          teamId: parseInt(request.params.teamId),
        },
      }));
      if (teamIsUsed) {
        reply.status(400).send({ message: "Team is already used in a poule match." });
        return;
      }

      // Delete a team with id = teamId
      await prisma.team.delete({
        where: {
          id: parseInt(request.params.teamId),
        },
      });

      reply.status(200);
    });
    instance.delete("/poules/:pouleId", async (request: any, reply) => {
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

    next();
  },
  { prefix: "/api" }
);

server.listen({ host: "0.0.0.0", port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
