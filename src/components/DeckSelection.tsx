import React, { useContext, useEffect, useState } from "react";
import './DeckSelection.css';
import ButtonText from "./ButtonText";
import { ServiceContext } from "../index";

export default function DeckSelection({ doReload, handleDoReload, handleSelectDeckName }: { doReload: boolean, handleDoReload: (val: boolean) => void, handleSelectDeckName: (val: string) => void }) {
    const [deckNames, setDeckNames]: [string[], any] = useState([]);
    const {ankiService} = useContext(ServiceContext) as any;

    useEffect(() => {
        async function startFetching() {
            if (doReload) {
                if (deckNames.length > 0) {
                    setDeckNames([]);
                }
                const response = await ankiService.getDeckNames();
                setDeckNames(response);
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