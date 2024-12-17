import { useEffect, useRef, useState } from "react";
import { useTimers } from "../../context/TimerContext";
import Button from "../generic/Button";
import { StyledButtonContainer, TimerDisplay, TimerContainer, TimerDescription } from "../generic/ContainerDisplays";
import { formatTime } from "../../utils/helpers";

const XY = ({ id }: { id: string }) => {
  const { timers, updateTimerTimeLeft, updateTimerState, nextTimer, removeTimer } = useTimers();
  const timer = timers.find((t) => t.id === id);

  if (!timer) return null;

  const { minutes = 0, seconds = 0, numberOfRounds } = timer.config;
  const isRunning = timer.state === "running";

  const initialTime = (minutes * 60 + seconds) * 1000;
  const [roundsLeft, setRoundsLeft] = useState<number>(numberOfRounds);
  const timeLeft = timer.timeLeft === undefined ? initialTime : timer.timeLeft;

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        updateTimerTimeLeft(id, timeLeft - 1000);
      }, 1000);
    } else if (isRunning && timeLeft <= 0 && roundsLeft > 1) {
      clearInterval(intervalRef.current!);
      setRoundsLeft(roundsLeft - 1);
      updateTimerTimeLeft(id, initialTime);
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
  }, [isRunning, timeLeft, roundsLeft]);

  return (
    <TimerContainer>
      <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>
      <div>Rounds Remaining: {roundsLeft}</div>
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

export default XY;
