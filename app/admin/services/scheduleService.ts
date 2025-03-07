import { Person, TimeSlot } from "../types";
import { getUsers } from "@/services/userService"; // Importa a função para obter usuários

export const scheduleService = {
  // Inicializa o cronograma
  initializeSchedule: async (): Promise<TimeSlot[]> => {
    // Buscando usuários, mas não usando diretamente aqui
    await getUsers(); // Se você não vai usar os usuários, pode comentar esta linha ou removê-la

    // Criar o cronograma vazio
    return Array.from({ length: 15 }, (_, i) => ({
      hour: i + 6,
      people: [], // Você pode pré-popular com usuários se necessário
    }));
  },

  // Adiciona uma pessoa a um horário específico
  addPersonToSlot: (
    schedule: TimeSlot[],
    selectedHour: number | null,
    person: Person
  ): TimeSlot[] => {
    if (selectedHour === null) return schedule;

    return schedule.map((slot) =>
      slot.hour === selectedHour
        ? {
            ...slot,
            people:
              slot.people.length < 10
                ? [...slot.people, person]
                : slot.people,
          }
        : slot
    );
  },

  // Remove uma pessoa de um horário específico
  removePersonFromSlot: (
    schedule: TimeSlot[],
    hour: number,
    personId: string
  ): TimeSlot[] => {
    return schedule.map((slot) =>
      slot.hour === hour
        ? {
            ...slot,
            people: slot.people.filter((person) => person.id !== personId),
          }
        : slot
    );
  },
};
