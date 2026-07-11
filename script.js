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

    /* --- 7. Hero install tabs + copy --- */
    const heroInstall = document.getElementById("hero-install");
    const installCopyText = {
        cli: [
            "pipx install briefloop",
            "briefloop new industry-weekly ./my-weekly",
            "briefloop run --workspace ./my-weekly --runtime operator"
        ].join("\n"),
        claude: [
            "git clone https://github.com/Stahl-G/briefloop.git",
            "cd briefloop && bash scripts/setup.sh",
            "source .venv/bin/activate",
            "briefloop claude install --repo-workdir ."
        ].join("\n")
    };

    const flashCopied = (btn) => {
        const original = btn.textContent;
        btn.textContent = isEn ? "Copied!" : "已复制！";
        btn.classList.add("copied");
        setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove("copied");
        }, 1800);
    };

    if (heroInstall) {
        const tabs = heroInstall.querySelectorAll(".hero-install-tab");
        const panels = heroInstall.querySelectorAll(".hero-install-panel");
        const hints = heroInstall.querySelectorAll(".hero-install-hint");

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const key = tab.getAttribute("data-install");
                tabs.forEach(t => {
                    const on = t === tab;
                    t.classList.toggle("active", on);
                    t.setAttribute("aria-selected", on ? "true" : "false");
                });
                panels.forEach(p => p.classList.toggle("hidden", p.getAttribute("data-panel") !== key));
                hints.forEach(h => h.classList.toggle("hidden", h.getAttribute("data-hint") !== key));
            });
        });

        heroInstall.querySelectorAll(".btn-copy-hero").forEach(btn => {
            btn.addEventListener("click", () => {
                const key = btn.getAttribute("data-copy-target");
                const text = installCopyText[key] || "";
                navigator.clipboard.writeText(text).then(() => flashCopied(btn))
                    .catch(err => console.error("Copy failed", err));
            });
        });
    }

    /* --- 8. Terminal copy (full quickstart) --- */
    const copyBtn = document.getElementById("btn-copy-code");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const commands = [
                "pipx install briefloop",
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
