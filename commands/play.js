const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Voice = require('@discordjs/voice');
const play = require('play-dl');
const { establishConnection, getAudioPlayer } = require('../utils/audioUtils.js');
const { createEmbedBase } = require('../utils/embedUtils.js');
const { ComponentType } = require('discordx');

var playSongButtonCollector = null;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("plays a song")
        .addStringOption(option=>
            option.setName("query")
            .setRequired(true)
            .setDescription("Name of song or url")),
    /**
     * 
     * @param {Discord.BaseCommandInteraction} interaction 
     */
    async execute(interaction){

		const embed = createEmbedBase(interaction);

		try {
			// Get query string
			const query = interaction.options.get("query").value; 

			let playing = true;
			let songQueue = null;
			
			// Get queue if exists
			songQueue = interaction.client.queue.get(interaction.guild.id)
			if (!songQueue){
				playing = false;
				songQueue = [];
			}

			// Get details of video
			let urlType = await play.validate(query);
			let urlInfo = null;
			switch (urlType){
				case 'yt_video':
					// Get video
					urlInfo = await play.video_info(query);

					// Add song to queue
					songQueue.push(urlInfo.video_details)
					embed.setDescription(`**${urlInfo.video_details.title}** has been added to queue!`)
					break;

				case 'yt_playlist':
					// Get videos from playlist
					urlInfo = await play.playlist_info(query);
					let videos = await urlInfo.all_videos();

					// Add songs to queue
					songQueue.push(...videos);
					embed.setDescription(`**${urlInfo.title}** has been added to queue!`)
					break;

				default:
					throw 'Invalid url type';
			}

			// Play song if not already playing a song
			const player = getAudioPlayer(interaction);
			const connection = establishConnection(interaction);

			playerListener(player, connection, interaction);
			connectionListener(connection, interaction);

			if (!playing){
				playSong(player, connection, songQueue, interaction)
			} 

			interaction.client.queue.set(interaction.guild.id, songQueue)

			await interaction.channel.send({
				embeds: [embed],
			})

		} catch (error) {

			embed.setDescription('Unexpected error occured, please try again')

			await interaction.reply({
				embeds: [embed],
				ephemeral: true
			})

			console.log(error)
		}
    }
}


/**
 * Adds a listener to the audio player
 * @param {Voice.AudioPlayer} player 
 * @param {Voice.VoiceConnection} connection 
 * @param {Discord.BaseInteraction} interaction 
 * @returns 
 */
function playerListener(player, connection, interaction){
	try {
		if (player.listenerCount(Voice.AudioPlayerStatus.Idle) != 0) return;
		player.addListener(Voice.AudioPlayerStatus.Idle, ()=>{
			let songQueue = interaction.client.queue.get(interaction.guild.id);
			if (songQueue && songQueue.length != 0){
				songQueue.shift();
				playSong(player, connection, songQueue, interaction)
			}
		})
	} catch (error) {
		console.log(error)
	}

}

/**
 * Adds a listener to the connection
 * @param {Voice.VoiceConnection} connection 
 * @param {Discord.BaseInteraction} interaction 
 * @returns 
 */
function connectionListener(connection, interaction){
	// Purge queue on disconnection
	if (connection.listenerCount(Voice.VoiceConnectionStatus.Disconnected != 0) || 
		connection.listenerCount(Voice.VoiceConnectionStatus.Destroyed)) return;

	connection.addListener(Voice.VoiceConnectionStatus.Destroyed, ()=>{
		interaction.client.queue.set(interaction.guild.id, null);
		interaction.deleteReply();
	})

	connection.addListener(Voice.VoiceConnectionStatus.Disconnected, ()=>{
		if (connection.state.status != Voice.VoiceConnectionStatus.Destroyed) connection.destroy();
	})
}

/**
 * Plays an audio track
 * @param {Voice.AudioPlayer} player 
 * @param {Voice.VoiceConnection} connection 
 * @param {Object[]} songQueue 
 * @param {Discord.BaseInteraction} interaction 
 * @returns 
 */
async function playSong(player, connection, songQueue, interaction){
	try {
		if (songQueue.length == 0) {
			interaction.client.queue.set(interaction.guild.id, null);
			return
		} else {
			interaction.client.queue.set(interaction.guild.id, songQueue);
		}

		const stream = await play.stream(songQueue[0].url)
		const resource = Voice.createAudioResource(stream.stream, {
			inputType: stream.type
		});
	
		player.play(resource);
		connection.subscribe(player);
	
		const embed = createEmbedBase(interaction);
		embed.setDescription(`Currently playing:\n**${songQueue[0].title} (${songQueue[0].durationRaw})**`);

		const actionRowButton = buildActionRow(false);

		// Add collectors for buttons
		if (playSongButtonCollector) playSongButtonCollector.stop();

		playSongButtonCollector = interaction.channel.createMessageComponentCollector({
			filter: (i) => i.customId.startsWith('playSong'), 
			componentType: ComponentType.Button
		});
		playSongButtonCollector.on('collect', compInteraction => {
			updateSongStatus(compInteraction);
		});

		if (!interaction.replied){
			await interaction.reply({
				embeds: [embed],
				components: [actionRowButton],
			})
		}
		
	} catch (error) {
		console.log(error);
	}
}

async function updateSongStatus(compInteraction){
	try {
		const player = getAudioPlayer(compInteraction);

		var actionRowButton = [];

		const embed = createEmbedBase(compInteraction);
		const songQueue = compInteraction.client.queue.get(compInteraction.guild.id);

		embed.setDescription(`Currently playing:\n**${songQueue[0].title} (${songQueue[0].durationRaw})**`);

		if (compInteraction.customId.endsWith('SkipButton') && songQueue.length > 1){
			embed.setDescription(`Currently playing:\n**${songQueue[1].title} (${songQueue[1].durationRaw})**`);
		} 

		switch (compInteraction.customId){
			case 'playSongPauseButton':
				actionRowButton = buildActionRow(true);
				player.pause();
				break;
			case 'playSongResumeButton':
				actionRowButton = buildActionRow(false);
				player.unpause();
				break;
			case 'playSongSkipButton':
				actionRowButton = buildActionRow(false);
				player.stop();
				player.unpause();
				break;
			case 'playSongStopButton':
				player.stop();
				actionRowButton = buildActionRow(false);
				compInteraction.client.queue.set(compInteraction.guild.id, null);
				break;
		}

		await compInteraction.update({
			embeds: [embed],
			components: [actionRowButton]
		})


	} catch (error) {
		console.log(error)	
	}
}

function buildActionRow(paused){
	const actionRowButton = new Discord.ActionRowBuilder();
		
	if (paused){
		actionRowButton
			.addComponents(
				new Discord.ButtonBuilder()
					.setCustomId("playSongResumeButton")
					.setLabel("Resume")
					.setStyle("Primary"),
			)
	} else {
		actionRowButton
			.addComponents(
				new Discord.ButtonBuilder()
					.setCustomId("playSongPauseButton")
					.setLabel("Pause")
					.setStyle("Primary"),
			)
	}

	actionRowButton
			.addComponents(
				new Discord.ButtonBuilder()
					.setCustomId("playSongSkipButton")
					.setLabel("Skip")
					.setStyle("Secondary"),
				new Discord.ButtonBuilder()
					.setCustomId("playSongStopButton")
					.setLabel("Stop")
					.setStyle("Danger"),
			)

	return actionRowButton;
}