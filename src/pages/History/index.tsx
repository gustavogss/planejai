import { ExternalLink, Goal, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulatorStorage'
import { parseCurrency } from '@/utils/current'

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(value?: string) {
  if (!value) {
    return 'Sem data'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Sem data'
  }

  return new Intl.DateTimeFormat('pt-BR').format(date)
}

function getMonthlyGoalSavings(simulation: SimulationRecord) {
  const deadline = Number(simulation.goalDeadline)

  if (!deadline) {
    return 0
  }

  return parseCurrency(simulation.goalAmount) / deadline
}

export function History() {
  const navigate = useNavigate()
  const { deleteSimulation, getSimulations } = useSimulationStorage()
  const [simulations, setSimulations] = useState<SimulationRecord[]>(() =>
    getSimulations(),
  )

  const orderedSimulations = useMemo(
    () =>
      [...simulations].sort((current, next) => {
        const currentDate = current.createdAt
          ? new Date(current.createdAt).getTime()
          : 0
        const nextDate = next.createdAt ? new Date(next.createdAt).getTime() : 0

        return nextDate - currentDate
      }),
    [simulations],
  )

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations((current) =>
      current.filter((simulation) => simulation.id !== id),
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mt-12 mb-8 text-center">
        <h1 className="text-foreground text-2xl font-semibold sm:text-4xl">
          Histórico de simulações
        </h1>
        <p className="text-muted-foreground mt-2 mb-2 text-sm">
          Acompanhe o histórico de sua jornada financeira.
        </p>
      </div>

      {orderedSimulations.length === 0 ? (
        <section className="bg-card rounded-2xl border border-border p-8 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)]">
          <div className="bg-muted-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
            <Goal size={22} className="text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Nenhuma simulação salva</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Crie uma nova simulação para acompanhar suas metas por aqui.
          </p>
        </section>
      ) : (
        <section className="mx-auto flex max-w-sm flex-col gap-6 sm:max-w-none sm:gap-4">
          {orderedSimulations.map((simulation) => (
            <article
              key={simulation.id}
              className="bg-card grid gap-5 rounded-2xl border border-border p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.14)] transition-transform hover:-translate-y-0.5 sm:grid-cols-[minmax(180px,1.4fr)_repeat(3,minmax(110px,1fr))_auto_auto] sm:items-center sm:gap-4 sm:p-4 sm:px-5"
            >
              <div className="flex min-w-0 flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                <div className="bg-muted-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11">
                  <Goal size={20} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold">
                    {simulation.goalName}
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(simulation.createdAt)}
                  </p>
                </div>
              </div>

              <dl className="grid gap-4 text-center sm:contents sm:text-left">
                <div>
                  <dt className="text-primary text-[0.625rem] font-semibold uppercase">
                    Custo da meta
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">
                    R$ {simulation.goalAmount}
                  </dd>
                </div>
                <div>
                  <dt className="text-primary text-[0.625rem] font-semibold uppercase">
                    Prazo
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">
                    {simulation.goalDeadline} meses
                  </dd>
                </div>
                <div>
                  <dt className="text-primary text-[0.625rem] font-semibold uppercase">
                    Economia mensal
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">
                    {formatCurrency(getMonthlyGoalSavings(simulation))}
                  </dd>
                </div>
              </dl>

              <div className="border-border flex items-center justify-between border-t pt-4 sm:contents sm:border-t-0 sm:pt-0">
                <button
                  type="button"
                  aria-label={`Excluir simulação ${simulation.goalName}`}
                  onClick={() => handleDelete(simulation.id)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-500/10 sm:justify-self-center"
                >
                  <Trash2 size={18} />
                </button>

                <div className="bg-border h-6 w-px sm:hidden" />

                <button
                  type="button"
                  onClick={() => navigate(`/resultado/${simulation.id}`)}
                  className="border-border bg-background flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-opacity hover:opacity-80 sm:justify-self-auto"
                >
                  <ExternalLink size={16} />
                  Ver detalhes
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
