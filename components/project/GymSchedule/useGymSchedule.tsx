import { useState, useEffect } from "react";
import { getUsers } from "@/services/userService";
import { User } from "@/models/user";
import { Schedule } from "@/models/schedule";
import {
  getScheduleForDate,
  addUserToSchedule,
  removeUserFromSchedule,
  checkUserSchedule,
} from "@/services/scheduleService";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

interface ScheduleGroup {
  hour: number;
  users: User[];
  workouts: string[];
}

export default function useGymSchedule() {
  const [schedule, setSchedule] = useState<ScheduleGroup[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [newUserName, setNewUserName] = useState("");
  const [isAddingNewUser, setIsAddingNewUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserForWorkout, setSelectedUserForWorkout] =
    useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [selectedDate]);

  const fetchUsers = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  const fetchSchedule = async () => {
    console.log("Fetching schedule for date:", selectedDate);

    const fetchedSchedule = await getScheduleForDate(selectedDate);
    console.log("Raw fetched schedule from service:", fetchedSchedule);

    // Criar grupos de horário mesmo para horários sem agendamentos
    const completeSchedule = HOURS.map((hour) => {
      const existingGroup = fetchedSchedule.find(
        (group) => group.hour === hour
      );
      return (
        existingGroup || {
          hour,
          users: [],
          workouts: [],
        }
      );
    });

    console.log("Final processed schedule:", completeSchedule);
    setSchedule(completeSchedule);
  };

  const handleAddUser = async (): Promise<string | null> => {
    if (selectedHour === null) return "Nenhum horário selecionado.";

    let userToAdd: User;

    if (isAddingNewUser) {
      if (newUserName.trim() === "")
        return "Nome do usuário não pode ser vazio.";
      userToAdd = {
        name: newUserName,
        id: Math.random().toString(36).substring(2, 9),
      };
      setUsers((prevUsers) => [...prevUsers, userToAdd]);
    } else {
      if (selectedUser === "") return "Nenhum usuário selecionado.";
      userToAdd = users.find((user) => user.id === selectedUser)!;
    }

    try {
      // Verificar se o usuário já está agendado neste dia
      const { isScheduled, hour } = await checkUserSchedule(
        selectedDate,
        userToAdd.id
      );

      if (isScheduled) {
        if (hour === selectedHour) {
          return `${userToAdd.name} já está agendado para este horário.`;
        } else {
          return `O treino de ${userToAdd.name} já existe para esse dia, às ${hour}:00.`;
        }
      }

      // Verificar se o horário já está ocupado (limite de 10 usuários)
      const currentSlot = schedule.find((slot) => slot.hour === selectedHour);
      if (currentSlot && currentSlot.users.length >= 10) {
        return `Este horário já atingiu o limite máximo de usuários.`;
      }

      await addUserToSchedule(selectedDate, selectedHour, userToAdd.id);
      await fetchSchedule();
      resetForm();
      return null; // Sucesso
    } catch (error) {
      console.error("Failed to add user to schedule:", error);
      return "Ocorreu um erro ao adicionar a pessoa ao agendamento.";
    }
  };

  const handleRemoveUser = async (hour: number, userId: string) => {
    try {
      await removeUserFromSchedule(selectedDate, hour, userId);
      await fetchSchedule(); // Recarregar o schedule completo após remover
    } catch (error) {
      console.error("Failed to remove user from schedule:", error);
    }
  };

  const resetForm = () => {
    setSelectedHour(null);
    setSelectedUser("");
    setNewUserName("");
    setIsAddingNewUser(false);
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  return {
    schedule,
    selectedDate,
    selectedHour,
    users,
    selectedUser,
    newUserName,
    isAddingNewUser,
    isEditing,
    selectedUserForWorkout,
    setSelectedDate,
    setSelectedHour,
    setSelectedUser,
    setNewUserName,
    setIsAddingNewUser,
    setSelectedUserForWorkout,
    handleAddUser,
    handleRemoveUser,
    toggleEditMode,
    resetForm,
    fetchSchedule,
  };
}
