import { Card, CardActions, CardContent, Typography } from "@mui/material";
import { AnkiCardDto } from "../model/dto/AnkiCardDto";
import * as AnkiCleaner from "../services/AnkiCleaner";
import './AnkiCard.css';
import ButtonText from "./ButtonText";

export default function AnkiCard({ card, deckIndex, handleSelectVocab }: { card: AnkiCardDto, deckIndex: number, handleSelectVocab: (deckIndex: number, text?: string) => void }) {
    const japaneseText = AnkiCleaner.sanitizeAndClean(card.question);
    const description = AnkiCleaner.sanitizeAndClean(card.answer, true);

    return (
        <div className={"anki-card"}>
            <Card sx={{ minWidth: 150, maxWidth: 250, width: "auto" }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        単語
                    </Typography>
                    <Typography variant="h5" component="div">
                        {japaneseText}
                    </Typography>
                    <Typography variant="body2">
                        {description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <ButtonText text={"Open Viewer"} onClick={() => handleSelectVocab(deckIndex, japaneseText)}/>
                </CardActions>
            </Card>
        </div>
    );
}