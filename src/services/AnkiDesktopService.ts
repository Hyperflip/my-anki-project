import axios, { AxiosResponse } from 'axios';
import memoize from "memoizee";
import { AnkiService } from "./AnkiService";


export class AnkiDesktopService implements AnkiService {
    private url: string = process.env.REACT_APP_ANKICONNECT_URL!;
    private version: number = 6;

    public getDeckNames = async () => {
        try {
            const response = await axios.post(this.url, {
                action: "deckNames",
                version: this.version
            });
            return response.data.result;
        } catch (error) {
            console.error(`Error fetching deck names: ${error}`);
            throw error;
        }
    };

    private memoizedFetchCardsByDeckName = memoize((deckName: string): Promise<AxiosResponse> => {
        return axios.post(this.url, {
            action: "findCards",
            version: this.version,
            params: {
                query: `deck:${deckName}`,
            }
        });
    });

    public getCardsByDeckName = async (deckName: string) => {
        try {
            return (await this.memoizedFetchCardsByDeckName(deckName) as AxiosResponse).data.result;
        } catch (error) {
            console.error(`Error fetching cards by deck name: ${deckName}`);
        }
    };

    private memoizedFetchCardsInfo = memoize((cardIds: number[]): Promise<AxiosResponse> => {
        return axios.post(this.url, {
            action: "cardsInfo",
            version: this.version,
            params: {
                cards: cardIds
            }
        });
    });

    public getCardsInfo = async (cardIds: number[]) => {
        try {
            return (await this.memoizedFetchCardsInfo(cardIds) as AxiosResponse).data.result;
        } catch (error) {
            console.error(`Error fetching cards info: ${error}`);
        }
    };
}
