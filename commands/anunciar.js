const execute = (bot, message, args) => {

    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('Sinto muito, esse comando é para ADMINISTRATOR apenas 😢').then(msg =>{ setTimeout(() => msg.delete(), 8000) })

    async function msg() {
        const Discord = require('discord.js');

        let embed_1 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Qual será o chat enviar o anúncio ?`)

        let embed_error = new Discord.MessageEmbed()
        .setColor("FF0000")
        .setDescription(`${message.author} Não foi possivel reconhecer o canal de texto`)

        let embed_2 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Qual será o título do anúncio ?`)

        let embed_3 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Qual será a descrição do anúncio ?`)

        message.reply({ embeds: [embed_1]}).then(msg => {
            let coletor_1 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})

            coletor_1.on('collect', (palavra1) => {
                let chat = message.mentions.channels.first() || message.guild.channels.cache.get(palavra1.content)

                if(!chat) {
                    palavra1.reply({ embeds: [embed_error]})
                }else
                if(chat) {
                    message.reply({embeds: [embed_2]}).then(m_2 =>{
                        let coletor_2 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})

                        coletor_2.on('collect', (palavra2) => {
                            let titulo = palavra2.content

                            message.reply({embeds: [embed_3]}).then(m_3 => {
                                let coletor_3 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})

                                coletor_3.on('collect', (palavra3)=>{
                                    let desc = palavra3.content

                                    message.reply(`O aviso foi enviado para ${chat} com sucesso.`).then(m => {
                                        chat.send({embeds: [
                                            new Discord.MessageEmbed()
                                            .setColor('RANDOM')
                                            .setThumbnail(message.guild.iconURL({ dynamic: true}))
                                            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true}), '')
                                            .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true})})
                                            .setTitle(titulo)
                                            .setDescription(desc)
                                        ] }).catch(e => {m.edit({ content: `${message.author} Algo deu errado`, embeds: [] }) })
                                    })

                                })
                            })
                        })
                    })
                }
            })
        })

        
    }
    return msg()
}

module.exports = {
    name: 'anunciar',
    help: 'Cria uma mensagem personalizada com o bot !',
    user: 'admin',
    execute
}