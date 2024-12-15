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
    const { setTimersState, savingTimerURLS, timers } = useTimers();
    const [config, setConfig] = useState(timer.config);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({ ...config, [event.target.name]: Number(event.target.value) });
    };

    const handleSaveClick = () => {
        const updatedTimers = timers.map(t => (t.id === timer.id ? { ...t, config } : t));
        setTimersState(updatedTimers);
        savingTimerURLS();
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
