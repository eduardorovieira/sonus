import {useState} from 'react';

function NavBar({filterSongsByCategory}) {
    const [activeCategory, setActiveCategory] = useState('Todos');
    function handleCategoryClick(category) {
        setActiveCategory(category);
        filterSongsByCategory(category);
    }
    return (
            <nav>
                <button type="button" className={activeCategory === 'Todos' ? 'active' : null} onClick={() => handleCategoryClick('Todos')}>Todos</button>
                <button type="button" className={activeCategory === 'Foco' ? 'active' : null} onClick={() => handleCategoryClick('Foco')}>Foco</button>
                <button type="button" className={activeCategory === 'Sono' ? 'active' : null} onClick={() => handleCategoryClick('Sono')}>Sono</button>
                <button type="button" className={activeCategory === 'Inspirador' ? 'active' : null} onClick={() => handleCategoryClick('Inspirador')}>Inspirador</button>
            </nav>
    )
}

export default NavBar;