import {useState, useRef, useEffect} from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Grid from './components/Grid';


function App() {
const urlApi = "https://firestore.googleapis.com/v1/projects/sonus-openapi/databases/(default)/documents/playlist";

//estados
  const [theme, setTheme] = useState('light');
  
  const [allSongs, setAllSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  
  function filterSongsByCategory (category) {
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

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect (() => {

    async function fetchSongs() {
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
        fetchSongs ();
      }, []);

      function handleSongClick(song) {
        setSelectedSong(song);
        
      }
  //função utilizada pelo navbar para filtar os sons por categoria
  return (  
    <>
        <Header   theme={theme} setTheme={setTheme}  filterSongsByCategory={filterSongsByCategory} />
        <Grid songs={filteredSongs} onSongClick={handleSongClick} />
        <Footer selectedSong={selectedSong} />
    </>
  )
  }




export default App
