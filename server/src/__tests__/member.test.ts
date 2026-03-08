import { MemberModel, memberModel } from '../models/Member';

describe('MemberModel', () => {
  beforeEach(() => {
    // Clear members before each test
    (memberModel as any).members.clear();
  });

  it('should create a member', () => {
    const member = memberModel.create({
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
    memberModel.create({ name: 'User 1', phone: '13800138001', company: 'C1' });
    memberModel.create({ name: 'User 2', phone: '13800138002', company: 'C2' });

    const members = memberModel.findAll();
    expect(members).toHaveLength(2);
  });

  it('should find member by id', () => {
    const created = memberModel.create({ name: 'User', phone: '13800138000', company: 'C' });
    const found = memberModel.findById(created.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe('User');
  });

  it('should update a member', () => {
    const created = memberModel.create({ name: 'User', phone: '13800138000', company: 'C' });
    const updated = memberModel.update(created.id, { name: 'Updated' });
    expect(updated?.name).toBe('Updated');
  });

  it('should delete a member', () => {
    const created = memberModel.create({ name: 'User', phone: '13800138000', company: 'C' });
    expect(memberModel.delete(created.id)).toBe(true);
    expect(memberModel.findById(created.id)).toBeUndefined();
  });
});