import type { Customer } from '../../../generated/prisma/client'
import { prisma } from '../../prisma/client'
import axios from 'axios'
import { baseUrlElectron } from '../../../shared/endpoints'
import { endPoints } from '../../../shared/endpoints'

/** DTO/view type; for DB entity use Prisma's Customer from @prisma/client */
export type CustomerType = {
  id: string
  customerId: string
  name: string
  phone: string
  numberOfInvoices: number
  totalPurchases: number
  totalPaymentSyp: number
  totalPaymentUsd: number
}

// ====================== Create input ======================
export type CreateCustomerInput = {
  name: string
  customerId: string
  cuMobile: string
  cuStreet: string
  cuDistrict: string
  cuArea: string
  cuCity: string
  cuCountry: string
}

// ====================== Update input ======================
export type UpdateCustomerInput = Partial<CreateCustomerInput>

// ====================== Get all params ======================
export type PropsGetAllCustomers = {
  searchValue?: string
  limit?: number
  page?: number
  total?: boolean
}

export class CustomersService {
  // ====================== Create ======================
  async create(
    input: CreateCustomerInput
  ): Promise<{ success: boolean; data?: Customer; error?: string }> {
    try {
      const result = await prisma.customer.create({
        data: {
          name: input.name,
          cuMobile: input.cuMobile ?? undefined,
          cuStreet: input.cuStreet ?? undefined,
          cuDistrict: input.cuDistrict ?? undefined,
          cuArea: input.cuArea ?? undefined,
          cuCity: input.cuCity ?? undefined,
          cuCountry: input.cuCountry ?? undefined,
          customerId: input.customerId ?? undefined
        }
      })
      return { success: true, data: result }
    } catch (error) {
      console.log('🚀 ~ CustomersService ~ create ~ error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  // ====================== Get by id ======================
  async getById(id: string): Promise<{ success: boolean; data?: Customer | null; error?: string }> {
    try {
      const result = await prisma.customer.findUnique({
        where: { id }
      })
      return { success: true, data: result }
    } catch (error) {
      console.log('🚀 ~ CustomersService ~ getById ~ error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  // ====================== Get all with pagination ======================
  async getAll(params: PropsGetAllCustomers): Promise<{
    success: boolean
    data?: { data: Customer[]; totalRecords: number }
    error?: string
  }> {
    const { searchValue, limit = 10, page = 0, total = true } = params
    try {
      const where: { name?: { contains: string } } = {}
      if (searchValue?.trim()) {
        where.name = { contains: searchValue.trim() }
      }

      const skip = page * limit
      const list = await prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })

      let totalRecords = list.length
      if (total) {
        totalRecords = await prisma.customer.count({ where })
      }

      return {
        success: true,
        data: {
          data: list,
          totalRecords
        }
      }
    } catch (error) {
      console.log('🚀 ~ CustomersService ~ getAll ~ error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  // ====================== Update ======================
  async update(
    id: string,
    input: UpdateCustomerInput
  ): Promise<{ success: boolean; data?: Customer; error?: string }> {
    try {
      const result = await prisma.customer.update({
        where: { id },
        data: {
          ...(input.name != null && { name: input.name }),
          ...(input.customerId !== undefined && { customerId: input.customerId }),
          ...(input.cuMobile !== undefined && { cuMobile: input.cuMobile }),
          ...(input.cuStreet !== undefined && { cuStreet: input.cuStreet }),
          ...(input.cuDistrict !== undefined && { cuDistrict: input.cuDistrict }),
          ...(input.cuArea !== undefined && { cuArea: input.cuArea }),
          ...(input.cuCity !== undefined && { cuCity: input.cuCity }),
          ...(input.cuCountry !== undefined && { cuCountry: input.cuCountry })
        }
      })
      return { success: true, data: result }
    } catch (error) {
      console.log('🚀 ~ CustomersService ~ update ~ error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  // ====================== Delete ======================
  async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await prisma.customer.delete({
        where: { id }
      })
      return { success: true }
    } catch (error) {
      console.log('🚀 ~ CustomersService ~ delete ~ error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  // ====================== Count ======================
  async count(): Promise<{ success: boolean; data?: number; error?: string }> {
    try {
      const result = await prisma.customer.count()
      return { success: true, data: result }
    } catch (error) {
      console.log('🚀 ~ CustomersService ~ count ~ error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  // ====================== Get all customers for first launch app ======================
  async getAllCustomersForFirstLaunchFromOnlineServer(token: string): Promise<void> {
    const countResult = await this.count()
    if (countResult.data != null && countResult.data > 0) {
      return
    }
    try {
      const limit = 100
      let totalRecords = 0

      const firstResponse = await axios.get(
        `${baseUrlElectron}${endPoints.customersEndPoint().pathname}`,
        {
          params: { page: 1, limit },
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const firstData = firstResponse.data?.data ?? []
      totalRecords = firstResponse.data?.totalRecords ?? firstData.length

      const mapApiCustomerToPrisma = (c: Record<string, unknown>) => ({
        id: (c.id as string) ?? crypto.randomUUID(),
        name: (c.name as string) ?? '',
        customerId: (c.customerId ?? c.cuGuid ?? c.id) as string | undefined,
        cuGuid: (c.cuGuid ?? c.accGuid) as string | undefined,
        accGuid: (c.accGuid ?? c.cuGuid) as string | undefined,
        balance: (c.balance as number) ?? 0,
        totalPurchases: (c.totalPurchases as number) ?? 0,
        cuMobile: (c.cuMobile ?? c.mobile ?? c.cuPhone1) as string | undefined,
        cuPhone1: (c.cuPhone1 ?? c.phone) as string | undefined,
        cuPhone2: (c.cuPhone2 as string) ?? undefined,
        cuStreet: (c.cuStreet ?? c.street) as string | undefined,
        cuDistrict: (c.cuDistrict ?? c.district) as string | undefined,
        cuArea: (c.cuArea ?? c.area) as string | undefined,
        cuCity: (c.cuCity ?? c.city) as string | undefined,
        cuCountry: (c.cuCountry ?? c.country) as string | undefined,
        accParentGuid: (c.accParentGuid as string) ?? undefined,
        branch: (c.branch as string) ?? undefined,
        numberOfInvoices: (c.numberOfInvoices as number) ?? 0,
        lastInvoices: c.lastInvoices ? new Date(c.lastInvoices as string) : undefined,
        isSync: (c.isSync as boolean) ?? false
      })

      const totalPages = Math.ceil(totalRecords / limit) || 1

      for (let page = 1; page <= totalPages; page++) {
        const data =
          page === 1
            ? firstData
            : ((
                await axios.get(`${baseUrlElectron}${endPoints.customersEndPoint().pathname}`, {
                  params: { page, limit },
                  headers: { Authorization: `Bearer ${token}` }
                })
              ).data?.data ?? [])

        if (data.length === 0) continue

        const cleaned = Array.isArray(data) ? data.map(mapApiCustomerToPrisma) : []
        await prisma.customer.createMany({ data: cleaned })
      }
    } catch (error) {
      console.error('CustomersService ~ getAllCustomersForFirstLaunchFromOnlineServer:', error)
    }
  }
}
