import { FastifyPluginAsync } from "fastify";
import { poulesRouter } from "./poules";
import { bracketRouter } from "./bracket";
import { mainRouter } from "./main";

export const publicRouter: FastifyPluginAsync = async server => {
  server.register(mainRouter.public);
  server.register(poulesRouter.public);
  server.register(bracketRouter.public);
};

export const adminRouter: FastifyPluginAsync = async server => {
  server.register(mainRouter.admin);
  server.register(poulesRouter.admin);
  server.register(bracketRouter.admin);
};
