# service-category-display Specification

## Purpose
TBD - created by archiving change service-category-entries. Update Purpose after archive.
## Requirements
### Requirement: 公共服务页面应补齐缺失分类入口
系统 MUST 在公共服务页面补齐缺失的服务分类入口，并统一分类命名与展示顺序。

#### Scenario: 页面加载后展示全部要求分类入口
- **WHEN** 用户访问公共服务页面
- **THEN** 页面展示以下分类入口：法律服务、金融服务、财税服务、工商服务、IT 技术、政务服务、HR 服务、产品服务、信息发布，以及已有分类

#### Scenario: 分类名称与需求口径一致
- **WHEN** 用户查看分类入口名称
- **THEN** 分类名称与 `docs/feature-service-category-entries.md` 中定义的名称一致

#### Scenario: 分类展示顺序固定
- **WHEN** 用户查看公共服务页面
- **THEN** 分类按约定顺序展示，不依赖后端配置或用户偏好

#### Scenario: 新分类入口行为与既有入口一致
- **WHEN** 用户点击新补齐的分类入口
- **THEN** 跳转或占位行为与现有公共服务入口保持一致

#### Scenario: 既有入口不受影响
- **WHEN** 用户点击既有公共服务入口
- **THEN** 行为与变更前一致，无回归

#### Scenario: 新增分类入口与现有页面样式保持一致
- **WHEN** 用户查看新增分类入口
- **THEN** 新增入口在卡片样式、图标呈现和文案展示上与现有同类入口保持一致

#### Scenario: typecheck 通过
- **WHEN** 执行 `npm run typecheck`
- **THEN** 无新增类型错误

