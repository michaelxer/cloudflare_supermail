<!-- markdownlint-disable-file MD004 MD024 MD033 MD034 MD036 -->
# CHANGE LOG

<p align="center">
  <a href="CHANGELOG.md">中文</a> |
  <a href="CHANGELOG_EN.md">English</a>
</p>

## v1.0.0 (Initial Release)

### Features

- feat: |Core| 基于 Cloudflare Workers 的完整临时邮件服务
- feat: |Email| 无限临时邮箱地址创建与接收
- feat: |Email| 发送邮件功能（支持回复和新邮件）
- feat: |Email| 邮件附件接收与下载
- feat: |Email| 邮件导出（JSON、CSV、EML 格式）
- feat: |Email| 邮件搜索与过滤（按发件人、主题、日期）
- feat: |Email| 自动刷新收件箱
- feat: |Telegram| Telegram Bot 集成，接收邮件通知
- feat: |Telegram| 全局邮件推送（所有邮件通知）
- feat: |Telegram| 批量绑定地址到 Telegram
- feat: |Admin| 管理员面板
- feat: |Admin| 批量创建账户（带假名生成器）
- feat: |Admin| 批量管理功能
- feat: |Admin| 统计仪表板
- feat: |Frontend| 响应式设计（桌面和移动端）
- feat: |Frontend| 暗色模式支持
- feat: |Frontend| 多语言支持（6 种语言）
- feat: |Security| JWT 认证
- feat: |Security| 管理员密码保护
- feat: |Storage| D1 数据库存储
- feat: |Storage| KV 存储用于配置
- feat: |Storage| 邮件 GZIP 压缩

### Configuration

- config: 支持自定义域名
- config: 支持自定义标题和版权信息
- config: 支持多域名配置
- config: 支持 Telegram Bot Token 配置

---

*This project is inspired by [cloudflare_temp_email](https://github.com/dreamhunter2333/cloudflare_temp_email) and [cloud-mail](https://github.com/maillab/cloud-mail). See [Credits](README.md#-credits) in README.*
