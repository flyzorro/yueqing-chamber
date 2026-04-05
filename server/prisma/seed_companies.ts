import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding companies...');

  const companies = [
    {
      name: "浙江天正电气股份有限公司",
      address: "上海市浦东新区康桥东路388号",
      industry: "",
    },
    {
      name: "电光防爆科技股份有限公司",
      address: "上海市闵行区江月路1377号",
      industry: "",
    },
    {
      name: "上海德力西集团有限公司",
      address: "",
      industry: "",
    },
    {
      name: "中通快递股份有限公司",
      address: "上海是青浦区华志路1685号",
      industry: "",
    },
    {
      name: "华荣科技股份有限公司",
      address: "上海市嘉定区宝线公路555号",
      industry: "",
    },
    {
      name: "上海创力集团股份有限公司",
      address: "上海市青浦区香花桥街道新康路889号 石华辉",
      industry: "",
    },
    {
      name: "南亚新材料科技股份有限公司",
      address: "嘉定区南翔镇昌翔路158号",
      industry: "",
    },
    {
      name: "上海浦东电线电缆（集团）有限公司",
      address: "上海市奉贤区青村镇青港工业园区上线路777号",
      industry: "",
    },
    {
      name: "上海金开利集团",
      address: "上海市黄浦区西藏南路758号金开利广场5楼",
      industry: "",
    },
    {
      name: "上海隆众产业园",
      address: "上海杨浦区秦皇岛路32-28号三楼滨江隆众产业园陈汉星，",
      industry: "",
    },
    {
      name: "爱康企业集团（上海）有限公司",
      address: "上海市浦东新区申江南路4828号 沈晓波",
      industry: "",
    },
    {
      name: "北京市京师（上海）律师事务所",
      address: "静安区恒丰路299号京师律师广场三楼",
      industry: "",
    },
    {
      name: "泽大（上海）律师事务所",
      address: "上海市静安区铜仁路299号SOHO东海广场4301室",
      industry: "",
    },
    {
      name: "上海晶茂投资有限公司",
      address: "上海市奉贤区庄行镇光明中心路399号",
      industry: "",
    },
    {
      name: "上海申之江珠宝集团有限公司",
      address: "上海市云南北路30号",
      industry: "",
    },
    {
      name: "上海歌特维生物科技集团",
      address: "上海浦东新区芙蓉花路500弄3号",
      industry: "",
    },
    {
      name: "上海乐港电器有限公司",
      address: "上海松江区新桥镇春申村金都西路999号",
      industry: "",
    },
    {
      name: "摩融控股集团有限公司",
      address: "青浦区华新镇华腾路1218号36幢三楼。",
      industry: "",
    },
    {
      name: "上海菲姿服饰有限公司",
      address: "上海市松江区九亭久富开发区盛龙路1号",
      industry: "",
    },
    {
      name: "上海宝临防爆电器有限公司",
      address: "富联路890号",
      industry: "",
    },
    {
      name: "中色国际控股集团有限公司",
      address: "上海市中山北路3000号长城大厦1108室",
      industry: "",
    },
    {
      name: "大宅金瑞商业管理有限公司",
      address: "上海市嘉定区曹安路1718号威隆大厦4楼",
      industry: "",
    },
    {
      name: "上海索谷电缆集团有限公司",
      address: "上海市奉贤区奉浦工业园区同谊路188号",
      industry: "",
    },
    {
      name: "上海胜华电气股份有限公司",
      address: "上海浦东新区新场镇申江南路7877号",
      industry: "",
    },
    {
      name: "上海中科电气（集团）有限公司",
      address: "上海市虹口区四川北路1666号高宝百货9楼",
      industry: "",
    },
    {
      name: "上海千洲实业有限公司",
      address: "上海市嘉定区南翔镇顺达路98弄10号楼",
      industry: "",
    },
    {
      name: "上海穆勒四通电气股份有限公司",
      address: "上海市金山工业区茂业路588号",
      industry: "",
    },
    {
      name: "上海循道新能源科技有限公司",
      address: "上海市松江区松汇西路1799号",
      industry: "",
    },
    {
      name: "上海新龙塑料制造有限公司",
      address: "上海闵行区虹梅南路4828号",
      industry: "",
    },
    {
      name: "上海安南正泰集团电器有限公司",
      address: "上海市浦东新区浦东南路1101号远东大厦1712-1713座",
      industry: "",
    },
    {
      name: "上海丹泉泵业（集团）有限公司",
      address: "上海市奉贤区青灵路333号（上海丹泉泵业集团）",
      industry: "",
    },
    {
      name: "上海朗浩控股有限公司",
      address: "上海市长宁区延安西路1160号首信银都国际广场5楼",
      industry: "",
    },
    {
      name: "上海胜华特种电缆有限公司",
      address: "上海浦东宣桥宣镇东路888号",
      industry: "",
    },
    {
      name: "上海金钟电气集团",
      address: "松江叶榭镇叶昌路18号",
      industry: "",
    },
    {
      name: "上海永进电缆（集团）有限公司",
      address: "上海市奉贤区金汇镇金聚路388号",
      industry: "",
    },
    {
      name: "上海正泰电器销售有限公司",
      address: "上海市嘉定区方德路101弄37-38号",
      industry: "",
    },
    {
      name: "上海侨亨实业有限公司",
      address: "上海市松江工业区车墩车阳路111号",
      industry: "",
    },
    {
      name: "上海龙泓国际贸易有限公司",
      address: "上海海宁路1399号2217室",
      industry: "",
    },
    {
      name: "上海宝鹿车业有限公司",
      address: "上海市松江区车新公路385号",
      industry: "",
    },
    {
      name: "上海仑科电气集团有限公司",
      address: "上海静安区中山北路899弄36号",
      industry: "",
    },
    {
      name: "上海长江电气设备集团有限公司",
      address: "上海市松江区佘山镇勋业路376号",
      industry: "",
    },
    {
      name: "上海北变科技股份有限公司",
      address: "上海市松江区闵塔路333号",
      industry: "",
    },
    {
      name: "上海港程投资咨询有限公司",
      address: "海宁路899号504室",
      industry: "",
    },
    {
      name: "美丰农业科技（上海）有限公司",
      address: "浦东新区浙桥路289弄2号楼2306室",
      industry: "",
    },
    {
      name: "上海皋金实业有限公司",
      address: "上海市徐汇区云锦路绿地汇中心A座907室",
      industry: "",
    },
    {
      name: "上海胜华电缆科技集团有限公司",
      address: "凤创谷科创基地2号楼1-506优涵研发",
      industry: "",
    },
    {
      name: "上海申旗投资有限公司、上海国延堂医药科技有限公司",
      address: "上海市黄浦区汉口路551号",
      industry: "",
    },
    {
      name: "上海精科智能科技股份有限公司",
      address: "浙江省嘉兴市嘉善县惠民街道永胜路37号嘉兴精科科技有限公司黄云斌收",
      industry: "",
    },
    {
      name: "上海同燕堂生物科技有限责任公司",
      address: "上海市闵行区梅陇镇银都路759弄555号银都会酒店三楼会所",
      industry: "",
    },
    {
      name: "上海建桥集团",
      address: "上海浦东新区临港新城沪成环路1111号",
      industry: "",
    },
    {
      name: "浙江创力融资租赁有限公司",
      address: "上海市青浦区香花桥街道新康路889号",
      industry: "",
    },
    {
      name: "中通云商供应链有限公司",
      address: "上海市青浦区华新镇华志路1685号中通新四号楼6楼",
      industry: "",
    },
    {
      name: "电光防爆科技（上海）有限公司",
      address: "上海市闵行区江月路1377号",
      industry: "",
    },
    {
      name: "上海隆众原生物科技有限公司 ",
      address: "浦东新区丁香路999弄16号1501室，赵建红，",
      industry: "",
    },
    {
      name: "上海贝特医疗器械有限公司",
      address: "上海市浦东新区新场工业区古爱路18号",
      industry: "",
    },
    {
      name: "中期贵金属电子商务（上海）有限公司",
      address: "上海市黄浦区北京东路270号七楼",
      industry: "",
    },
    {
      name: "上海久电电力集团有限公司",
      address: "上海市杨浦区平凉路1398号纺织大厦511室",
      industry: "",
    },
    {
      name: "上海金诚建设发展有限公司",
      address: "沪宜公路653号6楼",
      industry: "",
    },
    {
      name: "上海美上置业开发有限公司",
      address: "上海市 浦东新区 福山路51-2号G17室",
      industry: "",
    },
    {
      name: "上海昶鑫诚建筑工程有限公司",
      address: "上海市杨浦区飞虹路600弄15号602室黄志芬",
      industry: "",
    },
    {
      name: "上海格林德斯木业有限公司",
      address: "上海市嘉定区马陆镇博学路538号",
      industry: "",
    },
    {
      name: "长城电器集团上海有限公司",
      address: "上海市金山区月工路777号",
      industry: "",
    },
    {
      name: "上海金电铜业有限公司",
      address: "上海市闸北区永兴路258号1号楼902室",
      industry: "",
    },
    {
      name: "上海豪进钢铁贸易有限公司",
      address: "上海市静安区中华新路199弄雅宾利9-103",
      industry: "",
    },
    {
      name: "上海鑫中兴防爆科技有限公司",
      address: "上海市黄浦区北京东路668号科技京城赛格市场C区207",
      industry: "",
    },
    {
      name: "上海天银电器有限公司",
      address: "上海市黄浦区北京东路668号科技京城C区5楼C522室",
      industry: "",
    },
    {
      name: "上海德宝密封件有限公司",
      address: "上海市宝山区园泰路333号",
      industry: "",
    },
    {
      name: "上海盛鑫糖酒食品有限公司",
      address: "上海市黄浦区毛家园路161号",
      industry: "",
    },
    {
      name: "上海嘉红食品有限公司",
      address: "上海市嘉定区沪宜公路3128号嘉尚国际1207室",
      industry: "",
    },
    {
      name: "上海丰泰实业发展有限公司",
      address: "上海嘉定金园一路588弄2幢502室",
      industry: "",
    },
    {
      name: "上海怀惠实业有限公司",
      address: "浦东新区东方路989号中达广场1003室",
      industry: "",
    },
    {
      name: "上海贺新投资咨询有限公司",
      address: "上海市徐汇区中山南二路930号301室",
      industry: "",
    },
    {
      name: "上海五林电控设备有限公司",
      address: "上海市黄浦区浙江中路188弄4号201-202",
      industry: "",
    },
    {
      name: "上海基燕机电有限公司",
      address: "上海市黄浦区北京东路668号1B21室",
      industry: "",
    },
    {
      name: "中变集团上海变压器有限公司",
      address: "上海市金山工业区亭卫公路4185号",
      industry: "",
    },
    {
      name: "上海美岛电气配套有限公司",
      address: "上海市浦东新区沪南路2419弄30号203室",
      industry: "",
    },
    {
      name: "上海欣咏电子有限公司",
      address: "上海市北京东路668号1H31室",
      industry: "",
    },
    {
      name: "上海乐成电子科技有限公司",
      address: "上海市闸北区海宁路1399号1923室",
      industry: "",
    },
    {
      name: "上海耐力电控设备有限公司",
      address: "上海市黄浦区广西北路528号1304室",
      industry: "",
    },
    {
      name: "上海瓯亚机电设备有限公司",
      address: "上海市浦东新区古爱路18号",
      industry: "",
    },
    {
      name: "上海人民电器开关厂有限公司  ",
      address: "上海市徐汇区石龙路999弄7号1401",
      industry: "",
    },
    {
      name: "上海复大品牌研究所有限公司",
      address: "上海市闵行区新龙路1333弄40号",
      industry: "",
    },
    {
      name: "上海翰煜管理咨询中心（有限合伙）",
      address: "浙江乐清开发区凌云路总部经济园2 幢8 07 兴华会计师事务所",
      industry: "",
    },
    {
      name: "上海中岛广源企业咨询有限公司",
      address: "上海市闵行区芦恒路390号",
      industry: "",
    },
    {
      name: "浙江敏乐船舶科技有限公司",
      address: "浙江省乐清市虹桥镇信岙工业区信达路1号",
      industry: "",
    },
    {
      name: "上海晟江机械设备有限公司",
      address: "上海市浦东东方路985号19楼A室",
      industry: "",
    },
    {
      name: "上海卓帅汽车技术有限公司 ",
      address: "上海浦东新区金海路2449号7号楼205",
      industry: "",
    },
    {
      name: "上海众业通电缆股份有限公司",
      address: "奉贤区青村镇上塑路1818号",
      industry: "",
    },
    {
      name: "上海分镜文化传媒有限公司",
      address: "浦东新区三林路868号",
      industry: "",
    },
    {
      name: "上海伊顿通用设备有限公司 ",
      address: "上海市奉贤区沪杭公路599号 徐克盛",
      industry: "",
    },
    {
      name: "上海鑫颖金属材料有限公司",
      address: "上海市奉贤区沪杭公路655号",
      industry: "",
    },
    {
      name: "上海永瑞流体技术有限公司",
      address: "上海松江区泖港镇新明路658号3号楼2楼",
      industry: "",
    },
    {
      name: "南喆电气科技（上海）有限公司",
      address: "上海金山大道4168弄8幢129号（金山国际贸易城二期）正泰电器",
      industry: "",
    },
    {
      name: "上海固安祥电气配套有限公司",
      address: "上海市兰溪路900弄15号1722室",
      industry: "",
    },
    {
      name: "上海启世投资管理有限公司",
      address: "上海市黄浦区西藏南路750号32楼",
      industry: "",
    },
    {
      name: "上海基艳机电有限公司",
      address: "北京东路668号1H26室",
      industry: "",
    },
    {
      name: "上海来石文化创意设计有限公司",
      address: "上海市宝山区真大路520号2号楼312室",
      industry: "",
    },
    {
      name: "上海通用重工集团有限公司",
      address: "上海市申江南路3888号",
      industry: "",
    },
    {
      name: "上海申开电力建设工程有限公司",
      address: "浦东新区东方路1523弄3号楼901室",
      industry: "",
    },
    {
      name: "悦儿国际贸易（上海）有限公司",
      address: "上海市嘉定区江桥镇鹤望路321号",
      industry: "",
    },
    {
      name: "上海电器厂实业有限公司",
      address: "上海市虹口区临平路333号11座3101室",
      industry: "",
    },
    {
      name: "上海永源企业发展股份有限公司",
      address: "上海市宝山区双城路803弄5幢8号1301室",
      industry: "",
    },
    {
      name: "上海涵博生物科技有限公司",
      address: "上海市奉贤区沪杭公路1588号",
      industry: "",
    },
    {
      name: "上海市少年儿童业余美术学校",
      address: "上海市浦东新区长岛路823弄50号",
      industry: "",
    },
    {
      name: "平安银行股份有限公司上海外滩支行",
      address: "上海市浦东新区陆家嘴环路1333号 平安金融大厦10楼 平安银行上海分行 集团客户金融部 施乐翔",
      industry: "",
    },
    {
      name: "财源在线（上海）网络科技有限公司",
      address: "上海市浦东新区巨峰路1058弄新紫茂大厦3号楼15楼",
      industry: "",
    },
    {
      name: "上海户泰五金机电有限公司",
      address: "：上海市松江区新桥镇泗砖南路255弄名企公馆29幢2楼办公室收 余旭雷67861792",
      industry: "",
    },
    {
      name: "上海雅易电气有限公司",
      address: "上海市奉贤区金海公路3500号",
      industry: "",
    },
    {
      name: "上海硕玛电气有限公司",
      address: "青浦区北青公路6598号A11幢",
      industry: "",
    },
    {
      name: "上海盛临贸易有限公司",
      address: "上海普陀区梅川路258弄安居瑶成湾11号802室",
      industry: "",
    },
    {
      name: "上海海之仙餐饮管理有限公司",
      address: "",
      industry: "",
    },
    {
      name: "上海宝临照明科技股份有限公司",
      address: "上海市宝山区富联路890号",
      industry: "",
    },
    {
      name: "上海盛佰贸易有限公司",
      address: "宝山区江杨北路1568弄83号301室",
      industry: "",
    },
    {
      name: "上海文歌电气有限公司",
      address: "静安区虬江路1150-6号",
      industry: "",
    },
    {
      name: "上海节高电子科技有限公司",
      address: "闵行区七莘路182号B栋201室",
      industry: "",
    },
    {
      name: "光大证券股份有限公司",
      address: "浦东新区张杨路1233号",
      industry: "",
    },
    {
      name: "夜光杯酒业",
      address: "普陀区兰溪路900弄4号2003",
      industry: "",
    },
    {
      name: "德标管业（上海）有限公司",
      address: "上海奉贤区青村镇光大路677号",
      industry: "",
    },
    {
      name: "上海圆正财务咨询有限公司",
      address: "上海市宝山区友谊路1588弄钢领3号楼706室",
      industry: "",
    },
    {
      name: "上海伟肯实业有限公司",
      address: "上海市嘉定区汇仁路1957号",
      industry: "",
    },
    {
      name: "上海浦广科技（集团）有限公司",
      address: "上海市嘉定汇仁路1500号9幢",
      industry: "",
    },
    {
      name: "上海柏威流体控制技术有限公司",
      address: "上海市金山区山阳镇山丰路222号",
      industry: "",
    },
    {
      name: "上海嘉强典当有限公司",
      address: "上海市徐汇区古美路1515弄19号楼609室",
      industry: "",
    },
    {
      name: "海通证券股份有限公司",
      address: "",
      industry: "",
    },
    {
      name: "温州银行上海分行松江业务部",
      address: "",
      industry: "",
    },
    {
      name: "浙江乐粉轨道交通科技有限公司",
      address: "浙江省乐清市淡溪镇第三工业区",
      industry: "",
    },
    {
      name: "上海浙商典当有限公司",
      address: "普陀区中山北路3000号长城大厦1108室",
      industry: "",
    },
    {
      name: "上海柯正资产管理有限公司",
      address: "浦东新区福山路500号2702室",
      industry: "",
    },
    {
      name: "紫宸峰（上海）贸易有限公司",
      address: "上海青浦区五厍浜路203号13幢6层E区678室",
      industry: "",
    },
    {
      name: "上海于上机电设备有限公司",
      address: "",
      industry: "",
    },
    {
      name: "华泰证券股份有限公司",
      address: "",
      industry: "",
    },
    {
      name: "电管家集团股份有限公司",
      address: "上海市、浦东新区、康桥镇、环桥路555弄38号",
      industry: "",
    },
    {
      name: "乐清农商银行",
      address: "",
      industry: "",
    },
    {
      name: "浙商银行上海分行",
      address: "静安区威海路267号",
      industry: "",
    },
    {
      name: "上海婴珂商贸有限公司",
      address: "上海市静安区长兴路168弄5号3001",
      industry: "",
    },
    {
      name: " 上海西源宏电气设备有限公司 ",
      address: "上海市浦东新区沪南公路3736号5弄5幢209室",
      industry: "",
    },
    {
      name: "上海华容防爆科技有限公司",
      address: "上海市静安区俞泾港路11号608室",
      industry: "",
    },
    {
      name: "上海联华变压器厂有限公司",
      address: "奉贤区青港工业园区光大路99号",
      industry: "",
    },
    {
      name: "上海日晋工程塑料有限公司",
      address: "",
      industry: "",
    },
    {
      name: "上海野马浜律师事务所",
      address: "上海市黄浦区金陵东路2号27层",
      industry: "",
    },
    {
      name: "上海新缆电缆有限公司",
      address: "上海市奉贤区金汇镇金钱公路1818号",
      industry: "",
    },
    {
      name: "上海浦东软件园汇智科技有限公司",
      address: "上海市浦东新区博云路111号",
      industry: "",
    },
    {
      name: "上海嘉盟电力设备有限公司",
      address: "上海金山区金山卫镇秦湾路346号",
      industry: "",
    },
    {
      name: "上海鸿幸盛实业有限公司",
      address: "松江洞泾镇蔡家浜路999号",
      industry: "",
    },
    {
      name: "上海东方刺绣家纺有限公司",
      address: "上海松江区北松公路6969号",
      industry: "",
    },
    {
      name: "上海希富实业发展有限公司",
      address: "",
      industry: "",
    },
    {
      name: "上海奇皮尔电气制造有限公司 ",
      address: "",
      industry: "",
    },
    {
      name: "上海一康康复医院股份有限公司",
      address: "徐汇区龙曹路200弄乙字1号",
      industry: "",
    },
    {
      name: "德汇融资租赁有限公司",
      address: "上海自贸区",
      industry: "",
    },
    {
      name: "上海瑞奇汽配有限公司",
      address: "浙江省乐清市柳市镇后西垟西兴路38号吧！朱乐千",
      industry: "",
    },
    {
      name: "上海金蓝机电设备成套有限公司",
      address: "上海嘉定区宝安公路2587号",
      industry: "",
    },
    {
      name: "上海欧士通机电设备有限公司",
      address: "奉贤西渡街道扶港路1555号 欧士通",
      industry: "",
    },
    {
      name: "东禾健康管理（上海）有限公司",
      address: "东禾怡康-上海市徐汇区医学院路69号华业大厦17楼A座",
      industry: "",
    },
    {
      name: "上海易维堡信息科技有限公司",
      address: "上海宝山梅林路358号",
      industry: "",
    },
    {
      name: "上海展元国际贸易有限公司",
      address: "浦东芳甸路77弄16号802室",
      industry: "",
    },
    {
      name: "古墨风韵（杭州）影视文化传媒有限责任公司",
      address: "上海黄浦区天津路155号20楼",
      industry: "",
    },
    {
      name: "上海和田光电技术有限公司",
      address: "上海市浦东新区和庆工业区仁庆路58号（近胜利路）",
      industry: "",
    },
    {
      name: "合兴集团有限公司",
      address: "松江区林荫新路佘山高尔夫郡3008号",
      industry: "",
    },
    {
      name: "上海中塑管业有限公司",
      address: "上海金山区枫泾镇兴塔工业区建安路61号",
      industry: "",
    },
    {
      name: "德汇实业集团有限公司",
      address: "上海市浦东新区锦康路308号陆家嘴世纪金融广场6号楼15F",
      industry: "",
    },
    {
      name: "上海信统电器有限公司",
      address: "上海市黄浦区北京东路381号",
      industry: "",
    },
    {
      name: "上海南自科技股份有限公司",
      address: "嘉定区嘉松北路4670号",
      industry: "",
    },
    {
      name: "上海宏挺机械设备制造有限公司 上海宏挺紧固件制造有限公司",
      address: "松江区泖港镇叶新公路3600弄3号 松江区泖港镇叶新支路西厍一路37",
      industry: "",
    },
    {
      name: "上海埃科燃气测控设备有限公司",
      address: "上海市松江区石湖荡镇贵南路1065号",
      industry: "",
    },
    {
      name: "上海俏达健康管理有限公司",
      address: "上海闵行区申长路988号7号楼103室",
      industry: "",
    },
    {
      name: "上海柯付林实业有限公司",
      address: "上海市嘉定区天祝路555弄2号楼",
      industry: "",
    },
    {
      name: "上海精珅新材料有限公司",
      address: "上海市金山区金舸路288号9幢",
      industry: "",
    },
    {
      name: "上海电享信息科技有限公司",
      address: "上海市徐汇区裕德路126号3005室（2022年换地址）",
      industry: "",
    },
    {
      name: "上海友邦电气（集团）股份有限公司",
      address: "上海松江区佘山工业区吉业路528号",
      industry: "",
    },
    {
      name: "衡宝科技（上海）有限公司",
      address: "上海市浦东新区长清北路53号中铝大厦三楼 束欣欣",
      industry: "",
    },
    {
      name: "上海凯士邦企业发展有限公司",
      address: "上海市浦东新区康桥东路1088号H幢302室",
      industry: "",
    },
    {
      name: "上海华一电气（集团）有限公司",
      address: "上海市宝山区罗泾镇罗宁路1515号",
      industry: "",
    },
    {
      name: "上海飞策防爆电器有限公司",
      address: "上海市闸北区京江路219号二楼",
      industry: "",
    },
    {
      name: "上海亲易实业集团有限公司",
      address: "上海市浦东新区沪南路3688号",
      industry: "",
    },
    {
      name: "上海胜华环保科技集团有限公司 ",
      address: "沪南公路7577号",
      industry: "",
    },
    {
      name: "安能允智慧（上海）能源有限公司",
      address: "青浦区熊猫广场B座802室 南汇",
      industry: "",
    },
    {
      name: "上海科常工程管理咨询中心",
      address: "上海市宝山区富联路890号",
      industry: "",
    },
    {
      name: "上海德首实业有限公司",
      address: "乐清经济开发区经三路121号",
      industry: "",
    },
    {
      name: "上海浙南物流有限公司",
      address: "上海市宝山区友谊路160号612室",
      industry: "",
    },
    {
      name: "上海三开电气制造股份有限公司",
      address: "上海市嘉定区外冈工业园北区汇仁路1618号",
      industry: "",
    },
    {
      name: "上海郑民电器有限公司",
      address: "上海市嘉定区安亭镇方泰国际五金城方陆路60号",
      industry: "",
    },
    {
      name: "深圳市瓯亚凯科技有限公司上海办事处",
      address: "上海市宝山区罗贤路388弄2号1402室",
      industry: "",
    },
    {
      name: "乐清市金春石斛有限公司",
      address: "上海市静安区共和新路1536号2楼2261",
      industry: "",
    },
    {
      name: "立帮秀珀化工涂料有限公司",
      address: "上海市浦东新区潍坊西路1弄9号22A",
      industry: "",
    },
  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: { name: company.name },
      update: { address: company.address },
      create: company,
    });
  }

  console.log(`Seeded ${companies.length} companies.`);

  // Seed products for the first 3 companies
  // 注意：依赖 Company.name 不变，如公司重命名需同步更新此处
  const productSeeds = [
    {
      companyName: '立帮秀珀化工涂料有限公司',
      products: [
        { name: '高性能地坪涂料', description: '适用于工业厂房、地下车库等场景，耐磨抗压', sortOrder: 0 },
        { name: '环保防腐涂装系统', description: '水性环保配方，耐化学品腐蚀，适用于化工厂房', sortOrder: 1 },
      ],
    },
    {
      companyName: '浙江天正电气股份有限公司',
      products: [
        { name: '智能配电柜', description: '数字化配电管理，支持远程监控和能耗分析', sortOrder: 0 },
        { name: '小型断路器', description: '家用及工业用电路保护元件，分断能力强', sortOrder: 1 },
      ],
    },
    {
      companyName: '电光防爆科技股份有限公司',
      products: [
        { name: '矿用防爆监控系统', description: '煤矿井下视频监控与安全预警系统', sortOrder: 0 },
        { name: '井下通信设备', description: '矿用本安型通信终端，支持语音和数据传输', sortOrder: 1 },
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
      await prisma.companyProduct.upsert({
        where: { id: `${company.id}-${product.name}` },
        update: { description: product.description, sortOrder: product.sortOrder },
        create: {
          id: `${company.id}-${product.name}`,
          companyId: company.id,
          name: product.name,
          description: product.description,
          sortOrder: product.sortOrder,
        },
      });
    }
    console.log(`Seeded ${seed.products.length} products for ${seed.companyName}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });