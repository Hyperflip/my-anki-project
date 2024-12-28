import { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import KanaKanjiViewer from "./KanaKanjiViewer";
import "./VocabWrapper.css";
import { Vocab } from "../model/Vocab";
import { ServiceContext } from "../index";

export default function VocabWrapper({ vocabDto }: { vocabDto: Vocab }) {
    const [vocab, setVocab] = useState<Vocab | null>(null);
    const {kanjiService} = useContext(ServiceContext) as any;

    useEffect(() => {
        const vocab = vocabDto;
        const unicodes: string[] = kanjiService.getUnicodes(vocab.text);
        const kanjiIndices: number[] = kanjiService.getKanjiIndices(unicodes);
        const kanaIndices: number[] = kanjiService.getKanaIndices(unicodes);

        async function startFetching(unicodes: string[], kanjiIndices: number[]) {
            vocab.kanaKanji = await kanjiService.getKanaKanji(unicodes, kanjiIndices, kanaIndices);
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