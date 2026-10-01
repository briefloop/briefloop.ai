---
version: '3.1'
name: BriefLoop product site
description: A restrained, report-first site aligned with the BriefLoop v3.1 product design.
---

# BriefLoop 官网设计系统 · v3.1

官网与产品使用同一套黛蓝、冷灰、系统字体和紧凑圆角。产品来源与 SHA-256 记录在 `content/design-source.json`；`design-tokens.css` 为产品 `src/briefloop/static/tokens.css` 的逐字节副本。组件只引用语义令牌。`site-tokens.css` 仅保留网站阅读尺度和旧组件别名，不维护第二套品牌色。

## 品牌与配色

- 黛蓝 `--color-primary` 用于主要动作、链接、选中态与焦点。不得铺满大块背景；页尾 CTA 使用白卡片
- 页面为冷灰 `--color-bg`，卡片为 `--color-surface`，正文、辅助文字及边界使用相应语义令牌
- 鎏金 `--color-accent` 只用于实际正式交付或认证的信誉标记，不能表示「真实截图」或用作按钮颜色
- 状态色、金融涨跌色与分类色独立于品牌；不能把品牌蓝当作已通过核验的状态
- 装饰边界用 `--color-border`；输入框与需要靠轮廓识别的控件用 `--color-border-strong`
- `assets/briefloop-mark.svg` 和 favicon 保留用户提供的新标志的原始字节与内容来源信息
- 历史技术报告、已保存报告原稿和旧截图保留原件与原 URL；网站外壳可同步品牌，但不得重写历史材料

## 排版与形态

系统 sans 与等宽数据字体直接来自产品令牌，不加载第三方字体。网站保留阅读场景的 17px 正文、桌面 52px / 手机 34px 展示标题；不是将桌面应用的 14px 基准直接缩放到长文网站。中文不得低于 12px。标题采用 600 字重。

按钮 6px、卡片 8px 圆角，来自 `--radius` / `--radius-lg`。点击区保持至少 44px，以便触屏使用。收紧装饰性胶囊、大圆角和浮动按钮动效，保留清楚的 hover / active / focus 状态与 reduced-motion。

## 布局与组件

内容最大宽度 1160px，正文阅读宽度 760px。首页居中，长文左对齐。蓝色仅作小面积强调；白卡、细边框、克制阴影区分层次。不开自动轮播，不制作假终端或假在线生成框。

共享页头在 `site-header.css` / `site-header.js`；构建页头在 `scripts/site_header.py`，首页模板保留对应结构。英文和中文导航同时维护；窄屏菜单可展开、Esc 关闭并恢复焦点。

手机显示已保存报告的正文片段与表格，不缩小全幅桌面截图冒充可读内容。下载页先说明平台和条件，再提供安装包；哈希与安全说明可折叠。无 JS 时下载和正文仍可用。文档搜索只在本地浏览器运行。

## 截图与发布边界

新增产品截图必须从对应冻结提交的实际应用捕获，仅使用合成或允许公开的资料。记录提交、画面内容、生成时间及文件哈希；不得绘制 UI 图冒充真实截图。预发行界面应明确标注预览，不能暗示现有稳定安装包已包含该界面。

版本与下载链接仍由 `content/releases.json` 生成，不能因视觉升级而改写发行信息。原始报告、评分和审阅边界保持不变。所有外发文件按明确清单筛选，不发布工作区、凭据、原始模型记录或私有路径。

## 验证与部署

运行 `python3 scripts/build-site.py`、`python3 scripts/check-site.py`、`python3 scripts/check-design.py` 与 `node --test tests/downloads.test.cjs`。生成结果与模板同时提交。

网站继续使用现有 GitHub Pages 和 `CNAME` 的 briefloop.ai，不新增平台或修改域名。分支、构建通过或预览都不等于生产发布。发布前使用允许的浏览器检查中英文桌面/窄屏页面、下载导航、文档搜索、菜单、键盘焦点及截图可读性。
