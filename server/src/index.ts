import fastify from "fastify";
import { PrismaClient } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prisma = new PrismaClient();
const server = fastify();

server.get("/teams", async (request, reply) => {
  const teams = await prisma.team.findMany();
  reply.send(teams);
});

server.listen(8080).then(() => {
  console.log("Server started");
});
