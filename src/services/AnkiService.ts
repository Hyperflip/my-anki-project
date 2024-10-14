import axios, { AxiosResponse } from 'axios';
import { AnkiCardDto } from "../model/dto/AnkiCardDto";
import memoize from "memoizee";

const url: string = process.env.REACT_APP_ANKICONNECT_URL!;
const version: number = 6;

const getDeckNames = async () => {
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

const memoizedFetchCardsByDeckName = memoize((deckName: string): Promise<AxiosResponse> => {
    return axios.post(url, {
        action: "findCards",
        version,
        params: {
            query: `deck:${deckName}`,
        }
    });
});

const getCardsByDeckName = async (deckName: string) => {
    try {
        return (await memoizedFetchCardsByDeckName(deckName) as AxiosResponse).data;
    } catch (error) {
        console.error(`Error fetching cards by deck name: ${deckName}`);
    }
};

const memoizedFetchCardsInfo = memoize((cardIds: number[]): Promise<AxiosResponse> => {
    return axios.post(url, {
        action: "cardsInfo",
        version,
        params: {
            cards: cardIds
        }
    });
});

const getCardsInfo = async (cardIds: number[]) => {
    try {
        return (await memoizedFetchCardsInfo(cardIds) as AxiosResponse).data;
    } catch (error) {
        console.error(`Error fetching cards info: ${error}`);
    }
};

export {
    getDeckNames,
    getCardsByDeckName,
    getCardsInfo
};
