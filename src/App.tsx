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
import { AnkiDbService } from "./services/AnkiDbService";
import { AnkiDesktopService } from "./services/AnkiDesktopService";
import BlockedLoading from "./components/BlockedLoading";

export const KeydownContext = React.createContext({});

function App(this: any) {
    const [key, setKey] = useState("");
    const [doReload, setDoReload]: [boolean, any] = useState(false);
    const [selectedDeckName, setSelectedDeckName]: [string | null, any] = useState(null);
    const {ankiService, kanjiService} = useContext(ServiceContext) as any;
    const [isLoading, setIslLoading] = useState(0);

    useEffect(() => {
        const fetchKanjiSvgs = async () => {
            setIslLoading(isLoading + 1);
            await kanjiService.initialize();
            setIslLoading(isLoading - 1);
        };
        fetchKanjiSvgs();
    }, []);

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
        await (ankiService as AnkiDbService).initialize(blob);
        setDoReload(true);
    }

    function isElectronEnv(): boolean {
        return ankiService instanceof AnkiDesktopService;
    }

    const NoDeckSelected = <>

        { isLoading > 0 && <BlockedLoading/> }
        <Dashboard/>

        {
            isElectronEnv() ?
                <>
                    <h3>Load from Anki Desktop</h3>
                    <div>
                        <ButtonPrimary text="Load Anki" onClick={() => handleDoReload(true)}/>
                        {doReload && <Loading/>}
                    </div>
                </> :
                <>
                    <h3>Load from Google Drive</h3>
                    <div>
                        <GoogleDriveHandler handleFilePicked={handleFilePicked}/>
                    </div>
                </>
        }
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
