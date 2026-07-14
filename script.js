/* ==========================================================================
   briefloop.ai — Interaction & Motion (language aware)
   Motion inventory:
   1. Hero chain-of-custody auto trace (staged, replayable, hover-safe)
   2. Scroll reveals (IntersectionObserver)
   3. Terminal typewriter on first view
   4. Sandbox gate micro-motion (shake on block, flash on rebuild)
   5. In-place card disclosures for artifacts, responsibilities, and report packs
   All motion respects prefers-reduced-motion.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const isEn = document.documentElement.lang === "en";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* --- 1. Chain-of-custody connector geometry --- */
    const svg = document.querySelector(".glow-lines");
    const claimNode = document.getElementById("node-claim");
    const ledgerCard = document.getElementById("ledger-item");
    const evidenceNode = document.getElementById("node-evidence");
    const pathA = document.getElementById("line-display-to-ledger");
    const pathB = document.getElementById("line-ledger-to-source");
    const stamp = document.getElementById("trace-stamp");
    const panels = ["panel-display", "panel-authority", "panel-source"].map(id => document.getElementById(id));

    const drawAuditLines = () => {
        if (!svg || !claimNode || !ledgerCard || !evidenceNode) return;
        const svgRect = svg.getBoundingClientRect();
        const claimRect = claimNode.getBoundingClientRect();
        const ledgerRect = ledgerCard.getBoundingClientRect();
        const evidenceRect = evidenceNode.getBoundingClientRect();

        const p1 = { x: claimRect.right - svgRect.left, y: claimRect.top + claimRect.height / 2 - svgRect.top };
        const p2 = { x: ledgerRect.left - svgRect.left, y: ledgerRect.top + ledgerRect.height / 2 - svgRect.top };
        const p3 = { x: ledgerRect.right - svgRect.left, y: ledgerRect.top + ledgerRect.height / 2 - svgRect.top };
        const p4 = { x: evidenceRect.left - svgRect.left, y: evidenceRect.top + evidenceRect.height / 2 - svgRect.top };

        const c1 = (p2.x - p1.x) / 2;
        pathA.setAttribute("d", `M ${p1.x} ${p1.y} C ${p1.x + c1} ${p1.y}, ${p2.x - c1} ${p2.y}, ${p2.x} ${p2.y}`);
        const c2 = (p4.x - p3.x) / 2;
        pathB.setAttribute("d", `M ${p3.x} ${p3.y} C ${p3.x + c2} ${p3.y}, ${p4.x - c2} ${p4.y}, ${p4.x} ${p4.y}`);

        // prepare dash-draw metrics
        [pathA, pathB].forEach(p => {
            const len = p.getTotalLength ? p.getTotalLength() : 0;
            p.dataset.len = len;
        });
    };

    window.addEventListener("load", drawAuditLines);
    window.addEventListener("resize", drawAuditLines);
    setTimeout(drawAuditLines, 400);

    /* --- Trace timeline: claim → line draws → ledger locks → line draws → source anchors → stamp --- */
    let traceTimers = [];
    const clearTrace = () => {
        traceTimers.forEach(t => clearTimeout(t));
        traceTimers = [];
        claimNode && claimNode.classList.remove("active");
        ledgerCard && ledgerCard.classList.remove("active");
        evidenceNode && evidenceNode.classList.remove("active");
        panels.forEach(p => p && p.classList.remove("lit"));
        stamp && stamp.classList.remove("stamped");
        [pathA, pathB].forEach(p => {
            if (!p) return;
            p.style.transition = "none";
            const len = p.dataset.len || 600;
            p.style.strokeDasharray = `${len}`;
            p.style.strokeDashoffset = `${len}`;
        });
    };

    const drawPath = (p, dur) => {
        if (!p) return;
        const len = p.dataset.len || 600;
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
        // force reflow, then animate dashoffset to 0
        void p.getBoundingClientRect();
        p.style.transition = `stroke-dashoffset ${dur}ms ease-in-out`;
        p.style.strokeDashoffset = "0";
    };

    const playTrace = () => {
        if (!claimNode || !pathA || !pathB) return;
        if (reducedMotion) {
            // static end-state, no animation
            claimNode.classList.add("active");
            ledgerCard.classList.add("active");
            evidenceNode.classList.add("active");
            [pathA, pathB].forEach(p => { p.style.strokeDasharray = "none"; p.style.strokeDashoffset = "0"; });
            return;
        }
        clearTrace();
        drawAuditLines();
        const t = (fn, ms) => traceTimers.push(setTimeout(fn, ms));

        t(() => { claimNode.classList.add("active"); panels[0] && panels[0].classList.add("lit"); }, 300);
        t(() => drawPath(pathA, 700), 900);
        t(() => { ledgerCard.classList.add("active"); panels[1] && panels[1].classList.add("lit"); }, 1650);
        t(() => drawPath(pathB, 700), 2250);
        t(() => { evidenceNode.classList.add("active"); panels[2] && panels[2].classList.add("lit"); }, 3000);
        t(() => { stamp && stamp.classList.add("stamped"); }, 3500);
        // settle: dim panels, keep highlights lightly on
        t(() => { panels.forEach(p => p && p.classList.remove("lit")); }, 6000);
    };

    // Auto-play when the hero visual first scrolls into view
    const heroVisual = document.getElementById("audit-chain");
    if (heroVisual && "IntersectionObserver" in window) {
        let played = false;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !played) {
                    played = true;
                    setTimeout(playTrace, 350);
                    io.disconnect();
                }
            });
        }, { threshold: 0.35 });
        io.observe(heroVisual);
    }

    // Replay button + hover re-trigger on the claim node
    const replayBtn = document.getElementById("btn-replay-trace");
    replayBtn && replayBtn.addEventListener("click", playTrace);
    claimNode && claimNode.addEventListener("mouseenter", () => {
        if (!traceTimers.length) playTrace();
    });

    /* --- 2. Scroll reveals --- */
    const revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length && "IntersectionObserver" in window && !reducedMotion) {
        const revealIO = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add("visible");
                    revealIO.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        revealEls.forEach(el => revealIO.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add("visible"));
    }

    /* --- 3. Terminal typewriter --- */
    const terminal = document.getElementById("terminal-demo");
    if (terminal && !reducedMotion && "IntersectionObserver" in window) {
        const lines = Array.from(terminal.querySelectorAll(".terminal-line"));
        const originals = lines.map(l => l.innerHTML);
        lines.forEach(l => l.classList.add("pending-type"));

        const typeLine = (line, html, done) => {
            line.classList.remove("pending-type");
            const isCommand = html.includes("t-prompt");
            if (!isCommand) {
                // outputs appear whole, like a real process printing
                line.innerHTML = html;
                setTimeout(done, 260);
                return;
            }
            // type command text char by char after the prompt
            const promptEnd = html.indexOf("</span>") + 7;
            const promptHtml = html.slice(0, promptEnd);
            const rest = html.slice(promptEnd);
            const plain = rest.replace(/<[^>]*>/g, "");
            let i = 0;
            line.innerHTML = promptHtml + '<span class="type-caret"></span>';
            const tick = () => {
                i++;
                line.innerHTML = promptHtml + plain.slice(0, i) + '<span class="type-caret"></span>';
                if (i < plain.length) {
                    setTimeout(tick, 18 + Math.random() * 26);
                } else {
                    line.innerHTML = promptHtml + rest;
                    setTimeout(done, 320);
                }
            };
            setTimeout(tick, 120);
        };

        let started = false;
        const termIO = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !started) {
                    started = true;
                    termIO.disconnect();
                    let idx = 0;
                    const next = () => {
                        if (idx >= lines.length) return;
                        const cur = idx;
                        idx++;
                        typeLine(lines[cur], originals[cur], next);
                    };
                    setTimeout(next, 300);
                }
            });
        }, { threshold: 0.4 });
        termIO.observe(terminal);
    }

    /* --- 4. Governed evolution loop --- */
    const evolutionData = {
        zh: {
            finding: {
                kicker: "RUN-152 · GATE BLOCKED",
                title: "失败先变成可查询的控制记录",
                copy: "缺失引用映射不会被藏进正文说明，而会成为 finding、blocker 和 event，保留发生阶段、影响范围与修复责任。",
                owner: "Python control plane",
                record: "finding + event",
                effect: "阻断当前交付"
            },
            diagnose: {
                kicker: "CANDIDATE-027 · PROPOSED",
                title: "Agent 可以分析根因，但归因仍是候选",
                copy: "模型可以阅读轨迹并提出“Writer 跳过 source binding”这样的解释；它不能把自己的解释直接写成系统事实或修改生产规则。",
                owner: "Agent proposes",
                record: "diagnosis candidate",
                effect: "等待人类审阅"
            },
            candidate: {
                kicker: "PATCH-027 · EVAL-CASE-041",
                title: "改动必须同时带着评测样例进入审查",
                copy: "开发者把候选落成 validator、gate、prompt 或 workflow patch，并用原失败构造回归样例。补丁和样例一起接受确定性测试与人工复核。",
                owner: "Developer + test runner",
                record: "patch + regression case",
                effect: "生产版本保持不变"
            },
            approve: {
                kicker: "HUMAN DECISION · RECORDED",
                title: "是否吸收为系统规则，由人类决定",
                copy: "评审者可以批准、驳回或要求更多证据。写作偏好经批准后才可进入 Improvement Ledger；系统规则仍需代码评审与发布。决定本身也留下记录。",
                owner: "Human reviewer",
                record: "approval / rejection",
                effect: "允许进入发布流程"
            },
            release: {
                kicker: "vNEXT · VERSIONED CHANGE",
                title: "改进以新版本生效，并保留回滚路径",
                copy: "通过评测和批准的改动进入下一版本；旧运行、失败 finding、测试结果和采用决定仍可复查。新版本再次产生信号，演进环重新开始。",
                owner: "Release transaction",
                record: "version + changelog",
                effect: "可追溯、可回滚"
            }
        },
        en: {
            finding: {
                kicker: "RUN-152 · GATE BLOCKED",
                title: "A failure becomes a queryable control record first",
                copy: "A missing citation mapping is not hidden in prose. It becomes a finding, blocker, and event with stage, scope, and repair ownership.",
                owner: "Python control plane",
                record: "finding + event",
                effect: "block this delivery"
            },
            diagnose: {
                kicker: "CANDIDATE-027 · PROPOSED",
                title: "An agent may analyze the cause, but its diagnosis remains a candidate",
                copy: "A model may read the trace and propose that the writer skipped source binding. It cannot turn that explanation into system fact or modify production rules.",
                owner: "Agent proposes",
                record: "diagnosis candidate",
                effect: "await human review"
            },
            candidate: {
                kicker: "PATCH-027 · EVAL-CASE-041",
                title: "A change enters review together with an evaluation case",
                copy: "A developer turns the candidate into a validator, gate, prompt, or workflow patch and converts the original failure into a regression case. Patch and case are reviewed together.",
                owner: "Developer + test runner",
                record: "patch + regression case",
                effect: "production unchanged"
            },
            approve: {
                kicker: "HUMAN DECISION · RECORDED",
                title: "A human decides whether the system should absorb the change",
                copy: "A reviewer may approve, reject, or request more evidence. A writing preference may enter the Improvement Ledger only after approval; a system rule still requires code review and release. The decision is recorded.",
                owner: "Human reviewer",
                record: "approval / rejection",
                effect: "admit to release flow"
            },
            release: {
                kicker: "vNEXT · VERSIONED CHANGE",
                title: "The improvement takes effect as a versioned, reversible change",
                copy: "An evaluated and approved patch enters a later release. Prior runs, findings, test results, and adoption decisions remain inspectable. The next version produces new signals, and the loop begins again.",
                owner: "Release transaction",
                record: "version + changelog",
                effect: "traceable + reversible"
            }
        }
    };

    const evolutionLoop = document.querySelector("[data-evolution-loop]");
    if (evolutionLoop) {
        const evolutionStages = Array.from(evolutionLoop.querySelectorAll("[data-evolution-step]"));
        const data = evolutionData[isEn ? "en" : "zh"];
        const fields = {
            kicker: document.getElementById("evolution-kicker"),
            title: document.getElementById("evolution-title"),
            copy: document.getElementById("evolution-copy"),
            owner: document.getElementById("evolution-owner"),
            record: document.getElementById("evolution-record"),
            effect: document.getElementById("evolution-effect")
        };

        const showEvolutionStep = (key, focus = false) => {
            const entry = data[key];
            if (!entry) return;
            Object.entries(fields).forEach(([name, node]) => { node.textContent = entry[name]; });
            evolutionStages.forEach(stage => {
                const active = stage.getAttribute("data-evolution-step") === key;
                stage.classList.toggle("active", active);
                stage.setAttribute("aria-selected", active ? "true" : "false");
                if (active && focus) stage.focus();
            });
        };

        evolutionStages.forEach((stage, index) => {
            stage.addEventListener("click", () => showEvolutionStep(stage.getAttribute("data-evolution-step")));
            stage.addEventListener("keydown", event => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
                event.preventDefault();
                const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
                const next = (index + delta + evolutionStages.length) % evolutionStages.length;
                showEvolutionStep(evolutionStages[next].getAttribute("data-evolution-step"), true);
            });
        });
        showEvolutionStep("finding");
    }

    /* --- 5. Interactive gate and sanctioned-repair simulation --- */
    const scenarioData = {
        zh: {
            hallucination: {
                draft: "组件现货均价环比上升 2.5%，该变化反映市场需求正在改善。",
                ledger: "组件现货均价环比下降 1.5%",
                blocked: "[草稿] 上升 2.5%\n[冻结记录] 下降 1.5%\n\nBLOCKED · 数字方向与幅度冲突\nfinding_id: QG-014",
                repairedDraft: "监测样本中的组件现货均价环比下降 1.5%。",
                repairReady: "修复示例已生成 revision 2。\n\n这一步代表 Agent / 人提交新版本；revision 1 与 QG-014 继续保留。请重新运行门禁。",
                passed: "PASSED · revision 2 与冻结记录一致。\n\n门禁允许进入人工批准环节；它没有替人批准交付。"
            },
            tampering: {
                draft: "某头部互联网公司发布了新型储能设备，组件现货均价环比下降 1.5%。",
                ledger: "组件现货均价环比下降 1.5%",
                blocked: "[草稿] 新增“头部互联网公司发布储能设备”\n[冻结记录] 无对应登记项\n\nBLOCKED · 未登记实体主张\nfinding_id: QG-021",
                repairedDraft: "监测样本中的组件现货均价环比下降 1.5%。",
                repairReady: "修复示例已生成 revision 2。\n\n未登记主张被移出新版本；revision 1 与 QG-021 继续保留。请重新运行门禁。",
                passed: "PASSED · revision 2 不再包含未登记主张。\n\n门禁允许进入人工批准环节；它没有替人批准交付。"
            },
            waiting: "门禁会检查并阻断问题，但不会替 Agent 或人类修改草稿。",
            blockedTitle: "❌ 门禁阻断 · 未进入交付件",
            repairTitle: "🛠 修复示例 · 新 revision 待复检",
            passedTitle: "✅ 门禁通过 · 等待人类批准"
        },
        en: {
            hallucination: {
                draft: "Component average spot price rose 2.5%, indicating improving market demand.",
                ledger: "Component average spot price dropped 1.5%",
                blocked: "[Draft] rose 2.5%\n[Frozen record] dropped 1.5%\n\nBLOCKED · direction and magnitude conflict\nfinding_id: QG-014",
                repairedDraft: "In the monitored sample, component average spot price dropped 1.5%.",
                repairReady: "Repair example created revision 2.\n\nThis represents a new version submitted by an agent / human. Revision 1 and QG-014 remain in history. Run the gate again.",
                passed: "PASSED · revision 2 matches the frozen record.\n\nThe gate allows the run to await human approval; it does not approve delivery itself."
            },
            tampering: {
                draft: "A leading internet company launched a new energy-storage device. Component average spot price dropped 1.5%.",
                ledger: "Component average spot price dropped 1.5%",
                blocked: "[Draft] adds a company-product launch claim\n[Frozen record] no matching entry\n\nBLOCKED · unregistered entity claim\nfinding_id: QG-021",
                repairedDraft: "In the monitored sample, component average spot price dropped 1.5%.",
                repairReady: "Repair example created revision 2.\n\nThe unregistered claim is absent from the new version. Revision 1 and QG-021 remain in history. Run the gate again.",
                passed: "PASSED · revision 2 contains no unregistered claim.\n\nThe gate allows the run to await human approval; it does not approve delivery itself."
            },
            waiting: "The gate detects and blocks problems. It does not rewrite the draft for the agent or human.",
            blockedTitle: "❌ Gate blocked · not admitted to delivery",
            repairTitle: "🛠 Repair example · new revision awaits re-check",
            passedTitle: "✅ Gate passed · awaiting human approval"
        }
    };

    const langData = scenarioData[isEn ? "en" : "zh"];
    let currentScenario = "hallucination";
    const draftTextarea = document.getElementById("sandbox-draft");
    const ledgerFactSpan = document.getElementById("sandbox-ledger-fact");
    const gateReportBox = document.getElementById("gate-report");
    const draftRevision = document.getElementById("draft-revision");
    const runGateBtn = document.getElementById("btn-run-gate");
    const showRepairBtn = document.getElementById("btn-show-repair");
    const rerunGateBtn = document.getElementById("btn-rerun-gate");

    const setGateReport = (state, title, log) => {
        gateReportBox.className = `gate-report-box ${state}`;
        gateReportBox.innerHTML = `<div class="gate-status-text">${title}</div><div class="gate-log">${log}</div>`;
    };

    const loadScenario = (name) => {
        currentScenario = name;
        const data = langData[name];
        draftTextarea.value = data.draft;
        ledgerFactSpan.textContent = data.ledger;
        draftRevision.textContent = "REVISION 1";
        setGateReport("pending", isEn ? "⏳ Waiting for gate check…" : "⏳ 等待质量检查运行…", langData.waiting);
        runGateBtn.classList.remove("hidden");
        showRepairBtn.classList.add("hidden");
        rerunGateBtn.classList.add("hidden");
    };

    if (draftTextarea) loadScenario("hallucination");

    document.querySelectorAll(".btn-scenario").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-scenario").forEach(item => item.classList.remove("active"));
            btn.classList.add("active");
            loadScenario(btn.getAttribute("data-scenario"));
        });
    });

    if (runGateBtn) {
        runGateBtn.addEventListener("click", () => {
            const data = langData[currentScenario];
            const alreadyRepaired = draftTextarea.value.trim() === data.repairedDraft;
            if (alreadyRepaired) {
                setGateReport("success", langData.passedTitle, data.passed);
                return;
            }
            setGateReport("error", langData.blockedTitle, data.blocked);
            gateReportBox.classList.add("shake");
            setTimeout(() => gateReportBox.classList.remove("shake"), reducedMotion ? 0 : 450);
            runGateBtn.classList.add("hidden");
            showRepairBtn.classList.remove("hidden");
        });
    }

    if (showRepairBtn) {
        showRepairBtn.addEventListener("click", () => {
            const data = langData[currentScenario];
            draftTextarea.value = data.repairedDraft;
            draftRevision.textContent = "REVISION 2";
            draftTextarea.classList.add("flash-repair");
            setTimeout(() => draftTextarea.classList.remove("flash-repair"), reducedMotion ? 0 : 900);
            setGateReport("pending", langData.repairTitle, data.repairReady);
            showRepairBtn.classList.add("hidden");
            rerunGateBtn.classList.remove("hidden");
        });
    }

    if (rerunGateBtn) {
        rerunGateBtn.addEventListener("click", () => {
            const data = langData[currentScenario];
            const passed = draftTextarea.value.trim() === data.repairedDraft;
            setGateReport(passed ? "success" : "error", passed ? langData.passedTitle : langData.blockedTitle, passed ? data.passed : data.blocked);
            if (passed) rerunGateBtn.classList.add("hidden");
        });
    }

    /* --- 6. In-place card disclosures --- */
    const disclosureCards = document.querySelectorAll(".disclosure-card");

    const setDisclosureState = (card, open) => {
        card.classList.toggle("is-open", open);
        card.setAttribute("aria-expanded", open ? "true" : "false");
        const detail = card.querySelector(":scope > .card-inline-detail");
        if (detail) detail.setAttribute("aria-hidden", open ? "false" : "true");
    };

    const toggleDisclosure = (card) => {
        const willOpen = !card.classList.contains("is-open");
        const group = card.closest("[data-disclosure-group]");
        if (willOpen && group) {
            group.querySelectorAll(".disclosure-card.is-open").forEach(other => {
                if (other !== card) setDisclosureState(other, false);
            });
        }
        setDisclosureState(card, willOpen);
    };

    disclosureCards.forEach(card => {
        card.addEventListener("click", () => toggleDisclosure(card));
        card.addEventListener("keydown", event => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            toggleDisclosure(card);
        });
    });

    /* --- 6b. Comparison demo (see it catch) --- */
    const cmpWidget = document.querySelector("[data-cmp-widget]");
    if (cmpWidget) {
        const cmpAll = {
            zh: {
                t: { deliver: "交付", delivered: "已通过检查 · 待人工确认", rev1: "草稿 · revision 1", rev2: "revision 2 · 已修复" },
                scenarios: {
                    flip: {
                        source: "样本组件现货均价环比下降 1.5%。",
                        oneShot: "组件现货均价环比<span class=err>上涨 2.5%</span>，显示<span class=err>下游需求正在回暖</span>。",
                        draft: "组件现货均价环比上涨 2.5%，显示下游需求正在回暖。",
                        findings: [
                            { level: "block", tag: "BLOCKED · 数字冲突", text: "「上涨 2.5%」与已登记数字（下降 1.5%）方向和幅度都不一致。" },
                            { level: "warn", tag: "AI 复核发现 · 待人确认", text: "「需求正在回暖」没有登记来源支撑，需要人来确认是否保留。" }
                        ],
                        repaired: "样本组件现货均价环比下降 1.5%。现有材料不足以判断价格变化的具体原因。",
                        repairedFindings: [ { level: "pass", tag: "PASSED · 与登记数字一致", text: "revision 2 的方向和幅度与冻结记录一致，未登记结论已移除。" } ],
                        q: {
                            where: "把「下降 1.5%」写成了「上涨 2.5%」，还加了一句没有依据的「需求正在回暖」。",
                            how: "当前草稿里的数字与已登记（冻结）的数字方向、幅度都对不上；「回暖」这句话找不到登记来源。",
                            why: "存在未解决的冲突和无出处结论；问题没处理完，就不能被当成最终稿。",
                            fixed: "样本组件现货均价环比下降 1.5%。现有材料不足以判断价格变化的具体原因。",
                            notProven: "它没有证明需求一定没有回暖；只是指出当前提供的材料不足以支持这个结论。"
                        },
                        tech: "finding: QG-014  type: value_conflict\nledger:  CL-0012 组件现货均价 = 下降 1.5% (frozen)\ndraft:   上涨 2.5% + 未登记结论「需求回暖」\ndelivery_truth.valid = false"
                    },
                    status: {
                        source: "公司预计于第四季度启动试生产，具体时间取决于设备验收进度。",
                        oneShot: "新产线<span class=err>已经投产</span>，并将在第四季度<span class=err>贡献收入</span>。",
                        draft: "新产线已经投产，并将在第四季度贡献收入。",
                        findings: [
                            { level: "block", tag: "BLOCKED · 未登记事实", text: "「已经投产」没有出现在关键事实清单中；来源只支持「预计启动」。" },
                            { level: "warn", tag: "AI 复核发现 · 待人确认", text: "「贡献收入」没有登记来源，属于新增推论，需人确认。" }
                        ],
                        repaired: "公司目前预计于第四季度启动试生产，但时间仍取决于设备验收，收入贡献尚无法确认。",
                        repairedFindings: [ { level: "pass", tag: "PASSED · 与来源范围一致", text: "revision 2 恢复了「预计」的条件语气，移除了未登记的完成状态与收入结论。" } ],
                        q: {
                            where: "把「预计启动」写成了「已经投产」，并凭空加了「贡献收入」。",
                            how: "来源只支持预计时间，不支持「已完成」；「贡献收入」在清单里找不到依据。",
                            why: "状态被夸大、结论无出处；退回修改，未处理不能交付。",
                            fixed: "公司目前预计于第四季度启动试生产，但时间仍取决于设备验收，收入贡献尚无法确认。",
                            notProven: "它没有证明产线一定不会投产；只是指出材料目前只支持「预计」，不支持「已完成」。"
                        },
                        tech: "finding: QG-021 / QG-022  type: unregistered_fact + scope_mismatch\nledger:  无「已投产」登记项\nsource:  仅支持 estimated_start = Q4\ndelivery_truth.valid = false"
                    },
                    stale: {
                        source: "2025 年第四季度，公司在样本市场中的份额为 18%。",
                        oneShot: "公司<span class=err>目前</span>的市场份额为 18%，<span class=err>仍处于行业领先位置</span>。",
                        draft: "公司目前的市场份额为 18%，仍处于行业领先位置。",
                        findings: [
                            { level: "block", tag: "BLOCKED · 时效不符", text: "当前任务要求近 30 天材料，该来源标注为 2025 Q4，已超出时限。" },
                            { level: "block", tag: "时间范围缺失", text: "草稿删除了「2025 年第四季度」的限定，把历史数据写成了「目前」。" },
                            { level: "warn", tag: "AI 复核发现 · 待人确认", text: "「行业领先」没有登记比较依据，需人确认。" }
                        ],
                        repaired: "根据公司 2025 年第四季度披露，其在样本市场中的份额为 18%；目前市场份额尚待更新数据确认。",
                        repairedFindings: [ { level: "pass", tag: "PASSED · 恢复时间限定", text: "revision 2 保留了来源期间，未再把历史数据表述为「目前」。" } ],
                        q: {
                            where: "把「2025 Q4 的 18%」写成「目前 18%」，还加了没有依据的「行业领先」。",
                            how: "来源有明确历史期间且已超出时限；草稿抹掉了时间范围；「行业领先」找不到比较依据。",
                            why: "过期来源 + 时间范围缺失 + 无依据比较；需更新来源或降低表述后再交付。",
                            fixed: "根据公司 2025 年第四季度披露，其在样本市场中的份额为 18%；目前市场份额尚待更新数据确认。",
                            notProven: "它没有证明 18% 一定已经过时；只是指出这份来源超出了本次任务的时限，且不能标成「目前」。"
                        },
                        tech: "finding: QG-030..032  type: freshness + scope_drop + unsupported_comparison\nsource:  date = 2025-Q4 (age > 30d policy)\ndraft:   framing = 「目前」，删除期间限定\ndelivery_truth.valid = false"
                    }
                }
            },
            en: {
                t: { deliver: "Deliver", delivered: "Checks passed · awaiting human sign-off", rev1: "Draft · revision 1", rev2: "revision 2 · repaired" },
                scenarios: {
                    flip: {
                        source: "In the monitored sample, component average spot price dropped 1.5%.",
                        oneShot: "Component average spot price <span class=err>rose 2.5%</span>, showing <span class=err>downstream demand is recovering</span>.",
                        draft: "Component average spot price rose 2.5%, showing downstream demand is recovering.",
                        findings: [
                            { level: "block", tag: "BLOCKED · value conflict", text: "'rose 2.5%' contradicts the frozen record (dropped 1.5%) in both direction and magnitude." },
                            { level: "warn", tag: "AI review · needs human", text: "'demand is recovering' has no registered source and needs a human to confirm." }
                        ],
                        repaired: "In the monitored sample, component average spot price dropped 1.5%. The available material is insufficient to explain the cause of the change.",
                        repairedFindings: [ { level: "pass", tag: "PASSED · matches the record", text: "Revision 2 matches the frozen figure; the unsourced conclusion was removed." } ],
                        q: {
                            where: "'dropped 1.5%' was turned into 'rose 2.5%', plus an unsupported 'demand is recovering'.",
                            how: "The draft figure conflicts with the frozen record; the 'recovering' claim has no registered source.",
                            why: "An unresolved conflict and an unsourced conclusion remain; nothing ships until they are handled.",
                            fixed: "In the monitored sample, component average spot price dropped 1.5%. The available material is insufficient to explain the cause.",
                            notProven: "It doesn't prove demand isn't recovering — only that the current material can't support that claim."
                        },
                        tech: "finding: QG-014  type: value_conflict\nledger:  CL-0012 spot price = dropped 1.5% (frozen)\ndraft:   rose 2.5% + unsourced 'recovering'\ndelivery_truth.valid = false"
                    },
                    status: {
                        source: "The company expects to start pilot production in Q4, with timing depending on equipment acceptance.",
                        oneShot: "The new line is <span class=err>already in production</span> and will <span class=err>contribute revenue</span> in Q4.",
                        draft: "The new line is already in production and will contribute revenue in Q4.",
                        findings: [
                            { level: "block", tag: "BLOCKED · unregistered fact", text: "'already in production' is not in the key-fact ledger; the source only supports 'expects to start'." },
                            { level: "warn", tag: "AI review · needs human", text: "'contribute revenue' has no registered source and needs confirmation." }
                        ],
                        repaired: "The company currently expects to start pilot production in Q4, though timing still depends on equipment acceptance, and any revenue contribution cannot yet be confirmed.",
                        repairedFindings: [ { level: "pass", tag: "PASSED · within source scope", text: "Revision 2 restores the conditional 'expects' framing and drops the unregistered completion and revenue claims." } ],
                        q: {
                            where: "'expects to start' became 'already in production', with a fabricated 'contribute revenue'.",
                            how: "The source supports only an expected date, not completion; 'contribute revenue' has no basis in the ledger.",
                            why: "Overstated status and an unsourced conclusion; returned for repair, not shippable as-is.",
                            fixed: "The company currently expects to start pilot production in Q4, though timing still depends on equipment acceptance, and revenue contribution cannot yet be confirmed.",
                            notProven: "It doesn't prove the line won't go into production — only that today's material supports 'expected', not 'done'."
                        },
                        tech: "finding: QG-021 / QG-022  type: unregistered_fact + scope_mismatch\nledger:  no 'in production' entry\nsource:  supports estimated_start = Q4 only\ndelivery_truth.valid = false"
                    },
                    stale: {
                        source: "In Q4 2025, the company held an 18% share in the sample market.",
                        oneShot: "The company <span class=err>currently</span> holds 18% market share and <span class=err>remains the industry leader</span>.",
                        draft: "The company currently holds 18% market share and remains the industry leader.",
                        findings: [
                            { level: "block", tag: "BLOCKED · freshness", text: "This task requires material from the last 30 days; the source is dated Q4 2025 and is out of window." },
                            { level: "block", tag: "time scope dropped", text: "The draft removed the 'Q4 2025' qualifier, presenting historical data as 'current'." },
                            { level: "warn", tag: "AI review · needs human", text: "'industry leader' has no registered comparison basis and needs confirmation." }
                        ],
                        repaired: "Per the company's Q4 2025 disclosure, its share in the sample market was 18%; the current share awaits updated data for confirmation.",
                        repairedFindings: [ { level: "pass", tag: "PASSED · time scope restored", text: "Revision 2 keeps the source period and no longer frames historical data as 'current'." } ],
                        q: {
                            where: "'18% in Q4 2025' became 'currently 18%', plus an unsupported 'industry leader'.",
                            how: "The source has an explicit, now-expired period; the draft dropped the time scope; 'leader' has no comparison basis.",
                            why: "Expired source + dropped time scope + unsupported comparison; update the source or soften the wording before delivery.",
                            fixed: "Per the company's Q4 2025 disclosure, its share in the sample market was 18%; the current share awaits updated data for confirmation.",
                            notProven: "It doesn't prove 18% is now wrong — only that this source is outside the task's time window and can't be labeled 'current'."
                        },
                        tech: "finding: QG-030..032  type: freshness + scope_drop + unsupported_comparison\nsource:  date = 2025-Q4 (age > 30d policy)\ndraft:   framing = 'currently', period qualifier removed\ndelivery_truth.valid = false"
                    }
                }
            }
        };

        const cmp = cmpAll[isEn ? "en" : "zh"];
        const $ = (id) => document.getElementById(id);
        const cmpEls = {
            source: $("cmp-source-text"), oneshot: $("cmp-oneshot"), draft: $("cmp-draft"),
            findings: $("cmp-findings"), deliver: $("cmp-deliver"), repair: $("cmp-repair"), rev: $("cmp-rev"),
            where: $("q-where"), how: $("q-how"), why: $("q-why"), fixed: $("q-fixed"), notproven: $("q-notproven"),
            tech: $("cmp-tech-code")
        };
        const renderFindings = (list) => {
            cmpEls.findings.innerHTML = list.map(f => `<div class="finding ${f.level}"><span class="f-tag">${f.tag}</span>${f.text}</div>`).join("");
        };
        let cmpCurrent = "flip";
        const loadCmp = (key) => {
            cmpCurrent = key;
            const s = cmp.scenarios[key];
            cmpEls.source.textContent = s.source;
            cmpEls.oneshot.innerHTML = s.oneShot;
            cmpEls.draft.textContent = s.draft;
            renderFindings(s.findings);
            cmpEls.rev.textContent = cmp.t.rev1;
            cmpEls.deliver.textContent = cmp.t.deliver;
            cmpEls.deliver.classList.remove("ready");
            cmpEls.deliver.disabled = true;
            cmpEls.repair.classList.remove("hidden");
            cmpEls.where.textContent = s.q.where;
            cmpEls.how.textContent = s.q.how;
            cmpEls.why.textContent = s.q.why;
            cmpEls.fixed.textContent = s.q.fixed;
            cmpEls.notproven.textContent = s.q.notProven;
            cmpEls.tech.textContent = s.tech;
        };
        const repairCmp = () => {
            const s = cmp.scenarios[cmpCurrent];
            cmpEls.draft.textContent = s.repaired;
            if (!reducedMotion) {
                cmpEls.draft.classList.add("flash-repair");
                setTimeout(() => cmpEls.draft.classList.remove("flash-repair"), 900);
            }
            renderFindings(s.repairedFindings);
            cmpEls.rev.textContent = cmp.t.rev2;
            cmpEls.deliver.classList.add("ready");
            cmpEls.deliver.textContent = cmp.t.delivered;
            cmpEls.repair.classList.add("hidden");
        };
        document.querySelectorAll(".cmp-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                document.querySelectorAll(".cmp-tab").forEach(x => { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
                tab.classList.add("active");
                tab.setAttribute("aria-selected", "true");
                loadCmp(tab.getAttribute("data-cmp"));
            });
        });
        cmpEls.repair.addEventListener("click", repairCmp);
        loadCmp("flip");
    }

    /* --- 7. Terminal copy (full quickstart) --- */
    const copyBtn = document.getElementById("btn-copy-code");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const commands = [
                "git clone https://github.com/Stahl-G/briefloop.git && cd briefloop",
                "bash scripts/setup.sh",
                "briefloop new industry-weekly ./my-weekly",
                "briefloop run --workspace ./my-weekly --runtime operator"
            ].join("\n");
            navigator.clipboard.writeText(commands).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = isEn ? "Copied!" : "已复制！";
                copyBtn.style.borderColor = "#4faf62";
                copyBtn.style.color = "#4faf62";
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.borderColor = "";
                    copyBtn.style.color = "";
                }, 2000);
            }).catch(err => console.error("Copy failed", err));
        });
    }
});

/* ==========================================================================
   Editorial additions — mobile nav + live version badge
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {

    /* --- 9. Mobile nav toggle --- */
    const navToggle = document.getElementById("nav-toggle");
    const siteNav = document.getElementById("site-nav");
    if (navToggle && siteNav) {
        navToggle.addEventListener("click", () => {
            const open = siteNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        siteNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
            siteNav.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        }));
    }

    /* --- 10. Live version badge — PyPI is the single source of truth --- */
    const versionBadge = document.getElementById("version-badge");
    if (versionBadge) {
        fetch("https://pypi.org/pypi/briefloop/json")
            .then(r => (r.ok ? r.json() : Promise.reject(new Error("pypi unavailable"))))
            .then(d => {
                if (d && d.info && d.info.version) versionBadge.textContent = "v" + d.info.version;
            })
            .catch(() => { /* keep the static fallback text */ });
    }
});

/* Copy-to-clipboard for install commands (data-copy-text buttons) */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-copy-text]").forEach(btn => {
        btn.addEventListener("click", () => {
            const text = btn.getAttribute("data-copy-text");
            if (!navigator.clipboard) return;
            navigator.clipboard.writeText(text).then(() => {
                const original = btn.textContent;
                btn.textContent = document.documentElement.lang.startsWith("en") ? "Copied ✓" : "已复制 ✓";
                setTimeout(() => { btn.textContent = original; }, 1500);
            }).catch(() => { /* clipboard blocked; ignore */ });
        });
    });
});
