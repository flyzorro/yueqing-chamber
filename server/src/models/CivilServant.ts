import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { civilServantFixtureData } from '../data/civilServantFixture';

export interface CivilServantListFilters {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: 'active' | 'inactive';
}

export class CivilServantStore {
  private buildWhere(filters: CivilServantListFilters): Prisma.CivilServantWhereInput {
    const where: Prisma.CivilServantWhereInput = {};
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
          department: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          position: {
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

  private getFixtureCivilServants(filters: CivilServantListFilters = {}) {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.max(filters.limit || 10, 1);
    const keyword = filters.keyword?.trim().toLowerCase();

    const filtered = civilServantFixtureData.filter((civilServant) => {
      const matchesStatus = filters.status ? civilServant.status === filters.status : true;
      const matchesKeyword = keyword
        ? [civilServant.name, civilServant.department ?? '', civilServant.position ?? '']
            .some((value) => value.toLowerCase().includes(keyword))
        : true;

      return matchesStatus && matchesKeyword;
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

  async getPaginated(filters: CivilServantListFilters = {}) {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.max(filters.limit || 10, 1);
    const skip = (page - 1) * limit;
    const where = this.buildWhere(filters);

    try {
      const [data, total] = await Promise.all([
        prisma.civilServant.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdat: 'desc' },
        }),
        prisma.civilServant.count({ where }),
      ]);

      return { data, total, page, limit };
    } catch (error) {
      if (this.shouldUseFixtureFallback(error)) {
        console.warn('[civilServants] Prisma unavailable, falling back to empty result for getPaginated');
        return { data: [], total: 0, page, limit };
      }
      throw error;
    }
  }
}

export const civilServantStore = new CivilServantStore();
