import { memberStore } from '../models/memberStore';

describe('MemberModel', () => {
  beforeEach(() => {
    // Clear members before each test
    (memberStore as any).members.clear();
  });

  it('should create a member', () => {
    const member = memberStore.create({
      name: 'Test User',
      phone: '13800138000',
      company: 'Test Company',
      position: 'CEO'
    });

    expect(member.id).toBeDefined();
    expect(member.name).toBe('Test User');
    expect(member.status).toBe('active');
  });

  it('should get all members with pagination', () => {
    memberStore.create({ name: 'User 1', phone: '13800138001', company: 'C1' });
    memberStore.create({ name: 'User 2', phone: '13800138002', company: 'C2' });

    const members = memberStore.findAll();
    expect(members).toHaveLength(2);
  });

  it('should find member by id', () => {
    const created = memberStore.create({ name: 'User', phone: '13800138000', company: 'C' });
    const found = memberStore.findById(created.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe('User');
  });

  it('should update a member', () => {
    const created = memberStore.create({ name: 'User', phone: '13800138000', company: 'C' });
    const updated = memberStore.update(created.id, { name: 'Updated' });
    expect(updated?.name).toBe('Updated');
  });

  it('should delete a member', () => {
    const created = memberStore.create({ name: 'User', phone: '13800138000', company: 'C' });
    expect(memberStore.delete(created.id)).toBe(true);
    expect(memberStore.findById(created.id)).toBeUndefined();
  });
});