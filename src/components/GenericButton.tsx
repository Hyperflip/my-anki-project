export default function GenericButton({ text, onClick }: { text: string, onClick: undefined | (() => void) }) {
    return (
        <button onClick={onClick}>
            { text }
        </button>
    );
}