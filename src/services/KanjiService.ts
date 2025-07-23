import { KanaKanji } from "../model/KanaKanji";
import { PathService } from "./PathService";
import { BlobReader, TextWriter, ZipReader } from "@zip.js/zip.js";


export class KanjiService {
    pathService: PathService;

    private kanjiPath: Map<string, string> = new Map<string, string>();

    constructor(pathService: PathService) {
        this.pathService = pathService;
    }

    async initialize() {
        const kanjiZipped: Blob = await fetch(this.pathService.getResourcePath('/resources/kanji.zip'))
            .then(async (res) => await res.blob());
        await this.unzipKanjiBlob(kanjiZipped);
        debugger;
    }

    private async unzipKanjiBlob(blob: any) {
        // Create a ZipReader instance
        const zipReader = new ZipReader(new BlobReader(blob));

        // Get the entries in the zip file
        const entries = await zipReader.getEntries();

        for (const entry of entries) {
            if (!entry.directory && entry.filename.endsWith('.svg')) {
                const svgPath: string = await entry.getData(new TextWriter());
                const unicode: string = entry.filename.split('/')[1].split('.')[0];
                this.kanjiPath.set(unicode, svgPath);
            }
        }

        // Close the ZipReader
        await zipReader.close();
    }

    isKanji = (hexCode: number): boolean => {
        return 0x4e00 < hexCode && hexCode <= 0x9fff;
    };

    isKana = (hexCode: number): boolean => {
        const isHiragana = 0x3040 < hexCode && hexCode <= 0x309f;
        const isKatakana = 0x30A0 < hexCode && hexCode <= 0x30ff;
        return isHiragana || isKatakana;
    };

    getUnicodes = (vocab: string): string[] => {
        const codes: string[] = [];
        for (let i = 0; i < vocab.length; i++) {
            const decimalCodePoint = vocab.codePointAt(i);
            const hexCodePoint = decimalCodePoint?.toString(16);
            codes.push(hexCodePoint!.padStart(5, "0"));
        }
        return codes;
    };

    getKanjiIndices = (unicodes: string[]): number[] => {
        return unicodes
            .map((code, index) => {
                const hexCode = parseInt(code, 16);
                return this.isKanji(hexCode) ? index : -1;
            })
            .filter(index => index !== -1);
    };

    getKanaIndices = (unicodes: string[]): number[] => {
        return unicodes
            .map((code, index) => {
                const hexCode = parseInt(code, 16);
                return this.isKana(hexCode) ? index : -1;
            })
            .filter(index => index !== -1);
    };

    getKanaKanji = async (unicodes: string[], kanjiIndices: number[], kanaIndices: number[]) => {
        const kanaKanji: KanaKanji[] = [];
        for (let i = 0; i < unicodes.length; i++) {
            const isKanji = kanjiIndices.includes(i);
            const isKana = kanaIndices.includes(i);
            if (!isKanji && !isKana) { continue; }

            kanaKanji.push(<KanaKanji>{
                hexCode: unicodes[i],
                isKanji,
                isKana,
                svg: this.kanjiPath.get(unicodes[i])
            });
        }
        return kanaKanji;
    };
}