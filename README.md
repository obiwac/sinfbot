# SinfBot

This repository contains the source code of SinfBot, the Discord bot of the "Sciences informatiques" server (which you can join here: <https://discord.gg/GGqdFYgCn8>)

## Setup

Start by renaming the `.env.example` file to `.env` and modify the variables appropriately. Discord token and application ID can be obtained from [here](https://discord.com/developers/applications). Guild ID refers to your server ID (which can be copied from the Discord client by right clicking on the server's name).

You can then proceed using any of the two installation methods available below.

### Using Docker

If you have Docker installed, you can simply use the provided script to automatically build and run a container with all dependencies already installed using Docker Compose (make sure to have that installed as well):

```sh
chmod +x run.sh
./run.sh
```

### The OG way

> [!IMPORTANT]
> SinfBot uses [Bun](https://bun.sh/) as the runtime (because why not?). Everything should be working with the standard Node.js installation, but you'll have to adapt some scripts in `package.json` (and possibly other stuff related to Typescript, so please use Bun it's easier).

To install the required dependencies, run the following command:

```sh
bun install
```

To run the bot, execute the following:

```sh
bun start
```
