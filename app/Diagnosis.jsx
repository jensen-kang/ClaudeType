'use client';
import React, { useState, useMemo, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Target, TrendingUp, Zap, AlertCircle, CheckCircle2, RotateCcw, Brain, Wrench, Network, Download, Loader2 } from 'lucide-react';

const QUESTIONS = [
  {
    part: 1,
    q: "새로운 작업을 시킬 때 어떻게 시작해요?",
    options: [
      "그때그때 떠오르는 대로 입력해요",
      "어떤 형식으로 받고 싶은지 먼저 말해요",
      "역할, 맥락, 원하는 형식을 구조로 짜서 전달해요",
      "미리 만들어둔 프롬프트 템플릿을 써요",
    ],
  },
  {
    part: 1,
    q: "같은 작업을 다시 할 때 어떻게 해요?",
    options: [
      "새 채팅창에서 처음부터 다시 설명해요",
      "이전 채팅창을 찾아서 이어가요",
      "이전 대화를 복사해 새 채팅창에 붙여 시작해요",
      "Projects나 저장된 프롬프트로 한 번에 불러와요",
    ],
  },
  {
    part: 1,
    q: "Claude 결과물이 아쉬울 때 어떻게 해요?",
    options: [
      "내가 직접 30~50%를 다시 고쳐요",
      "\"더 잘 만들어줘\"라고 다시 시켜요",
      "어디가 어떻게 부족한지 짚어서 다시 시켜요",
      "다음번엔 같은 실수가 나오지 않게 지시문에 규칙을 더해요",
    ],
  },
  {
    part: 1,
    q: "Claude에게 나를 어떻게 소개하고 있어요?",
    options: [
      "매번 새 채팅창에서 다시 설명해요",
      "가끔 자기소개를 해요",
      "User Preferences나 Custom Instructions에 한 번 등록해뒀어요",
      "직무, 말투, 피해야 할 것까지 또렷하게 등록해뒀어요",
    ],
  },
  {
    part: 2,
    q: "내 반복 업무 중 AI에 얼마나 맡기고 있어요?",
    options: [
      "거의 없어요. AI는 가끔 도움받는 정도예요",
      "글쓰기, 번역 같은 일부만 맡겨요",
      "자료 정리, 분석, 요약처럼 여러 영역에서 맡겨요",
      "형식이 정해진 작업은 거의 다 AI로 처리해요",
    ],
  },
  {
    part: 2,
    q: "Claude에게 \"내가 일하는 방식\"을 알려준 적 있어요?",
    options: [
      "그게 가능한 줄 몰랐어요",
      "가끔 톤이나 형식을 알려줘요",
      "자주 쓰는 문서 형식이나 용어집을 만들어서 공유해요",
      "작업별 가이드와 체크리스트를 만들어두고 매번 불러와요",
    ],
  },
  {
    part: 2,
    q: "Claude가 만든 결과물이 \"끝났다\"고 보는 기준이 뭐예요?",
    options: [
      "내가 보기에 그럴듯하면 끝이에요",
      "몇 번 다시 시키다가 적당히 끝내요",
      "미리 만들어둔 체크리스트로 확인해요",
      "Claude에게 자가 검증까지 시키고 그 결과로 판단해요",
    ],
  },
  {
    part: 2,
    q: "다른 사람이 내 방식을 그대로 따라 할 수 있어요?",
    options: [
      "아니요, 나만의 감각으로 해요",
      "말로 설명은 해줄 수 있지만 문서는 따로 없어요",
      "일부는 문서로 정리해뒀어요",
      "가이드와 템플릿이 있어서 누구나 같은 결과를 낼 수 있어요",
    ],
  },
  {
    part: 3,
    q: "\"이 작업, AI한테 시킬 수 있겠다\"를 얼마나 잘 알아채요?",
    options: [
      "누가 알려주면 그때 알아채요",
      "글쓰기, 번역처럼 또렷한 영역만 알아채요",
      "평소에 \"이건 자동화할 수 있겠다\"를 자주 떠올려요",
      "새 작업을 받으면 거의 반사적으로 AI 분담 비율부터 봐요",
    ],
  },
  {
    part: 3,
    q: "내 일을 \"시스템\"으로 보는 눈이 있어요?",
    options: [
      "그때그때 닥치는 대로 처리해요",
      "자주 하는 작업은 머릿속에 순서가 잡혀 있어요",
      "일부 작업은 문서나 체크리스트로 만들어뒀어요",
      "내 일을 \"반복 시스템 + 판단 영역\"으로 또렷하게 나눠놨어요",
    ],
  },
  {
    part: 3,
    q: "Claude에 한계를 느꼈을 때 어떻게 해요?",
    options: [
      "포기하고 손으로 해요",
      "다른 AI(ChatGPT 등)에 같은 걸 시켜봐요",
      "프롬프트나 입력 방식을 바꿔서 다시 시도해요",
      "왜 막혔는지 살펴보고, 다음번엔 어떻게 줄지 설계를 바꿔요",
    ],
  },
  {
    part: 3,
    q: "1년 뒤에 AI를 어떻게 쓰고 있고 싶어요?",
    options: [
      "아직 잘 모르겠어요",
      "지금보다 더 많이, 더 다양하게 쓰고 싶어요",
      "나만의 작업 시스템을 만들고 싶어요",
      "동료에게 내 방식을 전파하는 사람이 되고 싶어요",
    ],
  },
];

const LEVELS = [
  { min: 12, max: 18, name: "탐색가", num: 1, tag: "EXPLORER", color: "#94a3b8", desc: "Claude를 가끔 쓰고 있어요. AI가 \"어디까지 되는지\"를 이제부터 손에 익히면 돼요." },
  { min: 19, max: 26, name: "사용자", num: 2, tag: "USER", color: "#60a5fa", desc: "일상에 Claude를 들였어요. 매번 처음부터 설명하는 패턴만 줄여도 단숨에 점프해요." },
  { min: 27, max: 34, name: "활용가", num: 3, tag: "OPERATOR", color: "#a78bfa", desc: "Claude를 내 일에 맞춰 쓰고 있어요. 다음 점프는 \"매번 다시 시키지 않는\" 영역이에요." },
  { min: 35, max: 42, name: "설계자", num: 4, tag: "ARCHITECT", color: "#f472b6", desc: "내 방식을 Claude에 옮기기 시작했어요. 시스템처럼 보는 시각이 자리잡는 중이에요." },
  { min: 43, max: 48, name: "운영자", num: 5, tag: "OPERATOR-X", color: "#fbbf24", desc: "Claude를 쓰는 사람이 아니라, Claude가 일하는 환경을 만드는 사람이에요. 동료가 당신 방식을 따라해요." },
];

// 4축 유형 분류
function classifyType(answers) {
  // 축 1 — 접근 방식: P(Prompter, 지시형) vs A(Architect, 설계형)
  //   Q1, Q3: 답이 D쪽이면 Architect
  const p1 = (answers[0] + answers[2]) / 2;
  const ax1 = p1 >= 3 ? 'A' : 'P';

  // 축 2 — 재사용 성향: F(Fresh, 매번 새로) vs R(Reuse, 재활용)
  //   Q2, Q4: 답이 D쪽이면 Reuse
  const p2 = (answers[1] + answers[3]) / 2;
  const ax2 = p2 >= 3 ? 'R' : 'F';

  // 축 3 — 위임 깊이: S(Surface, 표면) vs D(Deep, 깊이)
  //   Q5, Q6: 답이 D쪽이면 Deep
  const p3 = (answers[4] + answers[5]) / 2;
  const ax3 = p3 >= 3 ? 'D' : 'S';

  // 축 4 — 검증 방식: I(Intuition, 직관) vs C(Criteria, 기준)
  //   Q7, Q8: 답이 D쪽이면 Criteria
  const p4 = (answers[6] + answers[7]) / 2;
  const ax4 = p4 >= 3 ? 'C' : 'I';

  const code = ax1 + ax2 + ax3 + ax4;

  // 16가지 유형 (대표 별명)
  const names = {
    PFSI: { name: "감각의 즉흥파", emoji: "🎲", desc: "떠오르는 대로 Claude에 던지고, 결과는 감으로 판단해요. 빠른 게 강점, 매번 다시 시작하는 게 함정이에요." },
    PFSC: { name: "체크리스트 즉흥파", emoji: "📋", desc: "즉흥으로 시켜도 결과는 꼼꼼하게 봐요. 시스템만 갖추면 단숨에 점프해요." },
    PFDI: { name: "위임 본능러", emoji: "🚀", desc: "일단 많이 맡겨요. 매번 새로 설명하고 감으로 받아내는 타입이라, 효율을 끌어올릴 여지가 가장 커요." },
    PFDC: { name: "기준 있는 임시 운영자", emoji: "🎯", desc: "맡기기도 잘하고 검증 기준도 있어요. 매번 처음부터 설정하는 패턴만 줄이면 시스템화 1단계예요." },
    PRSI: { name: "절약형 재활용러", emoji: "♻️", desc: "이전 대화를 잘 챙기는 알뜰파예요. 검증을 감에 맡기는 부분만 보완하면 일관성이 살아나요." },
    PRSC: { name: "꼼꼼한 재활용러", emoji: "📦", desc: "재사용도 검증도 하지만, 맡기는 깊이가 얕아요. AI를 \"보조\"에서 \"동료\"로 끌어올릴 단계예요." },
    PRDI: { name: "감각의 운영자", emoji: "🎨", desc: "많이 맡기고 자료도 잘 모으는데, 결과 판단은 감에 의지해요. 기준만 또렷이 적어두면 단숨에 점프해요." },
    PRDC: { name: "안정형 활용가", emoji: "⚙️", desc: "위임, 재사용, 검증을 다 챙겨요. 다음은 \"내가 시키는\"을 넘어 환경을 설계하는 단계예요." },
    AFSI: { name: "구조 짜는 즉흥가", emoji: "🧩", desc: "프롬프트를 잘 짜는데 매번 새로 짜요. 결과도 감으로 봐요. 한 번 짠 걸 다시 쓰기 시작하면 폭발적으로 성장해요." },
    AFSC: { name: "원샷 완벽주의자", emoji: "🎼", desc: "한 번 짤 때 완벽하게 짜는데, 다음에 또 처음부터 짜요. 한 번만 외부로 옮겨두면 성장이 가팔라요." },
    AFDI: { name: "직관의 아키텍트", emoji: "🌪️", desc: "설계도 잘하고 깊이 맡기는데, 매번 새로 설계해요. 검증 기준만 더하면 가장 크게 점프할 자리예요." },
    AFDC: { name: "검증 광인", emoji: "🔬", desc: "설계도 검증도 철저한데, 재사용 시스템이 없어 매번 새로 만들어요. 가장 아까운 타입이에요." },
    ARSI: { name: "스마트 재활용가", emoji: "🎯", desc: "구조와 재사용은 잘 챙겨요. 위임 깊이와 검증만 더하면 설계자 단계예요." },
    ARSC: { name: "체계의 사용자", emoji: "🗂️", desc: "체계는 잡혔는데 맡기는 범위가 좁아요. \"이것까지 시켜도 되나?\" 싶은 영역에 도전할 때예요." },
    ARDI: { name: "느낌의 설계자", emoji: "✨", desc: "거의 다 갖췄는데 \"끝의 기준\"이 머릿속에만 있어요. 검증 기준만 밖으로 꺼내면 곧 운영자예요." },
    ARDC: { name: "환경 설계자", emoji: "🏛️", desc: "Claude를 쓰는 사람이 아니라 환경을 만드는 사람이에요. 동료가 당신 방식을 배워가는 단계예요." },
  };

  return { code, ...names[code], axes: { ax1, ax2, ax3, ax4 } };
}

const AXIS_INFO = [
  { key: 'ax1', title: '접근 방식', left: 'P · Prompter', right: 'A · Architect', leftDesc: '지시형, 그때그때 말로', rightDesc: '설계형, 구조부터 짜기' },
  { key: 'ax2', title: '재사용 성향', left: 'F · Fresh', right: 'R · Reuse', leftDesc: '매번 새로 시작해요', rightDesc: '한 번 만들면 다시 써요' },
  { key: 'ax3', title: '맡기는 깊이', left: 'S · Surface', right: 'D · Deep', leftDesc: '얕게, 일부만 맡겨요', rightDesc: '깊이, 전반을 맡겨요' },
  { key: 'ax4', title: '검증 방식', left: 'I · Intuition', right: 'C · Criteria', leftDesc: '감으로 판단해요', rightDesc: '체크리스트로 확인해요' },
];

export default function App() {
  const [step, setStep] = useState('intro'); // intro, quiz, result
  const [answers, setAnswers] = useState(Array(12).fill(null));
  const [currentQ, setCurrentQ] = useState(0);
  const [reflection, setReflection] = useState({ surprise: '', weakest: '', want: '' });
  const [downloading, setDownloading] = useState(false);
  const resultRef = useRef(null);

  // PNG 다운로드 — 결과 페이지 전체를 그대로 캡처
  const handleDownload = async () => {
    if (!type || !resultRef.current) return;
    setDownloading(true);

    try {
      const { default: html2canvas } = await import('html2canvas-pro');

      const node = resultRef.current;
      const canvas = await html2canvas(node, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
        ignoreElements: (el) => el.getAttribute('data-html2canvas-ignore') === 'true',
      });

      const date = new Date().toISOString().slice(0, 10);
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('canvas.toBlob returned null');
        }
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `claude-diagnosis-${type.code}-${date}.png`;
        link.href = downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }, 'image/png');
    } catch (e) {
      console.error('PNG 저장 실패:', e);
      alert(
        'PNG로 저장하지 못했어요.\n\n' +
        '대신 OS 캡처를 써주세요.\n' +
        '• Mac: Cmd + Shift + 4, 스페이스바, 창 클릭\n' +
        '• Windows: Win + Shift + S\n' +
        '• Chrome 전체: F12, Cmd/Ctrl + Shift + P, "screenshot" 입력'
      );
    } finally {
      setDownloading(false);
    }
  };

  const totalScore = answers.reduce((s, a) => s + (a ? a : 0), 0);
  const part1Score = answers.slice(0, 4).reduce((s, a) => s + (a ? a : 0), 0);
  const part2Score = answers.slice(4, 8).reduce((s, a) => s + (a ? a : 0), 0);
  const part3Score = answers.slice(8, 12).reduce((s, a) => s + (a ? a : 0), 0);

  const level = useMemo(() => {
    return LEVELS.find(l => totalScore >= l.min && totalScore <= l.max) || LEVELS[0];
  }, [totalScore]);

  const type = useMemo(() => {
    if (answers.some(a => a === null)) return null;
    return classifyType(answers);
  }, [answers]);

  const weakestPart = useMemo(() => {
    const parts = [
      { num: 1, name: '기본 활용', score: part1Score, icon: Brain },
      { num: 2, name: '맡기는 깊이', score: part2Score, icon: Wrench },
      { num: 3, name: '시스템 사고', score: part3Score, icon: Network },
    ];
    return parts.sort((a, b) => a.score - b.score)[0];
  }, [part1Score, part2Score, part3Score]);

  const handleAnswer = (idx) => {
    const next = [...answers];
    next[currentQ] = idx + 1;
    setAnswers(next);
    setTimeout(() => {
      if (currentQ < 11) setCurrentQ(currentQ + 1);
      else setStep('result');
    }, 250);
  };

  const reset = () => {
    setStep('intro');
    setAnswers(Array(12).fill(null));
    setCurrentQ(0);
    setReflection({ surprise: '', weakest: '', want: '' });
  };

  return (
    <div className="min-h-screen text-zinc-100" style={{ background: '#0a0a0f', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        .grad-text {
          background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grad-border {
          background: linear-gradient(135deg, rgba(167,139,250,0.3), rgba(244,114,182,0.3));
          padding: 1px;
          border-radius: 12px;
        }
        .grad-border > div {
          background: #0f0f15;
          border-radius: 11px;
        }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .fadeIn { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .scan {
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.1), transparent);
          background-size: 200% 100%;
          animation: scan 3s linear infinite;
        }
        @keyframes scan {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* INTRO */}
        {step === 'intro' && (
          <div className="fadeIn">
            <div className="text-xs tracking-[0.3em] text-zinc-500 mb-6">CLAUDE LITERACY · SELF DIAGNOSIS</div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              나는<br />
              <span className="grad-text">Claude에게 일을 시키는</span><br />
              사람일까요?
            </h1>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              12문항, 5분이에요.<br />
              <span className="text-zinc-500">"Claude를 잘 쓰는지"가 아니라 "Claude에게 일을 잘 시키는지"를 봐요.</span>
            </p>

            <div className="grad-border mb-8">
              <div className="p-6">
                <div className="text-xs tracking-widest text-zinc-500 mb-3">WHAT YOU'LL GET</div>
                <div className="space-y-3">
                  {[
                    { icon: Sparkles, t: 'AI 활용 레벨 (1~5)', d: '탐색가부터 운영자까지, 내 위치를 알려줘요' },
                    { icon: Brain, t: '4축 유형 코드와 별명', d: 'AFDC, 검증 광인처럼 16가지 중 하나' },
                    { icon: Target, t: '약점 영역 진단', d: '기본 활용, 맡기는 깊이, 시스템 사고 중 가장 약한 곳' },
                    { icon: TrendingUp, t: '추천 학습 순서', d: '먼저 손댈 것부터 알려줘요' },
                    { icon: Zap, t: '반복 작업 후보 리스트', d: '레슨 당일에 Skill로 만들 재료가 돼요' },
                  ].map((it, i) => {
                    const Icon = it.icon;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <Icon className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-zinc-200 font-medium text-sm">{it.t}</div>
                          <div className="text-zinc-500 text-xs">{it.d}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('quiz')}
              className="w-full py-4 rounded-xl text-zinc-100 font-bold text-lg transition-all hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              진단 시작하기 <ChevronRight className="inline w-5 h-5" />
            </button>

            <div className="text-center text-xs text-zinc-600 mt-6">
              점수가 낮아도 괜찮아요. 낮을수록 배울 게 많다는 뜻이에요.
            </div>
          </div>
        )}

        {/* QUIZ */}
        {step === 'quiz' && (
          <div className="fadeIn">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs tracking-widest text-zinc-500">
                  PART {QUESTIONS[currentQ].part} · {currentQ + 1} / 12
                </div>
                <div className="text-xs text-zinc-500 mono">
                  {Math.round(((currentQ + 1) / 12) * 100)}%
                </div>
              </div>
              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 scan"
                  style={{
                    width: `${((currentQ + 1) / 12) * 100}%`,
                    background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fbbf24)',
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <div className="text-xs tracking-widest text-zinc-600 mb-3 mono">
                Q{(currentQ + 1).toString().padStart(2, '0')}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
                {QUESTIONS[currentQ].q}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {QUESTIONS[currentQ].options.map((opt, i) => {
                const isSelected = answers[currentQ] === i + 1;
                const letter = String.fromCharCode(65 + i);
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all hover:border-purple-500 hover:bg-purple-500/5 ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-zinc-800 bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mono text-sm flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center font-bold ${
                        isSelected ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {letter}
                      </div>
                      <div className="text-zinc-200 leading-relaxed text-sm md:text-base pt-1">
                        {opt}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
                disabled={currentQ === 0}
                className="text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed text-sm flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> 이전으로
              </button>
              <div className="flex gap-1">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === currentQ
                        ? 'bg-purple-500 pulse'
                        : i < currentQ || answers[i]
                        ? 'bg-zinc-600'
                        : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-zinc-600">
                답하면 다음으로 넘어가요
              </div>
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === 'result' && type && (
          <div className="fadeIn space-y-8" ref={resultRef}>

            {/* Download button - 캡처 영역 안에 두되, 캡처 시점에 숨김 */}
            <div className="flex items-center justify-between -mb-4" data-html2canvas-ignore="true">
              <div className="text-[10px] text-zinc-600 leading-snug">
                결과 페이지 전체를 PNG로 저장해요<br />
                <span className="mono text-zinc-700">저장에는 몇 초가 걸려요</span>
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 hover:border-purple-500 hover:bg-purple-500/10 text-zinc-300 text-xs font-medium transition-all disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    카드를 만들고 있어요
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    공유 카드 저장하기
                  </>
                )}
              </button>
            </div>

            {/* Hero - Total Score */}
            <div className="text-center pt-4">
              <div className="text-xs tracking-[0.3em] text-zinc-500 mb-4">YOUR DIAGNOSIS</div>
              <div className="text-7xl md:text-8xl font-black grad-text mb-2 mono">
                {totalScore}<span className="text-3xl text-zinc-600 font-normal"> / 48</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs mono tracking-widest text-zinc-500">LV.{level.num}</span>
                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                <span className="text-xs mono tracking-widest" style={{ color: level.color }}>{level.tag}</span>
              </div>
              <div className="text-3xl font-bold mb-3" style={{ color: level.color }}>
                {level.name}
              </div>
              <div className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                {level.desc}
              </div>
            </div>

            {/* Type Code Card */}
            <div className="grad-border">
              <div className="p-8">
                <div className="text-xs tracking-widest text-zinc-500 mb-4 text-center">YOUR TYPE</div>
                <div className="text-center mb-6">
                  <div className="text-6xl md:text-7xl font-black mono grad-text mb-3 tracking-wider">
                    {type.code}
                  </div>
                  <div className="text-2xl">{type.emoji}</div>
                  <div className="text-2xl font-bold text-zinc-100 mt-2">{type.name}</div>
                </div>
                <p className="text-zinc-400 text-sm text-center leading-relaxed mb-6">
                  {type.desc}
                </p>

                {/* Axes */}
                <div className="space-y-4">
                  {AXIS_INFO.map((ax) => {
                    const val = type.axes[ax.key];
                    const isLeft = val === ax.left[0];
                    return (
                      <div key={ax.key}>
                        <div className="text-xs text-zinc-500 mb-2">{ax.title}</div>
                        <div className="flex items-center gap-3">
                          <div className={`flex-1 text-xs ${isLeft ? 'text-zinc-100 font-bold' : 'text-zinc-600'}`}>
                            <div className="mono">{ax.left}</div>
                            <div className="text-[10px]">{ax.leftDesc}</div>
                          </div>
                          <div className="relative w-20 h-1 bg-zinc-800 rounded-full">
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                              style={{
                                left: isLeft ? '0%' : 'auto',
                                right: isLeft ? 'auto' : '0%',
                                background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
                              }}
                            />
                          </div>
                          <div className={`flex-1 text-xs text-right ${!isLeft ? 'text-zinc-100 font-bold' : 'text-zinc-600'}`}>
                            <div className="mono">{ax.right}</div>
                            <div className="text-[10px]">{ax.rightDesc}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Part Scores */}
            <div>
              <div className="text-xs tracking-widest text-zinc-500 mb-4">SCORE BREAKDOWN</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { num: 1, name: '기본 활용', score: part1Score, icon: Brain, hint: '프롬프트, 맥락, 재사용' },
                  { num: 2, name: '맡기는 깊이', score: part2Score, icon: Wrench, hint: '위임, 외부 기록, 재현성' },
                  { num: 3, name: '시스템 사고', score: part3Score, icon: Network, hint: '바라보는 시각, 회복력, 방향' },
                ].map((p) => {
                  const Icon = p.icon;
                  const pct = (p.score / 16) * 100;
                  const isWeak = p.num === weakestPart.num;
                  return (
                    <div
                      key={p.num}
                      className={`p-4 rounded-xl border ${
                        isWeak ? 'border-orange-500/40 bg-orange-500/5' : 'border-zinc-800 bg-zinc-900/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-2 ${isWeak ? 'text-orange-400' : 'text-zinc-500'}`} />
                      <div className="text-xs text-zinc-500 mb-1">Part {p.num}</div>
                      <div className="text-sm font-bold text-zinc-200 mb-2">{p.name}</div>
                      <div className="text-2xl font-black mono text-zinc-100">
                        {p.score}<span className="text-xs text-zinc-600">/16</span>
                      </div>
                      <div className="h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: isWeak
                              ? 'linear-gradient(90deg, #fb923c, #f97316)'
                              : 'linear-gradient(90deg, #a78bfa, #f472b6)',
                          }}
                        />
                      </div>
                      {isWeak && (
                        <div className="text-[10px] text-orange-400 mt-2 font-bold">⚠ 가장 약한 영역</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weak point analysis */}
            <div className="border border-orange-500/30 bg-orange-500/5 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <div className="text-xs tracking-widest text-orange-400">WEAK POINT</div>
              </div>
              <div className="text-xl font-bold text-zinc-100 mb-3">
                Part {weakestPart.num}. {weakestPart.name} 영역이 가장 약해요
              </div>
              <div className="text-sm text-zinc-300 leading-relaxed mb-4">
                {weakestPart.num === 1 && "프롬프트는 잘 쓰는데, 나만의 표준이 아직 없어요. 매번 즉흥으로 시작하면 결과가 들쭉날쭉해져요. 표준 하나만 정해도 단숨에 점프해요."}
                {weakestPart.num === 2 && "AI를 잘 쓰지만, 매번 처음부터 다시 시작하고 있어요. 맡기는 깊이는 있는데 그게 쌓이지 않는 게 가장 아까운 부분이에요."}
                {weakestPart.num === 3 && "도구는 잘 다루는데, 내 일을 \"시스템\"으로 보는 시각이 아직 자리잡지 못했어요. 다음 점프가 가장 크게 일어날 단계예요."}
              </div>
              <div className="text-xs text-orange-300/80 mono">
                점수 {weakestPart.score}/16 · 다른 영역보다 {Math.max(part1Score, part2Score, part3Score) - weakestPart.score}점 낮아요
              </div>
            </div>

            {/* Learning Roadmap */}
            <div>
              <div className="text-xs tracking-widest text-zinc-500 mb-4">LEARNING ROADMAP</div>
              <div className="text-2xl font-bold text-zinc-100 mb-2">먼저 뭘 손대면 좋을까요?</div>
              <div className="text-sm text-zinc-500 mb-6">가장 약한 영역에 맞춰 추천하는 순서예요</div>

              <div className="space-y-3">
                {weakestPart.num === 1 && [
                  { n: '01', t: 'User Preferences 세팅하기', d: '직무, 말투, 피해야 할 것을 한 번에 등록해두면 매번 자기소개를 하지 않아도 돼요.' },
                  { n: '02', t: 'Projects로 맥락 묶기', d: '같은 프로젝트의 대화를 한 공간에 모으면 맥락이 그대로 쌓여요.' },
                  { n: '03', t: '"규칙으로 추가하기" 습관 만들기', d: '결과가 아쉬울 때 직접 고치지 말고, 규칙으로 옮겨 적어두세요.' },
                ].map((r, i) => (
                  <div key={i} className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/50">
                    <div className="flex items-start gap-4">
                      <div className="mono text-zinc-600 font-bold text-sm pt-1">{r.n}</div>
                      <div className="flex-1">
                        <div className="font-bold text-zinc-100 text-sm mb-1">{r.t}</div>
                        <div className="text-xs text-zinc-400 leading-relaxed">{r.d}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {weakestPart.num === 2 && [
                  { n: '01', t: '반복 업무 후보 골라보기', d: '주 3회 이상 반복하는 작업 3개를 아래 섹션에 적어보세요.' },
                  { n: '02', t: '그중 1개를 "내 일의 레시피"로', d: 'SKILL.md나 Project Instruction에 그대로 옮겨 적어요.' },
                  { n: '03', t: '검증 기준 또렷이 적기', d: '"잘 되게"가 아니라 "체크리스트 4개 통과"처럼 또렷한 문장으로 적어요.' },
                ].map((r, i) => (
                  <div key={i} className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/50">
                    <div className="flex items-start gap-4">
                      <div className="mono text-zinc-600 font-bold text-sm pt-1">{r.n}</div>
                      <div className="flex-1">
                        <div className="font-bold text-zinc-100 text-sm mb-1">{r.t}</div>
                        <div className="text-xs text-zinc-400 leading-relaxed">{r.d}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {weakestPart.num === 3 && [
                  { n: '01', t: '1주일 업무를 나눠보기', d: '반복 영역과 판단 영역, 두 영역을 표로 적어봐요.' },
                  { n: '02', t: '반복 영역만 추리기', d: '그중에서 "AI에 맡길 수 있어요"에 표시해봐요.' },
                  { n: '03', t: '1개 골라 Skill로', d: '가장 자주 하고, 형식이 또렷한 작업 하나를 골라 옮겨 적기부터 시작해봐요.' },
                ].map((r, i) => (
                  <div key={i} className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/50">
                    <div className="flex items-start gap-4">
                      <div className="mono text-zinc-600 font-bold text-sm pt-1">{r.n}</div>
                      <div className="flex-1">
                        <div className="font-bold text-zinc-100 text-sm mb-1">{r.t}</div>
                        <div className="text-xs text-zinc-400 leading-relaxed">{r.d}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Repeat Task Candidate */}
            <div>
              <div className="text-xs tracking-widest text-zinc-500 mb-4">REPEAT TASK CANDIDATES</div>
              <div className="text-2xl font-bold text-zinc-100 mb-2">내 반복 작업 후보</div>
              <div className="text-sm text-zinc-500 mb-6">레슨 당일에 이 중 하나를 Skill로 만들어요</div>

              <div className="border border-zinc-800 rounded-xl bg-zinc-900/50 overflow-hidden">
                <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-zinc-800 text-[10px] tracking-widest text-zinc-500 mono">
                  <div className="col-span-1">#</div>
                  <div className="col-span-6">작업 이름</div>
                  <div className="col-span-2">빈도</div>
                  <div className="col-span-3">우선순위</div>
                </div>
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-zinc-800/50 last:border-0 text-sm">
                    <div className="col-span-1 text-zinc-600 mono">{n}</div>
                    <div className="col-span-6 text-zinc-700 italic text-xs">예: 주간 보고서 쓰기, 회의록 요약하기, 외부 메일 초안 쓰기…</div>
                    <div className="col-span-2 text-zinc-700 text-xs">__회/주</div>
                    <div className="col-span-3 text-zinc-700 text-xs">높음 / 중간 / 낮음</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <div className="text-xs tracking-widest text-purple-300 mb-2 font-bold">💡 후보를 찾는 질문</div>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  <li>· 이번 주에 같은 형식의 문서를 몇 번 썼어요?</li>
                  <li>· 동료가 "그거 어떻게 해요?"라고 물어본 적 있어요?</li>
                  <li>· "매번 톤을 다시 잡고 있어요"라고 느낀 작업이 있어요?</li>
                  <li>· 끝나고 "또 해야 하네..." 하고 한숨 쉰 작업이 있어요?</li>
                </ul>
              </div>
            </div>

            {/* Reflection */}
            <div>
              <div className="text-xs tracking-widest text-zinc-500 mb-4">REFLECTION</div>
              <div className="text-2xl font-bold text-zinc-100 mb-6">진단 후 한 줄 메모</div>
              <div className="space-y-4">
                {[
                  { key: 'surprise', q: '가장 의외였던 답이 뭐예요?', placeholder: '예: Q6에서 D를 못 골랐다는 게 의외였어요...' },
                  { key: 'weakest', q: '가장 약한 영역, 어떻게 생각해요?', placeholder: `Part ${weakestPart.num} (${weakestPart.name})에 대해 어떻게 느꼈는지 적어보세요` },
                  { key: 'want', q: '레슨에서 가장 알고 싶은 것 하나는?', placeholder: '딱 하나만 적어보세요' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs text-zinc-500 mb-2">{f.q}</label>
                    <textarea
                      value={reflection[f.key]}
                      onChange={(e) => setReflection({ ...reflection, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      rows={2}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 focus:border-purple-500 focus:outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* One-line summary */}
            <div className="text-center py-8 border-t border-zinc-800">
              <div className="text-xs tracking-widest text-zinc-500 mb-4">ONE-LINE VERDICT</div>
              <div className="text-2xl md:text-3xl font-bold text-zinc-100 leading-relaxed mb-3">
                "{level.num}단계 {level.name}, <span className="grad-text">{type.name}</span>예요."
              </div>
              <div className="text-xs text-zinc-500 mono">
                {totalScore}/48 · {type.code} · Part {weakestPart.num} weakness
              </div>
            </div>

            {/* Lesson day kit */}
            <div className="grad-border">
              <div className="p-6">
                <div className="text-xs tracking-widest text-zinc-500 mb-4">📌 레슨 당일에 가져올 것</div>
                <div className="space-y-2">
                  {[
                    `진단 결과: 총점 ${totalScore}점, 레벨 ${level.num}(${level.name}), 유형 ${type.code}`,
                    `가장 약한 영역: Part ${weakestPart.num} (${weakestPart.name})`,
                    '반복 작업 후보 리스트 (위에 적은 것, 3개 이상)',
                    '가장 알고 싶은 질문 1개',
                    '노트북 (Claude를 직접 써볼 거예요)',
                  ].map((it, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset */}
            <div className="text-center pt-4" data-html2canvas-ignore="true">
              <button
                onClick={reset}
                className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3 h-3" /> 다시 해보기
              </button>
            </div>

            <div className="text-center text-[10px] text-zinc-700 pt-8">
              CLAUDE LITERACY DIAGNOSIS · Based on Harness Engineering · Designed by Jensen
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
