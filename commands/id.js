module.exports = {
    name: "id",
    description: "Returns id of user specified",
    execute(msg) {
        msg.channel.send(`${msg.mentions.users.first()}'s ID is ${msg.mentions.users.first().id}`);
    }
}