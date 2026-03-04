import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useTranslation } from 'react-i18next'

interface PopupConfirmProps {
    open: boolean
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    onConfirm: () => void
    onClose: () => void
}

const PopupConfirm: React.FC<PopupConfirmProps> = ({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel,
    loading = false,
    onConfirm,
    onClose
}) => {
    const { t } = useTranslation('translation')

    const handleClose = () => {
        if (loading) return
        onClose()
    }

    const handleConfirm = () => {
        if (loading) return
        onConfirm()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 0 }}>
                <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 2 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 56, color: 'success.main' }} />
                    {description && (
                        <Typography variant="body2" color="text.secondary" align="center">
                            {description}
                        </Typography>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions>
                <Stack
                    direction="row"
                    gap={3}
                    justifyContent="space-between"
                    sx={{ width: '100%', px: 2, pb: 2 }}
                >
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        disabled={loading}
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        {cancelLabel ?? t('Cancel')}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={loading}
                        sx={{ textTransform: 'none', fontWeight: 'bold', color: 'white' }}
                    >
                        {confirmLabel ?? t('Confirm')}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

export default PopupConfirm