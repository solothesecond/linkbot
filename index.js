// bot by szvy
// discord.gg/szvy
// check example.json for an example on how to format your json files
// please dont skid/remove credit
// luv yall <3

const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const fs = require('fs');

const jason1 = JSON.parse(fs.readFileSync('.fastly.json', 'utf8')); // put how many different types of links you want (for example: fastly, freedns, wildcards, etc.)
const jason2 = JSON.parse(fs.readFileSync('.normal.json', 'utf8'));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], // this is the intents it requires, set this up on your discord bot
  partials: [Partials.Channel]
});

const OWNER_ID = '1317242584170500107'; // put your user id here
const MAX_USES_PER_DAY = 2; // max amount of times each button can be used
const usageData = {};

function checkAndResetUsage(userId, buttonId) {
  const today = new Date().toISOString().slice(0, 10); // checks the date
  if (!usageData[userId]) {
    usageData[userId] = {};
  }

  if (!usageData[userId][buttonId] || usageData[userId][buttonId].date !== today) {
    usageData[userId][buttonId] = { count: 0, date: today };
  }
}


client.on(Events.MessageCreate, async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  
  if (message.content.trim() === '!!panel' && message.author.id === OWNER_ID) {
    const embed = new EmbedBuilder()
      .setTitle('Link Generator') // embed title
      .setDescription('click a button below to get a link') // embed description
      .setColor('DarkerGrey'); // color
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('genjason1').setLabel('fastly').setStyle(ButtonStyle.Secondary), // buttons
        new ButtonBuilder().setCustomId('genjason2').setLabel('normal').setStyle(ButtonStyle.Secondary),
      );

    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const { user, customId } = interaction;
  checkAndResetUsage(user.id, customId);
  if (usageData[user.id][customId].count >= MAX_USES_PER_DAY) {
    return interaction.reply({ content: 'youve reached your daily usage for this type of link! try another type or wait until tomorrow for 2 more!', ephemeral: true }); // message if you use too many
  }

  usageData[user.id][customId].count += 1;

  let chosenLinks; // sets what links it chooses per button you click
  switch (customId) {
    case 'https://learningonline.global.ssl.fastly.net':
      chosenLinks = jason1;
      break;
    case 'https://schoollearning.soloo.fun':
      chosenLinks = jason2;
      break;
    case 'genjason3':
      chosenLinks = jason3;
      break;
    case 'genjason4':
      chosenLinks = jason4;
      break;
    default:
      return interaction.reply({ content: 'idk what button you pressed', ephemeral: true }); // message if theres an unkown button
  }

  const randomLink = chosenLinks[Math.floor(Math.random() * chosenLinks.length)];

  try {
    await user.send(`here is your link! ${randomLink}`); // message it dms to your user
    await interaction.reply({ content: 'check your DMs for your link! :D', ephemeral: true }); // what it sends to your user (not in dms)
  } catch (error) {
    usageData[user.id][customId].count -= 1;
    await interaction.reply({ content: 'yo dms are off or something idk man', ephemeral: true }); // message if it cant dm the user
  }
});

client.login('MTM1NDU2OTU3Mzk3ODA3OTQ1Mw.GD35HE.dMCuiRDxuxqis43AKywz-qYv-r7lzSI1ZrQGXk'); // put your discord bot token here
