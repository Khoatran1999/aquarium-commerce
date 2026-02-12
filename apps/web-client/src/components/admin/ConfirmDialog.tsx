import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const btnClass =
    variant === 'danger'
      ? 'bg-danger hover:bg-danger/90 text-white'
      : variant === 'warning'
        ? 'bg-warning hover:bg-warning/90 text-white'
        : 'bg-primary hover:bg-primary/90 text-white';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onCancel}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="bg-card border-border relative z-10 mx-4 w-full max-w-md rounded-xl border p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground absolute right-3 top-3"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3">
              {variant === 'danger' && (
                <div className="bg-danger/10 rounded-full p-2">
                  <AlertTriangle className="text-danger h-5 w-5" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-foreground text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{description}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={onCancel}
                disabled={loading}
                className="border-border text-foreground hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${btnClass}`}
              >
                {loading ? 'Processing...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
