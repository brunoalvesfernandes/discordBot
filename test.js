const jimp = require('jimp')

async function a(){
    let pergutasPadrao = {
        'pergunta1': 'O que é VDM?',
        'resposta1_1': 'É quando um jogador mata alguém sem nenhum motivo.',
        'resposta1_2': 'São lugares onde não se pode roubar ou matar',
        'resposta1_3': 'Utilizar Veiculo para matar alguem.', // TRUE
        'resposta1_4': 'É vida de maracutaia',

        'pergunta2':   'O que é RDM?',
        'resposta2_1': 'É quando um jogador mata alguém sem nenhum motivo.', // TRUE
        'resposta2_2': 'Abusar da fisica do jogo.',
        'resposta2_3': 'É Radio de Manobra',
        'resposta2_4': 'Utilizar Veiculo para matar alguem.',

        'pergunta3':   'O que é METAGAMING?',
        'resposta3_1': 'Abusar da fisica do jogo.',
        'resposta3_2': 'É entrar no bar e ficar enchendo o saco da galera',
        'resposta3_3': 'Bater metas no games em ação',
        'resposta3_4': 'Consiste em você utilizar de meios externos para obter informações dentro do jogo.', // TRUE

        'pergunta4':   'O que é POWERGAMING?',
        'resposta4_1': 'Consiste em você utilizar de meios externos para obter informações dentro do jogo.',
        'resposta4_2': 'Voar com jato particular',
        'resposta4_3': 'É ativar o modo Super Homem.',
        'resposta4_4': 'Abusar da fisica do jogo.', // TRUE

        'pergunta5':   'O que é COMBAT LOGGING?',
        'resposta5_1': 'É um lugar onde tem luta estilo WWE.',
        'resposta5_2': 'deslogar no meio de uma ação e não voltar.', // TRUE
        'resposta5_3': 'Pular no mar e morder o tubarao',
        'resposta5_4': 'é fazer rp de assédio, racismo, estupro etc..',

        'pergunta6':   'O que é DARK RP?',
        'resposta6_1': 'é fazer rp de assédio, racismo, estupro etc..', // TRUE
        'resposta6_2': 'nenhuma das repostas.', 
        'resposta6_3': 'é um lugar todo escuro no rp.',
        'resposta6_4': 'deslogar no meio de uma ação e não voltar.',

        'pergunta7':   'O que é SAFE-ZONE?',
        'resposta7_1': 'Lugar onde você pode matar.',
        'resposta7_2': 'São lugares onde não se pode ficar de boa', 
        'resposta7_3': 'São lugares onde não se pode roubar ou matar.', // TRUE
        'resposta7_4': 'Lugar onde tem corriga de kart',
    }
    console.log(pergutasPadrao.resposta1_1)
} 
a()