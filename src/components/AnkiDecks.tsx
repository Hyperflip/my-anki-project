import React, { useEffect, useState } from "react";
import * as AnkiService from "../services/AnkiService";
import GenericButton from "./GenericButton";

export default function AnkiDecks({ doReload, setDoReload }: { doReload: boolean, setDoReload: (val: boolean) => void }) {
    const [deckNames, setDeckNames] = useState([]);

    useEffect(() => {
        async function startFetching() {
            if (doReload) {
                if (deckNames.length > 0) {
                    setDeckNames([]);
                }
                const response = await AnkiService.getDeckNames();
                await new Promise(r => setTimeout(r, 2000));
                setDeckNames(response.result);
            }
            setDoReload(false);
        }
        startFetching();
        return;
    }, [doReload]);

    return (
        <div>
            {
                deckNames.map((name, index) =>
                    <li key={index}>
                        <GenericButton text={name} onClick={undefined}/>
                    </li>
                )
            }
        </div>
    );
}