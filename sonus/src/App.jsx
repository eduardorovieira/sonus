import {useState, useRef, useEffect} from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Grid from './components/Grid';


function App() {
const urlApi = "https://firestore.googleapis.com/v1/projects/sonus-openapi/databases/(default)/documents/playlist";

//setar o tema
  const [theme, setTheme] = useState('light');
      useEffect(() => {
        document.body.classList.toggle('dark', theme === 'dark');
      }, [theme]);

  const [allSongs, setAllSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  function sortSongsByCategory (category) {
    if (category === "Todos") {
      setFilteredSongs (allSongs)
      return;
      
    }

    const filtered = allSongs.filter(song=> {
      const songCategory = song.fields.categoria?.stringValue;

      return songCategory?.toLowerCase() === category.toLowerCase();
    
    });

    setFilteredSongs(filtered);

  }

  useEffect (() => {

    async function fechSongs() {
      try {
        const response = await fetch(urlApi);
        const data = await response.json();

        if (data.documents) {
          setAllSongs(data.documents);
          console.log(data.documents);
          setFilteredSongs(data.documents);

        };
      }
        catch (error) {
          console.error(error);
        };
      }
        fechSongs ();
      }, []);

      function handleSongClick(song) {
        console.log(song)
      }
  //função utilizada pelo navbar para filtar os sons por categoria
  return (  
    <>
        <Header   theme={theme} setTheme={setTheme}  sortSongsByCategory={sortSongsByCategory} />
        <Grid songs={filteredSongs} onSongClick={handleSongClick}/>
        <Footer />
    </>
  )
  }

//manipulação do tema do projeto




export default App
