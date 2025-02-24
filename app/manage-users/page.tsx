"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/project/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type User = {
  id: string;
  name: string;
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setUsers([
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Johnson" },
    ]);
  }, []);

  const addUser = () => {
    if (newUserName.trim() === "") return;
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name: newUserName,
    };
    setUsers([...users, newUser]);
    setNewUserName("");
    setIsAddingUser(false);
  };

  const updateUser = () => {
    if (!editingUser || editingUser.name.trim() === "") return;
    setUsers(
      users.map((user) => (user.id === editingUser.id ? editingUser : user))
    );
    setEditingUser(null);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <Button onClick={() => setIsAddingUser(true)} className="mb-4">
        Add New User
      </Button>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <span>{user.name}</span>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingUser(user)}
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-user-name">User Name</Label>
              <Input
                id="new-user-name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter user name"
              />
            </div>
            <Button onClick={addUser}>Add User</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={editingUser !== null}
        onOpenChange={() => setEditingUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-user-name">User Name</Label>
              <Input
                id="edit-user-name"
                value={editingUser?.name || ""}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                placeholder="Enter user name"
              />
            </div>
            <Button onClick={updateUser}>Update User</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
