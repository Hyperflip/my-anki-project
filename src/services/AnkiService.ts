import axios, { AxiosResponse } from 'axios';
import { AnkiCardDto } from "../model/dto/AnkiCardDto";
import memoize from "memoizee";
import { useContext } from "react";
import { ServiceContext } from "../index";
import { AnkiDbService } from "./AnkiDbService";


export class AnkiService {
    private url: string = process.env.REACT_APP_ANKICONNECT_URL!;
    private version: number = 6;

    private ankiDbService: AnkiDbService;

    constructor(ankiDbService: AnkiDbService) {
        this.ankiDbService = ankiDbService;
    }

    public getDeckNames = async () => {
        // TODO REMOVE AFTER TESTING
        return {result: this.ankiDbService.executeQuery("")};
        try {
            const response = await axios.post(this.url, {
                action: "deckNames",
                version: this.version
            });
            return response.data;
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
            return (await this.memoizedFetchCardsByDeckName(deckName) as AxiosResponse).data;
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

    private getCardsInfo = async (cardIds: number[]) => {
        try {
            return (await this.memoizedFetchCardsInfo(cardIds) as AxiosResponse).data;
        } catch (error) {
            console.error(`Error fetching cards info: ${error}`);
        }
    };
}
