(function(){
  "use strict";
  var dialog=document.getElementById("docs-dialog");
  var numberFormat=new Intl.NumberFormat("en-GB");
  var palette=["c0","c1","c2","c3","c4","c5","c6","c7"];
  var current=null;

  function esc(value){
    return String(value==null?"":value).replace(/[&<>"']/g,function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function fmt(n){return numberFormat.format(Number(n)||0);}
  function safeHref(value){
    var s=String(value||"");
    return /^\/(?!\/)[A-Za-z0-9._~!$&'()*+,;=:@%/?#%-]*$/.test(s)?s:"";
  }
  function getEnglish(value){
    if(value&&typeof value==="object") return value.en||value.cy||value.es||Object.values(value)[0]||"";
    return String(value||"");
  }
  function codeOf(language){
    return typeof language==="string"?language:String(language&&language.code||"");
  }
  function stamp(value){
    if(!value)return "—";
    var d=new Date(value);
    if(!Number.isFinite(d.getTime()))return String(value);
    return d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).toUpperCase()
      +" "+d.toISOString().slice(11,16)+"Z";
  }
  function countBy(items,getter){
    var out=Object.create(null);
    items.forEach(function(item){
      var key=String(getter(item)||"unknown");
      out[key]=(out[key]||0)+1;
    });
    return out;
  }
  function documents(){return current&&Array.isArray(current.docs.documents)?current.docs.documents:[];}
  function collections(){return current&&Array.isArray(current.docs.collections)?current.docs.collections:[];}
  function centralItems(){
    var items=current&&current.central&&current.central.items;
    return items&&typeof items==="object"?Object.values(items):[];
  }
  function missingIds(){
    var ids=current&&current.central&&Array.isArray(current.central.not_in_central)?current.central.not_in_central:[];
    return ids.slice().sort();
  }
  function collectionName(id){
    var c=collections().find(function(item){return item.id===id;});
    return c?getEnglish(c.title)||id:id;
  }
  function languageCounts(){
    var counts=Object.create(null);
    documents().forEach(function(d){
      (d.languages||[]).forEach(function(language){
        var code=codeOf(language);
        if(code)counts[code]=(counts[code]||0)+1;
      });
    });
    return counts;
  }
  function archiveRows(){
    var rows=[];
    documents().forEach(function(d){
      (d.archive||[]).forEach(function(a){
        rows.push({doc:d,archive:a,year:String(a.date||"").slice(0,4)});
      });
    });
    return rows;
  }
  function docRow(d){
    var langs=(d.languages||[]).map(function(l){return codeOf(l);}).filter(Boolean);
    var pdfs=(d.pdf_languages||[]).slice();
    var parts=[collectionName(d.collection),d.status||"STATUS —",d.updated?"UPDATED "+d.updated:"",langs.length?"LANG "+langs.join(", "):"",pdfs.length?"PDF "+pdfs.join(", "):""].filter(Boolean);
    var firstLanguage=(d.languages||[])[0];
    return {
      primary:String(d.id||"")+" · "+String(d.title||"Untitled document"),
      secondary:parts.join("  ·  "),
      value:d.version?"v"+d.version:"",
      href:firstLanguage?safeHref(firstLanguage.html):""
    };
  }
  function sortByDate(rows){
    return rows.slice().sort(function(a,b){
      var left=a.doc||a,right=b.doc||b;
      return String((right&&right.updated)||(right&&right.date)||"").localeCompare(String((left&&left.updated)||(left&&left.date)||""));
    });
  }
  function detailRow(row){
    var primary=esc(row.primary||"");
    if(row.href){
      var href=safeHref(row.href);
      if(href)primary='<a href="'+esc(href)+'">'+primary+'</a>';
    }
    return '<div class="dash-detail-row"><div class="dash-detail-row-main">'+
      '<div class="dash-detail-primary">'+primary+'</div>'+
      (row.secondary?'<div class="dash-detail-secondary">'+esc(row.secondary)+'</div>':"")+
      '</div>'+(row.value!==undefined&&row.value!==""?'<div class="dash-detail-value">'+esc(row.value)+'</div>':"")+
      '</div>';
  }
  function showDetail(title,stat,note,rows){
    var heading=document.getElementById("docs-detail-title");
    var value=document.getElementById("docs-detail-stat");
    var desc=document.getElementById("docs-detail-note");
    var count=document.getElementById("docs-detail-count");
    var list=document.getElementById("docs-detail-list");
    rows=Array.isArray(rows)?rows:[];
    heading.textContent=title;
    value.textContent=String(stat);
    desc.textContent=note||"";
    count.textContent=fmt(rows.length)+" ITEMS";
    list.innerHTML=rows.length?rows.map(detailRow).join(""):'<div class="dash-detail-empty">No matching metadata records.</div>';
    if(dialog&&typeof dialog.showModal==="function"){if(!dialog.open)dialog.showModal();}
    else if(dialog)dialog.setAttribute("open","");
  }
  function gauge(label,value,ratio,key){
    var progress=Number.isFinite(ratio);
    var style=progress?" style=\"--dash-ratio:"+Math.max(0,Math.min(1,ratio))*100+"%\"":"";
    var display=typeof value==="number"?fmt(value):String(value);
    return '<button class="dash-gauge" type="button" data-gauge="'+esc(key)+'" aria-label="'+esc(label+" "+display+"; show details")+'">'+
      '<span class="gauge-dial '+(progress?"":"neutral")+'"'+style+'><span class="gauge-number">'+esc(display)+'</span></span>'+
      '<span class="gauge-label">'+esc(label)+'</span></button>';
  }
  function renderGauges(data){
    var docs=data.docs,central=data.central||{},list=docs.documents||[],colls=docs.collections||[];
    var centralAvailable=!!(central&&central.items&&typeof central.items==="object");
    var missingAvailable=centralAvailable&&Array.isArray(central.not_in_central);
    var items=centralAvailable?Object.values(central.items):[];
    var missing=missingAvailable?central.not_in_central.length:null;
    var totalRefs=missingAvailable?items.length+missing:0,coverage=totalRefs?items.length/totalRefs:NaN;
    var languages=languageCounts(),archives=archiveRows().length,pdfs=0;
    list.forEach(function(d){pdfs+=(d.pdf_languages||[]).length;});
    var labels=[
      ["DOCUMENTS",list.length,NaN,"documents"],
      ["COLLECTIONS",colls.length,NaN,"collections"],
      ["LANGUAGES",Object.keys(languages).length,NaN,"languages"],
      ["ARCHIVES",archives,NaN,"archives"],
      ["LINKED REFS",centralAvailable?items.length:"—",coverage,"linked"],
      ["UNMATCHED",missingAvailable?missing:"—",missingAvailable&&totalRefs?missing/totalRefs:NaN,"unmatched"],
      ["CURRENT PDFs",pdfs,NaN,"pdfs"]
    ];
    document.getElementById("docs-gauges").innerHTML=labels.map(function(x){return gauge(x[0],x[1],x[2],x[3]);}).join("");
  }
  function renderBars(id,type,entries){
    var host=document.getElementById(id);
    if(!entries.length){host.innerHTML='<div class="dash-detail-empty">No records</div>';return;}
    entries=entries.slice().sort(function(a,b){return b.value-a.value||a.label.localeCompare(b.label);});
    var max=Math.max.apply(null,entries.map(function(x){return x.value;}).concat([1]));
    host.innerHTML=entries.map(function(item,i){
      var width=Math.max(0,item.value/max*100);
      return '<button class="dash-bar" type="button" data-detail-type="'+esc(type)+'" data-detail-key="'+esc(item.key)+'" aria-label="'+esc(item.label+" "+item.value+"; show details")+'">'+
        '<span class="dash-bar-label">'+esc(item.label)+'</span>'+
        '<span class="dash-track"><span class="dash-fill '+palette[i%palette.length]+'" style="width:'+width.toFixed(2)+'%"></span></span>'+
        '<span class="dash-bar-value">'+fmt(item.value)+'</span></button>';
    }).join("");
  }
  function renderScatter(docs,colls){
    var host=document.getElementById("docs-scatter");
    var names=colls.map(function(c){return {id:c.id,label:getEnglish(c.title)};});
    var index=Object.create(null);
    names.forEach(function(c,i){index[c.id]=i;});
    var points=docs.map(function(d,i){
      var raw=String(d.updated||d.date||"");
      var time=Date.parse(raw.length===10?raw+"T00:00:00Z":raw);
      var row=index[d.collection];
      if(!Number.isFinite(time)||row===undefined)return null;
      return {d:d,time:time,row:row,jitter:(i%7)-3};
    }).filter(Boolean);
    if(!points.length){host.innerHTML='<div class="dash-detail-empty">No dated records to plot</div>';return;}
    var min=Math.min.apply(null,points.map(function(p){return p.time;}));
    var max=Math.max.apply(null,points.map(function(p){return p.time;}));
    if(min===max)max=min+86400000;
    var W=1000,H=Math.max(220,Math.min(470,112+names.length*34));
    var L=174,R=24,T=18,B=38,plotW=W-L-R,plotH=H-T-B,band=plotH/Math.max(1,names.length);
    var parts=['<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Document updates by collection">'];
    names.forEach(function(c,i){
      var y=T+band*(i+.5);
      parts.push('<line class="dash-gridline" x1="'+L+'" y1="'+y.toFixed(1)+'" x2="'+(W-R)+'" y2="'+y.toFixed(1)+'"></line>');
      parts.push('<text class="dash-axis" x="'+(L-12)+'" y="'+(y+3.5).toFixed(1)+'" text-anchor="end">'+esc(c.label.toUpperCase())+'</text>');
    });
    var startYear=new Date(min).getUTCFullYear(),endYear=new Date(max).getUTCFullYear();
    var years=[],yearStep=Math.max(1,Math.ceil((endYear-startYear)/6));
    for(var y=startYear;y<=endYear;y+=yearStep)years.push(y);
    if(years[years.length-1]!==endYear)years.push(endYear);
    years.forEach(function(year){
      var date=Date.UTC(year,0,1),x=L+(date-min)/(max-min)*plotW;
      if(x<L||x>W-R)return;
      parts.push('<line class="dash-gridline" x1="'+x.toFixed(1)+'" y1="'+T+'" x2="'+x.toFixed(1)+'" y2="'+(H-B)+'"></line>');
      parts.push('<text class="dash-tick" x="'+x.toFixed(1)+'" y="'+(H-14)+'" text-anchor="middle">'+year+'</text>');
    });
    points.forEach(function(p){
      var x=L+(p.time-min)/(max-min)*plotW;
      var y=T+band*(p.row+.5)+p.jitter;
      var label=String(p.d.id||"")+" · "+String(p.d.updated||p.d.date||"")+" · "+String(p.d.status||"");
      parts.push('<circle class="dash-dot '+palette[p.row%palette.length]+'" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="3.3" data-doc-id="'+esc(p.d.id)+'" tabindex="0" role="button" aria-label="'+esc(label)+'"></circle>');
    });
    parts.push("</svg>");
    host.innerHTML=parts.join("");
  }
  function openDocument(d){
    if(!d)return;
    var langs=d.languages||[],pdfs=d.pdf_languages||[],archives=d.archive||[];
    var rows=[
      {primary:"COLLECTION",secondary:collectionName(d.collection),value:d.collection},
      {primary:"STATUS",value:d.status||"—"},
      {primary:"VERSION",value:d.version||"—"},
      {primary:"DOCUMENT DATE",value:d.date||"—"},
      {primary:"LAST UPDATED",value:d.updated||"—"},
      {primary:"SOURCE LANGUAGE",value:d.source_language||"—"},
      {primary:"LANGUAGE BUILDS",secondary:langs.map(function(l){return codeOf(l);}).join(", ")||"—",value:langs.length},
      {primary:"CURRENT PDF BUILDS",secondary:pdfs.join(", ")||"—",value:pdfs.length},
      {primary:"ARCHIVED EDITIONS",value:archives.length}
    ];
    langs.forEach(function(l){
      rows.push({primary:"HTML · "+String(codeOf(l)).toUpperCase()+" · "+String(l.name||""),secondary:"LATEST LANGUAGE BUILD",value:"OPEN",href:l.html});
    });
    archives.forEach(function(a){
      rows.push({primary:"ARCHIVE · v"+String(a.version||"—"),secondary:"PDF LANGUAGES · "+((a.languages||[]).join(", ")||"—"),value:a.date||"—"});
    });
    showDetail("DOCUMENT DETAILS",String(d.id||"—"),"Record metadata · "+String(d.title||"Untitled document"),rows);
  }
  function openGauge(key){
    var docs=documents(),central=centralItems(),missing=missingIds(),langs=languageCounts(),archives=archiveRows(),pdfs=0;
    docs.forEach(function(d){pdfs+=(d.pdf_languages||[]).length;});
    if(key==="documents"){
      showDetail("DOCUMENTS",fmt(docs.length),"All indexed document records, with collection, status, version and language metadata.",sortByDate(docs).map(docRow));
    }else if(key==="collections"){
      var counts=countBy(docs,function(d){return d.collection;});
      var rows=collections().map(function(c){return {primary:getEnglish(c.title)||c.id,secondary:"COLLECTION ID · "+c.id,value:fmt(counts[c.id]||0)+" DOCS"};});
      showDetail("COLLECTIONS",fmt(rows.length),"Collection names and the number of indexed documents in each.",rows);
    }else if(key==="languages"){
      var rows=Object.keys(langs).sort().map(function(code){return {primary:code.toUpperCase(),secondary:"DOCUMENT LANGUAGE BUILDS",value:fmt(langs[code])};});
      showDetail("LANGUAGES",fmt(rows.length),"Distinct language codes present in the document index; each count is a document-language build.",rows);
    }else if(key==="archives"){
      var rows=archives.map(function(item){return {primary:item.doc.id+" · "+item.doc.title,secondary:"ARCHIVE v"+String(item.archive.version||"—")+" · PDF LANGUAGES "+((item.archive.languages||[]).join(", ")||"—"),value:item.archive.date||"—"};});
      showDetail("ARCHIVED EDITIONS",fmt(archives.length),"Archived edition metadata grouped by source document; dates, versions and available PDF languages.",rows);
    }else if(key==="linked"){
      if(!current.central||!current.central.items||typeof current.central.items!=="object"){
        showDetail("LINKED CATALOGUE REFERENCES","—","The central catalogue cache is unavailable; no zero count is inferred.",[]);
        return;
      }
      var rows=central.slice().sort(function(a,b){return String(a.id).localeCompare(String(b.id));}).map(function(item){return {primary:item.id+" · "+item.title,secondary:[item.kind,item.status,item.date_display].filter(Boolean).join("  ·  "),value:item.page?"PAGE":"—"};});
      showDetail("LINKED CATALOGUE REFERENCES",fmt(central.length),"Matched catalogue records, including ID, title, record kind, status and date.",rows);
    }else if(key==="unmatched"){
      if(!current.central||!Array.isArray(current.central.not_in_central)){
        showDetail("UNMATCHED REFERENCES","—","The central catalogue cache is unavailable; no zero count is inferred.",[]);
        return;
      }
      var rows=missing.map(function(id){return {primary:id,secondary:"REFERENCED BY DOCS · NOT FOUND IN THE CENTRAL CACHE",value:"UNMATCHED"};});
      showDetail("UNMATCHED REFERENCES",fmt(missing.length),"Referenced catalogue IDs for which this Docs cache has no matching central record.",rows);
    }else if(key==="pdfs"){
      var rows=docs.filter(function(d){return (d.pdf_languages||[]).length;}).map(function(d){
        return {primary:d.id+" · "+d.title,secondary:"CURRENT PDF LANGUAGES · "+d.pdf_languages.join(", "),value:d.pdf_languages.length+" BUILDS",href:(d.languages||[])[0]&&(d.languages||[])[0].html};
      });
      showDetail("CURRENT PDF BUILDS",fmt(pdfs),"Documents with current PDF editions, grouped by document and language.",rows);
    }
  }
  function openBar(type,key){
    var docs=documents(),central=centralItems(),allArchives=archiveRows(),selected=[],title="",rows=[],stat=0,note="";
    if(type==="collection"){
      selected=docs.filter(function(d){return d.collection===key;});
      title="COLLECTION · "+collectionName(key);stat=selected.length;note="Documents indexed in this collection.";rows=sortByDate(selected).map(docRow);
    }else if(type==="status"){
      selected=docs.filter(function(d){return String(d.status||"unknown")===key;});
      title="STATUS · "+key.toUpperCase();stat=selected.length;note="Documents carrying this status in the current index.";rows=sortByDate(selected).map(docRow);
    }else if(type==="language"){
      selected=docs.filter(function(d){return (d.languages||[]).some(function(l){return codeOf(l)===key;});});
      title="LANGUAGE · "+key.toUpperCase();stat=selected.length;note="Documents with a generated language build for this code.";rows=sortByDate(selected).map(docRow);
    }else if(type==="kind"){
      selected=central.filter(function(item){return String(item.kind||"unknown")===key;});
      title="CATALOGUE KIND · "+key.toUpperCase();stat=selected.length;note="Matched central-catalogue records of this kind.";
      rows=selected.slice().sort(function(a,b){return String(a.id).localeCompare(String(b.id));}).map(function(item){return {primary:item.id+" · "+item.title,secondary:[item.status,item.date_display].filter(Boolean).join("  ·  "),value:item.page?"PAGE":""};});
    }else if(type==="archive-year"){
      selected=allArchives.filter(function(item){return item.year===key;});
      title="ARCHIVE YEAR · "+key;stat=selected.length;note="Archived editions dated in this year.";
      rows=selected.map(function(item){return {primary:item.doc.id+" · "+item.doc.title,secondary:"ARCHIVE v"+String(item.archive.version||"—")+" · PDF LANGUAGES "+((item.archive.languages||[]).join(", ")||"—"),value:item.archive.date||"—"};});
    }
    showDetail(title||"METADATA DETAILS",fmt(stat),note,rows);
  }
  function render(data){
    current=data;
    var docs=data.docs,central=data.central||{};
    var list=Array.isArray(docs.documents)?docs.documents:[];
    var colls=Array.isArray(docs.collections)?docs.collections:[];
    var names=Object.create(null);
    colls.forEach(function(c){names[c.id]=getEnglish(c.title)||c.id;});
    renderGauges(data);
    var collectionCounts=countBy(list,function(d){return d.collection;});
    renderBars("docs-by-collection","collection",Object.keys(collectionCounts).map(function(k){return {key:k,label:names[k]||k,value:collectionCounts[k]};}));
    var statuses=countBy(list,function(d){return d.status;});
    renderBars("docs-by-status","status",Object.keys(statuses).map(function(k){return {key:k,label:k,value:statuses[k]};}));
    var languages=languageCounts();
    renderBars("docs-by-language","language",Object.keys(languages).map(function(k){return {key:k,label:k,value:languages[k]};}));
    if(central.items&&typeof central.items==="object"){
      var centralList=Object.values(central.items);
      var kinds=countBy(centralList,function(x){return x.kind;});
      renderBars("central-by-kind","kind",Object.keys(kinds).map(function(k){return {key:k,label:k,value:kinds[k]};}));
    }else{
      document.getElementById("central-by-kind").innerHTML='<div class="dash-detail-empty">CENTRAL CACHE UNAVAILABLE</div>';
    }
    var years=Object.create(null);
    archiveRows().forEach(function(item){if(item.year)years[item.year]=(years[item.year]||0)+1;});
    renderBars("archive-by-year","archive-year",Object.keys(years).map(function(k){return {key:k,label:k,value:years[k]};}));
    renderScatter(list,colls);
    document.getElementById("dash-build").textContent="INDEX "+stamp(docs.generated);
    document.getElementById("dash-central").textContent=central.synced_utc?"CENTRAL "+stamp(central.synced_utc):"CENTRAL —";
    document.getElementById("dash-state").textContent=data.central?"DATA":"INDEX";
  }
  document.addEventListener("click",function(event){
    var target=event.target&&event.target.closest?event.target.closest("[data-gauge],[data-detail-type],[data-doc-id]"):null;
    if(!target)return;
    if(target.hasAttribute("data-gauge"))openGauge(target.getAttribute("data-gauge"));
    else if(target.hasAttribute("data-detail-type"))openBar(target.getAttribute("data-detail-type"),target.getAttribute("data-detail-key"));
    else if(target.hasAttribute("data-doc-id")){
      var d=documents().find(function(item){return String(item.id)===target.getAttribute("data-doc-id");});
      openDocument(d);
    }
  });
  document.addEventListener("keydown",function(event){
    if((event.key==="Enter"||event.key===" ")&&event.target&&event.target.matches&&event.target.matches('circle[data-doc-id]')){
      event.preventDefault();
      var d=documents().find(function(item){return String(item.id)===event.target.getAttribute("data-doc-id");});
      openDocument(d);
    }
  });
  var close=document.getElementById("docs-close");
  if(close)close.addEventListener("click",function(){if(dialog&&typeof dialog.close==="function")dialog.close();else if(dialog)dialog.removeAttribute("open");});
  if(dialog)dialog.addEventListener("click",function(event){if(event.target===dialog&&typeof dialog.close==="function")dialog.close();});

  var root=new URL("./",document.baseURI);
  var indexUrl=new URL("docs.json",root),centralUrl=new URL("data/central.json",root);
  Promise.all([
    fetch(indexUrl,{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("index");return r.json();}),
    fetch(centralUrl,{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("central");return r.json();}).catch(function(){return null;})
  ]).then(function(values){
    var docs=values[0];
    if(!docs||!Array.isArray(docs.documents)||!Array.isArray(docs.collections))throw new Error("index");
    render({docs:docs,central:values[1]});
  }).catch(function(){
    document.getElementById("dash-state").textContent="OFFLINE";
  });
})();