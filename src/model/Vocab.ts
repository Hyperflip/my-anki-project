import { KanaKanji } from "./KanaKanji";

export interface Vocab {
    deckIndex: number;
    text: string;
    characterCount: number;
    kanaKanji?: KanaKanji[];
}