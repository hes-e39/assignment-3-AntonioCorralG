import { useEffect, useRef, useState } from "react";
import { useTimers } from "../../context/TimerContext";
import Button from "../generic/Button";
import { StyledButtonContainer, TimerDisplay, TimerContainer, DisplayRounds, TimerDescription } from "../generic/ContainerDisplays";
import { formatTime } from "../../utils/helpers";

const Tabata = ({ id }: { id: string }) => {
  const { timers, updateTimerTimeLeft, updateTimerState, nextTimer, removeTimer } = useTimers();
  const timer = timers.find((t) => t.id === id);

  if (!timer) return null;

  const { workTime = 0, restTime = 0, numberOfRounds = 1, isWorkPhase = true } = timer.config;
  const initialWorkTime = workTime * 1000;
  const initialRestTime = restTime * 1000;
  const [roundsLeft, setRoundsLeft] = useState<number>(numberOfRounds);
  const [phase, setPhase] = useState<boolean>(isWorkPhase); // true for work, false for rest
  const isRunning = timer.state === "running";
  const timeLeft = timer.timeLeft;

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        updateTimerTimeLeft(id, timeLeft - 1000);
      }, 1000);
    } else if (isRunning && timeLeft <= 0 && roundsLeft > 1) {
      clearInterval(intervalRef.current!);
      if (phase) {
        setPhase(false);
        updateTimerTimeLeft(id, initialRestTime);
      } else {
        setRoundsLeft(roundsLeft - 1);
        setPhase(true);
        updateTimerTimeLeft(id, initialWorkTime);
      }
      updateTimerState(id, "running");
    } else if (isRunning && timeLeft <= 0 && roundsLeft <= 1) {
      clearInterval(intervalRef.current!);
      updateTimerState(id, "completed");
      nextTimer();
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, roundsLeft, phase]);

  return (
    <TimerContainer>
      <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>
      <div>{phase ? "Work" : "Rest"}</div>
      <DisplayRounds>Rounds Remaining: {roundsLeft}</DisplayRounds>
      <TimerDescription>{timer.description}</TimerDescription>
      <StyledButtonContainer>
        <Button
          type="remove"
          height={60}
          width={70}
          onClick={() => removeTimer(id)}
        >
          Remove
        </Button>
      </StyledButtonContainer>
    </TimerContainer>
  );
};

export default Tabata;
