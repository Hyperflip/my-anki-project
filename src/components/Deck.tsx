import { useEffect, useState } from "react";
import Loading from "./Loading";
import * as AnkiService from "../services/AnkiService";
import { AnkiCardDto } from "../model/dto/AnkiCardDto";
import AnkiCard from "./AnkiCard";
import VocabWrapper from "./VocabWrapper";

export default function Deck({ deckName }: { deckName: string | null }) {
    const [cards, setCards]: [AnkiCardDto[], any] = useState([]);
    const [selectedVocab, setSelectedVocab]: [string | null, any] = useState(null);

    useEffect(() => {
        if (deckName === null) { return; }

        async function startFetching(deckName: string) {
            // fetch card ids
            const cardIds: number[] = (await AnkiService.getCardsByDeckName(deckName) as any).result;

            // fetch card infos
            const response = await AnkiService.getCardsInfo(cardIds);
            setCards(response.result as AnkiCardDto);
        }
        startFetching(deckName);

        // cleanup fn
        return () => { return; };
    }, [deckName]);

    function handleSelectVocab(vocab: string) {
        setSelectedVocab(vocab);
    }

    if (selectedVocab !== null) {
        return (
            <VocabWrapper vocab={selectedVocab}/>
        );
    } else {
        return (
            <div>
                <h2>Deck: {deckName}</h2>

                {cards.length === 0 && <Loading/>}

                {
                    cards.map((card, index) =>
                        <AnkiCard key={index} card={card} handleSelectVocab={handleSelectVocab}/>
                    )
                }
            </div>
        );
    }
}