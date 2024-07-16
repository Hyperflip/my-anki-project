import React, { useState } from 'react';
import './App.css';
import './services/AnkiService';
import GenericButton from "./components/GenericButton";
import AnkiDecks from "./components/AnkiDecks";
import Loading from "./components/Loading";

function App() {
    const [doReload, setDoReload] = useState(false);
    const handleClick = () => {
        setDoReload(true);
    };

    return (
        <div>
            <header>
                <h2>
                    Hello World
                </h2>
            </header>

            <GenericButton text="Load Anki" onClick={handleClick}/>

            {doReload && <Loading />}
            <AnkiDecks doReload={doReload} setDoReload={setDoReload}/>

        </div>
    );
}

export default App;
