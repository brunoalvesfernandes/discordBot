const execute = (bot,message,args) =>{
    const amount = parseInt(args[0]) + 4;
    const Discord = require('discord.js');
        if (isNaN(amount)) {
            return message.reply("Isso não parece ser um número válido.").then(msg =>{ setTimeout(() => msg.delete(), 5000) })
        } else if (amount <= 1 || amount > 100) {
            return message.reply("você precisa inserir um número entre 1 e 99.").then(msg =>{ setTimeout(() => msg.delete(), 5000) })
        } else if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('Sinto muito, esse comando é para ADMINISTRATOR apenas 😢').then(msg =>{ setTimeout(() => msg.delete(), 5000) })
        
        async function del() {
            let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`${message.author} Tem certeza que deseja deletar as mensagens 👉👈 ? (SIM ou NAO)`)

            const m = await message.channel.send('Deletando...')

            message.reply({embeds: [embed]}).then(m_4 => {
                let coletor = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})

                coletor.on('collect', (palavra)=>{
                    let msg = palavra.content

                    if(msg === 'SIM' || msg === 'sim'){
                        message.channel.bulkDelete(amount).then(messages =>{
                        }).catch((err) => {
                            console.error(err)
                            message.channel.send("ocorreu um erro ao tentar remover mensagens neste canal!")
                        })
                    }else{
                        message.reply('Foi por puco em 😅').then(msg =>{ setTimeout(() => msg.delete(), 5000) })
                    }
                })
            })
        }
        return del()
}

module.exports ={
    name: 'clear',
    help: 'Vai Limpar o chat, use o comando e a quantidade EXEMPLO: !clear 30',
    user: 'admin',
    execute
}