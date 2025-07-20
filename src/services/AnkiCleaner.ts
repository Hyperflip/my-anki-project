import { sanitize } from "dompurify";

export const sanitizeAndClean = (inputString: string, removeKana: boolean = false): string => {
    const parser = new DOMParser();

    const sanitizedString = sanitize(inputString, {ADD_TAGS: ["ruby", "rb"], FORBID_TAGS: ["rt"], KEEP_CONTENT: false});

    const element = parser.parseFromString(sanitizedString, "text/html").body as HTMLElement;

    const text = element.innerText.replaceAll("\n", "");

    if (removeKana) {
        return text.replace(/[\u0250-\ue007]/g, '');
    } else {
        return text;
    }
};

export const removeBracketsContent = (text: string) => {
    text = text.replace(/\[.*?\]/g, "");
    return text.replace(/\s/g, "");
};