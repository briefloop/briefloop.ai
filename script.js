/* ==========================================================================
   briefloop.ai - Dynamic Interaction Scripts (Language Aware)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Audit Chain Connector Logic (SVG path calculations) ---
    const drawAuditLines = () => {
        const svg = document.querySelector(".glow-lines");
        const claimNode = document.getElementById("node-claim");
        const ledgerCard = document.getElementById("ledger-item");
        const evidenceNode = document.getElementById("node-evidence");
        
        const pathDisplayToLedger = document.getElementById("line-display-to-ledger");
        const pathLedgerToSource = document.getElementById("line-ledger-to-source");
        
        if (!svg || !claimNode || !ledgerCard || !evidenceNode) return;
        
        // Get bounding rectangles relative to the viewport
        const svgRect = svg.getBoundingClientRect();
        const claimRect = claimNode.getBoundingClientRect();
        const ledgerRect = ledgerCard.getBoundingClientRect();
        const evidenceRect = evidenceNode.getBoundingClientRect();
        
        // Calculate coordinate points relative to the SVG canvas
        const p1 = {
            x: claimRect.right - svgRect.left,
            y: claimRect.top + (claimRect.height / 2) - svgRect.top
        };
        
        const p2 = {
            x: ledgerRect.left - svgRect.left,
            y: ledgerRect.top + (ledgerRect.height / 2) - svgRect.top
        };
        
        const p3 = {
            x: ledgerRect.right - svgRect.left,
            y: ledgerRect.top + (ledgerRect.height / 2) - svgRect.top
        };
        
        const p4 = {
            x: evidenceRect.left - svgRect.left,
            y: evidenceRect.top + (evidenceRect.height / 2) - svgRect.top
        };
        
        // Draw smooth cubic bezier curve paths
        // Line 1: Claim -> Ledger
        const controlOffset1 = (p2.x - p1.x) / 2;
        pathDisplayToLedger.setAttribute("d", 
            `M ${p1.x} ${p1.y} C ${p1.x + controlOffset1} ${p1.y}, ${p2.x - controlOffset1} ${p2.y}, ${p2.x} ${p2.y}`
        );
        
        // Line 2: Ledger -> Source
        const controlOffset2 = (p4.x - p3.x) / 2;
        pathLedgerToSource.setAttribute("d", 
            `M ${p3.x} ${p3.y} C ${p3.x + controlOffset2} ${p3.y}, ${p4.x - controlOffset2} ${p4.y}, ${p4.x} ${p4.y}`
        );
    };

    // Initialize drawing & re-draw on window resize
    window.addEventListener("load", drawAuditLines);
    window.addEventListener("resize", drawAuditLines);
    
    // Add hover states synchronization
    const claimNode = document.getElementById("node-claim");
    const ledgerCard = document.getElementById("ledger-item");
    const evidenceNode = document.getElementById("node-evidence");
    const pathDisplayToLedger = document.getElementById("line-display-to-ledger");
    const pathLedgerToSource = document.getElementById("line-ledger-to-source");
    
    const setGlowState = (active) => {
        if (active) {
            claimNode.classList.add("active");
            ledgerCard.classList.add("active");
            evidenceNode.classList.add("active");
            pathDisplayToLedger.style.stroke = "rgba(16, 185, 129, 1)";
            pathDisplayToLedger.style.strokeWidth = "3px";
            pathLedgerToSource.style.stroke = "rgba(249, 115, 22, 1)";
            pathLedgerToSource.style.strokeWidth = "3px";
        } else {
            claimNode.classList.remove("active");
            ledgerCard.classList.remove("active");
            evidenceNode.classList.remove("active");
            pathDisplayToLedger.style.stroke = "rgba(16, 185, 129, 0.4)";
            pathDisplayToLedger.style.strokeWidth = "2px";
            pathLedgerToSource.style.stroke = "rgba(249, 115, 22, 0.4)";
            pathLedgerToSource.style.strokeWidth = "2px";
        }
    };
    
    if (claimNode) {
        claimNode.addEventListener("mouseenter", () => setGlowState(true));
        claimNode.addEventListener("mouseleave", () => setGlowState(false));
    }
    
    // Auto recalculate layout since fonts/images might load slightly asynchronously
    setTimeout(drawAuditLines, 500);
    setTimeout(drawAuditLines, 2000);


    // --- 2. Interactive Sandbox Logic ---
    const isEn = document.documentElement.lang === "en";

    const scenarioData = {
        zh: {
            hallucination: {
                draft: "在本季度储能板块强劲增长驱动下，组件现货均价环比上升 2.5%（而真实的账本记录是下降 1.5%），市场信心正逐步建立。",
                ledger: "组件现货均价环比下降 1.5%",
                error: "❌ [门禁审计失败] 数据不一致。\n\n[草稿声明] 组件现货均价上升 2.5%。\n[事实账本] 组件现货均价下降 1.5%。\n\n⚠️ 错误原因: 起草内容与已锁定的权威事实账本记录冲突。",
                success: "✅ [门禁审计通过] 授权衍生件重建成功。\n\n- 凭证哈希: sha256_8f0a2e...\n- 允许的操作已校验: 无未经登记的事实修改。\n- 授权衍生件生成完毕。\n- 衍生件输出哈希: sha256_e3b0c44...",
                repairedDraft: "在本季度储能板块强劲增长驱动下，组件现货均价环比下降 1.5%，市场信心正逐步建立。"
            },
            tampering: {
                draft: "字节跳动发布了最新的太阳能储能设备。在此驱动下，组件现货均价环比下降 1.5%，市场正在平稳过渡。",
                ledger: "组件现货均价环比下降 1.5%",
                error: "❌ [门禁审计失败] 未经授权的内容篡改。\n\n[草稿声明] 引入了未登记的主张词汇 '字节跳动'。\n[事实账本] 未找到匹配 '字节跳动' 的历史登记项。\n\n⚠️ 错误原因: 派生件只读展示，严禁直接在展示层编辑增加事实。新增断言必须先登记于事实账本。",
                success: "✅ [门禁审计通过] 授权衍生件重建成功。\n\n- 凭证哈希: sha256_8f0a2e...\n- 过滤并移除了未经授权的修改 ('字节跳动')。\n- 授权衍生件生成完毕。\n- 衍生件输出哈希: sha256_9c2a1b...",
                repairedDraft: "在本季度储能电池板块驱动下，组件现货均价环比下降 1.5%，市场正在平稳过渡。"
            },
            waitingText: "⏳ 等待合规检查运行...",
            waitingLog: "点击下方“运行合规审计”，系统将比对草稿事实与权威账本。",
            rebuildingText: "🔄 正在重新生成授权派生件...",
            rebuildingLog: "正在回滚不当修改，提取权威账目 facts 并重新生成展示件。"
        },
        en: {
            hallucination: {
                draft: "Driven by strong growth in the energy storage segment this quarter, the average spot price of components rose 2.5% (while the actual ledger record dropped 1.5%), and market confidence is gradually building.",
                ledger: "Component average spot price dropped 1.5%",
                error: "❌ [Gate Check Failed] Fact Mismatch.\n\n[Report Claim] Component average spot price rose 2.5%.\n[Claim Ledger] Component average spot price dropped 1.5%.\n\n⚠️ Error: The analyst draft conflicts with the immutable ledger record.",
                success: "✅ [Audit Passed] Output derived successfully.\n\n- Source Hash: sha256_8f0a2e...\n- Allowed operations verified: No raw text edits.\n- Authorized Derivative generated.\n- Finalizer Output Hash: sha256_e3b0c44...",
                repairedDraft: "Driven by strong growth in the energy storage segment this quarter, the average spot price of components dropped 1.5%, and market confidence is gradually building."
            },
            tampering: {
                draft: "ByteDance released the latest solar energy storage equipment. Driven by this, the average spot price of components dropped 1.5%, and the market is transitioning smoothly.",
                ledger: "Component average spot price dropped 1.5%",
                error: "❌ [Gate Check Failed] Unauthorized Modification.\n\n[Report Claim] 'ByteDance' was introduced in the draft.\n[Claim Ledger] No records matched with 'ByteDance'.\n\n⚠️ Error: Content editing is NOT allowed on display derivatives. Custom facts must be registered via Claim Ledger first.",
                success: "✅ [Audit Passed] Output derived successfully.\n\n- Source Hash: sha256_8f0a2e...\n- Removed unauthorized modifications ('ByteDance').\n- Authorized Derivative generated.\n- Finalizer Output Hash: sha256_9c2a1b...",
                repairedDraft: "Driven by strong growth in the solar energy storage segment, the average spot price of components dropped 1.5%, and the market is transitioning smoothly."
            },
            waitingText: "⏳ Waiting for gate check execution...",
            waitingLog: "Click 'Run Audit' below, and the system will cross-reference the draft draft facts with the Claim Ledger.",
            rebuildingText: "🔄 Rebuilding Authorized Derivative...",
            rebuildingLog: "Rolling back unauthorized modifications, extracting ledger facts, and regenerating display projection."
        }
    };

    const activeLang = isEn ? "en" : "zh";
    const langData = scenarioData[activeLang];

    let currentScenario = "hallucination";
    const draftTextarea = document.getElementById("sandbox-draft");
    const ledgerFactSpan = document.getElementById("sandbox-ledger-fact");
    const gateReportBox = document.getElementById("gate-report");
    const runGateBtn = document.getElementById("btn-run-gate");
    const autoRepairBtn = document.getElementById("btn-auto-repair");
    
    // Load initial scenario
    const loadScenario = (name) => {
        currentScenario = name;
        draftTextarea.value = langData[name].draft;
        ledgerFactSpan.textContent = langData[name].ledger;
        
        // Reset gate report
        gateReportBox.className = "gate-report-box pending";
        gateReportBox.innerHTML = `
            <div class="gate-status-text">${langData.waitingText}</div>
            <div class="gate-log">${langData.waitingLog}</div>
        `;
        autoRepairBtn.classList.add("hidden");
        runGateBtn.classList.remove("hidden");
    };
    
    if (draftTextarea) {
        loadScenario("hallucination");
    }

    // Toggle scenarios
    const scenarioBtns = document.querySelectorAll(".btn-scenario");
    scenarioBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            scenarioBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            loadScenario(btn.getAttribute("data-scenario"));
        });
    });

    // Run audit simulation
    if (runGateBtn) {
        runGateBtn.addEventListener("click", () => {
            const text = draftTextarea.value;
            let passed = false;
            
            if (currentScenario === "hallucination" && (text.includes("下降 1.5%") || text.includes("dropped 1.5%"))) {
                passed = true;
            } else if (currentScenario === "tampering" && !text.includes("字节跳动") && !text.includes("ByteDance") && (text.includes("下降 1.5%") || text.includes("dropped 1.5%"))) {
                passed = true;
            }
            
            // Show result
            if (passed) {
                gateReportBox.className = "gate-report-box success";
                gateReportBox.innerHTML = `
                    <div class="gate-status-text">${isEn ? "✅ Gate passed / Output derived" : "✅ Gate passed / 派生件重建完成"}</div>
                    <div class="gate-log">${langData[currentScenario].success.substring(langData[currentScenario].success.indexOf("\n\n") + 2)}</div>
                `;
                autoRepairBtn.classList.add("hidden");
            } else {
                gateReportBox.className = "gate-report-box error";
                gateReportBox.innerHTML = `
                    <div class="gate-status-text">${isEn ? "❌ Quality Gate Failed" : "❌ 质量门禁审计未通过"}</div>
                    <div class="gate-log">${langData[currentScenario].error.substring(langData[currentScenario].error.indexOf("\n\n") + 2)}</div>
                `;
                autoRepairBtn.classList.remove("hidden");
            }
        });
    }

    // Auto repair simulation
    if (autoRepairBtn) {
        autoRepairBtn.addEventListener("click", () => {
            // Apply repaired text
            draftTextarea.value = langData[currentScenario].repairedDraft;
            
            // Trigger check again with a slight delay
            gateReportBox.className = "gate-report-box pending";
            gateReportBox.innerHTML = `
                <div class="gate-status-text">${langData.rebuildingText}</div>
                <div class="gate-log">${langData.rebuildingLog}</div>
            `;
            
            setTimeout(() => {
                gateReportBox.className = "gate-report-box success";
                gateReportBox.innerHTML = `
                    <div class="gate-status-text">${isEn ? "✅ Gate passed / Output derived" : "✅ Gate passed / 派生件重建完成"}</div>
                    <div class="gate-log">${langData[currentScenario].success.substring(langData[currentScenario].success.indexOf("\n\n") + 2)}</div>
                `;
                autoRepairBtn.classList.add("hidden");
            }, 1000);
        });
    }


    // --- 3. Terminal Copy Logic ---
    const copyBtn = document.getElementById("btn-copy-code");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const commands = [
                "git clone https://github.com/Stahl-G/briefloop.git",
                "cd briefloop && bash scripts/setup.sh",
                "source .venv/bin/activate",
                "briefloop onboard",
                "briefloop init ~/my-workspace --from-onboarding onboarding.json",
                "briefloop run --workspace ~/my-workspace"
            ].join("\n");
            
            navigator.clipboard.writeText(commands).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = isEn ? "Copied!" : "已复制！";
                copyBtn.style.borderColor = "#10b981";
                copyBtn.style.color = "#10b981";
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.borderColor = "";
                    copyBtn.style.color = "";
                }, 2000);
            }).catch(err => {
                console.error("Copy failed", err);
            });
        });
    }
});
