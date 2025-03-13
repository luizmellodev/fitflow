"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { User } from "@/models/user";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHour: number | null;
  users: User[];
  selectedUser: string;
  setSelectedUser: (id: string) => void;
  isAddingNewUser: boolean;
  setIsAddingNewUser: (isAdding: boolean) => void;
  newUserName: string;
  setNewUserName: (name: string) => void;
  onAddUser: () => Promise<string | null>;
}

export function AddUserDialog({
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
  onAddUser,
}: AddUserDialogProps) {
  const [error, setError] = useState<string | null>(null);

  // Limpa o erro quando o diálogo é aberto ou fechado
  useEffect(() => {
    setError(null);
  }, [isOpen]);

  const handleAddUser = async () => {
    const result = await onAddUser();
    if (result) {
      setError(result);
    } else {
      setError(null);
      onClose();
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isAddingNewUser
              ? "Add New User"
              : `Add User to ${selectedHour}:00`}
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
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="flex justify-end space-x-2">
          {isAddingNewUser && (
            <Button variant="outline" onClick={() => setIsAddingNewUser(false)}>
              Cancel
            </Button>
          )}
          <Button onClick={handleAddUser}>
            {isAddingNewUser ? "Add New User" : "Add to Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
