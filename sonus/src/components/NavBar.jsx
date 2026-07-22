import { useState, useRef } from 'react';

function NavBar() {

    const handleCategoryClick = (category) => {
        filtrarSonsPorCategoria(category);
    }
  return (
    <div>
        <nav>
            <button type="button" className="active" onClick={() => handleCategoryClick('Todos')}>Todos</button>
            <button type="button" className="" onClick={() => handleCategoryClick('Foco')}>Foco</button>
            <button type="button" className="" onClick={() => handleCategoryClick('Sono')}>Sono</button>
            <button type="button" className="" onClick={() => handleCategoryClick('Inspirador')}>Inspirador</button>
        </nav>
    </div>
  )
}

export default NavBar