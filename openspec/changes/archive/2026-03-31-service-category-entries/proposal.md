## Why

当前公共服务页面已存在基础入口展示能力，但与需求草图相比仍存在分类缺失和命名不一致问题。本变更旨在补齐缺失的服务分类入口，并统一分类命名与展示顺序，使公共服务页达到需求定义的最小可用状态。

这是一个低风险、易验收的起步 feature，目标是先把信息架构补齐，而非一次性把公共服务做深。

## What Changes

- 补齐缺失的公共服务分类入口：法律服务、金融服务、财税服务、工商服务、IT 技术、政务服务、HR 服务、产品服务、信息发布
- 统一分类名称与需求口径对齐
- 统一分类展示顺序
- 统一入口卡片/图标/文案风格（在现有页面风格内最小调整）

**不做**：
- 预约/申请/咨询流转
- 后台配置能力
- 分类排序后台化
- 详情页/表单页
- 新增复杂 API
- 新增数据库表或迁移

## Capabilities

### New Capabilities
<!-- 本变更不引入新的能力 spec，仅对现有公共服务页面进行入口补齐 -->

### Modified Capabilities
<!-- 公共服务入口展示逻辑属于既有能力，本次仅补齐分类常量，不改变 spec 级行为 -->

## Impact

- **前端**: 公共服务页面分类常量与展示逻辑
- **后端**: 无新增 API，无 schema 变更
- **依赖**: 沿用现有公共服务页面渲染方式
- **验收**: 以 `docs/qa-baseline.md` 为基线，重点验证页面展示与既有入口行为一致

---

## References

- Background: `docs/feature-service-category-entries.md`
- QA Baseline: `docs/qa-baseline.md`
- Requirement Source: `docs/requirement-gap-analysis.md` (Package F)
