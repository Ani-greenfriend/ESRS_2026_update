// Content and data tables ported from docs/reference/prototype-reference.html (final mockup, spec v2.3).
// Datapoint counts per standard are derived from EFRAG's 2026 Draft List of ESRS Datapoints;
// no EFRAG datapoint names or IDs are included (reuse rights).

// v2.2: the ~90% card opens full width with a company-type table and the "80% or 90%?" note; every other fold-out keeps two short bullets.
export const CHUNKS=[
 {k:"~90%",t:"Fewer companies in scope",s:"An estimate. Only groups above 1,000 employees and €450M turnover remain.",
  tbl:[["EU wave 1, already reporting","Public-interest entities over 500 employees","Over 1,000 employees and €450M"],
   ["Other large EU companies","Two of: 250 employees, €50M turnover, €25M balance sheet","Over 1,000 employees and €450M"],
   ["Listed SMEs","In scope, simpler standard","Out (voluntary standard)"],
   ["Non-EU groups","€150M EU turnover, EU entity €40M","€450M EU turnover, EU entity €200M"]],
  note:"The European Commission estimated its 2025 proposal (over 1,000 employees and either €50M turnover or €25M balance sheet) at about 80%. The final law raises the turnover test to €450M. We show about 90% as the estimate of A&O Shearman, because the Commission has not published a figure for the final text. Neither is an official count of the companies that remain.",
  d:[]},
 {k:"323",t:"Datapoints in total",s:"Down from 1,052: 292 mandatory, 0 voluntary, 31 new general ones.",d:["All voluntary datapoints are deleted.","EFRAG count: 783 \u201cshall\u201d datapoints in 2023, 292 now."]},
 {k:"Top-down",t:"A lighter materiality assessment",s:"Conclude at topic level instead of testing every IRO.",d:["ESRS 1 allows a top-down approach, alone or mixed with bottom-up.","Information that is not material is not reported, with narrow exceptions."]},
 {k:"VSME cap",t:"Protection for smaller suppliers",s:"Value chain requests are capped from FY2027.",d:["A new voluntary standard based on VSME applies from 24 Sept 2026.","Partners with up to 1,000 employees can refuse requests that go beyond it."]},
 {k:"3 routes",t:"A choice for FY2026",s:"Pre-Omnibus ESRS, with reliefs, or revised ESRS in full.",d:["Eight reliefs from ESRS 1 (paras 27, 32-33, 74-75, 90, 91, 92, 106, 110).","Say in your report which version you applied."]},
 {k:"Limited",t:"Assurance stays limited",s:"The planned move to reasonable assurance is dropped.",d:["The Commission must adopt a limited assurance standard by 1 July 2027.","Emissions: count what you control financially, or what you run day to day. Your choice."]}
];
export const REFS=[
 "Directive (EU) 2026/470 (Omnibus I), amending Accounting Directive 2013/34/EU, Articles 19a, 29a and 40a. 80%: European Commission, Omnibus package page (2025), for its proposal. 90%: A&O Shearman estimate for the final deal, not an official figure.",
 "EFRAG draft list of datapoints and explanatory note (2026), for Delegated Regulation (EU) 2026/1563.",
 "Revised ESRS 1, paragraphs 24 and 27 (Delegated Regulation (EU) 2026/1563, Annex I).",
 "Revised ESRS 1, paragraph 66; Accounting Directive, Articles 19a(3) and 29a(3); Delegated Regulation (EU) 2026/1560, Annex II.",
 "Delegated Regulation (EU) 2026/1563, Article 2 (the routes and the statement of which version you used) and Article 3 (applies from financial years starting 1 January 2027).",
 "Directive (EU) 2026/470 (Omnibus I); GHG boundary: ESRS E1, AR 19 for paragraph 30."];

export const DATES=[
 {d:"26 Feb 2026",t:"Omnibus I published",c:""},
 {d:"18 Mar 2026",t:"Omnibus I in force",c:""},
 {d:"3 Jul 2026",t:"Revised ESRS adopted",c:""},
 {d:"21 Sep 2026",t:"Published in the OJ",c:""},
 {d:"10 Nov 2026",t:"Revised ESRS in force",c:"now"},
 {d:"19 Mar 2027",t:"Transposition deadline",c:"future hot"},
 {d:"FY2027",t:"Revised ESRS mandatory",c:"future"}];


export const STAT={"ESRS 2":[127,57,27],E1:[187,84,47],E2:[44,17,5],E3:[27,8,7],E4:[54,9,5],E5:[42,15,14],S1:[127,49,48],S2:[47,12,9],S3:[45,12,8],S4:[44,9,7],G1:[39,20,18]};
export const TOT=[783,292,195];


export const TOPICS=[["E1","Climate change",1],["E2","Pollution",0],["E3","Water",0],["E4","Biodiversity",0],["E5","Resource use",1],["S1","Own workforce",1],["S2","Value chain workers",1],["S3","Communities",0],["S4","Consumers",0],["G1","Business conduct",1]];

export const G=[
 ["EU wave 1, still above both thresholds","Reported since FY2024",["rep","rep","rep","new","new"],["","","Choose route","Revised",""],
  ["Reports under the pre-Omnibus (2023) ESRS.","Reports under the pre-Omnibus (2023) ESRS.","You choose one of three FY2026 routes. See FY2026 options below.","First year under the revised ESRS, mandatory from FY2027.","Reports under the revised ESRS."]],
 ["EU wave 1, now below a threshold","e.g. 600 employees",["rep","opt","opt","out","out"],["","MS option","MS option","Out",""],
  ["Reported under the pre-Omnibus (2023) ESRS.","Member States may exempt these companies for FY2025 and FY2026. Check national law.","Member States may exempt these companies for FY2025 and FY2026. Check national law.","Below the new size criteria (over 1,000 employees and over €450M): no mandatory reporting.","Below the new size criteria: no mandatory reporting."]],
 ["Large EU company, not wave 1","Old wave 2, now >1,000 employees & >€450M",["out","out","out","new","new"],["","","","First year",""],
  ["Not required to report yet.","Not required to report yet: the wave 2 start (FY2025) was postponed to FY2027.","Not required to report yet: the wave 2 start was postponed to FY2027.","First report under the revised ESRS, on FY2027 (published 2028).","Reports under the revised ESRS."]],
 ["Large EU company below new thresholds","Old wave 2, e.g. 400 employees",["out","out","out","out","out"],["","","","Voluntary standard",""],
  ["Not required to report.","Not required to report.","Not required to report.","No mandatory reporting. The voluntary standard is available.","No mandatory reporting."]],
 ["Listed EU SME","Old wave 3",["out","out","out","out","out"],["","","","Out",""],
  ["Not required to report.","Not required to report.","Not required to report.","Out of mandatory scope.","Out of mandatory scope."]],
 ["Non-EU group (Art. 40a)",">€450M EU turnover + €200M EU entity",["out","out","out","out","40a"],["","","","","First year"],
  ["Not required to report.","Not required to report.","Not required to report.","Not required to report yet. The EU subsidiary may be caught earlier.","First group-level report under Article 40a, on FY2028."]]];

export const Q={
 hq:{q:"Where is the ultimate parent of your group based?",o:[["eu","In the EU","Or you are a standalone EU company"],["non","Outside the EU","US, UK, Switzerland, Asia and so on"]]},
 role:{q:"Which entity are you checking?",o:[["parent","The parent of a group","Use consolidated group figures"],["single","A standalone company","No subsidiaries"],["sub","A subsidiary in a group","Use your own figures, or your EU sub-group if you are its parent"]]},
 emp:{q:"Average employees in the financial year?",h:"Consolidated for a parent.",o:[["y","More than 1,000",""],["n","1,000 or fewer",""]]},
 turn:{q:"Net turnover in the financial year?",h:"Consolidated for a parent.",o:[["y","More than €450 million",""],["n","€450 million or less",""]]},
 wave1:{q:"Did you already publish a CSRD report for FY2024?",h:"Wave 1 means you were already under the old NFRD: a public-interest entity (listed company, bank or insurer) with more than 500 employees. An unlisted company was never wave 1, however large.",o:[["y","Yes, we are wave 1",""],["n","No",""]]},
 covered:{q:"Will a parent include you in a consolidated report under the ESRS (or an equivalent standard)?",o:[["y","Yes",""],["n","No, or not sure",""]]},
 fhc:{q:"Is the parent a financial holding company?",h:"It does not take part in managing its subsidiaries, which run independent businesses.",o:[["n","No",""],["y","Yes",""]]},
 euturn:{q:"Group net turnover generated in the EU, in each of the last two years?",o:[["y","More than €450 million both years",""],["n","€450 million or less in at least one year",""]]},
 anchor:{q:"Do you have an EU subsidiary or EU branch with net turnover above €200 million?",o:[["y","Yes",""],["n","No",""]]},
 bigsub:{q:"Does any EU subsidiary (or EU sub-group) itself exceed 1,000 employees and €450M turnover?",o:[["y","Yes",""],["n","No",""]]},
 listed:{q:"Are your securities listed on an EU regulated market?",o:[["n","No",""],["y","Yes",""]]}
};

const N=(nm,fig,st,cls,non)=>({nm,fig,st,cls,non});
export const CASES=[
 {t:"Dutch group",p:N("Parent NV (NL)","2,400 employees · €900M group","Reports FY2027","rep"),k:[N("GmbH (DE)","700 employees · €280M","Exempt","ex"),N("BV (NL)","900 employees · €350M","Exempt","ex"),N("SAS (FR)","300 employees · €90M","Exempt","ex")],
  w:["The group exceeds both thresholds on a consolidated basis, so the parent reports for the whole group from FY2027.","The subsidiaries are covered by the consolidated report and do not report separately.","None of the subsidiaries would be in scope on its own figures anyway."]},
 {t:"Large daughter",p:N("Parent SE (DE)","5,000 employees · €2.1bn group","Reports","rep"),k:[N("SpA (IT)","1,800 employees · €620M","Exempt (covered)","ex"),N("BV (NL)","400 employees · €150M","Exempt","ex")],
  w:["The Italian subsidiary exceeds both thresholds on its own, so it would have its own obligation.","Because the German parent's consolidated report covers it, it can use the subsidiary exemption.","Omnibus I lets this exemption apply even if the subsidiary is listed on an EU regulated market."]},
 {t:"Wave 1, now too small",p:N("Listed NV (NL)","700 employees · €300M","Out from FY2027","opt"),k:[],
  w:["The company reported for FY2024 as a wave 1 public-interest entity.","With 700 employees, it no longer exceeds the 1,000-employee threshold, so it is out from FY2027.","For FY2025 and FY2026 the Netherlands may exempt it. Until national law confirms that, plan for an FY2026 report and use the FY2026 options."]},
 {t:"US group, mid-size EU",p:N("Inc. (US)","EU turnover €700M (2 years)","Art. 40a FY2028","a40",true),k:[N("GmbH (DE)","800 employees · €320M","Publishes group report","a40")],
  w:["EU turnover is above €450M in both years and the German subsidiary is above €200M, so Article 40a applies.","The German subsidiary publishes a sustainability report covering the US group, on FY2028.","The German subsidiary itself has only 800 employees, so it has no separate obligation from FY2027."]},
 {t:"US group, big EU daughter",p:N("Corp. (US)","EU turnover €2bn","Art. 40a FY2028","a40",true),k:[N("SAS (FR)","3,000 employees · €1.2bn","Reports FY2027","rep"),N("BV (NL)","200 employees · €60M","Out of scope","out")],
  w:["The French subsidiary exceeds both thresholds on its own, so it reports from FY2027 like any EU company.","From FY2028 the group is also caught by Article 40a, with the French entity as the anchor.","If the US parent voluntarily publishes a consolidated report under the full ESRS, the French subsidiary can use the exemption and avoid a separate report."]},
 {t:"Swiss group, below EU line",p:N("AG (CH)","EU turnover €400M","Not in scope","out",true),k:[N("GmbH (DE)","500 employees · €250M","Not in scope","out")],
  w:["EU turnover of €400M is below the €450M Article 40a threshold, even though the German subsidiary is above €200M.","The German subsidiary does not exceed 1,000 employees or €450M, so it has no obligation of its own.","EU customers may still ask for data; the value chain cap limits what they can request."]},
 {t:"Branch only",p:N("KK (JP)","EU turnover €500M (2 years)","Art. 40a FY2028","a40",true),k:[N("EU branch (NL)","€260M turnover","Publishes group report","a40")],
  w:["With no EU subsidiary, an EU branch above €200M can be the anchor.","The branch publishes the group's sustainability report on FY2028.","Branches have no separate size test of their own beyond the €200M turnover threshold."]}
];

export const OPT=[
 {L:"A",t:"Keep it as it is",std:"Pre-Omnibus ESRS",src:"Article 2(1)(a), first option",d:"Report your 2026 year exactly like 2025.",eff:1,bi:"Your 2025 process works and you want to compare with last year."},
 {L:"B",t:"Keep it, with shortcuts",std:"Pre-Omnibus ESRS plus reliefs",src:"Article 2(1)(b)",d:"Same standards as 2025, but you may use up to eight shortcuts from the new rules.",eff:2,bi:"Your assessment is heavy, your value chain data has gaps, or you have acquisitions, disposals or joint operations in 2026.",more:"top-down materiality (27), undue cost and value chain limits in the assessment (32-33), acquisitions and disposals (74-75), non-significant activities (90), partial value chain scope (91), joint operations (92), Taxonomy appendix (106), executive summary (110). Numbers are ESRS 1 paragraphs."},
 {L:"C",t:"Switch early",std:"Revised ESRS in full",src:"Article 2(1)(a), second option",d:"Use the new, slimmer rules one year early. You get the fewest datapoints.",eff:3,bi:"You are starting with ESRS now, or you are redoing your assessment anyway and your systems and auditor are ready for the new structure."}];
