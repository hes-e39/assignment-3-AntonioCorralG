import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Timer, TimerContextType } from '../types/types';
import { decodeTimers, encodeTimers } from '../utils/helpers';

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'workoutTimerState';

const totalWorkoutTimeCalc = (timers: Timer[]): number => {
    return timers.reduce((total, timer) => {
        if (timer.state !== 'completed') { // Only include time for not completed timers
            switch (timer.type) {
                case "countdown":
                case "stopwatch":
                    return total + timer.config.hours * 3600000 + timer.config.minutes * 60000 + timer.config.seconds * 1000;
                case "xy":
                    return total + (timer.config.minutes * 60 + timer.config.seconds) * timer.config.numberOfRounds * 1000;
                case "tabata":
                    return total + (timer.config.workTime + timer.config.restTime) * timer.config.numberOfRounds * 1000;
                default:
                    return total;
            }
        }
        return total;
    }, 0);
};

export const TimerProvider = ({ children }: { children: ReactNode }) => {
    const [timers, setTimersState] = useState<Timer[]>([]);
    const [currentTimerIndex, setCurrentTimerIndex] = useState(0);
    const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);


    useEffect(() => {
        setTotalWorkoutTime(totalWorkoutTimeCalc(timers));
    }, [timers]);

    // check for saved state
    useEffect(() => {
        let didSetTimers = false;
        // Load if params present
        const encodedTimers = searchParams.get('timers');
        if (encodedTimers) {
            setTimersState(decodeTimers(encodedTimers));
            didSetTimers = true;
        }

        if (!didSetTimers) {
            const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedState) {
                try {
                    const { timers, currentTimerIndex, isWorkoutRunning, totalWorkoutTime } = JSON.parse(savedState);
                    setTimersState(timers);
                    setCurrentTimerIndex(currentTimerIndex);
                    setIsWorkoutRunning(isWorkoutRunning);
                    setTotalWorkoutTime(totalWorkoutTime);
                } catch (error) {
                    console.error('Unable to retreieve saved state. :-/', error);
                }
            }
        }
    }, [searchParams]);

    const saveState = () => {
        const state = {
            timers,
            currentTimerIndex,
            isWorkoutRunning,
            totalWorkoutTime,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    };

    useEffect(() => {
        const timeoutId = setTimeout(saveState, 1000);
        return () => clearTimeout(timeoutId);
    }, [timers, currentTimerIndex, isWorkoutRunning, totalWorkoutTime]);



    const fastForward = () => {
        setTimersState(prevTimers => {
            const updatedTimers: Timer[] = prevTimers.map((timer, index) => {
                if (index === currentTimerIndex) {
                    return { ...timer, state: 'completed', timeLeft: 0 };
                }
                return timer;
            });

            setTotalWorkoutTime(totalWorkoutTimeCalc(updatedTimers));

            return updatedTimers;
        });
        nextTimer();
    };

    const setTimers = (newTimers: Timer[]) => {
        setTimersState(newTimers);
    };

    const savingTimerURLS = (updatedTimers: Timer[] = timers) => {
        if (updatedTimers.length > 0) {
            const encodedTimers = encodeTimers(updatedTimers);
            if (encodedTimers !== searchParams.get('timers')) {
                setSearchParams({ timers: encodedTimers });
            }
        }
    };
    const addTimer = (timer: Timer) => {
        setTimersState(prevTimers => [...prevTimers, timer]);
    };

    const removeTimer = (id: string) => {
        const updatedTimers = timers.filter(timer => timer.id !== id);
        setTimersState(updatedTimers);
        if (currentTimerIndex >= updatedTimers.length) {
            setCurrentTimerIndex(Math.max(0, currentTimerIndex - 1));
        }
    };

    const startWorkout = () => {
        setIsWorkoutRunning(true);
        if (timers.length > 0) {
            setTimersState(prevTimers => prevTimers.map((timer, index) =>
                (index === currentTimerIndex ? { ...timer, state: 'running' } : timer)));
        }
    };

    const pauseWorkout = () => {
        setIsWorkoutRunning(false);
        setTimersState(prevTimers => prevTimers.map(timer =>
            (timer.state === 'running' ? { ...timer, state: 'notRunning' } : timer)));
    };

    const resetWorkout = () => {
        setCurrentTimerIndex(0);
        setIsWorkoutRunning(false);
        setTimersState(prevTimers =>
            prevTimers.map(timer => ({
                ...timer,
                state: 'notRunning',
                timeLeft: timer.type === 'stopwatch' ? 0 : timer.config.initialTime || 0,
                currentRound: timer.type === 'xy' ? timer.config.numberOfRounds : undefined,
            }))
        );
        setTotalWorkoutTime(totalWorkoutTimeCalc(timers));
    };

    const updateTimerState = (id: string, state: 'running' | 'notRunning' | 'completed') => {
        setTimersState(prevTimers => prevTimers.map(timer => (timer.id === id ? { ...timer, state } : timer)));
    };

    const updateTimerTimeLeft = (id: string, timeLeft: number) => {
        setTimersState(prevTimers => prevTimers.map(timer => (timer.id === id ? { ...timer, timeLeft } : timer)));
    };

    const nextTimer = () => {
        setTimersState(prevTimers => {
            const nextIndex = currentTimerIndex + 1;
            if (nextIndex < prevTimers.length) {
                setCurrentTimerIndex(nextIndex);
                setIsWorkoutRunning(true);
                return prevTimers.map((timer, index) => {
                    if (index === nextIndex) {
                        return { ...timer, state: 'running' };
                    }
                    return timer;
                });
            } else {
                setCurrentTimerIndex(0);
                setIsWorkoutRunning(false);
                return prevTimers;
            }
        });
    };

    const moveTimerUp = (id: string) => {
        setTimersState(prevTimers => {
            const currentIndex = prevTimers.findIndex(timer => timer.id === id);
            if (currentIndex > 0) {
                const updatedTimers = [...prevTimers];
                const temp = updatedTimers[currentIndex - 1];
                updatedTimers[currentIndex - 1] = updatedTimers[currentIndex];
                updatedTimers[currentIndex] = temp;
                savingTimerURLS(updatedTimers);
                return updatedTimers;
            }
            return prevTimers;
        });
    };

    const moveTimerDown = (id: string) => {
        setTimersState(prevTimers => {
            const currentIndex = prevTimers.findIndex(timer => timer.id === id);
            if (currentIndex < prevTimers.length - 1) {
                const updatedTimers = [...prevTimers];
                const temp = updatedTimers[currentIndex + 1];
                updatedTimers[currentIndex + 1] = updatedTimers[currentIndex];
                updatedTimers[currentIndex] = temp;
                savingTimerURLS(updatedTimers);
                return updatedTimers;
            }
            return prevTimers;
        });
    };

    return (
        <TimerContext.Provider
            value={{
                timers,
                currentTimerIndex,
                isWorkoutRunning,
                addTimer,
                removeTimer,
                startWorkout,
                pauseWorkout,
                resetWorkout,
                fastForward,
                updateTimerState,
                updateTimerTimeLeft,
                nextTimer,
                savingTimerURLS,
                setTimers,
                totalWorkoutTime,
                moveTimerUp,
                moveTimerDown
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export const useTimers = () => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimers must be used within a TimerProvider');
    }
    return context;
};
