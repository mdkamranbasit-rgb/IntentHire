export type Group = { name: string; weight: number; patterns: RegExp[] };
export const LCA_GROUPS: Group[] = [
  {name:'Direct LCA work',weight:25,patterns:[/life[ -]?cycle assessment/i,/\bLCA studies?/i,/\bLCA of\b/i,/cradle[- ]to[- ](gate|grave)/i]},
  {name:'LCA software',weight:20,patterns:[/\bGaBi\b/i,/\bSimaPro\b/i,/\bOpenLCA\b/i,/\bopen LCA\b/i,/\bAir\.e\b/i]},
  {name:'LCI data and modelling',weight:15,patterns:[/\bLCI\b/i,/life cycle invent/i,/inventory data/i,/\bLCA model/i,/life.?cycle model/i,/data validation/i,/data collection/i]},
  {name:'ISO 14040/14044',weight:15,patterns:[/ISO\s*14040/i,/ISO\s*14044/i]},
  {name:'Relevant domain education',weight:10,patterns:[/environmental (engineering|science|studies)/i,/sustainable engineering/i,/energy and environmental/i,/chemical engineering/i,/environmental management/i]},
  {name:'EPD and benchmarking',weight:5,patterns:[/\bEPD\b/i,/environmental product declaration/i,/benchmarking/i,/ecoinvent/i,/ReCiPe/i]},
  {name:'Relevant industry experience',weight:10,patterns:[/\bLCA (consultant|analyst|engineer|specialist|professional)\b/i,/sustainability (consultant|engineer|analyst)/i,/environmental (engineer|consultant|specialist)/i]},
];
export const UX_GROUPS: Group[] = [
  {name:'Figma and design tools',weight:15,patterns:[/\bFigma\b/i,/\bSketch\b/i,/Adobe XD/i,/\bPenpot\b/i]},
  {name:'Prototyping and wireframes',weight:15,patterns:[/prototyp/i,/wirefram/i,/mockup/i,/\buser flow/i,/information architecture/i]},
  {name:'User research and testing',weight:15,patterns:[/user research/i,/usability test/i,/user interview/i,/persona/i,/journey map/i,/user feedback/i]},
  {name:'User psychology and HCD',weight:10,patterns:[/user psychology/i,/human[- ]centered/i,/user[- ]centered/i,/user behaviour/i,/user behavior/i]},
  {name:'Interface design',weight:15,patterns:[/UI\/UX/i,/UI design/i,/interface design/i,/digital product design/i,/product designer/i,/UX designer/i]},
  {name:'Visual design',weight:10,patterns:[/visual design/i,/visual hierarchy/i,/typography/i,/colour theory/i,/color theory/i,/graphic design/i,/brand identity/i]},
  {name:'Design projects or portfolio',weight:15,patterns:[/portfolio/i,/design project/i,/website design/i,/app design/i,/landing page/i,/case study/i]},
  {name:'Responsive design and collaboration',weight:5,patterns:[/responsive design/i,/mobile[- ]first/i,/cross[- ]functional/i,/design critique/i,/collaborat/i]},
];
export type Evidence = {weight:number; points:number; evidence:string[]};
export function scoreGroups(text:string, groups:Group[]) {
  const details:Record<string,Evidence>={}; let total=0;
  for (const group of groups) {
    const hits=group.patterns.map(p=>text.match(p)?.[0]).filter(Boolean) as string[];
    const unique=[...new Set(hits.map(x=>x.toLowerCase()))];
    const fraction=unique.length===0?0:unique.length===1?0.65:1;
    const points=Math.round(group.weight*fraction*10)/10;
    details[group.name]={weight:group.weight,points,evidence:unique}; total+=points;
  }
  return {score:Math.round(total*10)/10,details};
}
export function rankResume(text:string, id:string, filename:string) {
  const lca=scoreGroups(text,LCA_GROUPS), ux=scoreGroups(text,UX_GROUPS);
  let classification='uncertain / human review';
  if (!text.trim()) classification='neither/uncertain';
  else if (lca.score>=60 && lca.score-ux.score>=15) classification='stronger LCA match';
  else if (ux.score>=60 && ux.score-lca.score>=15) classification='stronger UI/UX match';
  else if (lca.score>=45 && ux.score>=45) classification='potential match for both';
  else if (Math.max(lca.score,ux.score)<30) classification='neither/uncertain';
  return {candidate_id:id,source_filename:filename,extraction_status:text.trim()?'readable':'blank_or_unreadable',character_count:text.length,lca_score:lca.score,uiux_score:ux.score,initial_classification:classification,confidence:'provisional',lca_evidence:lca.details,uiux_evidence:ux.details,extracted_text:text,review_note:'Evidence-coverage score only. Verify experience dates, project counts, tool proficiency and claims against the source resume.'};
}
