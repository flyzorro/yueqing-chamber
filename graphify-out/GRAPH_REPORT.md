# Graph Report - .  (2026-04-08)

## Corpus Check
- 85 files · ~389,027 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 180 nodes · 202 edges · 42 communities detected
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `MemberStore` - 13 edges
2. `CompanyStore` - 9 edges
3. `ActivityStore` - 8 edges
4. `UserStore` - 7 edges
5. `ActivityPhotoStore` - 6 edges
6. `CivilServantStore` - 5 edges
7. `main()` - 4 edges
8. `fetchRailway()` - 3 edges
9. `generateDescription()` - 3 edges
10. `writeSummary()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Cluster 0"
Cohesion: 0.21
Nodes (1): MemberStore

### Community 1 - "Authentication"
Cohesion: 0.17
Nodes (0): 

### Community 2 - "Cluster 2"
Cohesion: 0.18
Nodes (3): mapCompanyFields(), parseSummary(), CompanyProductStore

### Community 3 - "Test Fixtures"
Cohesion: 0.24
Nodes (5): fetchNgrok(), migrateCompanies(), migrateMembers(), syncCompanySchema(), syncMemberSchema()

### Community 4 - "Cluster 4"
Cohesion: 0.24
Nodes (0): 

### Community 5 - "Authentication"
Cohesion: 0.24
Nodes (3): getAuthHeaders(), getToken(), isLoggedIn()

### Community 6 - "API Routes"
Cohesion: 0.18
Nodes (0): 

### Community 7 - "Cluster 7"
Cohesion: 0.28
Nodes (1): CivilServantStore

### Community 8 - "Cluster 8"
Cohesion: 0.33
Nodes (1): CompanyStore

### Community 9 - "Cluster 9"
Cohesion: 0.29
Nodes (1): ActivityStore

### Community 10 - "Test Fixtures"
Cohesion: 0.39
Nodes (4): validateEmail(), validateMemberCreate(), validateMemberUpdate(), validatePhone()

### Community 11 - "Cluster 11"
Cohesion: 0.33
Nodes (1): UserStore

### Community 12 - "Cluster 12"
Cohesion: 0.67
Nodes (5): fetchBocha(), fetchRailway(), generateDescription(), main(), writeSummary()

### Community 13 - "Cluster 13"
Cohesion: 0.4
Nodes (1): ActivityPhotoStore

### Community 14 - "Deployment"
Cohesion: 1.0
Nodes (2): fetchNgrok(), main()

### Community 15 - "Cluster 15"
Cohesion: 1.0
Nodes (2): fetchNgrok(), main()

### Community 16 - "Cluster 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Cluster 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Cluster 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Cluster 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Member Management"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Cluster 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Database Layer"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Cluster 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Member Management"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Cluster 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Cluster 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "API Routes"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Cluster 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Cluster 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Cluster 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Cluster 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Cluster 32"
Cohesion: 1.0
Nodes (1): Project Summary

### Community 33 - "Cluster 33"
Cohesion: 1.0
Nodes (1): API Testing

### Community 34 - "Cluster 34"
Cohesion: 1.0
Nodes (1): Bilibili Transcript

### Community 35 - "Cluster 35"
Cohesion: 1.0
Nodes (1): Yueqing Chamber App

### Community 36 - "Cluster 36"
Cohesion: 1.0
Nodes (1): Deployment Guide

### Community 37 - "Cluster 37"
Cohesion: 1.0
Nodes (1): AI Team Config

### Community 38 - "Cluster 38"
Cohesion: 1.0
Nodes (1): Gstack Config

### Community 39 - "Cluster 39"
Cohesion: 1.0
Nodes (1): Deploy Checklist

### Community 40 - "Cluster 40"
Cohesion: 1.0
Nodes (1): QA Agent - Jack Yong

### Community 41 - "Cluster 41"
Cohesion: 1.0
Nodes (1): Deploy Agent - Grace Yan

## Knowledge Gaps
- **10 isolated node(s):** `Project Summary`, `API Testing`, `Bilibili Transcript`, `Yueqing Chamber App`, `Deployment Guide` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Cluster 16`** (2 nodes): `generate_png.js`, `createPlaceholderPNG()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 17`** (2 nodes): `generate_placeholders.js`, `createPlaceholderSVG()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 18`** (2 nodes): `generate_seed.js`, `getImageUrl()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 19`** (2 nodes): `seed_companies.ts`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Member Management`** (2 nodes): `seed_members.ts`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 21`** (2 nodes): `add-columns.js`, `addMissingColumns()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Database Layer`** (2 nodes): `migrate-db.js`, `migrateDb()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 23`** (2 nodes): `check-schema.js`, `checkSchema()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Member Management`** (2 nodes): `member-detail.tsx`, `MemberDetailScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 25`** (2 nodes): `_layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 26`** (2 nodes): `services.tsx`, `ServicesScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `API Routes`** (2 nodes): `api.spec.ts`, `playwright.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 28`** (1 nodes): `export_products.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 29`** (1 nodes): `jest.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 30`** (1 nodes): `generate_seed_local.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 31`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 32`** (1 nodes): `Project Summary`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 33`** (1 nodes): `API Testing`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 34`** (1 nodes): `Bilibili Transcript`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 35`** (1 nodes): `Yueqing Chamber App`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 36`** (1 nodes): `Deployment Guide`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 37`** (1 nodes): `AI Team Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 38`** (1 nodes): `Gstack Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 39`** (1 nodes): `Deploy Checklist`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 40`** (1 nodes): `QA Agent - Jack Yong`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cluster 41`** (1 nodes): `Deploy Agent - Grace Yan`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MemberStore` connect `Cluster 0` to `Authentication`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `CompanyStore` connect `Cluster 8` to `Cluster 2`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `ActivityStore` connect `Cluster 9` to `Cluster 4`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `Project Summary`, `API Testing`, `Bilibili Transcript` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._