import prisma from '../lib/prisma';
import { activityPhotoFixtureData } from '../data/activityPhotoFixture';
import { Prisma } from '@prisma/client';

export interface ActivityPhotoCreate {
  activityId: string;
  imageUrl: string;
  caption?: string;
  sortorder?: number;
}

export interface ActivityPhotoItem {
  id: string;
  activityId: string;
  imageUrl: string;
  caption: string | null;
  sortorder: number | null;
  createdat: Date | null;
}

export class ActivityPhotoStore {
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

  private getFixturePhotos(activityId: string): ActivityPhotoItem[] {
    return activityPhotoFixtureData
      .filter((photo) => photo.activityId === activityId)
      .sort((a, b) => (a.sortorder ?? 0) - (b.sortorder ?? 0))
      .map((photo) => ({
        ...photo,
        caption: photo.caption,
        createdat: new Date(),
      }));
  }

  async getByActivityId(activityId: string): Promise<ActivityPhotoItem[]> {
    try {
      const photos = await prisma.activityPhoto.findMany({
        where: { activityId },
        orderBy: { sortorder: 'asc' },
      });
      return photos;
    } catch (error) {
      if (this.shouldUseFixtureFallback(error)) {
        console.warn('[activityPhotos] Prisma unavailable, falling back to empty photos list');
        return [];
      }
      console.error('Get activity photos error:', error);
      return [];
    }
  }

  async create(photo: ActivityPhotoCreate): Promise<ActivityPhotoItem> {
    const created = await prisma.activityPhoto.create({
      data: {
        activityId: photo.activityId,
        imageUrl: photo.imageUrl,
        caption: photo.caption,
        sortorder: photo.sortorder ?? 0,
      },
    });
    return created;
  }

  async delete(id: string): Promise<void> {
    await prisma.activityPhoto.delete({
      where: { id },
    });
  }
}

export const activityPhotoStore = new ActivityPhotoStore();
