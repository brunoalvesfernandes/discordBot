const execute = (bot, message, args) => {
    const config = require('../config.json')
    const mysql = require('mysql')
    let con = mysql.createPool(config.mysql)
    let string = '**===== AJUDA =====**\n\n'
    var server = message.guildId
    con.query(`SELECT * FROM bot_config WHERE id_guild = '${server}'`, (err, row) => {
        if(row[0]){
            let prefix = JSON.stringify(row[0].prefix)
            let prefixFormt = prefix.replace(/[""]/g, "")
            bot.commands.forEach(command => {

                if(command.help && message.member.permissions.has('ADMINISTRATOR')){
                    string += ` **${prefixFormt}${command.name}** : ${command.help}\n`
                }else if(command.help && command.user !== 'admin'){
                    string += ` **${prefixFormt}${command.name}** : ${command.help}\n` 
                }
            })
            return message.author.send(string)
        }else {
            return message.author.send(string)
        }
    })
}

module.exports = {
    name: 'help',
    execute
}