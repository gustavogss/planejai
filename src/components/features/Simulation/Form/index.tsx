import { useState } from 'react'

import { FormStep } from '@/components/features/Simulation/FormSteps'
import { StepProgress } from '@/components/features/Simulation/Progress'
import { simulationFormSteps } from '@/data/simulation'

export function SimulationForm() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const totalSteps = simulationFormSteps.length
  const currentStep = simulationFormSteps[currentStepIndex]

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }
  return (
    <>
      <StepProgress
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
      />
      <FormStep
        key={currentStep.id}
        {...currentStep}
        onNext={handleNextStep}
        onBack={handlePreviousStep}
        hideBackButton={currentStepIndex === 0}
      />
    </>
  )
}
