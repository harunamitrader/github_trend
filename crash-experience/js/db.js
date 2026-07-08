/* db.js — IndexedDB: バーデータ永続化
   store 'chunks' key [symbol, day] → {symbol, day:'20220103', bars:[[t,bo,bh,bl,bc,ao,ah,al,ac],...]}
   store 'symbols' key symbol → {code, name, cat, days:[...]}                                  */
CX.db = (function () {
  let db = null;

  function open() {
    return new Promise((res, rej) => {
      if (db) return res(db);
      const rq = indexedDB.open('crashx', 1);
      rq.onupgradeneeded = e => {
        const d = e.target.result;
        d.createObjectStore('chunks', { keyPath: ['symbol', 'day'] });
        d.createObjectStore('symbols', { keyPath: 'code' });
      };
      rq.onsuccess = e => { db = e.target.result; res(db); };
      rq.onerror = e => rej(e.target.error);
    });
  }
  function tx(store, mode) {
    return open().then(d => d.transaction(store, mode).objectStore(store));
  }
  function done(t) {
    return new Promise((res, rej) => {
      t.oncomplete = res;
      t.onerror = e => rej(e.target.error);
    });
  }

  return {
    async putChunk(chunk) {
      const st = await tx('chunks', 'readwrite');
      st.put(chunk);
      return done(st.transaction);
    },
    async getChunk(symbol, day) {
      const st = await tx('chunks', 'readonly');
      return new Promise((res, rej) => {
        const rq = st.get([symbol, day]);
        rq.onsuccess = () => res(rq.result || null);
        rq.onerror = e => rej(e.target.error);
      });
    },
    async putSymbol(meta) {
      const st = await tx('symbols', 'readwrite');
      st.put(meta);
      return done(st.transaction);
    },
    async getSymbols() {
      const st = await tx('symbols', 'readonly');
      return new Promise((res, rej) => {
        const rq = st.getAll();
        rq.onsuccess = () => res(rq.result || []);
        rq.onerror = e => rej(e.target.error);
      });
    },
    async getBars(symbol, fromT, toT) { // 範囲内の全バーを時刻順で返す
      const st = await tx('chunks', 'readonly');
      return new Promise((res, rej) => {
        const rq = st.getAll(IDBKeyRange.bound([symbol, ''], [symbol, '￿']));
        rq.onsuccess = () => {
          const chunks = (rq.result || []).sort((a, b) => a.day < b.day ? -1 : 1);
          const out = [];
          for (const c of chunks) for (const r of c.bars) {
            if (r[0] >= fromT && r[0] <= toT) out.push(r);
          }
          res(out);
        };
        rq.onerror = e => rej(e.target.error);
      });
    },
    async deleteSymbol(symbol) {
      const st = await tx('chunks', 'readwrite');
      st.delete(IDBKeyRange.bound([symbol, ''], [symbol, '￿']));
      await done(st.transaction);
      const st2 = await tx('symbols', 'readwrite');
      st2.delete(symbol);
      return done(st2.transaction);
    }
  };
})();
