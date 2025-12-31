//icones de play e pause em SVG
const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3ff"><path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"/></svg>`;
const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3ff"><path d="M323.5-208.5v-549l431 274.5-431 274.5ZM381-483Zm0 170 267.5-170L381-653v340Z"/></svg>`;

//mixers
const players =[document.querySelector('#audio1'), document.querySelector('#audio2')];
let playerAtivo = 0;
let somAtual = "";

let todosOsSons = [];


//itens do html que vou manipular
const playButton = document.querySelector('.play-button');
const nomeAudio = document.querySelector('.nome-som');

//url da minha API no Firestore
const urlApi = CONFIG.API_URL;


function alternarEntrePlayers() {
    const playerAntigo = players[playerAtivo];
    playerAtivo = (playerAtivo === 0) ? 1 : 0; 
    const playerNovo = players[playerAtivo];

    playerNovo.src = somAtual;
    playerNovo.currentTime = 1; // Recomeça após 1s do início
    playerNovo.volume = 0;
    playerNovo.play();

    configuraLoopFade(playerNovo);

    let passos = 0;
    const totalPassos = 10;
    
    const fadeInterval = setInterval(() => {
        passos++;
        let progresso = passos / totalPassos; // Vai de 0 a 1
        playerNovo.volume = progresso; 
        playerAntigo.volume = 1 - progresso;

        if (passos >= totalPassos) {
            playerNovo.volume = 1;
            playerAntigo.pause();
            playerAntigo.volume = 1; 
            clearInterval(fadeInterval);            
        }
    }, 333); 
}

function configuraLoopFade(player) {
    player.ontimeupdate = () => {
        const tempoDeTroca = 4;
        if (player.duration > 0 && player.currentTime >player.duration - tempoDeTroca) {
            player.ontimeupdate = null;
            alternarEntrePlayers();
        }
    };
};
//função para tocar o som quando o card for clicado
function tocarSom(url, titulo) {
    somAtual = url;
    nomeAudio.innerText = titulo;
    playButton.innerHTML = pauseIcon;

    players.forEach(p => {
        p.pause();
        p.currentTime = 0;
        p.ontimeupdate = null;
    });
    playerAtivo = 0;
    players[playerAtivo].src = url;
    players [playerAtivo].play();
    configuraLoopFade(players[playerAtivo]);
};

//aqui eu eu crio uma função assincrona para chamar a API
async function chamaAPI() {
    try {
        const response = await fetch(urlApi);
        const data = await response.json();

        if (data.documents) {
            todosOsSons =  data.documents;
            gerarGrid(todosOsSons);
        }
        else {
            console.warn("Ops! Nenhum som foi encontrado.");
        }
    } catch (error) {
        console.error("Erro ao chamar a API:", error);
    }
};


//aqui eu gero os cards automadicamente com base nos dados fornceidos pela minha API
function gerarGrid(sons) {

    const grid = document.querySelector('#grade-sons');
    grid.innerHTML = "";

    sons.forEach(doc =>{
        const campos = doc.fields;
        const titulo = campos.titulo ? campos.titulo.stringValue : "Título Desconhecido";
        const categoria = campos.categoria ? campos.categoria.stringValue : "Categoria Desconhecida";
        const url_capa = campos.url_capa ? campos.url_capa.stringValue : "";
        const url_audio = campos.url_audio ? campos.url_audio.stringValue : "";
        const cardHtml = 
        `<article class="card card-ativo" onclick="tocarSom('${url_audio}', '${titulo}'); cardAtivo(this);">
                <img src="${url_capa}" alt="Capa de ${titulo}" class="card-capa"/>
                <div class="info">
                    <h3>${titulo}</h3>
                    <span>${categoria}</span>
                </div>
            </article>`
        ;
        grid.insertAdjacentHTML('beforeend', cardHtml);
    });
};

//evento de clique no botão de play/pause
playButton.addEventListener('click', () => {
    const pAtivo = players[playerAtivo];
    if (pAtivo.paused) {
        pAtivo.play();
        playButton.innerHTML = pauseIcon;
    } else {
        pAtivo.pause();
        playButton.innerHTML = playIcon;
    }
});


function filtrarSonsPorCategoria(categoriaSelecionada) {
    console.log("Filtro acionado para:", categoriaSelecionada);
    if (categoriaSelecionada === 'Todos') {
        gerarGrid(todosOsSons);
        return;
    };
    let sonsFiltrados = [];
    switch (categoriaSelecionada) {
        case 'Foco':
        case 'Sono':
        case 'Inspirador':
        sonsFiltrados = todosOsSons.filter(doc => {    
            if (doc.fields && doc.fields.categoria && doc.fields.categoria.stringValue) {
                    const categoriaBancoDeDados = doc.fields.categoria?.stringValue;
                    return categoriaBancoDeDados.toLowerCase() === categoriaSelecionada.toLowerCase();
                }
                return false;
    });
            break;
        default:
            sonsFiltrados = todosOsSons;
    }
    gerarGrid(sonsFiltrados);
};

chamaAPI();

function botaoAtivo(botao) {
    const botoes = document.querySelectorAll('nav button');
    botoes.forEach(btn => btn.classList.remove('ativo'));
    
    if (botao) {
        botao.classList.add('ativo');
    }
}

function cardAtivo(card) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(c => c.classList.remove('card-ativo'));
    
    if (card) {
        card.classList.add('card-ativo');
    }
}