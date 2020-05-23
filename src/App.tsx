import React, {useState} from 'react';
import './App.css';

function App() {
    return (
        <div className="App">
            <Chronometer />
        </div>
    );
}

interface ChronometerState {
    app: {
        isCounting: boolean,
        count: number,
    }
}

const INTERVAL = 10;

function Chronometer() {
    // const [appState, setAppState] = useState<ChronometerState>({app: {isCounting: false, count: 0}});
    const [count, setCount] = useState(0);
    const [counterId, setCounterId] = useState<NodeJS.Timeout | undefined>(undefined);

    return (
        <div>
            <div>
                {formatCount(count)}
            </div>

            <div>
                <button onClick={() => {
                    if (!counterId) {
                        setCounterId(
                            setInterval(() => {
                                setCount(prevCount => prevCount + 10);
                            }, INTERVAL)
                        );
                    }
                }}>
                    Start
                </button>
                <button onClick={() => {
                    if (counterId) {
                        clearInterval(counterId);
                    }
                    setCounterId(undefined);
                }}>
                    Stop
                </button>
                <button onClick={() => {
                    setCount(0);
                }}>
                    Reset
                </button>
            </div>
        </div>
    )
}

function formatCount(count: number): string {

    const seconds = (Math.floor(count / 1000)).toString().padStart(2, "0");
    const milliseconds = (count % 1000).toString().padStart(3, "0");
    return `${seconds}:${milliseconds}`;
}

export default App;
