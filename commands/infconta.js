const execute = (bot,message,args) =>{
    const Discord = require('discord.js');
    const config = require('../config.json')
    const mysql = require('mysql')
    let con = mysql.createPool(config.mysql)

    let id = message.author.id
    let server = message.guildId
    con.query(`SELECT * FROM bots WHERE id_guild = '${server}'`, async( err, row) => {
        if(row[0]){
            let nomeGuild = JSON.stringify(row[0].name)
            let nomeGuildFormt = nomeGuild.replace(/[""]/g, "")
            con.query(`SELECT * FROM bot_users WHERE id_user = '${id}' AND id_guild = ${server} `, async( err, row) => {

                if(row[0]){
                    let username = JSON.stringify(row[0].name_user)
                    let usernameFormt = username.replace(/[""]/g, "")
                    let lvl = JSON.stringify(row[0].lvl)
                    let expAtual = JSON.stringify(row[0].exp)
                    let expTotal = JSON.stringify(row[0].maxexp)

                    const embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Informações da sua conta')
                        .setAuthor({ name: `${usernameFormt}`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                        .setDescription(`Um pouco sobre você dentro do ${nomeGuildFormt}`)
                        .setThumbnail('https://ondeeuclico.com.br/wp-content/uploads/2020/12/zoom.jpg')
                        .addFields(
                            {
                                name: 'Ativo desde :',
                                value: `${message.author.createdAt.toLocaleDateString()}`
                            },
                            {
                                name: 'Level atual :',
                                value: lvl
                            },
                            {
                                name: 'EXP atual:',
                                value: expAtual+'/'+expTotal
                            },
                        )
                        .setTimestamp()
                        .setFooter({ text: 'ZOOM @Todos direitos Reservados!', iconURL: 'https://ondeeuclico.com.br/wp-content/uploads/2020/12/zoom.jpg' })

                        message.channel.send({ embeds: [embed] })
                }else {
                    return message.author.send('Você não esta registrado, use /registrar no grupo do discord e seja feliz !')
                }
            })
        }
    })
}

module.exports ={
    name: 'infconta',
    help: 'Informação de sua conta no servidor',
    execute
}