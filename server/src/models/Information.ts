import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import type { InfoCategory } from '../constants/info-categories';

export interface CreateInfoRequest {
  title: string;
  content: string;
  category: InfoCategory;
  contactname?: string;
  contactphone?: string;
  publisherid: string;
}

export interface UpdateInfoRequest {
  title?: string;
  content?: string;
  category?: InfoCategory;
  contactname?: string;
  contactphone?: string;
}

export interface InfoListFilters {
  page?: number;
  limit?: number;
  category?: InfoCategory;
  publisherid?: string;
  keyword?: string;
}

export class InformationStore {
  private buildWhere(filters: InfoListFilters): Prisma.InformationWhereInput {
    const where: Prisma.InformationWhereInput = {};
    const keyword = filters.keyword?.trim();

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.publisherid) {
      where.publisherid = filters.publisherid;
    }

    if (keyword) {
      where.OR = [
        {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ];
    }

    return where;
  }

  async getPaginated(filters: InfoListFilters = {}) {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.max(filters.limit || 10, 1);
    const skip = (page - 1) * limit;
    const where = this.buildWhere(filters);

    const [data, total] = await Promise.all([
      prisma.information.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdat: 'desc' },
      }),
      prisma.information.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getById(id: string) {
    return prisma.information.findUnique({ where: { id } });
  }

  async create(data: CreateInfoRequest) {
    return prisma.information.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        contactname: data.contactname,
        contactphone: data.contactphone,
        publisherid: data.publisherid,
      },
    });
  }

  async update(id: string, data: UpdateInfoRequest) {
    return prisma.information.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await prisma.information.delete({
      where: { id },
    });
    return true;
  }

  async getCategories(): Promise<InfoCategory[]> {
    const result = await prisma.information.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return result.map((i) => i.category).filter((c): c is InfoCategory => c !== null);
  }
}

export const informationStore = new InformationStore();
