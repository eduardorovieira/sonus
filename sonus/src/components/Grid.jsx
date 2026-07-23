
function Grid({songs, index}) {
    return (
        <section id="grade-sons">
            {songs.map(song => {               
                const targets = song.fields;


                const titulo = targets.titulo?.stringValue ?? "Titulo desconhecido";
                const categoria = targets.categoria?.stringValue ?? "Categoria desconhecida";
                const capa = targets.url_capa?.stringValue ?? null;


                return (
                    <article key={index} className="card">
                        <img 
                        src={capa} 
                        alt={`Capa de ${titulo}`} className="card-capa" />

                        <div className="info">
                            <h3>{titulo}</h3>
                            <span>{categoria}</span>
                        </div>
                    </article>
                )
        })}
        </section>
    );
};

export default Grid