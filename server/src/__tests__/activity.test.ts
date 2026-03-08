import { activityModel } from '../models/Activity';

describe('ActivityModel', () => {
  beforeEach(() => {
    (activityModel as any).activities.clear();
  });

  it('should create an activity', () => {
    const activity = activityModel.create({
      title: 'Test Activity',
      description: 'Test Description',
      date: new Date(),
      location: 'Test Location',
      maxParticipants: 10
    });

    expect(activity.id).toBeDefined();
    expect(activity.title).toBe('Test Activity');
    expect(activity.status).toBe('upcoming');
  });

  it('should register for an activity', () => {
    const activity = activityModel.create({
      title: 'Test', description: 'Test', date: new Date(),
      location: 'Test', maxParticipants: 2
    });

    expect(activityModel.register(activity.id)).toBe(true);
    expect(activityModel.register(activity.id)).toBe(true);
    expect(activityModel.register(activity.id)).toBe(false); // Max reached
  });

  it('should handle pagination', () => {
    for (let i = 0; i < 15; i++) {
      activityModel.create({
        title: `Activity ${i}`, description: 'Test', date: new Date(),
        location: 'Test', maxParticipants: 10
      });
    }

    const all = activityModel.findAll();
    expect(all).toHaveLength(15);
  });
});