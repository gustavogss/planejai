import { parseCurrency } from '@/utils/current'

import type { SimulationFormData } from '../data/simulation'

export function calcMonthlySavings(data: SimulationFormData) {
  return (
    parseCurrency(data.income) -
    parseCurrency(data.expenses) -
    parseCurrency(data.debts)
  )
}
