"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

type User = {
  id: string;
  name: string;
};

type UserManagementProps = {
  initialUsers: User[];
};

export function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [newUser, setNewUser] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("UserManagement rendered with", users.length, "users");
  }, [users]);

  const addUser = () => {
    if (newUser.trim()) {
      const newUserObj = { id: Date.now().toString(), name: newUser.trim() };
      setUsers([...users, newUserObj]);
      setNewUser("");
    }
  };

  const startEditing = (user: User) => {
    setEditingUser(user);
  };

  const saveEdit = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Adicionar Novo Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-2">
            <div className="flex-grow">
              <Label htmlFor="new-user">Nome do Usuário</Label>
              <Input
                id="new-user"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                placeholder="Digite o nome do novo usuário"
              />
            </div>
            <Button onClick={addUser}>Adicionar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TableCell>
                        {editingUser?.id === user.id ? (
                          <Input
                            value={editingUser.name}
                            onChange={(e) =>
                              setEditingUser({
                                ...editingUser,
                                name: e.target.value,
                              })
                            }
                          />
                        ) : (
                          user.name
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingUser?.id === user.id ? (
                          <Button onClick={saveEdit} size="sm">
                            Salvar
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => startEditing(user)}
                              size="sm"
                              variant="outline"
                              className="mr-2"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => deleteUser(user.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          ) : (
            <p>Nenhum usuário encontrado.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
