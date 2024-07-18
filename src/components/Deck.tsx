import { useEffect, useState } from "react";
import Loading from "./Loading";
import * as AnkiService from "../services/AnkiService";
import { AnkiCardDto } from "../model/dto/AnkiCardDto";
import AnkiCard from "./AnkiCard";
import VocabWrapper from "./VocabWrapper";
import { Vocab } from "../model/Vocab";
import { Button, capitalize, Stack } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { sanitizeAndClean } from "../services/AnkiCleaner";

export default function Deck({ deckName }: { deckName: string | null }) {
    const [cards, setCards]: [AnkiCardDto[], any] = useState([]);
    const [selectedVocab, setSelectedVocab]: [Vocab | null, any] = useState(null);

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

    function handleSelectVocab(index: number, text?: string) {
        const finalText = !text ? sanitizeAndClean(cards[index].question) : text;

        const vocab: Vocab = {
            deckIndex: index,
            text: finalText,
            characterCount: finalText.length
        };
        setSelectedVocab(vocab);
    }

    if (selectedVocab !== null) {
        return (
            <div>
                <VocabWrapper vocabDto={selectedVocab}/>

                <Stack direction={"row"} spacing={1}>
                    <Button variant={"outlined"} startIcon={<ArrowBack/>} onClick={() => handleSelectVocab(selectedVocab["deckIndex"] - 1)}/>
                    <Button variant={"outlined"} startIcon={<ArrowForward/>} onClick={() => handleSelectVocab(selectedVocab["deckIndex"] + 1)}/>
                </Stack>
            </div>
        );
    } else {
        return (
            <div>
                <h2>Deck: {deckName}</h2>

                {cards.length === 0 && <Loading/>}

                {
                    cards.map((card, index) =>
                        <AnkiCard key={index} deckIndex={index} card={card} handleSelectVocab={handleSelectVocab}/>
                    )
                }
            </div>
        );
    }
}