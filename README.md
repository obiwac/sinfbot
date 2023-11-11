# DiscordSINFBot

## How to install ?

Clone the project and install the dependencies by running

```console
npm install
tsc
```

Create the `.env` file into the new `dist` folder, paste in the content of `src/.env.example` by modifying the variables appropriately.
To create a bot and get the token, go to https://discord.com/developers/applications. **Do not forget** to enable all priviledged intents on the application page.

To run the bot, execute

```console
npm start
```

The commands will be registered automatically.

## Roadmap dev

- [x] An anonymous confession system. Members send a DM to the bot (`/confess <message>`), the admin approve it in a
      private channel (with a react) and the message will be then in the public channel)
- [x] A bulk clear (`/clear <number_message>`)
- [ ] A meme contest event creator (`/createcontest <channel_id> <emote> <start_date> <end_date>`) with the score
- [x] A pin system for members with the role of pin management. (`/pin <message ID to pin>`)
- [x] A welcoming DM to newcomers
- [x] A poll system
- [x] Some funny commands (`!poop`, `!méchant`, `!criminel`,...)
- [x] A dynamic !help listing
- [ ] A hidden rick roll in the project (Holger is in charge)
- [x] A `/version` command that return the commit hash o
