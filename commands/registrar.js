const execute = (bot, message, args) => {
    const config = require('../config.json')
    const mysql = require('mysql')
    let con = mysql.createPool(config.mysql)

    async function register() {
        let server = message.guildId
        let id = message.author.id
        let name = message.author.username
        con.query(`SELECT * FROM bot_users WHERE id_guild = ${server} AND id_user = ${id}`, (err, row) => {
            if(!row[0]){
                con.query(`INSERT INTO bot_users (id_guild, id_user, name_user) VALUES ('${server}', '${id}', '${name}')`, (err, row) => { if(row[0]) {} })
            }else {
                return message.author.send('Caro amigo, você já esta registrado')
            }
        })
    }
    return register()
}

module.exports = {
    name: 'registrar',
    help: 'Vai te registrar no servidor para ganhar cargos conforme seu level',
    execute
}