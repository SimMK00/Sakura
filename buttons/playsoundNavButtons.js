const Discord = require('discord.js');
const { getPlaysounds } = require('../utils/audioUtils.js');

module.exports = {
    name: "playsoundNavButtons",
    /**
     * 
     * @param {Discord.MessageComponentInteraction} interaction 
     */
    async execute(interaction, playsoundName, baseUrl, pageNum) {
        const response = getPlaysounds(playsoundName, baseUrl, pageNum)

        response
            .then(async function(response){
                var hasNext = response.next;
                var hasPrev = response.previous;
                
                const results = response.results;
                const actionRowButton = new Discord.ActionRowBuilder();
                
                if (hasPrev){
                    actionRowButton.addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("playsoundPrevButton")
                            .setLabel("Previous")
                            .setStyle("Secondary")
                    )
                }

                if (hasNext){
                    actionRowButton.addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("playsoundNextButton")
                            .setLabel("Next")
                            .setStyle("Secondary")
                    )
                }

                const selectMenu = new Discord.StringSelectMenuBuilder()
                    .setCustomId("playsoundSelect")
                    .setPlaceholder("Playsounds");

                const actionRowSelect = new Discord.ActionRowBuilder()
                    .addComponents(selectMenu);

                // Add all playsounds as option
                results.forEach(element => {
                    url = element.sound.split('/');
                    trimmedUrl = url[url.length-1]

                    selectMenu.addOptions({
                        label: element.name,
                        value: trimmedUrl
                    })
                });

                components = [actionRowSelect];
                if (hasNext) components.push(actionRowButton);

                await interaction.update({
                    components: components,
                    ephemeral: true
                })

            }).catch(async function(error){
                console.log(error)
            })
    }
}
