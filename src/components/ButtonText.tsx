import { Button } from "@mui/material";

export default function ButtonText({ text, onClick }: { text: string, onClick: undefined | ((val: any) => void) }) {
    return (
        <Button variant={"text"}
                color={"secondary"}
                size={"small"}
                onClick={onClick}>{text}</Button>
    );
}