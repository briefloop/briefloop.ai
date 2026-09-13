---
version: alpha
name: BriefLoop product site
description: A calm report-first site using the established BriefLoop brand.
colors:
  primary: '#006838'
  paper: '#faf9f6'
  ink: '#1e2320'
  muted: '#6a706b'
  border: '#dedfd8'
  surface: '#ffffff'
typography:
  body:
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif'
    fontSize: 17px
    lineHeight: 1.75
  display:
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif'
    fontSize: 52px
    fontWeight: 650
    lineHeight: 1.2
  data:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    fontSize: 13px
rounded:
  control: 8px
  panel: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section: 64px
components:
  page:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
  note:
    textColor: '{colors.muted}'
    borderColor: '{colors.border}'
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
    rounded: '{rounded.control}'
    padding: 16px
---

## Overview

面向行业研究、战略与 IR 读者。以一份可读的实际报告解释产品，再进入样例、安装和第一份报告。既有品牌约束来自 AGENTS.md；不改变标志、路由和历史文稿，不添加遥测。多页使用同一个克制商务风格：报告优先的居中首页、清晰双平台下载、可搜索的长文档。

## Colors

沿用纸色 #faf9f6、墨色 #1e2320、品牌绿 #006838。绿色用于主要动作、链接和真实引用。状态以文字说明，不用绿色装饰冒充已核验。规范令牌使用现有十六进制值，优先于技能默认的颜色空间偏好。

## Typography

沿用系统 sans，不加载第三方字体。标题桌面 52px、手机 34px；正文 17px；数据元信息使用等宽字体。中文与英文都限制行宽。长技术标题适当降至 40px。

## Layout

内容最大宽度 1160px，读文宽度 760px。首页居中对称，文档正文左对齐。桌面截图可读展示；手机默认显示报告正文片段与表格，不把全幅桌面截图缩成缩略图。主要下载动作在首屏和页尾，手机优先样例、说明与复制桌面链接。

## Elevation & Depth

细边框与少量浅阴影区分报告页。无大面积投影、炫光、自动轮播、假终端或假在线生成框。

## Shapes

按钮8px，报告和内容面板12px；边框与左右对齐线统一。所有点击区至少44px高。

## Components

顶部导航：产品、示例、使用文档、更新日志；右侧语言切换与下载。窄屏使用原生菜单展开，Esc关闭并恢复焦点。样例回放是静态已保存内容，不接触访客文件、不启动模型。文档搜索在浏览器本地完成；无JS时全部目录和下载链接依然可用。下载卡先显示平台/架构/按钮，再给条件和步骤；哈希与安全说明可折叠。

## Do's and Don'ts

版本由 content/releases.json 在构建时生成。桌面、CLI/PyPI、源码能力分开；不编造新安装包、评分或对照结果。人类例稿、模型稿、人工修改和独立核查有清楚标签。反馈比较与可回退不等于自动收益保证。公开文件只按明确清单进入网站；原始截屏与完整运行记录留在私有验收目录。焦点环即时显示，尊重 reduced-motion，主要信息不依赖图片或JS。
