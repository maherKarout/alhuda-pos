import { AccordionDetails, AccordionSummary, Accordion, Typography, TextField } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useCasherScreen, { ItemType } from '../../hooks/use-casher-screen'
type AccordionWrapperProps = {
    children: React.ReactNode,
    item: ItemType,
    index: number,
    expandedItemId: string | null,
    onToggle: (itemId: string | null) => void
}
function AccordionWrapper({ children, item, index, expandedItemId, onToggle }: AccordionWrapperProps) {
    const { t } = useTranslation('translation')
    const { setOrders, currentOrder } = useCasherScreen()
    const isExpanded = expandedItemId === item.id

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!setOrders) return
        setOrders((prevState) => {
            const newOrders = [...prevState]
            const currentOrderData = newOrders?.[currentOrder]

            if (!currentOrderData) return prevState

            const items = currentOrderData.items
            items[index].note = event.target.value

            newOrders[currentOrder] = { ...currentOrderData, items: items }
            return newOrders
        })
    }

    const handleAccordionChange = (_event: React.SyntheticEvent, expanded: boolean) => {
        onToggle(expanded ? item.id : null)
    }

    return (
        <Accordion expanded={isExpanded} onChange={handleAccordionChange} sx={{ padding: 0, marginBottom: 1 }}>
            <AccordionSummary sx={{
                padding: 0, margin: 0, marginY: "0px !important",
                "& .MuiAccordionSummary-content": {
                    margin: 0,
                },
                "& .MuiAccordionSummary-content.Mui-expanded": {
                    margin: 0,
                },
                "& .MuiAccordion-root::before": {
                    display: "none",
                },
            }}>
                {children}
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0, margin: 0, marginY: "0px !important" }}>
                <TextField
                    fullWidth
                    placeholder={t('Note')}
                    value={item.note ?? ''}
                    onChange={onChange}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                />
            </AccordionDetails>
        </Accordion>
    )
}

export default AccordionWrapper