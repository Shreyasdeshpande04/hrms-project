import React from 'react';
import styles from './Stepper.module.css';

const Stepper = ({ stages, currentStage, onStageClick }) => {
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className={styles.stepperContainer}>
      {stages.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={stage} className={styles.stepWrapper}>
            {/* The Circle */}
            <div 
              className={`${styles.circle} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''}`}
              onClick={() => onStageClick(stage)}
            >
              {isCompleted ? '✓' : index + 1}
            </div>

            {/* The Label */}
            <span className={`${styles.label} ${isActive ? styles.activeText : ''}`}>
              {stage}
            </span>

            {/* The Line (don't show after the last step) */}
            {index < stages.length - 1 && (
              <div className={`${styles.line} ${index < currentIndex ? styles.lineCompleted : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;