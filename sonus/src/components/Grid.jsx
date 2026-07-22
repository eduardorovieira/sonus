
function Grid({songs}) {
    return (
        <section id="grade-sons">
            {songs.map(song => (                
                <h1>{song.fields.titulo.stringValue}</h1>
            ))}
        </section>
    );
};

export default Grid