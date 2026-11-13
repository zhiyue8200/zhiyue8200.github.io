---
title: claudecode国产大模型配置及切换操作指南
date: 2026-02-03 22:07:44
tags: 大模型
categories: '大模型'
---
claudecode作为风头最劲的AI产品之一，其展现出的能力，让我感到通用Agent已经基本成型了。

但是作为一款国外的产品，在国内使用还是很困难，Anthropic 公司封号严重，在这种状况下，国内厂商开始发力，将国产大模型接入claudecode，让用户在国内也能用上这个非常好用的工具，目前我用过的有

[Claude Code - 智谱AI开放文档](https://docs.bigmodel.cn/cn/coding-plan/tool/claude)

[大模型服务平台百炼控制台](https://bailian.console.aliyun.com/cn-beijing/?spm=a2c4g.11186623.0.0.684a6889OIeOvJ&tab=doc#/doc/?type=model&url=3005961)

分别来自于智谱和阿里，智谱的GLM4.7推出coding plan跨年优惠后，一时之间洛阳纸贵，一票难求，智谱的codingplan可以按月度、季度、年度进行订阅，这一点比较好，优惠力度也大，这也是我第一个尝试使用的原因之一，其他厂商则仅提供了月度和年度套餐，包括阿里、火山、minimax等厂商，首月优惠后在10元以内，火山除了自己的豆包大模型也接入了其他的大模型，但是好像评价不佳，阿里的qwen一直以来都是霸榜的存在，因此选择了阿里。

智谱在安装时，提供了一个安装小助手，其他家的则基本都是通过编辑或新增 `settings.json` 文件， MacOS & Linux 为 `~/.claude/settings.json`， Windows 为`用户目录/.claude/settings.json`实现配置方式

智谱的小助手应该也是生成这样一个文件，然后实现一些配置

```powershell
# 编辑或新增 `settings.json` 文件
# MacOS & Linux 为 `~/.claude/settings.json`
# Windows 为`用户目录/.claude/settings.json`
# 新增或修改里面的 env 字段
# 注意替换里面的 `your_zhipu_api_key` 为您上一步获取到的 API Key
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_zhipu_api_key",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  }
}
# 再编辑或新增 `.claude.json` 文件
# MacOS & Linux 为 `~/.claude.json`
# Windows 为`用户目录/.claude.json`
# 新增 `hasCompletedOnboarding` 参数
{
  "hasCompletedOnboarding": true
}
```

体验完事之后，感觉智谱的GLM4.7比较厉害一些，虽然最后也没达到我的目标，但是整个使用过程中展现的能力感觉比阿里的要强，也可能阿里的目前体验还不够多