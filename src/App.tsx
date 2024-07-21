import React, { useState } from 'react';
import './App.css';
import './services/AnkiService';
import ButtonPrimary from "./components/ButtonPrimary";
import DeckSelection from "./components/DeckSelection";
import Loading from "./components/Loading";
import Deck from "./components/Deck";
import Dashboard from "./components/Dashboard";
import { NavigationContainer } from "@react-navigation/native";

function App() {
    const [doReload, setDoReload]: [boolean, any] = useState(false);
    const [selectedDeckName, setSelectedDeckName]: [string | null, any] = useState(null);

    function handleDoReload(val: boolean) {
        setDoReload(val);
    }

    function handleSelectDeckName(deckName: string) {
        setSelectedDeckName(deckName);
    }

    /*
    function DeckSelection() {
        return (
            <div>
                <ButtonPrimary text="Load Anki" onClick={() => handleDoReload(true)}/>

                {doReload && <Loading />}
                <DeckSelection doReload={doReload}
                               handleDoReload={handleDoReload}
                               handleSelectDeckName={handleSelectDeckName}/>
            </div>
        );
    }

    return (
        <div>
            <Dashboard/>

            <NavigationContainer>

            </NavigationContainer>
        </div>
    );
    */

    if (selectedDeckName == null) {
        return (
            <div>
                <Dashboard/>

                <ButtonPrimary text="Load Anki" onClick={() => handleDoReload(true)}/>

                {doReload && <Loading />}
                <DeckSelection doReload={doReload}
                               handleDoReload={handleDoReload}
                               handleSelectDeckName={handleSelectDeckName}/>
            </div>
        );
    } else {
        return (
            <div>
                <Dashboard/>

                <Deck deckName={selectedDeckName}/>
            </div>
        );
    }
}

export default App;
