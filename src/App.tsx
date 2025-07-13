import React, { useEffect, useState } from 'react';
import './App.css';
import './services/AnkiService';
import ButtonPrimary from "./components/ButtonPrimary";
import DeckSelection from "./components/DeckSelection";
import Loading from "./components/Loading";
import Deck from "./components/Deck";
import Dashboard from "./components/Dashboard";

export const KeydownContext = React.createContext({});

function App(this: any) {
    const [key, setKey] = useState("");
    const [doReload, setDoReload]: [boolean, any] = useState(false);
    const [selectedDeckName, setSelectedDeckName]: [string | null, any] = useState(null);

    useEffect(() => {
        console.log(selectedDeckName);
    }, [selectedDeckName]);

    function handleKeyDown(event: any) {
        setKey(event.key);
    }

    function handleDoReload(val: boolean) {
        setDoReload(val);
    }

    function handleSelectDeckName(deckName: string) {
        setSelectedDeckName(deckName);
    }

    const NoDeckSelected = <>
    <Dashboard/>
    <ButtonPrimary text="Load Anki" onClick={() => handleDoReload(true)}/>
    {doReload && <Loading/>}
    <DeckSelection doReload={doReload}
                   handleDoReload={handleDoReload}
                   handleSelectDeckName={handleSelectDeckName}/>
    </>;

    const DeckSelected = <>
        <Dashboard />
        <Deck deckName={selectedDeckName}/>
    </>;

    return (
        <KeydownContext.Provider value={{key: key, setKey: setKey}}>
            <div id={"keydownContextContainer"} tabIndex={-1} style={{outline: "none"}} onKeyDown={handleKeyDown}>
                {selectedDeckName == null ?
                    <>{NoDeckSelected}</> :
                    <>{DeckSelected}</>}
            </div>
        </KeydownContext.Provider>
    );
}

export default App;
