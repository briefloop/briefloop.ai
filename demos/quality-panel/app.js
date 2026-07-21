/* BriefLoop v0.14.0 three-page HTML preview.
   Presentation only: no write, disposition, approval, or workflow action. */
(function () {
    "use strict";

    var LANG = "zh";
    var PAGE = "quality";
    var COPY = {
        zh: {
            proto_banner: "v0.14.0 · 三页只读预览 · 合成数据",
            quality: "质量状态",
            laj: "LAJ 建议",
            improvement: "改进状态",
            boundary: "只读展示 · 无运行权威 · 不触发任何动作",
            qualityTitle: "Store 派生的质量状态",
            qualityIntro: "以下合成数据是 SQLite ControlStore 记录的只读展示。报告、status、Quality Panel 与 HTML 导出是非权威投影；strict action、envelope 与 human-request JSON 必须重新对照 ControlStore 校验，自身不构成权威。",
            authority: "唯一运行权威",
            authorityValue: "briefloop.db · SQLite ControlStore",
            path: "新运行路径",
            pathValue: "Experimental Codex SQLite only",
            legacy: "Legacy JSON 控制面",
            legacyValue: "已删除 · 不迁移 · 不回退",
            delivery: "交付状态",
            deliveryValue: "等待明确的人类批准",
            lajTitle: "LAJ · 实验性第二意见",
            lajIntro: "LAJ 只读、advisory-only。它不改变 Gate、交付、批准、下一动作或事实支持结论。效用与有效性 NOT MEASURED。",
            observation: "建议人工复核一处过度概括；该建议不是质量分数，也不是正确性证明。",
            improvementTitle: "Improvement Ledger unavailable",
            improvementIntro: "0.14 尚无 Store-native Improvement Ledger 的权威记录面。此页不会臆造条目、按钮、收据或未来运行效果。",
            noLearning: "没有自动学习；没有“接受建议后改善下次运行”；当前运行与下一次运行都不会读取本页。",
            footer: "自包含三页 HTML · read-only projection · synthetic preview"
        },
        en: {
            proto_banner: "v0.14.0 · three-page read-only preview · synthetic data",
            quality: "Quality status",
            laj: "LAJ advice",
            improvement: "Improvement status",
            boundary: "Read-only display · no runtime authority · triggers no action",
            qualityTitle: "Store-derived quality status",
            qualityIntro: "This synthetic data is a read-only display of SQLite ControlStore records. Report, status, Quality Panel, and HTML exports are non-authoritative projections. Strict action, envelope, and human-request JSON payloads are revalidated against ControlStore and are not authority by themselves.",
            authority: "Sole runtime authority",
            authorityValue: "briefloop.db · SQLite ControlStore",
            path: "New-run path",
            pathValue: "Experimental Codex SQLite only",
            legacy: "Legacy JSON control plane",
            legacyValue: "Deleted · no migration · no fallback",
            delivery: "Delivery state",
            deliveryValue: "Awaiting explicit human approval",
            lajTitle: "LAJ · experimental second opinion",
            lajIntro: "LAJ is read-only and advisory-only. It changes no Gate, delivery, approval, next action, or factual-support conclusion. Utility and efficacy are NOT MEASURED.",
            observation: "Human review suggested for one overgeneralization. This suggestion is neither a quality score nor proof of correctness.",
            improvementTitle: "Improvement Ledger unavailable",
            improvementIntro: "No Store-native authoritative home for an Improvement Ledger exists in 0.14. This page fabricates no entries, buttons, receipts, or future-run effects.",
            noLearning: "No automatic learning. No “accept suggestion to improve the next run.” Neither the current nor the next run reads this page.",
            footer: "Self-contained three-page HTML · read-only projection · synthetic preview"
        }
    };

    function t(key) { return COPY[LANG][key]; }
    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function renderTabs(main) {
        var tabs = el("nav", "qp-tabs");
        tabs.setAttribute("aria-label", "Three-page read-only brief");
        [["quality", "quality"], ["laj", "laj"], ["improvement", "improvement"]].forEach(function (item) {
            var button = el("button", "qp-tab" + (PAGE === item[0] ? " active" : ""), t(item[1]));
            button.type = "button";
            button.setAttribute("aria-selected", PAGE === item[0] ? "true" : "false");
            button.addEventListener("click", function () {
                PAGE = item[0];
                location.hash = PAGE;
                render();
            });
            tabs.appendChild(button);
        });
        main.appendChild(tabs);
    }

    function renderIdentity(main) {
        var strip = el("div", "identity-strip");
        strip.appendChild(el("span", "status-pill-mini level-warning", "v0.14.0"));
        strip.appendChild(el("span", "identity-meta", "RUN-SYNTHETIC-014 · " + t("boundary")));
        main.appendChild(strip);
    }

    function row(label, value, level) {
        var item = el("tr");
        item.appendChild(el("th", null, label));
        var valueCell = el("td");
        valueCell.appendChild(el("span", "badge badge-" + level, value));
        item.appendChild(valueCell);
        return item;
    }

    function renderQuality(main) {
        var section = el("section", "panel-section");
        section.appendChild(el("h2", null, t("qualityTitle")));
        section.appendChild(el("p", "feedback-sub", t("qualityIntro")));
        var table = el("table", "kv-table");
        table.appendChild(row(t("authority"), t("authorityValue"), "pass"));
        table.appendChild(row(t("path"), t("pathValue"), "info"));
        table.appendChild(row(t("legacy"), t("legacyValue"), "missing"));
        table.appendChild(row(t("delivery"), t("deliveryValue"), "warning"));
        section.appendChild(table);
        main.appendChild(section);
    }

    function renderLaj(main) {
        var section = el("section", "advisory-zone");
        var banner = el("div", "advisory-banner");
        banner.appendChild(el("span", "ab-tag", "EXPERIMENTAL · NOT MEASURED"));
        section.appendChild(banner);
        var body = el("div", "advisory-body");
        body.appendChild(el("h2", null, t("lajTitle")));
        body.appendChild(el("p", "advisory-sub", t("lajIntro")));
        var finding = el("article", "finding-card");
        finding.appendChild(el("span", "badge badge-advisory", "advisory only"));
        finding.appendChild(el("p", "finding-body", t("observation")));
        body.appendChild(finding);
        section.appendChild(body);
        main.appendChild(section);
    }

    function renderImprovement(main) {
        var section = el("section", "feedback-zone");
        section.appendChild(el("h2", null, t("improvementTitle")));
        section.appendChild(el("p", "feedback-sub", t("improvementIntro")));
        section.appendChild(el("p", "consumption-note", t("noLearning")));
        main.appendChild(section);
    }

    function render() {
        var main = document.getElementById("qp-main");
        main.innerHTML = "";
        renderTabs(main);
        renderIdentity(main);
        if (PAGE === "quality") renderQuality(main);
        if (PAGE === "laj") renderLaj(main);
        if (PAGE === "improvement") renderImprovement(main);
        var footer = el("footer", "qp-footer");
        footer.appendChild(el("p", null, t("footer")));
        main.appendChild(footer);
        document.querySelectorAll("[data-i18n]").forEach(function (node) { node.textContent = t(node.dataset.i18n); });
    }

    var langBtn = document.getElementById("btn-lang-toggle");
    var langMenu = document.getElementById("lang-menu");
    langBtn.addEventListener("click", function () {
        langMenu.hidden = !langMenu.hidden;
        langBtn.setAttribute("aria-expanded", langMenu.hidden ? "false" : "true");
    });
    langMenu.querySelectorAll("li").forEach(function (option) {
        option.addEventListener("click", function () {
            LANG = option.dataset.lang;
            document.documentElement.lang = LANG === "en" ? "en" : "zh-CN";
            document.getElementById("lang-current").textContent = option.textContent;
            langMenu.hidden = true;
            render();
        });
    });
    var initial = location.hash.replace("#", "");
    if (["quality", "laj", "improvement"].indexOf(initial) !== -1) PAGE = initial;
    window.addEventListener("hashchange", function () {
        var page = location.hash.replace("#", "");
        if (["quality", "laj", "improvement"].indexOf(page) !== -1 && page !== PAGE) {
            PAGE = page;
            render();
        }
    });
    render();
}());
