import PiggyBankImage from '@/assets/piggy-bank.png'

export function SimulationHero() {
  return (
    <div className="mt-12 mb-8 text-center">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <img
          src={PiggyBankImage}
          alt="Piggy Bank"
          className="h-10 w-10 sm:-mt-2 sm:-ml-3"
        />
        <h1 className="text-foreground text-2xl font-semibold sm:text-4xl">
          Vamos planejar seu futuro
        </h1>
      </div>
      <p className="text-muted-foreground mt-2 mb-2 text-sm">
        Responda algumas perguntas para ter insigths financeiros personalizados
      </p>
    </div>
  )
}
