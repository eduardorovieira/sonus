import { useState, useRef, useEffect } from 'react';
import Grid from './Grid';
import PlayButtonIcon from '../icons/PlayButtonIcon';
import PauseButtonIcon from '../icons/PauseButtonIcon';

function Footer({ selectedSong }) {
  const audio1Ref = useRef(null);
  const audio2Ref = useRef(null);
  const activeAudioRef = useRef(0);
  const fadeIntervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedSongData = {
    title: selectedSong?.fields?.titulo?.stringValue || "Nenhum som selecionado",
    image: selectedSong?.fields?.url_capa?.stringValue || null,
    audio: selectedSong?.fields?.url_audio?.stringValue || null
  };

  function getActiveAudioRef() {
    return activeAudioRef.current === 0 ? audio1Ref : audio2Ref;
  }

  function getInactiveAudioRef() {
    return activeAudioRef.current === 0 ? audio2Ref : audio1Ref;
  }

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

    audio1.volume = 1;
    audio2.volume = 0;

    activeAudioRef.current = 0;
  }

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

  function switchPlayers() {
    const oldPlayer = getActiveAudioRef().current;
    const newPlayer = getInactiveAudioRef().current;

    newPlayer.src = selectedSongData.audio;
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

  function setLoopFade(player) {
    player.ontimeupdate = () => {
      const fadeDuration = 4;

      if (player.duration > 0 && player.currentTime >= player.duration - fadeDuration) {
        player.ontimeupdate = null;
        switchPlayers();
      }
    };
  }

  async function handlePlayPause() {
    if (isPlaying) {
      audio1Ref.current.pause();
      audio2Ref.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await getActiveAudioRef().current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Erro ao reproduzir o áudio:", error);
      }
    }
  }

  useEffect(() => {
    if (!selectedSong) return;

    resetPlayers();

    const audio1 = audio1Ref.current;
    if (!audio1) return;

    audio1.src = selectedSongData.audio;
    audio2Ref.current.src = selectedSongData.audio;

    audio1.play().then(() => {
      setIsPlaying(true);
      setLoopFade(audio1);
    }).catch((error) => {
      console.error("Erro ao reproduzir o áudio inicial:", error);
      setIsPlaying(false);
    });

  }, [selectedSong]);

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