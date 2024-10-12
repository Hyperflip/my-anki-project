import { useEffect, useState } from "react";
import * as KanjiService from "../services/KanjiService";
import { getKanaKanji } from "../services/KanjiService";
import Loading from "./Loading";
import KanaKanjiViewer from "./KanaKanjiViewer";
import "./VocabWrapper.css";
import { Vocab } from "../model/Vocab";

export default function VocabWrapper({ vocabDto }: { vocabDto: Vocab }) {
    const [vocab, setVocab] = useState<Vocab | null>(null);

    useEffect(() => {
        const vocab = vocabDto;
        const unicodes: string[] = KanjiService.getUnicodes(vocab.text);
        const kanjiIndices: number[] = KanjiService.getKanjiIndices(unicodes);
        const kanaIndices: number[] = KanjiService.getKanaIndices(unicodes);

        async function startFetching(unicodes: string[], kanjiIndices: number[]) {
            vocab.kanaKanji = await getKanaKanji(unicodes, kanjiIndices, kanaIndices);
            setVocab(vocab);
        }
        startFetching(unicodes, kanjiIndices);

        return () => { return; };
    }, [vocabDto]);

    function buildVocab(vocab: Vocab) {
        return vocab.kanaKanji?.map((kanaKanji, index) =>
            <KanaKanjiViewer key={`${index}${kanaKanji.hexCode}`} kanaKanji={kanaKanji}/>
        );
    }

    return (
        <div className={"wrapper"}>
            {
                !vocab?.kanaKanji ? <Loading/> : buildVocab(vocab)
            }
        </div>
    );
}