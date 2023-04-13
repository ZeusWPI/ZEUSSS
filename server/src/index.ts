import fastify from "fastify";
import fastify_static from "@fastify/static";
import * as path from "path";

const server = fastify();

server.register(fastify_static, {
  root: path.join(process.cwd(), "public"),
  prefix: "/public/",
});

server.get("/", (_, res) => {
  res.sendFile("index.html");
});

server.listen({ host: "0.0.0.0", port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
