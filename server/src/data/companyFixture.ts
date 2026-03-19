import { Company } from '@prisma/client';

const now = new Date('2026-03-10T00:00:00.000Z');

export const companyFixtureData: Company[] = [
  {
    id: 'fixture-company-001',
    name: '月清科技',
    industry: '科技服务',
    contactName: '张恺毅',
    contactPhone: '13800139001',
    summary: '专注企业数字化服务。',
    status: 'active',
    sortorder: 1,
    createdat: now,
    updatedat: now,
  },
  {
    id: 'fixture-company-002',
    name: '乐清制造集团',
    industry: '智能制造',
    contactName: '王小明',
    contactPhone: '13800139002',
    summary: '提供工业制造与供应链服务。',
    status: 'active',
    sortorder: 2,
    createdat: now,
    updatedat: now,
  },
  {
    id: 'fixture-company-003',
    name: '海纳文化传媒',
    industry: '文化传媒',
    contactName: '李雪',
    contactPhone: '13800139003',
    summary: '品牌传播与活动策划。',
    status: 'inactive',
    sortorder: 3,
    createdat: now,
    updatedat: now,
  },
  {
    id: 'fixture-company-004',
    name: '东海商贸',
    industry: '商贸流通',
    contactName: '赵敏',
    contactPhone: '13800139004',
    summary: '区域供应链与商贸合作。',
    status: 'active',
    sortorder: 4,
    createdat: now,
    updatedat: now,
  },
];
