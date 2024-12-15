import type { Timer } from "../types/types";

export const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const centiseconds = Math.floor((milliseconds % 1000) / 10);

    return `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};

export const encodeTimers = (timers: Timer[]): string => {
    return encodeURIComponent(JSON.stringify(timers));
};

export const decodeTimers = (encoded: string): Timer[] => {
    try {
        return JSON.parse(decodeURIComponent(encoded));
    } catch (error) {
        console.error('Failed to decode timers:', error);
        return [];
    }
};


export const calculateTotalTime = (timers: Timer[]): number => {
    return timers.reduce((total, timer) => {
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
    }, 0);
};