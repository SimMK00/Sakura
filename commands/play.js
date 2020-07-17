module.exports = {
  name: "play",
  description: "Queue a song",
  async execute(msg, argsOrg) {
    const voiceChannel = msg.member.voice.channel;
    const ytdl = require('ytdl-core');
    const serverQueue = msg.client.queue.get(msg.guild.id);
    const youtubeApi = require("simple-youtube-api");
    const { youtube_api_key } = require("../config.json");
    const youtube = new youtubeApi(youtube_api_key);
    const Discord = require("discord.js");
    
    let args = argsOrg.splice(1,argsOrg.length-1);
    args = args.join(' ');
    console.log(args)
    if (!voiceChannel) {
      return msg.channel.send("You need to be in a voice channel to play music!");
    }

    if (ytdl.validateURL(args)) {
      const songInfo = await ytdl.getInfo(args);
      let song = {
        title: songInfo.title,
        url: songInfo.video_url
      }
      execute(song);
    } else {
      let result = await youtube.search(args, 3);
      let output = ``;
      let count = 1;
      result.forEach(res => {
        if (res.type != "channel") {
          output += `${count}: **${res.title}**\n`;
          count++;
        }
      })
      await msg.channel.send(output).then(msg => {msg.delete({timeout: 10000})})
      const collector = new Discord.MessageCollector(msg.channel, m=> m.author.id == msg.author.id, {time: 10000, max:2});
      collector.on("collect", message =>{
        msg.channel.send(message.content);
      })
    }

    async function execute(song) {
      if (!serverQueue) {
        const queueContruct = {
          textChannel: msg.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };

        msg.client.queue.set(msg.guild.id, queueContruct);
        queueContruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          play(msg.guild, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          msg.client.queue.delete(msg.guild.id);
          return msg.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);
        return msg.channel.send(`${song.title} has been added to the queue!`);
      }
    }

    function play(guild, song) {
      const serverQueue = msg.client.queue.get(msg.guild.id);
      if (!song) {

        msg.client.queue.delete(msg.guild.id);
        return;
      }

      const dispatcher = serverQueue.connection
        .play(ytdl(song.url/*, {begin: "1:30"}*/))
        .on("finish", () => {
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
      serverQueue.textChannel.send(`Started playing: **${song.title}**`);
    }
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
    */


  }
}