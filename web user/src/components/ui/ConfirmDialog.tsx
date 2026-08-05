import { Button } from './Button'
import { Modal } from './Modal'
import { AlertTriangleIcon } from './IconsExtra'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            destructive ? 'bg-danger/10 text-danger' : 'bg-brand-soft text-brand'
          }`}
        >
          <AlertTriangleIcon className="h-5 w-5" />
        </div>
        <p className="pt-1 text-sm leading-relaxed text-muted">{message}</p>
      </div>
    </Modal>
  )
}
