import { Events, type Client } from "discord.js";

import db from "../db/main";
import { getLogger } from "../logger";
import type { Event } from "../types";

const logger = getLogger("ready");

const event: Event = {
	name: Events.ClientReady,
	once: true,
	execute: async (client: Client) => {
		try {
			await db.sync();
			logger.info("Database synced");
		} catch (error) {
			logger.error({ error }, "Database sync failed");
			process.exit(1);
		}

		logger.info({ user: client.user?.tag }, "Client logged in");
	}
};

export default event;
