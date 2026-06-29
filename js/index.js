(function () {
  const $ = (s) => document.querySelector(s);
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  // ---------- 测评类型选择 ----------
  let selectedType = null;
  function selectType(type) {
    selectedType = type;
    sessionStorage.setItem('survey_type', type);
    // 切换题库
    window.SURVEY_TYPE = type;
    window.INDICATORS = window[window.SURVEY_TYPES[type].bank];

    // 高亮选中卡片
    document.querySelectorAll('.picker-card').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-type') === type);
    });

    // 渲染介绍区
    const meta = window.SURVEY_TYPES[type];
    $('#intro-title').textContent = '关于：' + meta.title;
    $('#intro-desc').textContent = meta.desc;
    const total = window.INDICATORS.reduce(
      (s, l1) => s + l1.children.reduce((a, l2) => a + l2.children.length, 0), 0);
    $('#tag-count').textContent = `共 ${total} 题`;
    $('#tag-time').textContent = type === 'cert' ? '预计 5-8 分钟' : '预计 10-15 分钟';

    $('#intro').style.display = '';
    $('#form-card').style.display = '';
    $('#footer-actions').style.display = '';

    // 滚动到表单
    setTimeout(() => {
      $('#form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  document.querySelectorAll('.picker-card').forEach(card => {
    card.addEventListener('click', () => selectType(card.getAttribute('data-type')));
  });

  // 回填上次的用户信息（user 跨测评类型共享）
  const saved = window.Storage.get('user', { common: true });
  if (saved) {
    $('#company').value = saved.company || '';
    $('#name').value = saved.name || '';
    $('#phone').value = saved.phone || '';
  }

  // 默认不选中任何类型；若 session 里之前选过，回显
  const prev = sessionStorage.getItem('survey_type');
  if (prev === 'eval' || prev === 'cert') selectType(prev);

  function validate() {
    if (!selectedType) { toast('请先选择测评类型'); return null; }
    const company = $('#company').value.trim();
    const name = $('#name').value.trim();
    const phone = $('#phone').value.trim();
    if (!company) { toast('请输入企业名称'); $('#company').focus(); return null; }
    if (!name) { toast('请输入联系人姓名'); $('#name').focus(); return null; }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      $('#phone-err').textContent = '请输入正确的 11 位手机号';
      $('#phone').focus();
      return null;
    }
    $('#phone-err').textContent = '';
    return { company, name, phone, startedAt: Date.now() };
  }

  $('#phone').addEventListener('input', () => { $('#phone-err').textContent = ''; });

  $('#btn-start').addEventListener('click', () => {
    const userInfo = validate();
    if (!userInfo) return;
    window.Storage.set('user', userInfo, { common: true });
    // 开始新测评，清掉当前类型的旧答案与结果
    window.Storage.clearCurrent();
    location.href = 'survey.html';
  });
})();
