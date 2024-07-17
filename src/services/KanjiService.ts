import { KanaKanji } from "../model/KanaKanji";
import axios from "axios";

const url: string = "https://kanjivg.tagaini.net/kanjivg/kanji/";

export const getUnicodes = (vocab: string): string[] => {
    const codes: string[] = [];
    for (let i = 0; i < vocab.length; i++) {
        const decimalCodePoint = vocab.codePointAt(i);
        const hexCodePoint = decimalCodePoint?.toString(16);
        codes.push(hexCodePoint!.padStart(5, "0"));
    }
    return codes;
};

export const getKanjiIndices = (unicodes: string[]): number[] => {
    return unicodes
        .map((code, index) => {
            const hexCode = parseInt(code, 16);
            return 0x4e00 < hexCode && hexCode < 0x9fff ? index : -1;
        })
        .filter(index => index !== -1);
};

export const getKanaKanji = async (unicodes: string[], kanjiIndices: number[]) => {
    const kanaKanji: KanaKanji[] = [];
    for (let i = 0; i < unicodes.length; i++) {
        const svgPath = (await axios.get(`${url}/${unicodes[i]}.svg`) as any).data;
        kanaKanji.push(<KanaKanji>{
            hexCode: unicodes[i],
            isKanji: kanjiIndices.includes(i),
            svg: svgPath
        });
    }
    return kanaKanji;
};
