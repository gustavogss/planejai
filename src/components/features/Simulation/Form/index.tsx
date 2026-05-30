import { PiggyBank } from 'lucide-react'

import { FormStep } from '@/components/features/Simulation/FormSteps'
import { StepProgress } from '@/components/features/Simulation/Progress'

export function SimulationForm() {
  return (
    <>
      <StepProgress currentStep={1} totalSteps={6} />
      <FormStep
        icon={PiggyBank}
        title="Renda mensal bruta"
        question="Quanto é depositado na sua conta todo mês?"
        inputProps={{
          type: 'text',
          placeholder: '5.000,00',
          prefix: 'R$',
        }}
      />
    </>
  )
}
