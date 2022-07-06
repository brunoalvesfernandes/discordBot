const execute = (bot, message, args) => {
    const Discord = require('discord.js');
    const config = require('../config.json')
    const mysql = require('mysql')
    var questions = []
    let con = mysql.createPool(config.mysql) 
    class Question {
        constructor(q, a, f) {
            this.question = q;
            this.answer = a;
            this.false = f;
        }
    }  
    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    function add_question(question, correct_answer, false_answers) {

        if (false_answers.length != 3 || !false_answers instanceof Array)
            return console.error('"false_answers" deve ser um tipo de matriz com exatamente 3 membros de string.');
        if (typeof question != 'string')
            return console.error('"pergunta" deve ser uma string.');
        if (typeof correct_answer != 'string')
            return console.error('"correct_answer" deve ser uma string.');
    
        return questions.push(new Question(question, correct_answer, false_answers))
    }                               
    function quiz(message, time, embed_color = "0000ff") {

        if (!Discord.Message.prototype.isPrototypeOf(message))
            return console.error('"message" deve ser do tipo Message from discord.js');
    
        if (typeof time != 'number')
            return console.error('"tempo" deve ser um número.');
    
        var q = questions[Math.floor(Math.random() * questions.length)]
    
        if (typeof q == 'undefined' || q.length <= 0)
            return console.error("Você precisa adicionar perguntas antes de executar a função de teste.");
    
        var a = shuffle([q.answer, q.false[0], q.false[1], q.false[2]])
    
        message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({ name: `Pergunta: ${q.question}`, iconUrl: message.client.user.avatarURL })
                .setDescription(
                    `A ) ${a[0]}
                    B ) ${a[1]}
                    C ) ${a[2]}
                    D ) ${a[3]}`
                )
                .setColor(embed_color)]
        }
        ).then(async msg => {
    
            await msg.react('🇦');
            await msg.react('🇧');
            await msg.react('🇨');
            await msg.react('🇩');
    
            const filter = (reaction, user) => {
                return ['🇦', '🇧', '🇨', '🇩'].includes(reaction.emoji.name) && !user.bot;
            };
    
            // const filter = (reaction, user) => reaction.emoji.name == '🇦' || reaction.emoji.name == '🇧' || reaction.emoji.name == '🇨' || reaction.emoji.name == '🇩'
            msg.awaitReactions({ filter, max: 1, time: time * 1000, errors: ['time'] })
                .then(collected => {
    
                    var reaction = collected.first().emoji.name;
                    var challanger = collected.first().users.cache.last();
    
                    if (reaction == '🇦') {
                        if (a[0] == q.answer) message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${challanger} acertou!`).setColor('00ff00')] })
                        else message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${challanger} resposta errada. A resposta correta era : ${q.answer}.`).setColor("ff0033")] });
                    }
                    else if (reaction == '🇧') {
                        if (a[1] == q.answer) message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${challanger} acertou!`).setColor('00ff00')] })
                        else message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${challanger} resposta errada. A resposta correta era : ${q.answer}.`).setColor("ff0033")] });
                    }
                    else if (reaction == '🇨') {
                        if (a[2] == q.answer) message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${challanger} acertou!`).setColor('00ff00')] })
                        else message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${challanger} resposta errada. A resposta correta era : ${q.answer}.`).setColor("ff0033")] });
                    }
                    else if (reaction == '🇩') {
                        if (a[3] == q.answer) message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${challanger} acertou!`)] })
                        else message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`${challanger} resposta errada. A resposta correta era : ${q.answer}.`).setColor("ff0033")] });
                    }
                })
                .catch(() => {
                    message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription("Acabou o tempo!").setColor("ff0033")] });
                });
        })
    }
    async function wl() {
        const Discord = require('discord.js');

        let embed_error = new Discord.MessageEmbed()
        .setColor("FF0000")
        .setDescription(`${message.author} Digitou algo incorreto, SIM ou PADRAO para continuar`)

        let embed_1 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Seu nome no jogo !`)

        let embed_2 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Seu ID do jogo!`)

        message.reply({ embeds: [embed_1]}).then(msg => {
            let coletor_1 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})

            coletor_1.on('collect', (palavra1) => {
                let question1 = palavra1.content

                con.query(`SELECT * FROM wl_config WHERE id_guild = '${message.guildId}'`, (err, row) =>{
                    if(row[0]) {

                        if(!question1){
                            palavra1.reply({ embeds: [embed_error]})
                        }else{
                            message.reply({ embeds: [embed_2]}).then(msg => {
                                let coletor_2 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})
                    
                                coletor_2.on('collect', (palavra2) => {
                                    let question2 = palavra2.content

                                    if(!question2){
                                        palavra2.reply({ embeds: [embed_error]})
                                    }else{
                                        con.query(`SELECT * FROM wl_config WHERE id_guild = '${message.guildId}'`, (err, row) =>{
                                            if(err){
                                                console.log('Erro :'+err)
                                            }else {
                                                let qtd_pergunta = row[0].qtd_pergunta
                                                let id_pergunta = row[0].id
                                                con.query(`SELECT * FROM wl_perguntas WHERE id_pergunta = '${id_pergunta}'`, (err, row) =>{
                                                    if(err) throw err

                                                    let pergunta = JSON.parse(row[0].pergunta)
                                                    for (let i = 1; i < qtd_pergunta+1; i++) {
                                                        //console.log(pergunta["p_"+i])
                                                        if(pergunta["r_"+i+"_1"]["vf_1"] == true) 
                                                        add_question(`${pergunta["p_"+i]}`
                                                        , `${pergunta["r_"+i+"_1"]["r_1"]}`
                                                        , [`${pergunta["r_"+i+"_2"]["r_2"]}`
                                                        , `${pergunta["r_"+i+"_3"]["r_3"]}`
                                                        , `${pergunta["r_"+i+"_4"]["r_4"]}`])

                                                        if(pergunta["r_"+i+"_2"]["vf_2"] == true)
                                                        add_question(`${pergunta["p_"+i]}`
                                                        , `${pergunta["r_"+i+"_2"]["r_1"]}`
                                                        , [`${pergunta["r_"+i+"_1"]["r_2"]}`
                                                        , `${pergunta["r_"+i+"_3"]["r_3"]}`
                                                        , `${pergunta["r_"+i+"_4"]["r_4"]}`])

                                                        if(pergunta["r_"+i+"_3"]["vf_3"] == true) 
                                                        add_question(`${pergunta["p_"+i]}`
                                                        , `${pergunta["r_"+i+"_3"]["r_1"]}`
                                                        , [`${pergunta["r_"+i+"_2"]["r_2"]}`
                                                        , `${pergunta["r_"+i+"_1"]["r_3"]}`
                                                        , `${pergunta["r_"+i+"_4"]["r_4"]}`])

                                                        if(pergunta["r_"+i+"_4"]["vf_4"] == true) 
                                                        add_question(`${pergunta["p_"+i]}`
                                                        , `${pergunta["r_"+i+"_4"]["r_1"]}`
                                                        , [`${pergunta["r_"+i+"_2"]["r_2"]}`
                                                        , `${pergunta["r_"+i+"_3"]["r_3"]}`
                                                        , `${pergunta["r_"+i+"_1"]["r_4"]}`])
                                                        
                                                        quiz(message, 60, 'ffb7c5')
                                                    }
                                                    
                                                })
                                            }

                                        })
                                    }

                                })
                            })
                        }
                    }else message.reply('Esse discord não tem WhiteList ! Entrar em contato com o dono do servidor').then(msg =>{ setTimeout(() => msg.delete(), 8000) })
                })
            })
        })
    }
    return wl()
}

module.exports = {
    name: 'wl',
    help: 'Isso vai te registrar no WhiteList da cidade !',
    execute
}