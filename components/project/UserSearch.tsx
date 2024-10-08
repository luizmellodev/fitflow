import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type User = {
  id: string;
  name: string;
};

type UserSearchProps = {
  users: User[];
  onSelectUser: (userId: string) => void;
};

export function UserSearch({ users, onSelectUser }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="user-search">Buscar Usuário</Label>
      <Input
        id="user-search"
        type="text"
        placeholder="Digite o nome do usuário"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <ul className="mt-2 border rounded-md divide-y">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectUser(user.id)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
