import { Button } from "@mui/material";

export default function ButtonPrimary({ text, onClick }: { text: string, onClick: undefined | ((val: any) => void) }) {
    return (
        <Button variant={"contained"} onClick={onClick}>{text}</Button>
    );
}