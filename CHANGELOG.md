# Changelog

## [1.1.0] - 2026-04-08

### Added
- Activity registration system with member-based signups
- Registration list endpoint for admins (`GET /api/activities/:id/registrations`)
- Mobile screen to view activity registrations (`/registrations`)
- Admin permission middleware based on phone numbers (`ADMIN_PHONES` env var)
- Transactional registration to prevent race conditions

### Changed
- Refactored activity registration to use Prisma transactions for atomic operations
- Updated registration tests to mock new auth middleware patterns

### Security
- Added admin-only access to registration list endpoint
- Phone-based permission checks for activity signups
