/* ==========================================================================
   BriefLoop Quality Panel — REDESIGN PROTOTYPE (NOT SHIPPED)
   Same payload semantics as product/quality_panel.py; presentation-only
   redesign + v0.2 PRD advisory & feedback zones. All data is synthetic.
   Review fixes applied:
   - dimension summary uses PRD §12.2 vocabulary only; no pass green in AI zone
   - feedback route has no default; human must choose an effect first
   - revise/guidance go through editable draft + confirm (append-only);
     dismiss/defer one-click; changes append supersede records, never delete
   - findings stay inside semantic boundary (no evidence-support verdicts)
   - bilingual data, stable mock receipts, human-confirmed = blue not green
   ========================================================================== */
(function () {
    "use strict";

    /* ---- i18n ---- */
    var MESSAGES = {
        zh: {
            proto_banner: "重设计原型 · 未发布 · 处置与反馈为模拟",
            tab_quality: "质量状态",
            tab_review: "AI 语义复盘",
            tab_feedback: "反馈与改进",
            eyebrow: "审计附件 · AUDIT ATTACHMENT",
            panel_title: "质量面板",
            hero_boundary: "本页「质量状态」区域仅为 quality_panel.json 的确定性只读投影；反馈与处置只在本地 QP Review 接口中生效，静态导出永远只读。",
            meta_run: "运行",
            meta_generated: "生成时间",
            meta_reader: "终稿",
            meta_receipt: "Finalize 收据",
            overall_status: "总体状态",
            m_blockers: "门禁阻断",
            m_warnings: "门禁警告",
            m_incomplete: "缺失/不完整",
            m_materiality: "重要性发现",
            m_template: "模板警告",
            m_wording: "措辞警告",
            m_semantic: "语义支持提案",
            m_actions: "建议动作",
            sec_control: "控制面完整性",
            sec_source: "来源与证据",
            sec_gates: "门禁结果",
            sec_claims: "主张支持与风险",
            sec_reader: "读者清洁与引用卫生",
            sec_closeout: "收口与交付包分离",
            sec_actions: "推荐的下一步动作",
            k_run_integrity: "运行完整性",
            k_ref_eligible: "可被引用资格",
            k_fact_layer: "事实层状态",
            k_runtime_effect: "运行效果",
            k_source_pack: "来源包状态",
            k_durable: "持久来源数",
            k_missing_titles: "缺失标题",
            k_missing_publishers: "缺失发布方",
            k_retrieval_mix: "检索来源构成",
            k_auditor: "Auditor 门禁",
            k_finalize: "Finalize 门禁",
            k_blocking: "阻断发现",
            k_warning: "警告发现",
            k_claim_count: "登记主张数",
            k_matrix: "主张-支持矩阵",
            k_unsupported: "无支持行",
            k_weak: "弱支持原子",
            k_materiality: "重要性选择",
            k_mat_excl: "重要性排除",
            k_template: "读者模板一致性",
            k_wording: "支持措辞",
            k_semantic: "语义支持状态",
            k_reader_clean: "读者清洁状态",
            k_duplicates: "重复引用",
            k_appendix_warn: "来源附录警告",
            k_closeout: "收口状态",
            k_closeout_cmd: "收口命令",
            k_audit_bundle: "审计包",
            k_delivery_bundle: "交付包",
            laj_banner: "实验 · 仅供参考 · 不影响 Gate、交付或事实支持结论",
            laj_title: "AI 语义复盘（实验）",
            laj_sub: "以下为冻结仪器对当前终稿的语义层建议，不构成质量分数或交付裁决。",
            cov_attention: "建议复核",
            cov_clear: "未产生候选问题",
            cov_unable: "无法判断",
            cov_evidence: "需证据层复核",
            cov_note: "「未产生候选问题」仅表示冻结仪器在该评估单元未产生候选 finding，不表示报告正确、完整或高质量。",
            dim_title: "九个维度概览（按评估单元状态，无分数）",
            dim_no_candidate: "未发现候选问题",
            dim_attention: "建议复核",
            dim_partial: "部分评估",
            dim_unable: "无法判断",
            dim_evidence: "需证据层复核",
            f_excerpt: "终稿摘录",
            f_observation: "观察",
            f_rationale: "理由",
            f_basis: "严重度依据",
            f_action: "建议人工动作",
            f_dismiss: "忽略",
            f_defer: "暂缓",
            f_revise: "用于下一版",
            f_guidance: "形成长期指导",
            f_state_dismissed: "已忽略 · 保留处置记录",
            f_state_deferred: "已暂缓 · 下次复核仍可见",
            f_state_revised: "已进入下一版输入候选 · 已确认",
            f_state_guidance: "已进入长期指导 · 已批准",
            fb_title: "反馈与下一轮改进",
            fb_sub: "报告生成后的评价、修订要求或未来写作指导；Agent 只生成草案，你决定它去往哪里。",
            fb_placeholder: "输入你对本报告的评价、修订要求或未来写作指导……",
            fb_radio_record: "仅记录本次",
            fb_radio_record_d: "作为本报告的反馈记录，不影响未来运行",
            fb_radio_revise: "创建下一版报告任务",
            fb_radio_revise_d: "作为同一报告新 revision / 新 run 的输入候选",
            fb_radio_guidance: "用于未来同类报告",
            fb_radio_guidance_d: "形成长期指导草案，二次确认后进入 Improvement Ledger",
            fb_generate: "生成结构化草案",
            fb_confirm: "确认并记录",
            fb_confirm_guidance: "确认用于未来报告",
            dc_kicker: "结构化草案（可编辑 · 尚未生效）",
            dc_intent: "意图类型",
            dc_wording: "指导措辞 / 任务描述",
            dc_scope: "作用范围",
            dc_category: "类别",
            dc_mixed: "这段输入可能混合了多个意图；请检查草案并选择唯一去向，或拆分后分别提交。",
            dc_state_drafted: "guidance_drafted · 仅完成草案时，下一轮看不到这条指导。",
            dc_state_ready: "确认后写入权威记录（原型为模拟）。",
            recorded_title: "已记录的处置与反馈",
            rec_record: "本次反馈记录",
            rec_revision: "下一版输入候选",
            rec_guidance: "长期指导（人工批准）",
            rec_finding: "Finding 处置",
            consumption_note: "下一轮 LLM 不读取本面板、不读取原始 finding、不读取未批准草案；它只读取经人工批准后由确定性程序生成的 improvement_memory_snapshot。",
            footer_boundary: "静态导出边界：导出的 quality_panel.html 永远只读；交互仅存在于本地确定性接口之后。本页全部数据为合成样例。",
            footer_instrument: "仪器：se-profile v0.1 · 9 维度 / 25 评估单元 · assessment SEA-2026-0717-01 · 绑定 reader sha256:9c41f2…"
        },
        en: {
            proto_banner: "Redesign prototype · not shipped · mock dispositions",
            tab_quality: "Quality status",
            tab_review: "AI semantic review",
            tab_feedback: "Feedback & improvement",
            eyebrow: "Audit attachment",
            panel_title: "Quality Panel",
            hero_boundary: "The Quality status area is a deterministic read-only projection of quality_panel.json. Feedback and dispositions take effect only through the local QP Review interface; static exports are always read-only.",
            meta_run: "Run",
            meta_generated: "Generated",
            meta_reader: "Reader",
            meta_receipt: "Finalize receipt",
            overall_status: "Overall status",
            m_blockers: "Gate blockers",
            m_warnings: "Gate warnings",
            m_incomplete: "Missing/incomplete",
            m_materiality: "Materiality findings",
            m_template: "Template warnings",
            m_wording: "Wording warnings",
            m_semantic: "Semantic proposals",
            m_actions: "Recommended actions",
            sec_control: "Control integrity",
            sec_source: "Source & evidence",
            sec_gates: "Gate results",
            sec_claims: "Claim support & risk",
            sec_reader: "Reader-clean & citation hygiene",
            sec_closeout: "Closeout & bundle separation",
            sec_actions: "Recommended next actions",
            k_run_integrity: "Run integrity",
            k_ref_eligible: "Reference eligible",
            k_fact_layer: "Fact layer status",
            k_runtime_effect: "Runtime effect",
            k_source_pack: "Source pack status",
            k_durable: "Durable sources",
            k_missing_titles: "Missing titles",
            k_missing_publishers: "Missing publishers",
            k_retrieval_mix: "Retrieval source mix",
            k_auditor: "Auditor gate",
            k_finalize: "Finalize gate",
            k_blocking: "Blocking findings",
            k_warning: "Warning findings",
            k_claim_count: "Registered claims",
            k_matrix: "Claim-support matrix",
            k_unsupported: "Unsupported rows",
            k_weak: "Weak-support atoms",
            k_materiality: "Materiality selection",
            k_mat_excl: "Materiality exclusions",
            k_template: "Reader template conformance",
            k_wording: "Support wording",
            k_semantic: "Semantic support status",
            k_reader_clean: "Reader-clean status",
            k_duplicates: "Duplicate citations",
            k_appendix_warn: "Source appendix warnings",
            k_closeout: "Closeout status",
            k_closeout_cmd: "Closeout command",
            k_audit_bundle: "Audit bundle",
            k_delivery_bundle: "Delivery bundle",
            laj_banner: "Experimental · advisory only · does not affect Gates, delivery, or factual support",
            laj_title: "AI semantic review (experimental)",
            laj_sub: "Semantic-layer suggestions from the frozen instrument on the current reader. Not a quality score, not a delivery verdict.",
            cov_attention: "attention suggested",
            cov_clear: "no candidate issue",
            cov_unable: "unable to assess",
            cov_evidence: "evidence review needed",
            cov_note: "'No candidate issue' only means the frozen instrument produced no candidate finding in that unit — it does not mean the report is correct, complete, or high quality.",
            dim_title: "Nine dimensions by unit status (no scores)",
            dim_no_candidate: "no candidate issue",
            dim_attention: "attention suggested",
            dim_partial: "partially assessed",
            dim_unable: "unable to assess",
            dim_evidence: "evidence review needed",
            f_excerpt: "Reader excerpt",
            f_observation: "Observation",
            f_rationale: "Rationale",
            f_basis: "Severity basis",
            f_action: "Recommended human action",
            f_dismiss: "Dismiss",
            f_defer: "Defer",
            f_revise: "Use in next revision",
            f_guidance: "Make persistent guidance",
            f_state_dismissed: "Dismissed · disposition recorded",
            f_state_deferred: "Deferred · visible at next review",
            f_state_revised: "Next-revision candidate · confirmed",
            f_state_guidance: "Persistent guidance · approved",
            fb_title: "Feedback & next-run improvement",
            fb_sub: "Post-report evaluation, revision requests, or future writing guidance. The agent drafts; you decide where it goes.",
            fb_placeholder: "Type your evaluation, revision request, or future writing guidance…",
            fb_radio_record: "Record for this report",
            fb_radio_record_d: "Feedback record on this report; no effect on future runs",
            fb_radio_revise: "Create next-revision task",
            fb_radio_revise_d: "Candidate input for a new revision / new run of the same report",
            fb_radio_guidance: "For future reports of this kind",
            fb_radio_guidance_d: "Draft persistent guidance; enters the Improvement Ledger after second confirmation",
            fb_generate: "Generate structured draft",
            fb_confirm: "Confirm & record",
            fb_confirm_guidance: "Confirm for future reports",
            dc_kicker: "Structured draft (editable · not yet effective)",
            dc_intent: "Intent type",
            dc_wording: "Guidance wording / task description",
            dc_scope: "Scope",
            dc_category: "Category",
            dc_mixed: "This input may mix multiple intents; review the draft and pick a single destination, or split and submit separately.",
            dc_state_drafted: "guidance_drafted · a draft alone is invisible to the next run.",
            dc_state_ready: "Confirming writes to the authoritative record (mocked here).",
            recorded_title: "Recorded dispositions & feedback",
            rec_record: "Report feedback record",
            rec_revision: "Next-revision candidate",
            rec_guidance: "Persistent guidance (human-approved)",
            rec_finding: "Finding disposition",
            consumption_note: "The next run does not read this panel, raw findings, or unapproved drafts. It reads only the improvement_memory_snapshot produced deterministically from human-approved entries.",
            footer_boundary: "Static export boundary: an exported quality_panel.html is always read-only; interaction exists only behind a local deterministic interface. All data on this page is synthetic.",
            footer_instrument: "Instrument: se-profile v0.1 · 9 dimensions / 25 units · assessment SEA-2026-0717-01 · bound reader sha256:9c41f2…"
        }
    };

    /* ---- mock deterministic QP payload (mirrors quality_panel.json schema)
       tuple: [kind, a, zh, en] — badge:[badge,level,zh,en] text:[text,zh,en] ---- */
    var QP = {
        overall_status: "warning",
        run_id: "RUN-2026-0717-01",
        generated_at: "2026-07-17 14:20 +08:00",
        reader: "brief.md · revision 3 · sha256:9c41f2…",
        receipt: "TXN-FIN-0088",
        metrics: [
            ["m_blockers", 0, "block"], ["m_warnings", 2, "warning"], ["m_incomplete", 0, "block"],
            ["m_materiality", 1, "warning"], ["m_template", 0, "warning"], ["m_wording", 1, "warning"],
            ["m_semantic", 0, "warning"], ["m_actions", 3, "info"]
        ],
        control: [
            ["k_run_integrity", ["badge", "pass", "通过", "pass"]],
            ["k_ref_eligible", ["badge", "pass", "true", "true"]],
            ["k_fact_layer", ["badge", "pass", "通过", "pass"]],
            ["k_runtime_effect", ["badge", "info", "projection_only", "projection_only"]]
        ],
        source: [
            ["k_source_pack", ["badge", "pass", "通过", "pass"]],
            ["k_durable", ["count", 12]],
            ["k_missing_titles", ["warn_count", 1]],
            ["k_missing_publishers", ["warn_count", 0]],
            ["k_retrieval_mix", ["text", "web 8 · 本地 4", "web 8 · local 4"]]
        ],
        gates: [
            ["k_auditor", ["badge", "pass", "通过", "pass"]],
            ["k_finalize", ["badge", "pass", "通过", "pass"]],
            ["k_blocking", ["count", 0]],
            ["k_warning", ["warn_count", 2]]
        ],
        claims: [
            ["k_claim_count", ["count", 18]],
            ["k_matrix", ["badge", "pass", "通过", "pass"]],
            ["k_unsupported", ["count", 0]],
            ["k_weak", ["warn_count", 2]],
            ["k_materiality", ["badge", "pass", "通过", "pass"]],
            ["k_mat_excl", ["warn_count", 1]],
            ["k_template", ["badge", "pass", "通过", "pass"]],
            ["k_wording", ["badge", "warning", "警告", "warning"]],
            ["k_semantic", ["badge", "missing", "not_available", "not_available"]]
        ],
        reader_clean: [
            ["k_reader_clean", ["badge", "pass", "通过", "pass"]],
            ["k_duplicates", ["count", 0]],
            ["k_appendix_warn", ["count", 0]]
        ],
        closeout: [
            ["k_closeout", ["badge", "pass", "complete", "complete"]],
            ["k_closeout_cmd", ["code", "briefloop quality closeout --workspace ."]],
            ["k_audit_bundle", ["badge", "pass", "已生成", "generated"]],
            ["k_delivery_bundle", ["badge", "info", "待人工批准", "awaiting approval"]]
        ],
        actions: [
            { zh: "2 个弱支持原子需要补充来源或降低表述强度", en: "2 weak-support atoms need added sources or softer wording", name: "repair_weak_support" },
            { zh: "确认 1 项重要性排除是否有意为之", en: "Confirm whether 1 materiality exclusion is intentional", name: "review_materiality_exclusion" },
            { zh: "交付包等待人工批准（AUD-2026-0717-03）", en: "Delivery bundle awaits human approval (AUD-2026-0717-03)", name: "human_delivery_approval" }
        ]
    };

    /* ---- mock LAJ assessment (advisory; synthetic) ---- */
    var LAJ = {
        coverage: [["cov_attention", 3, "attention"], ["cov_clear", 19, "clear"], ["cov_unable", 2, "unable"], ["cov_evidence", 1, "evidence"]],
        dimensions: [
            [{ zh: "跨章节一致性", en: "Cross-section consistency" }, "no_candidate_issue_detected"],
            [{ zh: "范围与定义稳定性", en: "Scope & definition stability" }, "no_candidate_issue_detected"],
            [{ zh: "推理连续性", en: "Reasoning continuity" }, "partially_assessed"],
            [{ zh: "不确定性校准", en: "Uncertainty calibration" }, "attention_suggested"],
            [{ zh: "摘要—正文一致性", en: "Summary-body consistency" }, "attention_suggested"],
            [{ zh: "建议与约束一致性", en: "Recommendation-constraint consistency" }, "no_candidate_issue_detected"],
            [{ zh: "明确 brief 要求覆盖", en: "Explicit brief coverage" }, "partially_assessed"],
            [{ zh: "读者与决策适配", en: "Reader & decision fit" }, "unable_to_assess"],
            [{ zh: "显式范围约束遵循", en: "Explicit scope-rule adherence" }, "no_candidate_issue_detected"]
        ],
        findings: [
            {
                id: "F-001",
                dim: { zh: "不确定性校准 · U-12", en: "Uncertainty calibration · U-12" },
                severity: "attention_suggested",
                scope: { zh: "摘要段", en: "summary" },
                excerpt: { zh: "采购窗口可能出现，但需求侧信号仍不明确。", en: "A procurement window may open, but demand signals remain unclear." },
                observation: { zh: "「采购窗口可能出现」的推断依赖单一价格信号，未标注推断依据。", en: "The inference 'a procurement window may open' rests on a single price signal, with no stated basis." },
                rationale: { zh: "不确定性表达不足时，读者可能把推断当作确定结论引用。", en: "Under-qualified uncertainty lets readers quote an inference as a settled conclusion." },
                basis: { zh: "该句位于摘要，是最高被引用位置；依据 U-12 单元规则触发。", en: "The sentence sits in the summary — the most quoted location. Triggered by unit rule U-12." },
                action: { zh: "补充推断依据（连续三周回落 + 排产预期），或将「可能」改为更明确的条件句。", en: "Add the inference basis (three consecutive weekly declines plus output guidance), or rewrite 'may' as an explicit conditional." },
                meta: "se-profile v0.1 · LAJ layer · 2026-07-17 14:31"
            },
            {
                id: "F-002",
                dim: { zh: "摘要—正文一致性 · U-07", en: "Summary-body consistency · U-07" },
                severity: "attention_suggested",
                scope: { zh: "摘要段 ↔ 第三节", en: "summary ↔ section 3" },
                excerpt: { zh: "（摘要）……但需求侧信号仍不明确。", en: "(summary) …but demand signals remain unclear." },
                observation: { zh: "摘要中的「需求侧信号仍不明确」在正文中没有可定位的对应讨论。", en: "The summary judgment 'demand signals remain unclear' has no locatable corresponding discussion in the body." },
                rationale: { zh: "U-07 要求摘要中的每个判断在正文有可定位的展开或标注；缺位时复核者无法快速定位。", en: "U-07 requires every summary judgment to have a locatable expansion or marker in the body; without it, reviewers cannot navigate to it." },
                basis: { zh: "按 U-07 单元规则触发；仅检查终稿内部结构，不判断证据是否充分。", en: "Triggered by unit rule U-07. This checks internal structure only; it does not judge evidence sufficiency." },
                action: { zh: "在正文补充对应展开、从摘要删除该判断，或交给证据层复核。", en: "Add the corresponding expansion in the body, drop the judgment from the summary, or hand it to evidence-layer review." },
                meta: "se-profile v0.1 · LAJ layer · 2026-07-17 14:31"
            },
            {
                id: "F-003",
                dim: { zh: "建议与约束一致性 · U-19", en: "Recommendation-constraint consistency · U-19" },
                severity: "attention_suggested",
                scope: { zh: "风险观察段", en: "risk watch" },
                excerpt: { zh: "风险观察：若下游电站招标继续推迟，价格回落可能延续。", en: "Watch: if downstream tenders keep slipping, the price decline may continue." },
                observation: { zh: "风险段落指出了风险，但没有给出可跟踪的下一观察点。", en: "The risk paragraph names a risk but offers no next observable to track." },
                rationale: { zh: "周报类报告的读者通常需要「下期看什么」来闭合行动回路。", en: "Weekly-report readers typically need a 'what to watch next' to close the action loop." },
                basis: { zh: "U-19 为建议性单元，不阻断任何结论；仅提示可改进点。", en: "U-19 is advisory-only; it blocks nothing and only flags an improvement point." },
                action: { zh: "补充一个可验证的跟踪指标（如下一期电站招标公告日期）。", en: "Add a verifiable tracking indicator (e.g., the next tender announcement date)." },
                meta: "se-profile v0.1 · LAJ layer · 2026-07-17 14:31"
            }
        ],
        evidence_needed: {
            dim: { zh: "读者与决策适配 · U-22", en: "Reader & decision fit · U-22" },
            text: {
                zh: "该单元需要对照读者画像与决策场景（证据层信息），仪器无法仅凭终稿判断。已 handoff：需要证据层或人工复核。",
                en: "This unit requires the reader profile and decision context (evidence-layer information); the instrument cannot judge from the reader alone. Handed off: needs evidence-layer or human review."
            },
            meta: "O3 handoff · 不显示为报告缺陷，不触发 Gate · not a report defect, does not trigger Gates"
        }
    };

    /* ---- state ---- */
    var LANG = "zh";
    var rcCounter = 1000;
    var STATE = {
        tab: "quality",
        dispositions: {},   // finding id -> dismiss|defer|revise|guidance
        dispHistory: {},    // finding id -> count (supersede chain length)
        fbText: "",
        fbRoute: null,      // no default: human must choose an effect
        draft: null,
        recorded: []        // append-only entries (never deleted)
    };

    function t(key) { return (MESSAGES[LANG] && MESSAGES[LANG][key]) || MESSAGES.zh[key] || key; }
    function L(pair) { return typeof pair === "string" ? pair : (LANG === "en" ? pair.en : pair.zh); }
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    /* ---- header ---- */
    function renderHero(main) {
        var hero = el("header", "panel-hero");
        var left = el("div");
        left.appendChild(el("p", "eyebrow", t("eyebrow")));
        left.appendChild(el("h1", null, t("panel_title")));
        left.appendChild(el("p", "hero-boundary", t("hero_boundary")));
        hero.appendChild(left);
        var pill = el("div", "status-pill level-" + QP.overall_status);
        pill.appendChild(el("span", "sp-k", t("overall_status")));
        pill.appendChild(el("span", "sp-v", QP.overall_status === "warning" ? (LANG === "en" ? "warning" : "警告") : QP.overall_status));
        hero.appendChild(pill);
        var meta = el("div", "hero-meta");
        [["meta_run", QP.run_id], ["meta_generated", QP.generated_at], ["meta_reader", QP.reader], ["meta_receipt", QP.receipt]].forEach(function (kv) {
            var span = el("span");
            span.appendChild(el("span", "k", t(kv[0])));
            span.appendChild(el("span", null, kv[1]));
            meta.appendChild(span);
        });
        hero.appendChild(meta);
        main.appendChild(hero);
    }

    /* ---- metrics ---- */
    function renderMetrics(main) {
        var grid = el("section", "metric-grid");
        QP.metrics.forEach(function (m) {
            var card = el("div", "metric-card");
            card.appendChild(el("span", "mk", t(m[0])));
            var level = m[1] === 0 ? "zero" : (m[2] === "info" ? "info" : m[2]);
            card.appendChild(el("strong", "mv level-" + level, String(m[1])));
            grid.appendChild(card);
        });
        main.appendChild(grid);
    }

    /* ---- kv sections ---- */
    function kvRows(rows) {
        var tb = el("table", "kv-table");
        rows.forEach(function (r) {
            var tr = el("tr");
            tr.appendChild(el("th", null, t(r[0])));
            var td = el("td");
            var v = r[1];
            if (v[0] === "badge") {
                td.appendChild(el("span", "badge badge-" + v[1], LANG === "en" ? v[3] : v[2]));
            } else if (v[0] === "count") {
                td.appendChild(el("span", "count-zero", String(v[1])));
            } else if (v[0] === "warn_count") {
                if (v[1] === 0) td.appendChild(el("span", "count-zero", "0"));
                else td.appendChild(el("span", "badge badge-warning", String(v[1])));
            } else if (v[0] === "code") {
                td.appendChild(el("code", null, v[1]));
            } else {
                td.textContent = LANG === "en" ? v[2] : v[1];
            }
            tr.appendChild(td);
            tb.appendChild(tr);
        });
        return tb;
    }

    function renderSection(main, titleKey, rows) {
        var sec = el("section", "panel-section");
        sec.appendChild(el("h2", null, t(titleKey)));
        sec.appendChild(kvRows(rows));
        main.appendChild(sec);
    }

    function renderActions(main) {
        var sec = el("section", "panel-section");
        sec.appendChild(el("h2", null, t("sec_actions")));
        var ul = el("ul", "actions-list");
        QP.actions.forEach(function (a) {
            var li = el("li");
            li.appendChild(el("strong", null, a.name));
            li.appendChild(el("span", null, LANG === "en" ? a.en : a.zh));
            ul.appendChild(li);
        });
        sec.appendChild(ul);
        main.appendChild(sec);
    }

    /* ---- LAJ advisory zone ---- */
    function renderLaj(main) {
        var zone = el("section", "advisory-zone");
        var banner = el("div", "advisory-banner");
        banner.appendChild(el("span", "ab-tag", "Advisory"));
        banner.appendChild(el("span", null, t("laj_banner")));
        zone.appendChild(banner);
        var body = el("div", "advisory-body");
        body.appendChild(el("h2", null, t("laj_title")));
        body.appendChild(el("p", "advisory-sub", t("laj_sub")));

        var strip = el("div", "coverage-strip");
        LAJ.coverage.forEach(function (c) {
            var chip = el("span", "cov-chip " + c[2]);
            if (LANG === "en") {
                chip.appendChild(el("b", null, String(c[1])));
                chip.appendChild(el("span", null, " " + t(c[0])));
            } else {
                chip.appendChild(el("b", null, String(c[1]) + " 项"));
                chip.appendChild(el("span", null, t(c[0])));
            }
            strip.appendChild(chip);
        });
        body.appendChild(strip);
        body.appendChild(el("p", "cov-note", t("cov_note")));

        body.appendChild(el("h2", null, t("dim_title")));
        var dims = el("div", "dim-strip");
        LAJ.dimensions.forEach(function (d) {
            var chip = el("div", "dim-chip");
            chip.appendChild(el("span", "dim-name", L(d[0])));
            chip.appendChild(el("span", "dim-status " + d[1], t(DIM_STATUS_KEY[d[1]])));
            dims.appendChild(chip);
        });
        body.appendChild(dims);

        LAJ.findings.forEach(function (f) { body.appendChild(findingCard(f)); });

        var ev = el("div", "finding-card");
        ev.style.borderLeftColor = "var(--sem-warn)";
        var eh = el("div", "finding-head");
        eh.appendChild(el("span", "f-dim", L(LAJ.evidence_needed.dim)));
        eh.appendChild(el("span", "badge badge-warning", "evidence_review_needed"));
        ev.appendChild(eh);
        ev.appendChild(el("p", "finding-body", L(LAJ.evidence_needed.text)));
        ev.appendChild(el("div", "finding-meta", LAJ.evidence_needed.meta));
        body.appendChild(ev);

        zone.appendChild(body);
        main.appendChild(zone);
    }

    var DIM_STATUS_KEY = {
        no_candidate_issue_detected: "dim_no_candidate",
        attention_suggested: "dim_attention",
        partially_assessed: "dim_partial",
        unable_to_assess: "dim_unable",
        evidence_review_needed: "dim_evidence"
    };

    function findingCard(f) {
        var card = el("article", "finding-card");
        card.id = "fc-" + f.id;
        var head = el("div", "finding-head");
        head.appendChild(el("span", "f-dim", L(f.dim)));
        head.appendChild(el("span", "badge badge-advisory", f.severity));
        head.appendChild(el("span", "badge badge-info", L(f.scope)));
        head.appendChild(el("span", "badge badge-advisory", "advisory only"));
        card.appendChild(head);

        card.appendChild(el("blockquote", "finding-excerpt", "“" + L(f.excerpt) + "”"));

        var body = el("div", "finding-body");
        [[t("f_observation"), L(f.observation)], [t("f_rationale"), L(f.rationale)], [t("f_basis"), L(f.basis)], [t("f_action"), L(f.action)]].forEach(function (kv) {
            var row = el("div", "fb-row");
            row.appendChild(el("span", "fb-k", kv[0]));
            row.appendChild(el("span", null, kv[1]));
            body.appendChild(row);
        });
        card.appendChild(body);
        card.appendChild(el("div", "finding-meta", f.meta + " · " + f.id));

        var actions = el("div", "finding-actions");
        [["dismiss", "f_dismiss"], ["defer", "f_defer"], ["revise", "f_revise"], ["guidance", "f_guidance"]].forEach(function (a) {
            var btn = el("button", "f-btn", t(a[1]));
            btn.dataset.disp = a[0];
            btn.addEventListener("click", function () { setDisposition(f.id, a[0], card); });
            actions.appendChild(btn);
        });
        card.appendChild(actions);

        var note = el("div", "finding-state-note");
        note.id = "fsn-" + f.id;
        card.appendChild(note);
        paintDisposition(f.id, card);
        return card;
    }

    /* ---- dispositions: dismiss/defer one-click append-only;
       revise/guidance go through editable draft + human confirm ---- */
    function setDisposition(id, disp, card) {
        if (disp === "dismiss" || disp === "defer") {
            appendDisposition(id, disp);
            paintDisposition(id, card);
            updateTabBadges();
            return;
        }
        var f = LAJ.findings.find(function (x) { return x.id === id; });
        STATE.fbRoute = disp === "guidance" ? "guidance" : "revise";
        STATE.draft = {
            intent: disp === "guidance" ? "create_persistent_guidance" : "revise_in_new_run",
            wording: disp === "guidance" ? draftGuidanceFromFinding(f) : draftRevisionFromFinding(f),
            scope: "solar_industry_periodic",
            category: disp === "guidance" ? "audience_preference" : "content_fix",
            mixed: false,
            fromFinding: id
        };
        switchTab("feedback");
    }

    function appendDisposition(id, disp) {
        STATE.dispHistory[id] = (STATE.dispHistory[id] || 0) + 1;
        STATE.dispositions[id] = disp;
        STATE.recorded.unshift({
            type: "rec_finding",
            text: id + " → " + disp + (STATE.dispHistory[id] > 1 ? " · supersedes disposition #" + (STATE.dispHistory[id] - 1) : ""),
            status: disp === "dismiss" ? "dismissed" : "deferred",
            scope: null, category: null, from: id,
            receipt: "RC-" + (++rcCounter)
        });
    }

    function draftGuidanceFromFinding(f) {
        return (LANG === "en" ? "For recurring reports of this kind: " : "面向同类定期报告：") + L(f.action);
    }

    function draftRevisionFromFinding(f) {
        return (LANG === "en" ? "Next-revision task: [" : "下一版修订任务：[") + L(f.dim) + "] " + L(f.action);
    }

    function paintDisposition(id, card) {
        var disp = STATE.dispositions[id];
        card.classList.toggle("dismissed", disp === "dismiss");
        card.classList.toggle("deferred", disp === "defer");
        card.querySelectorAll(".f-btn").forEach(function (b) {
            b.className = "f-btn" + (b.dataset.disp === disp ? " active-" + disp : "");
        });
        var note = card.querySelector("#fsn-" + id);
        var map = { dismiss: ["f_state_dismissed", "missing"], defer: ["f_state_deferred", "warning"], revise: ["f_state_revised", "info"], guidance: ["f_state_guidance", "info"] };
        note.innerHTML = "";
        if (disp) {
            note.appendChild(el("span", "badge badge-" + map[disp][1], id));
            note.appendChild(el("span", null, t(map[disp][0])));
        }
    }

    /* ---- feedback zone ---- */
    var fbZone = null;

    function renderFeedbackZone() {
        if (!fbZone) {
            fbZone = el("section", "feedback-zone");
            document.getElementById("qp-main").appendChild(fbZone);
        }
        fbZone.innerHTML = "";
        fbZone.appendChild(el("h2", null, t("fb_title")));
        fbZone.appendChild(el("p", "feedback-sub", t("fb_sub")));

        var ta = el("textarea", "fb-textarea");
        ta.placeholder = t("fb_placeholder");
        ta.value = STATE.fbText;
        fbZone.appendChild(ta);

        var radios = el("div", "fb-radios");
        [["record", "fb_radio_record", "fb_radio_record_d"], ["revise", "fb_radio_revise", "fb_radio_revise_d"], ["guidance", "fb_radio_guidance", "fb_radio_guidance_d"]].forEach(function (r) {
            var lab = el("label", "fb-radio" + (STATE.fbRoute === r[0] ? " selected" : ""));
            var input = el("input");
            input.type = "radio";
            input.name = "fb-route";
            input.checked = STATE.fbRoute === r[0];
            input.addEventListener("change", function () { STATE.fbRoute = r[0]; renderFeedbackZone(); });
            lab.appendChild(input);
            var txt = el("div");
            txt.appendChild(el("div", "fr-title", t(r[1])));
            txt.appendChild(el("div", "fr-desc", t(r[2])));
            lab.appendChild(txt);
            radios.appendChild(lab);
        });
        fbZone.appendChild(radios);

        var btns = el("div", "fb-buttons");
        var gen = el("button", "btn-ghost", t("fb_generate"));
        gen.id = "fb-generate";
        gen.disabled = !STATE.fbText.trim() || !STATE.fbRoute;
        gen.addEventListener("click", generateDraft);
        btns.appendChild(gen);
        fbZone.appendChild(btns);

        ta.addEventListener("input", function () {
            STATE.fbText = ta.value;
            var g = document.getElementById("fb-generate");
            if (g) g.disabled = !STATE.fbText.trim() || !STATE.fbRoute;
        });

        if (STATE.draft) fbZone.appendChild(draftCard());
        renderRecorded(fbZone);
        fbZone.appendChild(consumptionNote());
    }

    function generateDraft() {
        var text = STATE.fbText.trim();
        if (!text || !STATE.fbRoute) return;
        var route = STATE.fbRoute;
        var intent = route === "record" ? "record_for_this_report" : route === "revise" ? "revise_in_new_run" : "create_persistent_guidance";
        var mixed = /修改|修正|数字|错/.test(text) && /以后|未来|下次|今后/.test(text);
        var wording = text;
        if (route === "guidance" && text) {
            wording = (LANG === "en" ? "For recurring reports of this kind: " : "面向同类定期报告：") + text;
        }
        STATE.draft = {
            intent: intent,
            wording: wording,
            scope: "solar_industry_periodic",
            category: route === "guidance" ? "audience_preference" : route === "revise" ? "content_fix" : "general_feedback",
            mixed: mixed,
            fromFinding: null
        };
        renderFeedbackZone();
    }

    function draftCard() {
        var d = STATE.draft;
        var card = el("div", "draft-card");
        card.appendChild(el("div", "dc-kicker", t("dc_kicker")));

        var intentRow = el("div", "draft-row");
        intentRow.appendChild(el("span", "dr-k", t("dc_intent")));
        intentRow.appendChild(el("span", "badge badge-info", d.intent));
        if (d.fromFinding) intentRow.appendChild(el("span", "badge badge-advisory", "from " + d.fromFinding));
        card.appendChild(intentRow);

        var wRow = el("div", "draft-row");
        wRow.appendChild(el("span", "dr-k", t("dc_wording")));
        var wta = el("textarea");
        wta.value = d.wording;
        wta.addEventListener("input", function () { d.wording = wta.value; });
        wRow.appendChild(wta);
        card.appendChild(wRow);

        var grid = el("div", "draft-grid");
        var sRow = el("div", "draft-row");
        sRow.appendChild(el("span", "dr-k", t("dc_scope")));
        var scope = el("select");
        ["solar_industry_periodic", "all_reports", "this_report_only"].forEach(function (o) {
            var opt = el("option", null, o); opt.value = o;
            if (d.scope === o) opt.selected = true;
            scope.appendChild(opt);
        });
        scope.addEventListener("change", function () { d.scope = scope.value; });
        sRow.appendChild(scope);
        grid.appendChild(sRow);

        var cRow = el("div", "draft-row");
        cRow.appendChild(el("span", "dr-k", t("dc_category")));
        var cat = el("select");
        ["audience_preference", "structure", "source_discipline", "tone", "content_fix", "general_feedback"].forEach(function (o) {
            var opt = el("option", null, o); opt.value = o;
            if (d.category === o) opt.selected = true;
            cat.appendChild(opt);
        });
        cat.addEventListener("change", function () { d.category = cat.value; });
        cRow.appendChild(cat);
        grid.appendChild(cRow);
        card.appendChild(grid);

        if (d.mixed) card.appendChild(el("div", "draft-mixed", t("dc_mixed")));

        var actions = el("div", "draft-actions");
        var isGuidance = d.intent === "create_persistent_guidance";
        var confirm = el("button", "btn-primary", isGuidance ? t("fb_confirm_guidance") : t("fb_confirm"));
        confirm.addEventListener("click", function () { confirmDraft(); });
        actions.appendChild(confirm);
        var cancel = el("button", "btn-ghost", LANG === "en" ? "Discard draft" : "放弃草案");
        cancel.addEventListener("click", function () { STATE.draft = null; renderFeedbackZone(); });
        actions.appendChild(cancel);
        actions.appendChild(el("span", "draft-state", isGuidance ? t("dc_state_drafted") : t("dc_state_ready")));
        card.appendChild(actions);
        return card;
    }

    function confirmDraft() {
        var d = STATE.draft;
        if (!d) return;
        var type = d.intent === "record_for_this_report" ? "rec_record" : d.intent === "revise_in_new_run" ? "rec_revision" : "rec_guidance";
        var status = d.intent === "create_persistent_guidance" ? "guidance_approved" : d.intent === "revise_in_new_run" ? "revision_requested" : "recorded_for_report";
        STATE.recorded.unshift({
            type: type,
            text: d.wording,
            scope: d.scope,
            category: d.category,
            from: d.fromFinding,
            status: status,
            receipt: "RC-" + (++rcCounter)
        });
        if (d.fromFinding) {
            STATE.dispHistory[d.fromFinding] = (STATE.dispHistory[d.fromFinding] || 0) + 1;
            STATE.dispositions[d.fromFinding] = d.intent === "create_persistent_guidance" ? "guidance" : "revise";
        }
        STATE.draft = null;
        STATE.fbText = "";
        STATE.fbRoute = null; // back to explicit-choice state
        renderFeedbackZone();
        updateTabBadges();
    }

    function renderRecorded(host) {
        if (!STATE.recorded.length) return;
        var wrap = el("div", "recorded-list");
        wrap.appendChild(el("h3", null, t("recorded_title")));
        STATE.recorded.forEach(function (r) {
            var entry = el("div", "rec-entry");
            var head = el("div", "re-head");
            var typeBadge = r.type === "rec_guidance" ? "info" : r.type === "rec_revision" ? "info" : "missing";
            head.appendChild(el("span", "badge badge-" + typeBadge, t(r.type)));
            var statusBadge = r.status === "guidance_approved" ? "info" : "missing";
            head.appendChild(el("span", "badge badge-" + statusBadge, r.status));
            if (r.from) head.appendChild(el("span", "badge badge-advisory", "from " + r.from));
            entry.appendChild(head);
            entry.appendChild(el("div", "re-text", r.text));
            var meta = "append-only · mock receipt " + r.receipt;
            if (r.scope) meta = "scope: " + r.scope + " · category: " + r.category + " · " + meta;
            entry.appendChild(el("div", "re-meta", meta));
            wrap.appendChild(entry);
        });
        host.appendChild(wrap);
    }

    function consumptionNote() {
        var n = el("p", "consumption-note");
        n.appendChild(el("strong", null, "next-run consumption · "));
        n.appendChild(el("span", null, t("consumption_note")));
        return n;
    }

    function renderFooter(main) {
        var f = el("footer", "qp-footer");
        f.appendChild(el("p", null, t("footer_boundary")));
        var p = el("p");
        p.textContent = t("footer_instrument") + " · ";
        p.appendChild(el("code", null, "quality_panel.json · projection_only"));
        f.appendChild(p);
        main.appendChild(f);
    }

    /* ---- tabs ---- */
    var TABS = [["quality", "tab_quality"], ["review", "tab_review"], ["feedback", "tab_feedback"]];

    function renderTabBar(main) {
        var bar = el("nav", "qp-tabs");
        bar.setAttribute("aria-label", "Quality Panel sections");
        TABS.forEach(function (tb) {
            var btn = el("button", "qp-tab" + (STATE.tab === tb[0] ? " active" : ""), t(tb[1]));
            btn.type = "button";
            btn.dataset.tab = tb[0];
            btn.setAttribute("aria-selected", STATE.tab === tb[0] ? "true" : "false");
            if (tb[0] === "review") {
                var n = LAJ.coverage[0][1];
                if (n > 0) btn.appendChild(el("span", "tab-badge advisory", String(n)));
            }
            if (tb[0] === "feedback") {
                var b = el("span", "tab-badge info", "0");
                b.id = "fb-tab-badge";
                btn.appendChild(b);
            }
            btn.addEventListener("click", function () { switchTab(tb[0]); });
            bar.appendChild(btn);
        });
        main.appendChild(bar);
    }

    function updateTabBadges() {
        var badge = document.getElementById("fb-tab-badge");
        if (!badge) return;
        // 待处理：还没有任何处置的 attention findings
        var pending = LAJ.findings.filter(function (f) { return !STATE.dispositions[f.id]; }).length;
        badge.textContent = String(pending);
        badge.style.display = pending > 0 ? "" : "none";
    }

    function switchTab(id) {
        if (TABS.every(function (tb) { return tb[0] !== id; })) return;
        STATE.tab = id;
        try { location.hash = id; } catch (e) { /* file:// quirks */ }
        renderAll();
        window.scrollTo(0, 0);
    }

    function renderIdentityCompact(main) {
        var strip = el("div", "identity-strip");
        strip.appendChild(el("span", "status-pill-mini level-" + QP.overall_status, LANG === "en" ? QP.overall_status : "警告"));
        var meta = el("span", "identity-meta");
        meta.textContent = QP.run_id + " · " + QP.generated_at + " · " + QP.reader + " · " + QP.receipt;
        strip.appendChild(meta);
        main.appendChild(strip);
    }

    /* ---- render all ---- */
    function renderAll() {
        var main = document.getElementById("qp-main");
        main.innerHTML = "";
        fbZone = null;
        renderTabBar(main);
        if (STATE.tab === "quality") {
            renderHero(main);
            renderMetrics(main);
            renderSection(main, "sec_control", QP.control);
            renderSection(main, "sec_source", QP.source);
            renderSection(main, "sec_gates", QP.gates);
            renderSection(main, "sec_claims", QP.claims);
            renderSection(main, "sec_reader", QP.reader_clean);
            renderSection(main, "sec_closeout", QP.closeout);
            renderActions(main);
        } else {
            renderIdentityCompact(main);
            if (STATE.tab === "review") {
                renderLaj(main);
            } else {
                renderFeedbackZone();
            }
        }
        renderFooter(main);
        updateTabBadges();
    }

    /* ---- language ---- */
    var langBtn = document.getElementById("btn-lang-toggle");
    var langMenu = document.getElementById("lang-menu");
    langBtn.addEventListener("click", function () {
        var open = !langMenu.hidden;
        langMenu.hidden = open;
        langBtn.setAttribute("aria-expanded", open ? "false" : "true");
    });
    langMenu.querySelectorAll("li").forEach(function (li) {
        li.addEventListener("click", function () {
            LANG = li.dataset.lang;
            document.getElementById("lang-current").textContent = li.textContent;
            document.documentElement.lang = LANG === "en" ? "en" : "zh-CN";
            langMenu.querySelectorAll("li").forEach(function (x) {
                x.setAttribute("aria-selected", x === li ? "true" : "false");
            });
            langMenu.hidden = true;
            langBtn.setAttribute("aria-expanded", "false");
            document.querySelectorAll("[data-i18n]").forEach(function (node) { node.textContent = t(node.dataset.i18n); });
            renderAll();
        });
    });

    /* ---- boot ---- */
    var initialHash = "";
    try { initialHash = location.hash.replace("#", ""); } catch (e) { /* ignore */ }
    if (TABS.some(function (tb) { return tb[0] === initialHash; })) STATE.tab = initialHash;
    window.addEventListener("hashchange", function () {
        var h = "";
        try { h = location.hash.replace("#", ""); } catch (e) { /* ignore */ }
        if (TABS.some(function (tb) { return tb[0] === h; }) && h !== STATE.tab) {
            STATE.tab = h;
            renderAll();
        }
    });
    renderAll();
})();
