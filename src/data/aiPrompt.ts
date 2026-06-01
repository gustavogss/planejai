import type { InsightData, MentorChatMessage } from '@/services/iaServices'
import { parseCurrency } from '@/utils/current'
import { calcMonthlySavings } from '@/utils/simulation'

import type { SimulationRecord } from './simulation'

const RESPONSE_SCHEMA = `{
  "feasibility": {
    "status": "viable" | "needs_adjustment" | "unfeasible",
    "content": "<Análise objetiva sobre se a meta é atingível no prazo com o valor disponível. Mencione os números relevantes.>"
  },
  "diagnosis": {
    "content": "<Diagnóstico focado no comprometimento do orçamento: quanto % da renda está comprometida com gastos e dívidas, e o que isso representa para a saúde financeira.>"
  },
  "suggestions": {
    "items": ["<Sugestão prática e concreta para reduzir gastos ou reorganizar o orçamento>"]
  },
  "extraIncome": {
    "items": ["<Ideia prática para gerar renda extra compatível com a realidade brasileira>"]
  },
  "investment": {
    "items": ["<Sugestão de investimento acessível para o perfil apresentado, com foco em atingir a meta>"]
  },
  "motivation": {
    "content": "<Mensagem final motivacional e personalizada, citando a meta pelo nome.>"
  }
}`

export function buildAIPrompt(simulation: SimulationRecord) {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } =
    simulation

  const monthlySavings = calcMonthlySavings(simulation)
  const monthlySavingsNeeded =
    parseCurrency(goalAmount) / parseInt(goalDeadline)

  return `Você é um educador financeiro especializado em finanças pessoais. 
    Analise os dados abaixo e gere um diagnóstico financeiro personalizado com linguagem clara, didática e encorajadora, 
    voltado para pessoas sem conhecimento financeiro. O diagnóstico será exibido diretamente ao usuário no app, 
    fale sempre em segunda pessoa ("você tem...", "sua meta...").

    Dados da simulação:
    - Renda mensal bruta: ${income}
    - Custos fixos essenciais: ${expenses}
    - Dívidas e parcelas mensais: ${debts}
    - Valor disponível por mês: ${monthlySavings} reais
    - Meta: ${goalName}
    - Custo da meta: ${goalAmount}
    - Prazo desejado: ${goalDeadline} meses
    - Economia mensal necessária para atingir a meta no prazo: ${monthlySavingsNeeded} reais
    - Saldo após reserva para a meta: ${monthlySavings - monthlySavingsNeeded} reais

    Retorne APENAS um JSON válido, sem texto adicional, sem blocos de código, neste formato exato:

    ${RESPONSE_SCHEMA}

    Regras:
    - Todos os textos em português do Brasil
    - Máximo de 4 itens por lista
    - Seja específico ao citar valores calculados
    - Não repita informações entre seções
    - Nunca use markdown dentro dos valores do JSON
    - Para o campo "feasibility.status", use os seguintes critérios:
      - "viable": saldo após reserva para a meta é maior ou igual a 0
      - "needs_adjustment": saldo negativo de até 20% do valor da economia mensal necessária
      - "unfeasible": saldo negativo superior a 20% do valor da economia mensal necessária`
}

export function buildMentorPrompt({
  simulation,
  insight,
  question,
  history,
}: {
  simulation: SimulationRecord
  insight: InsightData
  question: string
  history: MentorChatMessage[]
}) {
  const monthlySavings = calcMonthlySavings(simulation)
  const monthlySavingsNeeded =
    parseCurrency(simulation.goalAmount) / parseInt(simulation.goalDeadline)

  const conversation =
    history.length > 0
      ? history
          .map((message) => {
            const speaker = message.role === 'user' ? 'Usuário' : 'Mentor'
            return `${speaker}: ${message.content}`
          })
          .join('\n')
      : 'Ainda não há mensagens anteriores.'

  return `Você é um mentor financeiro conversando com o usuário dentro do app Planejai.
Responda à pergunta usando exclusivamente o contexto da simulação, o insight financeiro personalizado e o histórico da conversa.
Fale em português do Brasil, em segunda pessoa, com tom claro, didático, acolhedor e prático.

Dados da simulação:
- Renda mensal bruta: ${simulation.income}
- Custos fixos essenciais: ${simulation.expenses}
- Dívidas e parcelas mensais: ${simulation.debts}
- Valor disponível por mês: ${monthlySavings} reais
- Meta: ${simulation.goalName}
- Custo da meta: ${simulation.goalAmount}
- Prazo desejado: ${simulation.goalDeadline} meses
- Economia mensal necessária: ${monthlySavingsNeeded} reais

Insight financeiro personalizado já gerado:
- Viabilidade: ${insight.feasibility.content}
- Diagnóstico: ${insight.diagnosis.content}
- Sugestões práticas: ${insight.suggestions.items.join('; ')}
- Renda extra: ${insight.extraIncome.items.join('; ')}
- Investimentos: ${insight.investment.items.join('; ')}
- Mensagem final: ${insight.motivation.content}

Histórico da conversa:
${conversation}

Pergunta atual do usuário:
${question}

Regras da resposta:
- Responda apenas ao usuário, sem JSON e sem markdown.
- Use no máximo 2 parágrafos curtos.
- Seja específico com os números e com a meta do usuário quando fizer sentido.
- Não invente dados que não estejam no contexto.
- Se a pergunta pedir algo arriscado, explique o cuidado de forma simples e sugira uma alternativa segura.`
}
