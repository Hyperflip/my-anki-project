import { KanaKanji } from "../model/KanaKanji";
import { PathService } from "./PathService";
import { BlobReader, TextReader, TextWriter, ZipReader } from "@zip.js/zip.js";


export class KanjiService {
    pathService: PathService;

    private kanjiPath: any;

    constructor(pathService: PathService) {
        this.pathService = pathService;
    }

    async initialize() {
        console.time('kanji fetch');
        await fetch(this.pathService.getResourcePath('/resources/kanji-svgs.json'))
            .then(async res => {
                this.kanjiPath = await res.json();
                console.timeEnd('kanji fetch');
            });
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
                svg: this.kanjiPath[unicodes[i]]
            });
        }
        return kanaKanji;
    };
}