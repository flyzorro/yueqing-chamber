import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { companyFixtureData } from '../data/companyFixture';

export interface CompanyListFilters {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: 'active' | 'inactive';
}

export class CompanyStore {
  private buildWhere(filters: CompanyListFilters): Prisma.CompanyWhereInput {
    const where: Prisma.CompanyWhereInput = {};
    const keyword = filters.keyword?.trim();

    if (filters.status) {
      where.status = filters.status;
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
      const matchesKeyword = keyword
        ? company.name.toLowerCase().includes(keyword) || (company.industry ?? '').toLowerCase().includes(keyword)
        : true;

      return matchesStatus && matchesKeyword;
    });

    const sorted = [...filtered].sort((a, b) => {
      const sortDiff = (a.sortorder ?? 0) - (b.sortorder ?? 0);
      if (sortDiff !== 0) {
        return sortDiff;
      }
      return a.createdat && b.createdat ? b.createdat.getTime() - a.createdat.getTime() : 0;
    });

    const start = (page - 1) * limit;
    const data = sorted.slice(start, start + limit);

    return {
      data,
      total: sorted.length,
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
          orderBy: [{ sortorder: 'asc' }, { createdat: 'desc' }],
        }),
        prisma.company.count({ where }),
      ]);

      return { data, total, page, limit };
    } catch (error) {
      if (this.shouldUseFixtureFallback(error)) {
        console.warn('[companies] Prisma unavailable, using fixture data for getPaginated');
        return this.getFixtureCompanies(filters);
      }
      throw error;
    }
  }
}

export const companyStore = new CompanyStore();
