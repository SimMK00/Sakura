const { SlashCommandBuilder } = require('@discordjs/builders');
const voice = require("@discordjs/voice");
const Discord = require('discord.js');
const axios = require("axios").default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playsound")
        .setDescription("Plays a playsound")
        .addStringOption(option=>
            option.setName("playsoundname")
            .setRequired(true)
            .setDescription("Name of playsound"))
        .addBooleanOption(option=>
            option.setName("exact")
            .setDescription("Search for exact playsound")),
    /**
     * 
     * @param {Discord.BaseCommandInteraction} interaction 
     */
    async execute(interaction){
        const playsoundName = interaction.options.get("playsoundname").value;
        const exactMatch = interaction.options.get("exact")??false;
        const baseUrl = "https://www.myinstants.com/api/v1";
        const replyEmbed = new Discord.MessageEmbed();
        const player = new voice.AudioPlayer();
        

        // Default embed settings
        replyEmbed.setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL()
        }).setColor("LUMINOUS_VIVID_PINK");

        let response = null;
        if (!exactMatch){
            try {
                response = getPlaysounds(playsoundName, baseUrl);
                response.then(async function(response){
                    let hasNext;
                    if (response.count > 10) hasNext = true;
                    const results = response.results;
                    
                    const actionRowButton = new Discord.MessageActionRow();
                    if (hasNext){
                        actionRowButton.addComponents(
                            new Discord.MessageButton()
                                .setCustomId("playsoundNextButton")
                                .setLabel("Next")
                                .setStyle("SECONDARY")
                        )
                    }

                    const selectMenu = new Discord.MessageSelectMenu()
                        .setCustomId("playsoundSelect")
                        .setPlaceholder("Playsounds");

                    const actionRowSelect = new Discord.MessageActionRow()
                        .addComponents(selectMenu);

                    // Add all playsounds as option
                    if (results.length == 0){
                        selectMenu.addOptions({
                            label: "EMPTY",
                            value: "EMPTY"
                        })
                    } else {
                        results.forEach(element => {
                            url = element.sound.split('/');
                            trimmedUrl = url[url.length-1]

                            selectMenu.addOptions({
                                label: element.name,
                                value: trimmedUrl
                            })
                        });
                    }

                    let components = [actionRowSelect];
                    if (hasNext) components.push(actionRowButton);

                    // Reply
                    await interaction.reply({
                        embeds: [replyEmbed],
                        components: components,
                        ephemeral: true
                    })
                }).catch (async function(error){
                    // Reply incase of not being able to retrieve the playsound
                    await interaction.reply({
                        content: "Something went wrong! Please try again later",
                        ephemeral: true
                    })
                    console.log(error);
                })
            } catch (error) {
                console.log(error)
            }  
        } else {
            try {
                response = getExactPlaysound(playsoundName, baseUrl);
                response.then(function(result){
                    playPlaysound(result, player, interaction);
                }).catch(async function(error){
                    await interaction.reply({
                        content: "Something went wrong! Please try again later",
                        ephemeral: true
                    })
                    console.log(error)
                })
            } catch (error) {
                
                console.log(error);
            }
        }
        
    } 
}

/**
 * Plays the playsound in the voice channel the user is in
 * @param {HttpResponse} response 
 * @param {voice.AudioPlayer} player 
 * @param {Discord.BaseCommandInteraction} interaction 
 */
function playPlaysound(response, player, interaction){
    let resource = voice.createAudioResource(response.sound);

    // Establishing a connection to the channel
    let connection = voice.getVoiceConnection(interaction.guildId);
    if (!connection){
        connection = voice.joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        })
    }
    
    // Play the resource
    player.play(resource);
    connection.subscribe(player);
}

// Get the exact playsound specified by user
function getExactPlaysound(playsoundName, baseUrl){
    return new Promise((resolve, reject)=> {
        axios({
            url: `/instants/${playsoundName}`,
            baseURL: baseUrl,
            method: "get",
            timeout: 3000
        }).then((response)=>{
            resolve(response.data);
        }).catch((error)=>{
            reject(error);
        })
    })
}

// Get a list of playsounds that matches the users' input
function getPlaysounds(playsoundName, baseUrl, pageNum=1){

    // Construct parameter
    let params = {
        name: playsoundName,
        page: pageNum
    };

    return new Promise((resolve, reject)=>{
        axios({
            url: "/instants",
            baseURL: baseUrl,
            method: "get",
            params: params,
            timeout: 3000
        }).then((response)=>{
            resolve(response.data);
        }).catch((error)=>{
            reject(error);
        })
    })
}