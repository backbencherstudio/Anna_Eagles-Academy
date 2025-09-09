import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    confirmVariant?: 'default' | 'destructive'
}

export default function ConfirmDialog({
    open,
    onOpenChange,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    confirmVariant = 'destructive',
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                        {cancelText}
                    </Button>
                    <Button variant={confirmVariant} onClick={handleConfirm} className="cursor-pointer">
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


