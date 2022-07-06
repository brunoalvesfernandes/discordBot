const execute = (bot, message, args) => {
    const config = require('../config.json')
    const mysql = require('mysql')
    let con = mysql.createPool(config.mysql)
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('Sinto muito, esse comando é para ADMINISTRATOR apenas 😢').then(msg =>{ setTimeout(() => msg.delete(), 8000) })

    async function msg() {
        const Discord = require('discord.js');

        let embed_1 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Enviar o ID do "Canal/Channel" da onde vai ir as mensagem de Bem Vindo !`)

        let embed_error = new Discord.MessageEmbed()
        .setColor("FF0000")
        .setDescription(`${message.author} Você deve ter feito algo de errado! qualquer duvida entrar em contato com ZOOM - Community`)

        let embed_2 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Qual vai ser o ID do emoji de reação ? \n
        EXEMPLOS: " 😀 🥳 😒 👾 🖖 🐶 ❤️ ✅ ✔️ " \n
        (Pode usar um dos exemplos se ficar com duvida) \n 
        pode usar tambem desse site https://getemoji.com e só copiar e colar o emoji \n
        Você vai clicar botão direito e copiar o ID do emoji \n
        OBS: use apenas 1 ID do emoji para não ter nenhum erro !`)

        let embed_3 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Copiar o ID da mensagem, pode escreve-la,\n
         ou usar o /anunciar para criar um embed com as regras e a reação que é usada para ganhar o cargo\n
        EXEMPLO : ===REGRAS===\n
        BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BL AL\n
        se você concorda com as regras\n
        reage com 👾 para ganhar o cargo de membro !\n
        OBS: aqui só enviar o ID dessa mensagem que você já tenha feito !`)

        let embed_4 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Enviar o ID do "Canal/Channel" da onde vai ir os LOGS de erros !`)

        let embed_6 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} ID do cargo que vai ser atribuido ao usuario logo após o clique.`)

        let embed_5 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Esta tudo corretor ? se sim digite OK!`)

        message.reply({ embeds: [embed_1]}).then(msg => {
            let coletor_1 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})

            coletor_1.on('collect', (palavra1) => {
                let id_bv = (palavra1.content)

                if(!id_bv) {
                    palavra1.reply({ embeds: [embed_error]})
                }else{
                    message.reply({embeds: [embed_2]}).then(m_2 =>{
                        let coletor_2 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})

                        coletor_2.on('collect', (palavra2) => {
                            let emoji = palavra2.content.codePointAt(0).toString(16)

                            console.log(emoji)
                                message.reply({embeds: [embed_3]}).then(m_3 => {
                                    let coletor_3 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})

                                    coletor_3.on('collect', (palavra3)=>{
                                        let id_msg = (palavra3.content)

                                        if(!id_msg){
                                            palavra3.reply({ embeds: [embed_error]})
                                        }else{

                                            message.reply({embeds: [embed_4]}).then(m_4 => {
                                                let coletor_4 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})
                
                                                coletor_4.on('collect', (palavra4)=>{
                                                    let id_log = (palavra4.content)
                                                    let log = message.mentions.channels.first() || message.guild.channels.cache.get(palavra4.content)
                                                    if(!id_log){
                                                        palavra4.reply({ embeds: [embed_error]})
                                                    }else{
                                                        message.reply({embeds: [embed_6]}).then(m_6 => {
                                                            let coletor_6 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})
                            
                                                            coletor_6.on('collect', (palavra6)=>{
                                                                let id_cargo = (palavra6.content)

                                                                if(!id_cargo){
                                                                    palavra6.reply({ embeds: [embed_error]})
                                                                }else {
                                                                        message.reply(`Os dados foi para o ${log} após ver que esta tudo certo digite OK`).then(m => {
                                                                        log.send({embeds: [
                                                                            new Discord.MessageEmbed()
                                                                            .setColor('RANDOM')
                                                                            .setThumbnail(message.guild.iconURL({ dynamic: true}))
                                                                            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true}), '')
                                                                            .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true})})
                                                                            .setTitle('Informação que vai para o banco de dados')
                                                                            .addFields(
                                                                                { name: 'ID do canal de WELCOME :', value: `${id_bv}` },
                                                                                { name: 'Emoji', value: emoji },
                                                                                { name: 'ID do cargo', value: `${id_cargo}` },
                                                                                { name: 'ID da menssagem', value: `${id_msg}` },
                                                                                { name: 'ID do log', value: `${id_log}` },
                                                                            )

                                                                        ] }).catch(e => {m.edit({ content: `${message.author} Algo deu errado`, embeds: [] }) })
                                                                    })
                                                                    if(id_bv && emoji && id_msg && id_log){
                                                                        message.reply({embeds: [embed_5]}).then(m_5 => {
                                                                            let coletor_5 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})
                                            
                                                                            coletor_5.on('collect', (palavra5)=>{
                                                                                let ok = palavra5.content

                                                                                if(ok === "OK" || ok === "ok"){
                                                                                    var server = message.guildId
                                                                                    con.query(`SELECT * FROM bot_config WHERE id_guild = '${server}'`, (err, row) => { if(row[0] < 0){
                                                                                        con.query(`INSERT INTO bot_config (id_guild, prefix, emoji, cargo_id, message_id, log_id, canal) VALUES ('${server}', '/', '${emoji}', '${id_cargo}', '${id_msg}', '${id_log}', '${id_bv}')`, (err, row) => { })
                                                                                        message.reply(`Parabens foi inserido com sucesso, user /clear 30 para testar !`)
                                                                                    }else {
                                                                                        con.query(`UPDATE bot_config SET prefix = '/', emoji = '${emoji}', cargo_id = '${id_cargo}', message_id = '${id_msg}', log_id = '${id_log}',canal = '${id_bv}' WHERE id_guild = '${server}' `, (err, row) => { })
                                                                                        message.reply(`Parabens foi Editado com sucesso, user /clear 30 para testar !`)
                                                                                    } })
                                                                                    
                                                                                }else {
                                                                                    message.reply(`Erro na hora de inserir no BD, Você deve ter digitado OK incorreto!`)
                                                                                }
                                                                            })
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        })
                                                    }
                                                })
                                            })
                                        }
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
    name: 'configRole',
    help: 'Configuração se você quiser adicionar cargo por reação de Membro !',
    user: 'admin',
    execute
}