import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding companies...');

  // Company address data (184 companies)
  const companies = [
    { name: "上海一康康复医院股份有限公司", address: "", industry: "" },
    { name: "上海三开电气制造股份有限公司", address: "", industry: "" },
    { name: "上海东方刺绣家纺有限公司", address: "", industry: "" },
    { name: "上海中塑管业有限公司", address: "", industry: "" },
    { name: "上海中科电气（集团）有限公司", address: "", industry: "" },
    { name: "上海丰泰实业发展有限公司", address: "", industry: "" },
    { name: "上海丹泉泵业（集团）有限公司", address: "", industry: "" },
    { name: "上海久电电力集团有限公司", address: "", industry: "" },
    { name: "上海乐成电子科技有限公司", address: "", industry: "" },
    { name: "上海乐港电器有限公司", address: "", industry: "" },
    { name: "上海于上机电设备有限公司", address: "", industry: "" },
    { name: "上海五林电控设备有限公司", address: "", industry: "" },
    { name: "上海亲易实业集团有限公司", address: "", industry: "" },
    { name: "上海人民电器开关厂有限公司  ", address: "", industry: "" },
    { name: "上海仑科电气集团有限公司", address: "", industry: "" },
    { name: "上海伊顿通用设备有限公司 ", address: "", industry: "" },
    { name: "上海众业通电缆股份有限公司", address: "", industry: "" },
    { name: "上海伟肯实业有限公司", address: "", industry: "" },
    { name: "上海侨亨实业有限公司", address: "", industry: "" },
    { name: "上海俏达健康管理有限公司", address: "", industry: "" },
    { name: "上海信统电器有限公司", address: "", industry: "" },
    { name: "上海凯士邦企业发展有限公司", address: "", industry: "" },
    { name: "上海分镜文化传媒有限公司", address: "", industry: "" },
    { name: "上海创力集团股份有限公司", address: "", industry: "" },
    { name: "上海北变科技股份有限公司", address: "", industry: "" },
    { name: "上海千洲实业有限公司", address: "", industry: "" },
    { name: "上海华一电气（集团）有限公司", address: "", industry: "" },
    { name: "上海华容防爆科技有限公司", address: "", industry: "" },
    { name: "上海卓帅汽车技术有限公司 ", address: "", industry: "" },
    { name: "上海南自科技股份有限公司", address: "", industry: "" },
    { name: "上海友邦电气（集团）股份有限公司", address: "", industry: "" },
    { name: "上海同燕堂生物科技有限责任公司", address: "", industry: "" },
    { name: "上海启世投资管理有限公司", address: "", industry: "" },
    { name: "上海和田光电技术有限公司", address: "", industry: "" },
    { name: "上海嘉强典当有限公司", address: "", industry: "" },
    { name: "上海嘉盟电力设备有限公司", address: "", industry: "" },
    { name: "上海嘉红食品有限公司", address: "", industry: "" },
    { name: "上海固安祥电气配套有限公司", address: "", industry: "" },
    { name: "上海圆正财务咨询有限公司", address: "", industry: "" },
    { name: "上海埃科燃气测控设备有限公司", address: "", industry: "" },
    { name: "上海基燕机电有限公司", address: "", industry: "" },
    { name: "上海基艳机电有限公司", address: "", industry: "" },
    { name: "上海复大品牌研究所有限公司", address: "", industry: "" },
    { name: "上海天银电器有限公司", address: "", industry: "" },
    { name: "上海奇皮尔电气制造有限公司 ", address: "", industry: "" },
    { name: "上海婴珂商贸有限公司", address: "", industry: "" },
    { name: "上海安南正泰集团电器有限公司", address: "", industry: "" },
    { name: "上海宏挺机械设备制造有限公司 上海宏挺紧固件制造有限公司", address: "", industry: "" },
    { name: "上海宝临照明科技股份有限公司", address: "", industry: "" },
    { name: "上海宝临防爆电器有限公司", address: "", industry: "" },
    { name: "上海宝鹿车业有限公司", address: "", industry: "" },
    { name: "上海展元国际贸易有限公司", address: "", industry: "" },
    { name: "上海市少年儿童业余美术学校", address: "", industry: "" },
    { name: "上海希富实业发展有限公司", address: "", industry: "" },
    { name: "上海建桥集团", address: "", industry: "" },
    { name: "上海循道新能源科技有限公司", address: "", industry: "" },
    { name: "上海德力西集团有限公司", address: "", industry: "" },
    { name: "上海德宝密封件有限公司", address: "", industry: "" },
    { name: "上海德首实业有限公司", address: "", industry: "" },
    { name: "上海怀惠实业有限公司", address: "", industry: "" },
    { name: "上海户泰五金机电有限公司", address: "", industry: "" },
    { name: "上海文歌电气有限公司", address: "", industry: "" },
    { name: "上海新缆电缆有限公司", address: "", industry: "" },
    { name: "上海新龙塑料制造有限公司", address: "", industry: "" },
    { name: "上海日晋工程塑料有限公司", address: "", industry: "" },
    { name: "上海易维堡信息科技有限公司", address: "", industry: "" },
    { name: "上海昶鑫诚建筑工程有限公司", address: "", industry: "" },
    { name: "上海晟江机械设备有限公司", address: "", industry: "" },
    { name: "上海晶茂投资有限公司", address: "", industry: "" },
    { name: "上海朗浩控股有限公司", address: "", industry: "" },
    { name: "上海来石文化创意设计有限公司", address: "", industry: "" },
    { name: "上海柏威流体控制技术有限公司", address: "", industry: "" },
    { name: "上海柯付林实业有限公司", address: "", industry: "" },
    { name: "上海柯正资产管理有限公司", address: "", industry: "" },
    { name: "上海格林德斯木业有限公司", address: "", industry: "" },
    { name: "上海欣咏电子有限公司", address: "", industry: "" },
    { name: "上海欧士通机电设备有限公司", address: "", industry: "" },
    { name: "上海歌特维生物科技集团", address: "", industry: "" },
    { name: "上海正泰电器销售有限公司", address: "", industry: "" },
    { name: "上海永源企业发展股份有限公司", address: "", industry: "" },
    { name: "上海永瑞流体技术有限公司", address: "", industry: "" },
    { name: "上海永进电缆（集团）有限公司", address: "", industry: "" },
    { name: "上海浙南物流有限公司", address: "", industry: "" },
    { name: "上海浙商典当有限公司", address: "", industry: "" },
    { name: "上海浦东电线电缆（集团）有限公司", address: "", industry: "" },
    { name: "上海浦东软件园汇智科技有限公司", address: "", industry: "" },
    { name: "上海浦广科技（集团）有限公司", address: "", industry: "" },
    { name: "上海海之仙餐饮管理有限公司", address: "", industry: "" },
    { name: "上海涵博生物科技有限公司", address: "", industry: "" },
    { name: "上海港程投资咨询有限公司", address: "", industry: "" },
    { name: "上海瑞奇汽配有限公司", address: "", industry: "" },
    { name: "上海瓯亚机电设备有限公司", address: "", industry: "" },
    { name: "上海申之江珠宝集团有限公司", address: "", industry: "" },
    { name: "上海申开电力建设工程有限公司", address: "", industry: "" },
    { name: "上海申旗投资有限公司、上海国延堂医药科技有限公司", address: "", industry: "" },
    { name: "上海电享信息科技有限公司", address: "", industry: "" },
    { name: "上海电器厂实业有限公司", address: "", industry: "" },
    { name: "上海皋金实业有限公司", address: "", industry: "" },
    { name: "上海盛临贸易有限公司", address: "", industry: "" },
    { name: "上海盛佰贸易有限公司", address: "", industry: "" },
    { name: "上海盛鑫糖酒食品有限公司", address: "", industry: "" },
    { name: "上海硕玛电气有限公司", address: "", industry: "" },
    { name: "上海科常工程管理咨询中心", address: "", industry: "" },
    { name: "上海穆勒四通电气股份有限公司", address: "", industry: "" },
    { name: "上海精珅新材料有限公司", address: "", industry: "" },
    { name: "上海精科智能科技股份有限公司", address: "", industry: "" },
    { name: "上海索谷电缆集团有限公司", address: "", industry: "" },
    { name: "上海美上置业开发有限公司", address: "", industry: "" },
    { name: "上海美岛电气配套有限公司", address: "", industry: "" },
    { name: "上海耐力电控设备有限公司", address: "", industry: "" },
    { name: "上海联华变压器厂有限公司", address: "", industry: "" },
    { name: "上海胜华特种电缆有限公司", address: "", industry: "" },
    { name: "上海胜华环保科技集团有限公司 ", address: "", industry: "" },
    { name: "上海胜华电气股份有限公司", address: "", industry: "" },
    { name: "上海胜华电缆科技集团有限公司", address: "", industry: "" },
    { name: "上海节高电子科技有限公司", address: "", industry: "" },
    { name: "上海菲姿服饰有限公司", address: "", industry: "" },
    { name: " 上海西源宏电气设备有限公司 ", address: "", industry: "" },
    { name: "上海豪进钢铁贸易有限公司", address: "", industry: "" },
    { name: "上海贝特医疗器械有限公司", address: "", industry: "" },
    { name: "上海贺新投资咨询有限公司", address: "", industry: "" },
    { name: "上海通用重工集团有限公司", address: "", industry: "" },
    { name: "上海郑民电器有限公司", address: "", industry: "" },
    { name: "上海野马浜律师事务所", address: "", industry: "" },
    { name: "上海金开利集团", address: "", industry: "" },
    { name: "上海金电铜业有限公司", address: "", industry: "" },
    { name: "上海金蓝机电设备成套有限公司", address: "", industry: "" },
    { name: "上海金诚建设发展有限公司", address: "", industry: "" },
    { name: "上海金钟电气集团", address: "", industry: "" },
    { name: "上海鑫中兴防爆科技有限公司", address: "", industry: "" },
    { name: "上海鑫颖金属材料有限公司", address: "", industry: "" },
    { name: "上海长江电气设备集团有限公司", address: "", industry: "" },
    { name: "上海隆众产业园", address: "", industry: "" },
    { name: "上海隆众原生物科技有限公司 ", address: "", industry: "" },
    { name: "上海雅易电气有限公司", address: "", industry: "" },
    { name: "上海飞策防爆电器有限公司", address: "", industry: "" },
    { name: "上海鸿幸盛实业有限公司", address: "", industry: "" },
    { name: "上海龙泓国际贸易有限公司", address: "", industry: "" },
    { name: "东禾健康管理（上海）有限公司", address: "", industry: "" },
    { name: "中变集团上海变压器有限公司", address: "", industry: "" },
    { name: "中期贵金属电子商务（上海）有限公司", address: "", industry: "" },
    { name: "中通云商供应链有限公司", address: "", industry: "" },
    { name: "中通快递股份有限公司", address: "", industry: "" },
    { name: "乐清农商银行", address: "", industry: "" },
    { name: "乐清市金春石斛有限公司", address: "", industry: "" },
    { name: "光大证券股份有限公司", address: "", industry: "" },
    { name: "北京市京师（上海）律师事务所", address: "", industry: "" },
    { name: "华泰证券股份有限公司", address: "", industry: "" },
    { name: "华荣科技股份有限公司", address: "", industry: "" },
    { name: "南亚新材料科技股份有限公司", address: "", industry: "" },
    { name: "南喆电气科技（上海）有限公司", address: "", industry: "" },
    { name: "古墨风韵（杭州）影视文化传媒有限责任公司", address: "", industry: "" },
    { name: "合兴集团有限公司", address: "", industry: "" },
    { name: "夜光杯酒业", address: "", industry: "" },
    { name: "安能允智慧（上海）能源有限公司", address: "", industry: "" },
    { name: "平安银行股份有限公司上海外滩支行", address: "", industry: "" },
    { name: "德标管业（上海）有限公司", address: "", industry: "" },
    { name: "德汇实业集团有限公司", address: "", industry: "" },
    { name: "德汇融资租赁有限公司", address: "", industry: "" },
    { name: "悦儿国际贸易（上海）有限公司", address: "", industry: "" },
    { name: "泽大（上海）律师事务所", address: "", industry: "" },
    { name: "浙商银行上海分行", address: "", industry: "" },
    { name: "浙江乐粉轨道交通科技有限公司", address: "", industry: "" },
    { name: "浙江天正电气股份有限公司", address: "", industry: "" },
    { name: "浙江敏乐船舶科技有限公司", address: "", industry: "" },
    { name: "海通证券股份有限公司", address: "", industry: "" },
    { name: "深圳市瓯亚凯科技有限公司上海办事处", address: "", industry: "" },
    { name: "温州银行上海分行松江业务部", address: "", industry: "" },
    { name: "爱康企业集团（上海）有限公司", address: "", industry: "" },
    { name: "电光防爆科技（上海）有限公司", address: "", industry: "" },
    { name: "电光防爆科技股份有限公司", address: "", industry: "" },
    { name: "电管家集团股份有限公司", address: "", industry: "" },
    { name: "立帮秀珀化工涂料有限公司", address: "", industry: "" },
    { name: "紫宸峰（上海）贸易有限公司", address: "", industry: "" },
    { name: "美丰农业科技（上海）有限公司", address: "", industry: "" },
    { name: "衡宝科技（上海）有限公司", address: "", industry: "" },
    { name: "财源在线（上海）网络科技有限公司", address: "", industry: "" },
    { name: "长城电器集团上海有限公司", address: "", industry: "" },
  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: { name: company.name },
      update: { address: company.address },
      create: company,
    });
  }

  console.log(`Seeded ${companies.length} companies.`);

  // Product data for 178 companies with Unsplash images
  const productSeeds = [
    {
      companyName: '上海一康康复医院股份有限公司',
      products: [
        { seedKey: '上海一康康复医院股份有限公司-0', name: '物理治疗', description: '运动康复与理疗服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海一康康复医院股份有限公司-1', name: '康复医疗', description: '神经系统康复诊疗服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1519489985013-54a93f6d59f3?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海三开电气制造股份有限公司',
      products: [
        { seedKey: '上海三开电气制造股份有限公司-0', name: '万能式断路器', description: '适用于交流 50Hz，额定工作电压至 690V，额定工作电流至 6300A 的配电网络中，用来分配电能和保护线路及电源设备免受过载、欠电压、短路、接地等故障的危害。', sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海三开电气制造股份有限公司-1', name: '塑壳断路器', description: '适用于交流 50Hz/60Hz，额定绝缘电压至 800V，额定工作电流至 1600A 的配电系统中，用于保护电缆、线路和用电设备。', sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海三开电气制造股份有限公司-2', name: '交流接触器', description: '适用于交流 50Hz/60Hz，额定工作电压至 690V，额定工作电流至 95A 的电路中，用于远距离接通和分断电路。', sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海东方刺绣家纺有限公司',
      products: [
        { seedKey: '上海东方刺绣家纺有限公司-0', name: '刺绣家纺', description: '手工刺绣床上用品系列', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1479714828517-66e60a67b6f5?w=400&h=300&fit=crop' },
        { seedKey: '上海东方刺绣家纺有限公司-1', name: '丝绸制品', description: '真丝家纺与工艺品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1528459806-f752f2a6a960?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海中塑管业有限公司',
      products: [
        { seedKey: '上海中塑管业有限公司-0', name: 'PVC 排水管', description: '硬聚氯乙烯排水管道', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581092149559-3a38e7a4a0c7?w=400&h=300&fit=crop' },
        { seedKey: '上海中塑管业有限公司-1', name: 'PE 给水管', description: '聚乙烯给水管道系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1504915783-7e9f7d5b4f17?w=400&h=300&fit=crop' },
        { seedKey: '上海中塑管业有限公司-2', name: 'PPR 管', description: '无规共聚聚丙烯管材', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1504915783-7e9f7d5b4f17?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海中科电气（集团）有限公司',
      products: [
        { seedKey: '上海中科电气（集团）有限公司-0', name: '高压开关柜', description: 'KYN28-12 系列铠装移开式交流金属封闭开关设备', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1507670253-e184d4b3f568?w=400&h=300&fit=crop' },
        { seedKey: '上海中科电气（集团）有限公司-1', name: '箱式变电站', description: 'YBW 系列预装式变电站', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海中科电气（集团）有限公司-2', name: '低压配电柜', description: 'GCS 系列低压抽出式开关柜', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海丰泰实业发展有限公司',
      products: [
        { seedKey: '上海丰泰实业发展有限公司-0', name: '物业服务', description: '商业物业管理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1486404931741-80f7f721fb44?w=400&h=300&fit=crop' },
        { seedKey: '上海丰泰实业发展有限公司-1', name: '实业开发', description: '产业园区开发与运营', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1590244875088-6f9a7c5a5f69?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海丹泉泵业（集团）有限公司',
      products: [
        { seedKey: '上海丹泉泵业（集团）有限公司-0', name: '离心泵', description: 'ISG 系列管道离心泵', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581092149559-3a38e7a4a0c7?w=400&h=300&fit=crop' },
        { seedKey: '上海丹泉泵业（集团）有限公司-1', name: '消防泵', description: 'XBD 系列消防稳压泵', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581092149559-3a38e7a4a0c7?w=400&h=300&fit=crop' },
        { seedKey: '上海丹泉泵业（集团）有限公司-2', name: '排污泵', description: 'WQ 系列潜水排污泵', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581092149559-3a38e7a4a0c7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海久电电力集团有限公司',
      products: [
        { seedKey: '上海久电电力集团有限公司-0', name: '高压断路器', description: 'ZW32-12 系列户外高压真空断路器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海久电电力集团有限公司-1', name: '电力变压器', description: 'S11-M 系列油浸式电力变压器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海乐成电子科技有限公司',
      products: [
        { seedKey: '上海乐成电子科技有限公司-0', name: '连接器', description: '电子连接器、接插件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1518770523000-9715898db5bf?w=400&h=300&fit=crop' },
        { seedKey: '上海乐成电子科技有限公司-1', name: '电子元器件', description: '贴片电容、电阻等被动元件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1518770523000-9715898db5bf?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海乐港电器有限公司',
      products: [
        { seedKey: '上海乐港电器有限公司-0', name: '插座', description: '家用电源插座', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海乐港电器有限公司-1', name: '墙壁开关', description: 'LK 系列家用墙壁开关', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1507670253-e184d4b3f568?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海于上机电设备有限公司',
      products: [
        { seedKey: '上海于上机电设备有限公司-0', name: '机电设备', description: '工业自动化设备', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海于上机电设备有限公司-1', name: '机械配件', description: '非标机械零部件加工', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1504915783-7e9f7d5b4f17?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海五林电控设备有限公司',
      products: [
        { seedKey: '上海五林电控设备有限公司-0', name: '电控设备', description: '低压电控柜、控制箱', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海五林电控设备有限公司-1', name: '配电箱', description: '动力配电箱、照明箱', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海亲易实业集团有限公司',
      products: [
        { seedKey: '上海亲易实业集团有限公司-0', name: '物业管理', description: '商业物业管理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
        { seedKey: '上海亲易实业集团有限公司-1', name: '实业投资', description: '多元化投资', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海人民电器开关厂有限公司  ',
      products: [
        { seedKey: '上海人民电器开关厂有限公司  -0', name: 'RMW1 万能式断路器', description: '智能型万能式断路器，额定电流 630A-6300A，适用于配电系统保护', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海人民电器开关厂有限公司  -1', name: 'RMC1 小型断路器', description: '家用及工业用小型断路器，额定电流 1A-63A', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海人民电器开关厂有限公司  -2', name: 'RMM1 塑壳断路器', description: '塑料外壳式断路器，额定电流 10A-1600A，适用于配电保护', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海仑科电气集团有限公司',
      products: [
        { seedKey: '上海仑科电气集团有限公司-0', name: '变频器', description: 'LK 系列交流变频调速器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海仑科电气集团有限公司-1', name: '软启动器', description: 'LKR 系列电机软启动装置', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海伊顿通用设备有限公司 ',
      products: [
        { seedKey: '上海伊顿通用设备有限公司 -0', name: '通用设备', description: '工业通用设备销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海伊顿通用设备有限公司 -1', name: '机械租赁', description: '机械设备租赁服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1504915783-7e9f7d5b4f17?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海众业通电缆股份有限公司',
      products: [
        { seedKey: '上海众业通电缆股份有限公司-0', name: '充电桩电缆', description: '电动汽车充电专用电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海众业通电缆股份有限公司-1', name: '防火电缆', description: 'BTLY 系列铝合金矿物绝缘防火电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海伟肯实业有限公司',
      products: [
        { seedKey: '上海伟肯实业有限公司-0', name: '贸易代理', description: '进出口贸易代理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海伟肯实业有限公司-1', name: '实业投资', description: '产业项目投资', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海侨亨实业有限公司',
      products: [
        { seedKey: '上海侨亨实业有限公司-0', name: '建筑材料', description: '建筑装饰材料', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1486404931741-80f7f721fb44?w=400&h=300&fit=crop' },
        { seedKey: '上海侨亨实业有限公司-1', name: '金属材料', description: '不锈钢、铝合金材料', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海俏达健康管理有限公司',
      products: [
        { seedKey: '上海俏达健康管理有限公司-0', name: '养生服务', description: '中医养生与调理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海俏达健康管理有限公司-1', name: '健康咨询', description: '健康管理与咨询服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1576091168172-9c6a5a4f8fb6?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海信统电器有限公司',
      products: [
        { seedKey: '上海信统电器有限公司-0', name: '稳压器', description: 'TNS 系列三相交流稳压器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海信统电器有限公司-1', name: '调压器', description: 'TDGC 系列接触式调压器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海凯士邦企业发展有限公司',
      products: [
        { seedKey: '上海凯士邦企业发展有限公司-0', name: '园区运营', description: '产业园区运营与管理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海凯士邦企业发展有限公司-1', name: '企业服务', description: '企业孵化与成长服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海分镜文化传媒有限公司',
      products: [
        { seedKey: '上海分镜文化传媒有限公司-0', name: '影视制作', description: '影视广告制作服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海分镜文化传媒有限公司-1', name: '文化传媒', description: '文化传播与活动策划', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海创力集团股份有限公司',
      products: [
        { seedKey: '上海创力集团股份有限公司-0', name: '掘进机', description: 'EBZ 系列悬臂式掘进机', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海创力集团股份有限公司-1', name: '采煤机', description: 'MG 系列滚筒式采煤机', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海北变科技股份有限公司',
      products: [
        { seedKey: '上海北变科技股份有限公司-0', name: '欧式箱变', description: 'YB 系列预装式变电站', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海北变科技股份有限公司-1', name: '非晶合金变压器', description: 'SBH15 系列非晶合金配电变压器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海千洲实业有限公司',
      products: [
        { seedKey: '上海千洲实业有限公司-0', name: '化工产品', description: '化工原料、助剂', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海千洲实业有限公司-1', name: '塑料制品', description: '塑料原料、改性塑料', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海华一电气（集团）有限公司',
      products: [
        { seedKey: '上海华一电气（集团）有限公司-0', name: '防爆配电箱', description: '适用于石油、化工、医药、航天、军工等爆炸性气体环境 1 区、2 区危险场所，具有防爆、防腐、防护等功能。', sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海华一电气（集团）有限公司-1', name: '防爆荧光灯', description: '适用于爆炸性气体环境 1 区、2 区危险场所，IIA、IIB、IIC 类爆炸性气体环境，防护等级 IP65，适用于石油采炼、储存、化工、医药、纺织、印染、军事设施等爆炸性危险环境。', sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
        { seedKey: '上海华一电气（集团）有限公司-2', name: '防爆应急灯', description: '适用于爆炸性气体环境 1 区、2 区危险场所，内置镍镉电池，应急时间 90 分钟以上，防护等级 IP65，适用于石油、化工、军队、医药等行业。', sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海华容防爆科技有限公司',
      products: [
        { seedKey: '上海华容防爆科技有限公司-0', name: '防爆接线盒', description: 'BJH 系列防爆接线盒', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
        { seedKey: '上海华容防爆科技有限公司-1', name: '防爆控制箱', description: 'BKX 系列防爆控制箱', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海卓帅汽车技术有限公司 ',
      products: [
        { seedKey: '上海卓帅汽车技术有限公司 -0', name: '汽车技术', description: '汽车技术研发与服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1494905998402-395930813141?w=400&h=300&fit=crop' },
        { seedKey: '上海卓帅汽车技术有限公司 -1', name: '零部件', description: '汽车零部件销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海南自科技股份有限公司',
      products: [
        { seedKey: '上海南自科技股份有限公司-0', name: '继电保护装置', description: '线路微机保护装置', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海南自科技股份有限公司-1', name: '电力自动化系统', description: '变电站综合自动化系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497484843679-6a4c50f4a1a8?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海友邦电气（集团）股份有限公司',
      products: [
        { seedKey: '上海友邦电气（集团）股份有限公司-0', name: '接触器', description: 'YBC 系列交流接触器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海友邦电气（集团）股份有限公司-1', name: '智能断路器', description: 'YBW 系列智能型万能式断路器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海同燕堂生物科技有限责任公司',
      products: [
        { seedKey: '上海同燕堂生物科技有限责任公司-0', name: '生物科技', description: '生物制品研发与销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop' },
        { seedKey: '上海同燕堂生物科技有限责任公司-1', name: '健康产品', description: '保健与健康产品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1576091168172-9c6a5a4f8fb6?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海启世投资管理有限公司',
      products: [
        { seedKey: '上海启世投资管理有限公司-0', name: '投资顾问', description: '专业投资咨询服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
        { seedKey: '上海启世投资管理有限公司-1', name: '资产管理', description: '资产组合管理与配置', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海和田光电技术有限公司',
      products: [
        { seedKey: '上海和田光电技术有限公司-0', name: '照明工程', description: '照明工程设计', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
        { seedKey: '上海和田光电技术有限公司-1', name: '光电产品', description: 'LED 光电产品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海嘉强典当有限公司',
      products: [
        { seedKey: '上海嘉强典当有限公司-0', name: '典当服务', description: '民品质押典当', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1589824964234-c6a3c57c7033?w=400&h=300&fit=crop' },
        { seedKey: '上海嘉强典当有限公司-1', name: '绝当品销售', description: '绝当品销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海嘉盟电力设备有限公司',
      products: [
        { seedKey: '上海嘉盟电力设备有限公司-0', name: '电缆附件', description: '10kV 冷缩电缆终端头', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海嘉盟电力设备有限公司-1', name: '电力金具', description: 'JP 系列电缆金具', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497484843679-6a4c50f4a1a8?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海嘉红食品有限公司',
      products: [
        { seedKey: '上海嘉红食品有限公司-0', name: '进口食品', description: '进口食品贸易', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1490464596296-8b6e45a89782?w=400&h=300&fit=crop' },
        { seedKey: '上海嘉红食品有限公司-1', name: '食品销售', description: '休闲食品与饮料销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1490464596296-8b6e45a89782?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海固安祥电气配套有限公司',
      products: [
        { seedKey: '上海固安祥电气配套有限公司-0', name: '电缆桥架', description: 'XQJ 系列电缆桥架', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海固安祥电气配套有限公司-1', name: '母线槽', description: 'GAM 系列密集绝缘母线槽', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海圆正财务咨询有限公司',
      products: [
        { seedKey: '上海圆正财务咨询有限公司-0', name: '税务筹划', description: '税务规划与代理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海圆正财务咨询有限公司-1', name: '财务咨询', description: '企业财务顾问服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海埃科燃气测控设备有限公司',
      products: [
        { seedKey: '上海埃科燃气测控设备有限公司-0', name: '燃气报警器', description: '可燃气体检测报警器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海埃科燃气测控设备有限公司-1', name: '燃气表', description: '工业用燃气计量表', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海基燕机电有限公司',
      products: [
        { seedKey: '上海基燕机电有限公司-0', name: '电动机', description: 'Y 系列三相异步电动机', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1593945699-4e0a6e7a1b0f?w=400&h=300&fit=crop' },
        { seedKey: '上海基燕机电有限公司-1', name: '减速机', description: '齿轮减速机', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海基艳机电有限公司',
      products: [
        { seedKey: '上海基艳机电有限公司-0', name: '风机', description: '工业离心风机', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海基艳机电有限公司-1', name: '水泵', description: '管道泵、离心泵', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581092149559-3a38e7a4a0c7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海复大品牌研究所有限公司',
      products: [
        { seedKey: '上海复大品牌研究所有限公司-0', name: '品牌咨询', description: '品牌战略策划服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海复大品牌研究所有限公司-1', name: '市场研究', description: '市场调研、数据分析', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海天银电器有限公司',
      products: [
        { seedKey: '上海天银电器有限公司-0', name: '继电器', description: 'TH 系列热过载继电器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海天银电器有限公司-1', name: '启动器', description: 'QC 系列电磁启动器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海奇皮尔电气制造有限公司 ',
      products: [
        { seedKey: '上海奇皮尔电气制造有限公司 -0', name: '开关插座', description: '家用开关插座', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1507670253-e184d4b3f568?w=400&h=300&fit=crop' },
        { seedKey: '上海奇皮尔电气制造有限公司 -1', name: '电气制造', description: '低压电器产品制造', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海婴珂商贸有限公司',
      products: [
        { seedKey: '上海婴珂商贸有限公司-0', name: '商贸服务', description: '母婴产品贸易服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海婴珂商贸有限公司-1', name: '母婴用品', description: '婴幼儿服装与用品销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海安南正泰集团电器有限公司',
      products: [
        { seedKey: '上海安南正泰集团电器有限公司-0', name: '隔离开关', description: 'HG 系列熔断器式隔离开关', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1507670253-e184d4b3f568?w=400&h=300&fit=crop' },
        { seedKey: '上海安南正泰集团电器有限公司-1', name: '漏电断路器', description: 'NL 系列漏电保护断路器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海宏挺机械设备制造有限公司 上海宏挺紧固件制造有限公司',
      products: [
        { seedKey: '上海宏挺机械设备制造有限公司 上海宏挺紧固件制造有限公司-0', name: '机械配件', description: '各类机械零部件加工', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1504915783-7e9f7d5b4f17?w=400&h=300&fit=crop' },
        { seedKey: '上海宏挺机械设备制造有限公司 上海宏挺紧固件制造有限公司-1', name: '紧固件', description: '高强度螺栓、螺母', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海宝临照明科技股份有限公司',
      products: [
        { seedKey: '上海宝临照明科技股份有限公司-0', name: 'LED 工矿灯', description: 'LED 工矿照明灯具', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海宝临照明科技股份有限公司-1', name: '防爆灯', description: 'BAD 系列防爆节能灯', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海宝临防爆电器有限公司',
      products: [
        { seedKey: '上海宝临防爆电器有限公司-0', name: '防爆配电箱', description: 'BLDX 系列防爆照明 (动力) 配电箱', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海宝临防爆电器有限公司-1', name: '防爆灯具', description: 'BLD 系列防爆节能灯', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海宝鹿车业有限公司',
      products: [
        { seedKey: '上海宝鹿车业有限公司-0', name: '电动摩托车', description: '电动轻便摩托车', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1593945699-4e0a6e7a1b0f?w=400&h=300&fit=crop' },
        { seedKey: '上海宝鹿车业有限公司-1', name: '电动自行车', description: '新国标电动自行车', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1593945699-4e0a6e7a1b0f?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海展元国际贸易有限公司',
      products: [
        { seedKey: '上海展元国际贸易有限公司-0', name: '跨境电商', description: '跨境电商平台服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海展元国际贸易有限公司-1', name: '进出口贸易', description: '国际贸易与供应链服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海市少年儿童业余美术学校',
      products: [
        { seedKey: '上海市少年儿童业余美术学校-0', name: '美术培训', description: '少儿美术教育与培训', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海市少年儿童业余美术学校-1', name: '艺术活动', description: '少儿艺术活动策划', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海希富实业发展有限公司',
      products: [
        { seedKey: '上海希富实业发展有限公司-0', name: '商业运营', description: '商业综合体运营管理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海希富实业发展有限公司-1', name: '实业开发', description: '产业园区开发运营', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1590244875088-6f9a7c5a5f69?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海建桥集团',
      products: [
        { seedKey: '上海建桥集团-0', name: '培训服务', description: '职业技能培训', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海建桥集团-1', name: '教育服务', description: '高等教育、继续教育服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海循道新能源科技有限公司',
      products: [
        { seedKey: '上海循道新能源科技有限公司-0', name: '储能系统', description: '工商业储能系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1548375921-4e18a0a5a3ca?w=400&h=300&fit=crop' },
        { seedKey: '上海循道新能源科技有限公司-1', name: '充电桩', description: '电动汽车直流/交流充电桩', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1593945699-4e0a6e7a1b0f?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海德力西集团有限公司',
      products: [
        { seedKey: '上海德力西集团有限公司-0', name: 'CDB 小型断路器', description: '德力西 CDB 系列家用断路器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海德力西集团有限公司-1', name: 'CDM1 塑壳断路器', description: '德力西 CDM1 系列塑壳断路器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海德宝密封件有限公司',
      products: [
        { seedKey: '上海德宝密封件有限公司-0', name: '橡胶制品', description: '各类橡胶密封制品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海德宝密封件有限公司-1', name: '密封圈', description: 'O 型圈、Y 型圈密封件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海德首实业有限公司',
      products: [
        { seedKey: '上海德首实业有限公司-0', name: '贸易服务', description: '商品贸易', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海德首实业有限公司-1', name: '实业投资', description: '产业投资', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海怀惠实业有限公司',
      products: [
        { seedKey: '上海怀惠实业有限公司-0', name: '贸易代理', description: '进出口贸易代理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海怀惠实业有限公司-1', name: '实业投资', description: '产业投资与运营', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海户泰五金机电有限公司',
      products: [
        { seedKey: '上海户泰五金机电有限公司-0', name: '五金工具', description: '手动工具、电动工具', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海户泰五金机电有限公司-1', name: '紧固件', description: '螺栓、螺母、垫圈', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海文歌电气有限公司',
      products: [
        { seedKey: '上海文歌电气有限公司-0', name: '电涌保护器', description: 'WG 系列电源电涌保护器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海文歌电气有限公司-1', name: '浪涌保护器', description: '信号浪涌保护器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海新缆电缆有限公司',
      products: [
        { seedKey: '上海新缆电缆有限公司-0', name: '铝合金电缆', description: 'YJLHV 系列铝合金电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海新缆电缆有限公司-1', name: '光伏电缆', description: 'PV1-F 系列光伏专用电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海新龙塑料制造有限公司',
      products: [
        { seedKey: '上海新龙塑料制造有限公司-0', name: '塑料管材', description: 'PE、PPR 塑料管材', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1504915783-7e9f7d5b4f17?w=400&h=300&fit=crop' },
        { seedKey: '上海新龙塑料制造有限公司-1', name: '塑料制品', description: '各类注塑塑料制品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海日晋工程塑料有限公司',
      products: [
        { seedKey: '上海日晋工程塑料有限公司-0', name: '工程塑料', description: '高性能工程塑料粒子', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海日晋工程塑料有限公司-1', name: '塑料制品', description: '塑料注塑与加工', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海易维堡信息科技有限公司',
      products: [
        { seedKey: '上海易维堡信息科技有限公司-0', name: '系统集成', description: 'IT 系统集成解决方案', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海易维堡信息科技有限公司-1', name: '软件开发', description: '企业管理软件开发与服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1571119244388-86521f61d5cb?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海昶鑫诚建筑工程有限公司',
      products: [
        { seedKey: '上海昶鑫诚建筑工程有限公司-0', name: '建筑工程', description: '建筑工程施工总承包', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1486404931741-80f7f721fb44?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海晟江机械设备有限公司',
      products: [
        { seedKey: '上海晟江机械设备有限公司-0', name: '食品机械', description: '食品加工设备', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1490464596296-8b6e45a89782?w=400&h=300&fit=crop' },
        { seedKey: '上海晟江机械设备有限公司-1', name: '包装机械', description: '自动包装机、封装机', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1504915783-7e9f7d5b4f17?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海晶茂投资有限公司',
      products: [
        { seedKey: '上海晶茂投资有限公司-0', name: '财务顾问', description: '企业财务咨询服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海晶茂投资有限公司-1', name: '投资管理', description: '股权与证券投资', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海朗浩控股有限公司',
      products: [
        { seedKey: '上海朗浩控股有限公司-0', name: '控股投资', description: '产业投资与资产管理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
        { seedKey: '上海朗浩控股有限公司-1', name: '企业管理', description: '集团企业管理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海来石文化创意设计有限公司',
      products: [
        { seedKey: '上海来石文化创意设计有限公司-0', name: '创意设计', description: '品牌视觉设计服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海来石文化创意设计有限公司-1', name: '文创产品', description: '文化创意产品开发', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海柏威流体控制技术有限公司',
      products: [
        { seedKey: '上海柏威流体控制技术有限公司-0', name: '流体控制', description: '流体控制系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海柏威流体控制技术有限公司-1', name: '阀门', description: '工业阀门产品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581092149559-3a38e7a4a0c7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海柯付林实业有限公司',
      products: [
        { seedKey: '上海柯付林实业有限公司-0', name: '实业投资', description: '产业项目投资', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
        { seedKey: '上海柯付林实业有限公司-1', name: '建材销售', description: '建筑材料销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1503380056-a24851806ba1?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海柯正资产管理有限公司',
      products: [
        { seedKey: '上海柯正资产管理有限公司-0', name: '资产管理', description: '资产组合管理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
        { seedKey: '上海柯正资产管理有限公司-1', name: '投资咨询', description: '投资顾问服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海格林德斯木业有限公司',
      products: [
        { seedKey: '上海格林德斯木业有限公司-0', name: '木门', description: '实木门与复合门', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海格林德斯木业有限公司-1', name: '木地板', description: '实木与复合木地板', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海欣咏电子有限公司',
      products: [
        { seedKey: '上海欣咏电子有限公司-0', name: '电子线束', description: '各类电子线束加工', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1518770523000-9715898db5bf?w=400&h=300&fit=crop' },
        { seedKey: '上海欣咏电子有限公司-1', name: '数据线', description: 'USB、HDMI 数据线', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海欧士通机电设备有限公司',
      products: [
        { seedKey: '上海欧士通机电设备有限公司-0', name: '自动化设备', description: '工业自动化控制系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海欧士通机电设备有限公司-1', name: '机电设备', description: '工业机电设备销售与维修', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海歌特维生物科技集团',
      products: [
        { seedKey: '上海歌特维生物科技集团-0', name: '健康服务', description: '健康管理咨询服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1576091168172-9c6a5a4f8fb6?w=400&h=300&fit=crop' },
        { seedKey: '上海歌特维生物科技集团-1', name: '生物制品', description: '生物工程产品研发', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海正泰电器销售有限公司',
      products: [
        { seedKey: '上海正泰电器销售有限公司-0', name: 'NM1 塑壳断路器', description: '正泰 NM1 系列塑料外壳式断路器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海正泰电器销售有限公司-1', name: '交流接触器', description: 'CJX2 系列交流接触器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海正泰电器销售有限公司-2', name: 'NXB 小型断路器', description: '正泰 NXB 系列小型断路器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海永源企业发展股份有限公司',
      products: [
        { seedKey: '上海永源企业发展股份有限公司-0', name: '企业服务', description: '企业管理咨询与服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海永源企业发展股份有限公司-1', name: '投资咨询', description: '项目投资咨询服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海永瑞流体技术有限公司',
      products: [
        { seedKey: '上海永瑞流体技术有限公司-0', name: '管件', description: '不锈钢管件、法兰', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海永瑞流体技术有限公司-1', name: '阀门', description: '球阀、蝶阀等工业阀门', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581092149559-3a38e7a4a0c7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海永进电缆（集团）有限公司',
      products: [
        { seedKey: '上海永进电缆（集团）有限公司-0', name: '布电线', description: 'BV 系列聚氯乙烯绝缘电线', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海永进电缆（集团）有限公司-1', name: '架空绝缘电缆', description: 'JKLYJ 系列架空绝缘导线', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海浙南物流有限公司',
      products: [
        { seedKey: '上海浙南物流有限公司-0', name: '物流运输', description: '上海至浙江专线物流运输', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1586528423060-48b050840a30?w=400&h=300&fit=crop' },
        { seedKey: '上海浙南物流有限公司-1', name: '仓储服务', description: '货物仓储与配送服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海浙商典当有限公司',
      products: [
        { seedKey: '上海浙商典当有限公司-0', name: '典当融资', description: '短期融资服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1589824964234-c6a3c57c7033?w=400&h=300&fit=crop' },
        { seedKey: '上海浙商典当有限公司-1', name: '鉴定评估', description: '物品鉴定评估', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海浦东电线电缆（集团）有限公司',
      products: [
        { seedKey: '上海浦东电线电缆（集团）有限公司-0', name: '耐火电缆', description: 'NH-YJV 系列耐火电力电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海浦东电线电缆（集团）有限公司-1', name: '控制电缆', description: 'KVV 系列聚氯乙烯绝缘控制电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海浦东电线电缆（集团）有限公司-2', name: '电力电缆', description: 'YJV 系列交联聚乙烯绝缘电力电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海浦东软件园汇智科技有限公司',
      products: [
        { seedKey: '上海浦东软件园汇智科技有限公司-0', name: '园区服务', description: '科技园区运营服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海浦东软件园汇智科技有限公司-1', name: '孵化服务', description: '科技企业孵化', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海浦广科技（集团）有限公司',
      products: [
        { seedKey: '上海浦广科技（集团）有限公司-0', name: '科技服务', description: '技术研发与服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop' },
        { seedKey: '上海浦广科技（集团）有限公司-1', name: '产业园', description: '产业园区运营', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1486404931741-80f7f721fb44?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海海之仙餐饮管理有限公司',
      products: [
        { seedKey: '上海海之仙餐饮管理有限公司-0', name: '食品加工', description: '食品生产与加工', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1490464596296-8b6e45a89782?w=400&h=300&fit=crop' },
        { seedKey: '上海海之仙餐饮管理有限公司-1', name: '餐饮服务', description: '餐饮连锁经营管理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1414294163535-1fb7002d0acf?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海涵博生物科技有限公司',
      products: [
        { seedKey: '上海涵博生物科技有限公司-0', name: '生物技术', description: '生物医药技术研发', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海涵博生物科技有限公司-1', name: '医学检测', description: '医学检验与检测服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海港程投资咨询有限公司',
      products: [
        { seedKey: '上海港程投资咨询有限公司-0', name: '投资咨询', description: '项目投资分析与咨询', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
        { seedKey: '上海港程投资咨询有限公司-1', name: '财务规划', description: '个人或企业财务规划', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海瑞奇汽配有限公司',
      products: [
        { seedKey: '上海瑞奇汽配有限公司-0', name: '汽车电器', description: '汽车电子电器产品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1494905998402-395930813141?w=400&h=300&fit=crop' },
        { seedKey: '上海瑞奇汽配有限公司-1', name: '汽车配件', description: '汽车电气系统配件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1494905998402-395930813141?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海瓯亚机电设备有限公司',
      products: [
        { seedKey: '上海瓯亚机电设备有限公司-0', name: '液压元件', description: '液压泵、液压阀', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1518770523000-9715898db5bf?w=400&h=300&fit=crop' },
        { seedKey: '上海瓯亚机电设备有限公司-1', name: '气动元件', description: '气缸、电磁阀等气动产品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1518770523000-9715898db5bf?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海申之江珠宝集团有限公司',
      products: [
        { seedKey: '上海申之江珠宝集团有限公司-0', name: '黄金首饰', description: '足金首饰系列', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海申之江珠宝集团有限公司-1', name: '钻石饰品', description: '钻石戒指、项链', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海申开电力建设工程有限公司',
      products: [
        { seedKey: '上海申开电力建设工程有限公司-0', name: '电力工程安装', description: '10kV 及以下电力设施安装服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497484843679-6a4c50f4a1a8?w=400&h=300&fit=crop' },
        { seedKey: '上海申开电力建设工程有限公司-1', name: '电力维修', description: '电力设备维护检修服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497484843679-6a4c50f4a1a8?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海申旗投资有限公司、上海国延堂医药科技有限公司',
      products: [
        { seedKey: '上海申旗投资有限公司、上海国延堂医药科技有限公司-0', name: '投资服务', description: '产业投资与资本运作', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
        { seedKey: '上海申旗投资有限公司、上海国延堂医药科技有限公司-1', name: '医药科技', description: '医药技术研发与推广', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海电享信息科技有限公司',
      products: [
        { seedKey: '上海电享信息科技有限公司-0', name: '企业 SaaS', description: '企业数字化管理软件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海电享信息科技有限公司-1', name: '云服务', description: '云计算、云存储服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海电器厂实业有限公司',
      products: [
        { seedKey: '上海电器厂实业有限公司-0', name: '互感器', description: 'LZZBJ9-10 系列电流互感器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海电器厂实业有限公司-1', name: '隔离开关', description: 'GN19 系列户内高压隔离开关', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1507670253-e184d4b3f568?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海皋金实业有限公司',
      products: [
        { seedKey: '上海皋金实业有限公司-0', name: '咨询服务', description: '商务咨询服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海皋金实业有限公司-1', name: '实业经营', description: '多元化实业投资', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1590244875088-6f9a7c5a5f69?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海盛临贸易有限公司',
      products: [
        { seedKey: '上海盛临贸易有限公司-0', name: '贸易代理', description: '进出口贸易代理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海盛临贸易有限公司-1', name: '商品批发', description: '日用品批发与销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海盛佰贸易有限公司',
      products: [
        { seedKey: '上海盛佰贸易有限公司-0', name: '供应链管理', description: '供应链管理与物流', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
        { seedKey: '上海盛佰贸易有限公司-1', name: '商贸服务', description: '综合商贸代理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海盛鑫糖酒食品有限公司',
      products: [
        { seedKey: '上海盛鑫糖酒食品有限公司-0', name: '食品批发', description: '糖酒食品批发贸易', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1490464596296-8b6e45a89782?w=400&h=300&fit=crop' },
        { seedKey: '上海盛鑫糖酒食品有限公司-1', name: '酒类代理', description: '品牌酒类代理销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1506377286629-10c9626f0c2f?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海硕玛电气有限公司',
      products: [
        { seedKey: '上海硕玛电气有限公司-0', name: '智能控制器', description: 'SM 系列电力智能监控终端', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海硕玛电气有限公司-1', name: '电力仪表', description: 'SM96 系列数显电力仪表', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497484843679-6a4c50f4a1a8?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海科常工程管理咨询中心',
      products: [
        { seedKey: '上海科常工程管理咨询中心-0', name: '工程咨询', description: '电力工程咨询与管理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海科常工程管理咨询中心-1', name: '项目管理', description: '工程项目全过程管理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海穆勒四通电气股份有限公司',
      products: [
        { seedKey: '上海穆勒四通电气股份有限公司-0', name: '双电源开关', description: 'MTSQ 系列双电源自动转换开关', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1507670253-e184d4b3f568?w=400&h=300&fit=crop' },
        { seedKey: '上海穆勒四通电气股份有限公司-1', name: '控制与保护开关', description: 'MKBO 系列控制与保护开关电器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1507670253-e184d4b3f568?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海精珅新材料有限公司',
      products: [
        { seedKey: '上海精珅新材料有限公司-0', name: '工程塑料', description: '改性工程塑料粒子', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海精珅新材料有限公司-1', name: '特种材料', description: '高性能复合材料', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海精科智能科技股份有限公司',
      products: [
        { seedKey: '上海精科智能科技股份有限公司-0', name: '数据采集终端', description: '电力负荷管理终端', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海精科智能科技股份有限公司-1', name: '智能电表', description: 'DDSY 系列单相费控智能电表', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海索谷电缆集团有限公司',
      products: [
        { seedKey: '上海索谷电缆集团有限公司-0', name: '矿物绝缘电缆', description: 'BTTZ 系列铜芯矿物绝缘电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海索谷电缆集团有限公司-1', name: '高压电缆', description: 'YJLW03 系列高压交联电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海美上置业开发有限公司',
      products: [
        { seedKey: '上海美上置业开发有限公司-0', name: '房地产开发', description: '商业地产开发运营', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海美上置业开发有限公司-1', name: '物业管理', description: '高端物业管理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海美岛电气配套有限公司',
      products: [
        { seedKey: '上海美岛电气配套有限公司-0', name: '环网柜', description: 'XGN15-12 系列交流金属封闭环网开关设备', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1600219370-ab1623f08556?w=400&h=300&fit=crop' },
        { seedKey: '上海美岛电气配套有限公司-1', name: '电缆分支箱', description: 'DFW-12 系列电缆分支箱', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海耐力电控设备有限公司',
      products: [
        { seedKey: '上海耐力电控设备有限公司-0', name: '配电箱', description: 'XL 系列动力配电箱', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海耐力电控设备有限公司-1', name: '配电柜', description: 'GCS 系列低压抽出式开关柜', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海联华变压器厂有限公司',
      products: [
        { seedKey: '上海联华变压器厂有限公司-0', name: '干式变压器', description: 'SCB13 系列环氧树脂浇注干式变压器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海联华变压器厂有限公司-1', name: '油浸式变压器', description: 'S13-M 系列三相油浸式配电变压器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海胜华特种电缆有限公司',
      products: [
        { seedKey: '上海胜华特种电缆有限公司-0', name: '耐火电缆', description: 'NH-YJV 系列耐火电力电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海胜华特种电缆有限公司-1', name: '阻燃电缆', description: 'ZR-YJV 系列阻燃电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海胜华环保科技集团有限公司 ',
      products: [
        { seedKey: '上海胜华环保科技集团有限公司 -0', name: '智能配电监控系统', description: '基于物联网技术的智能配电监控解决方案，实时监测配电系统运行状态，提供故障预警、能耗分析、远程控制等功能。', sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海胜华环保科技集团有限公司 -1', name: '电力物联网终端', description: '用于电力设备数据采集和传输的智能终端设备，支持多种通讯协议，实现设备状态监测和远程管理。', sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1497484843679-6a4c50f4a1a8?w=400&h=300&fit=crop' },
        { seedKey: '上海胜华环保科技集团有限公司 -2', name: '能源管理系统', description: '企业级能源管理解决方案，提供能耗数据采集、分析、报表、优化建议等功能，帮助企业降低能耗成本。', sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海胜华电气股份有限公司',
      products: [
        { seedKey: '上海胜华电气股份有限公司-0', name: '特种电缆', description: '耐火、阻燃特种电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海胜华电气股份有限公司-1', name: '控制电缆', description: 'KVV 系列控制电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海胜华电气股份有限公司-2', name: '电力电缆', description: 'YJV 系列交联聚乙烯绝缘电力电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海胜华电缆科技集团有限公司',
      products: [
        { seedKey: '上海胜华电缆科技集团有限公司-0', name: '高压电缆', description: 'YJLW03 系列高压交联电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
        { seedKey: '上海胜华电缆科技集团有限公司-1', name: '架空电缆', description: 'JKLYJ 系列架空绝缘电缆', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1604174462244-12c8c67471e0?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海节高电子科技有限公司',
      products: [
        { seedKey: '上海节高电子科技有限公司-0', name: '智能控制器', description: '家电智能控制板', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海节高电子科技有限公司-1', name: 'PCBA 加工', description: 'SMT 贴片加工服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海菲姿服饰有限公司',
      products: [
        { seedKey: '上海菲姿服饰有限公司-0', name: '服饰', description: '时装服饰', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海菲姿服饰有限公司-1', name: '女装', description: '时尚女装系列', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: ' 上海西源宏电气设备有限公司 ',
      products: [
        { seedKey: ' 上海西源宏电气设备有限公司 -0', name: '电气设备', description: '高低压电气设备销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: ' 上海西源宏电气设备有限公司 -1', name: '配电设备', description: '配电箱柜与配件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海豪进钢铁贸易有限公司',
      products: [
        { seedKey: '上海豪进钢铁贸易有限公司-0', name: '钢材贸易', description: '建筑钢材批发销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海豪进钢铁贸易有限公司-1', name: '钢铁加工', description: '钢材切割与加工', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海贝特医疗器械有限公司',
      products: [
        { seedKey: '上海贝特医疗器械有限公司-0', name: '生物材料', description: '医用生物材料研发生产', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海贝特医疗器械有限公司-1', name: '医疗器械', description: '医用高分子材料与器械', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1519489985013-54a93f6d59f3?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海贺新投资咨询有限公司',
      products: [
        { seedKey: '上海贺新投资咨询有限公司-0', name: '投资咨询', description: '项目投资评估与咨询', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
        { seedKey: '上海贺新投资咨询有限公司-1', name: '财务顾问', description: '企业融资与财务顾问', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海通用重工集团有限公司',
      products: [
        { seedKey: '上海通用重工集团有限公司-0', name: '焊接设备', description: '气体保护焊机系列', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海通用重工集团有限公司-1', name: '切割设备', description: '数控等离子切割机', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海郑民电器有限公司',
      products: [
        { seedKey: '上海郑民电器有限公司-0', name: '空气开关', description: '微型断路器，过载和短路保护', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1507670253-e184d4b3f568?w=400&h=300&fit=crop' },
        { seedKey: '上海郑民电器有限公司-1', name: '漏电保护器', description: '家用及工业用漏电保护器，快速动作保护', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海野马浜律师事务所',
      products: [
        { seedKey: '上海野马浜律师事务所-0', name: '案件代理', description: '各类案件代理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海野马浜律师事务所-1', name: '法律咨询', description: '专业法律咨询服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1589824964234-c6a3c57c7033?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海金开利集团',
      products: [
        { seedKey: '上海金开利集团-0', name: '风机盘管', description: '中央空调末端设备', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海金开利集团-1', name: '通风系统', description: '中央空调通风设备', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海金电铜业有限公司',
      products: [
        { seedKey: '上海金电铜业有限公司-0', name: '铜排', description: 'T2 紫铜排、镀锡铜排', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海金电铜业有限公司-1', name: '铜母线', description: '电力用铜母线', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海金蓝机电设备成套有限公司',
      products: [
        { seedKey: '上海金蓝机电设备成套有限公司-0', name: '机电成套', description: '工业机电设备成套供应', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海金蓝机电设备成套有限公司-1', name: '设备安装', description: '机电设备安装调试', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海金诚建设发展有限公司',
      products: [
        { seedKey: '上海金诚建设发展有限公司-0', name: '建筑施工', description: '房屋建筑工程施工', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1486404931741-80f7f721fb44?w=400&h=300&fit=crop' },
        { seedKey: '上海金诚建设发展有限公司-1', name: '市政工程', description: '市政基础设施建设', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海金钟电气集团',
      products: [
        { seedKey: '上海金钟电气集团-0', name: '电气成套', description: '高低压电气成套设备', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '上海金钟电气集团-1', name: '配电箱', description: '智能配电箱柜', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海鑫中兴防爆科技有限公司',
      products: [
        { seedKey: '上海鑫中兴防爆科技有限公司-0', name: '防爆灯具', description: 'BAD 系列防爆平台灯', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
        { seedKey: '上海鑫中兴防爆科技有限公司-1', name: '防爆配电箱', description: 'BXMD 系列防爆照明 (动力) 配电箱', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海鑫颖金属材料有限公司',
      products: [
        { seedKey: '上海鑫颖金属材料有限公司-0', name: '金属材料', description: '不锈钢与铝合金材料', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海鑫颖金属材料有限公司-1', name: '钢材加工', description: '金属材料切割加工', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海长江电气设备集团有限公司',
      products: [
        { seedKey: '上海长江电气设备集团有限公司-0', name: '高压开关柜', description: 'KYN28-12 系列高压开关柜', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1507670253-e184d4b3f568?w=400&h=300&fit=crop' },
        { seedKey: '上海长江电气设备集团有限公司-1', name: '箱式变电站', description: 'YBW 系列预装式变电站', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海隆众产业园',
      products: [
        { seedKey: '上海隆众产业园-0', name: '企业服务', description: '创业孵化、企业服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海隆众产业园-1', name: '园区租赁', description: '办公空间、厂房租赁', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海隆众原生物科技有限公司 ',
      products: [
        { seedKey: '上海隆众原生物科技有限公司 -0', name: '生物科技', description: '生物技术研究与开发', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop' },
        { seedKey: '上海隆众原生物科技有限公司 -1', name: '健康咨询', description: '健康管理与咨询', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1576091168172-9c6a5a4f8fb6?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海雅易电气有限公司',
      products: [
        { seedKey: '上海雅易电气有限公司-0', name: '软启动器', description: 'YJR 系列电机软启动器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海雅易电气有限公司-1', name: '变频器', description: 'YJ 系列交流变频调速器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海飞策防爆电器有限公司',
      products: [
        { seedKey: '上海飞策防爆电器有限公司-0', name: '防爆风机', description: 'BJF 系列防爆轴流风机', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
        { seedKey: '上海飞策防爆电器有限公司-1', name: '防爆空调', description: 'BKFR 系列防爆空调', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海鸿幸盛实业有限公司',
      products: [
        { seedKey: '上海鸿幸盛实业有限公司-0', name: '实业投资', description: '实业投资与资产管理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
        { seedKey: '上海鸿幸盛实业有限公司-1', name: '物业管理', description: '商业物业运营管理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '上海龙泓国际贸易有限公司',
      products: [
        { seedKey: '上海龙泓国际贸易有限公司-0', name: '供应链服务', description: '采购、物流一体化服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '上海龙泓国际贸易有限公司-1', name: '进出口贸易', description: '国际贸易代理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '东禾健康管理（上海）有限公司',
      products: [
        { seedKey: '东禾健康管理（上海）有限公司-0', name: '健康管理', description: '个人与群体健康管理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
        { seedKey: '东禾健康管理（上海）有限公司-1', name: '体检服务', description: '健康体检与评估', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '中变集团上海变压器有限公司',
      products: [
        { seedKey: '中变集团上海变压器有限公司-0', name: '干式变压器', description: 'SCB13 系列环氧树脂浇注干式变压器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '中变集团上海变压器有限公司-1', name: '油浸式变压器', description: 'S13-M 系列油浸式配电变压器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '中期贵金属电子商务（上海）有限公司',
      products: [
        { seedKey: '中期贵金属电子商务（上海）有限公司-0', name: '贵金属交易', description: '黄金、白银现货交易服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '中期贵金属电子商务（上海）有限公司-1', name: '期货服务', description: '商品期货经纪服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '中通云商供应链有限公司',
      products: [
        { seedKey: '中通云商供应链有限公司-0', name: '冷链物流', description: '冷链运输服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1586528423060-48b050840a30?w=400&h=300&fit=crop' },
        { seedKey: '中通云商供应链有限公司-1', name: '供应链服务', description: '仓储、配送一体化服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '中通快递股份有限公司',
      products: [
        { seedKey: '中通快递股份有限公司-0', name: '物流服务', description: '仓储配送、同城配送', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1586528423060-48b050840a30?w=400&h=300&fit=crop' },
        { seedKey: '中通快递股份有限公司-1', name: '快递服务', description: '国内快递、快运服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1616424420246-e40c2a8a914e?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '乐清农商银行',
      products: [
        { seedKey: '乐清农商银行-0', name: '普惠金融', description: '小微企业与农户贷款', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565514029079-86606d90a5e7?w=400&h=300&fit=crop' },
        { seedKey: '乐清农商银行-1', name: '农村金融', description: '农村信用贷款服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565514029079-86606d90a5e7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '乐清市金春石斛有限公司',
      products: [
        { seedKey: '乐清市金春石斛有限公司-0', name: '石斛种植', description: '铁皮石斛种植', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '乐清市金春石斛有限公司-1', name: '石斛产品', description: '石斛加工品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '光大证券股份有限公司',
      products: [
        { seedKey: '光大证券股份有限公司-0', name: '财富管理', description: '高净值客户财富管理与资产配置', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
        { seedKey: '光大证券股份有限公司-1', name: '证券投资服务', description: '股票、债券、基金等证券投资咨询与服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '北京市京师（上海）律师事务所',
      products: [
        { seedKey: '北京市京师（上海）律师事务所-0', name: '诉讼代理', description: '民商事诉讼与仲裁代理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '北京市京师（上海）律师事务所-1', name: '法律顾问', description: '企业常年法律顾问服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1589824964234-c6a3c57c7033?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '华泰证券股份有限公司',
      products: [
        { seedKey: '华泰证券股份有限公司-0', name: '金融服务', description: '综合金融解决方案', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565514029079-86606d90a5e7?w=400&h=300&fit=crop' },
        { seedKey: '华泰证券股份有限公司-1', name: '资产管理', description: '集合资产管理计划', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '华荣科技股份有限公司',
      products: [
        { seedKey: '华荣科技股份有限公司-0', name: '防爆电话', description: 'BAH 系列防爆电话机', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
        { seedKey: '华荣科技股份有限公司-1', name: '防爆应急灯', description: 'BAE 系列防爆应急照明灯', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
        { seedKey: '华荣科技股份有限公司-2', name: '防爆照明灯', description: 'BAD 系列防爆平台灯', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '南亚新材料科技股份有限公司',
      products: [
        { seedKey: '南亚新材料科技股份有限公司-0', name: '覆铜板', description: 'FR-4 系列覆铜板', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '南亚新材料科技股份有限公司-1', name: '半固化片', description: '环氧树脂半固化片', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '南喆电气科技（上海）有限公司',
      products: [
        { seedKey: '南喆电气科技（上海）有限公司-0', name: '电力自动化系统', description: '变电站综合自动化系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497484843679-6a4c50f4a1a8?w=400&h=300&fit=crop' },
        { seedKey: '南喆电气科技（上海）有限公司-1', name: '继电保护装置', description: '电力微机保护装置', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '古墨风韵（杭州）影视文化传媒有限责任公司',
      products: [
        { seedKey: '古墨风韵（杭州）影视文化传媒有限责任公司-0', name: '文化传播', description: '文化交流活动', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '古墨风韵（杭州）影视文化传媒有限责任公司-1', name: '影视制作', description: '影视广告制作', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '合兴集团有限公司',
      products: [
        { seedKey: '合兴集团有限公司-0', name: '电子连接器', description: '汽车连接器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1518770523000-9715898db5bf?w=400&h=300&fit=crop' },
        { seedKey: '合兴集团有限公司-1', name: '电子元件', description: '电子元件制造', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1518770523000-9715898db5bf?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '夜光杯酒业',
      products: [
        { seedKey: '夜光杯酒业-0', name: '葡萄酒', description: '进口葡萄酒贸易', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1506377286629-10c9626f0c2f?w=400&h=300&fit=crop' },
        { seedKey: '夜光杯酒业-1', name: '白酒销售', description: '优质白酒品牌代理与销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1506377286629-10c9626f0c2f?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '安能允智慧（上海）能源有限公司',
      products: [
        { seedKey: '安能允智慧（上海）能源有限公司-0', name: '节能服务', description: '合同能源管理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '安能允智慧（上海）能源有限公司-1', name: '智慧能源', description: '能源管理系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497484843679-6a4c50f4a1a8?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '平安银行股份有限公司上海外滩支行',
      products: [
        { seedKey: '平安银行股份有限公司上海外滩支行-0', name: '理财产品', description: '银行理财产品销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '平安银行股份有限公司上海外滩支行-1', name: '银行服务', description: '个人与企业银行服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '德标管业（上海）有限公司',
      products: [
        { seedKey: '德标管业（上海）有限公司-0', name: '水管', description: 'PPR 给水管材', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '德标管业（上海）有限公司-1', name: '管道系统', description: '家装管道系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581092149559-3a38e7a4a0c7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '德汇实业集团有限公司',
      products: [
        { seedKey: '德汇实业集团有限公司-0', name: '实业投资', description: '产业投资、资产管理', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
        { seedKey: '德汇实业集团有限公司-1', name: '物业管理', description: '商业地产运营', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497372195151-3b6e331ecf00?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '德汇融资租赁有限公司',
      products: [
        { seedKey: '德汇融资租赁有限公司-0', name: '商业保理', description: '商业保理服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '德汇融资租赁有限公司-1', name: '融资租赁', description: '设备融资租赁', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '悦儿国际贸易（上海）有限公司',
      products: [
        { seedKey: '悦儿国际贸易（上海）有限公司-0', name: '母婴用品', description: '进口母婴产品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '悦儿国际贸易（上海）有限公司-1', name: '化妆品', description: '进口美妆护肤品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '泽大（上海）律师事务所',
      products: [
        { seedKey: '泽大（上海）律师事务所-0', name: '企业合规', description: '企业合规审查与风控', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '泽大（上海）律师事务所-1', name: '法律服务', description: '综合法律服务与咨询', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1589824964234-c6a3c57c7033?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '浙商银行上海分行',
      products: [
        { seedKey: '浙商银行上海分行-0', name: '存款服务', description: '对公存款与结算服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '浙商银行上海分行-1', name: '企业贷款', description: '中小企业融资贷款服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '浙江乐粉轨道交通科技有限公司',
      products: [
        { seedKey: '浙江乐粉轨道交通科技有限公司-0', name: '信号设备', description: '铁路信号系统配件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '浙江乐粉轨道交通科技有限公司-1', name: '轨道配件', description: '轨道交通零部件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '浙江天正电气股份有限公司',
      products: [
        { seedKey: '浙江天正电气股份有限公司-0', name: '智能配电柜', description: '数字化配电管理，支持远程监控和能耗分析', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '浙江天正电气股份有限公司-1', name: '小型断路器', description: '家用及工业用电路保护元件，分断能力强', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '浙江敏乐船舶科技有限公司',
      products: [
        { seedKey: '浙江敏乐船舶科技有限公司-0', name: '船舶配件', description: '船用机械零部件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '浙江敏乐船舶科技有限公司-1', name: '船用阀门', description: '船用蝶阀、球阀', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581092149559-3a38e7a4a0c7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '海通证券股份有限公司',
      products: [
        { seedKey: '海通证券股份有限公司-0', name: '投资银行', description: '企业 IPO、再融资等投行服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1579533524962-1be39d5dd3a9?w=400&h=300&fit=crop' },
        { seedKey: '海通证券股份有限公司-1', name: '经纪业务', description: '证券经纪与交易服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '深圳市瓯亚凯科技有限公司上海办事处',
      products: [
        { seedKey: '深圳市瓯亚凯科技有限公司上海办事处-0', name: '电子元器件', description: '集成电路、芯片', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1518770523000-9715898db5bf?w=400&h=300&fit=crop' },
        { seedKey: '深圳市瓯亚凯科技有限公司上海办事处-1', name: '模块电源', description: 'DC/DC 模块电源', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '温州银行上海分行松江业务部',
      products: [
        { seedKey: '温州银行上海分行松江业务部-0', name: '小微企业贷', description: '小微企业融资服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '温州银行上海分行松江业务部-1', name: '商业银行服务', description: '存贷款与结算服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '爱康企业集团（上海）有限公司',
      products: [
        { seedKey: '爱康企业集团（上海）有限公司-0', name: '光伏支架', description: '太阳能光伏支架系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1509394196231-4953c9c4e8d1?w=400&h=300&fit=crop' },
        { seedKey: '爱康企业集团（上海）有限公司-1', name: '管道系统', description: 'PPR 给水管道系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581092149559-3a38e7a4a0c7?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '电光防爆科技（上海）有限公司',
      products: [
        { seedKey: '电光防爆科技（上海）有限公司-0', name: '矿用开关', description: 'QBZ 系列矿用隔爆型真空电磁启动器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1507670253-e184d4b3f568?w=400&h=300&fit=crop' },
        { seedKey: '电光防爆科技（上海）有限公司-1', name: '防爆电器', description: '防爆配电箱系列', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '电光防爆科技股份有限公司',
      products: [
        { seedKey: '电光防爆科技股份有限公司-0', name: '井下通信设备', description: '矿用本安型通信终端，支持语音和数据传输', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '电光防爆科技股份有限公司-1', name: '矿用防爆监控系统', description: '煤矿井下视频监控与安全预警系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1565279338-9b877f5a5b2a?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '电管家集团股份有限公司',
      products: [
        { seedKey: '电管家集团股份有限公司-0', name: '智能用电', description: '智能用电管理系统', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '电管家集团股份有限公司-1', name: '电力运维', description: '电力设施运维服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1497484843679-6a4c50f4a1a8?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '立帮秀珀化工涂料有限公司',
      products: [
        { seedKey: '立帮秀珀化工涂料有限公司-0', name: '高性能地坪涂料', description: '适用于工业厂房、地下车库等场景，耐磨抗压', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '立帮秀珀化工涂料有限公司-1', name: '环保防腐涂装系统', description: '水性环保配方，耐化学品腐蚀，适用于化工厂房', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '紫宸峰（上海）贸易有限公司',
      products: [
        { seedKey: '紫宸峰（上海）贸易有限公司-0', name: '电子产品', description: '消费电子产品', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1518770523000-9715898db5bf?w=400&h=300&fit=crop' },
        { seedKey: '紫宸峰（上海）贸易有限公司-1', name: '数码配件', description: '手机、电脑配件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '美丰农业科技（上海）有限公司',
      products: [
        { seedKey: '美丰农业科技（上海）有限公司-0', name: '农业技术', description: '现代农业技术推广', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed7747ef?w=400&h=300&fit=crop' },
        { seedKey: '美丰农业科技（上海）有限公司-1', name: '农产品', description: '绿色农产品种植与销售', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '衡宝科技（上海）有限公司',
      products: [
        { seedKey: '衡宝科技（上海）有限公司-0', name: '称重传感器', description: '应变式称重传感器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '衡宝科技（上海）有限公司-1', name: '称重仪表', description: '数字称重显示仪表', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '财源在线（上海）网络科技有限公司',
      products: [
        { seedKey: '财源在线（上海）网络科技有限公司-0', name: '财税 SaaS', description: '企业财税管理软件', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
        { seedKey: '财源在线（上海）网络科技有限公司-1', name: '代账服务', description: '财务代理记账服务', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a9923314?w=400&h=300&fit=crop' },
      ],
    },
    {
      companyName: '长城电器集团上海有限公司',
      products: [
        { seedKey: '长城电器集团上海有限公司-0', name: '小型断路器', description: 'CB1 系列小型断路器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '长城电器集团上海有限公司-1', name: '万能式断路器', description: 'CW 系列智能型万能式断路器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
        { seedKey: '长城电器集团上海有限公司-2', name: '塑壳断路器', description: 'CM1 系列塑壳断路器', sortOrder: 0, imageUrl: 'https://images.unsplash.com/photo-1558619290-a9a4668428f7?w=400&h=300&fit=crop' },
      ],
    },
  ];

  for (const seed of productSeeds) {
    const company = await prisma.company.findUnique({ where: { name: seed.companyName } });
    if (!company) {
      console.warn(`Company not found: ${seed.companyName}, skipping products`);
      continue;
    }
    for (const product of seed.products) {
      const existing = await prisma.companyProduct.findFirst({
        where: { companyId: company.id, seedKey: product.seedKey },
      });
      if (existing) {
        await prisma.companyProduct.update({
          where: { id: existing.id },
          data: { name: product.name, description: product.description, sortOrder: product.sortOrder, imageUrl: product.imageUrl },
        });
      } else {
        await prisma.companyProduct.create({
          data: {
            companyId: company.id,
            seedKey: product.seedKey,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            sortOrder: product.sortOrder,
          },
        });
      }
    }
    console.log(`Seeded ${seed.products.length} products for ${seed.companyName}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
