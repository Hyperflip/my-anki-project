import { AnkiDbService } from "./AnkiDbService";
import { AnkiDesktopService } from "./AnkiDesktopService";


export class AnkiService {
    private isDesktop: boolean = false;
    private ankiDesktopService: AnkiDesktopService | undefined;
    private ankiDbService: AnkiDbService | undefined;

    constructor(isDesktop: boolean, ankiDesktopService: AnkiDesktopService, ankiDbService: AnkiDbService) {
        this.isDesktop = isDesktop;

        if (this.isDesktop) {
            this.ankiDesktopService = ankiDesktopService;
        } else {
            this.ankiDbService = ankiDbService;
        }
    }

    public getDeckNames = async (): Promise<string[]> => {
        return this.ankiDesktopService ? this.ankiDesktopService.getDeckNames() : this.ankiDbService!.getDeckNames();
    };


    public getCardsByDeckName = async (deckName: string) => {
        return this.ankiDesktopService ? this.ankiDesktopService.getCardsByDeckName(deckName) : this.ankiDbService!.getCardsByDeckName(deckName);
    };

    private getCardsInfo = async (cardIds: number[]) => {
        return this.ankiDesktopService ? this.ankiDesktopService.getCardsInfo(cardIds) : this.ankiDbService!.getCardsInfo(cardIds);
    };
}
