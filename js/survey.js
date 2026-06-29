(function () {
  const $ = (s) => document.querySelector(s);
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1500);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // 校验用户信息
  const user = window.Storage.get('user', { common: true });
  if (!user) { location.replace('index.html'); return; }
  // 校验题库（防止异常情况下 INDICATORS 为空）
  if (!window.INDICATORS || !window.INDICATORS.length) { location.replace('index.html'); return; }

  // 拍平为题目列表
  const questions = [];
  for (const l1 of window.INDICATORS) {
    for (const l2 of l1.children) {
      for (const l3 of l2.children) {
        questions.push({ l1: l1.name, l2: l2.name, l3 });
      }
    }
  }
  const TOTAL = questions.length;
  $('#total-num').textContent = TOTAL;

  let answers = window.Storage.get('answers') || {};
  let cur = 0;
  // 断点续答：跳到第一个未作答的题
  for (let i = 0; i < TOTAL; i++) {
    if (!window.isAnswered(questions[i].l3, answers[questions[i].l3.id])) { cur = i; break; }
    if (i === TOTAL - 1) cur = i;
  }

  function saveAndRefreshNext() {
    window.Storage.set('answers', answers);
    $('#btn-next').disabled = !window.isAnswered(curQ().l3, answers[curQ().l3.id]);
  }
  function curQ() { return questions[cur]; }

  /* ============== 渲染：每个题型 ============== */

  function renderSingle(q) {
    const cur_coef = answers[q.id];
    let html = '<div class="options">';
    q.options.forEach((opt) => {
      const selected = cur_coef === opt.coef;
      html += `
        <div class="option${selected ? ' selected' : ''}" data-coef="${opt.coef}">
          <span class="dot"></span><span>${esc(opt.label)}</span>
        </div>`;
    });
    html += '</div>';
    return html;
  }

  function renderMulti(q) {
    const cur_arr = Array.isArray(answers[q.id]) ? answers[q.id] : [];
    let html = '<div class="options">';
    q.options.forEach((opt) => {
      const checked = cur_arr.indexOf(opt.label) !== -1;
      html += `
        <div class="option${checked ? ' selected' : ''}" data-label="${esc(opt.label)}" data-exclusive="${opt.exclusive ? '1' : '0'}">
          <span class="box${checked ? ' on' : ''}"></span><span>${esc(opt.label)}</span>
        </div>`;
    });
    html += '</div>';
    return html;
  }

  function renderNumber(q) {
    const cur_v = answers[q.id] != null ? answers[q.id] : '';
    return `
      <div class="input-wrap">
        <div class="num-input">
          <input type="number" id="num-input" value="${esc(cur_v)}"
                 placeholder="${esc(q.placeholder || '请输入')}"
                 min="${q.min != null ? q.min : ''}" max="${q.max != null ? q.max : ''}"
                 inputmode="decimal" step="any">
          ${q.unit ? `<span class="unit">${esc(q.unit)}</span>` : ''}
        </div>
      </div>`;
  }

  function renderCompound(q) {
    const cur_obj = (answers[q.id] && typeof answers[q.id] === 'object') ? answers[q.id] : {};
    let html = '<div class="compound">';
    q.fields.forEach((f) => {
      const hidden = f.dependsOn && cur_obj[f.dependsOn] !== f.dependsValue;
      const v = cur_obj[f.key] != null ? cur_obj[f.key] : '';
      html += `<div class="cf-row${hidden ? ' hidden' : ''}" data-key="${esc(f.key)}" data-depends-on="${esc(f.dependsOn || '')}" data-depends-value="${esc(f.dependsValue || '')}">
        <div class="cf-label">${esc(f.label)}</div>`;
      if (f.type === 'yesno') {
        html += `<div class="yesno">
          <button type="button" class="yesno-btn${v === 'yes' ? ' on' : ''}" data-val="yes">是</button>
          <button type="button" class="yesno-btn${v === 'no' ? ' on' : ''}" data-val="no">否</button>
        </div>`;
      } else {
        html += `<div class="num-input">
          <input type="number" class="cf-input" value="${esc(v)}" placeholder="${esc(f.placeholder || '0')}" inputmode="decimal" step="any">
          ${f.unit ? `<span class="unit">${esc(f.unit)}</span>` : ''}
        </div>`;
      }
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderInput(q) {
    if (q.type === 'single') return renderSingle(q);
    if (q.type === 'multi') return renderMulti(q);
    if (q.type === 'number') return renderNumber(q);
    if (q.type === 'compound') return renderCompound(q);
    return '';
  }

  /* ============== 绑定：每个题型的交互 ============== */

  function bindSingle(q) {
    document.querySelectorAll('#input-area .option').forEach(el => {
      el.addEventListener('click', () => {
        const coef = parseFloat(el.getAttribute('data-coef'));
        answers[q.id] = coef;
        saveAndRefreshNext();
        // 刷新选中态
        document.querySelectorAll('#input-area .option').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        // 单选自动跳下一题（最后一题不跳）
        if (cur < TOTAL - 1) setTimeout(() => { cur++; render(); window.scrollTo(0, 0); }, 220);
      });
    });
  }

  function bindMulti(q) {
    document.querySelectorAll('#input-area .option').forEach(el => {
      el.addEventListener('click', () => {
        const label = el.getAttribute('data-label');
        const exclusive = el.getAttribute('data-exclusive') === '1';
        let arr = Array.isArray(answers[q.id]) ? [...answers[q.id]] : [];
        const idx = arr.indexOf(label);
        if (idx >= 0) {
          arr.splice(idx, 1);
        } else {
          if (exclusive) {
            arr = [label]; // 互斥项：清空其它
          } else {
            // 去掉已有的互斥项
            const exLabels = q.options.filter(o => o.exclusive).map(o => o.label);
            arr = arr.filter(x => exLabels.indexOf(x) === -1);
            arr.push(label);
          }
        }
        answers[q.id] = arr;
        saveAndRefreshNext();
        // 重新渲染多选高亮
        document.querySelectorAll('#input-area .option').forEach(e => {
          const on = arr.indexOf(e.getAttribute('data-label')) !== -1;
          e.classList.toggle('selected', on);
          const box = e.querySelector('.box');
          if (box) box.classList.toggle('on', on);
        });
      });
    });
  }

  function bindNumber(q) {
    const input = document.getElementById('num-input');
    if (!input) return;
    input.addEventListener('input', () => {
      let v = input.value;
      // 限制范围（仅在最终生效时夹，输入过程中允许中间状态）
      answers[q.id] = v;
      saveAndRefreshNext();
    });
  }

  function bindCompound(q) {
    const root = document.querySelector('#input-area .compound');
    if (!root) return;
    function readAll() {
      const obj = (answers[q.id] && typeof answers[q.id] === 'object') ? { ...answers[q.id] } : {};
      q.fields.forEach(f => {
        const row = root.querySelector(`.cf-row[data-key="${f.key}"]`);
        if (!row) return;
        if (f.type === 'yesno') {
          const on = row.querySelector('.yesno-btn.on');
          obj[f.key] = on ? on.getAttribute('data-val') : undefined;
        } else {
          const inp = row.querySelector('.cf-input');
          obj[f.key] = inp ? inp.value : '';
        }
      });
      answers[q.id] = obj;
    }
    function refreshDependsVisibility() {
      const cur_obj = answers[q.id] || {};
      q.fields.forEach(f => {
        if (!f.dependsOn) return;
        const row = root.querySelector(`.cf-row[data-key="${f.key}"]`);
        if (!row) return;
        row.classList.toggle('hidden', cur_obj[f.dependsOn] !== f.dependsValue);
      });
    }
    // yesno 按钮
    root.querySelectorAll('.yesno-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.cf-row');
        row.querySelectorAll('.yesno-btn').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        readAll();
        refreshDependsVisibility();
        saveAndRefreshNext();
      });
    });
    // 数字输入
    root.querySelectorAll('.cf-input').forEach(inp => {
      inp.addEventListener('input', () => {
        readAll();
        saveAndRefreshNext();
      });
    });
  }

  function bindInput(q) {
    if (q.type === 'single') bindSingle(q);
    else if (q.type === 'multi') bindMulti(q);
    else if (q.type === 'number') bindNumber(q);
    else if (q.type === 'compound') bindCompound(q);
  }

  /* ============== 主渲染 ============== */
  function render() {
    const q = curQ();
    const l3 = q.l3;

    $('#cur-idx').textContent = cur + 1;
    $('#progress-fill').style.width = `${((cur + 1) / TOTAL) * 100}%`;
    $('#breadcrumb').innerHTML = `<b>${esc(q.l1)}</b> › ${esc(q.l2)}`;
    $('#q-title').textContent = `${cur + 1}. ${l3.name}`;
    $('#q-meta').innerHTML = `<div>${esc(l3.question)}</div>`;
    $('#input-area').innerHTML = renderInput(l3);
    bindInput(l3);

    $('#btn-prev').disabled = cur === 0;
    const isLast = cur === TOTAL - 1;
    $('#btn-next').textContent = isLast ? '提交测评' : '下一题';
    $('#btn-next').disabled = !window.isAnswered(l3, answers[l3.id]);
  }

  $('#btn-prev').addEventListener('click', () => {
    if (cur > 0) { cur--; render(); window.scrollTo(0, 0); }
  });
  $('#btn-next').addEventListener('click', async () => {
    const q = curQ();
    if (!window.isAnswered(q.l3, answers[q.l3.id])) { toast('请先完成本题作答'); return; }
    if (cur < TOTAL - 1) {
      cur++; render(); window.scrollTo(0, 0);
    } else {
      $('#btn-next').disabled = true;
      $('#btn-next').textContent = '提交中...';
      try {
        const result = await window.API.submitAnswers({ userInfo: user, answers });
        window.Storage.set('result', { ...result, finishedAt: Date.now() });
        location.href = 'result.html';
      } catch (e) {
        toast('提交失败：' + (e.message || '未知错误'));
        $('#btn-next').disabled = false;
        $('#btn-next').textContent = '提交测评';
      }
    }
  });
  $('#btn-back').addEventListener('click', () => {
    if (confirm('返回会保留当前答题进度，确定吗？')) location.href = 'index.html';
  });

  render();
})();
