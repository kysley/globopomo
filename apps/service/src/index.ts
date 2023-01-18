import fastifyServer from "fastify";
// import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
// import socketioServer from "fastify-socket.io";
// import { router } from "./router";
// import { createContext } from "./context";
// import fastifyCookie from "@fastify/cookie";
// import fastifyJwt from "@fastify/jwt";
dotenv.config();

type Mode = "work" | "break";

const WORK_DURATION = 60 * 1000 * 25;
const BREAK_DURATION = 60 * 1000 * 5;

const start = Date.now();
const initialMode: Mode = "work";

let currentMode: Mode = initialMode;
let lastSwapped: number = start;

setInterval(() => {
	const now = Date.now();
	const diff = now - lastSwapped;

	if (currentMode === "work") {
		if (diff >= WORK_DURATION) {
			console.info("swapping to break");
			currentMode = "break";
			lastSwapped = now;
		}
	} else if (currentMode === "break") {
		if (diff >= BREAK_DURATION) {
			console.info("swapping to work");
			currentMode = "work";
			lastSwapped = now;
		}
	}
	// console.log(currentMode);
}, 1000);

const fastify = fastifyServer();
fastify.register(cors, {
	// put your options here
	origin: "http://localhost:5173",
	credentials: true,
});

fastify.get("/", (req, res) => {
	const timeUntil = currentMode === "work" ? WORK_DURATION : BREAK_DURATION;

	res.code(200).send({
		mode: currentMode,
		endsAt: lastSwapped + timeUntil,
		config: {
			workDuration: WORK_DURATION,
			breakDuration: BREAK_DURATION,
		},
	});
});

(async () => {
	try {
		// @ts-ignore
		await fastify.listen({ port: process.env.PORT || 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
})();

export {};
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
