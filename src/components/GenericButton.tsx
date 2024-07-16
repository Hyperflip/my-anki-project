export default function GenericButton({ text, onClick }: { text: string, onClick: undefined | ((val: any) => void) }) {
    return (
        <button onClick={onClick}>
            { text }
        </button>
    );
}