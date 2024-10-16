import { KanaKanji } from "../model/KanaKanji";
import './KanaKanjiViewer.css';
import { ReactNode, useEffect, useState } from "react";

export default function KanaKanjiViewer({ kanaKanji }: { kanaKanji: KanaKanji }) {
    const [svgString, setSvgString] = useState<string>(kanaKanji.svg);
    const svg: ReactNode = <svg className={"kanaKanji-wrapper"}
                         dangerouslySetInnerHTML={{__html: svgString}}></svg>;

    function getColor(){
        return `hsl(${230 + 15 * Math.random()},
            ${80 + 15 * Math.random()}%,
            ${20 + 35 * Math.random()}%)`;
    }

    useEffect(() => {

        const parser = new DOMParser();
        const tempSvg = parser.parseFromString(svgString, "text/html");

        // remove weird characters
        tempSvg.body.firstChild!.remove();
        const svg = tempSvg.body.firstChild! as SVGSVGElement;
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");

        const strokeNumberGroup = tempSvg.getElementById(`kvg:StrokeNumbers_${kanaKanji.hexCode}`)!;

        if (!kanaKanji.isKanji) {
            strokeNumberGroup.style.visibility = "hidden";
        }

        for (let i = 0; i < strokeNumberGroup.children.length; i++) {
            const color = kanaKanji.isKanji ? getColor() : "hsl(0, 0%, 20%)";

            const strokePath = tempSvg.getElementById(`kvg:${kanaKanji.hexCode}-s${i+1}`)!;

            strokePath.style.stroke = color;
            (strokeNumberGroup.children[i] as SVGTextElement).style.stroke = color;
        }

        setSvgString(tempSvg.body.innerHTML);
    }, [kanaKanji.svg]);

    return (
        <span className={"kanaKanji-wrapper"}>
            {svg}
        </span>
    );
}