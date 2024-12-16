import { useEffect, useState } from 'react';
import { Timer } from '../types/types';
import { formatTime } from '../utils/helpers';

interface CompletedWorkout {
    date: string;
    timers: Timer[];
}

const HistoryView = () => {
    const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        setWorkouts(history);
    }, []);

    return (
        <div>
            <h2>Workout History</h2>
            {workouts.length === 0 ? (
                <p>No completed workouts yet.</p>
            ) : (
                <ul>
                    {workouts.map((workout, index) => (
                        <li key={index}>
                            <div>Date: {new Date(workout.date).toLocaleString()}</div>
                            <div>
                                <h3>Timers:</h3>
                                <ul>
                                    {workout.timers.map((timer, timerIndex) => (
                                        <li key={timerIndex}>
                                            <div>Type: {timer.type}</div>
                                            <div>
                                                Config: {JSON.stringify(timer.config)}
                                            </div>
                                            <div>Time Left: {formatTime(timer.timeLeft)}</div>
                                            <div>Description: {timer.description}</div>
                                            <div>State: {timer.state}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HistoryView;
