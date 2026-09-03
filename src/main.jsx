import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const SHARE_PLAN = 'https://chatgpt.com/share/6a98d457-c778-83e9-8b91-373da69f6fb0'
const SHARE_BUILD = 'https://chatgpt.com/share/6a98d466-04c4-83ee-948c-e3e495eea40c'
const LIVE_APP = 'https://in71-king.github.io/Hokkaido_plan/'

const stages = [
  {
    id: 'brief', no: '01', label: 'BRIEF', date: '2026.09.02',
    title: '관광지가 아니라 여행의 속도부터 정했다',
    why: '목적지만 나열하면 설경·온천·휴양이라는 여행의 결보다 이동 효율이 먼저 최적화될 수 있었다.',
    user: '아이는 성인임. 가족 온천과 삿포로 맥주, 설경과 야경이 컨셉. 관광이나 놀이공원보다 휴양, 고즈넉한 분위기가 중요해.',
    ai: '여행자를 성인 3명으로 정의하고 설경·야경·온천·맥주·휴양을 핵심 기준으로 정리했습니다. 렌터카 없이 3박 4일 안에서 선택 가능한 구조를 제안했습니다.',
    change: '장소 중심의 일정 요청을 ‘어떤 속도로 머물 것인가’를 고르는 여행 의사결정 문제로 재정의',
    tags: ['Adult Family', 'Slow Travel', '5 Priorities'], live: 'brief',
  },
  {
    id: 'research', no: '02', label: 'RESEARCH', date: '2026.09.02',
    title: '결정에 필요한 사실부터 좁혀 조사했다',
    why: '겨울 홋카이도는 긴 이동시간, 축제 종료일, 교통과 숙박 재고가 실제 일정의 가능성을 바꾼다.',
    user: '최신 비에이 원데이 투어의 일반적인 일정을 이동시간까지 정리하고, 설경 노천온천을 갖춘 고급 료칸도 추천해줘.',
    ai: '비에이 왕복 버스 이동과 대표 방문지를 시간순으로 정리하고, 전통성·설경·고요함·객실·온천을 기준으로 노보리베츠 료칸 4곳을 압축했습니다.',
    change: '추천을 감상평이 아닌 이동시간·행사기간·숙소 특성처럼 화면에 표시할 수 있는 데이터로 변환',
    tags: ['10–12h Tour', '4 Ryokans', 'Winter Transit'], live: 'research',
  },
  {
    id: 'options', no: '03', label: 'OPTIONS', date: '2026.09.02',
    title: '정답 하나 대신 두 개의 여행 리듬을 남겼다',
    why: '비에이의 압도적인 설원과 오타루의 여유로운 야경은 우열보다 취향의 문제였다.',
    user: '후보 1과 후보 2를 둘 다 제안하는 형태로 간다.',
    ai: 'DAY 1·3·4는 유지하고 DAY 2만 비에이 설경형과 오타루 휴양형으로 갈라, 풍경·야경·휴양·피로도를 비교하도록 설계했습니다.',
    change: '긴 일정표 두 개를 중복 제시하는 대신 한 번의 선택으로 DAY 2와 비교 지표가 함께 바뀌는 구조 확정',
    tags: ['Biei', 'Otaru', 'Decision UI'], live: 'options',
  },
  {
    id: 'appbrief', no: '04', label: 'APP BRIEF', date: '2026.09.02',
    title: '여행 조언을 화면의 행동으로 번역했다',
    why: '좋은 여행 정보도 긴 글로만 제시하면 사용자가 후보를 바꾸고 결과를 확인하기 어렵다.',
    user: '두 일정과 료칸 추천 4개를 포함해서 여행일정을 추천하는 인터랙티브 웹 앱을 만들고 싶다.',
    ai: '여행안 토글, DAY 아코디언, 료칸 카드 선택, 일정 자동 반영, 비교표와 렌터카 안내를 하나의 사용자 흐름으로 묶었습니다.',
    change: '콘텐츠 목록을 선택 → 확인 → 비교로 이어지는 제품 요구사항과 컴포넌트 구조로 전환',
    tags: ['Progressive Disclosure', 'State', 'Responsive'], live: 'wireframe',
  },
  {
    id: 'build', no: '05', label: 'FIRST BUILD', date: '2026.09.02',
    title: '설명 페이지가 아닌 선택하는 플래너를 만들었다',
    why: '첫 화면에서 두 여행안의 차이를 이해하고 바로 선택할 수 있어야 웹앱의 목적이 드러난다.',
    user: '단순 텍스트 페이지가 아니라 실제 여행 계획을 고르는 느낌으로, 모바일에서도 사용하기 편하게 제작해줘.',
    ai: 'Vite와 React로 선택 상태를 관리하고, 겨울 여행의 분위기를 살린 카드·타임라인·비교표를 반응형 화면에 구현했습니다.',
    change: '자연어로 정의한 선택 규칙이 실제로 상태가 연결된 첫 번째 작동 화면이 됨',
    tags: ['Vite + React', 'Working UI', 'Mobile First'], live: 'build',
  },
  {
    id: 'interaction', no: '06', label: 'INTERACTION', date: '2026.09.02',
    title: '선택이 일정 전체에 이어지도록 연결했다',
    why: '카드가 눌리기만 하고 다른 정보가 바뀌지 않으면 장식적인 인터랙션에 머문다.',
    user: '료칸을 하나 선택하면 선택한 료칸이 전체 일정에 반영되도록 하고, DAY 카드는 펼쳐서 세부 내용을 보게 해줘.',
    ai: '여행안 선택은 DAY 2와 비교 영역에, 료칸 선택은 DAY 3 요약에 즉시 반영되도록 상태를 연결했습니다.',
    change: '개별 카드 모음이 사용자의 선택으로 최종 여행을 조립하는 하나의 인터랙티브 플래너로 발전',
    tags: ['Linked State', 'Accordion', 'Instant Feedback'], live: 'interaction',
  },
  {
    id: 'refine', no: '07', label: 'REFINEMENT', date: '2026.09.02',
    title: '실제 여행에 필요한 근거와 세부 동선을 보강했다',
    why: '보기 좋은 일정만으로는 장소가 어떤 곳인지, 실제 방문자는 어떻게 움직였는지 판단하기 부족했다.',
    user: '오타루 한국어 관광 후기를 넣고, 조사된 블로그도 대응 장소를 펼쳤을 때 볼 수 있게 해줘. 신규 링크는 검증해줘.',
    ai: '장소별 상세 설명에 공식 정보·지도·한국어 후기를 연결하고, 축제 일정과 숙소 예약 조건을 다시 확인해 필요한 위치에 배치했습니다.',
    change: '예쁜 데모를 실제 계획에 참고할 수 있는 근거 중심의 여행 도구로 보강',
    tags: ['Verified Links', 'Korean Reviews', 'Contextual Detail'], live: 'refine',
  },
  {
    id: 'outcome', no: '08', label: 'OUTCOME', date: '2026.09.02',
    title: '대화가 한 가족의 선택 가능한 여행안이 됐다',
    why: '완성의 기준은 정보량이 아니라 사용자가 자신의 여행을 이해하고 선택할 수 있는가였다.',
    user: '지인에게 설명할 수 있도록 핵심 기능을 간단히 정리해줘.',
    ai: '두 여행안, 4일 타임라인, 장소별 정보, 료칸 4곳 비교·선택, 실제 일정 반영이라는 핵심 경험으로 결과를 요약했습니다.',
    change: '일회성 추천 대화가 공유하고 다시 선택해 볼 수 있는 독립적인 여행 플래너로 완성',
    tags: ['2 Plans', '4 Days', '4 Ryokans'], live: 'outcome',
  },
]

const ryokans = [
  { name: '온센쿄 타키노야', jp: '滝乃家', note: '설경과 고요함 최우선', snow: 5, bath: 5 },
  { name: '보로 노구치', jp: '望楼NOGUCHI', note: '현대적이고 프라이빗', snow: 4, bath: 5 },
  { name: '료테이 하나유라', jp: '旅亭花ゆら', note: '전통미와 가격의 균형', snow: 4, bath: 4 },
  { name: '다이이치 타키모토칸', jp: '第一滝本館', note: '온천 종류와 접근성', snow: 4, bath: 5 },
]

function SnowMark({ score }) {
  return <span className="snow-score" aria-label={`${score}점`}>{'●'.repeat(score)}<i>{'●'.repeat(5-score)}</i></span>
}

function BriefLive() {
  return <div className="concept-live">
    <p className="eyebrow">TRIP DNA</p><h3>많이 보는 여행보다<br/>잘 머무는 여행</h3>
    <div className="concept-orbit"><strong>휴양</strong><span>설경</span><span>야경</span><span>온천</span><span>맥주</span></div>
    <div className="live-note"><b>여행자</b><span>성인 가족 3명 · 3박 4일 · 대중교통</span></div>
  </div>
}

function ResearchLive() {
  return <div className="research-live">
    <p className="eyebrow">DECISION EVIDENCE</p><h3>감성이 아니라 선택에<br/>필요한 사실을 조사</h3>
    <div className="evidence-grid">
      <div><b>10–12h</b><span>비에이 투어</span><small>버스 5–6시간</small></div>
      <div><b>2.11</b><span>눈축제 마지막 날</span><small>도착 후 이틀</small></div>
      <div><b>4</b><span>료칸 후보</span><small>설경·온천 비교</small></div>
      <div><b>0</b><span>렌터카</span><small>JR·버스 중심</small></div>
    </div>
  </div>
}

function PlanToggle({ compact=false }) {
  const [plan, setPlan] = useState('otaru')
  const info = plan === 'otaru'
    ? { kicker:'눈 · 운하 · 촛불', title:'오타루 휴양형', desc:'짧은 이동으로 오래된 거리와 겨울 야경을 천천히', fatigue:'보통 · JR 왕복', scores:[4,5,5,4] }
    : { kicker:'광활한 겨울 설원', title:'비에이 설경형', desc:'홋카이도다운 설원을 하루에 압축해 만나는 일정', fatigue:'높음 · 버스 5–6시간', scores:[5,4,3,3] }
  return <div className={`plan-live ${compact?'compact':''}`}>
    <div className="segmented" role="tablist" aria-label="여행안 미니 데모">
      <button className={plan==='biei'?'active':''} onClick={()=>setPlan('biei')}>비에이</button>
      <button className={plan==='otaru'?'active':''} onClick={()=>setPlan('otaru')}>오타루</button>
    </div>
    <p className="eyebrow">{info.kicker}</p><h3>{info.title}</h3><p className="live-desc">{info.desc}</p>
    <div className="metric-row">{['설경','야경','고요','휴양'].map((m,i)=><div key={m}><span>{m}</span><SnowMark score={info.scores[i]}/></div>)}</div>
    <div className="fatigue"><span>이동 피로</span><b>{info.fatigue}</b></div>
  </div>
}

function WireframeLive() {
  return <div className="wireframe-live">
    <p className="eyebrow">SCREEN LOGIC</p><h3>정보를 행동의 순서로</h3>
    <div className="wire-window">
      <div className="wire-top"><i/><i/><i/></div>
      <div className="wire-choice"><span>후보 1</span><span>후보 2</span></div>
      <div className="wire-line"><b>DAY 1–4</b><i/><i/><i/><i/></div>
      <div className="wire-cards"><span/><span/><span/><span/></div>
      <div className="wire-table"/>
    </div>
    <div className="flow-caption"><span>선택</span><b>→</b><span>일정 변경</span><b>→</b><span>비교</span></div>
  </div>
}

function ScreenshotLive({ file, eyebrow, title, note }) {
  const [open, setOpen] = useState(false)
  return <div className="screenshot-live">
    <p className="eyebrow">{eyebrow}</p><h3>{title}</h3>
    <button className="screen-button" onClick={()=>setOpen(true)} aria-label={`${title} 크게 보기`}>
      <img src={`${import.meta.env.BASE_URL}screens/${file}`} alt={title}/><span>크게 보기 ↗</span>
    </button>
    <p className="screen-note">{note}</p>
    {open && <div className="modal" role="dialog" aria-modal="true" onClick={()=>setOpen(false)}>
      <button className="modal-close" onClick={()=>setOpen(false)} aria-label="닫기">×</button>
      <img src={`${import.meta.env.BASE_URL}screens/${file}`} alt={title}/>
    </div>}
  </div>
}

function InteractionLive() {
  const [plan, setPlan] = useState('오타루 휴양형')
  const [ryokan, setRyokan] = useState(0)
  const [expanded, setExpanded] = useState(true)
  return <div className="interaction-live">
    <p className="eyebrow">TRY THE LOGIC</p><h3>선택이 일정에 반영됩니다</h3>
    <div className="segmented"><button className={plan.startsWith('비에이')?'active':''} onClick={()=>setPlan('비에이 설경형')}>비에이</button><button className={plan.startsWith('오타루')?'active':''} onClick={()=>setPlan('오타루 휴양형')}>오타루</button></div>
    <button className="day-card" onClick={()=>setExpanded(v=>!v)} aria-expanded={expanded}>
      <span>DAY 3</span><b>삿포로 → 노보리베츠</b><i>{expanded?'−':'+'}</i>
    </button>
    {expanded && <div className="day-detail"><span>15:30 체크인</span><strong>{ryokans[ryokan].name}</strong><small>설경 노천온천 · 가이세키 · 휴식</small></div>}
    <div className="mini-ryokans">{ryokans.map((r,i)=><button key={r.name} className={ryokan===i?'active':''} onClick={()=>setRyokan(i)}><b>{r.name}</b><span>{r.note}</span></button>)}</div>
    <div className="selection-summary"><span>현재 선택</span><b>{plan} × {ryokans[ryokan].name}</b></div>
  </div>
}

function RefineLive() {
  const [view, setView] = useState('timeline')
  const file = view==='timeline'?'hokkaido-timeline.jpg':'hokkaido-ryokan.jpg'
  return <div className="refine-live">
    <div className="segmented"><button className={view==='timeline'?'active':''} onClick={()=>setView('timeline')}>장소 상세</button><button className={view==='ryokan'?'active':''} onClick={()=>setView('ryokan')}>료칸 근거</button></div>
    <img src={`${import.meta.env.BASE_URL}screens/${file}`} alt="세부 정보가 보강된 실제 여행 앱 화면"/>
    <div className="annotation"><b>+</b><span>공식 정보 · 지도 · 한국어 후기 링크를 필요한 위치에서 바로 확인</span></div>
  </div>
}

function OutcomeLive() {
  const files = ['hokkaido-hero.jpg','hokkaido-timeline.jpg','hokkaido-ryokan.jpg','hokkaido-final.jpg']
  const [index,setIndex] = useState(0)
  return <div className="outcome-live">
    <p className="eyebrow">FINAL RESULT</p><div className="outcome-head"><h3>하나의 대화에서<br/>선택 가능한 여행으로</h3><span>{index+1} / {files.length}</span></div>
    <img src={`${import.meta.env.BASE_URL}screens/${files[index]}`} alt="완성된 홋카이도 여행 플래너 화면"/>
    <div className="gallery-controls"><button onClick={()=>setIndex((index+files.length-1)%files.length)} aria-label="이전 화면">←</button><div>{files.map((_,i)=><button key={i} className={i===index?'active':''} onClick={()=>setIndex(i)} aria-label={`${i+1}번 화면`}/>)}</div><button onClick={()=>setIndex((index+1)%files.length)} aria-label="다음 화면">→</button></div>
    <a className="open-live" href={LIVE_APP} target="_blank" rel="noreferrer">완성된 여행 플래너 열기 ↗</a>
  </div>
}

function LivePanel({ stage }) {
  const body = useMemo(()=>{
    if(stage.live==='brief') return <BriefLive/>
    if(stage.live==='research') return <ResearchLive/>
    if(stage.live==='options') return <PlanToggle/>
    if(stage.live==='wireframe') return <WireframeLive/>
    if(stage.live==='build') return <ScreenshotLive file="hokkaido-hero.jpg" eyebrow="FIRST WORKING VIEW" title="첫 화면에서 바로 비교" note="실제 최종 앱의 첫 화면 캡처"/>
    if(stage.live==='interaction') return <InteractionLive/>
    if(stage.live==='refine') return <RefineLive/>
    return <OutcomeLive/>
  },[stage])
  return <aside className="live-panel" aria-live="polite">
    <div className="live-label"><span>LIVE RESULT</span><b>{stage.no} / 08</b></div>
    <div className="live-card" key={stage.id}>{body}</div>
    <div className="live-progress"><span>제작 완성도</span><div><i style={{width:`${Number(stage.no)*12.5}%`}}/></div><b>{Number(stage.no)*12.5}%</b></div>
  </aside>
}

function Stage({ item }) {
  return <section className="story-stage" id={item.id} data-stage={item.id}>
    <div className="stage-marker"><span>{item.no}</span></div>
    <div className="stage-meta"><b>{item.label}</b><span>{item.date}</span></div>
    <h2>{item.title}</h2>
    <div className="why"><b>왜 다음 요청이 필요했나</b><p>{item.why}</p></div>
    <div className="dialogue user"><div className="speaker"><b>나</b><span>사용자</span></div><p>{item.user}</p></div>
    <div className="dialogue ai"><div className="speaker"><b>AI</b><span>ChatGPT</span></div><p>{item.ai}</p></div>
    <div className="changed"><span>이 대화가 바꾼 것</span><strong>{item.change}</strong></div>
    <div className="tags">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
    <div className="mobile-live"><LivePanel stage={item}/></div>
  </section>
}

function App() {
  const [active, setActive] = useState(stages[0].id)
  useEffect(()=>{
    const observer = new IntersectionObserver(entries=>{
      const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]
      if(visible) setActive(visible.target.dataset.stage)
    },{rootMargin:'-18% 0px -55% 0px',threshold:[0,.15,.35,.6]})
    document.querySelectorAll('[data-stage]').forEach(el=>observer.observe(el))
    return ()=>observer.disconnect()
  },[])
  const activeStage = stages.find(s=>s.id===active) || stages[0]
  const jump = id => document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})
  const progress = (stages.findIndex(s=>s.id===active)+1)/stages.length*100
  return <>
    <header className="topbar">
      <a className="brand" href="#top"><span>HP</span><b>Planner 제작기</b></a>
      <div className="top-progress" aria-label={`전체 진행률 ${progress}%`}><i style={{width:`${progress}%`}}/></div>
      <nav><a href={SHARE_PLAN} target="_blank" rel="noreferrer">여행 기획 대화 ↗</a><a href={SHARE_BUILD} target="_blank" rel="noreferrer">웹앱 제작 대화 ↗</a></nav>
    </header>
    <main id="top">
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">A REAL AI-BUILT TRAVEL STORY</p><h1>“이런 여행이면 좋겠어”가<br/><em>선택 가능한 여행 플래너</em>가 되기까지</h1><p className="hero-desc">두 번의 실제 ChatGPT 대화를 따라가며, 여행 취향이 조사·비교·인터랙션을 거쳐 하나의 웹앱으로 완성되는 과정을 살펴보세요.</p><button onClick={()=>jump('brief')}>제작 과정 시작하기 <span>↓</span></button></div>
        <div className="hero-visual" aria-label="제작기 핵심 숫자"><div className="snow-ring ring-a"/><div className="snow-ring ring-b"/><div className="hero-core"><strong>8</strong><span>제작 단계</span></div><div className="float-stat one"><strong>2</strong><span>여행안</span></div><div className="float-stat two"><strong>4</strong><span>Days</span></div><div className="float-stat three"><strong>4</strong><span>Ryokans</span></div></div>
        <div className="reading"><b>읽는 방법</b><span><i>01</i> 실제 요청을 따라갑니다.</span><span><i>02</i> 요청이 화면으로 변하는 과정을 봅니다.</span><span><i>03</i> 오른쪽 결과를 직접 조작합니다.</span></div>
      </section>
      <nav className="stage-nav" aria-label="제작 단계">{stages.map(s=><button key={s.id} className={active===s.id?'active':''} onClick={()=>jump(s.id)}><span>{s.no}</span><b>{s.label}</b></button>)}</nav>
      <div className="story-layout">
        <div className="story-column">{stages.map(item=><Stage key={item.id} item={item}/>)}</div>
        <LivePanel stage={activeStage}/>
      </div>
      <section className="takeaway">
        <p className="eyebrow">WHAT CHANGED</p><h2>좋은 결과는 긴 프롬프트 한 번보다<br/><em>선택하고 확인하는 피드백</em>에서 나왔다.</h2>
        <div className="takeaway-grid"><article><span>처음</span><h3>여행 취향</h3><p>설경·야경·온천·휴양</p></article><article><span>구조화</span><h3>두 가지 선택지</h3><p>비에이와 오타루</p></article><article><span>구현</span><h3>연결된 인터랙션</h3><p>일정·료칸·비교표</p></article><article><span>완성</span><h3>공유 가능한 플래너</h3><p>근거와 실제 링크까지</p></article></div>
        <a href={LIVE_APP} target="_blank" rel="noreferrer">완성된 홋카이도 여행 플래너 보기 ↗</a>
      </section>
    </main>
    <footer><strong>HOKKAIDO PLANNER · BUILD STORY</strong><span>실제 공유 대화와 여행 플래너 기반 · 2026</span><a href="#top">처음으로 ↑</a></footer>
  </>
}

createRoot(document.getElementById('root')).render(<App />)
