/**
 * API 层：Mock + 预留真实接口
 * 切换 USE_MOCK = false 即走真实后端
 */
window.API_CONFIG = {
  USE_MOCK: true,
  BASE_URL: '',
};

window.API = {
  async getQuestionnaire() {
    if (window.API_CONFIG.USE_MOCK) {
      // 模拟网络延迟
      await new Promise(r => setTimeout(r, 50));
      return window.INDICATORS;
    }
    const res = await fetch(window.API_CONFIG.BASE_URL + '/api/questionnaire');
    if (!res.ok) throw new Error('获取题库失败');
    return res.json();
  },

  async submitAnswers(payload /* { userInfo, answers } */) {
    if (window.API_CONFIG.USE_MOCK) {
      await new Promise(r => setTimeout(r, 300));
      return window.computeResult(payload.answers, window.INDICATORS);
    }
    const res = await fetch(window.API_CONFIG.BASE_URL + '/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('提交失败');
    return res.json();
  },
};
