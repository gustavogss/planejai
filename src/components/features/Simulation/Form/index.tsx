import { StepProgress } from '@/components/features/Simulation/Progress'

export function SimulationForm() {
  return (
    <>
      <StepProgress currentStep={1} totalSteps={6} />
    </>
  )
}
