import {useState, useRef, useEffect} from 'react';

import Footer from './components/Footer';
import Header from './components/Header';


const urlApi = "https://firestore.googleapis.com/v1/projects/sonus-openapi/databases/(default)/documents/playlist";
const htmlItems = {
    playButton: document.querySelector('.play-button'),
    audioName: document.querySelector('.nome-som'),
    footerElement: document.querySelector('footer'),
    imgFooter: document.querySelector('.capa-som'),
    darkModeButton: document.querySelector('#theme-button'),
    principalColorMeta: document.querySelector('#principal-color')
};


function App() {

//estado 
  const [songName, setSongName] = useState('');
  const [footerVisible, setFooterVisible] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [theme, setTheme] = useState('light');
      useEffect(() => {
        document.body.classList.toggle('dark', theme === 'dark');
      }, [theme]);

//referencias

  const playButtonRef = useRef(null);
  const metaTheeRef = useRef(null);
  const audio1Ref = useRef(null);
  const audio2Ref = useRef(null);


  return (  
    <div>
        <Header   theme={theme} setTheme={setTheme} />
        <Footer />
    </div>
  )
}

export default App
