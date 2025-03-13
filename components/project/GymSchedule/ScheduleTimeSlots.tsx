import { User } from "@/models/user";
import TimeSlot from "./TimeSlot/TimeSlot";

interface ScheduleGroup {
  hour: number;
  users: User[];
  workouts: string[];
}

interface ScheduleTimeSlotsProps {
  schedule: ScheduleGroup[];
  isEditing: boolean;
  onAddUser: (hour: number) => void;
  onSelectUser: (user: User) => void;
  onRemoveUser: (hour: number, userId: string) => void;
}

export function ScheduleTimeSlots({
  schedule,
  isEditing,
  onAddUser,
  onSelectUser,
  onRemoveUser,
}: ScheduleTimeSlotsProps) {
  console.log("ScheduleTimeSlots received schedule:", schedule);

  return (
    <div className="space-y-2">
      {schedule.map((slot) => {
        console.log("Rendering slot:", slot);
        return (
          <TimeSlot
            key={slot.hour}
            hour={slot.hour}
            users={slot.users}
            workouts={slot.workouts}
            onAddUser={() => onAddUser(slot.hour)}
            onSelectUser={onSelectUser}
            isEditing={isEditing}
            onRemoveUser={(userId) => onRemoveUser(slot.hour, userId)}
          />
        );
      })}
    </div>
  );
}
