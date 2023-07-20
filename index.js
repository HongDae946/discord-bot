const { Client, Events, ChannelType, Partials } = require('discord.js');
const client = new Client({ intents: [131071], partials: [Partials.Channel] });
const { Configuration, OpenAIApi } = require('openai')
client.login(`MTEyNDU1Mjg4NDczNDkyNjk1MA.Gl0Ii1.qEYa3BSt1l90nxISt7I1qmi1lRHcX27Z06q3MA`)
client.on(Events.ClientReady, async () => console.log(client.user.tag))
const openai = new OpenAIApi(new Configuration({ apiKey: `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` }));

client.on(Events.MessageCreate, async (message) => {
    if ((message.channel?.type || 0) !== ChannelType.DM) return;
    const channel = await client.channels.cache.get(`1130741404268773466`);
    if (message.content) await channel.send(`[${message.author.tag} | ${message.author.id}] ${message.content}`)
    await message.attachments.forEach(async (att) => {
        await channel.send(`[${message.author.tag} | ${message.author.id}] ${att.url}`)
    })
    await message.react(`✅`)
})
client.on(Events.MessageCreate, async (message) => {
    if (!message.content.startsWith(`!답변`)) return
    const args = message.content.slice(3).trim().split(/ +/)
    if (!args[0]) return await message.channel.send(`유저 ID를 입력해주세요.`)
    if (isNaN(args[0])) return await message.channel.send(`옳바르지 않는 유저의 ID 입니다.`)
    if (!args[1]) return await message.channel.send(`답변내용을 입력해주세요.`)
    const content = args.slice(1).join(` `)
    try {
        await client.users.send(args[0], { content: `관리자의 답변 : ${content}` })
        await message.channel.send(`${(await client.users.fetch(args[0])).username}님에게 답변이 완료되었습니다.\n>>> ${content}`)
    } catch (err) {
        await message.channel.send(`유저의 DM이 차단되어있거나 옳바르지 않는 유저 ID 입니다.`)
    }
})

client.on(Events.MessageCreate, async (message) => {
    if (!message.content) return
    if (!message.content.startsWith(`!chat`)) return
    const args = message.content.slice(3).trim().split(/ +/)
    const chatCompletion = await openai.createChatCompletion({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: args.join(` `) }] });
    const content = await chatCompletion.data.choices[0].message.content;
    await message.reply(`## GPT-3.5의 답변\n> ${content}`)
})