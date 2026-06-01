import 'react-loading-skeleton/dist/skeleton.css'

import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'

import { Content } from '@/components/features/Insigths/Content'
import { Error } from '@/components/features/Insigths/Error'
import { buildMentorPrompt } from '@/data/aiPrompt'
import { useInsight } from '@/hooks/useInsight'
import { useSimulationStorage } from '@/hooks/useSimulatorStorage'
import {
  getMentorAnswer,
  type InsightData,
  type MentorChatMessage,
} from '@/services/iaServices'

interface AIInsightCardProps {
  simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
  const { getFormData, updateSimulation } = useSimulationStorage()
  const [mentorInsight, setMentorInsight] = useState<InsightData | null>(null)
  const [isAnswering, setIsAnswering] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const simulation = getFormData(simulationId)
  const currentInsight = mentorInsight ?? insight

  const handleAskMentor = async (question: string) => {
    const simulationData = getFormData(simulationId)

    if (!simulationData || !currentInsight) {
      setChatError('Não foi possível carregar a simulação para conversar.')
      return
    }

    const previousMessages = currentInsight.mentorChat ?? []
    const userMessage: MentorChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      createdAt: new Date().toISOString(),
    }

    const insightWithQuestion: InsightData = {
      ...currentInsight,
      mentorChat: [...previousMessages, userMessage],
    }

    setMentorInsight(insightWithQuestion)
    updateSimulation(simulationId, {
      ...simulationData,
      insight: insightWithQuestion,
    })

    setIsAnswering(true)
    setChatError(null)

    try {
      const prompt = buildMentorPrompt({
        simulation: simulationData,
        insight: currentInsight,
        question,
        history: previousMessages,
      })
      const answer = await getMentorAnswer(prompt)
      const mentorMessage: MentorChatMessage = {
        id: crypto.randomUUID(),
        role: 'mentor',
        content: answer,
        createdAt: new Date().toISOString(),
      }
      const updatedInsight: InsightData = {
        ...currentInsight,
        mentorChat: [...previousMessages, userMessage, mentorMessage],
      }

      setMentorInsight(updatedInsight)
      updateSimulation(simulationId, {
        ...simulationData,
        insight: updatedInsight,
      })
    } catch {
      setChatError('Erro ao conversar com o mentor. Tente novamente.')
    } finally {
      setIsAnswering(false)
    }
  }

  return (
    <div className="bg-card order-2 max-h-[820px] overflow-hidden rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={11.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}
      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => {
            fetchInsight(simulationId)
          }}
        />
      )}
      {!isLoading && currentInsight && !error && (
        <Content
          insight={currentInsight}
          goalName={simulation?.goalName ?? 'sua meta'}
          chatError={chatError}
          isAnswering={isAnswering}
          onAskMentor={handleAskMentor}
        />
      )}
    </div>
  )
}
