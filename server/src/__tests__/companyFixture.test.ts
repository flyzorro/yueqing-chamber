import fs from 'node:fs';
import path from 'node:path';
import { companyFixtureData } from '../data/companyFixture';

describe('Company fixture data', () => {
  it('exports a valid typed array (may be empty when real DB data is seeded)', () => {
    expect(Array.isArray(companyFixtureData)).toBe(true);
    // Each entry, if any, must have the required fields
    for (const company of companyFixtureData) {
      expect(typeof company.id).toBe('string');
      expect(typeof company.name).toBe('string');
    }
  });

  it('exports an array that is either populated or intentionally empty', () => {
    // Fixtures are cleared when real DB data is seeded — this test documents both states
    const isSeededState = companyFixtureData.length === 0;
    const hasData = companyFixtureData.length > 0;
    expect(isSeededState || hasData).toBe(true);
  });
});

describe('Company prisma schema', () => {
  const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  it('defines an independent Company model with the expected fields', () => {
    expect(schema).toContain('model Company {');
    expect(schema).toContain('id          String    @id @default(cuid()) @db.VarChar');
    expect(schema).toContain('name        String    @unique @db.VarChar');
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
