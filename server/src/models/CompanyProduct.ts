import prisma from '../lib/prisma';

export interface CompanyProduct {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number | null;
  createdat: Date | null;
  updatedat: Date | null;
}

export class CompanyProductStore {
  async getByCompanyId(companyId: string): Promise<CompanyProduct[]> {
    try {
      const products = await prisma.companyProduct.findMany({
        where: { companyId },
        orderBy: [{ sortOrder: 'asc' }, { createdat: 'desc' }],
      });
      return products;
    } catch (error) {
      console.error('CompanyProductStore.getByCompanyId error:', error);
      throw error;
    }
  }
}

export const companyProductStore = new CompanyProductStore();
