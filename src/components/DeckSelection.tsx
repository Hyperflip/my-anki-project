import React, { useEffect, useState } from "react";
import * as AnkiService from "../services/AnkiService";
import './DeckSelection.css';
import ButtonText from "./ButtonText";

export default function DeckSelection({ doReload, handleDoReload, handleSelectDeckName }: { doReload: boolean, handleDoReload: (val: boolean) => void, handleSelectDeckName: (val: string) => void }) {
    const [deckNames, setDeckNames]: [string[], any] = useState([]);

    useEffect(() => {
        async function startFetching() {
            if (doReload) {
                if (deckNames.length > 0) {
                    setDeckNames([]);
                }
                const response = await AnkiService.getDeckNames();
                setDeckNames(response.result);
            }
            handleDoReload(false);
        }
        startFetching();
        // cleanup fn
        return () => { return; };
    }, [doReload]);

    return (
        <div className="anki-decks">
            {
                deckNames.map((name) =>
                    <li key={name} className={"deck-listing"}>
                        <ButtonText text={name} onClick={() => handleSelectDeckName(name)}/>
                    </li>
                )
            }
        </div>
    );
}