/**
 * localStorage 工具：带 24h TTL；按当前测评类型隔离 key
 * 命名空间：spnx_<survey_type>_<key>，common 类（如 user）放在 spnx__<key>
 */
(function () {
  const PREFIX = 'spnx_';
  const TTL = 24 * 60 * 60 * 1000;

  function currentType() {
    try {
      const v = sessionStorage.getItem('survey_type');
      if (v === 'cert' || v === 'eval') return v;
    } catch (e) {}
    return '';
  }

  function fullKey(key, opts) {
    const t = (opts && opts.common) ? '' : (opts && opts.type) || currentType();
    return PREFIX + t + '_' + key;
  }

  function set(key, val, opts) {
    try {
      localStorage.setItem(fullKey(key, opts), JSON.stringify({ _t: Date.now(), v: val }));
    } catch (e) {}
  }
  function get(key, opts) {
    try {
      const raw = localStorage.getItem(fullKey(key, opts));
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || typeof obj._t !== 'number') return null;
      if (Date.now() - obj._t > TTL) {
        localStorage.removeItem(fullKey(key, opts));
        return null;
      }
      return obj.v;
    } catch (e) { return null; }
  }
  function remove(key, opts) {
    try { localStorage.removeItem(fullKey(key, opts)); } catch (e) {}
  }
  function clearAll() {
    try {
      Object.keys(localStorage)
        .filter(k => k.indexOf(PREFIX) === 0)
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }
  /** 清当前测评类型下的进度（answers / result），保留 user */
  function clearCurrent() {
    remove('answers');
    remove('result');
  }

  window.Storage = { set, get, remove, clearAll, clearCurrent };
})();
