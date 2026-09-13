# BriefLoop 0.21.0 技术报告：证据索引

文档版本：预发布 v1，2026-09-14。每一项区分实现、执行和可得结论。源码位置按写作时冻结副本定位，不能直接套用变化中的 main 行号。

基线提交：`17c43de3755dabff47895828d4ab331c99e340a0`。基线叠加未提交开发改动；完整文件集合摘要：`6637862988e0e7441b391773032cd00215bb1e5005115b69513171cb255c5e94`。公开安全的所引源码哈希另存 [source-manifest.json](source-manifest.json)。最终发行时应绑定可获取的冻结提交；当前哈希用于文稿取证，不声称发行可重建。

<a id="e01"></a>
## E01 · 任务与企业背景入口

**证据类型：** 本文作者读取冻结源码。

任务约束、冻结内容方法和稿件接纳路径；不据此判断模型实际完成质量。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/store.py` | `def create_run` · 200 |
| `src/briefloop/runtime.py` | `def generate(` · 677 |

<a id="e02"></a>
## E02 · 程序与 Agent 的职责

**证据类型：** 本文作者读取冻结源码。

生成输入与受控操作接纳；宿主原生能力不等于统一受控接口。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/runtime.py` | `def generation_prompt` · 151 |
| `src/briefloop/research_plan.py` | `def admission` · 152 |

<a id="e03"></a>
## E03 · 读者约定和企业内部写作

**证据类型：** 本文作者读取冻结源码。

本轮约定及写作指令；指令存在不等于产物已遵守。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/deliverable_spec.py` | `def resolve` · 55 |
| `src/briefloop/deliverable_spec.py` | `def instructions` · 146 |
| `src/briefloop/workflow_assets/business_report/writing.md` | `先完成` · 1 |

<a id="e04"></a>
## E04 · 内容方法快照

**证据类型：** 本文作者读取冻结源码。

四种方法家族、角色投射与快照哈希；学习 trial 的一致性另见 E16。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/document_workflows.py` | `def resolve_workflow` · 22 |
| `src/briefloop/document_workflows.py` | `def freeze_workflow` · 45 |
| `src/briefloop/document_workflows.py` | `def workflow_context` · 61 |

<a id="e05"></a>
## E05 · DOCX 模板准备与导出

**证据类型：** 本文作者读取冻结源码。

从准备底稿加载、校验原件、按章节和样式渲染。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/templates.py` | `def import_template` · 28 |
| `src/briefloop/templates.py` | `def prepare(` · 249 |
| `src/briefloop/templates.py` | `def export_template` · 333 |

<a id="e06"></a>
## E06 · 研究档位和轮次状态

**证据类型：** 本文作者读取冻结源码。

当前工作树预设、预分配与 rev 比较更新；不得直接移用维护分支并发验收。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/research_plan.py` | `PRESETS =` · 19 |
| `src/briefloop/research_plan.py` | `def freeze(` · 84 |
| `src/briefloop/research_plan.py` | `def _save_plan` · 209 |
| `src/briefloop/research_plan.py` | `def begin_round` · 257 |
| `src/briefloop/progress.py` | `def ` · 13 |

<a id="e07"></a>
## E07 · 共享预算

**证据类型：** 本文作者读取冻结源码。

受控搜索和正文页的预算；不度量整任务模型 Token 或全部原生网络。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/research_budget.py` | `def reserve_search` · 70 |
| `src/briefloop/research_budget.py` | `def reserve_pages` · 109 |

<a id="e08"></a>
## E08 · Scout 结果与轮间摘要

**证据类型：** 本文作者读取冻结源码。

来源归属和字段检查；locator 未被解析，不能称为原文定位已核验。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/scout_tools.py` | `def join_scouts` · 7 |
| `src/briefloop/scout_tools.py` | `def check_handoff` · 67 |
| `src/briefloop/scout_tools.py` | `def read_source` · 107 |
| `src/briefloop/runtime.py` | `def _research_handoff` · 124 |

<a id="e09"></a>
## E09 · 搜索接口与 DDG

**证据类型：** 本文作者读取冻结源码。

冻结提供方、统一记录、失败分类及 HTML 搜索适配。本文没有实时调用提供方。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/websearch.py` | `def provider_for_run` · 74 |
| `src/briefloop/websearch.py` | `def search(` · 90 |
| `src/briefloop/websearch.py` | `def extract(` · 152 |
| `src/briefloop/duckduckgo.py` | `def validate_search` · 91 |
| `src/briefloop/duckduckgo.py` | `def call_search` · 109 |

<a id="e10"></a>
## E10 · MCP 报告授权与来源接纳

**证据类型：** 本文作者读取冻结源码。

资源/工具选择与结果存储；存在接口不代表某供应商已通过真实业务测试。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/connectors/materials.py` | `def freeze(` · 69 |
| `src/briefloop/connectors/materials.py` | `def revoke(` · 113 |
| `src/briefloop/connectors/materials.py` | `def _acquire` · 139 |
| `src/briefloop/connectors/materials.py` | `def _admit` · 171 |

<a id="e11"></a>
## E11 · 写前证据对照

**证据类型：** 本文作者读取冻结源码。

九种关系、examined/unexamined 划分和输入身份；语义关系由 Agent 判断。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/reconciliation.py` | `RELATIONS =` · 16 |
| `src/briefloop/reconciliation.py` | `def candidates` · 45 |
| `src/briefloop/reconciliation.py` | `def save(` · 131 |
| `src/briefloop/reconciliation.py` | `def read(` · 189 |

<a id="e12"></a>
## E12 · 版本化审阅包

**证据类型：** 本文作者读取冻结源码。

snapshot_version=6、对照和来源陈述；不将未到达 Reviewer 记成已执行。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/review.py` | `def _snapshot` · 248 |
| `src/briefloop/review.py` | `def build_packet` · 450 |
| `src/briefloop/review.py` | `def validate_applicable_review` · 206 |
| `src/briefloop/review.py` | `def run_review` · 713 |

<a id="e13"></a>
## E13 · 正式交付规则

**证据类型：** 本文作者读取冻结源码。

blockers/notices、核心主张与数值检查；当前基线未包含维护分支全部修复。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/release.py` | `def decision` · 60 |
| `src/briefloop/deliverable_spec.py` | `def requirement_severity` · 20 |
| `src/briefloop/release.py` | `def eligibility` · 243 |

<a id="e14"></a>
## E14 · 富文档模型

**证据类型：** 本文作者读取冻结源码。

受限 Tiptap JSON 与 Markdown 投影；富文档转换保护按最终集成重新核对。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/document_model.py` | `BLOCKS =` · 9 |
| `src/briefloop/document_model.py` | `def normalize_document` · 60 |
| `src/briefloop/document_model.py` | `def brief_document` · 269 |

<a id="e15"></a>
## E15 · 版本绑定的 Word 作业

**证据类型：** 本文作者读取冻结源码。

输入身份、缓存检查、确定性制作和文件哈希；当前普通入队尚非原子查询加插入。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/export_jobs.py` | `def export_input` · 11 |
| `src/briefloop/export_jobs.py` | `def enqueue_export` · 31 |
| `src/briefloop/export_jobs.py` | `def generate_word` · 60 |

<a id="e16"></a>
## E16 · 学习比较的条件

**证据类型：** 本文作者读取冻结源码。

当前 trial 重新冻结 workflow 的风险；改善方案及 W5 位于另一分支。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/learning.py` | `def _generate_trial` · 109 |
| `src/briefloop/learning.py` | `def _baseline_for_attempt` · 201 |
| `src/briefloop/learning.py` | `def learn(` · 224 |
| `src/briefloop/store.py` | `def create_run` · 200 |

<a id="e17"></a>
## E17 · 外部 Agent 操作

**证据类型：** 本文作者读取冻结源码。

request_id、事务回执、base_version 与工作稿导出；不是远程 MCP 服务端。

| 文件 | 符号／起始行 |
|---|---|
| `src/briefloop/external_requests.py` | `def capabilities` · 47 |
| `src/briefloop/external_requests.py` | `def _operation` · 52 |
| `src/briefloop/external_requests.py` | `def dispatch` · 125 |

<a id="e18"></a>
## E18 · 并行维护分支的集成与验收

**证据类型：** PM 提供、本文作者读取的实际验收记录；本次未亲验。

维护分支记录涉及条款 ID、导出并发接纳、学习比较条件、桌面所属服务、MCP 取消、富文档转换与图文来源等。写作时 PM 先给出 `b27c4ddd` 集成身份，其后记录继续增加。本文固定源码仍是 E01–E17 的 0.21.0 开发副本，不能把维护记录全部算作本副本测试。

原始记录含机器路径、运行身份及图文样例，只在 PM 私有交接包保存；公开正文只描述具体范围。正式发行需生成一个最终提交到实际证据的映射。

<a id="e19"></a>
## E19 · W5 同条件学习单例

**证据类型：** 开发任务已保存的真实模型记录；本文作者核对 verification.json，未重跑模型。

- 原记录源码身份：`b84ef3ad`。
- 模型回执：`deepseek/deepseek-flash`；原生会话数 12。
- 基线正文 SHA256：`0f1d5b43ea126892af5540a03aaf5345e7bbe724bca01957d3c60acd6931c14a`。
- 候选正文 SHA256：`612323165f4c5a6f8995732a82e479800900d1c5280a79a2abfa1d17ebc92941`。
- 比较条件 SHA256：`18fda1cb9a95d77a09a4153cd2f3acd5d26dd0c62230241c5802199fc4ea0263`。
- 内容方法 SHA256：`d7f503e9df1cb48c51edd10f033fb37a755f726e420ae71642b5a534e538fd81`。
- 判定：better，accepted=true；一个合成案例，无统计效果结论。
- OpenCode 自报成本 0.153116226；不是提供方账单，正文不据此推算成本优势。

<a id="e20"></a>
## E20 · J2 历史实验与勘误

**证据类型：** 原运行后的辅助审计及单包 pilot 归档；本次读取，未重跑。

旧四包 A/C 原标题包含实验类别线索，辅助判读者已见条件和预期，不能称盲评。ind-08 初稿有 compatible 对照，自动修订丢失绑定，旧汇总已被新增审计勘误；不覆写原记录。

2026-09-13 CodeBuddy pilot 固定单包材料 SHA256 `bf3e5bd1a2de0aa35fe2c2f800c0dc19b0d2facf614f9d35c4c6ce8bdaeabd7f`，CodeBuddy 2.150.0，deepseek-v4.1-flash，effort 未指定，学习关闭。A=`d7995ebe2526fe405b324e3ce841fbb3e9282423`；B=`93d471dbdd7a949cc7456973d2fbcf53bc49ca23`；C=`b74c2365b48de8765026e2e62fdd86f17427b079`。

A/B 取消且无稿；C 超时失败，但保存草稿及 different_scope 对照。A/B/C 均未进入评价、修订或独立 Reviewer。C 墙钟 1803.23 秒，记录授权等待 1512.20 秒；不是模型速度数据。子任务用量未完整分账，整任务 Token 未知；不把 parent 可见输入量作为完整计费量。无法形成有效净收益结论。

<a id="e21"></a>
## E21 · 本文作者的离线执行

**证据类型：** 本次在冻结源码副本执行，无模型与实时提供方调用。

```sh
PYTHONPATH=src <existing-python> -m pytest \
  tests/test_research_plan.py \
  tests/test_research_handoff.py \
  tests/test_websearch.py -q
```

实际输出：`24 passed in 1.42s`。日志保存为 [offline-tests.txt](offline-tests.txt)。测试包含网络 monkeypatch 与模拟运行时，不能代替真实供应商、浏览器或 Word/WPS 验收。

<a id="e22"></a>
## E22 · 桌面所属服务与停止

**证据类型：** 本文作者读取当前冻结副本；维护分支修复与实测见 E18。

`desktop/electron/service.cjs` 的 `WorkspaceService.start` 启动 Python 服务并校验 PID、launch_id 与回环服务身份；`stop` 请求 `/api/service-stop` 后等待所属子进程退出。当前副本以忽略 stdin 的方式启动服务，没有 owner-pipe。`src/briefloop/server.py` 的停止路径与 `runtime.py::stop_job` 是取消顺序检查入口。本文未在该副本强杀 Electron，也未运行真实 MCP 故障注入。

<a id="e23"></a>
## E23 · 运行时协议与目录

**证据类型：** 本次静态核对。目录项不等于已验证宿主；通用桥的权限能力不能从其他宿主继承。

文件哈希见 [源码清单](source-manifest.json)，均属于本文冻结副本。

| 文件 | 符号／行号 |
|---|---|
| `src/briefloop/harness.py` | class  · 12 |
| `src/briefloop/opencode_harness.py` | class OpencodeHarness · 91 |
| `runtime-bridge/main.ts` | network_control · 63 |
| `runtime-bridge/catalog.json` | "id" · 3 |

<a id="e24"></a>
## E24 · 冲突处理与复核接纳

**证据类型：** 本次静态核对。用户 respond 保存 addressed_pending_review；accept_check 按裁决及预期状态更新，未解决裁决保留 open。

文件哈希见 [源码清单](source-manifest.json)，均属于本文冻结副本。

| 文件 | 符号／行号 |
|---|---|
| `src/briefloop/conflicts.py` | def create · 11；def respond · 44；def accept_check · 67 |
| `src/briefloop/company_context.py` | def  · 6 |
| `src/briefloop/source_updates.py` | def  · 31 |
| `src/briefloop/review.py` | accept_check · 621 |

<a id="e25"></a>
## E25 · OpenCode Reviewer 工具权限

**证据类型：** 本次静态核对。全工具 deny 与逐文件 read allow 由宿主执行；符号链接拒绝。不是 OS 级物理断网证明。

文件哈希见 [源码清单](source-manifest.json)，均属于本文冻结副本。

| 文件 | 符号／行号 |
|---|---|
| `src/briefloop/opencode_harness.py` | def _permission_rules · 50 |

<a id="e26"></a>
## E26 · 审计包投射与离线校验

**证据类型：** 本次静态核对。校验 ZIP 路径、文件集合、哈希与内部关联；结果范围为 structure_and_consistency。不执行包内代码、不判断世界事实，也不提供独立签名真实性证明。

文件哈希见 [源码清单](source-manifest.json)，均属于本文冻结副本。

| 文件 | 符号／行号 |
|---|---|
| `src/briefloop/audit_bundle.py` | def _project_records · 43；def permissions_for · 103；def _scrub · 142；def generate_bundle · 173；def verify_bundle · 354；def _check_relationships · 604 |

<a id="e27"></a>
## E27 · 外部 Word 修订导入

**证据类型：** 本次静态核对。基准版本、原件保存、顺序引用映射、章节对齐及 needs_alignment 分支均有实现。新图登记不等于图中数值已核验；不承诺任意 DOCX 无损回流。

文件哈希见 [源码清单](source-manifest.json)，均属于本文冻结副本。

| 文件 | 符号／行号 |
|---|---|
| `src/briefloop/word_import.py` | def import_revision · 16；def text_nodes · 45；def table · 102；needs_alignment · 147 |

<a id="e28"></a>
## E28 · 人类反馈、机器 pattern 与 scorer trust

**证据类型：** 本次静态核对。人类反馈原文保存；机器 pattern 的来源白名单只验证归属。评分器正常宿主权限执行，指纹覆盖直接文件与工作目录路径，不覆盖全部依赖与目录内容。旧 Changelog 的 human-only guidance 属于 v0.7 历史规则，不能替换当前 WikiSkill 行为。

文件哈希见 [源码清单](source-manifest.json)，均属于本文冻结副本。

| 文件 | 符号／行号 |
|---|---|
| `src/wikiskill/resources/product/entry-skill/SKILL.md` | Human suggestions · 68 |
| `src/wikiskill/product.py` | def learn · 373；def feedback · 411；def record · 327 |
| `src/wikiskill/scorer_trust.py` | def describe · 16；def approve · 56；def require · 73 |
| `src/wikiskill/feedback_loop.py` | def begin · 11；def finish · 33 |
| `CHANGELOG.md` | 0.7.0 · 1679 |

<a id="e29"></a>
## E29 · 明确人类要求的维护分支策略

**证据类型：** 本次读取维护代码，并从 Git 提交 `85bc3e017db7f82b13eff7214d223681eac78526` 固定保存三个文件；未运行新的模型比较。该来源独立于本文 0.21.0 开发副本。

`explicit_human_requirement` 验证人类来源集合、逐对 requirement_checks、fulfilled 与非空证据。接受条件含全部满足、无 worse 和无 regressions；不要求一定 better，tie 可以接受。未通过的有效比较保留 REVISION_REQUIRED 与 requirements_pending，依配置轮次推进；不等于无限重试，格式无效可能直接被拒绝。原开发副本仍为 lightweight_pairwise。

文件哈希单列于 [源码清单](source-manifest.json) 的 maintenance_supplement，不纳入开发副本集合哈希。最终集成前仍需核对策略是否进入发行代码。

| 文件 | 符号／行号 |
|---|---|
| `src/wikiskill/feedback_loop.py` | def begin · 11；def finish · 83 |
| `src/wikiskill/product.py` | explicit_requirement · 135；requirements_pending · 140 |
| `src/briefloop/learning.py` | explicit_requirement · 71；requirements_pending · 77 |

<a id="e30"></a>
## E30 · Windows 环境准备进程归属

**证据类型：** 本次静态核对。Job Object 覆盖 environment.cjs 的受监督环境准备命令；工作区服务启动是独立路径。没有在本次文稿修订中运行 Windows 原生崩溃试验。

文件哈希见 [源码清单](source-manifest.json)，均属于本文冻结副本。

| 文件 | 符号／行号 |
|---|---|
| `desktop/electron/windows-process.cs` | public static class · 11；KILL_ON_JOB_CLOSE · 80；CreateProcess · 34；AssignProcessToJobObject · 29；ResumeThread · 35 |
| `desktop/electron/environment.cjs` | async function runWindowsOwnedProcess · 25；function runOwnedProcess · 99 |
| `desktop/electron/service.cjs` | async start · 51；spawn( · 64 |

<a id="e31"></a>
## E31 · 对照路径的官方资料

**证据类型：** 2026-09-14 读取的官方项目与产品文档；非第三方测评，未运行这些工具的完整比较试验。

- [STORM／Co-STORM 官方 README](https://github.com/stanford-oval/storm)：多视角提问、人机协作知识探索及用户材料检索。不能概括为只拼装一次性长文。
- [GPT‑Researcher 官方 README](https://github.com/assafelovic/gpt-researcher)：本地材料、多个 Agent 的研究路径、PDF／Word／Markdown 导出。不能声称只输出不可编辑 Markdown。
- [OpenAI Deep Research 官方说明](https://help.openai.com/en/articles/10500283-deep-research-faq)：研究计划调整、过程引导、后续迭代及 Word 下载。

本文据此说明功能交集；没有逐项审计上述产品的 blockId、原件哈希、审阅隔离、冲突与交付机制，未核实能力不写作“没有”。第 1.1 节表格是工程职责比较，不是功能缺失矩阵或性能排名。文档会更新，正式发行前可复核本节引用。

## 公开与私有材料

本索引及源码哈希清单不包含本机绝对路径、用户原件、密钥或原始宿主日志。原始取证副本、完整运行记录位置和 PM 交接意见保留在私有目录；发布本站时只选明确列出的报告文件，禁止复制整个取证目录。
