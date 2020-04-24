const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const ytdl = require('ytdl-core');
const queue = new Map();
const client = new Discord.Client();

//Client ready
client.once('ready', () => {
    console.log('Ready!');
    
});

//Commands
client.on("message", async msg => {
    if (msg.content.startsWith(prefix)){
    let args = msg.content.substring(prefix.length).split(" ");
    let commandcaller = msg.author.id;
    let embed = new Discord.MessageEmbed();
    let voiceChannel = msg.member.voice.channel;
    const serverQueue = queue.get(msg.guild.id);
    
    switch(args[0]){
        case 'ping':
            msg.channel.send(`Pong!\nThe latency is ${Date.now()-msg.createdTimestamp}ms`)
            break;

        case 'prune':
            if(!args[1]){
                msg.channel.send(`Please provide a valid number~`).then(d_msg =>{d_msg.delete({timeout:5000})});
            } else {
                msg.channel.bulkDelete(args[1]);
                msg.channel.send(`${args[1]} messages have been deleted!`).then(d_msg =>{d_msg.delete({timeout:5000})});
            }
            break;

        case 'flip':
            let flipnum = Math.round(Math.random());
            if (flipnum == 0){
                msg.channel.send(`${msg.author.username} has flipped **head**`,{files:["./images/head.png"]})
            } else {
                msg.channel.send(`${msg.author.username} has flipped **tail**`,{files:["./images/tail.png"]})
            }
           break;

        case 'play':
          execute(msg, serverQueue);

          async function execute(msg, serverQueue) {
            if (!voiceChannel)
              return msg.channel.send(
                "You need to be in a voice channel to play music!"
              );

           
            const songInfo = await ytdl.getInfo(args[1]);
            const song = {
              title: songInfo.title,
              url: songInfo.video_url
            };
          
            if (!serverQueue) {
              const queueContruct = {
                textChannel: msg.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
              };
          
              queue.set(msg.guild.id, queueContruct);
          
              queueContruct.songs.push(song);
          
              try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                play(msg.guild, queueContruct.songs[0]);
              } catch (err) {
                console.log(err);
                queue.delete(msg.guild.id);
                return msg.channel.send(err);
              }
            } else {
              serverQueue.songs.push(song);
              return msg.channel.send(`${song.title} has been added to the queue!`);
            }
          }
                  
          function play(guild, song) {
            const serverQueue = queue.get(guild.id);
            if (!song) {

              queue.delete(guild.id);
              return;
            }
          
            const dispatcher = serverQueue.connection
              .play(ytdl(song.url))
              .on("finish", () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
              })
              .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Started playing: **${song.title}**`);
          }
        break;
        
        case 'volume':
          const serverQueueV = await queue.get(msg.guild.id);
          if (serverQueueV){
            dispatcherV = await serverQueueV.connection;
            dispatcherV.setVolume(args[1]);
          }
          break;


        case 'skip':
        skip(msg, serverQueue);
        function skip(msg, serverQueue){
            if (!msg.member.voice.channel)
            return msg.channel.send(
              "You have to be in a voice channel to stop the music!"
            );
            if (!serverQueue)
              return msg.channel.send("No songs to skip already UwU");
            serverQueue.connection.dispatcher.end();
            }
        break;
            
        case 'leave':
                voiceChannel.leave();
                if (serverQueue){
                    queue.delete(msg.guild.id);
                }
            break;

        case 'join':
            if(voiceChannel){
                voiceChannel.join();
                msg.channel.send(`Successfully joined!`);
            } else {
                msg.channel.send(`Please join a voice channel first`);
            }
            break;
        
        case 'queue':
          if (serverQueue){
            for(i=0; i < serverQueue.songs.length; i++){
              msg.channel.send(serverQueue.songs[i].title);
          }};
            break;

        case 'avatar':
            if (!args[1]){
              msg.channel.send(embed.setImage(`${msg.author.avatarURL({size:2048})}`));
            } else if (msg.mentions.users.first()){
              let user = msg.mentions.users.first();
              msg.channel.send(embed.setImage(`${user.avatarURL({size:2048})}`));
            } else {
              msg.channel.send(`User does not exist you damn ape`);
            }
            break;
        
        case 'id':
            msg.channel.send(`${msg.mentions.users.first()}'s ID is ${msg.mentions.users.first().id}`).then(d_msg =>{d_msg.delete({timeout:5000})});
        break;

        case 'plays':
            var checkQueue = queue.get(msg.guild.id);

            if (checkQueue){
              queue.delete(msg.guild.id);
            } else if (!voiceChannel){
              msg.channel.send(`You need to join a voice channel first`);
            } else if (voiceChannel) {
              var connectionps = await voiceChannel.join();
            }
            async function playsound(casename,looptime){
                let looptimef = looptime;
                const dispatcher =  connectionps.play(casename);
                if (args[2] >0 && args[2] <= 10 /*&& msg.author.id == 1364621891197992968*/ ){
                  await dispatcher.setVolume(args[2]);
                } else {
                  dispatcher.setVolume(0.5);
                }
                looptimef--;
                dispatcher.on("finish", ()=>{
                  if(looptimef != 0){
                    playsound(casename,looptimef);
                    looptimef = looptime - 1;
                  }
                })
            }

             if (args[1]){
               if(args[3] >0 && args[3] <= 10){
                playsound(`./playsounds/${args[1]}.mp3`,args[3]);
               } else if (!args[3]) {
                playsound(`./playsounds/${args[1]}.mp3`,1);
               } else {
                msg.channel.send(`Why loop so many times`);
               }
            } else {
              playsound(`./playsounds/${args[1]}.mp3`,1);
            }

            msg.delete({timeout: 2000});
            break;

            /*
            let validate =  ytdl.validateURL(args[1]);
            let info =  ytdl.getInfo(args[1]);
            const search = require('yt-search');

            if (!validate){
                search(args[1],(err,result)=>{
                    //First 10 results only
                    let video = result.videos.slice(0,10);
                    
                    let videoloop = "";
                    for (var i in video){
                        videoloop += `${parseInt(i)+ 1} \${videos[i].title}\n`
                    
                    }
                    msg.channel.send(videoloop)
                })
              
            } else {
                
            }
            
        case 'meta':
            let azurver = "04/05/2020";
            let arkver = "04/05/2020";
            if (args[1] == 1){
                msg.channel.send(`Azur lane meta as of ${azurver}`,{files:["./images/azur.png"]});
            } else if (args[1] == 2){
                msg.channel.send(`Azur lane meta as of ${arkver}`,{files:["./images/arknights.png"]});
            } else if(args[1] !== 1 && args[1] !== 2){
                msg.channel.send(`**[1]** Azur lane\n**[2]**Arknights`);
            }
            */
    }
  }
})

// login to Discord with your app's token
client.login(token);