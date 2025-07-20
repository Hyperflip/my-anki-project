import { BlobReader, BlobWriter, FileEntry, ZipReader } from "@zip.js/zip.js";
import { PathService } from "./PathService";
import * as initSqlJs from "sql.js";
import {ZstdInit, ZstdDec} from "@oneidentity/zstd-js/wasm/decompress";
import { AnkiCardDto } from "../model/dto/AnkiCardDto";
import * as AnkiCleaner from "./AnkiCleaner";

export class AnkiDbService {

    private pathService: PathService;

    private db: any;

    constructor(pathService: PathService) {
        this.pathService = pathService;
    }

    public async initialize(blob: Blob) {
        const sqlWasmPath = this.pathService.getResourcePath("/resources/sql-wasm.wasm");
        const sqlWasm = await fetch(sqlWasmPath);
        const SQL = await initSqlJs({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: () => sqlWasm.url
        });
        // init sql
        // unzip & decompress anki collection
        const anki21bCollection: Blob = (await this.unzipAnki21bCollection(blob))!;
        const ankiDbData = await this.decompressAnkiCollection(anki21bCollection);
        // read db
        const db = new SQL.Database(ankiDbData);
        this.db = db;
    }

    public getDeckNames(): any {
        const result = this.db.exec("SELECT name FROM decks");
        const values = result[0]["values"];
        const deckNames: string[] = values.map((val: any) => val[0]);
        return Promise.resolve({ result: deckNames });
    }

    public getCardsByDeckName(deckName: string): any {
        const result = this.db.exec(`SELECT c.id FROM decks d JOIN cards c ON c.did = d.id WHERE d.name = '${deckName}' COLLATE NOCASE`);
        const values = result[0]["values"];
        const cardIds: number[] = values.map((val: any) => val[0]);
        return Promise.resolve({ result: cardIds });
    }

    public getCardsInfo(cardIds: number[]) {
        const placeholders = cardIds.map(() => '?').join(', ');
        const stmt = this.db.prepare(`SELECT c.id, d.name, n.flds FROM cards c JOIN notes n on n.id = c.nid JOIN decks d on d.id = c.did WHERE c.id in (${placeholders})`);
        stmt.bind(cardIds);
        const result: AnkiCardDto[] = [];
        while (stmt.step()) {
            const res = stmt.getAsObject();
            const card: AnkiCardDto = {
                cardId: res.id,
                deckName: res.name,
                question: AnkiCleaner.removeBracketsContent(res.flds.split('\u001f')[0]),
                answer: res.flds.split('\u001f')[1],
                css: ''
            };
            result.push(card);
        }
        return { result: result };
    }

    private async unzipAnki21bCollection(blob: any): Promise<Blob | undefined> {
        // Create a ZipReader instance
        const zipReader = new ZipReader(new BlobReader(blob));

        // Get the entries in the zip file
        const entries = await zipReader.getEntries();

        for (const entry of entries) {
            if (!entry.directory) {
                // Extract file content as text
                if (entry.filename === 'collection.anki21b') {
                    return await entry.getData(new BlobWriter());
                }
            }
        }

        // Close the ZipReader
        await zipReader.close();
    }

    private async decompressAnkiCollection(coll: Blob) {
        const {ZstdSimple, ZstdStream} = await ZstdInit();
        const uint8Array = new Uint8Array(await coll.arrayBuffer());
        return ZstdStream.decompress(uint8Array);
    }

}