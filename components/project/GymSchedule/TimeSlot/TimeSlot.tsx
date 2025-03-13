"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/models/user";
import { UserPlus, X, Dumbbell } from "lucide-react";

interface TimeSlotProps {
  hour: number;
  users: User[];
  workouts: string[]; // Adicionado para representar os IDs dos workouts
  onAddUser: () => void;
  onSelectUser: (user: User) => void;
  isEditing: boolean;
  onRemoveUser: (id: string) => void;
}

export default function TimeSlot({
  hour,
  users,
  workouts,
  onAddUser,
  onSelectUser,
  isEditing,
  onRemoveUser,
}: TimeSlotProps) {
  return (
    <div className="flex items-center space-x-4 p-2 border rounded">
      <span className="font-semibold w-16">{hour}:00</span>
      <div className="flex-1 flex flex-wrap gap-2">
        {users.map((user) => (
          <div key={user.id} className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => !isEditing && onSelectUser(user)}
              className="bg-black text-white hover:bg-gray-800"
            >
              {user.name}
              {workouts.includes(user.id) && (
                <Dumbbell className="ml-2 h-3 w-3" />
              )}
            </Button>
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white hover:bg-red-600"
                onClick={() => onRemoveUser(user.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      {users.length < 10 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddUser}
          className="ml-auto"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
