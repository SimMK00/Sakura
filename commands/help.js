module.exports = {
    name: "help",
    execute(msg, args) {
        const fs = require("fs");
        const { join } = require('path');
        const commandFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith(".js"));
        let i = 0;
        let output = ``;

        for (const file of commandFiles) {
            const command = require(join(__dirname, `${file}`));
            output += `${i+1}: ${command.name}\n`;
            i++;
        }
        msg.channel.send(output);
    }
}