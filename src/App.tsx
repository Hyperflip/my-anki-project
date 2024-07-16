import React, { useState } from 'react';
import './App.css';
import './services/AnkiService';
import GenericButton from "./components/GenericButton";
import AnkiDecks from "./components/AnkiDecks";
import Loading from "./components/Loading";
import DeckCards from "./components/DeckCards";
import Dashboard from "./components/Dashboard";

function App() {
    const [doReload, setDoReload]: [boolean, any] = useState(false);
    const [selectedDeckName, setSelectedDeckName]: [string | null, any] = useState(null);

    function handleDoReload(val: boolean) {
        setDoReload(val);
    }

    function handleSelectDeckName(deckName: string) {
        setSelectedDeckName(deckName);
    }

    if (selectedDeckName == null) {
        return (
            <div>
                <Dashboard/>

                <GenericButton text="Load Anki" onClick={() => handleDoReload(true)}/>

                {doReload && <Loading />}
                <AnkiDecks doReload={doReload}
                           handleDoReload={handleDoReload}
                           handleSelectDeckName={handleSelectDeckName}/>
            </div>
        );
    } else {
        return (
            <div>
                <Dashboard/>

                <DeckCards deckName={selectedDeckName}></DeckCards>
            </div>
        );
    }
}

export default App;
