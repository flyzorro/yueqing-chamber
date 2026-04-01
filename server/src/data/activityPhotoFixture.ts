export interface ActivityPhotoFixture {
  id: string;
  activityId: string;
  imageUrl: string;
  caption: string;
  sortorder: number;
}

export const activityPhotoFixtureData: ActivityPhotoFixture[] = [
  {
    id: 'fixture-photo-001',
    activityId: 'fixture-activity-001',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    caption: '2024 年年会活动合影',
    sortorder: 1,
  },
  {
    id: 'fixture-photo-002',
    activityId: 'fixture-activity-001',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
    caption: '年会现场',
    sortorder: 2,
  },
  {
    id: 'fixture-photo-003',
    activityId: 'fixture-activity-001',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    caption: '嘉宾演讲',
    sortorder: 3,
  },
  {
    id: 'fixture-photo-004',
    activityId: 'fixture-activity-002',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    caption: '商务考察活动',
    sortorder: 1,
  },
  {
    id: 'fixture-photo-005',
    activityId: 'fixture-activity-002',
    imageUrl: 'https://images.unsplash.com/photo-1444653614773-995cb1ef902a?w=800',
    caption: '企业参观',
    sortorder: 2,
  },
];
