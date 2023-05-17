import fastifyServer from "fastify";
// import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { Globopomo } from "timer";
// import socketioServer from "fastify-socket.io";
// import { router } from "./router";
// import { createContext } from "./context";
// import fastifyCookie from "@fastify/cookie";
// import fastifyJwt from "@fastify/jwt";
dotenv.config();
const globo = new Globopomo({ breakDuration: 5, workDuration: 25 });

const fastify = fastifyServer();
fastify.register(cors, {
  // put your options here
  origin: ["http://localhost:5173", "https://pomo.e8y.fun/"],
  credentials: true,
});

fastify.get("/pomo", (req, res) => {
  res.code(200).send(globo.info);
});

(async () => {
  try {
    fastify.listen({ port: Number(process.env.PORT) || 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();

// export {};
// export type { AppRouter } from "./router";

// export const fastify = fastifyServer();

// fastify.register(cors, {
//   // put your options here
//   origin: "http://localhost:5173",
//   credentials: true,
// });

// fastify.register(fastifyCookie, {
//   secret: "123098",
//   // hook: "onRequest",
// });

// fastify.register(fastifyJwt, {
//   secret: "123098",
//   cookie: {
//     cookieName: "token",
//     signed: false,
//   },
// });

// fastify.register(fastifyTRPCPlugin, {
//   prefix: "/trpc",
//   trpcOptions: {
//     router,
//     createContext,
//   },
// });

// fastify.register(socketioServer, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//   },
//   cookie: {
//     name: "token",
//     httpOnly: true,
//   },
// });

// export const CONNECTED_SOCKETS = new Map();

// const fourCharCode = () =>
//   Math.random().toString(36).substr(2, 4).toUpperCase();
