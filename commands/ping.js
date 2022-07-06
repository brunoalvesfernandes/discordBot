const execute = (bot, message, args) => {
    async function pong() {
        const m = await message.channel.send('Ping?');
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A latencia da API é ${Math.round(bot.ws.ping)}ms.`);
    }
    return pong()
}

module.exports = {
    name: 'ping',
    help: 'Vai Mostrar o ping seu e do servidor...',
    execute
}