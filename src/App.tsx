import React, {useEffect, useState} from 'react';
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

    useEffect(cleanUpCounterOnUnmount, [counterId]);

    return (
        <div>
            <div>
                {formatCount(count)}
            </div>

            <div>
                <button
                    onClick={() => {
                        if (!counterId) {
                            setCounterId(
                                setInterval(() => {
                                    setCount(prevCount => prevCount + INTERVAL);
                                }, INTERVAL)
                            );
                        }
                    }}
                    disabled={!!counterId}
                >
                    Count up
                </button>
                <button
                    onClick={() => {
                        if (!counterId && count >= INTERVAL) {
                            setCounterId(
                                setInterval(() => {
                                    setCount(prevCount => {
                                        if (prevCount >= INTERVAL) {
                                            return prevCount - INTERVAL
                                        } else {
                                            stopCounter();
                                            setCounterId(undefined);
                                            return 0;
                                        }
                                    });
                                }, INTERVAL)
                            );
                        }
                    }}
                    disabled={!!counterId}
                >
                    Count down
                </button>
                <button
                    onClick={() => {
                        stopCounter();
                        setCounterId(undefined);
                    }}
                    disabled={!counterId}
                >
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

    function cleanUpCounterOnUnmount() {
        // clearInterval on unmount to avoid memory leak
        return stopCounter;
    }

    function stopCounter() {
        if (counterId) {
            clearInterval(counterId);
        }
    }
}

export function formatCount(count: number): string {

    const seconds = (Math.floor(count / 1000)).toString().padStart(2, "0");
    const milliseconds = (count % 1000).toString().padStart(3, "0");
    return `${seconds}:${milliseconds}`;
}

export default App;
