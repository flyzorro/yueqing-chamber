import fs from 'node:fs';
import path from 'node:path';
import { companyFixtureData } from '../data/companyFixture';

describe('Company fixture data', () => {
  it('contains at least 5 companies with the basic list-display fields', () => {
    expect(companyFixtureData.length).toBeGreaterThanOrEqual(5);

    for (const company of companyFixtureData) {
      expect(company.id).toMatch(/^fixture-company-/);
      expect(company.name).toBeTruthy();
      expect(company.industry).toBeTruthy();
      expect(company.contactName).toBeTruthy();
      expect(company.phone).toBeTruthy();
      expect(company.address).toBeTruthy();
      expect(company.logo).toBeTruthy();
      expect(['active', 'inactive']).toContain(company.status);
      expect(company.createdat).toBeInstanceOf(Date);
      expect(company.updatedat).toBeInstanceOf(Date);
    }
  });

  it('uses unique ids and company names', () => {
    const ids = companyFixtureData.map((company) => company.id);
    const names = companyFixtureData.map((company) => company.name);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('Company prisma schema', () => {
  const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  it('defines an independent Company model with the expected fields', () => {
    expect(schema).toContain('model Company {');
    expect(schema).toContain('id          String    @id @default(cuid()) @db.VarChar');
    expect(schema).toContain('name        String    @db.VarChar');
    expect(schema).toContain('industry    String?   @db.VarChar');
    expect(schema).toContain('contactName String?   @db.VarChar');
    expect(schema).toContain('phone       String?   @db.VarChar');
    expect(schema).toContain('address     String?   @db.VarChar');
    expect(schema).toContain('logo        String?   @db.VarChar');
    expect(schema).toContain('status      String?   @default("active") @db.VarChar');
    expect(schema).toContain('createdat   DateTime? @default(now()) @db.Timestamp(6)');
    expect(schema).toContain('updatedat   DateTime? @default(now()) @db.Timestamp(6)');
  });

  it('adds list-oriented indexes without changing existing core models', () => {
    expect(schema).toContain('@@index([status])');
    expect(schema).toContain('@@index([name])');
    expect(schema).toContain('@@index([industry])');
    expect(schema).toContain('model Member {');
    expect(schema).toContain('model Activity {');
    expect(schema).toContain('model Registration {');
  });
});
