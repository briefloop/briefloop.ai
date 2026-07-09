/* ==========================================================================
   briefloop.ai — Interaction & Motion (language aware)
   Motion inventory:
   1. Hero chain-of-custody auto trace (staged, replayable, hover-safe)
   2. Scroll reveals (IntersectionObserver)
   3. Terminal typewriter on first view
   4. Sandbox gate micro-motion (shake on block, flash on rebuild)
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

    /* --- 4. Interactive sandbox --- */
    const scenarioData = {
        zh: {
            hallucination: {
                draft: "在本季度储能板块强劲增长驱动下，组件现货均价环比上升 2.5%，市场信心正逐步建立。",
                ledger: "组件现货均价环比下降 1.5%",
                error: "❌ [门禁审计失败] 数据不一致。\n\n[草稿声明] 组件现货均价上升 2.5%\n[事实账本] 组件现货均价下降 1.5%\n\n⚠️ 阻断原因：起草内容与已冻结的权威事实账本记录冲突。该断言不会进入交付件。",
                success: "✅ [门禁审计通过] 授权派生件重建成功。\n\n- 凭证哈希: sha256_8f0a2e…\n- 允许的操作已校验：无未经登记的事实修改\n- reader-clean 通过 → delivery_promotion: \"promoted\"\n- 交付真值记录: finalize_report.json",
                repairedDraft: "在本季度储能板块强劲增长驱动下，组件现货均价环比下降 1.5%，市场信心正逐步建立。"
            },
            tampering: {
                draft: "字节跳动发布了最新的太阳能储能设备。在此驱动下，组件现货均价环比下降 1.5%，市场正在平稳过渡。",
                ledger: "组件现货均价环比下降 1.5%",
                error: "❌ [门禁审计失败] 未经授权的内容篡改。\n\n[草稿声明] 引入了未登记的主张词汇「字节跳动」\n[事实账本] 未找到匹配「字节跳动」的登记项\n\n⚠️ 阻断原因：派生件只读展示，严禁直接在展示层新增事实。新增断言必须先登记于事实账本。",
                success: "✅ [门禁审计通过] 授权派生件重建成功。\n\n- 凭证哈希: sha256_8f0a2e…\n- 过滤并移除了未经授权的修改（「字节跳动」）\n- reader-clean 通过 → delivery_promotion: \"promoted\"\n- 交付真值记录: finalize_report.json",
                repairedDraft: "在本季度储能电池板块驱动下，组件现货均价环比下降 1.5%，市场正在平稳过渡。"
            },
            waitingText: "⏳ 等待质量检查运行…",
            waitingLog: "点击下方「运行质量审计」，系统将比对草稿事实与权威账本。",
            rebuildingText: "🔄 正在重新生成授权派生件…",
            rebuildingLog: "正在回滚不当修改，提取账本事实并重新生成展示件。",
            gatePassTitle: "✅ 门禁通过 · 派生件重建完成",
            gateFailTitle: "❌ 质量门禁审计未通过"
        },
        en: {
            hallucination: {
                draft: "Driven by strong growth in the energy storage segment this quarter, the average spot price of components rose 2.5%, and market confidence is gradually building.",
                ledger: "Component average spot price dropped 1.5%",
                error: "❌ [Gate Check Failed] Fact mismatch.\n\n[Draft claim] Component average spot price rose 2.5%\n[Claim Ledger] Component average spot price dropped 1.5%\n\n⚠️ Blocked: the analyst draft conflicts with the frozen ledger record. This claim will not reach the delivery bundle.",
                success: "✅ [Audit Passed] Authorized derivative rebuilt.\n\n- Source hash: sha256_8f0a2e…\n- Allowed operations verified: no unregistered fact edits\n- reader-clean passed → delivery_promotion: \"promoted\"\n- Delivery truth record: finalize_report.json",
                repairedDraft: "Driven by strong growth in the energy storage segment this quarter, the average spot price of components dropped 1.5%, and market confidence is gradually building."
            },
            tampering: {
                draft: "ByteDance released the latest solar energy storage equipment. Driven by this, the average spot price of components dropped 1.5%, and the market is transitioning smoothly.",
                ledger: "Component average spot price dropped 1.5%",
                error: "❌ [Gate Check Failed] Unauthorized modification.\n\n[Draft claim] 'ByteDance' was introduced in the draft\n[Claim Ledger] no record matches 'ByteDance'\n\n⚠️ Blocked: display derivatives are read-only projections. New claims must be registered in the Claim Ledger first.",
                success: "✅ [Audit Passed] Authorized derivative rebuilt.\n\n- Source hash: sha256_8f0a2e…\n- Removed unauthorized modification ('ByteDance')\n- reader-clean passed → delivery_promotion: \"promoted\"\n- Delivery truth record: finalize_report.json",
                repairedDraft: "Driven by strong growth in the solar energy storage segment, the average spot price of components dropped 1.5%, and the market is transitioning smoothly."
            },
            waitingText: "⏳ Waiting for gate check…",
            waitingLog: "Click 'Run Audit' below; the system will cross-check the draft against the frozen Claim Ledger.",
            rebuildingText: "🔄 Rebuilding authorized derivative…",
            rebuildingLog: "Rolling back unauthorized edits, re-deriving the display projection from ledger facts.",
            gatePassTitle: "✅ Gate passed · derivative rebuilt",
            gateFailTitle: "❌ Quality gate blocked"
        }
    };

    const langData = scenarioData[isEn ? "en" : "zh"];
    let currentScenario = "hallucination";

    const draftTextarea = document.getElementById("sandbox-draft");
    const ledgerFactSpan = document.getElementById("sandbox-ledger-fact");
    const gateReportBox = document.getElementById("gate-report");
    const runGateBtn = document.getElementById("btn-run-gate");
    const autoRepairBtn = document.getElementById("btn-auto-repair");

    const loadScenario = (name) => {
        currentScenario = name;
        draftTextarea.value = langData[name].draft;
        ledgerFactSpan.textContent = langData[name].ledger;
        gateReportBox.className = "gate-report-box pending";
        gateReportBox.innerHTML = `
            <div class="gate-status-text">${langData.waitingText}</div>
            <div class="gate-log">${langData.waitingLog}</div>
        `;
        autoRepairBtn.classList.add("hidden");
        runGateBtn.classList.remove("hidden");
    };

    if (draftTextarea) loadScenario("hallucination");

    document.querySelectorAll(".btn-scenario").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-scenario").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            loadScenario(btn.getAttribute("data-scenario"));
        });
    });

    const renderGateResult = (passed) => {
        const data = langData[currentScenario];
        if (passed) {
            gateReportBox.className = "gate-report-box success";
            gateReportBox.innerHTML = `
                <div class="gate-status-text">${langData.gatePassTitle}</div>
                <div class="gate-log">${data.success.substring(data.success.indexOf("\n\n") + 2)}</div>
            `;
            autoRepairBtn.classList.add("hidden");
        } else {
            gateReportBox.className = "gate-report-box error";
            gateReportBox.innerHTML = `
                <div class="gate-status-text">${langData.gateFailTitle}</div>
                <div class="gate-log">${data.error.substring(data.error.indexOf("\n\n") + 2)}</div>
            `;
            if (!reducedMotion) {
                gateReportBox.classList.add("shake");
                setTimeout(() => gateReportBox.classList.remove("shake"), 450);
            }
            autoRepairBtn.classList.remove("hidden");
        }
    };

    if (runGateBtn) {
        runGateBtn.addEventListener("click", () => {
            const text = draftTextarea.value;
            let passed = false;
            if (currentScenario === "hallucination" && (text.includes("下降 1.5%") || text.includes("dropped 1.5%"))) {
                passed = true;
            } else if (currentScenario === "tampering" && !text.includes("字节跳动") && !text.includes("ByteDance") && (text.includes("下降 1.5%") || text.includes("dropped 1.5%"))) {
                passed = true;
            }
            renderGateResult(passed);
        });
    }

    if (autoRepairBtn) {
        autoRepairBtn.addEventListener("click", () => {
            draftTextarea.value = langData[currentScenario].repairedDraft;
            if (!reducedMotion) {
                draftTextarea.classList.add("flash-repair");
                setTimeout(() => draftTextarea.classList.remove("flash-repair"), 900);
            }
            gateReportBox.className = "gate-report-box pending";
            gateReportBox.innerHTML = `
                <div class="gate-status-text">${langData.rebuildingText}</div>
                <div class="gate-log">${langData.rebuildingLog}</div>
            `;
            setTimeout(() => renderGateResult(true), reducedMotion ? 0 : 900);
        });
    }

    /* --- 5. Terminal copy --- */
    const copyBtn = document.getElementById("btn-copy-code");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const commands = [
                "pipx install briefloop",
                "briefloop onboard",
                "briefloop init ~/my-workspace --from-onboarding onboarding.json",
                "briefloop run --workspace ~/my-workspace"
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
