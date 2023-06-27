const Discord = require('discord.js');
const { GatewayIntentBits } = require('discord.js');
const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
const fs = require('fs');
const { join } = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

// Initialize collections for saving state in each server
client.queue = new Discord.Collection();
client.commands = new Discord.Collection();
client.players = new Discord.Collection();

//Importing commands
const commands = [];
const commandFiles = fs.readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(join(__dirname, "commands", `${file}`));
	client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
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

})

// login to Discord with your app's token
client.login(process.env.TOKEN);