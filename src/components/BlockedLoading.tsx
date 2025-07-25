import CircularProgressWithLabel from "./CircularProgressWithLabel";

export default function BlockedLoading() {
    return (
        <div style={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(1, 0, 0, 0.3",
            zIndex: 999,
        }}>
            <CircularProgressWithLabel value={100}/>
        </div>
);
}