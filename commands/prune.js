const { execute } = require("./ping")

module.exports = {
    name: "prune",
    description: "Deletes messages",
    async execute(msg,args){
            if(!args[1]){
                msg.channel.send(`Please provide a valid number~`).then(d_msg =>{d_msg.delete({timeout:5000})});
            } else {
                await msg.channel.bulkDelete(parseInt(args[1])+1);
                msg.channel.send(`${args[1]} messages have been deleted!`).then(d_msg =>{d_msg.delete({timeout:5000})});
            }
    }
}