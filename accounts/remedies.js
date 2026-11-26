/* Current disclosure redress workbench.
 * All claim/event records stay in this browser's localStorage unless the user exports them.
 * This module never posts claims to the cash ledger and never sends an invoice.
 */
(function () {
  "use strict";
  var STORE = "cedwyn.counting-house.redress.v1";
  var RULE_URL = "remedy-rules.json";
  var DARTBOARD_CSV = "https://cedwyn.bucklerfamily.estate/wayback/go/?u=https%3A%2F%2Fraw.githubusercontent.com%2Funclehowell%2Fcedwyn-dartboard%2Fmain%2Fpublic%2Fdata%2Ffoi-tracker.csv";
  var CHESTNUT_JSON = "https://cedwyn.bucklerfamily.estate/wayback/go/?u=https%3A%2F%2Fraw.githubusercontent.com%2Funclehowell%2Fcedwyn-that-old-chestnut%2Fmain%2Fpublic%2F_db%2Fview.json";
  var rules = null;
  var state = { version: 1, entries: [], imports: {} };

  function el(id) { return document.getElementById(id); }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(n) {
    if (n == null || String(n).trim() === "") return "—";
    var v = Number(n);
    return Number.isFinite(v) ? "£" + v.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";
  }
  function parseMoney(v) {
    if (v == null || String(v).trim() === "") return null;
    var n = Number(String(v).replace(/[£,\s]/g, ""));
    return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
  }
  function dateNow() { return new Date().toISOString().slice(0, 10); }
  function stableId(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100); }
  function download(name, text, type) {
    var blob = new Blob([text], { type: type || "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
  function csvRows(text) {
    var rows = [], row = [], cell = "", quoted = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i], next = text[i + 1];
      if (quoted) {
        if (c === '"' && next === '"') { cell += '"'; i++; }
        else if (c === '"') quoted = false;
        else cell += c;
      } else if (c === '"' && cell === "") quoted = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n") { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
      else cell += c;
    }
    if (cell.length || row.length) { row.push(cell.replace(/\r$/, "")); rows.push(row); }
    if (!rows.length) return [];
    var head = rows.shift().map(function (h) { return h.trim(); });
    return rows.filter(function (r) { return r.some(function (v) { return String(v).trim() !== ""; }); }).map(function (r) {
      var o = {}; head.forEach(function (h, ix) { o[h] = r[ix] == null ? "" : r[ix]; }); return o;
    });
  }
  function readState() {
    try {
      var raw = localStorage.getItem(STORE);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.entries)) state = parsed;
      }
    } catch (e) { /* retain an empty local register if browser storage is unavailable */ }

  }
  function saveState() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); }
    catch (e) { status("Browser storage is full or unavailable. Export a JSON backup and remove old local entries."); }
  }
  function status(message) { if (el("redress-status")) el("redress-status").textContent = message; }

  function codeList() { return rules && Array.isArray(rules.nominal_codes) ? rules.nominal_codes : []; }
  function codeById(id) { return codeList().find(function (c) { return c.code === String(id); }); }
  function recognized(entry) { return ["accepted", "awarded", "statutory-confirmed"].indexOf(entry.status) >= 0; }
  function paid(entry) { return entry.status === "paid"; }
  function totalWhere(fn) {
    return state.entries.reduce(function (sum, e) { return sum + (fn(e) && Number.isFinite(Number(e.amount)) ? Number(e.amount) : 0); }, 0);
  }
  function upsert(record) {
    var ix = state.entries.findIndex(function (e) { return e.id === record.id; });
    if (ix >= 0) state.entries[ix] = Object.assign({}, state.entries[ix], record);
    else state.entries.push(record);
  }
  function importDartboard(text) {
    var rows = csvRows(text), n = 0;
    rows.forEach(function (r, i) {
      var dates = [r.requestDate, r.latestReply, r.lastActivity, r.statutoryDeadline];
      if (!dates.some(function (d) { return String(d || "").indexOf("2026") === 0; })) return;
      var id = "dartboard-" + (r.id || stableId(r.institution + "-" + r.subject + "-" + i));
      var late = r.statutoryDeadline && r.latestReply && r.latestReply > r.statutoryDeadline;
      var noReply = !r.latestReply && r.statutoryDeadline && r.statutoryDeadline < dateNow();
      var note = [r.note, r.possibleReplyElsewhere ? "Possible cross-thread reply: " + r.possibleReplyElsewhere : ""].filter(Boolean).join(" ");
      if (r.route === "WhatDoTheyKnow") note += " WhatDoTheyKnow route: this mailbox tracker records notification emails only; verify the request and response on the public WhatDoTheyKnow page before treating its outcome or timing as complete.";
      if (late) note += " Tracker dates show a reply after the recorded deadline; verify the correct regime, extensions, working-day calculation and substantive response before alleging breach.";
      if (noReply) note += " Tracker snapshot showed no reply by the recorded deadline; check the current mailbox and WhatDoTheyKnow before treating it as still outstanding.";
      upsert({
        id: id, date: r.requestDate || r.lastActivity || r.latestReply || "",
        institution: r.institution || "Institution not stated",
        reference: r.refs || "",
        source: "Dartboard FOI / EIR / SAR tracker",
        sourceUrl: r.threadUrl || "",
        regime: [r.type, r.route, r.regime].filter(Boolean).join(" · "),
        title: r.subject || r.type || "Disclosure correspondence",
        description: "Tracker status: " + (r.status || "not stated") + (r.outcomeAuto ? " · Auto outcome: " + r.outcomeAuto : ""),
        status: "evidence-only",
        amount: null, amountBasis: "not-priced", nominalCode: "9900",
        hours: null, hourlyRate: null, limitationDate: "", loss: "",
        evidenceUrl: r.threadUrl || "", notes: note,
        trackerDeadline: r.statutoryDeadline || "", trackerLatestReply: r.latestReply || "",
        trackerStatus: r.status || "", trackerOutcome: r.outcomeAuto || "",
        importedKind: r.type || "", importedId: r.id || ""
      });
      n++;
    });
    state.imports.dartboard = { importedAt: new Date().toISOString(), count: n, note: "The source tracker says its base mailbox coverage ends 18 October 2026, with targeted HMLR/TNA addenda through 24 November; other institutions are not fully refreshed." };
    saveState(); return n;
  }
  function importChestnut(data) {
    var items = Array.isArray(data) ? data : (data && Array.isArray(data.chestnuts) ? data.chestnuts : []);
    var n = 0;
    items.forEach(function (x, i) {
      var finding = x.finding || {};
      var displayDate = (x.date && (x.date.sort || x.date.display)) || finding.negative_date || "";
      var id = "that-old-chestnut-" + (x.id || stableId(x.title || i));
      var quotes = [finding.negative_quote ? "Earlier / negative statement: " + finding.negative_quote : "", finding.positive_quote ? "Later / qualifying statement: " + finding.positive_quote : ""].filter(Boolean).join("\n\n");
      var refs = (x.evidence || []).join(", ");
      var detail = "Editorial category: " + (finding.class || "not stated");
      if (finding.negative_date) detail += " · Earlier statement: " + finding.negative_date;
      if (finding.positive_date) detail += " · Later statement: " + finding.positive_date;
      if (finding.months_elapsed != null) detail += " · Recorded interval: " + finding.months_elapsed + " months";
      upsert({
        id: id, date: displayDate, institution: (finding.institution || x.provenance && x.provenance.holder || "Institution not stated"),
        reference: refs, source: "That Old Chestnut — finding register",
        sourceUrl: "https://cedwyn.bucklerfamily.estate/wayback/go/?u=https%3A%2F%2Fgithub.com%2Funclehowell%2Fcedwyn-that-old-chestnut",
        regime: "Disclosure wording / response chronology",
        title: x.title || x.id || "Disclosure wording finding",
        description: detail,
        status: "evidence-only", amount: null, amountBasis: "not-priced", nominalCode: "9900",
        hours: null, hourlyRate: null, limitationDate: "", loss: "",
        evidenceUrl: "https://cedwyn.bucklerfamily.estate/wayback/go/?u=https%3A%2F%2Fgithub.com%2Funclehowell%2Fcedwyn-that-old-chestnut",
        notes: [x.note || "", quotes, refs ? "Evidence catalogue refs: " + refs : ""].filter(Boolean).join("\n\n"),
        importedKind: "TOC " + (finding.class || ""), importedId: x.id || ""
      });
      n++;
    });
    state.imports.chestnut = { importedAt: new Date().toISOString(), count: n };
    saveState(); return n;
  }
  function importCurrentCosts(text) {
    var rows = csvRows(text), n = 0;
    rows.forEach(function (r, i) {
      var date = r.date || "";
      /* Every row in this curated source is a 2026 event, including unresolved date labels. */
      upsert({
        id: "current-costs-" + stableId([date, r.body, r.cause, i].join("-")),
        date: date, institution: r.body || "Institution not stated", reference: "",
        source: "Counting House historic current-costs register",
        regime: "Previously recorded disclosure / complaint event",
        title: r.cause || "Previously recorded service event",
        description: r.cost_type || "",
        status: "evidence-only", amount: null, amountBasis: "not-priced", nominalCode: "9900",
        hours: null, hourlyRate: null, limitationDate: "", loss: "",
        evidenceUrl: /^https?:\/\//i.test(r.source || "") ? r.source : "", notes: "Imported as an evidence lead only. Historical rate/value text is not adopted as a recoverable amount. Source amount/hours: " + (r.amount_or_hours || "not supplied") + "; source rate note: " + (r.rate || "") + "; source value: " + (r.value_gbp || "") + "."
      });
      n++;
    });
    state.imports.currentCosts = { importedAt: new Date().toISOString(), count: n };
    saveState(); return n;
  }
  function importJsonBackup(data) {
    if (!data || !Array.isArray(data.entries)) throw new Error("This JSON is not a Counting House redress backup.");
    data.entries.forEach(upsert);
    state.imports.backup = { importedAt: new Date().toISOString(), count: data.entries.length };
    saveState(); return data.entries.length;
  }
  function importFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var text = String(reader.result || ""), count = 0;
        if (/\.json$/i.test(file.name) || text.trim().charAt(0) === "{") {
          var obj = JSON.parse(text);
          if (Array.isArray(obj.entries)) count = importJsonBackup(obj);
          else count = importChestnut(obj);
        } else {
          var rows = csvRows(text);
          if (rows.length && Object.prototype.hasOwnProperty.call(rows[0], "institution")) count = importDartboard(text);
          else if (rows.length && Object.prototype.hasOwnProperty.call(rows[0], "body")) count = importCurrentCosts(text);
          else throw new Error("CSV headers do not match the Dartboard tracker or the older current-costs register.");
        }
        render(); status("Imported or updated " + count + " records from " + file.name + ". All imported entries are evidence-only and unpriced.");
      } catch (e) { status("Import failed: " + e.message); }
    };
    reader.onerror = function () { status("The selected file could not be read."); };
    reader.readAsText(file);
  }
  async function loadLatest() {
    var results = await Promise.allSettled([
      fetch(DARTBOARD_CSV, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error("Dartboard CSV HTTP " + r.status); return r.text(); }),
      fetch(CHESTNUT_JSON, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error("That Old Chestnut JSON HTTP " + r.status); return r.json(); }),
      fetch("current-costs.csv", { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error("Current-costs CSV HTTP " + r.status); return r.text(); })
    ]);
    var summary = [];
    if (results[0].status === "fulfilled") summary.push("Dartboard " + importDartboard(results[0].value));
    else summary.push("Dartboard not fetched — use its CSV upload: " + results[0].reason);
    if (results[1].status === "fulfilled") summary.push("That Old Chestnut " + importChestnut(results[1].value));
    else summary.push("That Old Chestnut not fetched — use its JSON upload: " + results[1].reason);
    if (results[2].status === "fulfilled") summary.push("prior cost register " + importCurrentCosts(results[2].value));
    else summary.push("prior cost register not fetched");
    render(); status(summary.join(" · ") + ". Imports are deduplicated and do not create monetary claims.");
  }

  function ruleMarkup(r) {
    var links = (r.sources || []).map(function (s) { return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a>'; }).join(" · ");
    return '<details class="r-rule"><summary><b>' + esc(r.name) + '</b><span class="r-money">' + esc(r.money || "") + '</span></summary>' +
      '<p><b>Route:</b> ' + esc(r.route || "") + '</p><p><b>Time limit:</b> ' + esc(r.time_limit || "") + '</p><p><b>Evidence to keep:</b> ' + esc(r.evidence || "") + '</p><p class="r-sources">' + links + '</p></details>';
  }
  function render() {
    if (!el("redress-workbench")) return;
    var list = state.entries.slice().sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")) || String(a.institution).localeCompare(String(b.institution)); });
    var evidenceCount = list.filter(function (e) { return e.status === "evidence-only"; }).length;
    var proposed = totalWhere(function (e) { return ["candidate", "requested", "disputed"].indexOf(e.status) >= 0; });
    var confirmed = totalWhere(recognized);
    var cash = totalWhere(paid);
    var suspense = totalWhere(function (e) { return e.status === "cheque-received" || e.status === "receipt-unclassified"; });
    el("redress-cards").innerHTML =
      '<div class="card"><div class="k">Evidence-only events</div><div class="v">' + evidenceCount.toLocaleString("en-GB") + '</div></div>' +
      '<div class="card"><div class="k">Proposed / disputed amounts</div><div class="v">' + money(proposed) + '</div></div>' +
      '<div class="card"><div class="k">Agreed / awarded amounts</div><div class="v">' + money(confirmed) + '</div></div>' +
      '<div class="card"><div class="k">Cash posted / paid</div><div class="v">' + money(cash) + '</div></div>' +
      '<div class="card"><div class="k">Unclassified receipts</div><div class="v">' + money(suspense) + '</div></div>';
    var query = (el("redress-search").value || "").toLowerCase();
    var codeFilter = el("redress-code-filter").value;
    var filtered = list.filter(function (e) {
      return (!codeFilter || e.nominalCode === codeFilter) &&
        (!query || [e.institution, e.reference, e.title, e.description, e.notes, e.source].join(" ").toLowerCase().indexOf(query) >= 0);
    });
    el("redress-rows").innerHTML = filtered.map(function (e) {
      return '<tr><td><input type="checkbox" class="r-pick" value="' + esc(e.id) + '" aria-label="Select ' + esc(e.title) + '"></td>' +
        '<td>' + esc(e.date || "Date to confirm") + '</td><td><b>' + esc(e.institution) + '</b><br><span class="note">' + esc(e.reference || "") + '</span></td>' +
        '<td>' + esc(e.title) + '<br><span class="note">' + esc(e.source || "") + '</span></td>' +
        '<td>' + ([
          e.trackerDeadline ? 'Source response/review due: ' + e.trackerDeadline : '',
          e.regulatorDeadline ? 'ICO / tribunal / Ombudsman: ' + e.regulatorDeadline : '',
          e.judicialReviewDeadline ? 'Judicial review (verified): ' + e.judicialReviewDeadline : '',
          e.limitationDate ? 'Civil limitation (verified): ' + e.limitationDate : ''
        ].filter(Boolean).map(esc).join('<br>') || 'Not recorded') + (e.trackerLatestReply ? '<br><span class="note">Latest reply: ' + esc(e.trackerLatestReply) + '</span>' : '') + '</td>' +
        '<td><span class="pill">' + esc(e.status) + '</span></td><td class="num">' + money(e.amount) + '</td>' +
        '<td>' + esc(e.nominalCode || "9900") + '</td><td><button class="r-edit" data-id="' + esc(e.id) + '">Edit</button> <button class="r-delete" data-id="' + esc(e.id) + '">Remove</button></td></tr>';
    }).join("") || '<tr><td colspan="9">No records match this filter.</td></tr>';
    var by = {};
    list.forEach(function (e) {
      var code = e.nominalCode || "9900";
      if (!by[code]) by[code] = { count: 0, proposed: 0, confirmed: 0, paid: 0, suspense: 0 };
      by[code].count++;
      var amount = Number.isFinite(Number(e.amount)) ? Number(e.amount) : 0;
      if (["candidate", "requested", "disputed"].indexOf(e.status) >= 0) by[code].proposed += amount;
      if (recognized(e)) by[code].confirmed += amount;
      if (paid(e)) by[code].paid += amount;
      if (e.status === "cheque-received" || e.status === "receipt-unclassified") by[code].suspense += amount;
    });
    el("redress-report").innerHTML = Object.keys(by).sort().map(function (code) {
      var meta = codeById(code) || { label: "Unmapped code" };
      var x = by[code];
      return '<tr><td><b>' + esc(code) + '</b></td><td>' + esc(meta.label) + '</td><td class="num">' + x.count + '</td><td class="num">' + money(x.proposed) + '</td><td class="num">' + money(x.confirmed) + '</td><td class="num">' + money(x.paid) + '</td><td class="num">' + money(x.suspense) + '</td></tr>';
    }).join("") || '<tr><td colspan="7">No nominal-code entries yet.</td></tr>';
    el("redress-rules").innerHTML = rules ? rules.remedies.map(ruleMarkup).join("") : '<p class="note">Loading the legal rules catalogue…</p>';
    var imp = state.imports || {};
    el("redress-imports").textContent = [
      imp.dartboard ? "Dartboard: " + imp.dartboard.count + " rows imported; base tracker covers mailbox to 18 Oct 2026, with targeted HMLR/TNA updates through 24 Nov 2026." : "Dartboard: not yet imported.",
      imp.chestnut ? "That Old Chestnut: " + imp.chestnut.count + " findings imported." : "That Old Chestnut: not yet imported.",
      imp.currentCosts ? "Prior Counting House event list: " + imp.currentCosts.count + " lines imported." : "Prior event list: not yet imported."
    ].join(" ");
  }
  function formMarkup() {
    var codeOptions = codeList().map(function (c) { return '<option value="' + esc(c.code) + '">' + esc(c.code + " — " + c.label) + '</option>'; }).join("");
    return '<form id="redress-form" class="r-form">' +
      '<div class="r-grid">' +
      '<label>Institution / payer<input name="institution" required></label>' +
      '<label>Reference(s)<input name="reference" placeholder="FOI / EIR / SAR / complaint ref"></label>' +
      '<label>Event or claim date<input name="date" type="text" placeholder="YYYY-MM-DD or date to confirm"></label>' +
      '<label>Regime / route<select name="regime"><option>FOIA</option><option>EIR</option><option>UK GDPR subject access</option><option>DPA 2018 Part 3</option><option>Water GSS</option><option>Ombudsman</option><option>CPR 46.5 litigation costs</option><option>Other civil cause of action</option><option>Unclassified receipt</option></select></label>' +
      '<label class="r-wide">Line-item description<input name="title" required placeholder="What happened, or what payment is sought"></label>' +
      '<label>Entry status<select name="status"><option value="evidence-only">Evidence only — no monetary claim</option><option value="candidate">Candidate — not yet claimed</option><option value="requested">Requested — disputed / unpaid</option><option value="disputed">Disputed amount</option><option value="statutory-confirmed">Statutory entitlement verified</option><option value="accepted">Accepted / agreed in writing</option><option value="awarded">Awarded / ordered by court</option><option value="cheque-received">Cheque received — not cleared / classified</option><option value="paid">Paid / cleared</option><option value="declined">Declined / rejected</option></select></label>' +
      '<label>Line amount (£)<input name="amount" type="number" step="0.01" min="0" placeholder="Leave blank until supported"></label>' +
      '<label>Amount basis<select name="amountBasis"><option value="not-priced">Not priced / evidence only</option><option value="actual-expense">Actual expense / direct loss</option><option value="gss">Specific guaranteed scheme amount</option><option value="data-damage">Data-protection damage estimate</option><option value="ombudsman">Ombudsman remedy estimate</option><option value="court-order">Court order / settlement</option><option value="cpr-lip">CPR 46.5 — court-ordered LiP costs only</option><option value="unclassified-receipt">Unclassified cheque / receipt</option><option value="other">Other — explain below</option></select></label>' +
      '<label>Internal nominal code<select name="nominalCode">' + codeOptions + '</select></label>' +
      '<label>Hours spent (record only)<input name="hours" type="number" min="0" step="0.1" placeholder="No hourly amount inferred"></label>' +
      '<label>Rate (only where legally supported)<input name="hourlyRate" type="number" min="0" step="0.01" placeholder="No default rate"></label>' +
      '<label>ICO / tribunal / Ombudsman deadline (verified)<input name="regulatorDeadline" type="text" placeholder="YYYY-MM-DD or check required"></label>' +
      '<label>Judicial review deadline (verified)<input name="judicialReviewDeadline" type="text" placeholder="Promptly; outer limit date"></label>' +
      '<label>Civil limitation date (verified)<input name="limitationDate" type="text" placeholder="YYYY-MM-DD or check required"></label>' +
      '<label>Evidence URL<input name="evidenceUrl" type="url" placeholder="Link to letter / record / receipt"></label>' +
      '<label class="r-wide">Loss, damage and causation<input name="loss" placeholder="What loss or distress was caused, and how?"></label>' +
      '<label class="r-wide">Notes / legal basis / exclusions<textarea name="notes" rows="3"></textarea></label>' +
      '</div><div class="tools"><button type="submit" class="btn">Save entry</button><button type="button" class="btn" id="r-cancel">Cancel</button></div>' +
      '<p class="note">The app does not calculate £24/hour for ordinary disclosure chasing. CPR 46.5 is available only within litigation where the court orders LiP costs; see the rule catalogue.</p></form>';
  }
  function editRecord(id) {
    var isNew = id === "__new__";
    var x = isNew ? {
      id: "", date: dateNow(), source: "Manual local entry", status: "evidence-only",
      amount: null, amountBasis: "not-priced", nominalCode: "9900", hours: null,
      hourlyRate: null, regulatorDeadline: "", judicialReviewDeadline: "", limitationDate: "", loss: "", evidenceUrl: "", notes: ""
    } : state.entries.find(function (e) { return e.id === id; });
    if (!x) return;
    el("redress-editor").innerHTML = formMarkup();
    el("redress-editor").hidden = false;
    var f = el("redress-form");
    ["institution", "reference", "date", "regime", "title", "status", "amount", "amountBasis", "nominalCode", "hours", "hourlyRate", "regulatorDeadline", "judicialReviewDeadline", "limitationDate", "evidenceUrl", "loss", "notes"].forEach(function (key) {
      if (f.elements[key]) f.elements[key].value = x[key] == null ? "" : x[key];
    });
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var fd = new FormData(f), updated = Object.assign({}, x);
      fd.forEach(function (v, k) { updated[k] = String(v).trim(); });
      updated.amount = parseMoney(updated.amount);
      updated.hours = updated.hours === "" ? null : Number(updated.hours);
      updated.hourlyRate = updated.hourlyRate === "" ? null : Number(updated.hourlyRate);
      if (updated.amount > 0 && updated.nominalCode === "9900" && ["candidate", "requested", "disputed"].indexOf(updated.status) >= 0) updated.nominalCode = "9910";
      if (isNew) {
        updated.id = "local-" + Date.now() + "-" + stableId(updated.institution + "-" + updated.title);
        updated.source = "Manual local entry";
      }
      updated.updatedAt = new Date().toISOString();
      upsert(updated); saveState(); el("redress-editor").hidden = true; render(); status("Entry saved locally. No ledger posting or communication was made.");
    });
    el("r-cancel").onclick = function () { el("redress-editor").hidden = true; };
  }
  function newRecord() { editRecord("__new__"); }
  function removeEntry(id) {
    if (!window.confirm("Remove this local entry? Export a backup first if it matters.")) return;
    state.entries = state.entries.filter(function (e) { return e.id !== id; }); saveState(); render();
  }
  function downloadCsv() {
    var columns = ["id","date","institution","reference","source","regime","title","description","status","amount","amountBasis","nominalCode","hours","hourlyRate","regulatorDeadline","judicialReviewDeadline","limitationDate","loss","evidenceUrl","notes","trackerDeadline","trackerLatestReply","trackerStatus"];
    var lines = [columns.join(",")];
    state.entries.forEach(function (e) {
      lines.push(columns.map(function (c) {
        var v = e[c] == null ? "" : String(e[c]).replace(/"/g, '""');
        return '"' + v + '"';
      }).join(","));
    });
    download("counting-house-redress-register.csv", lines.join("\r\n"), "text/csv;charset=utf-8");
  }
  function downloadBeancount() {
    var s = [
      "; Current-year disclosure / complaint redress memorandum.",
      "; NOT a cash ledger, receivable, debt admission, or court award.",
      "; Generated locally from this browser's register; review every line and evidence link.",
      "option \"title\" \"Current-year disclosure redress — memorandum only\"",
      "option \"operating_currency\" \"GBP\"",
      "2025-01-01 open Memo:Claims:Proposed GBP",
      "2025-01-01 open Memo:Claims:Confirmed GBP",
      "2025-01-01 open Memo:Receipts:Unclassified GBP",
      "2025-01-01 open Memo:Offset GBP",
      ""
    ];
    state.entries.forEach(function (e) {
      if (!Number.isFinite(Number(e.amount)) || Number(e.amount) === 0) return;
      var date = /^\d{4}-\d{2}-\d{2}$/.test(e.date || "") ? e.date : "";
      var account = recognized(e) ? "Memo:Claims:Confirmed" :
        (e.status === "cheque-received" || e.status === "receipt-unclassified") ? "Memo:Receipts:Unclassified" : "Memo:Claims:Proposed";
      if (!date) { s.push("; SKIPPED — unresolved event date: " + String(e.institution || "Unknown") + " / " + String(e.title || "Redress item") + ". Enter a verified date before ledger export."); s.push(""); return; }
      var value = Math.abs(Number(e.amount)).toFixed(2);
      s.push(date + ' * "' + String(e.institution || "Unknown").replace(/"/g, '\\"') + '" "' + String(e.title || "Redress item").replace(/"/g, '\\"') + '"');
      s.push('  nominal_code: "' + String(e.nominalCode || "9910") + '"');
      s.push('  status: "' + String(e.status || "candidate").replace(/"/g, '\\"') + '"');
      s.push('  basis: "' + String(e.amountBasis || "").replace(/"/g, '\\"') + '"');
      if (e.evidenceUrl) s.push('  evidence: "' + String(e.evidenceUrl).replace(/"/g, '\\"') + '"');
      s.push("  " + account + "  " + value + " GBP");
      s.push("  Memo:Offset  -" + value + " GBP");
      s.push("");
    });
    download("current-disclosure-redress-memo.beancount", s.join("\n"), "text/plain;charset=utf-8");
  }
  function documentDraft() {
    var chosen = Array.prototype.slice.call(document.querySelectorAll(".r-pick:checked")).map(function (x) { return state.entries.find(function (e) { return e.id === x.value; }); }).filter(Boolean);
    if (!chosen.length) { status("Select at least one entry first."); return; }
    var recipient = el("redress-recipient").value.trim();
    var mode = el("redress-document-type").value;
    if (!recipient) { status("Enter the recipient institution before generating a document."); return; }
    if (chosen.some(function (e) { return e.institution !== recipient; })) { status("Select entries for one institution only, or change the recipient so every selected line belongs to it."); return; }
    var established = chosen.every(function (e) {
      return ["accepted", "awarded", "statutory-confirmed"].indexOf(e.status) >= 0 && Number(e.amount) > 0 && e.evidenceUrl;
    });
    if (mode === "established" && !established) {
      status("Payment demand is locked: every selected line must have an established entitlement (accepted, awarded or statutory-confirmed), a positive amount and supporting evidence. Use the proposed schedule instead.");
      return;
    }
    var total = chosen.reduce(function (sum, e) { return sum + (Number(e.amount) || 0); }, 0);
    var title = mode === "established" ? "Payment request — established amounts" : "Proposed redress schedule — not an admitted debt";
    var bodyRows = chosen.map(function (e) {
      return "<tr><td>" + esc(e.date || "Date to confirm") + "</td><td>" + esc(e.reference || "") + "</td><td>" + esc(e.title) + "<br><small>" + esc(e.description || e.notes || "") + "</small></td><td>" + esc(e.nominalCode || "9900") + "</td><td>" + esc(e.status) + "</td><td>" + money(e.amount) + "</td></tr>";
    }).join("");
    var legal = mode === "established"
      ? "The items below are included because the register records an established entitlement and supporting evidence. Please make payment by the date agreed or required by the applicable scheme/order. If you dispute any item, identify the precise basis and supporting record."
      : "This is a proposal for resolution, not an invoice, admission of liability, statutory penalty or assertion that a debt has been established. Please identify the institution's factual and legal position on each item, provide the applicable policy or procedure, and state what remedy (if any) it is prepared to offer. No amount is calculated merely from waiting time or time spent pursuing disclosure.";
    var w = window.open("", "_blank");
    if (!w) { status("The browser blocked the print window. Allow pop-ups for this site and try again."); return; }
    w.document.open();
    w.document.write("<!doctype html><html><head><meta charset='utf-8'><title>" + esc(title) + "</title><style>body{font:14px/1.5 system-ui,Arial,sans-serif;max-width:900px;margin:32px auto;padding:0 20px;color:#18202a}h1{font-size:22px}table{width:100%;border-collapse:collapse;margin:22px 0}th,td{border:1px solid #bbb;padding:8px;text-align:left;vertical-align:top}th{background:#eee}.total{text-align:right;font-size:18px;font-weight:bold}.notice{border:1px solid #999;padding:12px;background:#f7f7f7}.small{color:#555;font-size:12px}@media print{button{display:none}}</style></head><body>");
    w.document.write("<h1>" + esc(title) + "</h1><p><b>To:</b> " + esc(recipient) + "</p><p><b>Prepared:</b> " + dateNow() + "</p><div class='notice'>" + esc(legal) + "</div>");
    w.document.write("<table><thead><tr><th>Date</th><th>Reference</th><th>Item / description</th><th>Nominal code</th><th>Status</th><th>Amount</th></tr></thead><tbody>" + bodyRows + "</tbody></table>");
    w.document.write("<p class='total'>Total recorded: " + money(total) + "</p><p class='small'>Prepared from a local working register. Review evidence, limitation and the applicable legal route before sending. This document has not been sent. It is not a tax invoice. Nominal codes are internal accounting labels, not statutory tariffs.</p><p><button onclick='window.print()'>Print / Save as PDF</button></p></body></html>");
    w.document.close();
  }

  function init() {
    var root = el("redress-workbench");
    if (!root) return;
    readState();
    root.innerHTML =
      '<div class="warn"><b>Private working register:</b> claim/event drafts are stored only in this browser on this device. They are not encrypted, synced, sent to an institution or written into the public cash ledger. Export a JSON backup. Imported tracker events are evidence leads, not findings of breach or liability.</div>' +
      '<div class="grid" id="redress-cards"></div>' +
      '<div class="tools"><button class="btn" id="redress-load">Import latest 2026 source registers</button><label class="btn" for="redress-file">Upload Dartboard CSV / Chestnut JSON</label><input id="redress-file" type="file" accept=".csv,.json,application/json,text/csv" style="max-width:260px"><button class="btn" id="redress-export-json">Backup JSON</button><button class="btn" id="redress-export-csv">Export register CSV</button><button class="btn" id="redress-export-bean">Export memorandum Beancount</button></div>' +
      '<p class="note" id="redress-status" role="status" aria-live="polite"></p><p class="note" id="redress-imports"></p>' +
      '<h2>Legal remedy inventory and hardwired controls</h2><p class="note">Each route below has its own legal test, evidence requirements and time controls. There is deliberately no blanket per-hour charge or universal institutional penalty.</p><div id="redress-rules"></div>' +
      '<p class="note">Existing supplier search and copy prices stay in the separate Quotes, not paid inventory. For example, Glamorgan Archives quoted £50/hour plus VAT on 6 Nov 2026 for staff searches (estimated 1–3 hours per reference) with a digitised image of items found; its reply also points to free searchroom viewing. That is a supplier price, not a compensation rate for your own time.</p>' +
      '<h2>2026 conduct / disclosure register</h2><div class="tools"><input id="redress-search" type="search" placeholder="Search institution, reference or finding"><select id="redress-code-filter"><option value="">All nominal codes</option>' + codeList().map(function (c) { return '<option value="' + esc(c.code) + '">' + esc(c.code + " — " + c.label) + '</option>'; }).join("") + '</select><button class="btn" id="redress-new">Add event / claim line</button></div>' +
      '<p class="note">Select entries for one institution to prepare a draft schedule. A formal payment request is enabled only for lines marked accepted, awarded or statutory-confirmed, with a value and supporting evidence.</p>' +
      '<div id="redress-editor" hidden></div>' +
      '<div class="tools"><input id="redress-recipient" type="text" placeholder="Recipient institution for selected entries"><select id="redress-document-type"><option value="proposal">Proposed redress schedule (not a debt)</option><option value="established">Payment demand — established entitlement only</option></select><button class="btn" id="redress-generate">Prepare draft document</button></div>' +
      '<div style="overflow-x:auto"><table><thead><tr><th>Select</th><th>Date</th><th>Institution / reference</th><th>Event / evidence source</th><th>Deadline / limitation</th><th>Status</th><th class="num">Amount</th><th>Code</th><th>Actions</th></tr></thead><tbody id="redress-rows"></tbody></table></div>' +
      '<h2>Nominal-code report</h2><p class="note">The report separates proposed/disputed values from agreed/awarded and actually paid amounts. Any unclassified receipt stays in suspense until its remittance reason, entitlement and clearance are checked. Candidate amounts and conduct events are not posted as cash, income or receivables.</p>' +
      '<div style="overflow-x:auto"><table><thead><tr><th>Nominal code</th><th>Category</th><th class="num">Entries</th><th class="num">Proposed / disputed</th><th class="num">Agreed / awarded</th><th class="num">Paid / cleared</th><th class="num">Unclassified receipt</th></tr></thead><tbody id="redress-report"></tbody></table></div>' +
      '<h2>Accounting rules</h2><ul class="note"><li>Nominal codes are this app’s configurable internal chart, not a prescribed UK-wide numbering scheme. The linked Beancount account is a mapping only.</li><li>9900 is evidence-only; 9910 is proposed/disputed memorandum value. Neither is posted to the cash ledger or a debtor balance.</li><li>Only agreed/awarded/statutorily confirmed items are shown as established in this local report; cash is shown only when marked paid/cleared.</li><li>Actual disclosure/search fees stay in the existing paid-cost ledger and quotes stay in the existing unpaid quote register. Do not count the same expense twice.</li><li>The current-year workbench is separate from the held historical 1987/1989 redress memorandum and does not change its reopening gate.</li></ul>';
    var style = document.createElement("style");
    style.textContent = "#redress-workbench .r-rule{background:#fff;border:1px solid var(--line);border-radius:8px;padding:10px 12px;margin:8px 0}#redress-workbench .r-rule summary{cursor:pointer}#redress-workbench .r-money{display:block;color:var(--mut);font-size:13px;font-weight:400;margin:4px 0}#redress-workbench .r-sources{font-size:12px}#redress-workbench .r-form{background:#fff;border:1px solid var(--line);padding:12px;border-radius:10px;margin:10px 0}#redress-workbench .r-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}#redress-workbench .r-grid label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:600}#redress-workbench .r-grid input,#redress-workbench .r-grid select,#redress-workbench .r-grid textarea{width:100%;padding:9px;border:1px solid var(--line);border-radius:7px;background:#fff;font:14px system-ui;color:var(--ink)}#redress-workbench .r-wide{grid-column:1/-1}#redress-workbench .r-pick{width:18px;height:18px}@media(max-width:620px){#redress-workbench .r-grid{grid-template-columns:1fr}#redress-workbench .r-wide{grid-column:auto}}";
    document.head.appendChild(style);

    el("redress-load").onclick = loadLatest;
    el("redress-file").onchange = function (ev) { if (ev.target.files && ev.target.files[0]) importFile(ev.target.files[0]); ev.target.value = ""; };
    el("redress-export-json").onclick = function () { download("counting-house-redress-backup.json", JSON.stringify(state, null, 2), "application/json;charset=utf-8"); };
    el("redress-export-csv").onclick = downloadCsv;
    el("redress-export-bean").onclick = downloadBeancount;
    el("redress-new").onclick = newRecord;
    el("redress-search").oninput = render;
    el("redress-code-filter").onchange = render;
    el("redress-generate").onclick = documentDraft;
    el("redress-rows").addEventListener("click", function (ev) {
      var edit = ev.target.closest(".r-edit"), del = ev.target.closest(".r-delete");
      if (edit) editRecord(edit.dataset.id);
      if (del) removeEntry(del.dataset.id);
    });
    fetch(RULE_URL, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error("rules not available"); return r.json(); }).then(function (data) { rules = data; render(); }).catch(function () { status("The rules catalogue could not be loaded. Check that remedy-rules.json is deployed with the page."); });
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();