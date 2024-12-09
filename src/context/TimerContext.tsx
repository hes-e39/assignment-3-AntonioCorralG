import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Timer, TimerContextType } from '../types/types';
import { decodeTimers, encodeTimers } from '../utils/helpers';

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'workoutTimerState';

export const TimerProvider = ({ children }: { children: any }) => {
    const [timers, setTimers] = useState<Timer[]>([]);
    const [currentTimerIndex, setCurrentTimerIndex] = useState(0);
    const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();


    // check for saved state
    useEffect(() => {
        // Load if params present
        const encodedTimers = searchParams.get('timers');
        if (encodedTimers) {
            setTimers(decodeTimers(encodedTimers));
            return;
        }

        const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedState) {
            try {
                const { timers, currentTimerIndex, isWorkoutRunning } = JSON.parse(savedState);
                setTimers(timers);
                setCurrentTimerIndex(currentTimerIndex);
                setIsWorkoutRunning(isWorkoutRunning);
            } catch (error) {
                console.error('Unable to retreieve saved state. :-/', error);
            }
        }
    }, [searchParams]);

    // Save state to local storage on changes
    useEffect(() => {
        const saveState = () => {
            const state = {
                timers,
                currentTimerIndex,
                isWorkoutRunning,
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
        };

        const timeoutId = setTimeout(saveState, 1000);
        return () => clearTimeout(timeoutId);
    }, [timers, currentTimerIndex, isWorkoutRunning]);

    const savingTimerURLS = () => {
        setSearchParams({ timers: encodeTimers(timers) });
    };

    const addTimer = (timer: Timer) => {
        setTimers(prevTimers => [...prevTimers, timer]);
    };

    const removeTimer = (id: string) => {
        const updatedTimers = timers.filter(timer => timer.id !== id);
        setTimers(updatedTimers);
        if (currentTimerIndex >= updatedTimers.length) {
            setCurrentTimerIndex(Math.max(0, currentTimerIndex - 1));
        }
    };
    const startWorkout = () => {
        setIsWorkoutRunning(true);
        if (timers.length > 0) {
            setTimers(prevTimers => prevTimers.map((timer, index) => (index === currentTimerIndex ? { ...timer, state: 'running' } : timer)));
        }
    };

    const pauseWorkout = () => {
        setIsWorkoutRunning(false);
        setTimers(prevTimers => prevTimers.map(timer => (timer.state === 'running' ? { ...timer, state: 'notRunning' } : timer)));
    };

    const resetWorkout = () => {
        setCurrentTimerIndex(0);
        setIsWorkoutRunning(false);
        setTimers(prevTimers =>
            prevTimers.map(timer => ({
                ...timer,
                state: 'notRunning',
                timeLeft: timer.type === 'stopwatch' ? 0 : timer.config.initialTime || 0,
                currentRound: timer.type === 'xy' ? timer.config.numberOfRounds : undefined,
            })),
        );
    };

    const fastForward = () => {
        nextTimer();
    };

    const updateTimerState = (id: string, state: 'running' | 'notRunning' | 'completed') => {
        setTimers(prevTimers => prevTimers.map(timer => (timer.id === id ? { ...timer, state } : timer)));
    };

    const updateTimerTimeLeft = (id: string, timeLeft: number) => {
        setTimers(prevTimers => prevTimers.map(timer => (timer.id === id ? { ...timer, timeLeft } : timer)));
    };

    const nextTimer = () => {
        const nextIndex = currentTimerIndex + 1;
        if (nextIndex < timers.length) {
            setCurrentTimerIndex(nextIndex);
            setIsWorkoutRunning(true);
            setTimers(prevTimers => prevTimers.map((timer, index) => (index === nextIndex ? { ...timer, state: 'running' } : timer)));
        } else {
            setCurrentTimerIndex(0);
            setIsWorkoutRunning(false);
        }
    };

    return (
        <TimerContext.Provider
            value={{ timers, currentTimerIndex, isWorkoutRunning, addTimer, removeTimer, startWorkout, pauseWorkout, resetWorkout, fastForward, updateTimerState, updateTimerTimeLeft, nextTimer, savingTimerURLS }}
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
