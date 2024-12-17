import React, { useState } from 'react';
import { useTimers } from '../../context/TimerContext';
import type { Timer } from '../../types/types';
import Button from '../generic/Button';
import { StyledLabel } from '../generic/FormStyling';
import { FormContainer, StyledButtonContainer } from '../generic/ContainerDisplays';
import { ModalOverlay, ModalContent } from '../generic/ModalStyling';

interface EditTimerModalProps {
    timer: Timer;
    onClose: () => void;
}

const EditTimerModal: React.FC<EditTimerModalProps> = ({ timer, onClose }) => {
    const { setTimers, savingTimerURLS, timers, resetWorkout } = useTimers();
    const [config, setConfig] = useState(timer.config);
    const [description, setDescription] = useState(timer.description);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({ ...config, [event.target.name]: Number(event.target.value) });
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    // In EditTimerModal.tsx
    const handleSaveClick = () => {
        const updatedTimers = timers.map(t =>
            t.id === timer.id
                ? {
                    ...t,
                    config,
                    description,
                    timeLeft:
                        t.type === 'stopwatch'
                            ? 0
                            : t.type === 'tabata'
                                ? config.workTime * 1000
                                : config.hours * 3600000 + config.minutes * 60000 + config.seconds * 1000,
                    state: 'notRunning',
                }
                : t,
        );

        setTimers(updatedTimers);
        savingTimerURLS();
        resetWorkout(); // Reset the workout after editing
        onClose();
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <FormContainer>
                    <h2>Edit Timer</h2>
                    <form>
                        {(timer.type === 'countdown' || timer.type === 'stopwatch') && (
                            <>
                                <StyledLabel>
                                    Hours:
                                    <input
                                        name="hours"
                                        type="number"
                                        placeholder="Hours"
                                        value={config.hours}
                                        onChange={handleInputChange}
                                    />
                                </StyledLabel>
                                <StyledLabel>
                                    Minutes:
                                    <input
                                        name="minutes"
                                        type="number"
                                        placeholder="Minutes"
                                        value={config.minutes}
                                        onChange={handleInputChange}
                                    />
                                </StyledLabel>
                                <StyledLabel>
                                    Seconds:
                                    <input
                                        name="seconds"
                                        type="number"
                                        placeholder="Seconds"
                                        value={config.seconds}
                                        onChange={handleInputChange}
                                    />
                                </StyledLabel>
                            </>
                        )}
                        {timer.type === 'xy' && (
                            <>
                                <StyledLabel>
                                    Minutes:
                                    <input
                                        name="minutes"
                                        type="number"
                                        placeholder="Minutes"
                                        value={config.minutes}
                                        onChange={handleInputChange}
                                    />
                                </StyledLabel>
                                <StyledLabel>
                                    Seconds:
                                    <input
                                        name="seconds"
                                        type="number"
                                        placeholder="Seconds"
                                        value={config.seconds}
                                        onChange={handleInputChange}
                                    />
                                </StyledLabel>
                                <StyledLabel>
                                    Rounds:
                                    <input
                                        name="numberOfRounds"
                                        type="number"
                                        placeholder="Rounds"
                                        value={config.numberOfRounds}
                                        onChange={handleInputChange}
                                    />
                                </StyledLabel>
                            </>
                        )}
                        {timer.type === 'tabata' && (
                            <>
                                <StyledLabel>
                                    Work Time (seconds):
                                    <input
                                        name="workTime"
                                        type="number"
                                        placeholder="Work Time (seconds)"
                                        value={config.workTime}
                                        onChange={handleInputChange}
                                    />
                                </StyledLabel>
                                <StyledLabel>
                                    Rest Time (seconds):
                                    <input
                                        name="restTime"
                                        type="number"
                                        placeholder="Rest Time (seconds)"
                                        value={config.restTime}
                                        onChange={handleInputChange}
                                    />
                                </StyledLabel>
                                <StyledLabel>
                                    Rounds:
                                    <input
                                        name="numberOfRounds"
                                        type="number"
                                        placeholder="Rounds"
                                        value={config.numberOfRounds}
                                        onChange={handleInputChange}
                                    />
                                </StyledLabel>
                            </>
                        )}
                        <StyledLabel>
                            Description:
                            <input
                                name="description"
                                type="text"
                                placeholder="Description"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </StyledLabel>
                        <StyledButtonContainer>
                            <Button type="button" height={40} width={100} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="button" height={40} width={100} onClick={handleSaveClick}>
                                Save
                            </Button>
                        </StyledButtonContainer>
                    </form>
                </FormContainer>
            </ModalContent>
        </ModalOverlay>
    );
};

export default EditTimerModal;
