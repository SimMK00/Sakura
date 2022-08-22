const Discord = require('discord.js');
const { Intents } = require('discord.js');
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const fs = require('fs');
const { join } = require('path');
const { REST } = require('@discordjs/rest');
const { Routes, ComponentType } = require('discord-api-types/v9');
require('dotenv').config();


client.queue = new Map();
client.commands = new Discord.Collection();
client.selects = new Discord.Collection();

//Importing commands
const commands = [];
const commandFiles = fs.readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(join(__dirname, "commands", `${file}`));
	client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

//Importing selects
const selectFiles = fs.readdirSync(join(__dirname, "selects")).filter((file) => file.endsWith(".js"));
for (const file of selectFiles) {
	const select = require(join(__dirname, "selects", `${file}`));
	client.selects.set(select.name, select);
}


//Registering commands via rest
const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

    	console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
  	}
})();


//Client ready
client.once('ready', () => {
	console.log('Ready!');
});

//Executing commands based on user input
// client.on("messageCreate", async msg => {
//   if (msg.content.startsWith(prefix)) {
//     let args = msg.content.substring(prefix.length).split(" ");
//     let command = client.commands.get(args[0]);

//     try {
//       command.execute(msg, args)
//     } catch (error) {
//       console.error(error);
//     }
//   } else {
//     //   console.log(msg.content)
//   }
// })
var collector;
client.on('interactionCreate', async (interaction)=>{
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	if (interaction.isCommand()){
		try {
			await command.execute(interaction);
		} catch (error) {
			await interaction.reply({
				content: "Something went wrong while exetcuting this command!",
				ephemeral: true
			})
		}
	}

	// Dispose old collector if available
	if (collector) collector.stop();
	
	// Create new collector 
	collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu});
	collector.on('collect', compInteraction => {
		client.selects.get(compInteraction.customId).execute(compInteraction);
	});
})



// login to Discord with your app's token
client.login(process.env.TOKEN);