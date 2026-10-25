/* cat.js (one chunk file per request: Pages serves whole files) - the Cedwyn catalogue in the browser: one SQLite database read by HTTP range requests (no server),
   plus a GraphQL schema resolved against it. Images and documents come back as data: URIs (base64) on read.
   Usage: Cedwyn.db().then(db => db.query(sql, params)); Cedwyn.graphql(query, variables). - Sion's Tab agent */
(function () {
  var V = '/_cedwyn/vendor/', dbp = null, schema = null, gqlp = null;
  function load(src) { return new Promise(function (ok, bad) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = bad; document.head.appendChild(s); }); }
  function db() {
    if (dbp) return dbp;
    dbp = Promise.all([fetch('/db/config.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }), window.createDbWorker ? 0 : load(V + 'sqlite-httpvfs.js')])
      .then(function (a) { return window.createDbWorker([{ from: 'jsonconfig', configUrl: '/db/config.json' }], V + 'sqlite.worker.js?v=2', V + 'sql-wasm.wasm', 64 * 1024 * 1024); })
      .then(function (w) {
        return { worker: w, query: function (sql, params) { return w.db.query(sql, params || []); },
                 bytesRead: function () { return w.worker.bytesRead; } };
      });
    return dbp;
  }
  function b64(u8) { var s = '', CH = 0x8000; for (var i = 0; i < u8.length; i += CH) s += String.fromCharCode.apply(null, u8.subarray(i, i + CH)); return btoa(s); }
  function q1(sql, p) { return db().then(function (d) { return d.query(sql, p); }).then(function (r) { return r[0] || null; }); }
  function qa(sql, p) { return db().then(function (d) { return d.query(sql, p); }); }
  function Artifact(r) {
    if (!r) return null;
    var a = { id: r.id, sha: r.sha, kind: r.kind, mime: r.mime, bytes: r.bytes, title: r.title, yearMin: r.year_min, yearMax: r.year_max, hasBlob: !!r.has_blob };
    a.locations = function () { return qa("SELECT theme, path, url FROM locations WHERE aid=? AND theme<>'_blob' ORDER BY theme", [r.id]).then(function (rs) { return rs.map(function (x) { return { theme: x.theme, path: x.path, url: x.url }; }); }); };
    a.url = function () { return q1("SELECT url FROM locations WHERE aid=? ORDER BY (theme='_blob') DESC LIMIT 1", [r.id]).then(function (x) { return x && x.url; }); };
    a.dataUri = function () { return q1('SELECT data FROM blobs WHERE sha=?', [r.sha]).then(function (x) { return x && x.data ? 'data:' + r.mime + ';base64,' + b64(x.data) : null; }); };
    a.text = function () { return q1('SELECT body FROM fts WHERE aid=? LIMIT 1', [r.id]).then(function (x) { return x && x.body; }); };
    a.edges = function (args) { var rel = args && args.rel; return qa('SELECT rel, dst FROM edges WHERE src=?' + (rel ? ' AND rel=?' : '') + ' LIMIT 500', rel ? ['a:' + r.id, rel] : ['a:' + r.id]).then(function (rs) { return rs.map(Edge); }); };
    a.backlinks = function () { return qa("SELECT rel, src AS dst FROM edges WHERE dst=? LIMIT 500", ['a:' + r.id]).then(function (rs) { return rs.map(Edge); }); };
    return a;
  }
  function Edge(e) { return { rel: e.rel, dst: e.dst, artifact: function () { return e.dst.indexOf('a:') === 0 ? artifact({ id: +e.dst.slice(2) }) : null; }, node: function () { return e.dst.indexOf('a:') === 0 ? null : nodeById({ id: e.dst }); } }; }
  function artifact(a) { return a.sha ? q1('SELECT * FROM artifacts WHERE sha=?', [a.sha]).then(Artifact) : q1('SELECT * FROM artifacts WHERE id=?', [a.id]).then(Artifact); }
  function nodeById(a) {
    return q1('SELECT * FROM nodes WHERE id=?', [a.id]).then(function (n) {
      if (!n) return null;
      return { id: n.id, kind: n.kind, label: n.label, artifacts: function (x) { return qa("SELECT a.* FROM edges e JOIN artifacts a ON a.id=CAST(substr(e.src,3) AS INTEGER) WHERE e.dst=? LIMIT ?", [n.id, (x && x.limit) || 50]).then(function (rs) { return rs.map(Artifact); }); } };
    });
  }
  var SDL = [
    'type Query { stats: Stats themes: [Theme] theme(id: String!): Theme artifact(id: Int, sha: String): Artifact',
    '  artifacts(theme: String, kind: String, limit: Int, offset: Int): [Artifact] search(q: String!, theme: String, limit: Int): [Hit]',
    '  sourceRecords(status: String, q: String, limit: Int): [SourceRecord] sourceRecord(id: String!): SourceRecord',
    '  interpretations(subjectId: String, status: String, limit: Int): [Interpretation]',
    '  researchLeads(status: String, priority: Int, limit: Int): [ResearchLead]',
    '  monitoredPages(limit: Int): [MonitoredPage]',
    '  node(id: String!): Node nodes(kind: String!, limit: Int): [Node] capture(url: String!): Capture }',
    'type Stats { artifacts: Int blobs: Int edges: Int nodes: Int themes: Int captures: Int sourceRecords: Int interpretations: Int researchLeads: Int monitoredPages: Int unlocatedLeads: Int }',
    'type SourceRecord { id: String independentOriginId: String recordStatus: String title: String creator: String custodian: String sourceType: String documentDate: String eventDatesJson: String description: String publicUrl: String publicArchiveUrl: String waybackCalendarUrl: String localPath: String email: String disclosureReference: String attachmentName: String completeness: String readStatus: String provenanceJson: String pinpointsJson: String limitationsJson: String supersedesJson: String payloadJson: String }',
    'type Interpretation { id: String subjectType: String subjectId: String status: String title: String text: String basisSourceIdsJson: String evidenceForJson: String evidenceAgainstOrLimitsJson: String alternativeExplanationsJson: String whatWouldConfirmJson: String whatWouldRefuteOrModifyJson: String unresolvedQuestionsJson: String confidence: String updated: String payloadJson: String }',
    'type ResearchLead { id: String title: String priority: Int dateStart: String dateEnd: String recordStatus: String notALocatedRecord: Boolean searchStatus: String searchScope: String whySought: String workingDescription: String candidateCustodiansJson: String couldConfirmJson: String couldRefuteJson: String payloadJson: String }',
    'type MonitoredPage { id: String url: String title: String sourceId: String custodian: String topic: String enabled: Boolean requiredSnapshot: Boolean relevanceStatus: String sha256: String httpStatus: Int lastChecked: String lastObservedChange: String snapshotUrl: String archiveStatus: String waybackCalendarUrl: String lastSaveAttemptAt: String lastSaveAttemptSha256: String lastCheckError: String notes: String payloadJson: String }',
    'type Theme { id: String title: String cy: String es: String live: String source: String files: Int pages: Int path: String artifacts(kind: String, limit: Int): [Artifact] }',
    'type Artifact { id: Int sha: String kind: String mime: String bytes: Int title: String yearMin: Int yearMax: Int hasBlob: Boolean url: String',
    '  locations: [Location] dataUri: String text: String edges(rel: String): [Edge] backlinks: [Edge] }',
    'type Location { theme: String path: String url: String }',
    'type Edge { rel: String dst: String artifact: Artifact node: Node }',
    'type Node { id: String kind: String label: String artifacts(limit: Int): [Artifact] }',
    'type Hit { artifact: Artifact theme: String path: String snippet: String }',
    'type Capture { key: String url: String title: String latest: String captured: String }'].join('\n');
  function Theme(t) { return t && { id: t.id, title: t.title, cy: t.cy, es: t.es, live: t.live, source: t.source, files: t.n_files, pages: t.n_pages, path: '/' + t.id + '/',
    artifacts: function (x) { var k = x && x.kind; return qa('SELECT a.* FROM locations l JOIN artifacts a ON a.id=l.aid WHERE l.theme=?' + (k ? ' AND a.kind=?' : '') + ' LIMIT ?', k ? [t.id, k, (x && x.limit) || 50] : [t.id, (x && x.limit) || 50]).then(function (rs) { return rs.map(Artifact); }); } }; }
  function SourceRecord(r) { return r && { id:r.id, independentOriginId:r.independent_origin_id, recordStatus:r.record_status, title:r.title, creator:r.creator, custodian:r.custodian, sourceType:r.source_type, documentDate:r.document_date, eventDatesJson:r.event_dates_json, description:r.description, publicUrl:r.public_url, publicArchiveUrl:r.public_archive_url, waybackCalendarUrl:r.wayback_calendar_url, localPath:r.local_path, email:r.email, disclosureReference:r.disclosure_reference, attachmentName:r.attachment_name, completeness:r.completeness, readStatus:r.read_status, provenanceJson:r.provenance_json, pinpointsJson:r.pinpoints_json, limitationsJson:r.limitations_json, supersedesJson:r.supersedes_json, payloadJson:r.payload_json }; }
  function Interpretation(r) { return r && { id:r.id, subjectType:r.subject_type, subjectId:r.subject_id, status:r.status, title:r.title, text:r.text, basisSourceIdsJson:r.basis_source_ids_json, evidenceForJson:r.evidence_for_json, evidenceAgainstOrLimitsJson:r.evidence_against_or_limits_json, alternativeExplanationsJson:r.alternative_explanations_json, whatWouldConfirmJson:r.what_would_confirm_json, whatWouldRefuteOrModifyJson:r.what_would_refute_or_modify_json, unresolvedQuestionsJson:r.unresolved_questions_json, confidence:r.confidence, updated:r.updated, payloadJson:r.payload_json }; }
  function ResearchLead(r) { return r && { id:r.id, title:r.title, priority:r.priority, dateStart:r.date_start, dateEnd:r.date_end, recordStatus:r.record_status, notALocatedRecord:!!r.not_a_located_record, searchStatus:r.search_status, searchScope:r.search_scope, whySought:r.why_sought, workingDescription:r.working_description, candidateCustodiansJson:r.candidate_custodians_json, couldConfirmJson:r.could_confirm_json, couldRefuteJson:r.could_refute_json, payloadJson:r.payload_json }; }
  function MonitoredPage(r) { return r && { id:r.id, url:r.url, title:r.title, sourceId:r.source_id, custodian:r.custodian, topic:r.topic, enabled:!!r.enabled, requiredSnapshot:!!r.required_snapshot, relevanceStatus:r.relevance_status, sha256:r.sha256, httpStatus:r.http_status, lastChecked:r.last_checked, lastObservedChange:r.last_observed_change, snapshotUrl:r.snapshot_url, archiveStatus:r.archive_status, waybackCalendarUrl:r.wayback_calendar_url, lastSaveAttemptAt:r.last_save_attempt_at, lastSaveAttemptSha256:r.last_save_attempt_sha256, lastCheckError:r.last_check_error, notes:r.notes, payloadJson:r.payload_json }; }
  function normkey(u) { try { var p = new URL(u); var h = p.hostname.replace(/^www\./, ''); return h + (p.pathname.replace(/\/+$/, '') || '/') + (p.search ? p.search : ''); } catch (e) { return u; } }
  var root = {
    stats: function () { return qa('SELECT k, v FROM meta').then(function (rs) { var o = {}; rs.forEach(function (r) { o[r.k] = +r.v; }); o.sourceRecords=o.source_records||0; o.researchLeads=o.research_leads||0; o.unlocatedLeads=o.unlocated_leads||0; return o; }); },
    themes: function () { return qa('SELECT * FROM themes').then(function (rs) { return rs.map(Theme); }); },
    theme: function (a) { return q1('SELECT * FROM themes WHERE id=?', [a.id]).then(Theme); },
    artifact: artifact,
    artifacts: function (a) { var w = [], p = []; if (a.kind) { w.push('a.kind=?'); p.push(a.kind); } if (a.theme) { w.push('a.id IN (SELECT aid FROM locations WHERE theme=?)'); p.push(a.theme); }
      p.push(a.limit || 50, a.offset || 0); return qa('SELECT a.* FROM artifacts a' + (w.length ? ' WHERE ' + w.join(' AND ') : '') + ' ORDER BY a.id LIMIT ? OFFSET ?', p).then(function (rs) { return rs.map(Artifact); }); },
    search: function (a) { var p = [a.q]; var extra = ''; if (a.theme) { extra = ' AND theme=?'; p.push(a.theme); } p.push(a.limit || 25);
      return qa("SELECT aid, theme, path, snippet(fts, 1, '[', ']', ' … ', 18) AS snip FROM fts WHERE fts MATCH ?" + extra + ' ORDER BY rank LIMIT ?', p)
        .then(function (rs) { return rs.map(function (r) { return { theme: r.theme, path: r.path, snippet: r.snip, artifact: function () { return artifact({ id: r.aid }); } }; }); }); },
    node: nodeById,
    nodes: function (a) { return qa('SELECT id FROM nodes WHERE kind=? LIMIT ?', [a.kind, a.limit || 100]).then(function (rs) { return Promise.all(rs.map(function (r) { return nodeById({ id: r.id }); })); }); },
    sourceRecord: function (a) { return q1('SELECT * FROM source_records WHERE id=?', [a.id]).then(SourceRecord); },
    sourceRecords: function (a) { var w=[],p=[]; if(a.status){w.push('record_status=?');p.push(a.status);} if(a.q){w.push('(id LIKE ? OR title LIKE ? OR description LIKE ? OR public_url LIKE ? OR independent_origin_id LIKE ?)');var q='%'+a.q+'%';p.push(q,q,q,q,q);} p.push(a.limit||50); return qa('SELECT * FROM source_records'+(w.length?' WHERE '+w.join(' AND '):'')+' ORDER BY document_date IS NULL,document_date,id LIMIT ?',p).then(function(rs){return rs.map(SourceRecord);}); },
    interpretations: function (a) { var w=[],p=[]; if(a.subjectId){w.push('subject_id=?');p.push(a.subjectId);} if(a.status){w.push('status=?');p.push(a.status);} p.push(a.limit||50); return qa('SELECT * FROM interpretations'+(w.length?' WHERE '+w.join(' AND '):'')+' ORDER BY updated DESC,id LIMIT ?',p).then(function(rs){return rs.map(Interpretation);}); },
    researchLeads: function (a) { var w=[],p=[]; if(a.status){w.push('record_status=?');p.push(a.status);} if(a.priority!==null&&a.priority!==undefined){w.push('priority=?');p.push(a.priority);} p.push(a.limit||100); return qa('SELECT * FROM research_leads'+(w.length?' WHERE '+w.join(' AND '):'')+' ORDER BY priority,id LIMIT ?',p).then(function(rs){return rs.map(ResearchLead);}); },
    monitoredPages: function (a) { return qa('SELECT * FROM monitored_pages WHERE enabled=1 ORDER BY title LIMIT ?',[(a&&a.limit)||100]).then(function(rs){return rs.map(MonitoredPage);}); },
    capture: function (a) { return q1('SELECT * FROM captures WHERE key=?', [normkey(a.url)]); }
  };
  function graphql(query, variables) {
    gqlp = gqlp || (window.GraphQL ? Promise.resolve() : load(V + 'graphql.min.js'));
    return gqlp.then(function () {
      if (!schema) schema = GraphQL.buildSchema(SDL);
      return GraphQL.graphql({ schema: schema, source: query, rootValue: root, variableValues: variables || {} });
    });
  }
  window.Cedwyn = { db: db, graphql: graphql, sdl: SDL, root: root, b64: b64, normkey: normkey };
})();
