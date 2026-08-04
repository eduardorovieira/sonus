import { useState, useRef, useEffect } from 'react';
import Grid from './Grid';
import PlayButtonIcon from '../icons/PlayButtonIcon';
import PauseButtonIcon from '../icons/PauseButtonIcon';

function Footer({ selectedSong }) {
  // refs para os dois elementos de audio
  const audio1Ref = useRef(null);
  const audio2Ref = useRef(null);
  const activeAudioRef = useRef(0);

  // ref para o intervalo de fade
  const fadeIntervalRef = useRef(null);

  // estado para controlar se o áudio está tocando ou pausado
  const [isPlaying, setIsPlaying] = useState(false);


  // dados do som selecionado
  const selectedSongData = {
    title: selectedSong?.fields?.titulo?.stringValue || "Nenhum som selecionado",
    image: selectedSong?.fields?.url_capa?.stringValue || null,
    audio: selectedSong?.fields?.url_audio?.stringValue || null
  };

  // funções para obter a referência do player de áudio ativo e inativo
  function getActiveAudioRef() {
    return activeAudioRef.current === 0 ? audio1Ref : audio2Ref;
  }

  function getInactiveAudioRef() {
    return activeAudioRef.current === 0 ? audio2Ref : audio1Ref;
  }

  // função para resetar os players de áudio para evitar comportamento estranho ao selecionar um novo som
  function resetPlayers() {
    const audio1 = audio1Ref.current;
    const audio2 = audio2Ref.current;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    audio1.pause();
    audio2.pause();

    audio1.currentTime = 0;
    audio2.currentTime = 0;

    audio1.ontimeupdate = null;
    audio2.ontimeupdate = null;

    audio1.onloadedmetadata = null;
    audio2.onloadedmetadata = null;

    audio1.volume = 1;
    audio2.volume = 0;

    activeAudioRef.current = 0;
  }

  // função para fazer o fade do player antigo e player novo
  function fadeOut(oldPlayer, newPlayer) {
    let steps = 0;
    const allSteps = 20;
    
    const fadeInterval = setInterval(() => {
      steps++;
      const progress = steps / allSteps;

      oldPlayer.volume = Math.max(0, Math.min(1, 1 - progress));
      newPlayer.volume = Math.max(0, Math.min(1, progress));

      if (steps >= allSteps) {
        oldPlayer.pause();
        oldPlayer.currentTime = 0;
        
        activeAudioRef.current = activeAudioRef.current === 0 ? 1 : 0;
        
        clearInterval(fadeInterval);
        fadeIntervalRef.current = null;
      }
    }, 100);
    
    fadeIntervalRef.current = fadeInterval;
  }

  // função para alternar entre os players de áudio
  function switchPlayers() {
    const oldPlayer = getActiveAudioRef().current;
    const newPlayer = getInactiveAudioRef().current;

    newPlayer.src = oldPlayer.src;
    newPlayer.load();

    newPlayer.onloadedmetadata = () => {
      newPlayer.currentTime = 2;
      newPlayer.volume = 0;
      
      newPlayer.play().then(() => {
        setLoopFade(newPlayer);
        fadeOut(oldPlayer, newPlayer);
      }).catch((error) => {
        console.error("Erro no switch de áudio (autoplay bloqueado/abortado):", error);
      });
    };
  }

  // função para configurar o loop infinito com o fade entre os players
  function setLoopFade(player) {
    player.ontimeupdate = () => {
      const fadeDuration = 4;

      if (player.duration > 0 && player.currentTime >= player.duration - fadeDuration) {
        player.ontimeupdate = null;
        switchPlayers();
      }
    };
  }

  // função para lidar com o clique no botão de play/pause. Responsável também pela decisão de qual icone mostrar (play ou pause)
  async function handlePlayPause() {

    const activeAudio = getActiveAudioRef().current;

    if (isPlaying) {
      audio1Ref.current.pause();
      audio2Ref.current.pause();
      setIsPlaying(false);
    } else {
      try {
        if (acttiveAudio && activeAudio.src) {
          await activeAudio.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Erro ao reproduzir o áudio:", error);
      }
    }
  }

  // useEffect para lidar com a seleção de uma nova música. Quando uma nova música é selecionada, ele reseta os players, define a fonte do áudio e inicia a reprodução.
  useEffect(() => {
    if (!selectedSong) return;

    const audio1 = audio1Ref.current;
    if (!audio1) return;

    resetPlayers();

    audio1.src = selectedSongData.audio;
    audio2Ref.current.src = selectedSongData.audio;

    audio1.load();

    audio1.play().then(() => {
      setIsPlaying(true);
      setLoopFade(audio1);
    }).catch((error) => {
      console.error("Erro ao reproduzir o áudio inicial:", error);
      setIsPlaying(false);
    });

    return () => {
      resetPlayers();
    };

  }, [selectedSong]);

  //conteudo html do footer
  return (
    <footer className={selectedSong === null ? "oculto" : ""}>
      <div className="footer-content">
        <button 
          className="play-button" 
          type="button" 
          style={{ backgroundImage: `url(${selectedSongData.image})` }} 
          onClick={handlePlayPause}
        >
          {isPlaying ? <PauseButtonIcon /> : <PlayButtonIcon />}
        </button>
        
        <audio ref={audio1Ref} src={selectedSongData.audio} controls preload="auto"></audio>
        <audio ref={audio2Ref} src={selectedSongData.audio} controls preload="auto"></audio>
        
        <p className="nome-som">{selectedSongData.title}</p>
      </div>
    </footer>
  );
}

export default Footer;