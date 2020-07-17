module.exports = {
    name: "flip",
    description: "Flips a coin",
    execute(msg){
          let flipnum = Math.round(Math.random());
          if (flipnum == 0){
              msg.channel.send(`${msg.author.username} has flipped **head**`,{files:["./images/head.png"]})
          } else {
              msg.channel.send(`${msg.author.username} has flipped **tail**`,{files:["./images/tail.png"]})
          }
    }
}