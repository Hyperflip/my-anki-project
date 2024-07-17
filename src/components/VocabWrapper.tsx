import { useEffect, useState } from "react";
import * as KanjiService from "../services/KanjiService";
import { KanaKanji } from "../model/KanaKanji";
import { getKanaKanji } from "../services/KanjiService";
import Loading from "./Loading";
import KanaKanjiViewer from "./KanaKanjiViewer";

export default function VocabWrapper({ vocab }: { vocab: string }) {
    const [kanaKanji, setKanaKanji]: [KanaKanji[], any] = useState([]);

    useEffect(() => {
        const unicodes: string[] = KanjiService.getUnicodes(vocab);
        const kanjiIndices: number[] = KanjiService.getKanjiIndices(unicodes);

        async function startFetching(unicodes: string[], kanjiIndices: number[]) {
            const kanaKanji = await getKanaKanji(unicodes, kanjiIndices);
            setKanaKanji(kanaKanji);
        }
        startFetching(unicodes, kanjiIndices);

        return () => { return; };
    }, [vocab]);

    return (
        <div>
            {kanaKanji.length === 0 && <Loading/>}

            {
                kanaKanji.map((kanaKanji, index) =>
                    <KanaKanjiViewer key={index} kanaKanji={kanaKanji}/>
                )
            }
        </div>
    );
}