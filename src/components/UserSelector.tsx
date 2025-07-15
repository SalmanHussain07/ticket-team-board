import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/task";

interface UserSelectorProps {
  users: User[];
  selectedUserId: string | null;
  onSelect: (userId: string) => void;
}

export function UserSelector({ users, selectedUserId, onSelect }: UserSelectorProps) {
  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <Select value={selectedUserId || ''} onValueChange={onSelect}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.name}`} />
                <AvatarFallback className="text-xs bg-primary/10">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span>{selectedUser.name}</span>
              <Badge variant="outline" className="text-xs ml-auto">
                {selectedUser.role}
              </Badge>
            </div>
          ) : (
            'Switch User'
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {users.map(user => (
          <SelectItem key={user.id} value={user.id}>
            <div className="flex items-center gap-2 w-full">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                <AvatarFallback className="text-xs bg-primary/10">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{user.name}</span>
              <Badge 
                variant="outline" 
                className={`text-xs ml-auto ${
                  user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}
              >
                {user.role}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}