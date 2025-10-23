import pino from "pino";

const isDev = process.env.NODE_ENV === "development";
const transport = isDev
	? pino.transport({
			target: "pino-pretty",
			options: {
				colorize: true,
				translateTime: "SYS:standard",
				ignore: "pid,hostname"
			}
		})
	: undefined;

const logger = pino(
	{
		level: process.env.LOG_LEVEL || (isDev ? "debug" : "info")
	},
	transport
);

export function getLogger(name: String) {
	return logger.child({ module: name });
}
