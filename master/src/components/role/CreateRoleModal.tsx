import { useEffect, useState, type FormEvent } from 'react'
import type { Role } from '../../types/role'
import { roleService } from '../../services/roleService'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

interface CreateRoleModalProps {
  open: boolean
  onClose: () => void
  onCreated: (role: Role) => void
}

export function CreateRoleModal({
  open,
  onClose,
  onCreated,
}: CreateRoleModalProps) {
  const toast = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setName('')
      setDescription('')
      setError('')
    }
  }, [open])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Role name is required')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const role = await roleService.create({
        name: trimmedName,
        description: description.trim(),
      })
      toast.success({
        title: 'Role created',
        description: `Role "${role.name}" is now available.`,
      })
      onCreated(role)
      onClose()
    } catch (err) {
      toast.error({
        title: 'Could not create role',
        description:
          err instanceof Error ? err.message : 'Something went wrong.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Role"
      description="Add a new role to the platform."
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-role-form" loading={submitting}>
            Create Role
          </Button>
        </>
      }
    >
      <form id="create-role-form" onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          <Input
            label="Role name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError('')
            }}
            error={error}
            placeholder="e.g. Editor"
            autoComplete="off"
            spellCheck={false}
          />
          <Input
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What this role can access"
            autoComplete="off"
          />
        </div>
      </form>
    </Modal>
  )
}
