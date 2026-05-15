import React, { useState, useMemo, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Target, TrendingUp, Zap, AlertCircle, CheckCircle2, RotateCcw, Brain, Wrench, Network, Download, Loader2 } from 'lucide-react';

const QUESTIONS = [
  {
    part: 1,
    q: "새로운 작업을 시킬 때, 어떻게 시작하나요?",
    options: [
      "그때그때 머릿속에 떠오르는 대로 입력한다",
      "어떤 형식으로 받고 싶은지 미리 말한다",
      "역할·맥락·원하는 형식을 구조화해서 전달한다",
      "미리 만들어둔 프롬프트 템플릿이 있다",
    ],
  },
  {
    part: 1,
    q: "같은 종류의 작업을 다시 할 때, 어떻게 하나요?",
    options: [
      "새 채팅창에서 처음부터 다시 설명한다",
      "이전 채팅창을 찾아서 이어간다",
      "이전 대화를 복사해서 새 채팅창에 넣고 시작한다",
      "Projects나 저장된 프롬프트로 한 번에 호출한다",
    ],
  },
  {
    part: 1,
    q: "Claude의 결과물이 마음에 안 들 때, 어떻게 하나요?",
    options: [
      "그냥 본인이 손으로 30~50%를 다시 고친다",
      "\"더 잘 만들어줘\"라고 다시 시킨다",
      "구체적으로 어디가 어떻게 부족한지 짚어서 다시 시킨다",
      "다음번엔 같은 실수가 안 나오도록 지시문에 규칙을 추가한다",
    ],
  },
  {
    part: 1,
    q: "Claude에게 본인을 어떻게 소개하고 있나요?",
    options: [
      "매번 새 채팅창에서 다시 설명한다",
      "가끔 자기소개를 한다",
      "User Preferences 또는 Custom Instructions에 한 번 등록해뒀다",
      "직무·말투·금기사항까지 명시적으로 등록해뒀다",
    ],
  },
  {
    part: 2,
    q: "본인의 반복 업무 중, AI에 위임한 비율은?",
    options: [
      "거의 없음 — AI는 가끔 도움받는 정도",
      "글쓰기·번역 같은 일부만 위임",
      "자료 정리·분석·요약 등 여러 영역에서 위임",
      "정해진 형식이 있는 작업은 거의 다 AI를 통해 처리",
    ],
  },
  {
    part: 2,
    q: "Claude에게 \"내 일의 방식\"을 가르친 적이 있나요?",
    options: [
      "그게 가능한 줄 몰랐다",
      "가끔 톤이나 형식을 알려주긴 한다",
      "자주 쓰는 문서 형식·용어집 같은 걸 만들어 공유한다",
      "작업별 가이드/체크리스트를 만들어두고 매번 호출한다",
    ],
  },
  {
    part: 2,
    q: "Claude가 만든 결과물의 \"끝났다\"는 기준은?",
    options: [
      "내가 보기에 그럴듯하면 끝",
      "몇 번 다시 시키다가 적당한 시점에 끝",
      "사전에 체크리스트가 있고 그걸로 확인한다",
      "Claude에게 자가검증까지 시키고, 그 결과를 보고 판단",
    ],
  },
  {
    part: 2,
    q: "다른 사람이 본인 방식을 그대로 재현할 수 있나요?",
    options: [
      "아니요 — 나만의 감각으로 한다",
      "말로 설명은 할 수 있지만 문서는 없다",
      "일부는 문서화되어 있다",
      "가이드/템플릿으로 정리되어 있어 누구나 같은 결과를 낼 수 있다",
    ],
  },
  {
    part: 3,
    q: "\"이 작업, AI한테 시킬 수 있겠다\"고 알아채는 능력은?",
    options: [
      "누가 알려주면 그때 깨닫는 정도",
      "글쓰기·번역 같은 명확한 영역만 알아챈다",
      "평소에 \"이건 자동화할 수 있겠다\"고 자주 생각한다",
      "새 작업을 받으면 거의 반사적으로 AI 분담 비율부터 본다",
    ],
  },
  {
    part: 3,
    q: "본인의 일을 \"시스템\"으로 보는 시각이 있나요?",
    options: [
      "그냥 닥치는 대로 처리하는 편",
      "자주 하는 작업은 머릿속에 순서가 있다",
      "일부 작업은 문서/체크리스트로 만들어뒀다",
      "본인 일을 \"반복 시스템 + 판단 영역\"으로 명확히 구분한다",
    ],
  },
  {
    part: 3,
    q: "Claude에 한계를 느꼈을 때, 다음 행동은?",
    options: [
      "포기하고 손으로 한다",
      "다른 AI(ChatGPT 등)로 같은 걸 시켜본다",
      "프롬프트나 입력 방식을 바꿔서 다시 시도",
      "왜 안 됐는지 분석해서 다음번에 어떻게 줄지 설계 변경",
    ],
  },
  {
    part: 3,
    q: "1년 뒤 본인의 AI 활용 모습은?",
    options: [
      "아직 잘 모르겠다",
      "지금보다 더 많이, 더 다양하게 쓰고 싶다",
      "본인만의 작업 시스템을 만들고 싶다",
      "동료들에게 본인 방식을 전파하는 사람이 되고 싶다",
    ],
  },
];

const LEVELS = [
  { min: 12, max: 18, name: "탐색가", num: 1, tag: "EXPLORER", color: "#94a3b8", desc: "Claude를 가끔 쓰는 단계. AI가 \"어디까지 되는지\" 아직 손에 안 잡혔어요." },
  { min: 19, max: 26, name: "사용자", num: 2, tag: "USER", color: "#60a5fa", desc: "일상에 Claude를 끌어들였지만, 매번 처음부터 설명하느라 같은 말을 반복하고 있어요." },
  { min: 27, max: 34, name: "활용가", num: 3, tag: "OPERATOR", color: "#a78bfa", desc: "Claude를 본인 일에 맞춰 쓸 줄 알아요. 다음 점프는 \"매번 시키지 않는\" 영역이에요." },
  { min: 35, max: 42, name: "설계자", num: 4, tag: "ARCHITECT", color: "#f472b6", desc: "이미 본인 방식을 Claude에 외화하기 시작했어요. 시스템 사고가 자리잡는 중." },
  { min: 43, max: 48, name: "운영자", num: 5, tag: "OPERATOR-X", color: "#fbbf24", desc: "Claude를 쓰는 사람이 아니라 Claude가 일하는 환경을 만드는 사람. 동료가 당신을 따라해요." },
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
    PFSI: { name: "감각의 즉흥파", emoji: "🎲", desc: "그때그때 머리에 떠오르는 대로 Claude한테 던지고, 결과는 감으로 판단해요. 빠르긴 한데 매번 다시 시작하는 게 함정." },
    PFSC: { name: "체크리스트 즉흥파", emoji: "📋", desc: "즉흥적으로 시키지만 결과는 꼼꼼히 본다. 시스템이 없을 뿐이지 기준은 있어요." },
    PFDI: { name: "위임 본능러", emoji: "🚀", desc: "일단 많이 시키긴 하는데, 매번 새로 설명하고 감으로 받아내는 타입. 효율의 누수가 큰 영역." },
    PFDC: { name: "기준 있는 임시 운영자", emoji: "🎯", desc: "위임도 잘하고 검증 기준도 있는데, 매번 처음부터 다시 설정한다. 시스템화 1단계가 시급." },
    PRSI: { name: "절약형 재활용러", emoji: "♻️", desc: "이전 대화를 잘 챙겨두는 알뜰파. 검증은 직관으로. 효율은 좋은데 일관성이 약해요." },
    PRSC: { name: "꼼꼼한 재활용러", emoji: "📦", desc: "재사용도 하고 검증도 하지만, 위임은 표면적. AI를 \"보조\"로만 쓰는 단계." },
    PRDI: { name: "감각의 운영자", emoji: "🎨", desc: "많이 위임하고 자료도 모아두지만, 결과 판단은 감으로. 기준만 명시하면 단숨에 점프할 사람." },
    PRDC: { name: "안정형 활용가", emoji: "⚙️", desc: "위임·재사용·검증 다 챙기지만, 아직 \"내가 시키는\" 단계. 다음은 환경을 설계하는 단계예요." },
    AFSI: { name: "구조 짜는 즉흥가", emoji: "🧩", desc: "프롬프트는 잘 짜는데 매번 새로 짠다. 결과는 감으로 본다. \"한 번 잘 짠 걸 또 짠다\"는 함정." },
    AFSC: { name: "원샷 완벽주의자", emoji: "🎼", desc: "한 번 짤 때 완벽하게 짜는데, 다음에 또 처음부터. 외화만 시작하면 폭발적으로 성장할 타입." },
    AFDI: { name: "직관의 아키텍트", emoji: "🌪️", desc: "설계 능력은 있는데 매번 새로 설계. 위임 깊이도 있지만 검증은 감. 가장 성장 잠재력이 큰 자리." },
    AFDC: { name: "검증 광인", emoji: "🔬", desc: "설계도 잘하고 검증도 철저한데, 재사용 시스템이 없어 매번 새로 만든다. 가장 아까운 타입." },
    ARSI: { name: "스마트 재활용가", emoji: "🎯", desc: "구조·재사용까지는 잘하는데 위임 깊이와 검증이 약해요. 한 발만 더 들어가면 설계자." },
    ARSC: { name: "체계의 사용자", emoji: "🗂️", desc: "체계는 잡혔는데 위임 범위가 좁아요. \"이것까지 시켜도 되나?\" 싶은 영역에 도전할 때." },
    ARDI: { name: "느낌의 설계자", emoji: "✨", desc: "거의 다 갖췄는데 \"끝의 기준\"이 머릿속에만 있어요. 검증 기준을 외화하면 곧 운영자." },
    ARDC: { name: "환경 설계자", emoji: "🏛️", desc: "Claude를 쓰는 사람이 아니라 환경을 만드는 사람. 동료가 당신 방식을 배우는 단계." },
  };

  return { code, ...names[code], axes: { ax1, ax2, ax3, ax4 } };
}

const AXIS_INFO = [
  { key: 'ax1', title: '접근 방식', left: 'P · Prompter', right: 'A · Architect', leftDesc: '지시형 — 그때그때 말로', rightDesc: '설계형 — 구조 먼저' },
  { key: 'ax2', title: '재사용 성향', left: 'F · Fresh', right: 'R · Reuse', leftDesc: '매번 새로 시작', rightDesc: '한 번 만들면 재활용' },
  { key: 'ax3', title: '위임 깊이', left: 'S · Surface', right: 'D · Deep', leftDesc: '표면적 — 일부만', rightDesc: '깊이 — 전반적으로' },
  { key: 'ax4', title: '검증 방식', left: 'I · Intuition', right: 'C · Criteria', leftDesc: '직관 — 감으로 판단', rightDesc: '기준 — 체크리스트로' },
];

export default function App() {
  const [step, setStep] = useState('intro'); // intro, quiz, result
  const [answers, setAnswers] = useState(Array(12).fill(null));
  const [currentQ, setCurrentQ] = useState(0);
  const [reflection, setReflection] = useState({ surprise: '', weakest: '', want: '' });
  const [downloading, setDownloading] = useState(false);
  const resultRef = useRef(null);

  // PNG 다운로드 — Canvas에 직접 그리기 (외부 의존성 0, 모든 환경에서 작동)
  const handleDownload = async () => {
    if (!type) return;
    setDownloading(true);

    try {
      // 1080x1920 세로 카드 (인스타 스토리/공유 최적)
      const W = 1080;
      const H = 1920;
      const scale = 1;

      const canvas = document.createElement('canvas');
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);

      // === 배경 ===
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, W, H);

      // 배경 그라데이션 글로우 (상단)
      const bgGrad = ctx.createRadialGradient(W/2, 0, 0, W/2, 0, W);
      bgGrad.addColorStop(0, 'rgba(167,139,250,0.15)');
      bgGrad.addColorStop(1, 'rgba(10,10,15,0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // === 헤더 라벨 ===
      ctx.fillStyle = '#71717a';
      ctx.font = '600 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText('CLAUDE LITERACY · SELF DIAGNOSIS', W/2, 120);

      // === 메인 점수 (그라데이션) ===
      const scoreGrad = ctx.createLinearGradient(0, 200, W, 350);
      scoreGrad.addColorStop(0, '#a78bfa');
      scoreGrad.addColorStop(0.5, '#f472b6');
      scoreGrad.addColorStop(1, '#fbbf24');

      ctx.fillStyle = scoreGrad;
      ctx.font = 'bold 200px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${totalScore}`, W/2 - 40, 360);

      ctx.fillStyle = '#52525b';
      ctx.font = '400 60px sans-serif';
      ctx.fillText('/ 48', W/2 + 130, 360);

      // === 레벨 태그 ===
      ctx.fillStyle = '#71717a';
      ctx.font = '600 24px monospace';
      const tagText = `LV.${level.num}  ·  ${level.tag}`;
      ctx.fillText(tagText, W/2, 430);

      // === 레벨 이름 ===
      ctx.fillStyle = level.color;
      ctx.font = 'bold 80px sans-serif';
      ctx.fillText(level.name, W/2, 530);

      // === 레벨 설명 ===
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '400 28px sans-serif';
      wrapText(ctx, level.desc, W/2, 595, W - 200, 42);

      // === 구분선 ===
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 770);
      ctx.lineTo(W - 80, 770);
      ctx.stroke();

      // === TYPE 카드 영역 ===
      // 카드 배경
      ctx.fillStyle = '#0f0f15';
      roundRect(ctx, 80, 820, W - 160, 580, 24);
      ctx.fill();

      // 카드 테두리 (그라데이션)
      ctx.strokeStyle = 'rgba(167,139,250,0.3)';
      ctx.lineWidth = 2;
      roundRect(ctx, 80, 820, W - 160, 580, 24);
      ctx.stroke();

      // YOUR TYPE 라벨
      ctx.fillStyle = '#71717a';
      ctx.font = '600 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('YOUR TYPE', W/2, 880);

      // 유형 코드 (큰 모노스페이스)
      const codeGrad = ctx.createLinearGradient(0, 900, W, 1020);
      codeGrad.addColorStop(0, '#a78bfa');
      codeGrad.addColorStop(0.5, '#f472b6');
      codeGrad.addColorStop(1, '#fbbf24');
      ctx.fillStyle = codeGrad;
      ctx.font = 'bold 160px monospace';
      ctx.fillText(type.code, W/2, 1020);

      // 이모지
      ctx.fillStyle = '#fff';
      ctx.font = '80px sans-serif';
      ctx.fillText(type.emoji, W/2, 1110);

      // 유형 별명
      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText(type.name, W/2, 1190);

      // 유형 설명
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '400 26px sans-serif';
      wrapText(ctx, type.desc, W/2, 1260, W - 240, 38);

      // === Part 점수 3개 ===
      const parts = [
        { name: '기본 활용', score: part1Score, isWeak: weakestPart.num === 1 },
        { name: '위임 깊이', score: part2Score, isWeak: weakestPart.num === 2 },
        { name: '시스템 사고', score: part3Score, isWeak: weakestPart.num === 3 },
      ];

      ctx.fillStyle = '#71717a';
      ctx.font = '600 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCORE BREAKDOWN', W/2, 1500);

      const partW = 280;
      const partH = 200;
      const partGap = 30;
      const totalPartsW = partW * 3 + partGap * 2;
      const partStartX = (W - totalPartsW) / 2;

      parts.forEach((p, i) => {
        const x = partStartX + i * (partW + partGap);
        const y = 1540;

        // 카드 배경
        ctx.fillStyle = p.isWeak ? 'rgba(251,146,60,0.08)' : '#18181b';
        roundRect(ctx, x, y, partW, partH, 16);
        ctx.fill();

        // 테두리
        ctx.strokeStyle = p.isWeak ? 'rgba(251,146,60,0.4)' : '#27272a';
        ctx.lineWidth = 1.5;
        roundRect(ctx, x, y, partW, partH, 16);
        ctx.stroke();

        // Part 이름
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '600 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.name, x + partW/2, y + 50);

        // 점수
        ctx.fillStyle = p.isWeak ? '#fb923c' : '#fafafa';
        ctx.font = 'bold 64px monospace';
        ctx.fillText(`${p.score}`, x + partW/2 - 30, y + 130);

        ctx.fillStyle = '#52525b';
        ctx.font = '400 22px sans-serif';
        ctx.fillText('/16', x + partW/2 + 50, y + 130);

        // 프로그레스 바
        const barW = partW - 60;
        const barX = x + 30;
        const barY = y + 160;
        ctx.fillStyle = '#27272a';
        roundRect(ctx, barX, barY, barW, 6, 3);
        ctx.fill();

        const fillW = (p.score / 16) * barW;
        const barGrad = ctx.createLinearGradient(barX, barY, barX + fillW, barY);
        if (p.isWeak) {
          barGrad.addColorStop(0, '#fb923c');
          barGrad.addColorStop(1, '#f97316');
        } else {
          barGrad.addColorStop(0, '#a78bfa');
          barGrad.addColorStop(1, '#f472b6');
        }
        ctx.fillStyle = barGrad;
        roundRect(ctx, barX, barY, fillW, 6, 3);
        ctx.fill();

        // 약점 배지
        if (p.isWeak) {
          ctx.fillStyle = '#fb923c';
          ctx.font = '700 14px sans-serif';
          ctx.fillText('⚠ 약점 영역', x + partW/2, y + 190);
        }
      });

      // === 한 줄 총평 ===
      ctx.fillStyle = '#71717a';
      ctx.font = '600 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ONE-LINE VERDICT', W/2, 1810);

      // 인용문
      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 32px sans-serif';
      const verdict = `"Lv.${level.num} ${level.name}, ${type.name}"`;
      ctx.fillText(verdict, W/2, 1860);

      // === 푸터 ===
      ctx.fillStyle = '#3f3f46';
      ctx.font = '400 18px monospace';
      const date = new Date().toISOString().slice(0, 10);
      ctx.fillText(`${date}  ·  ${type.code}  ·  Part ${weakestPart.num} weakness`, W/2, 1900);

      // === 다운로드 ===
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
        'PNG 자동 저장에 실패했어요.\n\n' +
        '대신 OS 캡처를 사용해주세요:\n' +
        '• Mac: Cmd+Shift+4 → 스페이스바 → 창 클릭\n' +
        '• Windows: Win+Shift+S\n' +
        '• Chrome 전체: F12 → Cmd/Ctrl+Shift+P → "screenshot"'
      );
    } finally {
      setDownloading(false);
    }
  };

  // 헬퍼: 둥근 사각형
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // 헬퍼: 텍스트 자동 줄바꿈
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split('');
    let line = '';
    let currentY = y;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

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
      { num: 2, name: '일에 활용하는 깊이', score: part2Score, icon: Wrench },
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
              너,<br />
              <span className="grad-text">Claude에게 일을 시키는</span><br />
              사람이야?
            </h1>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              12개 문항, 5분.<br />
              <span className="text-zinc-500">"Claude를 잘 쓰는가"가 아니라 "Claude에게 일을 잘 시키는가"를 봐요.</span>
            </p>

            <div className="grad-border mb-8">
              <div className="p-6">
                <div className="text-xs tracking-widest text-zinc-500 mb-3">WHAT YOU'LL GET</div>
                <div className="space-y-3">
                  {[
                    { icon: Sparkles, t: 'AI 활용 레벨 (1~5)', d: '탐색가 → 운영자 중 어디?' },
                    { icon: Brain, t: '4축 유형 코드 + 별명', d: 'AFDC · 검증 광인 같은 16가지 중 1' },
                    { icon: Target, t: '약점 영역 진단', d: '기본기·위임 깊이·시스템 사고 중 약점' },
                    { icon: TrendingUp, t: '추천 학습 순서', d: '뭐부터 손대야 할지' },
                    { icon: Zap, t: '반복 작업 후보 리스트', d: '레슨 당일 Skill 만들 재료' },
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
              진단 시작 <ChevronRight className="inline w-5 h-5" />
            </button>

            <div className="text-center text-xs text-zinc-600 mt-6">
              점수가 낮아도 부끄러워할 필요 없어요. 낮을수록 배울 게 많다는 뜻.
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
                <ChevronLeft className="w-4 h-4" /> 이전
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
                답하면 자동 진행
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
                공유용 1080×1920 카드로 저장돼요<br />
                <span className="mono text-zinc-700">전체 페이지는 OS 캡처 사용</span>
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 hover:border-purple-500 hover:bg-purple-500/10 text-zinc-300 text-xs font-medium transition-all disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    카드 생성 중...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    공유 카드 저장
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
                  { num: 1, name: '기본 활용', score: part1Score, icon: Brain, hint: '프롬프트 · 맥락 · 재사용' },
                  { num: 2, name: '위임 깊이', score: part2Score, icon: Wrench, hint: '위임 · 외화 · 재현성' },
                  { num: 3, name: '시스템 사고', score: part3Score, icon: Network, hint: '시각 · 회복력 · 방향' },
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
                        <div className="text-[10px] text-orange-400 mt-2 font-bold">⚠ 약점 영역</div>
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
                Part {weakestPart.num}. {weakestPart.name}이(가) 가장 약해요
              </div>
              <div className="text-sm text-zinc-300 leading-relaxed mb-4">
                {weakestPart.num === 1 && "프롬프트는 잘 쓰는데, 본인만의 표준이 없어요. 매번 즉흥적으로 시작하니까 결과의 일관성이 떨어집니다."}
                {weakestPart.num === 2 && "AI를 잘 쓰지만 \"매번 처음부터\" 시작해요. 위임 깊이는 있는데 그게 누적되지 않는 게 가장 큰 손실."}
                {weakestPart.num === 3 && "도구는 잘 다루는데 본인 일을 \"시스템\"으로 보는 시각이 아직 없어요. 다음 점프가 가장 큰 단계."}
              </div>
              <div className="text-xs text-orange-300/80 mono">
                점수 {weakestPart.score}/16 — 다른 영역보다 {Math.max(part1Score, part2Score, part3Score) - weakestPart.score}점 낮음
              </div>
            </div>

            {/* Learning Roadmap */}
            <div>
              <div className="text-xs tracking-widest text-zinc-500 mb-4">LEARNING ROADMAP</div>
              <div className="text-2xl font-bold text-zinc-100 mb-2">먼저 뭘 손대야 할까?</div>
              <div className="text-sm text-zinc-500 mb-6">약점 영역 기반 추천 순서예요</div>

              <div className="space-y-3">
                {weakestPart.num === 1 && [
                  { n: '01', t: 'User Preferences 세팅', d: '직무·말투·금기사항을 한 번에 등록. 매번 자기소개 안 해도 됨.' },
                  { n: '02', t: 'Projects로 맥락 묶기', d: '같은 프로젝트의 대화는 한 공간에. 컨텍스트가 누적됨.' },
                  { n: '03', t: '"규칙으로 추가하기" 습관', d: '결과물 불만족 → 손으로 고치지 말고 규칙으로 외화.' },
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
                  { n: '01', t: '반복 업무 후보 추출', d: '주 3회 이상 반복하는 작업 3개 적기 (아래 섹션 활용).' },
                  { n: '02', t: '그중 1개를 \"내 일의 레시피\"로', d: 'SKILL.md 또는 Project Instruction으로 외화.' },
                  { n: '03', t: '검증 기준 명시', d: '"잘 되게"가 아니라 "체크리스트 4개 통과"로.' },
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
                  { n: '01', t: '1주일 업무를 분류', d: '반복 영역 vs 판단 영역. 두 영역을 표로 적어보기.' },
                  { n: '02', t: '반복 영역만 추리기', d: '그중 \"AI 분담 가능\" 영역에 표시.' },
                  { n: '03', t: '1개 골라 Skill로', d: '가장 자주·가장 형식 명확한 것 하나 → 외화 시작.' },
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
              <div className="text-sm text-zinc-500 mb-6">레슨 당일 이 중 하나를 Skill로 만들 거예요</div>

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
                    <div className="col-span-6 text-zinc-700 italic text-xs">예: 주간 보고서 작성 / 회의록 요약 / 외부 이메일 초안 …</div>
                    <div className="col-span-2 text-zinc-700 text-xs">__/주</div>
                    <div className="col-span-3 text-zinc-700 text-xs">High / Med / Low</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <div className="text-xs tracking-widest text-purple-300 mb-2 font-bold">💡 후보 발견 질문</div>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  <li>· 이번 주에 같은 형식의 문서를 몇 번 썼나요?</li>
                  <li>· 동료가 "그거 어떻게 하는 거예요?"라고 물어본 적이 있나요?</li>
                  <li>· "매번 톤을 다시 잡는다"고 느낀 작업이 있나요?</li>
                  <li>· 끝나고 "또 해야 되네…" 한숨 쉰 작업이 있나요?</li>
                </ul>
              </div>
            </div>

            {/* Reflection */}
            <div>
              <div className="text-xs tracking-widest text-zinc-500 mb-4">REFLECTION</div>
              <div className="text-2xl font-bold text-zinc-100 mb-6">진단 후 한 줄 메모</div>
              <div className="space-y-4">
                {[
                  { key: 'surprise', q: '가장 의외였던 답은?', placeholder: '예: Q6에서 D를 못 골랐다는 게 충격…' },
                  { key: 'weakest', q: '약점 영역에 대한 본인 생각은?', placeholder: `Part ${weakestPart.num} (${weakestPart.name})에 대해…` },
                  { key: 'want', q: '레슨에서 가장 알고 싶은 것 하나?', placeholder: '딱 하나만 적어보세요' },
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
                "{level.num}단계 {level.name}, <span className="grad-text">{type.name}</span>."
              </div>
              <div className="text-xs text-zinc-500 mono">
                {totalScore}/48 · {type.code} · Part {weakestPart.num} weakness
              </div>
            </div>

            {/* Lesson day kit */}
            <div className="grad-border">
              <div className="p-6">
                <div className="text-xs tracking-widest text-zinc-500 mb-4">📌 레슨 당일 가져올 것</div>
                <div className="space-y-2">
                  {[
                    `진단 결과: 총점 ${totalScore}, 레벨 ${level.num} (${level.name}), 유형 ${type.code}`,
                    `약점 영역: Part ${weakestPart.num} (${weakestPart.name})`,
                    '반복 작업 후보 리스트 (최소 3개 — 위에 적은 것)',
                    '가장 알고 싶은 질문 1개',
                    '노트북 (Claude 직접 사용)',
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
                <RotateCcw className="w-3 h-3" /> 다시 진단하기
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
