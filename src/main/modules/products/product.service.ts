import axios from 'axios'
import { baseUrlElectron, endPoints } from '../../../shared/endpoints'
import { prisma } from '../../prisma/client'
import { CreateLocalOrderInput } from '../orders/dto/dto'
export type ProductType = {
  id: string

  name: string
  code: string

  barCode?: string | null
  branchMask: string

  category?: string | null

  color?: string | null
  company?: string | null
  model?: string | null
  origin?: string | null
  provenance?: string | null
  quality?: string | null
  unity?: string | null
  dim?: string | null

  currencyGuid?: string | null
  individualPrice: number
  wholesalePrice: number

  openPrice: number

  isSynced?: boolean
  serverId?: string | null
  lastSynced?: Date | null
}

// ====================== Params get all  ======================
export type PropsGetAll = {
  searchValue?: string
  category?: string
  limit?: number
  page?: number
  total?: boolean
}

export class ProductService {
  // ====================== Get products counts ======================
  async getProductsCount(): Promise<{ success: boolean; data?: number; error?: string }> {
    try {
      const result = await prisma.product.count()
      return { success: true, data: result }
    } catch (error) {
      console.log('🚀 ~ ProductService ~ getProductsCount ~ error:', error)
      throw error
    }
  }
  // ====================== Insert multiple products at once ======================
  async addProducts(
    products: ProductType[]
  ): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
      console.log('🚀 ~ ProductService ~ addProducts ~ products:', products)
      const result = await prisma.product.createMany({ data: products })
      return { success: true, data: result }
    } catch (error) {
      console.log('🚀 ~ ProductService ~ addProducts ~ error:', error)
      throw error
    }
  }

  // ====================== Get all products with pagination ======================
  async getAllProductsWithPagination(params: PropsGetAll): Promise<{
    success: boolean
    data?: { data: ProductType[]; totalRecords: number }
    error?: string
  }> {
    const { searchValue, category, limit = 10, page = 1, total = true } = params
    console.log('------------------------------getAllProducts -------------------------:', params)
    try {
      // Build the filter
      const where: any = {}
      if (searchValue) {
        where.name = { contains: searchValue, startsWith: searchValue } // search by name
      }
      if (category) {
        where.category = category // filter by category
      }

      // Get paginated data
      const list = await prisma.product.findMany({
        where,
        skip: (page + 1) * limit,
        take: limit
        // orderBy: { id: 'asc' } // ensure consistent pagination
      })

      // Get total count only if requested
      let totalRecords = list.length
      if (total) {
        totalRecords = await prisma.product.count({ where })
      }

      return {
        success: true,
        data: {
          data: list,
          totalRecords
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
  // ====================== Map API product to Prisma schema ======================
  private mapProductToPrisma(p: ProductType) {
    return {
      id: p.id,
      name: p.name,
      code: p.code,
      barCode: p.barCode,
      branchMask: p.branchMask,
      category: p.category,
      color: p.color,
      company: p.company,
      model: p.model,
      origin: p.origin,
      provenance: p.provenance,
      quality: p.quality,
      unity: p.unity,
      dim: p.dim,
      currencyGuid: p.currencyGuid,
      individualPrice: p.individualPrice,
      wholesalePrice: p.wholesalePrice,
      openPrice: p.openPrice || 0
    }
  }

  // ====================== Get all products for first launch app ======================
  async getAllProductsForFirtsLaunchFromOnlineServer(
    token: string
  ): Promise<{ success: boolean; insertedCount?: number; error?: string }> {
    const productsCount = await this.getProductsCount()
    if (productsCount.data != null && productsCount.data > 0) {
      console.log(
        '🚀 ~ ProductService ~ getAllProductsForFirtsLaunchFromOnlineServer ~ productsCount:',
        productsCount?.error
      )
      return { success: true, insertedCount: 0 }
    }
    try {
      const limit = 100
      let page = 1
      let totalInserted = 0
      let totalRecords = 0

      // 🔹 First request (gets data + totalRecords)
      const firstResponse = await axios.get(
        `${baseUrlElectron}${endPoints.productsEndPoint().pathname}`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const firstData = firstResponse.data.data as ProductType[]
      totalRecords = firstResponse.data.totalRecords

      const cleanedFirst = firstData.map((p) => this.mapProductToPrisma(p))
      const firstResult = await prisma.product.createMany({ data: cleanedFirst })
      totalInserted += firstResult.count

      // 🔹 Calculate how many pages we need
      const totalPages = Math.ceil(totalRecords / limit)

      // 🔹 Fetch remaining pages
      for (page = 2; page <= totalPages; page++) {
        console.log(
          '🚀 ~ ProductService ~ getAllProductsForFirtsLaunchFromOnlineServer ~ page:',
          page
        )
        const response = await axios.get(
          `${baseUrlElectron}${endPoints.productsEndPoint().pathname}`,
          {
            params: { page, limit },
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        const cleanedProducts = response.data.data.map((p: ProductType) =>
          this.mapProductToPrisma(p)
        )
        const result = await prisma.product.createMany({
          data: cleanedProducts
        })
        totalInserted += result.count
      }

      return { success: true, insertedCount: totalInserted }
    } catch (error) {
      console.error('Full error:', JSON.stringify(error, null, 2))
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}
