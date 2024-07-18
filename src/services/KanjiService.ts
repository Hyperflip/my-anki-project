import { KanaKanji } from "../model/KanaKanji";
import axios from "axios";

const url: string = "https://kanjivg.tagaini.net/kanjivg/kanji/";

export const isKanji = (hexCode: number): boolean => {
    return 0x4e00 < hexCode && hexCode <= 0x9fff;
};

export const isKana = (hexCode: number): boolean => {
    const isHiragana = 0x3040 < hexCode && hexCode <= 0x309f;
    const isKatakana = 0x30A0 < hexCode && hexCode <= 0x30ff;
    return isHiragana || isKatakana;
};

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
            return isKanji(hexCode) ? index : -1;
        })
        .filter(index => index !== -1);
};

export const getKanaIndices = (unicodes: string[]): number[] => {
    return unicodes
        .map((code, index) => {
            const hexCode = parseInt(code, 16);
            return isKana(hexCode) ? index : -1;
        })
        .filter(index => index !== -1);
};

export const getKanaKanji = async (unicodes: string[], kanjiIndices: number[], kanaIndices: number[]) => {
    const kanaKanji: KanaKanji[] = [];
    for (let i = 0; i < unicodes.length; i++) {
        const isKanji = kanjiIndices.includes(i);
        const isKana = kanaIndices.includes(i);
        if (!isKanji && !isKana) { continue; }

        const svgPath = (await axios.get(`${url}/${unicodes[i]}.svg`) as any).data;
        kanaKanji.push(<KanaKanji>{
            hexCode: unicodes[i],
            isKanji,
            isKana,
            svg: svgPath
        });
    }
    return kanaKanji;
};
