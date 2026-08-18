export const manifest = {
  screens: {
    scr_ahck32: { name: "Opportunity Explorer", route: "/", state: { "selectedId": "pricing-architecture" }, position: { "x": 160, "y": 220 } },
    scr_7spute: { name: "Explorer — Filtered", route: "/", state: { "selectedId": "demand-forecasting", "controls": { "category": "AI / Automation", "sort": "score", "confidence": "any", "evidence": "any", "impact": "any", "status": "any" } }, position: { "x": 1560, "y": 220 } },
    scr_ggwgg8: { name: "Explorer — Compare", route: "/", state: { "selectedId": "procurement-consolidation", "compare": ["pricing-architecture", "procurement-consolidation", "sales-territory"] }, position: { "x": 2960, "y": 220 } },
    scr_2vjyoo: { name: "Analysis — Overview", route: "/analysis/pricing-architecture", state: { "tab": "Overview" }, position: { "x": 160, "y": 2200 } },
    scr_66q25q: { name: "Analysis — Challenge Mode", route: "/analysis/pricing-architecture", state: { "tab": "Overview", "challengeOpen": true, "activeChallenges": ["ch1", "ch3"] }, position: { "x": 1560, "y": 2200 } },
    scr_ip5emn: { name: "Analysis — Evidence", route: "/analysis/pricing-architecture", state: { "tab": "Evidence" }, position: { "x": 2960, "y": 2200 } },
    scr_fzrbo8: { name: "Analysis — Assumptions", route: "/analysis/pricing-architecture", state: { "tab": "Assumptions" }, position: { "x": 4360, "y": 2200 } },
    scr_77yjay: { name: "Analysis — Assumption Detail", route: "/analysis/pricing-architecture", state: { "tab": "Assumptions", "assumptionId": "a3" }, position: { "x": 5760, "y": 2200 } },
    scr_dsm5t0: { name: "Analysis — Risks", route: "/analysis/pricing-architecture", state: { "tab": "Risks" }, position: { "x": 7160, "y": 2200 } },
    scr_sg9vl4: { name: "Analysis — Alternatives", route: "/analysis/pricing-architecture", state: { "tab": "Alternatives" }, position: { "x": 8560, "y": 2200 } },
    scr_pwceu7: { name: "Analysis — Financial Model", route: "/analysis/pricing-architecture", state: { "tab": "Financial Model" }, position: { "x": 9960, "y": 2200 } },
    scr_7yfbp0: { name: "Decision Workspace", route: "/decision", state: { "taken": null }, position: { "x": 160, "y": 4180 } },
    scr_tzvl40: { name: "Decision — Approved", route: "/decision", state: { "taken": "approve" }, position: { "x": 1560, "y": 4180 } }
  },
  sections: {
    sec_funwic: { name: "Explorer", x: 0, y: 0, width: 4320, height: 1180 },
    sec_8qmx86: { name: "Analysis", x: 0, y: 1980, width: 11320, height: 1180 },
    sec_nkh603: { name: "Decision", x: 0, y: 3960, width: 2920, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_funwic", children: [
    { kind: "screen", id: "scr_ahck32" },
    { kind: "screen", id: "scr_7spute" },
    { kind: "screen", id: "scr_ggwgg8" }]
  },
  { kind: "section", id: "sec_8qmx86", children: [
    { kind: "screen", id: "scr_2vjyoo" },
    { kind: "screen", id: "scr_66q25q" },
    { kind: "screen", id: "scr_ip5emn" },
    { kind: "screen", id: "scr_fzrbo8" },
    { kind: "screen", id: "scr_77yjay" },
    { kind: "screen", id: "scr_dsm5t0" },
    { kind: "screen", id: "scr_sg9vl4" },
    { kind: "screen", id: "scr_pwceu7" }]
  },
  { kind: "section", id: "sec_nkh603", children: [
    { kind: "screen", id: "scr_7yfbp0" },
    { kind: "screen", id: "scr_tzvl40" }]
  }]

};