const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding activities...');

  const activities = [
    {
      title: '2026 年新春联谊会',
      description: '乐清商会年度新春联谊活动，欢迎全体会员参加',
      date: new Date('2026-02-15T14:00:00Z'),
      location: '乐清市体育馆',
      maxparticipants: 200,
      status: 'upcoming'
    },
    {
      title: '企业家座谈会',
      description: '探讨企业发展机遇，分享管理经验',
      date: new Date('2026-04-20T09:00:00Z'),
      location: '商会会议室',
      maxparticipants: 50,
      status: 'upcoming'
    },
    {
      title: '数字化转型论坛',
      description: '邀请专家讲解企业数字化转型策略',
      date: new Date('2026-05-10T13:30:00Z'),
      location: '乐清国际大酒店',
      maxparticipants: 100,
      status: 'upcoming'
    },
    {
      title: '会员企业走访活动',
      description: '参观会员企业，增进了解与合作',
      date: new Date('2026-03-25T10:00:00Z'),
      location: '集合点：商会门口',
      maxparticipants: 30,
      status: 'completed',
      currentparticipants: 28
    }
  ];

  for (const activity of activities) {
    await prisma.activity.upsert({
      where: { title: activity.title },
      update: activity,
      create: activity,
    });
    console.log(`Upserted activity: ${activity.title}`);
  }

  console.log('Activities seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
