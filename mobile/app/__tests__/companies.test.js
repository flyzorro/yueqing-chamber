const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const readAppFile = (fileName) =>
  fs.readFileSync(path.join(repoRoot, fileName), 'utf8');

describe('company directory mobile implementation', () => {
  it('adds a dedicated companies route that fetches the companies API', () => {
    const screenSource = readAppFile('companies.tsx');

    expect(screenSource).toContain('企业名单');
    expect(screenSource).toContain('独立展示商会企业名录');
    expect(screenSource).toContain('正在加载企业名单');
    expect(screenSource).toContain('API.COMPANIES');
    expect(screenSource).toContain('联系人：');
    expect(screenSource).not.toContain('API.MEMBERS');
    expect(screenSource).not.toContain("router.push('/companies/");
    expect(screenSource).not.toContain('Link');
  });

  it('registers company directory separately from members in tab navigation', () => {
    const layoutSource = readAppFile('_layout.tsx');

    expect(layoutSource).toContain('name="members"');
    expect(layoutSource).toContain("title: '会员中心'");
    expect(layoutSource).toContain('name="companies"');
    expect(layoutSource).toContain("title: '企业名单'");
    expect(layoutSource).toContain('name="activities"');
    expect(layoutSource).toContain('name="services"');
    expect(layoutSource).toContain('useFonts(Ionicons.font)');
  });

  it('adds distinct home shortcuts for company directory and existing member/activity/service modules', () => {
    const homeSource = readAppFile('index.tsx');

    expect(homeSource).toContain("router.push('/members')");
    expect(homeSource).toContain('商会成员名录');
    expect(homeSource).toContain("router.push('/companies')");
    expect(homeSource).toContain('独立企业名录入口');
    expect(homeSource).toContain("router.push('/activities')");
    expect(homeSource).toContain('商会活动报名');
    expect(homeSource).toContain("router.push('/services')");
    expect(homeSource).toContain('企业服务对接');
  });

  it('keeps dedicated API constants for both member and company directory modules', () => {
    const apiSource = readAppFile('utils/api.ts');

    expect(apiSource).toContain('MEMBERS');
    expect(apiSource).toContain('/api/members');
    expect(apiSource).toContain('COMPANIES');
    expect(apiSource).toContain('/api/companies');
    expect(apiSource.indexOf('MEMBERS')).toBeLessThan(apiSource.indexOf('COMPANIES'));
  });
});
