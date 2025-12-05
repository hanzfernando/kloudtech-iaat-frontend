import { createFileRoute } from '@tanstack/react-router'
import { useGetUsersPaginated } from '@/lib/query/user/queries'
import { useCreateUser, useDeleteUser, useUpdateUser } from '@/lib/query/user/mutations'
import type { CreateUserInput, UpdateUserInput, User } from '@/lib/types/user'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export const Route = createFileRoute('/_main/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { data, isLoading, isError, isFetching } = useGetUsersPaginated(page, pageSize)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState<{
    name: string
    email: string
    role: 'ADMIN' | 'STAFF' | 'VIEWER'
    password?: string
  }>({ name: '', email: '', role: 'VIEWER', password: '' })

  const createMut = useCreateUser()
  const updateMut = useUpdateUser()
  const deleteMut = useDeleteUser()

  const startCreate = () => {
    setEditing(null)
    setForm({ name: '', email: '', role: 'VIEWER', password: '' })
    setOpen(true)
  }
  const startEdit = (u: User) => {
    setEditing(u)
    setForm({ name: u.name, email: u.email, role: u.role })
    setOpen(true)
  }
  const submit = async () => {
    if (editing) {
      const payload: UpdateUserInput = { id: editing.id, name: form.name, email: form.email, role: form.role }
      await updateMut.mutateAsync(payload)
    } else {
      const payload: CreateUserInput = { name: form.name, email: form.email, role: form.role, password: form.password || '' }
      await createMut.mutateAsync(payload)
    }
    setOpen(false)
  }

  if (isLoading) return <div>Loading users…</div>
  if (isError) return <div>Failed to load users.</div>

  const users: User[] = Array.isArray(data?.data) ? data!.data : []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Users</h1>
        <Button onClick={startCreate}>New User</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((u: User) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(u)}>Edit</Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMut.mutate({ id: u.id })}
                  >Delete</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
          {isFetching ? ' (updating…)': ''}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isFetching}
          >Previous</Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isFetching}
          >Next</Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* Hidden trigger; we open via state */}
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit User' : 'Create User'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the user details.' : 'Fill in details to create a user.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" className="col-span-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" className="col-span-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            {!editing && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input id="password" type="password" className="col-span-3" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <select
                id="role"
                className="col-span-3 h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as any })}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="STAFF">STAFF</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={createMut.isPending || updateMut.isPending}>
              {editing ? (updateMut.isPending ? 'Saving…' : 'Save') : (createMut.isPending ? 'Creating…' : 'Create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
