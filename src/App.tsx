import { useMemo, useState } from 'react';
import seed from './data/candidates.json';
import { rankResume } from './scoring';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type Candidate = any;
const initial = (seed as Candidate[]).map((c:any)=>({...c,extracted_text:c.extracted_text??''}));
function App(){
 const [candidates,setCandidates]=useState<Candidate[]>(initial);
 const [role,setRole]=useState<'lca'|'uiux'>('lca');
 const [query,setQuery]=useState(''); const [sort,setSort]=useState('score');
 const [selected,setSelected]=useState<Candidate|null>(null); const [uploading,setUploading]=useState(false); const [notice,setNotice]=useState('');
 const sorted=useMemo(()=>candidates.filter(c=>(c.candidate_id+' '+c.source_filename+' '+c.initial_classification).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='score'?(role==='lca'?b.lca_score-a.lca_score:b.uiux_score-a.uiux_score):a.candidate_id.localeCompare(b.candidate_id)),[candidates,role,query,sort]);
 const readable=candidates.filter(c=>c.extraction_status==='readable').length;
 async function extract(file:File){
  const ext=file.name.toLowerCase().split('.').pop();
  if(ext==='docx'){const ab=await file.arrayBuffer();const result=await mammoth.extractRawText({arrayBuffer:ab});return result.value;}
  if(ext==='pdf'){const ab=await file.arrayBuffer();const pdf=await pdfjsLib.getDocument({data:ab}).promise;let text='';for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i);const content=await page.getTextContent();text+=content.items.map((x:any)=>x.str||'').join(' ')+'\n';}return text;}
  throw new Error('Please upload a PDF or DOCX file.');
 }
 async function handleFiles(files:FileList|null){if(!files?.length)return;setUploading(true);setNotice('');try{const additions:Candidate[]=[];for(const file of Array.from(files)){const text=await extract(file);const id='uploaded_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);additions.push(rankResume(text,id,file.name));}setCandidates(prev=>[...prev,...additions]);setRole(additions[0]?.lca_score>=additions[0]?.uiux_score?'lca':'uiux');setNotice(`${additions.length} resume(s) processed and ranked in this browser session.`);}catch(e:any){setNotice(e.message||'Could not extract this file.');}finally{setUploading(false);}}
 const lcaCount=candidates.filter(c=>c.initial_classification==='stronger LCA match').length;
 const uxCount=candidates.filter(c=>c.initial_classification==='stronger UI/UX match').length;
 return <div className="shell"><header className="topbar"><div className="brand"><div className="logo">i</div><div><b>IntentHire</b><small>Resume intelligence workspace</small></div></div><div className="topright"><span className="live-dot"/> Prototype · Human-reviewed screening</div></header>
 <main><section className="hero"><div><div className="eyebrow">TALENT INTELLIGENCE / OVERVIEW</div><h1>Find the right people,<br/><em>with evidence.</em></h1><p>Compare anonymized resumes against two role profiles. Scores show evidence found in each resume — final decisions stay with your hiring team.</p></div><label className="upload"><input type="file" accept=".docx,.pdf" multiple onChange={e=>handleFiles(e.target.files)} disabled={uploading}/><span className="upload-icon">＋</span><b>{uploading?'Processing…':'Upload resumes'}</b><small>PDF or DOCX · processed locally</small></label></section>
 <section className="stats"><div className="stat"><small>RESUMES IN WORKSPACE</small><strong>{candidates.length}</strong><span>Including uploaded test resumes</span></div><div className="stat"><small>TEXT EXTRACTED</small><strong>{readable}</strong><span>Original 47: 46 readable</span></div><div className="stat"><small>LCA STRONGER MATCH</small><strong>{lcaCount}</strong><span>Provisional threshold</span></div><div className="stat"><small>UI/UX STRONGER MATCH</small><strong>{uxCount}</strong><span>Provisional threshold</span></div></section>
 {notice&&<div className="notice">{notice}</div>}
 <section className="workspace"><div className="section-head"><div><div className="eyebrow">CANDIDATE SHORTLIST</div><h2>Ranked by role</h2></div><div className="controls"><input className="search" placeholder="Search candidate or filename…" value={query} onChange={e=>setQuery(e.target.value)}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="score">Highest score</option><option value="name">Candidate ID</option></select></div></div>
 <div className="tabs"><button className={role==='lca'?'active':''} onClick={()=>setRole('lca')}><span className="tabnum">01</span> Life Cycle Assessment <small>{candidates.length} ranked</small></button><button className={role==='uiux'?'active':''} onClick={()=>setRole('uiux')}><span className="tabnum">02</span> UI/UX Design <small>{candidates.length} ranked</small></button></div>
 <div className="tablewrap"><table><thead><tr><th>RANK / CANDIDATE</th><th>EXTRACTION</th><th>MATCH SCORE</th><th>CLASSIFICATION</th><th></th></tr></thead><tbody>{sorted.map((c,i)=>{const score=role==='lca'?c.lca_score:c.uiux_score;return <tr key={c.candidate_id} onClick={()=>setSelected(c)}><td><div className="candidate"><span className="rank">{String(i+1).padStart(2,'0')}</span><div><b>{c.candidate_id}</b><small>{c.source_filename}</small></div></div></td><td><span className={'status '+(c.extraction_status==='readable'?'ok':'warn')}>{c.extraction_status==='readable'?'Readable':'Needs review'}</span></td><td><div className="scorecell"><b>{score.toFixed(1)}%</b><div className="bar"><i style={{width:`${score}%`}}/></div></div></td><td><span className="classification">{c.initial_classification}</span></td><td><button className="view">View →</button></td></tr>})}</tbody></table>{!sorted.length&&<div className="empty">No candidates match your search.</div>}</div>
 <p className="footnote">Scores are deterministic evidence-coverage estimates, not verified qualifications. Check source resumes before shortlisting.</p>
 </section>
 <section className="method"><div><div className="eyebrow">TRANSPARENCY</div><h2>How ranking works</h2><p>Each role has its own weighted criteria. The system stores the matching evidence phrases so reviewers can understand why a score was assigned.</p></div><div className="method-card"><b>Important JD discrepancy</b><p>The assignment overview labels the LCA role as 4–6 years, while its detailed JD states 2–3 years of independent LCA project experience. This prototype flags experience for human verification instead of silently choosing one threshold.</p></div></section>
 <footer>IntentHire prototype · Original source files preserved · No automated hiring decisions</footer></main>
 {selected&&<div className="overlay" onClick={()=>setSelected(null)}><aside className="drawer" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><div className="eyebrow">CANDIDATE REVIEW</div><h2>{selected.candidate_id}</h2><p className="filename">{selected.source_filename}</p><div className="detail-scores"><div><small>LCA SCORE</small><b>{selected.lca_score}%</b></div><div><small>UI/UX SCORE</small><b>{selected.uiux_score}%</b></div></div><h3>Classification</h3><p>{selected.initial_classification}</p><h3>Evidence — {role==='lca'?'LCA':'UI/UX'}</h3>{Object.entries(role==='lca'?selected.lca_evidence:selected.uiux_evidence).map(([k,v]:any)=><div className="evidence"><div><b>{k.replaceAll('_',' ')}</b><strong>{v.points}/{v.weight}</strong></div><small>{v.evidence.length?v.evidence.join(' · '):'No matching evidence detected'}</small></div>)}<h3>Source resume</h3>{selected.candidate_id.startsWith('uploaded_')?<p>Newly uploaded file is processed locally and is not stored on the server.</p>:<p>
  Original resume retained in the private evaluation dataset.
  Source document is not publicly hosted.
</p>}<h3>Review note</h3><p className="review-note">{selected.review_note}</p></aside></div>}
 </div>
}
export default App;
