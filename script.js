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

    /* --- 4. Interactive gate and sanctioned-repair simulation --- */
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

    /* --- 5. In-place card disclosures --- */
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

    /* --- 6. Hero install tabs + copy --- */
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

    /* --- 7. Terminal copy (full quickstart) --- */
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
                copyBtn.style.borderColor = "#2dd4bf";
                copyBtn.style.color = "#2dd4bf";
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.borderColor = "";
                    copyBtn.style.color = "";
                }, 2000);
            }).catch(err => console.error("Copy failed", err));
        });
    }
});
