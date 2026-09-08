import { KeyRound, Pencil, Power, PowerOff, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { User } from '@/features/users/types'

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onChangePassword: (user: User) => void
  onActivate: (user: User) => void
  onDeactivate: (user: User) => void
  onDelete: (user: User) => void
}

export function UserTable({
  users,
  onEdit,
  onChangePassword,
  onActivate,
  onDeactivate,
  onDelete,
}: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isActive = user.active !== false && user.status !== 'INACTIVE'
          const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || '-'

          return (
            <TableRow key={user.id}>
              <TableCell className="font-medium">@{user.username}</TableCell>
              <TableCell>{fullName}</TableCell>
              <TableCell className="text-muted-foreground">{user.email || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs uppercase">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={isActive ? 'success' : 'secondary'}>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Edit user details"
                    aria-label={`Edit ${user.username}`}
                    onClick={() => onEdit(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Reset / Change password"
                    aria-label={`Change password for ${user.username}`}
                    onClick={() => onChangePassword(user)}
                  >
                    <KeyRound className="h-4 w-4" />
                  </Button>
                  {isActive ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Deactivate user"
                      aria-label={`Deactivate ${user.username}`}
                      onClick={() => onDeactivate(user)}
                    >
                      <PowerOff className="h-4 w-4 text-amber-600" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Activate user"
                      aria-label={`Activate ${user.username}`}
                      onClick={() => onActivate(user)}
                    >
                      <Power className="h-4 w-4 text-emerald-600" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete user"
                    aria-label={`Delete ${user.username}`}
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
