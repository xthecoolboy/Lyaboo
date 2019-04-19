const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class PurgeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'purge',
			aliases: ['deletus', 'washaway', 'groundzero'],
            group: 'moderation',
            memberName: "purge",
            description: 'Will Purge a Channel or User Messages.'
        });
    }

    async run(message, args) {
        const Args = message.content.split(" ")
        if (message.author.equals(Settings.Bot.user)) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;

        		
		Settings.Schemas.Mods.findOne({
			ServerID: message.guild.id
		}, (Error, Results) => { 
			if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":warning: You do not have permissions to do that.");
			
			const DeleteCount = parseInt(args[0], 10);
			if(!DeleteCount || DeleteCount < 2 || DeleteCount > 100)
			return message.channel.send("Please provide a number between 2 and 100 for the number of messages to delete.");
			
			const Fetched = await message.channel.fetchMessages({limit: DeleteCount});
			message.channel.bulkDelete(Fetched)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	  
			if(Results){
				if(Results.Logging === true){
					if(message.guild.channels.get(Results.LogsChannel)){
						let LoggingChannel = message.guild.channels.get(Results.LogsChannel);
						let RichEmbed = new Discord.RichEmbed()
						.setAuthor("♻️ Action | Purge")
						.setColor("27037e")
						.addField("Executor", `<@${message.author.id}>`)
						.addField("Purged Amount", `${args[0]}`)
						.setFooter("Brought to you by Lyaboo");
						
						LoggingChannel.send(RichEmbed)
					}
				}
			}
		})
    }
}

module.exports = PurgeCommand
