import dotenv from 'dotenv'
dotenv.config()

import { Client, GatewayIntentBits} from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
});

client.login(process.env.DISCORD_TOKEN);


client.on("messageCreate", async (message) => {

  // console.log(message)

  if (!message?.author.bot && message.content.toLowerCase().startsWith('!get-availability')) {
    try {
          let headers = new Headers();
          headers.set('Authorization',
                      'Basic ' + Buffer.from(process.env.WEBHOOK_USER + ":" + process.env.WEBHOOK_PASSWORD).toString('base64'));

          const response = await fetch('https://workflow.dandrove.com/webhook/cc48e7bf-518f-44d2-b77d-7783ff2e0f0c', {
            method: 'GET',
            headers: headers,
          });

          message.reply('✅ Request succesfully sent to the workflow !')

          // Log response status and headers
          console.log('Webhook Response Status:', response.status);
          // console.log('Webhook Response Headers:', response.headers);

          // Get and log the response body
          const responseText = await response.text();
          console.log('Webhook Response Body:', responseText);

          if (response.status === 200){
            message.reply(responseText.allItemsAvailable)
          } else {
            message.reply('⭕ Error when trying to get the datas')
          }  

        } catch (error) {
          console.error('Error fetching webhook:', error);
        }
      }


  if (!message?.author.bot && message.content.toLowerCase().startsWith('!help')) {
    message.reply(`Hello, I am calendar bot, write !get-availability to get the next availability`)}


});
