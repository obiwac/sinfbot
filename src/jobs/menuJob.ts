import { Client, TextChannel, EmbedBuilder } from "discord.js";
import cron from "node-cron";
import Parser from "rss-parser";

const CHANNEL_ID = "1343239320106176612"; 
const RSS_FEED_URL =
  "https://fetchrss.com/rss/67bb36151ce35e429b08cd0267bb35e599d603917e074562.rss";

export default async function startMenuJob(client: Client) {
  // Start a cron job that runs every Monday at 08:00 server time
  cron.schedule("0 8 * * 1", async () => {
    try {
      const parser = new Parser();
      const feed = await parser.parseURL(RSS_FEED_URL);

      // Filter for items containing “Découvrez le menu”
      const menuItems = feed.items.filter((item) =>
        (item.title ?? "").toLowerCase().includes("découvrez le menu")
      );

      if (menuItems.length === 0) {
        console.log("No 'Découvrez le menu' items found this week.");
        return;
      }

      const channel = client.channels.cache.get(CHANNEL_ID) as TextChannel;
      if (!channel) {
        console.error("Could not find the specified channel to post the menu!");
        return;
      }

      for (const item of menuItems) {
        // Grab an image from the <description> HTML (if present)
        const imageUrl = extractImageUrl(item.description ?? "");
        if (!imageUrl) {
          console.log(`No image URL found in item: ${item.title}`);
          continue;
        }

        // Use an EmbedBuilder to send the message
        const embed = new EmbedBuilder()
          .setTitle(item.title ?? "Menu")
          .setDescription(item.link ?? "")
          .setImage(imageUrl)
          .setColor("#00b060");

        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Error fetching or posting the menu:", error);
    }
  });
}

/**
 * Extract the src from the first <img> in the RSS item description (HTML).
 */
function extractImageUrl(html: string): string | null {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = html.match(imgRegex);
  return match && match[1] ? match[1] : null;
}