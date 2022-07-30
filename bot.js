const { Client, Intents } = require('discord.js');
const { discord_token, huggingface_token, channelId } = require('./config.json');
const axios = require('axios');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
	client.user.setPresence({ activities: [{ name: 'I love talking to people.' }], status: 'dnd' });
	console.log('Ready!');
});

async function query(data) {
    const response = await axios.post(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
	    data,
        {
            headers: { Authorization: huggingface_token }
        }
    );
    return response.data;
}

client.on('messageCreate', async mssg => {
	console.log(mssg.channel.id);
	if (mssg.author.id != client.user.id && mssg.channel.id == channelId) {
		console.log(mssg.content)
		query(mssg.content)
			.then((response) => {
				mssg.reply(response.generated_text);
			}).catch((e)=>console.log(e));
	}
});

client.login(discord_token);


	// the commented lines are for text formating required when using other models
	/** query(`carl: hi \n jon:hello i love talking to you \n\n carl: ${mssg.content} \n jon: `)
			.then((response) => {
	   			mssg.reply(response.generated_text.split(':')[4].split('\n')[0].trim() || '*bot refused to reply*');
			}).catch((e)=>console.log(e));
	} **/
