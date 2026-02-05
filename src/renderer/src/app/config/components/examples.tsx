import { Stack, Typography, Divider } from '@mui/material'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type FormValues = {
    approximationRatio?: number | string
}

const SAMPLE_VALUES = [1100, 1240, 1900]

const numberFormatter = new Intl.NumberFormat()

const roundByRatio = (value: number, ratio: number) => {
    if (!Number.isFinite(ratio) || ratio <= 0) return value
    return Math.round(value / ratio) * ratio
}

function ApproximationExamples() {
    const { t } = useTranslation('translation')
    const { values } = useFormikContext<FormValues>()

    const ratio = Number(values?.approximationRatio)
    const isRatioValid = Number.isFinite(ratio) && ratio > 0

    const examples = useMemo(() => {
        return SAMPLE_VALUES.map((value) => ({
            original: value,
            rounded: isRatioValid ? roundByRatio(value, ratio) : null
        }))
    }, [ratio, isRatioValid])

    return (
        <Stack
            spacing={1.5}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
                bgcolor: 'background.paper'
            }}
        >
            <Typography variant="subtitle1" fontWeight={600}>
                {t('approximationExamplesTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {isRatioValid
                    ? t('approximationExamplesValid', { ratio: numberFormatter.format(ratio) })
                    : t('approximationExamplesInvalid')}
            </Typography>
            <Divider />
            <Stack spacing={1}>
                {examples.map(({ original, rounded }) => (
                    <Stack key={original} direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" fontWeight={600}>
                            {rounded !== null && isRatioValid ? numberFormatter.format(rounded) : '—'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            →
                        </Typography>
                        <Typography variant="body2">{numberFormatter.format(original)}</Typography>

                    </Stack>
                ))}
            </Stack>
        </Stack>
    )
}

export default ApproximationExamples

