import React, { Fragment, useState } from 'react';
import DaStep from './DaStep';
import clsx from 'clsx';
import { TbChevronRight } from 'react-icons/tb';

type DaStepperProps = {
  children?: React.ReactNode;
  className?: string;
  currentStep?: number;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
};

const DaStepper = ({
  children,
  className,
  currentStep: outerCurrentStep,
  setCurrentStep: outerSetCurrentStep,
}: DaStepperProps) => {
  const totalSteps = React.Children.count(children);
  const elementsArray = React.Children.toArray(children);
  const [innerCurrentStep, innerSetCurrentStep] = useState(0);
  const currentStep = outerCurrentStep ?? innerCurrentStep;
  const setCurrentStep = outerSetCurrentStep ?? innerSetCurrentStep;

  return (
    <div className={clsx('flex items-center overflow-hidden', className)}>
      {elementsArray.map((step, index) => (
        <Fragment key={index}>
          {React.isValidElement(step) ? (
            React.cloneElement(step, {
              ...(typeof step.props === 'object' ? step.props : {}),
              index,
              currentStep,
              setCurrentStep,
              totalSteps,
            } as {
              index: number;
              currentStep: number;
              setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
              totalSteps: number;
            })
          ) : (
            <DaStep
              {...(typeof step === 'object' ? step : {})}
              index={index}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              totalSteps={totalSteps}
            />
          )}

          {index < totalSteps - 1 && (
            <TbChevronRight className="da-label-sub-title" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default DaStepper;
