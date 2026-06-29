/**
 * 评分算法（多题型）
 * answers[Qxx] 结构：
 *   single   → number （选中项的 coef）
 *   multi    → string[] （选项 label 数组）
 *   number   → string|number （原始填空值）
 *   compound → object  （各字段值）
 *
 * 输出：{ total, grade, gradeColor, l1Scores: [{id, name, score, max, rate}], l3Detail: [...] }
 */
(function () {
  function getGrade(total) {
    const t = window.GRADE_THRESHOLDS || [];
    for (const g of t) if (total >= g.min) return g;
    return { label: '待提升', color: '#e95252' };
  }

  function coefOf(q, ans) {
    if (ans === undefined || ans === null) return 0;
    switch (q.type) {
      case 'single': {
        return typeof ans === 'number' ? ans : 0;
      }
      case 'multi': {
        if (!Array.isArray(ans) || ans.length === 0) return 0;
        let sum = 0;
        for (const lbl of ans) {
          const opt = (q.options || []).find(o => o.label === lbl);
          if (opt) sum += opt.coef || 0;
        }
        return Math.max(0, Math.min(1, sum));
      }
      case 'number':
      case 'compound': {
        try { return Math.max(0, Math.min(1, q.score(ans))); }
        catch (e) { return 0; }
      }
      default: return 0;
    }
  }

  window.computeResult = function (answers, indicators) {
    indicators = indicators || window.INDICATORS;
    const meta = window.SURVEY_TYPES && window.SURVEY_TYPES[window.SURVEY_TYPE];
    const integerScore = !!(meta && meta.integerScore);
    const round = integerScore
      ? (n) => Math.round(n)
      : (n) => +n.toFixed(2);

    const l1Scores = [];
    const l3Detail = [];
    let total = 0;

    for (const l1 of indicators) {
      let l1Score = 0;
      for (const l2 of l1.children) {
        for (const l3 of l2.children) {
          const coef = coefOf(l3, answers[l3.id]);
          const raw = coef * l3.weight;
          const s = round(raw);
          l1Score += s;
          l3Detail.push({
            l1: l1.name, l2: l2.name, id: l3.id, name: l3.name,
            score: s, max: l3.weight, rate: l3.weight ? s / l3.weight : 0,
          });
        }
      }
      const score = round(l1Score);
      l1Scores.push({
        id: l1.id, name: l1.name,
        score, max: l1.weight,
        rate: l1.weight ? score / l1.weight : 0,
      });
      total += l1Score;
    }
    total = round(total);
    const g = getGrade(total);
    return { total, grade: g.label, gradeColor: g.color, l1Scores, l3Detail, integerScore };
  };

  /** 判断一个答案是否已经"作答完成"，用于「下一题」按钮可用性 */
  window.isAnswered = function (q, ans) {
    if (ans === undefined || ans === null) return false;
    switch (q.type) {
      case 'single':
        return typeof ans === 'number';
      case 'multi':
        return Array.isArray(ans) && ans.length > 0;
      case 'number': {
        const s = String(ans).trim();
        return s !== '' && !isNaN(+s);
      }
      case 'compound': {
        if (typeof ans !== 'object') return false;
        for (const f of q.fields) {
          // 若有依赖：当依赖字段值不匹配时该字段可不填
          if (f.dependsOn && ans[f.dependsOn] !== f.dependsValue) continue;
          if (f.type === 'yesno') {
            if (ans[f.key] !== 'yes' && ans[f.key] !== 'no') return false;
          } else {
            const v = ans[f.key];
            if (v === undefined || v === null || String(v).trim() === '' || isNaN(+v)) return false;
          }
        }
        return true;
      }
      default: return false;
    }
  };

  window.pickWeakest = function (l3Detail, n) {
    return [...l3Detail].sort((a, b) => a.rate - b.rate).slice(0, n || 3);
  };
})();
