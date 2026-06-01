import {
  type SimulationFormData,
  type SimulationRecord,
} from '@/data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

export const useSimulationStorage = () => {
  const getSimulations = () => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!storage) {
      return []
    }

    return JSON.parse(storage) as SimulationRecord[]
  }

  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
    }

    const savedData = getSimulations()

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record]),
    )

    return id
  }

  const getFormData = (id: string) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!storage) {
      return null
    }

    const savedData = JSON.parse(storage) as SimulationRecord[]
    return savedData.find((record) => record.id === id) || null
  }

  const updateSimulation = (id: string, data: SimulationRecord) => {
    const savedData = getSimulations()

    const updated = savedData.map((record) =>
      record.id === id ? { ...data } : record,
    )

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  const deleteSimulation = (id: string) => {
    const updated = getSimulations().filter((record) => record.id !== id)

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  return {
    saveFormData,
    getFormData,
    getSimulations,
    updateSimulation,
    deleteSimulation,
  }
}
