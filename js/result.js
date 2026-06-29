(function () {
  const $ = (s) => document.querySelector(s);

  const result = window.Storage.get('result');
  const user = window.Storage.get('user', { common: true });
  if (!result) {
    location.replace('index.html');
    return;
  }

  // 公司名
  $('#company-name').textContent = (user && user.company) ? user.company : '匿名企业';

  // 报告标题（按测评类型）
  const meta = window.SURVEY_TYPES && window.SURVEY_TYPES[window.SURVEY_TYPE];
  if (meta) $('#report-title').textContent = meta.title + ' · 测评报告';

  // 数字格式化：整数分模式直接显示整数，否则保留 1 位小数
  const fmt = (n) => result.integerScore ? String(Math.round(n)) : n.toFixed(1);

  // 总分与等级
  $('#total-score').textContent = fmt(result.total);
  const badge = $('#grade-badge');
  badge.textContent = result.grade;
  badge.style.background = result.gradeColor || 'var(--primary)';

  const gradeDescMap = {
    '优秀': '企业各维度发展均衡且突出，已具备显著的专精特新特征，建议争取上一级认定。',
    '良好': '企业整体发展水平较好，部分维度仍有提升空间，建议针对薄弱环节重点突破。',
    '合格': '企业达到基本发展水平，建议系统性补齐短板，加大研发与品牌投入。',
    '待提升': '企业整体水平偏弱，建议梳理战略、聚焦主业，逐项夯实专精特新基础。',
  };
  $('#grade-desc').textContent = gradeDescMap[result.grade] || '';

  // 雷达图
  const radarData = result.l1Scores.map(it => ({ name: it.name, rate: it.rate }));
  // 等图层渲染完成再绘制以获取正确的尺寸
  requestAnimationFrame(() => {
    window.drawRadar($('#radar'), radarData, { color: result.gradeColor });
  });
  window.addEventListener('resize', () => {
    window.drawRadar($('#radar'), radarData, { color: result.gradeColor });
  });

  // 维度得分
  const dimEl = $('#dim-list');
  result.l1Scores.forEach(it => {
    const pct = Math.round(it.rate * 100);
    const row = document.createElement('div');
    row.className = 'dim-item';
    row.innerHTML = `
      <div class="dim-row">
        <span class="dim-name">${it.name}</span>
        <span class="dim-score">${fmt(it.score)}<span class="max"> / ${it.max}</span></span>
      </div>
      <div class="bar"><div style="width:${pct}%"></div></div>
    `;
    dimEl.appendChild(row);
  });

  // 改进建议（薄弱三级指标 Top 3）
  const adviceEl = $('#advice-list');
  const weak = window.pickWeakest(result.l3Detail, 3);
  if (weak.length === 0) {
    adviceEl.innerHTML = '<div class="text-muted center" style="padding:10px 0">暂无明显薄弱项，继续保持。</div>';
  } else {
    weak.forEach(item => {
      const pct = Math.round(item.rate * 100);
      const div = document.createElement('div');
      div.className = 'advice-item';
      div.innerHTML = `
        <span class="target">${item.l1} › ${item.name}<span class="rate-tag">达成率 ${pct}%</span></span>
        ${window.getSuggestion(item)}
      `;
      adviceEl.appendChild(div);
    });
  }

  // 操作按钮
  $('#btn-retry').addEventListener('click', () => {
    window.Storage.clearCurrent();
    location.href = 'survey.html';
  });
  $('#btn-back-home').addEventListener('click', () => {
    location.href = 'index.html';
  });
})();
