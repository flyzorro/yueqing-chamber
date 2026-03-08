// Activity.ts - 活动数据模型
export interface Activity {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'ended';
  createdAt: Date;
}

export class ActivityModel {
  private activities: Map<string, Activity> = new Map();

  generateId(): string {
    // 修复：使用 substring 替代弃用的 substr
    return `activity_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  create(data: Omit<Activity, 'id' | 'createdAt'>): Activity {
    const id = this.generateId();
    const activity: Activity = {
      ...data,
      id,
      createdAt: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }

  findById(id: string): Activity | undefined {
    return this.activities.get(id);
  }

  findAll(): Activity[] {
    return Array.from(this.activities.values());
  }

  update(id: string, data: Partial<Activity>): Activity | undefined {
    const activity = this.activities.get(id);
    if (!activity) return undefined;

    const updated = { ...activity, ...data };
    this.activities.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.activities.delete(id);
  }

  register(id: string): boolean {
    const activity = this.activities.get(id);
    if (!activity) return false;
    if (activity.currentParticipants >= activity.maxParticipants) return false;

    activity.currentParticipants++;
    this.activities.set(id, activity);
    return true;
  }
}

export const activityModel = new ActivityModel();