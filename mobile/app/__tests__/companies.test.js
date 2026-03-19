const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const readAppFile = (fileName) =>
  fs.readFileSync(path.join(repoRoot, fileName), 'utf8');

describe('company directory mobile implementation', () => {
  it('adds a dedicated companies route that fetches the companies API', () => {
    const screenSource = readAppFile('companies.tsx');

    expect(screenSource).toContain('企业名单');
    expect(screenSource).toContain('正在加载企业名单');
    expect(screenSource).toContain('API.COMPANIES');
    expect(screenSource).toContain('联系人：');
    expect(screenSource).not.toContain("router.push('/companies/");
    expect(screenSource).not.toContain('Link');
  });

  it('registers company directory separately from members in tab navigation', () => {
    const layoutSource = readAppFile('_layout.tsx');

    expect(layoutSource).toContain('name="companies"');
    expect(layoutSource).toContain("title: '企业名单'");
    expect(layoutSource).toContain('name="members"');
    expect(layoutSource).toContain('useFonts(Ionicons.font)');
  });

  it('adds a distinct home entry and dedicated API constant for the company directory', () => {
    const homeSource = readAppFile('index.tsx');
    const apiSource = readAppFile('utils/api.ts');

    expect(homeSource).toContain("router.push('/companies')");
    expect(homeSource).toContain('独立企业名录');
    expect(apiSource).toContain('COMPANIES');
    expect(apiSource).toContain('/api/companies');
  });
});
