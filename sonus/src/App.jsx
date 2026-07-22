import {useState, useRef, useEffect} from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import NavBar from './components/NavBar';


const urlApi = "https://firestore.googleapis.com/v1/projects/sonus-openapi/databases/(default)/documents/playlist";

function App() {

  //função utilizada pelo navbar para filtar os sons por categoria
  function sortSongsByCategory(category) {
    }
  }

//manipulação do tema do projeto
  const [theme, setTheme] = useState('light');
      useEffect(() => {
        document.body.classList.toggle('dark', theme === 'dark');
      }, [theme]);



  return (  
    <div>
        <Header   theme={theme} setTheme={setTheme} />
        <Footer />
    </div>
  )

export default App
