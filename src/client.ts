import {
  Client as DiscordClient,
  Collection,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js'

import { Button, Command } from './type'

class Client extends DiscordClient {
  private commands: Collection<string, Command> = new Collection()
  private buttons: Collection<string, Button> = new Collection()

  public setCommand(cmd: Command): void {
    this.commands.set(cmd.data.name, cmd)
  }

  public getCommand(cmdName: string): Command | undefined {
    return this.commands.get(cmdName)
  }

  public getCommandsData() {
    const data: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []

    for (const [, cmd] of this.commands) {
      data.push(cmd.data.toJSON())
    }

    return data
  }

  public setButton(btn: Button): void {
    this.buttons.set(btn.name, btn)
  }

  public getButton(btnName: string): Button | undefined {
    return this.buttons.get(btnName)
  }
}

export default Client
