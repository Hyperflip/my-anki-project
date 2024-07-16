import { Card, CardActions, CardContent, Typography } from "@mui/material";
import { AnkiCardDto } from "../model/dto/AnkiCardDto";
import * as AnkiCleaner from "../services/AnkiCleaner";
import './AnkiCard.css';

export default function AnkiCard({ card }: { card: AnkiCardDto }) {
    const questionText = AnkiCleaner.sanitizeAndClean(card.question);
    const answerText = AnkiCleaner.sanitizeAndClean(card.answer, true);

    return (
        <div className={"anki-card"}>
            <Card sx={{ minWidth: 150, maxWidth: 250, width: "auto" }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        単語
                    </Typography>
                    <Typography variant="h5" component="div">
                        {questionText}
                    </Typography>
                    <Typography variant="body2">
                        {answerText}
                    </Typography>
                </CardContent>
                <CardActions>

                </CardActions>
            </Card>
        </div>
    );
}