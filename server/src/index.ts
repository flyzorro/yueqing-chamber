import app, { createApp } from './app';
import pg from 'pg';

const { Client } = pg;

const NGROK_URL = 'https://hisako-huskiest-jacquelyn.ngrok-free.dev';

async function fetchNgrok(path: string) {
  const resp = await fetch(NGROK_URL + path);
  if (!resp.ok) throw new Error(`Ngrok error ${resp.status} on ${path}`);
  return resp.json();
}

async function syncCompanySchema(dbUrl: string) {
  console.log('Syncing Company table schema...');
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    // 检查当前列
    const columns = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'Company'
    `);
    console.log('Current Company columns:', columns.rows.map(r => r.column_name));

    // Add contactname column if missing - try both variants
    await client.query(`ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "contactName" VARCHAR`);
    await client.query(`ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS contactname VARCHAR`);
    console.log('✓ contactName column added/exists');

    // Add other potentially missing columns
    await client.query(`ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "summary" VARCHAR`);
    console.log('✓ summary column added/exists');

    await client.end();
  } catch (err) {
    console.error('Schema sync error:', err);
    await client.end();
    throw err;
  }
}

async function migrateCompanies() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.log('No DATABASE_URL, skipping migration'); return; }

  // First sync the schema
  await syncCompanySchema(dbUrl);

  console.log('Starting company migration from ngrok...');
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const allCompanies = [];
  let page = 1;
  while (true) {
    const resp = await fetchNgrok('/api/companies?page=' + page + '&limit=100');
    allCompanies.push(...resp.data);
    if (!resp.data.length || resp.data.length < 100) break;
    page++;
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('Found', allCompanies.length, 'companies on ngrok');

  let inserted = 0, skipped = 0, failed = 0;
  for (const company of allCompanies) {
    try {
      const res = await client.query(
        `INSERT INTO "Company" (id, name, industry, contactname, phone, address, logo, status, createdat, updatedat)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
         ON CONFLICT (name) DO NOTHING RETURNING id`,
        [company.id, company.name, company.industry || null, company.contactName,
         company.phone || null, company.address || null, company.logo || null, company.status || 'active']
      );
      if ((res.rowCount ?? 0) > 0) { console.log('  \u2713', company.name); inserted++; }
      else { skipped++; }
    } catch (e) {
      console.log('  \u2717', company.name, '-', (e as Error).message);
      failed++;
    }
  }

  console.log('Migration done:', inserted, 'inserted,', skipped, 'skipped,', failed, 'failed');
  await client.end();
}

async function syncMemberSchema(dbUrl: string) {
  console.log('Syncing Member table schema...');
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    // 检查当前列
    const columns = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'Member'
    `);
    console.log('Current Member columns:', columns.rows.map(r => r.column_name));

    await client.end();
  } catch (err) {
    console.error('Schema sync error:', err);
    await client.end();
    throw err;
  }
}

async function migrateMembers() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.log('No DATABASE_URL, skipping member migration'); return; }

  // First sync the schema
  await syncMemberSchema(dbUrl);

  console.log('Starting member migration from local backup...');
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // Check existing count
  const countResult = await client.query('SELECT COUNT(*) FROM "Member"');
  const existingCount = parseInt(countResult.rows[0].count);
  console.log(`Existing members: ${existingCount}`);

  if (existingCount > 100) {
    console.log('Members already exist, skipping import');
    await client.end();
    return;
  }

  // Member data from Neon backup (all 190 members)
  const members = [
    ["cmnk2kfxh000098oyd5mwennv","高天乐","15801788878",null,"浙江天正电气股份有限公司","董事长","2026-04-04 08:27:20.357","active","浦东","会长"],
    ["cmnk2kg3k000198oyqeoldbdr","石向才","13867776666",null,"电光防爆科技股份有限公司","董事局主席","2026-04-04 08:27:20.576","active","闵行","监事长"],
    ["cmnk2kg9q000398oy682pcna7","王吉雷","13901858888",null,"中通快递股份有限公司","董事、联合创始人","2026-04-04 08:27:20.798","active","青浦","执行会长"],
    ["cmnk2kgcv000498oyect5f70v","胡志荣","13671555555",null,"华荣科技股份有限公司","董事长","2026-04-04 08:27:20.911","active","嘉定","执行会长"],
    ["cmnk2kggh000598oyggyv9977","石华辉","13957189888",null,"上海创力集团股份有限公司","董事长","2026-04-04 08:27:21.042","active","青浦","执行会长"],
    ["cmnk2kgji000698oyhh5h2l8h","包秀银","13601866666",null,"南亚新材料科技股份有限公司","董事长","2026-04-04 08:27:21.15","active","嘉定","执行会长"],
    ["cmnk2kgn1000798oygowkg7bu","陈余义","13918965777",null,"上海浦东电线电缆（集团）有限公司","董事长","2026-04-04 08:27:21.277","active","奉贤","执行会长"],
    ["cmnk2kgq1000898oyhuxpx9ta","李振林","13901666896",null,"上海金开利集团","副董事长","2026-04-04 08:27:21.385","active","黄浦","执行会长"],
    ["cmnk2kgta000998oyaa2qhhrg","陈汉星","13917911111",null,"上海隆众产业园","主任","2026-04-04 08:27:21.502","active","杨浦","执行会长"],
    ["cmnk2kgwu000a98oyz3e0ceeq","郑立克","13901878052",null,"爱康企业集团（上海）有限公司","董事长","2026-04-04 08:27:21.63","active","浦东","执行会长"],
    ["cmnk2kh0b000b98oy06zozsqj","胡晨阳","13386093619",null,"北京市京师（上海）律师事务所","主任","2026-04-04 08:27:21.756","active","静安","执行会长"],
    ["cmnk2kh41000c98oy3rsn8ji1","张瑞根","18930226666",null,"泽大（上海）律师事务所","执行主任","2026-04-04 08:27:21.889","active","静安","执行会长"],
    ["cmnk2kh79000d98oy7k3g0251","黄岁飞","13506678988",null,"上海晶茂投资有限公司","董事长","2026-04-04 08:27:22.006","active","奉贤","执行会长"],
    ["cmnk2khax000e98oy03idj018","施甘云","13601721198",null,"上海申之江珠宝集团有限公司","董事长","2026-04-04 08:27:22.138","active","黄浦","执行会长"],
    ["cmnk2khea000f98oy4wb3rsj3","包燕微","13968711888",null,"上海歌特维生物科技集团","董事长","2026-04-04 08:27:22.259","active","浦东","执行会长"],
    ["cmnk2khi2000g98oyq9isjdhn","李玲珠","13701857222",null,"上海乐港电器有限公司","总经理","2026-04-04 08:27:22.394","active","松江","执行会长"],
    ["cmnk2khkx000h98oydabaibxi","毛海渊","13906933355",null,"摩融控股集团有限公司","董事长","2026-04-04 08:27:22.497","active","青浦","执行会长"],
    ["cmnk2khoe000i98oymvd4xfm5","陈品旺","13905879111",null,"上海菲姿服饰有限公司","董事长","2026-04-04 08:27:22.622","active","松江","执行会长"],
    ["cmnk2khrh000j98oyz54ntzrx","谢斌","13331999077",null,"上海宝临防爆电器有限公司","董事长","2026-04-04 08:27:22.733","active","宝山","执行会长"],
    ["cmnk2khuo000k98oyypt5om7q","吴中平","13901643415",null,"中色国际控股集团有限公司","董事长","2026-04-04 08:27:22.849","active","静安","执行会长"],
    ["cmnk2khxn000l98oyqm9zzlh4","张国余","13311819155",null,"大宅金瑞商业管理有限公司","董事长","2026-04-04 08:27:22.956","active","嘉定","常务副会长"],
    ["cmnk2ki0n000m98oyci8nud0r","倪建生","13916011788",null,"上海索谷电缆集团有限公司","董事长","2026-04-04 08:27:23.063","active","奉贤","常务副会长"],
    ["cmnk2ki40000n98oyl1tcej9q","陈叔明","13916805999",null,"上海胜华电气股份有限公司","董事长","2026-04-04 08:27:23.184","active","浦东","常务副会长"],
    ["cmnk2ki7a000o98oyrv43luxm","陈磊","13901691085",null,"上海中科电气（集团）有限公司","总裁","2026-04-04 08:27:23.302","active","虹口","常务副会长"],
    ["cmnk2kiag000p98oyq3fn2ogo","郑建松","13817785555",null,"上海千洲实业有限公司","董事长","2026-04-04 08:27:23.416","active","嘉定","常务副会长"],
    ["cmnk2kidn000q98oyk3qadkhx","陈旭鹏","18930588888",null,"上海穆勒四通电气股份有限公司","董事长","2026-04-04 08:27:23.531","active","金山","常务副会长"],
    ["cmnk2kigx000r98oyonc4ix3d","余建东","13501717581",null,"上海循道新能源科技有限公司","总经理","2026-04-04 08:27:23.649","active","松江","常务副会长"],
    ["cmnk2kiju000s98oyp7o5zau2","胡建新","13585823588",null,"上海新龙塑料制造有限公司","董事长","2026-04-04 08:27:23.754","active","闵行","常务副会长"],
    ["cmnk2kimq000t98oyg0xboh66","赵安奶","13816365988",null,"上海安南正泰集团电器有限公司","总经理","2026-04-04 08:27:23.858","active","浦东","常务副会长"],
    ["cmnk2kipt000u98oyobpeeve6","王陈松","13817782222",null,"上海丹泉泵业（集团）有限公司","董事长","2026-04-04 08:27:23.969","active","奉贤","常务副会长"],
    ["cmnk2kisw000v98oy4r049gpz","陈小玲","15900975777",null,"上海朗浩控股有限公司","董事长","2026-04-04 08:27:24.08","active","长宁","常务副会长"],
    ["cmnk2kivv000w98oy9kr57p7p","陈余雷","13918101555",null,"上海胜华特种电缆有限公司","总经理","2026-04-04 08:27:24.187","active","浦东","常务副会长"],
    ["cmnk2kizm000x98oy1rh20exu","杨从新","13761971111",null,"上海金钟电气集团","董事长","2026-04-04 08:27:24.322","active","松江","常务副会长"],
    ["cmnk2kj2o000y98oy9hlw1dix","陈智","13774495556",null,"上海永进电缆（集团）有限公司","总裁","2026-04-04 08:27:24.432","active","奉贤","常务副会长"],
    ["cmnk2kj5t000z98oywrnfid89","陈琼","13917277777",null,"上海正泰电器销售有限公司","总经理","2026-04-04 08:27:24.546","active","嘉定","常务副会长"],
    ["cmnk2kj8v001098oy958sj5hs","吴方忠","13868788666",null,"上海侨亨实业有限公司","董事长","2026-04-04 08:27:24.656","active","松江","常务副会长"],
    ["cmnk2kjbw001198oygo1xdq9v","郑利锴","13901995268",null,"上海龙泓国际贸易有限公司","总经理","2026-04-04 08:27:24.764","active","虹口","常务副会长"],
    ["cmnk2kjeq001298oyrz5epsq5","张春媚","13816806099",null,"上海宝鹿车业有限公司","董事长","2026-04-04 08:27:24.866","active","松江","常务副会长"],
    ["cmnk2kjhs001398oy1d4idhvs","郑定丰","13817688828",null,"上海仑科电气集团有限公司","总经理","2026-04-04 08:27:24.976","active","静安","常务副会长"],
    ["cmnk2kjkn001498oyy2q5nn6a","薛文峰","13757778333",null,"上海长江电气设备集团有限公司","总经理","2026-04-04 08:27:25.079","active","松江","常务副会长"],
    ["cmnk2kjni001598oy9212u5xy","施瑶杰","13818607888",null,"上海北变科技股份有限公司","总经理","2026-04-04 08:27:25.182","active","松江","常务副会长"],
    ["cmnk2kjqj001698oy7cm5ftzy","郑温乐","13817383269",null,"上海港程投资咨询有限公司","董事长","2026-04-04 08:27:25.291","active","虹口","常务副会长"],
    ["cmnk2kjte001798oyt4fmn9uq","吴青燕","13706773362",null,"美丰农业科技（上海）有限公司","副总经理","2026-04-04 08:27:25.394","active","浦东","常务副会长"],
    ["cmnk2kjwp001898oylypu5nlz","张相矛","13777733232",null,"上海皋金实业有限公司","董事长","2026-04-04 08:27:25.513","active","徐汇","常务副会长"],
    ["cmnk2kjzu001998oyal6q5po8","郑奔","13968733870",null,"上海胜华电缆科技集团有限公司","营销总经理","2026-04-04 08:27:25.626","active","浦东","常务副会长"],
    ["cmnk2kk2x001a98oy28ghra9l","施金标","13501961999",null,"上海申旗投资有限公司、上海国延堂医药科技有限公司","总裁","2026-04-04 08:27:25.738","active","黄埔","常务副会长"],
    ["cmnk2kk62001b98oy0egiy5io","黄云斌","13818887077",null,"上海精科智能科技股份有限公司","董事长","2026-04-04 08:27:25.85","active","松江","常务副会长 2025"],
    ["cmnk2kk9k001c98oy3t77udwz","张丽园","13661792777",null,"上海同燕堂生物科技有限责任公司","总经理","2026-04-04 08:27:25.977","active","闵行","常务副会长 2025"],
    ["cmnk2kkch001d98oyjlnf2dwu","施银节","13601735600",null,"上海建桥集团","副董事长","2026-04-04 08:27:26.081","active","浦东","常务副会长"],
    ["cmnk2kkgf001e98oy9y6b96r6","李丰林","13918607888",null,"上海浦东电线电缆（集团）有限公司","总裁","2026-04-04 08:27:26.224","active","奉贤","常务副会长"],
    ["cmnk2kks3001f98oyawz1wxyx","王爱华","13858069168",null,"浙江创力融资租赁有限公司","常务副总","2026-04-04 08:27:26.643","active","青浦","常务副会长"],
    ["cmnk2kkwd001g98oy0u8cs9wn","臧微萍","13806607769",null,"上海菲姿服饰有限公司","总经理","2026-04-04 08:27:26.797","active","松江","常务副会长"],
    ["cmnk2kkzk001h98oygvj0lb53","方立坚","13601055011",null,"中通云商供应链有限公司","总经理","2026-04-04 08:27:26.913","active","青浦","常务副会长"],
    ["cmnk2kl2i001i98oyb65svw8h","施鹏","13817377777",null,"电光防爆科技（上海）有限公司","总经理","2026-04-04 08:27:27.018","active","闵行","常务副会长"],
    ["cmnk2kl5h001j98oy9109yh1n","赵建红","18930877055",null,"上海隆众原生物科技有限公司","总经理","2026-04-04 08:27:27.125","active","浦东","常务副会长"],
    ["cmnk2klbx001l98oyahwyq0iv","包天培","15821772801",null,"爱康企业集团（上海）有限公司","副总","2026-04-04 08:27:27.357","active","浦东","理事"],
    ["cmnk2kler001m98oy5it2kolm","陈勇","13901871831",null,"上海贝特医疗器械有限公司","总经理","2026-04-04 08:27:27.459","active","浦东","常务副会长"],
    ["cmnk2kli8001n98oyt8oanum4","金爱武","13901967815",null,"中期贵金属电子商务（上海）有限公司","董事长","2026-04-04 08:27:27.584","active","黄浦","常务副会长"],
    ["cmnk2kllp001o98oyk4dggel9","胡星友","13651788788",null,"上海久电电力集团有限公司","董事长","2026-04-04 08:27:27.709","active","杨浦","理事"],
    ["cmnk2klp0001p98oy5yzxs4up","黄兴良","13917116658",null,"上海金诚建设发展有限公司","董事长","2026-04-04 08:27:27.828","active","嘉定","理事"],
    ["cmnk2kls7001q98oygcye7wy5","陈天荣","13917855188",null,"上海美上置业开发有限公司","董事长","2026-04-04 08:27:27.943","active","杨浦","理事"],
    ["cmnk2klve001r98oyf7anh2mh","黄紫诺","13817856929",null,"上海昶鑫诚建筑工程有限公司","总经理","2026-04-04 08:27:28.058","active","静安","理事"],
    ["cmnk2klyk001s98oyr0l8g8u4","陈建宝","13816918888",null,"上海格林德斯木业有限公司","董事长","2026-04-04 08:27:28.172","active","嘉定","理事"],
    ["cmnk2km28001t98oy073ifi47","叶理克","13905873901",null,"长城电器集团上海有限公司","总经理","2026-04-04 08:27:28.304","active","金山","理事"],
    ["cmnk2km5b001u98oybkj6lajx","钱匡","13601917188",null,"上海金电铜业有限公司","总经理","2026-04-04 08:27:28.416","active","静安","理事"],
    ["cmnk2km8s001v98oy8gv3h79e","叶海萍","13968716862",null,"上海豪进钢铁贸易有限公司","董事长","2026-04-04 08:27:28.54","active","静安","理事"],
    ["cmnk2kmbr001w98oy6yhvdic8","李祥武","13817188588",null,"上海鑫中兴防爆科技有限公司","总经理","2026-04-04 08:27:28.647","active","黄埔","理事"],
    ["cmnk2kmfj001x98oy84fboiph","余节仁","13701759861",null,"上海天银电器有限公司","总经理","2026-04-04 08:27:28.783","active","静安","理事"],
    ["cmnk2kmij001y98oytz3hxqum","郑佑俊","13817609111",null,"上海德宝密封件有限公司","总经理","2026-04-04 08:27:28.891","active","宝山","理事"],
    ["cmnk2kmlk001z98oye9qxiqx4","林升河","15900500789",null,"上海盛鑫糖酒食品有限公司","总经理","2026-04-04 08:27:29.001","active","黄埔","理事"],
    ["cmnk2kmok002098oyncwdd32q","金飞","13780102880",null,"上海嘉红食品有限公司","总经理","2026-04-04 08:27:29.109","active","嘉定","理事"],
    ["cmnk2kmrf002198oyz8uan0b1","黄冬冬","13774202020",null,"上海丰泰实业发展有限公司","董事长","2026-04-04 08:27:29.211","active","嘉定","理事"],
    ["cmnk2kmuk002298oyobhjzhj0","张辉","13917870623",null,"上海怀惠实业有限公司","总经理","2026-04-04 08:27:29.324","active","浦东","理事"],
    ["cmnk2kmxs002398oy03vrllrz","周安峰","13901747892",null,"上海贺新投资咨询有限公司","总经理","2026-04-04 08:27:29.441","active","徐汇","理事"],
    ["cmnk2kn0n002498oy0vxeh0md","胡小红","13901922103",null,"上海五林电控设备有限公司","经理","2026-04-04 08:27:29.544","active","黄埔","理事"],
    ["cmnk2kn3k002598oyelz531tv","林妙丽","13916532151",null,"上海基燕机电有限公司","总财务经理","2026-04-04 08:27:29.648","active","黄埔","理事"],
    ["cmnk2kn6j002698oybscr1a01","黄伟","15900431111",null,"中变集团上海变压器有限公司","总经理","2026-04-04 08:27:29.756","active","金山","常务副会长"],
    ["cmnk2kn9l002798oyv1i37spz","陈秀银","13918187852",null,"上海美岛电气配套有限公司","总经理","2026-04-04 08:27:29.865","active","浦东","理事"],
    ["cmnk2kncc002898oy6m8syxnh","黄旭印","13601727818",null,"上海欣咏电子有限公司","总经理","2026-04-04 08:27:29.965","active","黄埔","理事"],
    ["cmnk2knf8002998oyygxwq5em","吴方亮","13681615982",null,"上海乐成电子科技有限公司","总经理","2026-04-04 08:27:30.068","active","静安","理事"],
    ["cmnk2kni9002a98oy5vr1u79g","杨志勇","13901749869",null,"上海耐力电控设备有限公司","董事/副总经理","2026-04-04 08:27:30.178","active","黄埔","理事"],
    ["cmnk2knll002b98oylld71thv","南存龙","13761827777",null,"上海瓯亚机电设备有限公司","总经理","2026-04-04 08:27:30.297","active","浦东","理事"],
    ["cmnk2knom002c98oy9d8n4z8j","朱立存","18841475266",null,"上海人民电器开关厂有限公司","销售经理","2026-04-04 08:27:30.406","active","徐汇","理事"],
    ["cmnk2knro002d98oyzpheboap","陈云勇","13916331777",null,"上海复大品牌研究所有限公司","所长","2026-04-04 08:27:30.517","active","徐汇","理事"],
    ["cmnk2knup002e98oyw56tfjcx","叶理获","13291731073",null,"上海翰煜管理咨询中心（有限合伙）","董事长","2026-04-04 08:27:30.626","active",null,"理事"],
    ["cmnk2kny0002f98oyxtpfzgvg","张雁红","13956183787",null,"上海中岛广源企业咨询有限公司","董事长","2026-04-04 08:27:30.744","active","闵行","理事"],
    ["cmnk2ko17002g98oygnmbmbx8","郑祥英","1376128777",null,"上海侨亨实业有限公司","总经理","2026-04-04 08:27:30.859","active","松江","理事"],
    ["cmnk2ko48002h98oyhva61p3a","倪晓敏","13506672520",null,"浙江敏乐船舶科技有限公司","总经理","2026-04-04 08:27:30.969","active",null,"理事"],
    ["cmnk2ko7s002i98oyzas2nvg0","李孙龙","13761685555",null,"上海晟江机械设备有限公司","总经理","2026-04-04 08:27:31.096","active","浦东","理事"],
    ["cmnk2koas002j98oy8dumxcad","郑荷芬","13585567866",null,"上海新龙塑料制造有限公司","财务总监","2026-04-04 08:27:31.205","active","闵行","理事"],
    ["cmnk2koea002k98oyz0h29fn5","赵顺荣","13905871859",null,"上海卓帅汽车技术有限公司","总经理","2026-04-04 08:27:31.331","active","浦东","理事"],
    ["cmnk2koh8002l98oyyv67nscg","朱清林","13916790999",null,"上海众业通电缆股份有限公司","董事长","2026-04-04 08:27:31.436","active","奉贤","理事"],
    ["cmnk2koke002m98oyx0z720g5","万丁海","13585766186",null,"上海分镜文化传媒有限公司","总经理","2026-04-04 08:27:31.55","active","浦东","理事"],
    ["cmnk2kont002n98oyzwp6bcva","徐克盛","13671503555",null,"上海伊顿通用设备有限公司","总经理","2026-04-04 08:27:31.674","active","奉贤","理事"],
    ["cmnk2koqv002o98oytriqfe58","高建德","18221999996",null,"上海鑫颖金属材料有限公司","总经理","2026-04-04 08:27:31.784","active","奉贤","理事"],
    ["cmnk2kouh002p98oy0bjspf7v","南存赞","13764301432",null,"上海永瑞流体技术有限公司","总经理","2026-04-04 08:27:31.913","active","松江","理事"],
    ["cmnk2koxm002q98oyl51v1a2q","南朋双","13801800897",null,"南喆电气科技（上海）有限公司","总经理","2026-04-04 08:27:32.027","active","金山","理事"],
    ["cmnk2kp0s002r98oy0hnfnehe","南君泉","13917386616",null,"上海固安祥电气配套有限公司","总经理","2026-04-04 08:27:32.14","active","普陀","理事"],
    ["cmnk2kp3t002s98oy2kfugzng","李特","18018658666",null,"上海启世投资管理有限公司","总经理","2026-04-04 08:27:32.25","active","黄埔","理事"],
    ["cmnk2kp7c002t98oyo79wce1p","包希明","13901871820",null,"上海基艳机电有限公司","总经理","2026-04-04 08:27:32.376","active","黄埔","理事"],
    ["cmnk2kpa8002u98oy5ib2irh0","陈泽","13524339774",null,"上海来石文化创意设计有限公司","总经理","2026-04-04 08:27:32.48","active","宝山","理事"],
    ["cmnk2kpda002v98oyxehtzrbl","陈振刚","13761273979",null,"上海通用重工集团有限公司","总经理","2026-04-04 08:27:32.591","active","浦东","理事"],
    ["cmnk2kpgn002w98oyutyed0b6","李乐超","18917742322",null,"上海申开电力建设工程有限公司","总经理","2026-04-04 08:27:32.711","active","浦东","理事"],
    ["cmnk2kpjm002x98oym5xy6qra","朱小春","13868718587",null,"悦儿国际贸易（上海）有限公司","总经理","2026-04-04 08:27:32.818","active","浦东","理事"],
    ["cmnk2kpn3002y98oy83kpkm7l","张珍妃","13003115412",null,"上海电器厂实业有限公司","经理","2026-04-04 08:27:32.943","active","虹口","理事"],
    ["cmnk2kppz002z98oyjgykc0el","陈永杰","13777733377",null,"上海永源企业发展股份有限公司","总经理","2026-04-04 08:27:33.047","active","宝山","理事"],
    ["cmnk2kptk003098oyxwsbkpqs","林道善","13916291888",null,"上海涵博生物科技有限公司","总经理","2026-04-04 08:27:33.176","active","黄埔","理事"],
    ["cmnk2kpwi003198oyglo1jy2b","金声扬","13818185777",null,"上海市少年儿童业余美术学校","理事长","2026-04-04 08:27:33.282","active","黄浦","理事"],
    ["cmnk2kpzk003298oy9pcxgyyd","施乐翔","18916069799",null,"平安银行股份有限公司上海外滩支行","副行长","2026-04-04 08:27:33.393","active","黄埔","理事"],
    ["cmnk2kq2n003398oyb6ovh40u","徐财源","13918603567",null,"财源在线（上海）网络科技有限公司","董事长","2026-04-04 08:27:33.504","active","浦东","理事 2021"],
    ["cmnk2kq5p003498oyk4kwivd8","余旭雷","13901831469",null,"上海户泰五金机电有限公司","总经理","2026-04-04 08:27:33.613","active","松江","理事 2021"],
    ["cmnk2kq95003598oymhqqrok6","叶树民","18901875555",null,"上海雅易电气有限公司","总经理","2026-04-04 08:27:33.738","active","奉贤","理事 2021"],
    ["cmnk2kqc4003698oyw3n6ug19","金胜威","13816127858",null,"上海硕玛电气有限公司","总经理","2026-04-04 08:27:33.845","active","青浦","理事 2021"],
    ["cmnk2kqf5003798oyrzn3ye4z","金林辉","13310160518",null,"上海盛临贸易有限公司","总经理","2026-04-04 08:27:33.954","active","浦东","理事 2021"],
    ["cmnk2kqi5003898oy5omrcojq","庄庆冠","13757758777",null,"上海海之仙餐饮管理有限公司","总经理","2026-04-04 08:27:34.062","active","浦东","理事 2021"],
    ["cmnk2kql9003998oydwzc6n91","张湖克","13371958058",null,"上海宝临照明科技股份有限公司","总经理","2026-04-04 08:27:34.173","active","宝山","理事 2021"],
    ["cmnk2kqo4003a98oy428e8m51","吴旭东","13310160511",null,"上海盛佰贸易有限公司","总经理","2026-04-04 08:27:34.276","active","宝山","理事 2021"],
    ["cmnk2kqr7003b98oygtbii4t9","钱旭敏","18101611001",null,"上海文歌电气有限公司","总经理","2026-04-04 08:27:34.388","active","静安","理事 2021"],
    ["cmnk2kqu7003c98oy39531oau","戴国清","13701792212",null,"上海节高电子科技有限公司","总经理","2026-04-04 08:27:34.496","active","闵行","理事 2021"],
    ["cmnk2kqx5003d98oygeli5lym","李登","13818179555",null,"光大证券股份有限公司","投资顾问","2026-04-04 08:27:34.602","active","浦东","理事 2021"],
    ["cmnk2kr08003e98oy8ao4ch0a","胡洪丽","13818505777",null,"夜光杯酒业","合伙人","2026-04-04 08:27:34.712","active","普陀区","理事 2021"],
    ["cmnk2kr3b003f98oyg7w43ojb","陈浩放","13817435666",null,"德标管业（上海）有限公司","采购","2026-04-04 08:27:34.823","active","奉贤","理事 2021"],
    ["cmnk2kr6h003g98oyg8puuura","陈也丹","13611610775",null,"上海圆正财务咨询有限公司","机构负责人","2026-04-04 08:27:34.937","active","宝山","理事 2021"],
    ["cmnk2kr9c003h98oyi3ff9c2r","陈文旺","17302118989",null,"上海伟肯实业有限公司","副总经理","2026-04-04 08:27:35.04","active","嘉定区","理事 2022"],
    ["cmnk2krcd003i98oyehqg0sul","魏少强","17701768138",null,"上海浦广科技（集团）有限公司","销售副总","2026-04-04 08:27:35.15","active","嘉定区","理事 2022"],
    ["cmnk2krfh003j98oy2ws9jfe1","叶柏盛","13651983222",null,"上海柏威流体控制技术有限公司","总经理","2026-04-04 08:27:35.261","active","金山","理事 2022"],
    ["cmnk2krla003k98oytfovnspy","郑立威","13761610571",null,"上海嘉强典当有限公司","总经理","2026-04-04 08:27:35.37","active","徐汇区","理事"],
    ["cmnk2krod003l98oyw2rhac84","倪浩","15618501788",null,"海通证券股份有限公司","企业金融部","2026-04-04 08:27:35.581","active",null,"理事"],
    ["cmnk2krre003m98oy2sf0cokd","范长河","13868785151",null,"温州银行上海分行松江业务部","总经理","2026-04-04 08:27:35.69","active",null,"理事"],
    ["cmnk2krv1003n98oysdj5zdw0","王梦非","18858787000",null,"浙江乐粉轨道交通科技有限公司","总经理","2026-04-04 08:27:35.821","active",null,"理事"],
    ["cmnk2kry3003o98oyuw30zy8a","郑志强","13482066111",null,"上海浙商典当有限公司","总经理","2026-04-04 08:27:35.931","active",null,"理事"],
    ["cmnk2ks1c003p98oydajsryp0","金早洁","13506557713",null,"上海柯正资产管理有限公司","风控总监","2026-04-04 08:27:36.049","active","浦东","理事 2021"],
    ["cmnk2ks4a003q98oyh081hbld","戴秀燕","18701717028",null,"紫宸峰（上海）贸易有限公司","总经理","2026-04-04 08:27:36.155","active","青浦","理事 2024"],
    ["cmnk2ksay003s98oyhzd10ulu","郑展","13524885636",null,"华泰证券股份有限公司","高级经理","2026-04-04 08:27:36.394","active",null,"F"],
    ["cmnk2ksdw003t98oy3ezk4ndz","章全琪","13524010345",null,"电管家集团股份有限公司","合伙人","2026-04-04 08:27:36.501","active",null,"理事 2024"],
    ["cmnk2kskk003v98oyy93iqdg6","陈明辉","15869635445",null,"浙商银行上海分行",null,"2026-04-04 08:27:36.74","active","静安","理事 2024"],
    ["cmnk2kso1003w98oypyrnf3oa","姚章帆","13817458597",null,"上海婴珂商贸有限公司","电商运营经理","2026-04-04 08:27:36.865","active","静安","理事 2024"],
    ["cmnk2ksr2003x98oy283l5sss","陈权","13818774555",null,"上海西源宏电气设备有限公司","副总","2026-04-04 08:27:36.975","active","浦东","理事 2024"],
    ["cmnk2ksum003y98oyq5paoofy","郑碎萍","13918182678",null,"上海华容防爆科技有限公司","销售经理","2026-04-04 08:27:37.103","active","静安","理事 2024"],
    ["cmnk2ksxo003z98oy5d4sslc6","高翔","15821270571",null,"上海联华变压器厂有限公司","总经理","2026-04-04 08:27:37.213","active","奉贤","理事 2021"],
    ["cmnk2kt13004098oyjvu50355","李维中","13321996579",null,"上海日晋工程塑料有限公司","总经理","2026-04-04 08:27:37.335","active","宝山","理事 2024"],
    ["cmnk2kt44004198oyveggkrxo","钱凌志","13310101107",null,"上海野马浜律师事务所","权益合伙人","2026-04-04 08:27:37.444","active","黄埔区","理事 2025"],
    ["cmnk2kt73004298oy192u5jnl","唐泽轩","15067701863",null,"上海新缆电缆有限公司","经理","2026-04-04 08:27:37.551","active","奉贤区","理事 2025"],
    ["cmnk2kta1004398oy6q1g4gn5","刘茂灼","15316808552",null,"上海浦东软件园汇智科技有限公司","会员","2026-04-04 08:27:37.657","active","浦东","理事 2025"],
    ["cmnk2ktd5004498oyyzs1fn06","陈小兵","13761891891",null,"上海胜华电气股份有限公司","副总裁","2026-04-04 08:27:37.769","active","浦东","理事 2025"],
    ["cmnk2ktg1004598oywxo0acst","郑丽丹","18962831777",null,"上海嘉盟电力设备有限公司","行政总监","2026-04-04 08:27:37.874","active","金山","理事 2025"],
    ["cmnk2ktj3004698oyno472j7y","柯林伟","18368787887",null,"上海鸿幸盛实业有限公司","总经理","2026-04-04 08:27:37.984","active","松江区","理事 2025"],
    ["cmnk2ktma004798oyrnxjg1eb","王永超","13916913666",null,"上海东方刺绣家纺有限公司","总经理","2026-04-04 08:27:38.098","active","松江区","理事 2025"],
    ["cmnk2ktst004998oynwzg2ljg","高奇驰","13671715115",null,"上海奇皮尔电气制造有限公司",null,"2026-04-04 08:27:38.333","active",null,"理事 2026"],
    ["cmnk2ktw1004a98oybh7jjnyp","刘志高","15021777713",null,"上海一康康复医院股份有限公司","董事长","2026-04-04 08:27:38.449","active","徐汇","执行会长"],
    ["cmnk2ktz9004b98oy5o0rry6n","钱金成","13162245678",null,"德汇融资租赁有限公司","副董事长兼总经理","2026-04-04 08:27:38.565","active","浦东","常务副会长"],
    ["cmnk2ku2v004c98oy8sat18gv","朱乐千","13905873007",null,"上海瑞奇汽配有限公司","总经理","2026-04-04 08:27:38.695","active","松江","理事"],
    ["cmnk2ku5u004d98oyvua9sn53","陈磊","18621011580",null,"上海金蓝机电设备成套有限公司","经理","2026-04-04 08:27:38.803","active","嘉定","理事"],
    ["cmnk2ku8w004e98oyehpi7ub3","郑彩乐","13918226666",null,"上海欧士通机电设备有限公司","总经理","2026-04-04 08:27:38.913","active","奉贤","理事"],
    ["cmnk2kubw004f98oyzdpf6dag","徐粟","15000610503",null,"东禾健康管理（上海）有限公司","总经理","2026-04-04 08:27:39.02","active","浦东","理事"],
    ["cmnk2kg6t000298oyddh1fqwl","王思龙","13800000000",null,null,null,"2026-04-04 08:27:20.693","active",null,null],
    ["cmnk2kunf004j98oyghqztnn6","陈琢","13671710281",null,"上海易维堡信息科技有限公司","总经理","2026-04-04 08:27:39.435","active","宝山","理事 2021"],
    ["cmnk2kuql004k98oykav1kof7","杨玉晓","13661758833",null,"上海展元国际贸易有限公司","总经理","2026-04-04 08:27:39.549","active","浦东","理事 2021"],
    ["cmnk2kuth004l98oybsvg372a","张小兰","13505876526",null,"古墨风韵（杭州）影视文化传媒有限责任公司","副总经理","2026-04-04 08:27:39.654","active","黄埔","理事"],
    ["cmnk2kuwg004m98oy71jubfiv","郑元虎","13916551457",null,"上海和田光电技术有限公司","总经理","2026-04-04 08:27:39.761","active","浦东","理事"],
    ["cmnk2kuzk004n98oynaie94ox","陈文葆","13905872746",null,"合兴集团有限公司","董事长","2026-04-04 08:27:39.873","active","松江","执行会长"],
    ["cmnk2kv2l004o98oydpoacth1","林忠福","13916566477",null,"上海中塑管业有限公司","副总经理","2026-04-04 08:27:39.981","active","金山","理事"],
    ["cmnk2kv5n004p98oyome0v170","郑祥义","13816578666",null,"上海中塑管业有限公司","总经理","2026-04-04 08:27:40.091","active","金山","理事"],
    ["cmnk2kv8t004q98oyar1lq56p","钱金耐","13818068688",null,"德汇实业集团有限公司","董事长","2026-04-04 08:27:40.205","active","浦东","执行会长"],
    ["cmnk2kvbv004r98oya66bnq6k","余晓泉","13917866788",null,"德汇实业集团有限公司","部长","2026-04-04 08:27:40.315","active","浦东","常务副会长"],
    ["cmnk2kvex004s98oy4chnikmn","陈升旦","13601853888",null,"上海信统电器有限公司","董事长","2026-04-04 08:27:40.426","active","黄埔","常务副会长"],
    ["cmnk2kvhr004t98oylv2i42v4","徐顺宝","13801712131",null,"上海南自科技股份有限公司","董事长","2026-04-04 08:27:40.527","active","普陀","常务副会长"],
    ["cmnk2kvkx004u98oy9jtxfkpf","屠方记","15316885889",null,"上海宏挺机械设备制造有限公司 上海宏挺紧固件制造有限公司","董事长","2026-04-04 08:27:40.641","active","松江","常务副会长"],
    ["cmnk2kvnx004v98oy73ixvedo","赵建新","13701735601",null,"上海埃科燃气测控设备有限公司","总经理","2026-04-04 08:27:40.749","active","松江","常务副会长"],
    ["cmnk2kvr6004w98oynglqf5wf","南程成","13310118828",null,"上海俏达健康管理有限公司","ceo","2026-04-04 08:27:40.866","active","闵行","常务副会长"],
    ["cmnk2kvwv004x98oytky72ye8","付献宇","13321865558",null,"上海柯付林实业有限公司","总经理","2026-04-04 08:27:41.071","active","嘉定","理事"],
    ["cmnk2kvzu004y98oyl96vz9tp","孙攀","13816890617",null,"上海精珅新材料有限公司","总经理","2026-04-04 08:27:41.178","active","金山","理"],
    ["cmnk2kw54004z98oy3jwf024p","朱卓敏","18621570606",null,"上海电享信息科技有限公司","创始人/ceo","2026-04-04 08:27:41.368","active","普陀","常务副会长"],
    ["cmnk2kw82005098oy6xhdibva","王国良","13641847777",null,"上海友邦电气（集团）股份有限公司","董事长","2026-04-04 08:27:41.475","active","松江","常务副会长"],
    ["cmnk2kwb6005198oyxaeoykwq","王培建","15921131111",null,"衡宝科技（上海）有限公司","总经理","2026-04-04 08:27:41.586","active","浦东","常务副会长"],
    ["cmnk2kwea005298oytxfmpems","吴旭雄","13601612345",null,"上海凯士邦企业发展有限公司","董事长","2026-04-04 08:27:41.698","active","浦东","常务副会长"],
    ["cmnk2kwht005398oy26t0xa47","周克","15000104554",null,"上海华一电气（集团）有限公司","总经理","2026-04-04 08:27:41.825","active","宝山","理事"],
    ["cmnk2kwkt005498oyrk2wexqf","高知克","13671540777",null,"上海飞策防爆电器有限公司","总经理","2026-04-04 08:27:41.933","active","闸北","常务副会长"],
    ["cmnk2kwoa005598oy6d1yss4t","吴杰","13788958185",null,"上海亲易实业集团有限公司","执行总裁","2026-04-04 08:27:42.058","active","浦东","理事"],
    ["cmnk2kwrg005698oyjfyi8nlp","朱银海","15618159999",null,"上海胜华环保科技集团有限公司",null,"2026-04-04 08:27:42.172","active","浦东","理事 2021"],
    ["cmnk2kwv5005798oynnclfhfh","叶定强","18604352228",null,"安能允智慧（上海）能源有限公司","总经理","2026-04-04 08:27:42.306","active","嘉定","理事 2024"],
    ["cmnk2kwy4005898oyxv5rgnxp","叶选高","13905879268",null,"上海科常工程管理咨询中心","总经理","2026-04-04 08:27:42.413","active","宝山","理事 2021"],
    ["cmnk2kx1x005998oyg9ycf57e","王建中","13818866229",null,"上海胜华电气股份有限公司","副总裁","2026-04-04 08:27:42.549","active","浦东","理事 2025"],
    ["cmnk2kx4y005a98oy5ad8s3m8","虞娇蓉","13968710611",null,"上海德首实业有限公司","总经理","2026-04-04 08:27:42.658","active",null,"理事"],
    ["cmnk2kx8j005b98oymui5aulg","金文义","13916769666",null,"上海浙南物流有限公司","经理","2026-04-04 08:27:42.787","active","宝山","理事"],
    ["cmnk2kxbv005c98oy5xp2uo48","叶金欧","13681866626",null,"上海三开电气制造股份有限公司","副总","2026-04-04 08:27:42.907","active","嘉定","理事"],
    ["cmnk2kxf4005d98oy4yj5grbm","石成海","13376276666",null,"上海郑民电器有限公司","总经理","2026-04-04 08:27:43.025","active",null,"理事"],
    ["cmnk2kxi8005e98oyex65at2p","李乐微","13918593388",null,"深圳市瓯亚凯科技有限公司上海办事处","主任","2026-04-04 08:27:43.136","active","杨浦","理事"],
    ["cmnk2kxlq005f98oywx7l3wi7","李剑","18721958288",null,"乐清市金春石斛有限公司","总经理","2026-04-04 08:27:43.262","active","静安","理事"],
    ["cmnk2kxoy005g98oyytb5vqkw","郑春华","17863727288",null,"立帮秀珀化工涂料有限公司","总经理","2026-04-04 08:27:43.378","active","浦东","理事 2024"]
  ];

  console.log(`Importing ${members.length} members...`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const [id, name, phone, email, company, position, joindate, status, district, chamberTitle] of members) {
    try {
      await client.query(
        `INSERT INTO "Member" (id, name, phone, email, company, position, joindate, status, district, "chamberTitle", createdat, updatedat)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11)
         ON CONFLICT (phone) DO NOTHING`,
        [id, name, phone, email, company, position || null, joindate || null, status || 'active', district || null, chamberTitle || null, joindate || new Date().toISOString()]
      );
      inserted++;
      if (inserted <= 5) console.log(`  ✓ ${name} - ${company}`);
    } catch (err) {
      failed++;
      if (failed <= 3) console.error(`  ✗ ${name}: ${(err as Error).message}`);
    }
  }

  console.log(`Migration done: ${inserted} inserted, ${skipped} skipped, ${failed} failed`);

  // Verify
  const newCount = await client.query('SELECT COUNT(*) FROM "Member"');
  console.log(`Total members in database: ${newCount.rows[0].count}`);

  await client.end();
}

// Root route contract: Use /api, /api/docs, or /health.

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  // Run migrations in sequence
  Promise.all([
    migrateCompanies().catch(e => console.error('Company Migration error:', e)),
    migrateMembers().catch(e => console.error('Member Migration error:', e))
  ]).then(() => {
    const server = app.listen(PORT, () => {
      console.log('🚀 服务器运行在 http://localhost:' + PORT);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  });
}

export { createApp };
export default app;
