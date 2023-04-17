import { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/db";

const publicRouter: FastifyPluginAsync = async server => {
  server.get("/teams", async (request: any, reply) => {
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
  server.get("/teams/:id", async (request: any, reply) => {
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
};

const adminRouter: FastifyPluginAsync = async server => {
  server.post("/teams", async (request: any, reply) => {
    // Create a new team
    const team = await prisma.team.create({
      data: {
        name: request.body.name,
        league: request.body.league,
      },
    });
    reply.send(team);
  });
  server.patch("/teams/:teamId", async (request: any, reply) => {
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
  server.delete("/teams/:teamId", async (request: any, reply) => {
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
};

export const teamRouter = {
  public: publicRouter,
  admin: adminRouter,
};
