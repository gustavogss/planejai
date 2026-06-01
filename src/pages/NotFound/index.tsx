import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import PiggyBankImage from '@/assets/piggy-bank.png'
import { Button } from '@/components/shared/Button'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-xl flex-col items-center justify-center px-4 py-14 text-center">
      <div className="bg-card border-border mb-8 flex h-36 w-36 items-center justify-center rounded-2xl border shadow-[4px_4px_18px_0px_rgba(0,0,0,0.14)]">
        <img
          src={PiggyBankImage}
          alt="Ilustração do Planejai"
          className="h-24 w-24 object-contain"
        />
      </div>

      <span className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
        Erro 404
      </span>
      <h1 className="text-foreground text-3xl font-semibold sm:text-4xl">
        Página não encontrada
      </h1>
      <p className="text-muted-foreground mt-3 mb-8 text-sm leading-relaxed">
        O endereço acessado não existe ou foi movido. Volte para criar uma nova
        simulação financeira.
      </p>

      <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/')}>
        Voltar para o início
      </Button>
    </main>
  )
}
