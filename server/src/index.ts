import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import fastify_static from "@fastify/static";
import * as path from "path";

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
    instance.get("/teams", async (request, reply) => {
      const teams = await prisma.team.findMany();
      reply.send(teams);
    });
    instance.get("/teams/{category}", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/teams/{id}", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/poules", async (request, reply) => {
      // TODO: list of poules, joined with teams and poule_match_teams
    });
    instance.get("/poules/{id}", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/poules/{pouleId}/matches", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/poules/{pouleId}/matches/{matchId}", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/bracket", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/bracket/matches", async (request, reply) => {
      // TODO: implement
    });
    instance.get("/bracket/matches/{matchId}", async (request, reply) => {
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
      // Checking if teams exist
      for (const teamid of request.body.teams) {
        const exists = !!(await prisma.team.findFirst({
          where: {
            id: teamid,
          },
        }));
        if (!exists) {
          reply.status(400).send({ message: `Team with id ${teamid} does not exists.` });
        }
      }

      // Create a new team
      const poule = await prisma.poule.create({
        data: {
          name: request.body.name,
        },
      });
      reply.send(poule);

      for (const team1id of request.body.teams) {
        for (const team2id of request.body.teams) {
          if (team1id < team2id) {
            const pouleMatch = await prisma.pouleMatch.create({
              data: {
                pouleId: poule.id,
                date: new Date(), // TODO: should be null
              },
            });
            reply.send(pouleMatch);

            const pouleMatchTeam1 = await prisma.pouleMatchTeam.create({
              data: {
                pouleMatchId: pouleMatch.id,
                teamId: team1id,
                score: -1, // TODO: should be null
              },
            });
            reply.send(pouleMatchTeam1);

            const pouleMatchTeam2 = await prisma.pouleMatchTeam.create({
              data: {
                pouleMatchId: pouleMatch.id,
                teamId: team2id,
                score: -1, // TODO: should be null
              },
            });
            reply.send(pouleMatchTeam2);
          }
        }
      }
    });

    instance.post("/bracket", async (request, reply) => {
      // TODO: implement
    });

    // PATCH requests
    instance.patch("/teams/{id}", async (request, reply) => {
      // TODO: implement
    });
    instance.patch("/poules/{id}", async (request, reply) => {
      // TODO: implement
    });
    instance.patch("/poules/{pouleId}/matches/{matchId}", async (request, reply) => {
      // TODO: implement
    });
    instance.patch("/poules/{pouleId}/matches/{matchId}/{teamId}", async (request, reply) => {
      // TODO: implement
    });
    instance.patch("/bracket/matches/{matchId}", async (request, reply) => {
      // TODO: implement
    });
    instance.patch("/bracket/matches/{matchId}/{teamId}", async (request, reply) => {
      // TODO: implement
    });

    // DELETE requests
    instance.delete("/teams/{teamId}", async (request, reply) => {
      // TODO: implement
    });
    instance.delete("/poules/{pouleId}", async (request, reply) => {
      // TODO: implement
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
