import { Send, UserRound } from 'lucide-react'
import {
  type FormEvent,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'

import type { InsightData, MentorChatMessage } from '@/services/iaServices'

interface ContentProps {
  insight: InsightData
  goalName: string
  chatError: string | null
  isAnswering: boolean
  onAskMentor: (question: string) => Promise<void>
}

function Paragraph({ children }: PropsWithChildren) {
  return (
    <p className="text-foreground text-sm leading-relaxed">{children}</p>
  )
}

function SectionTitle({ children }: PropsWithChildren) {
  return (
    <h3 className="text-foreground mt-4 mb-1 text-sm leading-relaxed font-semibold">
      {children}
    </h3>
  )
}

function joinItems(items: string[]) {
  return items.join(' ')
}

function ChatMessage({ message }: { message: MentorChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <section className="border-border border-t py-5">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary text-primary">
          {isUser ? <UserRound size={12} /> : <span className="text-xs">✨</span>}
        </div>
        <span className="text-primary text-sm font-medium">
          {isUser ? 'Você' : 'Resposta da IA'}
        </span>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {message.content}
      </p>
    </section>
  )
}

export function Content({
  insight,
  goalName,
  chatError,
  isAnswering,
  onAskMentor,
}: ContentProps) {
  const [question, setQuestion] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const chatMessages = insight.mentorChat ?? []

  useEffect(() => {
    const content = contentRef.current

    if (!content) {
      return
    }

    requestAnimationFrame(() => {
      content.scrollTo({
        top: content.scrollHeight,
        behavior: 'smooth',
      })
    })
  }, [chatMessages.length, isAnswering])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || isAnswering) {
      return
    }

    setQuestion('')
    await onAskMentor(trimmedQuestion)
  }

  return (
    <div className="flex max-h-[720px] min-h-[520px] flex-col">
      <div
        ref={contentRef}
        className="scrollbar-thin [scrollbar-color:var(--border)_transparent] min-h-0 flex-1 overflow-y-auto rounded-xl border border-border p-3 pr-2"
      >
        <h2 className="text-foreground mb-3 text-2xl leading-tight font-semibold">
          Plano de Ação: Rumo ao {goalName}
        </h2>

        <section>
          <SectionTitle>💰 Diagnóstico Financeiro</SectionTitle>
          <Paragraph>
            {insight.diagnosis.content} {insight.feasibility.content}
          </Paragraph>
        </section>

        <section>
          <SectionTitle>🚀 Estratégia de Aporte</SectionTitle>
          <Paragraph>{joinItems(insight.suggestions.items)}</Paragraph>
        </section>

        <section>
          <SectionTitle>🏦 Proteção Financeira</SectionTitle>
          <Paragraph>{joinItems(insight.investment.items)}</Paragraph>
        </section>

        <section className="mb-5">
          <SectionTitle>💡 Dica de Ouro</SectionTitle>
          <Paragraph>
            {joinItems(insight.extraIncome.items)} {insight.motivation.content}
          </Paragraph>
        </section>

        {chatMessages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isAnswering && (
          <section className="border-border border-t py-5">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary text-primary">
                <span className="text-xs">✨</span>
              </div>
              <span className="text-primary text-sm font-medium">
                Resposta da IA
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Pensando na melhor resposta para a sua meta...
            </p>
          </section>
        )}
      </div>

      {chatError && <p className="mt-3 text-sm text-red-500">{chatError}</p>}

      <form
        onSubmit={handleSubmit}
        className="border-border mt-5 flex items-center gap-3 border-t pt-5"
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={isAnswering}
          placeholder="Digite sua pergunta para o mentor financeiro..."
          className="bg-input text-foreground placeholder:text-muted-foreground min-w-0 flex-1 rounded-2xl px-4 py-3 text-sm outline-none shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)] disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={!question.trim() || isAnswering}
          aria-label="Enviar pergunta para o mentor"
          className="bg-primary text-primary-foreground flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}
