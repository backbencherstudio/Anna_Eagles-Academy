import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => Promise<void> | void
    confirmVariant?: 'default' | 'destructive'
    isLoading?: boolean
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
    isLoading = false,
}: ConfirmDialogProps) {
    const [internalLoading, setInternalLoading] = useState(false)
    
    const handleConfirm = async () => {
        setInternalLoading(true)
        try {
            await onConfirm()
            onOpenChange(false)
        } catch (error) {
            // Error handling is done in the parent component
        } finally {
            setInternalLoading(false)
        }
    }

    const isProcessing = isLoading || internalLoading

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] animate-in fade-in-0 zoom-in-95 duration-200">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)} 
                        disabled={isProcessing}
                        className="cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    >
                        {cancelText}
                    </Button>
                    <Button 
                        variant={confirmVariant} 
                        onClick={handleConfirm} 
                        disabled={isProcessing}
                        className="cursor-pointer transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}