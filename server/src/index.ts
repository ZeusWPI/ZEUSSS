import * as dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";
import fastify_static from "@fastify/static";
import cors from "@fastify/cors";
import * as path from "path";
import * as Sentry from "@sentry/node";
import { adminRouter, publicRouter } from "./controllers";

if (process.env.ENV === "production") {
  Sentry.init({ dsn: "https://979ee2ae77cd4906a5c50fb0bd6e36db@glitchtip.zeus.gent/9" });
}

const server = fastify({
  disableRequestLogging: true,
  logger: {
    level: process.env.ENV === "production" ? "info" : "debug",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

if (process.env.ENV === "production") {
  server.setErrorHandler(async (error, request, reply) => {
    // Logging locally
    server.log.error(error);
    // Sending error to be logged in Sentry
    Sentry.captureException(error);
    reply.status(500).send({ error: "Something went wrong" });
  });
}

server.register(cors, {
  origin: process.env.ENV === "production" ? "score.vek.be" : "*",
});

server.register(fastify_static, {
  root: path.join(process.cwd(), "public"),
  prefix: "/",
  index: "index.html",
  wildcard: false,
});

server.register(publicRouter, { prefix: "/api" });
server.register(adminRouter, { prefix: "/api/admin" });

server.get("*", (_, res) => {
  res.sendFile("index.html");
});

server.listen({ host: "0.0.0.0", port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
