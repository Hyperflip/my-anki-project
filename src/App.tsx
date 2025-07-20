import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import './services/AnkiService';
import ButtonPrimary from "./components/ButtonPrimary";
import DeckSelection from "./components/DeckSelection";
import Loading from "./components/Loading";
import Deck from "./components/Deck";
import Dashboard from "./components/Dashboard";
import GoogleDriveHandler from "./components/GoogleDriveHandler";
import { ServiceContext } from "./index";

export const KeydownContext = React.createContext({});

function App(this: any) {
    const [key, setKey] = useState("");
    const [doReload, setDoReload]: [boolean, any] = useState(false);
    const [selectedDeckName, setSelectedDeckName]: [string | null, any] = useState(null);
    const {ankiDbService} = useContext(ServiceContext) as any;

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

    async function handleFilePicked(blob: any) {
        // init anki db service (with context?)
        await ankiDbService.initialize(blob);
        // await
        setDoReload(true);
    }

    const NoDeckSelected = <>
        <Dashboard/>
        <h3>Load from Anki Desktop</h3>
        <div>
            <ButtonPrimary text="Load Anki" onClick={() => handleDoReload(true)}/>
            {doReload && <Loading/>}
        </div>
        <h3>Load from Google Drive</h3>
        <div>
            <GoogleDriveHandler handleFilePicked={handleFilePicked}/>
        </div>
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
            <div id={"keydownContextContainer"} tabIndex={-1} onKeyDown={handleKeyDown}>
                {selectedDeckName == null ?
                    <>{NoDeckSelected}</> :
                    <>{DeckSelected}</>}
            </div>
        </KeydownContext.Provider>
    );
}

export default App;
