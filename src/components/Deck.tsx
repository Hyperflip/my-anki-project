import React, { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import * as AnkiService from "../services/AnkiService";
import { AnkiCardDto } from "../model/dto/AnkiCardDto";
import AnkiCard from "./AnkiCard";
import VocabWrapper from "./VocabWrapper";
import { Vocab } from "../model/Vocab";
import { Button, Checkbox, FormControlLabel, Stack } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { sanitizeAndClean } from "../services/AnkiCleaner";
import { shuffleArray } from "../services/UtilService";
import { KeydownContext } from "../App";

export default function Deck(this: any, { deckName }: { deckName: string | null }) {
    const {key, setKey} = useContext(KeydownContext) as any;
    const [cards, setCards]: [AnkiCardDto[], any] = useState([]);
    const [selectedVocab, setSelectedVocab]: [Vocab | null, any] = useState(null);
    const [shuffleCards, setShuffleCards] = useState<boolean>(true);

    const handleKeyDown = (key: string) => {
        if (key === "ArrowLeft") {
            handleSelectVocab(currentIndex() - 1);
        }
        if (key === "ArrowRight") {
            handleSelectVocab(currentIndex() + 1);
        }
        setKey("");
    };

    useEffect(() => {
        if (key.length > 0) {
            handleKeyDown(key);
        }
    }, [key]);

    useEffect(() => {
        if (deckName === null) { return; }

        async function startFetching(deckName: string) {
            // fetch card ids
            const cardIds: number[] = (await AnkiService.getCardsByDeckName(deckName) as any).result;

            // fetch card infos
            const response = await AnkiService.getCardsInfo(cardIds);
            const cards = response.result as AnkiCardDto[];

            if (shuffleCards) {
                shuffleArray(cards);
            }

            setCards(cards);
        }
        startFetching(deckName);

        // cleanup fn
        return () => { return; };
    }, [deckName, shuffleCards]);

    function handleSelectVocab(index: number, text?: string) {
        if (index === -1 || index === cards.length - 1) { return; }

        const finalText = !text ? sanitizeAndClean(cards[index].question) : text;

        const vocab: Vocab = {
            deckIndex: index,
            text: finalText,
            characterCount: finalText.length
        };
        setSelectedVocab(vocab);
    }

    function currentIndex(): number {
        return selectedVocab!["deckIndex"];
    }

    if (selectedVocab !== null) {
        return (
            <div>
                <AnkiCard key={currentIndex()} card={cards.at(currentIndex())!} disableSelection={true} />
                <VocabWrapper vocabDto={selectedVocab}/>

                <Stack direction={"row"} spacing={1}>
                    <Button startIcon={<ArrowBack/>} variant={"outlined"} onClick={() => handleSelectVocab(currentIndex() - 1)}/>
                    <Button name={"arrowRight"} autoFocus variant={"outlined"} startIcon={<ArrowForward/>} onClick={() => handleSelectVocab(currentIndex() + 1)}/>
                </Stack>
            </div>
        );
    } else {
        return (
            <div>
                <h2>Deck: {deckName}</h2>

                {cards.length === 0 && <Loading/>}

                <FormControlLabel label="Shuffle Cards" control={
                    <Checkbox color={"secondary"}
                              checked={shuffleCards}
                              onChange={() => setShuffleCards(!shuffleCards)}/>}
                />

                {
                    cards.map((card, index) =>
                        <AnkiCard key={index} deckIndex={index} card={card} handleSelectVocab={handleSelectVocab}/>
                    )
                }
            </div>
        );
    }
}