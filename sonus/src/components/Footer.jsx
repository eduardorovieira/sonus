import {useState, useRef} from 'react';
import Grid from './Grid';

function Footer ({selectedSong}) {

    const audio1Ref = useRef(null);
    const audio2Ref = useRef(null);

    const selectedSongData = {
        title: selectedSong?.fields?.titulo?.stringValue || "Nenhum som selecionado",
        image: selectedSong?.fields?.url_capa?.stringValue || null,
        audio1: selectedSong?.fields?.url_audio?.stringValue || null,
        audio2: selectedSong?.fields?.url_audio?.stringValue || null
    }

    function handlePlayPause() {
        audio1Ref.current.play();
    }

  return (
    <footer className={selectedSong ? "" : "oculto"}>
      <button className="play-button" type="button" style={{backgroundImage: `url(${selectedSongData.image})`}} onClick={handlePlayPause}>
        <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="35px" fill="">
          <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
        </svg>
      </button>
      <audio ref={audio1Ref} src={selectedSongData.audio1} controls preload="auto"></audio>
      <audio ref={audio2Ref} src={selectedSongData.audio2} controls preload="auto"></audio>
      <p className="nome-som">{selectedSongData.title}</p>
    </footer>

  )
}

export default Footer
