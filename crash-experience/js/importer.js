/* importer.js — GMOヒストリカルデータ (zip / csv) 取込
   CSV形式: 日時,始値(BID),高値(BID),安値(BID),終値(BID),始値(ASK),高値(ASK),安値(ASK),終値(ASK)
   日時 = YYYYMMDDHHMM (JST) / エンコーディング = Shift-JIS or UTF-8
   日別ファイル(SYMBOL_YYYYMMDD.csv)と複数日ファイル(USTEC_2020_sub1.csv等)の両方に対応し、
   内部では常に日別チャンクへ分割して保存する                                              */
CX.importer = (function () {

  /* unit: 1枚あたり「価格×unit」の通貨額 / ccy: 建値通貨（USDはシナリオのfxで円換算） */
  const KNOWN = {
    USTECMINI: { name: '米国NQ100ミニ', cat: 'index', unit: 0.1, ccy: 'USD' },
    USTEC:     { name: '米国NQ100',     cat: 'index', unit: 1,   ccy: 'USD' },
    US30:      { name: '米国30',        cat: 'index', unit: 1,   ccy: 'USD' },
    US500:     { name: '米国S500',      cat: 'index', unit: 1,   ccy: 'USD' },
    JP225:     { name: '日経225',       cat: 'index', unit: 10,  ccy: 'JPY' },
    JPN225:    { name: '日経225',       cat: 'index', unit: 10,  ccy: 'JPY' },
    NIKKEI225: { name: '日経225',       cat: 'index', unit: 10,  ccy: 'JPY' },
    GOLD:      { name: '金スポット',    cat: 'commodity', unit: 10, ccy: 'USD' },
    SILVER:    { name: '銀スポット',    cat: 'commodity', unit: 50, ccy: 'USD' },
    WTI:       { name: '原油',          cat: 'commodity', unit: 10, ccy: 'USD' },
    OIL:       { name: '原油',          cat: 'commodity', unit: 10, ccy: 'USD' }
  };

  function decode(buf) {
    const u8 = new TextDecoder('utf-8', { fatal: false }).decode(buf);
    if (u8.slice(0, 40).includes('日時') || /^\d{12},/.test(u8)) return u8;
    try { return new TextDecoder('shift_jis').decode(buf); } catch (e) { return u8; }
  }

  /* CSV 1ファイル → 日別チャンク配列 */
  function parseCsv(name, buf) {
    const text = decode(buf);
    const lines = text.split(/\r?\n/);
    const base = name.replace(/^.*[\\/]/, '');
    const m = base.match(/^([A-Za-z0-9]+?)_/);
    const symbol = m ? m[1].toUpperCase() : 'UNKNOWN';
    const byDay = new Map();
    for (const line of lines) {
      if (!/^\d{12},/.test(line)) continue;
      const c = line.split(',');
      if (c.length < 5) continue;
      const t = CX.parseYmdHm(c[0]);
      const bo = +c[1], bh = +c[2], bl = +c[3], bc = +c[4];
      let ao, ah, al, ac;
      if (c.length >= 9 && c[5] !== '') { ao = +c[5]; ah = +c[6]; al = +c[7]; ac = +c[8]; }
      else {
        const sp = bc * 0.0005;
        ao = bo + sp; ah = bh + sp; al = bl + sp; ac = bc + sp;
      }
      if ([bo, bh, bl, bc, ao, ah, al, ac].some(isNaN)) continue;
      const day = c[0].slice(0, 8);
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day).push([t, bo, bh, bl, bc, ao, ah, al, ac]);
    }
    if (!byDay.size) return null;
    const chunks = [];
    for (const [day, bars] of byDay) {
      bars.sort((a, b) => a[0] - b[0]);
      chunks.push({ symbol, day, bars });
    }
    return chunks;
  }

  async function importFiles(files, onLog) {
    const touched = {}; // symbol → Set(days)
    const pending = new Map(); // 'SYM|day' → bars（同一日チャンクは取込内でマージ）
    let nFiles = 0, nBars = 0;
    for (const f of files) {
      const buf = new Uint8Array(await f.arrayBuffer());
      const entries = [];
      if (/\.zip$/i.test(f.name)) {
        let unzipped;
        try { unzipped = fflate.unzipSync(buf); }
        catch (e) { onLog(f.name + ' → ZIP展開失敗', 'err'); continue; }
        for (const [path, data] of Object.entries(unzipped)) {
          if (/\.csv$/i.test(path) && data.length) entries.push({ name: path, buf: data });
        }
      } else if (/\.csv$/i.test(f.name)) {
        entries.push({ name: f.name, buf });
      } else {
        onLog(f.name + ' → 対象外の形式', 'err'); continue;
      }
      for (const en of entries) {
        const chunks = parseCsv(en.name, en.buf);
        if (!chunks) { onLog(en.name + ' → 解析失敗（形式不一致）', 'err'); continue; }
        for (const chunk of chunks) {
          const key = chunk.symbol + '|' + chunk.day;
          if (!pending.has(key)) pending.set(key, []);
          pending.get(key).push(...chunk.bars);
          nBars += chunk.bars.length;
        }
        nFiles++;
      }
      onLog(f.name + ' → OK', 'ok');
    }
    // 既存チャンクとマージして保存（日をまたぐファイルの上書き欠落を防ぐ）
    for (const [key, bars] of pending) {
      const [symbol, day] = key.split('|');
      const prev = await CX.db.getChunk(symbol, day);
      if (prev) bars.push(...prev.bars);
      const seen = new Set();
      const merged = bars.filter(b => seen.has(b[0]) ? false : (seen.add(b[0]), true))
        .sort((a, b) => a[0] - b[0]);
      await CX.db.putChunk({ symbol, day, bars: merged });
      (touched[symbol] = touched[symbol] || new Set()).add(day);
    }
    const existing = await CX.db.getSymbols();
    for (const [code, daysSet] of Object.entries(touched)) {
      const prev = existing.find(s => s.code === code);
      const days = new Set(prev ? prev.days : []);
      daysSet.forEach(d => days.add(d));
      const info = KNOWN[code] || { name: code, cat: 'index' };
      await CX.db.putSymbol({ code, name: info.name, cat: info.cat, days: [...days].sort() });
    }
    return { nFiles, nBars, symbols: Object.keys(touched) };
  }

  return { importFiles, KNOWN };
})();
