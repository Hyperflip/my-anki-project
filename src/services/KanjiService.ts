import { KanaKanji } from "../model/KanaKanji";
import axios, { AxiosResponse } from "axios";
import memoize from "memoizee";

const url: string = "https://kanjivg.tagaini.net/kanjivg/kanji/";

const isKanji = (hexCode: number): boolean => {
    return 0x4e00 < hexCode && hexCode <= 0x9fff;
};

const isKana = (hexCode: number): boolean => {
    const isHiragana = 0x3040 < hexCode && hexCode <= 0x309f;
    const isKatakana = 0x30A0 < hexCode && hexCode <= 0x30ff;
    return isHiragana || isKatakana;
};

const getUnicodes = (vocab: string): string[] => {
    const codes: string[] = [];
    for (let i = 0; i < vocab.length; i++) {
        const decimalCodePoint = vocab.codePointAt(i);
        const hexCodePoint = decimalCodePoint?.toString(16);
        codes.push(hexCodePoint!.padStart(5, "0"));
    }
    return codes;
};

const getKanjiIndices = (unicodes: string[]): number[] => {
    return unicodes
        .map((code, index) => {
            const hexCode = parseInt(code, 16);
            return isKanji(hexCode) ? index : -1;
        })
        .filter(index => index !== -1);
};

const getKanaIndices = (unicodes: string[]): number[] => {
    return unicodes
        .map((code, index) => {
            const hexCode = parseInt(code, 16);
            return isKana(hexCode) ? index : -1;
        })
        .filter(index => index !== -1);
};

const getKanaKanji = async (unicodes: string[], kanjiIndices: number[], kanaIndices: number[]) => {
    const kanaKanji: KanaKanji[] = [];
    for (let i = 0; i < unicodes.length; i++) {
        const isKanji = kanjiIndices.includes(i);
        const isKana = kanaIndices.includes(i);
        if (!isKanji && !isKana) { continue; }

        const svgFilePath = `/resources/kanji/${unicodes[i]}.svg`;
        const svgPath = await fetch(svgFilePath)
            .then(res => res.text());
        kanaKanji.push(<KanaKanji>{
            hexCode: unicodes[i],
            isKanji,
            isKana,
            svg: svgPath
        });
    }
    return kanaKanji;
};

export {
    isKanji,
    isKana,
    getUnicodes,
    getKanjiIndices,
    getKanaIndices,
    getKanaKanji
};