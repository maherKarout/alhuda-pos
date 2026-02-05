import { prisma } from '../../prisma/client'

export type CasherBoxData = { usd: number; syp: number; exchangeRate: number }

export class CasherBoxService {
  /**
   * Get the single casher box row, or create one if none exists.
   * Use this to read current values or before updating.
   */
  async get(): Promise<{
    success: boolean
    data?: CasherBoxData
    error?: string
  }> {
    try {
      let row = await prisma.casherBox.findFirst()

      if (!row) {
        row = await prisma.casherBox.create({
          data: { usd: 0, syp: 0, exchangeRate: 0 } as Parameters<typeof prisma.casherBox.create>[0]['data']
        })
      }

      const rate = (row as { exchangeRate?: number }).exchangeRate ?? 0
      return {
        success: true,
        data: { usd: row.usd, syp: row.syp, exchangeRate: rate }
      }
    } catch (error) {
      console.error('CasherBoxService ~ get:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  /**
   * Update the casher box with new usd/syp/rate.
   * Creates the row if it does not exist, then updates.
   */
  async update(amounts: { usd?: number; syp?: number; exchangeRate?: number }): Promise<{
    success: boolean
    data?: CasherBoxData
    error?: string
  }> {
    try {
      const existing = await this.get()
      if (!existing.success || !existing.data) {
        return { success: false, error: existing.error ?? 'Failed to get or create casher box' }
      }

      const row = await prisma.casherBox.findFirst()
      if (!row) {
        return { success: false, error: 'Casher box row not found after get' }
      }

      const updateData = {
        ...(amounts.usd !== undefined && { usd: amounts.usd }),
        ...(amounts.syp !== undefined && { syp: amounts.syp }),
        ...(amounts.exchangeRate !== undefined && { exchangeRate: amounts.exchangeRate })
      }
      const updated = await prisma.casherBox.update({
        where: { id: row.id },
        data: updateData as Parameters<typeof prisma.casherBox.update>[0]['data']
      })

      const rate = (updated as { exchangeRate?: number }).exchangeRate ?? 0
      return {
        success: true,
        data: { usd: updated.usd, syp: updated.syp, exchangeRate: rate }
      }
    } catch (error) {
      console.error('CasherBoxService ~ update:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  /**
   * Get the current exchange rate from the casher box row.
   */
  async getRate(): Promise<{
    success: boolean
    data?: number
    error?: string
  }> {
    try {
      const result = await this.get()
      if (!result.success || !result.data) {
        return { success: false, error: result.error }
      }
      return { success: true, data: result.data.exchangeRate }
    } catch (error) {
      console.error('CasherBoxService ~ getRate:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  /**
   * Update the exchange rate and return the new value.
   */
  async updateRate(rate: number): Promise<{
    success: boolean
    data?: number
    error?: string
  }> {
    try {
      const result = await this.update({ exchangeRate: rate })
      if (!result.success || !result.data) {
        return { success: false, error: result.error }
      }
      return { success: true, data: result.data.exchangeRate }
    } catch (error) {
      console.error('CasherBoxService ~ updateRate:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}
