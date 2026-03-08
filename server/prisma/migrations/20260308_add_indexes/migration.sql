-- 性能优化索引
CREATE INDEX IF NOT EXISTS "Member_company_idx" ON "Member"("company");
CREATE INDEX IF NOT EXISTS "Member_industry_idx" ON "Member"("industry");
CREATE INDEX IF NOT EXISTS "Activity_date_idx" ON "Activity"("date");
CREATE INDEX IF NOT EXISTS "Activity_location_idx" ON "Activity"("location");
CREATE INDEX IF NOT EXISTS "User_phone_idx" ON "User"("phone");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
