import React from 'react'
import nebula from '../assets/nebula.png';
import NavBar from './NavBar';
import App from '../App';
import DarkModeIcon from '../icons/DarkModeIcon';
import LightModeIcon from '../icons/LightModeIcon';

import { useState, useEffect } from 'react';

function Header ({theme, setTheme}) {

    return (
        <header>
            <hgroup>
                <img src={nebula} alt="SONUS Logo" className="logo"/>
                <h1>SONUS</h1>
            </hgroup>
            <p>escolha o som de acordo com o seu momento</p>
            <div className="theme" id="theme">
                <button className="theme-button" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <DarkModeIcon/> : <LightModeIcon/>}</button>
            </div>
        </header>
    )

}

export default Header
