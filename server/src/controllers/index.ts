import { FastifyPluginAsync } from "fastify";
import { poulesRouter } from "./poules";
import { bracketRouter } from "./bracket";
import { teamRouter } from "./teams";

export const publicRouter: FastifyPluginAsync = async server => {
  server.register(teamRouter.public);
  server.register(poulesRouter.public);
  server.register(bracketRouter.public);
};

export const adminRouter: FastifyPluginAsync = async server => {
  server.register(teamRouter.admin);
  server.register(poulesRouter.admin);
  server.register(bracketRouter.admin);
};
