/* scenarios.js — シナリオ定義（七面鳥構成: 助走→崩壊→結末）と充足判定 */
CX.scenarios = (function () {

  const PRESETS = [
    {
      id: 'rate-shock-2022jan',
      title: '利上げショック・序章',
      period: '2022年1月',
      symbols: ['USTECMINI', 'USTEC'],
      desc: '静かな高値圏から、じわじわと削られ、最後の月曜に叩き落とされる。ナンピンが最も報われない相場。',
      anonymize: true,
      fx: 115, // 2022/1 のドル円近似（米ドル建て銘柄の円換算に使用）
      phases: {
        warmup:   { from: '2022-01-03T08:00', to: '2022-01-14T07:00', speed: 3600 },
        crash:    { from: '2022-01-14T08:00', to: '2022-01-25T07:00', speed: 600 },
        epilogue: { from: '2022-01-25T08:00', to: '2022-01-31T23:59', speed: 3600 }
      }
    },
    {
      id: 'corona-2020',
      title: 'コロナショック',
      period: '2020年2〜4月',
      symbols: ['JP225', 'JPN225', 'NIKKEI225'],
      desc: '史上最速の弱気相場入り。連日の窓開けと「もう底だろう」の連続敗北。',
      anonymize: true,
      phases: {
        warmup:   { from: '2020-01-20T08:00', to: '2020-02-21T07:00', speed: 3600 },
        crash:    { from: '2020-02-21T08:00', to: '2020-03-19T15:00', speed: 600 },
        epilogue: { from: '2020-03-19T15:01', to: '2020-04-10T15:00', speed: 3600 }
      }
    },
    {
      id: 'black-monday-2024',
      title: '令和のブラックマンデー',
      period: '2024年8月',
      symbols: ['JP225', 'JPN225', 'NIKKEI225'],
      desc: '日経平均、史上最大の下げ幅。円キャリー崩壊。退場までは、一瞬。',
      anonymize: true,
      phases: {
        warmup:   { from: '2024-07-11T08:00', to: '2024-08-01T07:00', speed: 3600 },
        crash:    { from: '2024-08-01T08:00', to: '2024-08-06T07:00', speed: 300 },
        epilogue: { from: '2024-08-06T08:00', to: '2024-08-16T15:00', speed: 3600 }
      }
    }
  ];

  /* シンボルの取込済みデータでシナリオが遊べるか。
     判定: crashフェーズの営業日のうち1日以上 かつ warmupのうち1日以上 のデータがある */
  function availability(sc, symbolMetas) {
    for (const code of sc.symbols) {
      const meta = symbolMetas.find(s => s.code === code);
      if (!meta) continue;
      const has = phase => {
        const f = CX.parseIso(phase.from), t = CX.parseIso(phase.to);
        return meta.days.some(d => {
          const dt = CX.parseYmdHm(d + '0000');
          return dt >= f - 86400000 && dt <= t;
        });
      };
      if (has(sc.phases.warmup) && has(sc.phases.crash)) return { ok: true, symbol: code };
    }
    return { ok: false };
  }

  /* カスタム: 取込済みシンボルの全期間を 30/40/30 で3フェーズに割る */
  function customFor(meta) {
    const first = CX.parseYmdHm(meta.days[0] + '0000');
    const last = CX.parseYmdHm(meta.days[meta.days.length - 1] + '2359');
    const span = last - first;
    const iso = t => {
      const d = new Date(t);
      return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
        String(d.getUTCDate()).padStart(2, '0') + 'T' + String(d.getUTCHours()).padStart(2, '0') +
        ':' + String(d.getUTCMinutes()).padStart(2, '0');
    };
    return {
      id: 'custom-' + meta.code,
      title: 'フリー再生',
      period: CX.fmtDate(first) + ' 〜 ' + CX.fmtDate(last),
      symbols: [meta.code],
      desc: meta.name + ' の取込済み全期間を再生します。',
      anonymize: true,
      custom: true,
      fx: 150, // ドル円の近似固定値（米ドル建て銘柄のみ使用）
      phases: {
        warmup:   { from: iso(first), to: iso(first + span * 0.3), speed: 3600 },
        crash:    { from: iso(first + span * 0.3), to: iso(first + span * 0.7), speed: 600 },
        epilogue: { from: iso(first + span * 0.7), to: iso(last), speed: 3600 }
      }
    };
  }

  return { PRESETS, availability, customFor };
})();
