"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { ScheduleTimeSlots } from "./ScheduleTimeSlots";
import { AddUserDialog } from "./TimeSlot/AddUserDialog";
import { WorkoutDialog } from "./TimeSlot/WorkoutDialog";
import useGymSchedule from "./useGymSchedule";
import { Workout } from "@/models/workout";

export function GymSchedule() {
  const {
    schedule, // Agora é ScheduleGroup[]
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
  } = useGymSchedule();

  return (
    <div className="container mx-auto p-4 flex">
      <div className="w-1/4 pr-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border"
        />
      </div>
      <div className="w-3/4">
        <div className="flex justify-end items-center mb-4">
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={toggleEditMode}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {isEditing ? "Finish Editing" : "Edit Schedule"}
          </Button>
        </div>
        <h1 className="text-2xl font-bold mb-4">
          Gym Schedule for {format(selectedDate, "MMMM d, yyyy")}
        </h1>
        <ScrollArea className="h-[600px]">
          <ScheduleTimeSlots
            schedule={schedule}
            isEditing={isEditing}
            onAddUser={setSelectedHour}
            onSelectUser={setSelectedUserForWorkout}
            onRemoveUser={handleRemoveUser}
          />
        </ScrollArea>
        <AddUserDialog
          isOpen={selectedHour !== null}
          onClose={resetForm}
          selectedHour={selectedHour}
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          isAddingNewUser={isAddingNewUser}
          setIsAddingNewUser={setIsAddingNewUser}
          newUserName={newUserName}
          setNewUserName={setNewUserName}
          onAddUser={handleAddUser}
        />
        <WorkoutDialog
          isOpen={selectedUserForWorkout !== null}
          onClose={() => setSelectedUserForWorkout(null)}
          user={selectedUserForWorkout}
          date={selectedDate}
          onWorkoutUpdate={function (workout: Workout): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
}
