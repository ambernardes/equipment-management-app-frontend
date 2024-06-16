import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Equipement = {
  id: number
  name: string
  category: string
  status: string
  location: string
  lastMaintenanceDate: Date
  rentalRate: number
}

export const useEquipmentStore = defineStore('equipment', () => {
  const equipement = ref(undefined as Equipement | undefined)
  // const doubleCount = computed(() => count.value * 2)
  return { equipement }
})
