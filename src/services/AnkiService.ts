import axios from 'axios';
import { AnkiCardDto } from "../model/dto/AnkiCardDto";

const url: string = "http://localhost:8765";
const version: number = 6;

export const getDeckNames = async () => {
    try {
        const response = await axios.post(url, {
            action: "deckNames",
            version
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching deck names: ${error}`);
        throw error;
    }
};

export const getCardsByDeckName = async (deckName: string) => {
    try {
        const response = await axios.post(url, {
            action: "findCards",
            version,
            params: {
                query: `deck:${deckName}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching cards by deck name: ${deckName}`);
    }
};

export const getCardsInfo = async (cardIds: number[]) => {
    try {
        const response = await axios.post(url, {
            action: "cardsInfo",
            version,
            params: {
                cards: cardIds
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching cards info: ${error}`);
    }
};
