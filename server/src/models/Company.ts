import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { companyFixtureData } from '../data/companyFixture';

export interface CompanyListFilters {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: 'active' | 'inactive';
  industry?: string;
}

export class CompanyStore {
  private buildWhere(filters: CompanyListFilters): Prisma.CompanyWhereInput {
    const where: Prisma.CompanyWhereInput = {};
    const keyword = filters.keyword?.trim();

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.industry) {
      where.industry = filters.industry;
    }

    if (keyword) {
      where.OR = [
        {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          industry: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          contactName: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ];
    }

    return where;
  }

  private shouldUseFixtureFallback(error: unknown): boolean {
    if (process.env.NODE_ENV === 'production') {
      return false;
    }

    const errorCode =
      typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : undefined;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return error.code === 'P2021';
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return true;
    }

    if (errorCode === 'P2021') {
      return true;
    }

    if (error instanceof Error) {
      return (
        error.message.includes("Can't reach database server") ||
        error.message.includes('does not exist in the current database')
      );
    }

    return false;
  }

  private getFixtureCompanies(filters: CompanyListFilters = {}) {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.max(filters.limit || 10, 1);
    const keyword = filters.keyword?.trim().toLowerCase();

    const filtered = companyFixtureData.filter((company) => {
      const matchesStatus = filters.status ? company.status === filters.status : true;
      const matchesIndustry = filters.industry ? company.industry === filters.industry : true;
      const matchesKeyword = keyword
        ? [company.name, company.industry ?? '', company.contactName ?? '']
            .some((value) => value.toLowerCase().includes(keyword))
        : true;

      return matchesStatus && matchesIndustry && matchesKeyword;
    });

    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      data,
      total: filtered.length,
      page,
      limit,
    };
  }

  async getPaginated(filters: CompanyListFilters = {}) {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.max(filters.limit || 10, 1);
    const skip = (page - 1) * limit;
    const where = this.buildWhere(filters);

    try {
      const [data, total] = await Promise.all([
        prisma.company.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdat: 'desc' },
        }),
        prisma.company.count({ where }),
      ]);

      return { data, total, page, limit };
    } catch (error) {
      if (this.shouldUseFixtureFallback(error)) {
        console.warn('[companies] Prisma unavailable, falling back to empty result for getPaginated');
        return { data: [], total: 0, page, limit };
      }
      throw error;
    }
  }

  async getIndustries(): Promise<string[]> {
    try {
      const result = await prisma.company.findMany({
        select: { industry: true },
        distinct: ['industry'],
        where: {
          industry: { not: null },
        },
        orderBy: { industry: 'asc' },
      });
      return result.map((c) => c.industry!).filter(Boolean);
    } catch (error) {
      if (this.shouldUseFixtureFallback(error)) {
        console.warn('[companies] Prisma unavailable, falling back to empty industries list');
        return [];
      }
      throw error;
    }
  }
}

export const companyStore = new CompanyStore();
