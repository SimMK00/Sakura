const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const fs = require('fs');
const { join } = require('path');

client.queue = new Map();
client.commands = new Discord.Collection();

//Importing commands
const commandFiles = fs.readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

//Client ready
client.once('ready', () => {
  console.log('Ready!');
});

//Executing commands based on user input
client.on("message", async msg => {
  if (msg.content.startsWith(prefix)) {
    let args = msg.content.substring(prefix.length).split(" ");
    let command = client.commands.get(args[0]);

    try {
      command.execute(msg, args)
    } catch (error) {
      console.error(error);
    }
  }
})

// login to Discord with your app's token
client.login(token);