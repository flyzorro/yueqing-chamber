import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { memberFixtureData } from '../data/memberFixture';

export interface CompanyDirectoryFilters {
  page?: number;
  limit?: number;
  keyword?: string;
}

export interface CompanyDirectoryEntry {
  name: string;
  memberCount: number;
}

export interface CompanyDirectoryResult {
  data: CompanyDirectoryEntry[];
  total: number;
  page: number;
  limit: number;
}

export class CompanyDirectoryStore {
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

  private aggregateCompanies(companies: string[], filters: CompanyDirectoryFilters): CompanyDirectoryResult {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.max(filters.limit || 10, 1);
    const keyword = filters.keyword?.trim().toLowerCase();

    const counts = new Map<string, number>();

    for (const rawCompany of companies) {
      const company = rawCompany.trim();

      if (!company) {
        continue;
      }

      counts.set(company, (counts.get(company) || 0) + 1);
    }

    const filtered = Array.from(counts.entries())
      .map(([name, memberCount]) => ({ name, memberCount }))
      .filter((entry) => (keyword ? entry.name.toLowerCase().includes(keyword) : true))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));

    const start = (page - 1) * limit;

    return {
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
    };
  }

  private getFixtureCompanies(filters: CompanyDirectoryFilters = {}) {
    return this.aggregateCompanies(
      memberFixtureData.map((member) => member.company),
      filters
    );
  }

  async getPaginated(filters: CompanyDirectoryFilters = {}): Promise<CompanyDirectoryResult> {
    try {
      const members = await prisma.member.findMany({
        select: {
          company: true,
        },
      });

      return this.aggregateCompanies(
        members.map((member) => member.company),
        filters
      );
    } catch (error) {
      if (this.shouldUseFixtureFallback(error)) {
        console.warn('[company-directory] Prisma unavailable, using fixture data for getPaginated');
        return this.getFixtureCompanies(filters);
      }

      throw error;
    }
  }
}

export const companyDirectoryStore = new CompanyDirectoryStore();
