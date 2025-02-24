"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { UserPlus, X, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

type Person = {
  name: string;
  id: string;
};

type TimeSlot = {
  hour: number;
  people: Person[];
};

type Workout = {
  id: string;
  name: string;
  description: string;
  date: Date;
};

export function GymSchedule() {
  const [schedule, setSchedule] = useState<TimeSlot[]>(
    Array.from({ length: 15 }, (_, i) => ({
      hour: i + 6,
      people: [],
    }))
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [users, setUsers] = useState<Person[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [newUserName, setNewUserName] = useState("");
  const [isAddingNewUser, setIsAddingNewUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPersonForWorkout, setSelectedPersonForWorkout] =
    useState<Person | null>(null);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setUsers([
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Johnson" },
    ]);
  }, []);

  useEffect(() => {
    // Fetch schedule for the selected date
    // This is a placeholder. In a real application, you would fetch data from an API
    console.log(`Fetching schedule for ${format(selectedDate, "yyyy-MM-dd")}`);
    // For now, we'll just reset the schedule
    setSchedule(
      Array.from({ length: 15 }, (_, i) => ({
        hour: i + 6,
        people: [],
      }))
    );
  }, [selectedDate]);

  const addPerson = () => {
    if (selectedHour === null) return;

    let personToAdd: Person;

    if (isAddingNewUser) {
      if (newUserName.trim() === "") return;
      personToAdd = {
        name: newUserName,
        id: Math.random().toString(36).substring(2, 9),
      };
      setUsers((prevUsers) => [...prevUsers, personToAdd]);
    } else {
      if (selectedUser === "") return;
      personToAdd = users.find((user) => user.id === selectedUser)!;
    }

    setSchedule((prev) =>
      prev.map((slot) =>
        slot.hour === selectedHour
          ? {
              ...slot,
              people:
                slot.people.length < 10
                  ? [...slot.people, personToAdd]
                  : slot.people,
            }
          : slot
      )
    );

    resetForm();
  };

  const resetForm = () => {
    setSelectedHour(null);
    setSelectedUser("");
    setNewUserName("");
    setIsAddingNewUser(false);
  };

  const removePersonFromTimeSlot = (hour: number, personId: string) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((slot) =>
        slot.hour === hour
          ? {
              ...slot,
              people: slot.people.filter((person) => person.id !== personId),
            }
          : slot
      )
    );
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

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
          <div className="space-y-2">
            {schedule.map((slot) => (
              <TimeSlot
                key={slot.hour}
                hour={slot.hour}
                people={slot.people}
                onAddPerson={() => setSelectedHour(slot.hour)}
                onSelectPerson={setSelectedPersonForWorkout}
                isEditing={isEditing}
                onRemovePerson={(personId) =>
                  removePersonFromTimeSlot(slot.hour, personId)
                }
              />
            ))}
          </div>
        </ScrollArea>
        <AddPersonDialog
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
          onAddPerson={addPerson}
        />
        <WorkoutDialog
          isOpen={selectedPersonForWorkout !== null}
          onClose={() => setSelectedPersonForWorkout(null)}
          person={selectedPersonForWorkout}
          date={selectedDate}
        />
      </div>
    </div>
  );
}

function TimeSlot({
  hour,
  people,
  onAddPerson,
  onSelectPerson,
  isEditing,
  onRemovePerson,
}: {
  hour: number;
  people: Person[];
  onAddPerson: () => void;
  onSelectPerson: (person: Person) => void;
  isEditing: boolean;
  onRemovePerson: (personId: string) => void;
}) {
  return (
    <div className="flex items-center space-x-4 p-2 border rounded">
      <span className="font-semibold w-16">{hour}:00</span>
      <div className="flex-1 flex flex-wrap gap-2">
        {people.map((person) => (
          <div key={person.id} className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => !isEditing && onSelectPerson(person)}
              className="bg-black text-white hover:bg-gray-800"
            >
              {person.name}
            </Button>
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white hover:bg-red-600"
                onClick={() => onRemovePerson(person.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={onAddPerson}>
            Add
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
}

function AddPersonDialog({
  isOpen,
  onClose,
  selectedHour,
  users,
  selectedUser,
  setSelectedUser,
  isAddingNewUser,
  setIsAddingNewUser,
  newUserName,
  setNewUserName,
  onAddPerson,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedHour: number | null;
  users: Person[];
  selectedUser: string;
  setSelectedUser: (id: string) => void;
  isAddingNewUser: boolean;
  setIsAddingNewUser: (isAdding: boolean) => void;
  newUserName: string;
  setNewUserName: (name: string) => void;
  onAddPerson: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isAddingNewUser
              ? "Add New User"
              : `Add Person to ${selectedHour}:00`}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isAddingNewUser ? (
            <div className="space-y-2">
              <Label htmlFor="new-user-name">New User Name</Label>
              <Input
                id="new-user-name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter new user name"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-grow">
                  <Label htmlFor="user-select">Select User</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsAddingNewUser(true)}
                  className="mt-6"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          {isAddingNewUser && (
            <Button variant="outline" onClick={() => setIsAddingNewUser(false)}>
              Cancel
            </Button>
          )}
          <Button onClick={onAddPerson}>
            {isAddingNewUser ? "Add New User" : "Add to Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WorkoutDialog({
  isOpen,
  onClose,
  person,
  date,
}: {
  isOpen: boolean;
  onClose: () => void;
  person: Person | null;
  date: Date;
}) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);

  useEffect(() => {
    if (person) {
      // In a real application, you would fetch this data from an API
      setWorkouts([
        {
          id: "1",
          name: "Chest Day",
          description: "Bench press, push-ups, flyes",
          date: new Date(),
        },
        {
          id: "2",
          name: "Leg Day",
          description: "Squats, lunges, leg press",
          date: new Date(date.getTime() - 86400000),
        },
        {
          id: "3",
          name: "Back Day",
          description: "Pull-ups, rows, deadlifts",
          date: new Date(date.getTime() - 172800000),
        },
        {
          id: "4",
          name: "Shoulder Day",
          description: "Military press, lateral raises, front raises",
          date: new Date(date.getTime() - 259200000),
        },
        {
          id: "5",
          name: "Arm Day",
          description: "Bicep curls, tricep extensions, hammer curls",
          date: new Date(date.getTime() - 345600000),
        },
      ]);
      setCurrentWorkoutIndex(0);
    }
  }, [person, date]);

  const currentWorkout = workouts[currentWorkoutIndex];

  const showPreviousWorkout = () => {
    setCurrentWorkoutIndex((prev) => Math.min(prev + 1, workouts.length - 1));
  };

  const showNextWorkout = () => {
    setCurrentWorkoutIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exercícios de {person?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={showPreviousWorkout}
              disabled={currentWorkoutIndex === workouts.length - 1}
            >
              <ChevronLeft className="mr-2" />
              Previous
            </Button>
            <Button
              onClick={showNextWorkout}
              disabled={currentWorkoutIndex === 0}
            >
              Next
              <ChevronRight className="ml-2" />
            </Button>
          </div>
          {currentWorkout && (
            <div className="border p-4 rounded-md">
              <h3 className="font-bold">
                {currentWorkout.name} (
                {format(currentWorkout.date, "MMM d, yyyy")})
              </h3>
              <p>{currentWorkout.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
