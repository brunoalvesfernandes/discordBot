const execute = (bot, message, args) => {
    const config = require('../config.json')
    const mysql = require('mysql')
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('Sinto muito, esse comando é para ADMINISTRATOR apenas 😢').then(msg =>{ setTimeout(() => msg.delete(), 8000) })

    let con = mysql.createPool(config.mysql)

    async function msg() {
        const Discord = require('discord.js');

        let embed_1 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Deseja criar suas perguntas e respostas ? 
        \n**SIM**, para criar você mesmo. **OBS: Pergunta 1 e 2 é padrão, NOME E ID JOGADOR**
        \n**PADRAO**, para pegar as perguntas e resposta do BANCO DE DADOS`)

        let embed_error = new Discord.MessageEmbed()
        .setColor("FF0000")
        .setDescription(`${message.author} Digitou algo incorreto, SIM ou PADRAO para continuar`)

        let embed_2 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Qual será o título do anúncio ?`)

        let embed_3 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} Qual será a descrição do anúncio ?`)
        message.reply({ embeds: [embed_1]}).then(msg => {
            let coletor_1 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1})

            coletor_1.on('collect', (palavra1) => {
                let question = palavra1.content

                if(question === "PADRAO" || question === "padrao") {
                    const pergutasPadrao = {
                        p_1:'O que é VDM?',
                        r_1_1:{r_1:'É quando um jogador mata alguém sem nenhum motivo.',vf_1: false},
                        r_1_2:{r_2:'São lugares onde não se pode roubar ou matar',vf_2: false},
                        r_1_3:{r_3:'Utilizar Veiculo para matar alguem.',vf_3: true}, // TRUE
                        r_1_4:{r_4:'É vida de maracutaia',vf_4: false},

                        p_2:'O que é RDM?',
                        r_2_1:{r_1:'É quando um jogador mata alguém sem nenhum motivo.',vf_1: true}, // TRUE
                        r_2_2:{r_2:'Abusar da fisica do jogo.',vf_2: false},
                        r_2_3:{r_3:'É Radio de Manobra',vf_3: false},
                        r_2_4:{r_4:'Utilizar Veiculo para matar alguem.',vf_4: false},

                        p_3:'O que é METAGAMING?',
                        r_3_1:{r_1:'Abusar da fisica do jogo.',vf_1: false},
                        r_3_2:{r_2:'É entrar no bar e ficar enchendo o saco da galera',vf_2: false},
                        r_3_3:{r_3:'Bater metas no games em ação',vf_3: false},
                        r_3_4:{r_4:'Consiste em você utilizar de meios externos para obter informações dentro do jogo.',vf_4: true},// TRUE

                        p_4:'O que é POWERGAMING?',
                        r_4_1:{r_1:'Consiste em você utilizar de meios externos para obter informações dentro do jogo.',vf_1: false},
                        r_4_2:{r_2:'Voar com jato particular',vf_2: false},
                        r_4_3:{r_3:'É ativar o modo Super Homem.',vf_3: false},
                        r_4_4:{r_4:'Abusar da fisica do jogo.',vf_4: true}, // TRUE

                        p_5:'O que é COMBAT LOGGING?',
                        r_5_1:{r_1:'É um lugar onde tem luta estilo WWE.',vf_1: false},
                        r_5_2:{r_2:'deslogar no meio de uma ação e não voltar.',vf_2: true}, // TRUE
                        r_5_3:{r_3:'Pular no mar e morder o tubarao',vf_3: false},
                        r_5_4:{r_4:'é fazer rp de assédio, racismo, estupro etc..',vf_4: false},

                        p_6:'O que é DARK RP?',
                        r_6_1:{r_1:'é fazer rp de assédio, racismo, estupro etc..',vf_1: true}, // TRUE
                        r_6_2:{r_2:'nenhuma das repostas.',vf_2: false}, 
                        r_6_3:{r_3:'é um lugar todo escuro no rp.',vf_3: false},
                        r_6_4:{r_4:'deslogar no meio de uma ação e não voltar.',vf_4: false},

                        p_7:'O que é SAFE-ZONE?',
                        r_7_1:{r_1:'Lugar onde você pode matar.',vf_1: false},
                        r_7_2:{r_2:'São lugares onde não se pode ficar de boa',vf_2: false}, 
                        r_7_3:{r_3:'São lugares onde não se pode roubar ou matar.',vf_3: true}, // TRUE
                        r_7_4:{r_4:'Lugar onde tem corriga de kart',vf_4: false}
                    }

                    con.query(`SELECT * FROM wl_config WHERE id_guild = '${message.guildId}'`,(err,row)=>{
                        if(row[0]) {
                            message.reply('Você já tem WHITELIST no banco de dados')
                        }else{
                            con.query(`INSERT INTO wl_config (id_guild, qtd_pergunta) VALUES ('${message.guildId}', '7')`, (err, row) => {
                                
                                    if(err){
                                        console.log("Erro ai inserir no banco  de dados")
                                    }else {
                                        con.query(`SELECT * FROM wl_config WHERE id_guild = '${message.guildId}'`, (err, row) =>{
                                            if(err){

                                            }else{
                                                let id = row[0].id
                                                con.query(`INSERT INTO wl_perguntas (pergunta, id_pergunta) VALUES ('${JSON.stringify(pergutasPadrao)}', '${id}')`, (err, row) => {
                                                    if(err){
                                                        console.log('Erro ai inserir perguntas no Banco de dados, ERRO:',err)
                                                    }

                                                }) 
                                            }
                                        })
                                        message.reply('Você criou WhiteList Padrão com sucesso !')
                                    }
                                
                            })
                        }
                    })
                    
                }else
                if(question === "SIM" || question === "sim" || question === "Sim") {
                    
                }
            })
        })

        
    }
    return msg()
}

module.exports = {
    name: 'createwl',
    help: 'Vai personalizar seu WhiteList com perguntas e resposta !',
    user: 'admin',
    execute
}