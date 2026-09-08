import { useMemo, useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchInput } from '@/components/common/SearchInput'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { UserTable } from '@/features/users/components/UserTable'
import { UserFormDialog, type UserFormValues } from '@/features/users/components/UserFormDialog'
import { PasswordResetDialog } from '@/features/users/components/PasswordResetDialog'
import {
  useActivateUser,
  useChangePassword,
  useCreateUser,
  useDeactivateUser,
  useDeleteUser,
  useUpdateUser,
  useUsersQuery,
} from '@/features/users/hooks/useUsers'
import type { User, ChangePasswordInput } from '@/features/users/types'

export function UsersPage() {
  const { data: users, isLoading, isError, refetch } = useUsersQuery()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const activateUser = useActivateUser()
  const deactivateUser = useDeactivateUser()
  const deleteUser = useDeleteUser()
  const changePassword = useChangePassword()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [passwordResetUser, setPasswordResetUser] = useState<User | null>(null)
  const [activateTarget, setActivateTarget] = useState<User | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return users ?? []

    return (users ?? []).filter((user) => {
      const username = user.username?.toLowerCase() || ''
      const email = user.email?.toLowerCase() || ''
      const firstName = user.firstName?.toLowerCase() || ''
      const lastName = user.lastName?.toLowerCase() || ''
      const fullName = `${firstName} ${lastName}`
      const role = user.role?.toLowerCase() || ''

      return (
        username.includes(term) ||
        email.includes(term) ||
        firstName.includes(term) ||
        lastName.includes(term) ||
        fullName.includes(term) ||
        role.includes(term)
      )
    })
  }, [users, search])

  function handleFormSubmit(values: UserFormValues) {
    if (editingUser) {
      updateUser.mutate(
        {
          id: editingUser.id,
          input: {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            role: values.role,
          },
        },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createUser.mutate(
        {
          username: values.username,
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
        },
        { onSuccess: () => setFormOpen(false) },
      )
    }
  }

  function handlePasswordResetSubmit(input: ChangePasswordInput) {
    if (!passwordResetUser) return
    changePassword.mutate(
      { id: passwordResetUser.id, input },
      { onSuccess: () => setPasswordResetUser(null) },
    )
  }

  function handleConfirmActivate() {
    if (!activateTarget) return
    activateUser.mutate(activateTarget.id, {
      onSuccess: () => setActivateTarget(null),
    })
  }

  function handleConfirmDeactivate() {
    if (!deactivateTarget) return
    deactivateUser.mutate(deactivateTarget.id, {
      onSuccess: () => setDeactivateTarget(null),
    })
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteUser.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage system users, roles, and security credentials across your bakery operations."
        actions={
          <Button
            onClick={() => {
              setEditingUser(null)
              setFormOpen(true)
            }}
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search users by name, username, email, or role..."
            className="max-w-md"
          />

          {isLoading ? (
            <TableSkeleton columns={6} />
          ) : isError ? (
            <ErrorState
              description="We could not load users. Please check your network or server connection."
              onRetry={() => refetch()}
            />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              title={search ? 'No users match your search' : 'No users found'}
              description={
                search
                  ? 'Try searching with a different username, email, or role.'
                  : 'Get started by creating your first system user.'
              }
              actionLabel={search ? undefined : 'Add User'}
              onAction={
                search
                  ? undefined
                  : () => {
                      setEditingUser(null)
                      setFormOpen(true)
                    }
              }
            />
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={(user) => {
                setEditingUser(user)
                setFormOpen(true)
              }}
              onChangePassword={(user) => setPasswordResetUser(user)}
              onActivate={(user) => setActivateTarget(user)}
              onDeactivate={(user) => setDeactivateTarget(user)}
              onDelete={(user) => setDeleteTarget(user)}
            />
          )}
        </CardContent>
      </Card>

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editingUser}
        onSubmit={handleFormSubmit}
        isSubmitting={createUser.isPending || updateUser.isPending}
      />

      <PasswordResetDialog
        open={Boolean(passwordResetUser)}
        onOpenChange={(open) => !open && setPasswordResetUser(null)}
        user={passwordResetUser}
        onSubmit={handlePasswordResetSubmit}
        isSubmitting={changePassword.isPending}
      />

      <ConfirmDialog
        open={Boolean(activateTarget)}
        onOpenChange={(open) => !open && setActivateTarget(null)}
        title="Activate User"
        description={
          activateTarget
            ? `Are you sure you want to activate @${activateTarget.username}? They will regain the ability to log in.`
            : ''
        }
        confirmLabel="Activate"
        isLoading={activateUser.isPending}
        onConfirm={handleConfirmActivate}
      />

      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Deactivate User"
        description={
          deactivateTarget
            ? `Are you sure you want to deactivate @${deactivateTarget.username}? They will no longer be able to log in.`
            : ''
        }
        confirmLabel="Deactivate"
        isLoading={deactivateUser.isPending}
        onConfirm={handleConfirmDeactivate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete User"
        description={
          deleteTarget
            ? `Are you sure you want to delete user @${deleteTarget.username}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        isLoading={deleteUser.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
