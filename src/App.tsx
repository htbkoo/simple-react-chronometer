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

interface DateFormat {
    hours?: number;
    minutes?: number;
    seconds: number;
    milliseconds: number;
}

function padZero(input: string | number, maxLength: number): string {
    return input.toString().padStart(maxLength, "0");
}

function dateFormatToString({hours, minutes, seconds, milliseconds}: DateFormat): string {
    return [
        {value: hours},
        {value: minutes, maxLength: 2},
        {value: seconds, maxLength: 2},
        {value: milliseconds, maxLength: 3},
    ]
        .filter(element => typeof element.value !== "undefined")
        .map(({value, maxLength}) =>
            maxLength
                ? padZero(value, maxLength)
                : value.toString()
        )
        .join(" : ");
}

function Chronometer() {
    // const [appState, setAppState] = useState<ChronometerState>({app: {isCounting: false, count: 0}});
    // const [initialValue, setInitialValue] = useState(0);
    const [initialValue, setInitialValue] = useState(25 * 60 * 1000);
    const [count, setCount] = useState(initialValue);
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
                    setCount(initialValue);
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
    const minutes = Math.floor(count / 60 / 1000);
    const seconds = Math.floor(count / 1000) % 60;
    const milliseconds = count % 1000;
    return dateFormatToString({minutes, seconds, milliseconds})
}

export default App;
