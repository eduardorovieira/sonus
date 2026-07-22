import {useState, useRef} from 'react';

const Footer = () => {
    const [songName, setSongName] = useState('');
    const [footerVisible, setFooterVisible] = useState(false);
    const audio1Ref = useRef(null);
    const audio2Ref = useRef(null);


  return (
    <footer className="oculto">
      <button className="play-button" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="35px" fill="">
          <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
        </svg>
      </button>
      <audio ref={audio1Ref} src="" controls preload="auto"></audio>
      <audio ref={audio2Ref} src="" controls preload="auto"></audio>
      <p className="nome-som">{songName}</p>
    </footer>
  )
}

export default Footer
