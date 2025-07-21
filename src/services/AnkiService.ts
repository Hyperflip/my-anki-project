import { AnkiCardDto } from "../model/dto/AnkiCardDto";


export abstract class AnkiService {
    public abstract getDeckNames(): Promise<string[]>

    public abstract getCardsByDeckName(deckName: string): Promise<number[]>

    public abstract getCardsInfo(cardIds: number[]): Promise<AnkiCardDto[]>;
}
