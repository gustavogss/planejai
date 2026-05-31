import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FormStep } from '@/components/features/Simulation/FormSteps'
import { StepProgress } from '@/components/features/Simulation/Progress'
import { type SimulationFormData, simulationFormSteps } from '@/data/simulation'
import { useSimulatorStorage } from '@/hooks/useSimulatorStorage'

export function SimulationForm() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const { saveFormData } = useSimulatorStorage()
  const navigate = useNavigate()
  const totalSteps = simulationFormSteps.length
  const [formData, setFormData] = useState<SimulationFormData>(
    {} as SimulationFormData,
  )
  const currentStep = simulationFormSteps[currentStepIndex]

  const handleNextStep = (value: string) => {
    const updatedFormData = {
      ...formData,
      [currentStep.id!]: value,
    }

    setFormData(updatedFormData)

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      saveFormData(updatedFormData)
      void navigate('/resultado')
    }
  }
  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      return
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
