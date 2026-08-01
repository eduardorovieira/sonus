//import CONFIG from './config.js';

const urlApi = CONFIG.API_URL;

//icones em SVG
const iconsSVG = {
    pauseIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"/></svg>`,
    playIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M323.5-208.5v-549l431 274.5-431 274.5ZM381-483Zm0 170 267.5-170L381-653v340Z"/></svg>`,
    lightModeIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>`,
    darkModeIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>`
};

//itens do html
const htmlItems = {
    playButton: document.querySelector('.play-button'),
    audioName: document.querySelector('.nome-som'),
    footerElement: document.querySelector('footer'),
    imgFooter: document.querySelector('.capa-som'),
    darkModeButton: document.querySelector('#theme-button'),
    principalColorMeta: document.querySelector('#principal-color')
};

//vetor com a ordem dos arquivos de áudio
const players =[
    document.querySelector('#audio1'),
    document.querySelector('#audio2')
];

//determina o player em execução
let playerAtivo = 0;
let somAtual = "";
let todosOsSons = [];

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

//gerar o grid de sons com base nos dados da API
function gerarGrid(sons) {
    
    const grid = document.querySelector('#grade-sons');
    grid.innerHTML = "";
    
    sons.forEach(doc =>{
        const campos = doc.fields;
        const titulo = campos.titulo ? campos.titulo.stringValue : "Título Desconhecido";
        const categoria = campos.categoria ? campos.categoria.stringValue : "Categoria Desconhecida";
        const url_capa = campos.url_capa ? campos.url_capa.stringValue : "";
        const url_audio = campos.url_audio ? campos.url_audio.stringValue : "";
        const cardSelecionado = (somAtual === url_audio) ? "card-ativo" : "";
        const cardHtml = 
        `<article class="card ${cardSelecionado}" onclick="playSound('${url_audio}', '${titulo}', '${url_capa}'); cardAtivo(this);">
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

//função para tocar o som quando o card for clicado
function playSound(url, titulo, url_Capa) {
    somAtual = url;
    htmlItems.audioName.innerText = titulo;
    htmlItems.playButton.innerHTML = iconsSVG.pauseIcon;
    htmlItems.playButton.style.backgroundImage = `url('${url_Capa}')`;
    htmlItems.footerElement.classList.remove('oculto');
    players.forEach(p => {
        p.pause();
        p.currentTime = 0;
        p.ontimeupdate = null;
    });
    
    playerAtivo = 0;
    players[playerAtivo].src = url;
    players [playerAtivo].play();
    setLoopFade(players[playerAtivo]);
};

function alternarEntrePlayers() {
    const playerAntigo = players[playerAtivo];
    playerAtivo = (playerAtivo === 0) ? 1 : 0; 
    const playerNovo = players[playerAtivo];

    playerNovo.src = somAtual;
    playerNovo.currentTime = 1; // Recomeça após 1s do início
    playerNovo.volume = 0;
    playerNovo.play();

    setLoopFade(playerNovo);


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

function setLoopFade(player) {
    player.ontimeupdate = () => {
        const tempoDeTroca = 4;
        if (player.duration > 0 && player.currentTime >player.duration - tempoDeTroca) {
            player.ontimeupdate = null;
            alternarEntrePlayers();
        }
    };
};


//evento de clique no botão de play/pause
htmlItems.playButton.addEventListener('click', () => {
    const pAtivo = players[playerAtivo];
    
    if (pAtivo.paused) {
        pAtivo.play();
        htmlItems.playButton.innerHTML = iconsSVG.pauseIcon;
    } else {
        pAtivo.pause();
        htmlItems.playButton.innerHTML = iconsSVG.playIcon;
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

//theme toggle
function atualizarIconeTema() {
    const isDarkMode = document.body.classList.contains("dark");
    htmlItems.darkModeButton.innerHTML = isDarkMode ? iconsSVG.lightModeIcon : iconsSVG.darkModeIcon;

    htmlItems.principalColorMeta.setAttribute("content", isDarkMode ? "#252422" : "#fffcf2")
};
atualizarIconeTema();

function saveUserThemePreference() {
    const lastThemeChoice = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("userThemePreference", lastThemeChoice);
};

function loadUserThemePreference() {
    const savedTheme = localStorage.getItem("userThemePreference");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }
    atualizarIconeTema();
};
loadUserThemePreference();


htmlItems.darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    
    atualizarIconeTema();
    saveUserThemePreference();
});
