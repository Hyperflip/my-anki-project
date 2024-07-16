import { useEffect, useState } from "react";

export default function DeckCards({ deckName }: { deckName: string | null }) {
    const [cardIds, setCardIds]: [number[], any] = useState([]);

    useEffect(() => {
        if (deckName === null) { return; }
        console.log(`Fetching card id's for deck name ${deckName}`);

        // cleanup fn
        return () => { return; };
    }, [deckName]);

    return (
        <div>
            <p>
                Cards from {deckName ? deckName : "none"}
            </p>
        </div>
    );
}