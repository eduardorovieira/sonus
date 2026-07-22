import {useState} from 'react';

function NavBar({sortSongsByCategory}) {
    const [activeCategory, setActiveCategory] = useState('Todos');
    function handleCategoryClick(category) {
        setActiveCategory(category);
        sortSongsByCategory(category);
    }
  return (
        <nav>
            <button type="button" className={activeCategory === 'Todos' ? 'active' : ''} onClick={() => handleCategoryClick('Todos')}>Todos</button>
            <button type="button" className={activeCategory === 'Foco' ? 'active' : ''} onClick={() => handleCategoryClick('Foco')}>Foco</button>
            <button type="button" className={activeCategory === 'Sono' ? 'active' : ''} onClick={() => handleCategoryClick('Sono')}>Sono</button>
            <button type="button" className={activeCategory === 'Inspirador' ? 'active' : ''} onClick={() => handleCategoryClick('Inspirador')}>Inspirador</button>
        </nav>
  )
}

export default NavBar;