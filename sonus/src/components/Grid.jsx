import Footer from "./Footer";


function Grid({songs, index, onSongClick, selectedSong, handlePlayPause}) {
    return (
        <section id="grade-sons">
            {songs.map(song => {               
                const songInfo = song.fields;

                const info = {

                    title: songInfo.titulo?.stringValue ?? "Titulo desconhecido",
                    category: songInfo.categoria?.stringValue ?? "Categoria desconhecida",
                    image: songInfo.url_capa?.stringValue ?? null,
                    id: song.name?.split('/').pop() ?? null
                }


                return (
                    <article key={info.id} className="card" onClick={() => onSongClick(song)}>
                        <img 
                        src={info.image} 
                        alt={`Capa de ${info.title}`} className="card-capa" />

                        <div className="info">
                            <h3>{info.title}</h3>
                            <span>{info.category}</span>
                        </div>
                    </article>
                )
        })}
        </section>
    );
};

export default Grid