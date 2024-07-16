import axios from 'axios';

const url: string = "http://localhost:8765";
const version: number = 6;

export const getDeckNames = async () => {
    try {
        const response = await axios.post(url, {
            action: "deckNames",
            version
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching deck names: ${error}`);
        throw error;
    }
};
