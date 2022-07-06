const Discord = require('discord.js');
const bot = new Discord.Client({ 
    intents: ["GUILDS", "GUILD_MESSAGES","GUILD_PRESENCES","GUILD_MEMBERS","GUILD_MESSAGE_REACTIONS"],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
const config = require('./config.json')
const jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const mysql = require('mysql')

const commandsFiles = fs.readdirSync(path.join(__dirname,'/commands')).filter(filename => filename.endsWith('.js'))

//let con = createConnection(config.mysql)
let prefixFormt

var con = mysql.createPool(config.mysql)

bot.commands = new Discord.Collection()

for(var filename of commandsFiles) {
    const command = require(`./commands/${filename}`)
    bot.commands.set(command.name,command)
}

bot.on('messageReactionAdd', async(reaction, user) =>{
    var server = reaction.message.guildId
    
    con.query(`SELECT * FROM bot_config WHERE id_guild = '${server}'`, async( err, row) => {
        let rows = JSON.parse(JSON.stringify(row))
        let message_id = rows[0].message_id
        let emoji = rows[0].emoji
        let emoji2 = String.fromCodePoint(parseInt(`${emoji}`, 16))
        let cargo_id = rows[0].cargo_id
        let log_id = rows[0].log_id

        if(reaction.message.partial) await reaction.message.fetch()
        if(reaction.partial) await reaction.fetch
        if(user.bot) return
        if(!reaction.message.guild) return
        if(reaction.message.id === message_id) {
            if(reaction.emoji.name === emoji2){
                await reaction.message.guild.members.cache.get(user.id).roles.add(cargo_id).catch( e => {
                    con.query(`SELECT * FROM bots WHERE id_guild = '${server}'`, (err, row) => {
                        if(err){
                            console.log(`Tratar o erro ${err} do servidor ${reaction.message.guild}` )
                        }else {
                            
                            let name_guild = JSON.stringify(row[0].name)
                            let nameFormt = name_guild.replace(/[""]/g, "")
                            
                            bot.channels.cache.get(log_id).send(
                                        `Desculpe, o cargo do BOT esta abaixo do cargo atribuido ao emoji \n 
                                        Vou te ajudar 🤙🏻 \n 
                                        Clica botão esquerdo no nome do servidor ${nameFormt} \n
                                        vá até Config. do servidor ⚙️ \n
                                        Entre na aba Cargos \n
                                        me puxe para cima dos cargos da reação \n
                                        VOALA, já podemos fazer um brinde 🥂🥂 \n
                                        OBS: em 1 minuto essa menssagem vai se auto apagar.`
                            ).then(msg =>{ setTimeout(() => msg.delete(), 60000) }).catch(err => {
                                console.log(`Algum probela com o servidor ${nameFormt} Erro : ${err}`)
                            })
                        }
                    })
                })
            }
        }
    })
})

bot.on('messageReactionRemove', async(reaction, user) =>{
    let server = reaction.message.guildId

    con.query(`SELECT * FROM bot_config WHERE id_guild = '${reaction.message.guildId}'`, async( err, row) => {
        let rows = JSON.parse(JSON.stringify(row))
        let message_id = rows[0].message_id
        let emoji = rows[0].emoji
        let emoji2 = String.fromCodePoint(parseInt(`${emoji}`, 16))
        let cargo_id = rows[0].cargo_id
        let log_id = rows[0].log_id

        if(reaction.message.partial) await reaction.message.fetch()
        if(reaction.partial) await reaction.fetch
        if(user.bot) return
        if(!reaction.message.guild) return
        if(reaction.message.id === message_id) {
            if(reaction.emoji.name === emoji2){
                await reaction.message.guild.members.cache.get(user.id).roles.remove(cargo_id).catch( e => {
                    con.query(`SELECT * FROM bots WHERE id_guild = '${server}'`, (err, row) => {
                        if(err){
                            console.log(`Tratar o erro ${err} do servidor ${reaction.message.guild}` )
                        }else {
                            
                            let name_guild = JSON.stringify(row[0].name)
                            let nameFormt = name_guild.replace(/[""]/g, "")
                            
                            bot.channels.cache.get(log_id).send(
                                        `Desculpe, o cargo do BOT esta abaixo do cargo atribuido ao emoji \n 
                                        Vou te ajudar 🤙🏻 \n 
                                        Clica botão esquerdo no nome do servidor ${nameFormt} \n
                                        vá até Config. do servidor ⚙️ \n
                                        Entre na aba Cargos \n
                                        me puxe para cima dos cargos da reação \n
                                        VOALA, já podemos fazer um brinde 🥂🥂 \n
                                        OBS: em 1 minuto essa menssagem vai se auto apagar.`
                            ).then(msg =>{ setTimeout(() => msg.delete(), 60000) }).catch(err => {
                                console.log(`Algum probela com o servidor ${nameFormt} Erro : ${err}`)
                            })
                        }
                    })
                })
            }
        }
    })
})

bot.on('ready',() => {
    if (!prefixFormt) prefixFormt = '/'
    bot.guilds.cache.map(guild => {
        let server = guild.id
        con.query(`SELECT * FROM bot_config WHERE id_guild = '${server}'`, async( err, row) => {
            let prefix = JSON.parse(JSON.stringify(row[0].prefix))
            con.query(`SELECT * FROM bots WHERE id_guild = '${server}'`, async( err, row) => {
                let name = JSON.parse(JSON.stringify(row[0].name))
                console.log(`Bot foi iniciado no ${name}.`);
                bot.user.setActivity(`, ${prefix}help para saber os comandos, Eu estou em ${bot.guilds.cache.size} servidor`, { type: 'STREAMING' })
            })
        })
    })

})

bot.on('guildCreate', guild => {
    let server = guild.id
    con.query( `INSERT INTO bots (id_guild, name, ownerId) VALUES ('${server}', '${guild.name}', '${guild.ownerId}')`, (err, row) => {
        if(err) return
    })
    con.query( `INSERT INTO bot_config (id_guild, prefix, emoji, cargo_id, message_id, log_id, canal) VALUES ('${server}', '/', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL')`, (err, row) => {
        if(err) return
    })
    console.log(`O bot entrou nos servidor ${guild.name} (id: ${server}). Populacão ${guild.memberCount} membros!`);
    //bot.user.setActivity(`Estou em ${bot.guilds.cache.size} servidor`);
});

bot.on('guildDelete', guild => {
    con.query( `DELETE FROM bots WHERE id_guild = ${guild.id}`, (err, row) => {
        if(err) return
    })
    con.query( `DELETE FROM bot_config WHERE id_guild = ${guild.id}`, (err, row) => {
        if(err) return
    })
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    //bot.user.setActivity(`Serving ${bot.guilds.cache.size} servers`);
});

bot.on('messageCreate', async message => {
    let server = message.guildId
    con.query(`SELECT * FROM bot_config WHERE id_guild = '${server}'`, async( err, row) => {
        let prefix = JSON.stringify(row[0].prefix)
        prefixFormt = prefix.replace(/[""]/g, "")

        if(message.author.bot) return

        const args = message.content.slice(prefixFormt.length).split(' ')
        const command = args.shift()
        try{
            bot.commands.get(command).execute(bot, message, args)
        } catch(e) {
            if(message.content.startsWith(prefixFormt)){
                message.reply(`Estou aprendendo ainda 🤡, sinto não conseguir responder essa mensagem 😭, use ** ${prefixFormt}help **, para mais informação!`)
                .then(msg => {
                    setTimeout(() => msg.delete(), 10000)
                })
                .catch(console.error);
            }
        }
        //// message.author.id       message.content 
        if(!bot.commands.get(command) && message.content){
            
            con.query(` SELECT * FROM bot_users WHERE id_guild = '${message.guildId}' AND id_user = '${message.author.id}' `, ( err, row) => {
                if(row[0]){
                    let lvl = parseInt(JSON.stringify(row[0].lvl))
                    let lvlFormt = lvl
                    let exp = parseInt(JSON.stringify(row[0].exp))
                    let expFormt = exp
                    let name = JSON.stringify(row[0].name_user)
                    let nameFormt = name.replace(/[""]/g, "")
                    let maxExp = parseInt(JSON.stringify(row[0].maxexp))
                    let maxExpF = maxExp
                

                    let contentExp = message.content.length

                    expFormt += contentExp

                    if(expFormt >= maxExpF){
                        let levelAtual = lvlFormt + 1
                        let expF = maxExpF * 2
                        con.query(`UPDATE bot_users SET lvl = '${levelAtual}', maxexp = '${expF}' WHERE id_guild = '${message.guildId}' AND id_user = '${message.author.id}'`, ( err, row) => {})

                        const embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Parabéns,${nameFormt}! Você é sempre bem vindo ao servidor !`)
                        .addFields({name: 'Você upou para o lvl :',value: `${levelAtual}`})
                        .setTimestamp()
                        .setFooter({ text: 'ZOOM @Todos direitos Reservados!', iconURL: 'https://ondeeuclico.com.br/wp-content/uploads/2020/12/zoom.jpg' })

                        message.channel.send({ embeds: [embed] })
                    }

                    con.query(`UPDATE bot_users SET exp = ${expFormt} WHERE id_guild = '${message.guildId}' AND id_user = '${message.author.id}'`, ( err, row) => {})
                }else {
                    message.reply(` **${message.author.username}**, usar comando **${prefixFormt}registrar** para fazer parte da comunidade`).then(msg => {setTimeout(() => msg.delete(), 10000)})
                }
            })
             
        }
    })
})

bot.on('guildMemberAdd', async (member) => {  // member.guild.id     member.user.id     member.user.username
    let font = await jimp.loadFont('./assets/Tz51ZI2qFsAFXS4i1_NXlkT0.ttf.fnt')
    let font2 = await jimp.loadFont('./assets/KkGfJbF6AaAfg2pXPM3VpgoI.ttf.fnt')
    let mask = await jimp.read('./img/mascara.png')
    let fundo = await jimp.read('./img/fundo.png')

    let server = member.guild.id
    con.query( `INSERT INTO bot_users (id_guild, id_user, name_user) VALUES ('${server}', '${member.user.id}', '${member.user.username}')`, (err, row) => {
        //console.log(err)
    })
    con.query( `SELECT * FROM bot_config WHERE id_guild = '${server}'`, (err, row) => {
        let channel = JSON.parse(JSON.stringify(row))
        let canal = channel[0].canal
        let channelFormt = member.guild.channels.cache.get(canal)
        if(row[0] || canal !== 0){
            con.query( `SELECT * FROM bot_users WHERE id_user = '${member.user.id}' AND id_guild = '${member.guild.id}'`, (err, row) => {
                let id = JSON.stringify(row[0].id)
                let idFormt = id.replace(/[""]/g, "")

                jimp.read(member.user.defaultAvatarURL)
                .then(avatar => {
                    mask.resize(140, 145)
                    avatar.resize(140, 145)
                    avatar.mask(mask)
                    fundo.print(font2, 210,170, 'Bem Vindo')
                    fundo.print(font, 520,205, '#'+idFormt)
                    fundo.print(font, 200,205, member.user.username)
                    fundo.composite(avatar,230,20).write('./img/bemvindo.png')
                    channelFormt.send({ files: ["./img/bemvindo.png"] })
                }).catch(err => {
                    console.log('Erro ao carregar imagem, Erro: '+err)
                })
            })
        }
    })

})

bot.on('guildMemberRemove', member => {
    let server = member.guild.id
    con.query( `SELECT * FROM bot_config WHERE id_guild = '${server}'`, (err, row) => {
        let channel = JSON.parse(JSON.stringify(row))
        let canal = channel[0].canal
        let channelFormt = member.guild.channels.cache.get(canal)

        if(row[0] || canal !== 0){
            con.query( `DELETE FROM bot_users WHERE id_guild = ${member.guild.id} AND id_user = ${member.user.id}`, (err, row) => {
                channelFormt.send(`Infelizmente Hoje esta partindo mais um, espero que não siga o caminho das drogas 😜 ${member.user.username} !`)
            })
        }
    })
})

bot.login(config.token);