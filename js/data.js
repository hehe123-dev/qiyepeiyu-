/**
 * 题库（双套）
 *
 * 题型：
 *   single  - 单选
 *   multi   - 多选（coef 取所选 coef 之和，clamp 到 [0,1]）
 *   number  - 数字/百分比填空，由 score(value) 计算 coef
 *   compound- 多字段填空（数字 / 是否 + 数字），由 score(values) 计算 coef
 *
 * 两套题库通过 window.SURVEY_TYPE 切换：
 *   'eval' - 中小企业专精特新发展评价（27 题，详见 INDICATORS_EVAL）
 *   'cert' - 专精特新中小企业认定标准（13 题，详见 INDICATORS_CERT）
 */
window.INDICATORS_EVAL = [
  /* ============ 一级维度 1：专业化（权重 15） ============ */
  {
    id: 'L1_01', name: '专业化', weight: 15,
    children: [{
      id: 'L2_01_01', name: '业务专注',
      children: [
        {
          id: 'Q01', name: '从事细分市场年限', weight: 8,
          type: 'number',
          question: '截至上一年度末，贵企业持续从事当前主营细分市场领域的年限为多少年？',
          unit: '年', placeholder: '请输入年限', min: 0, max: 200,
          score(v) { v = +v || 0; if (v >= 10) return 1; if (v >= 5) return 0.7; if (v >= 2) return 0.4; return 0; },
        },
        {
          id: 'Q02', name: '细分行业营收排名', weight: 7,
          type: 'number',
          question: '贵企业近三年营业收入均值，在全省同行业小微企业（含省级专精特新中小企业）中的平均排名位次为多少？',
          unit: '名', placeholder: '请输入排名位次', min: 1, max: 999999,
          score(v) { v = +v || 9999; if (v <= 5) return 1; if (v <= 20) return 0.75; if (v <= 50) return 0.5; if (v <= 100) return 0.25; return 0; },
        },
      ],
    }],
  },

  /* ============ 一级维度 2：精细化（权重 10） ============ */
  {
    id: 'L1_02', name: '精细化', weight: 10,
    children: [{
      id: 'L2_02_01', name: '管理与数字化',
      children: [
        {
          id: 'Q09', name: '企业获得质量管理体系认证情况', weight: 6,
          type: 'single',
          question: '贵企业当前获得的质量管理体系认证 / 质量等级评价的最高等级为以下哪一项？',
          options: [
            { label: 'A. 获得国家级质量奖 / 质量管理能力等级评测特级', coef: 1 },
            { label: 'B. 质量管理能力等级评测一级', coef: 0.8 },
            { label: 'C. 质量管理能力等级评测二级', coef: 0.6 },
            { label: 'D. 获得 ISO9001 等基础质量管理体系认证', coef: 0.3 },
            { label: 'E. 未获得任何相关认证 / 评价', coef: 0 },
          ],
        },
        {
          id: 'Q12', name: '数字化转型测评得分', weight: 4,
          type: 'multi',
          question: '贵企业是否符合以下数字化转型相关认定？（可多选）',
          options: [
            { label: 'A. 获评智能工厂、5G 工厂等数字化场景相关称号', coef: 0.4 },
            { label: 'B. 通过两化融合管理体系贯标', coef: 0.3 },
            { label: 'C. 依据《中小企业数字化转型指南 (2022 年版)》自评，数字化转型测评得分高于行业平均水平', coef: 0.3 },
            { label: 'D. 未获得上述任何相关认定', coef: 0, exclusive: true },
          ],
        },
      ],
    }],
  },

  /* ============ 一级维度 3：特色化（权重 10） ============ */
  {
    id: 'L1_03', name: '特色化', weight: 10,
    children: [{
      id: 'L2_03_01', name: '产品与品牌特色',
      children: [
        {
          id: 'Q10', name: '产品获得权威机构认证情况', weight: 4,
          type: 'single',
          question: '贵企业的主营产品是否获得发达国家 / 地区权威机构的相关认证？',
          options: [
            { label: 'A. 是，已获得发达国家 / 地区权威机构认证', coef: 1 },
            { label: 'B. 否，未获得相关认证', coef: 0 },
          ],
        },
        {
          id: 'Q13', name: '绿色化标杆', weight: 4,
          type: 'multi',
          question: '贵企业是否获得以下绿色低碳制造示范称号？（可多选）',
          options: [
            { label: 'A. 绿色工厂', coef: 0.25 },
            { label: 'B. 绿色供应链管理企业', coef: 0.2 },
            { label: 'C. 绿色产品', coef: 0.2 },
            { label: 'D. 能效领跑者称号', coef: 0.15 },
            { label: 'E. 环保等级评价相关认证', coef: 0.1 },
            { label: 'F. 节水企业相关称号', coef: 0.1 },
            { label: 'G. 未获得上述任何相关称号', coef: 0, exclusive: true },
          ],
        },
        {
          id: 'Q27', name: '是否被列入实体清单', weight: 2,
          type: 'single',
          question: '贵企业是否被列入实体清单，或是否需要产业救济？',
          options: [
            { label: 'A. 是，被列入实体清单 / 需要产业救济', coef: 1 },
            { label: 'B. 否', coef: 0 },
          ],
        },
      ],
    }],
  },

  /* ============ 一级维度 4：创新能力（权重 35） ============ */
  {
    id: 'L1_04', name: '创新能力', weight: 35,
    children: [
      {
        id: 'L2_04_01', name: '知识产权',
        children: [
          {
            id: 'Q03', name: '发明专利集中度', weight: 3,
            type: 'number',
            question: '贵企业拥有的全部授权发明专利中，属于同一技术大类的发明专利数量占总发明专利数量的比例为多少？',
            unit: '%', placeholder: '请输入百分比（0-100）', min: 0, max: 100,
            score(v) { v = +v || 0; if (v >= 70) return 1; if (v >= 50) return 0.75; if (v >= 30) return 0.5; if (v > 0) return 0.25; return 0; },
          },
          {
            id: 'Q14', name: 'PCT 专利数量', weight: 4,
            type: 'number',
            question: '贵企业当前持有的有效 PCT 专利总数量为多少？',
            unit: '件', placeholder: '请输入件数', min: 0, max: 99999,
            score(v) { v = +v || 0; if (v >= 5) return 1; if (v >= 3) return 0.75; if (v >= 1) return 0.5; return 0; },
          },
          {
            id: 'Q18', name: '发明专利数量（加权）', weight: 5,
            type: 'compound',
            question: '请分别填写：贵企业近三年获得的授权发明专利数量为多少件？更早年份获得的有效授权发明专利数量为多少件？',
            fields: [
              { key: 'recent', label: '近三年授权发明专利', unit: '件', placeholder: '0' },
              { key: 'earlier', label: '更早年份有效授权发明专利', unit: '件', placeholder: '0' },
            ],
            score(v) {
              const r = +v.recent || 0, e = +v.earlier || 0;
              const s = r * 1.0 + e * 0.5;
              if (s >= 20) return 1; if (s >= 10) return 0.75; if (s >= 5) return 0.5; if (s >= 1) return 0.25; return 0;
            },
          },
          {
            id: 'Q19', name: '发明专利网络集中度', weight: 3,
            type: 'number',
            question: '贵企业授权发明专利的技术关联度（专利引用网络中心度）为多少？',
            unit: '', placeholder: '请输入数值', min: 0, max: 100,
            score(v) { v = +v || 0; if (v >= 0.5) return 1; if (v >= 0.3) return 0.75; if (v >= 0.1) return 0.5; if (v > 0) return 0.25; return 0; },
          },
        ],
      },
      {
        id: 'L2_04_02', name: '标准与奖项',
        children: [
          {
            id: 'Q04', name: '主持或参与制订国标/行标/团标数量', weight: 4,
            type: 'compound',
            question: '贵企业累计主持或参与制修订的国家标准、行业标准、团体标准总数量为多少？（请分别填写）',
            fields: [
              { key: 'nLead', label: '主持国标数', unit: '项', placeholder: '0' },
              { key: 'nJoin', label: '参与国标数', unit: '项', placeholder: '0' },
              { key: 'hLead', label: '主持行标数', unit: '项', placeholder: '0' },
              { key: 'hJoin', label: '参与行标数', unit: '项', placeholder: '0' },
              { key: 'tLead', label: '主持团标数', unit: '项', placeholder: '0' },
              { key: 'tJoin', label: '参与团标数', unit: '项', placeholder: '0' },
            ],
            score(v) {
              const s = (+v.nLead||0)*3 + (+v.nJoin||0)*1.5 + (+v.hLead||0)*2 + (+v.hJoin||0)*1 + (+v.tLead||0)*1 + (+v.tJoin||0)*0.5;
              if (s >= 15) return 1; if (s >= 8) return 0.75; if (s >= 3) return 0.5; if (s > 0) return 0.25; return 0;
            },
          },
          {
            id: 'Q17', name: '科技奖项情况', weight: 4,
            type: 'single',
            question: '贵企业获得的科技奖项最高等级为以下哪一项？',
            options: [
              { label: 'A. 获得国家级科技奖项', coef: 1 },
              { label: 'B. 获得省部级科技奖项', coef: 0.7 },
              { label: 'C. 获得省级以下科技奖项', coef: 0.4 },
              { label: 'D. 未获得任何科技奖项', coef: 0 },
            ],
          },
        ],
      },
      {
        id: 'L2_04_03', name: '研发投入与机构',
        children: [
          {
            id: 'Q15', name: '研发投入', weight: 4,
            type: 'number',
            question: '贵企业近三年研发费用的年均总额为多少万元？',
            unit: '万元', placeholder: '请输入金额', min: 0, max: 9999999,
            score(v) { v = +v || 0; if (v >= 2000) return 1; if (v >= 500) return 0.75; if (v >= 100) return 0.5; if (v >= 20) return 0.25; return 0; },
          },
          {
            id: 'Q16', name: '研发投入占比', weight: 4,
            type: 'number',
            question: '贵企业近三年研发投入占营业收入的年均比例为多少？',
            unit: '%', placeholder: '请输入百分比（0-100）', min: 0, max: 100,
            score(v) { v = +v || 0; if (v >= 8) return 1; if (v >= 5) return 0.75; if (v >= 3) return 0.5; if (v >= 1) return 0.25; return 0; },
          },
          {
            id: 'Q20', name: '研发机构建设水平', weight: 2,
            type: 'single',
            question: '贵企业当前建设的研发机构最高等级为以下哪一项？',
            options: [
              { label: 'A. 拥有国家级实验室 / 研发中心', coef: 1 },
              { label: 'B. 拥有省级实验室 / 研发中心', coef: 0.7 },
              { label: 'C. 自建企业级实验室 / 研发中心', coef: 0.4 },
              { label: 'D. 未建设任何研发机构', coef: 0 },
            ],
          },
          {
            id: 'Q21', name: '研发人员数量', weight: 2,
            type: 'number',
            question: '贵企业当前在职的研发人员总数量为多少人？',
            unit: '人', placeholder: '请输入人数', min: 0, max: 999999,
            score(v) { v = +v || 0; if (v >= 100) return 1; if (v >= 30) return 0.75; if (v >= 10) return 0.5; if (v >= 3) return 0.25; return 0; },
          },
        ],
      },
    ],
  },

  /* ============ 一级维度 5：经营效益（权重 15） ============ */
  {
    id: 'L1_05', name: '经营效益', weight: 15,
    children: [{
      id: 'L2_05_01', name: '效益指标',
      children: [
        {
          id: 'Q05', name: '人均营业收入超出行业均值情况', weight: 3,
          type: 'compound',
          question: '贵企业近三年人均营业收入的均值为多少？该数值与全省同行业专精特新小微企业近三年人均营业收入均值的差值为多少？',
          fields: [
            { key: 'self', label: '本企业人均营收均值', unit: '万元/人', placeholder: '0' },
            { key: 'diff', label: '与行业均值差值', unit: '万元/人', placeholder: '正负数' },
          ],
          score(v) {
            const d = +v.diff || 0;
            if (d >= 50) return 1; if (d >= 20) return 0.75; if (d >= 0) return 0.5; if (d >= -20) return 0.25; return 0;
          },
        },
        {
          id: 'Q06', name: '净资产收益率超出行业均值情况', weight: 3,
          type: 'compound',
          question: '贵企业近三年净资产收益率的均值为多少？该数值与全省同行业专精特新小微企业近三年净资产收益率均值的差值为多少？',
          fields: [
            { key: 'self', label: '本企业 ROE 均值', unit: '%', placeholder: '0' },
            { key: 'diff', label: '与行业均值差值', unit: '%', placeholder: '正负数' },
          ],
          score(v) {
            const d = +v.diff || 0;
            if (d >= 10) return 1; if (d >= 3) return 0.75; if (d >= 0) return 0.5; if (d >= -5) return 0.25; return 0;
          },
        },
        {
          id: 'Q07', name: '成本利润率超出行业均值情况', weight: 3,
          type: 'compound',
          question: '贵企业近三年成本利润率的均值为多少？该数值与全省同行业小微企业近三年成本利润率均值的差值为多少？',
          fields: [
            { key: 'self', label: '本企业成本利润率均值', unit: '%', placeholder: '0' },
            { key: 'diff', label: '与行业均值差值', unit: '%', placeholder: '正负数' },
          ],
          score(v) {
            const d = +v.diff || 0;
            if (d >= 10) return 1; if (d >= 3) return 0.75; if (d >= 0) return 0.5; if (d >= -5) return 0.25; return 0;
          },
        },
        {
          id: 'Q08', name: '销售和管理费用率超出行业均值情况', weight: 3,
          type: 'compound',
          question: '贵企业近三年销售费用与管理费用合计占营业收入的年均比例为多少？该数值与全省同行业小微企业该项年均比例的差值为多少？',
          fields: [
            { key: 'self', label: '本企业销管费用率均值', unit: '%', placeholder: '0' },
            { key: 'diff', label: '与行业均值差值', unit: '%', placeholder: '正负数（负数更好）' },
          ],
          score(v) {
            const d = +v.diff || 0;
            if (d <= -5) return 1; if (d <= -2) return 0.75; if (d <= 0) return 0.5; if (d <= 3) return 0.25; return 0;
          },
        },
        {
          id: 'Q11', name: '毛利率超出行业均值情况', weight: 3,
          type: 'compound',
          question: '贵企业近三年毛利率的均值为多少？该数值与全省同行业小微企业近三年毛利率均值的差值为多少？',
          fields: [
            { key: 'self', label: '本企业毛利率均值', unit: '%', placeholder: '0' },
            { key: 'diff', label: '与行业均值差值', unit: '%', placeholder: '正负数' },
          ],
          score(v) {
            const d = +v.diff || 0;
            if (d >= 10) return 1; if (d >= 5) return 0.75; if (d >= 0) return 0.5; if (d >= -5) return 0.25; return 0;
          },
        },
      ],
    }],
  },

  /* ============ 一级维度 6：成长性（权重 10） ============ */
  {
    id: 'L1_06', name: '成长性', weight: 10,
    children: [{
      id: 'L2_06_01', name: '业绩增长',
      children: [
        {
          id: 'Q22', name: '营业收入增长率超出行业均值情况', weight: 4,
          type: 'compound',
          question: '贵企业近两年营业收入的年均增长率为多少？该数值与全省同行业小微企业近两年营业收入年均增长率均值的差值为多少？',
          fields: [
            { key: 'self', label: '本企业营收年均增长率', unit: '%', placeholder: '0' },
            { key: 'diff', label: '与行业均值差值', unit: '%', placeholder: '正负数' },
          ],
          score(v) {
            const d = +v.diff || 0;
            if (d >= 15) return 1; if (d >= 5) return 0.75; if (d >= 0) return 0.5; if (d >= -5) return 0.25; return 0;
          },
        },
        {
          id: 'Q23', name: '利润增长率超出行业均值情况', weight: 3,
          type: 'compound',
          question: '贵企业近两年利润总额的年均增长率为多少？该数值与全省同行业小微企业近两年利润总额年均增长率均值的差值为多少？',
          fields: [
            { key: 'self', label: '本企业利润年均增长率', unit: '%', placeholder: '0' },
            { key: 'diff', label: '与行业均值差值', unit: '%', placeholder: '正负数' },
          ],
          score(v) {
            const d = +v.diff || 0;
            if (d >= 15) return 1; if (d >= 5) return 0.75; if (d >= 0) return 0.5; if (d >= -5) return 0.25; return 0;
          },
        },
        {
          id: 'Q24', name: '净资产产出增速超出行业均值情况', weight: 3,
          type: 'compound',
          question: '贵企业近两年净资产的年均增速为多少？该数值与全省同行业小微企业近两年净资产年均增速均值的差值为多少？',
          fields: [
            { key: 'self', label: '本企业净资产年均增速', unit: '%', placeholder: '0' },
            { key: 'diff', label: '与行业均值差值', unit: '%', placeholder: '正负数' },
          ],
          score(v) {
            const d = +v.diff || 0;
            if (d >= 15) return 1; if (d >= 5) return 0.75; if (d >= 0) return 0.5; if (d >= -5) return 0.25; return 0;
          },
        },
      ],
    }],
  },

  /* ============ 一级维度 7：产业基础（权重 5） ============ */
  {
    id: 'L1_07', name: '产业基础', weight: 5,
    children: [{
      id: 'L2_07_01', name: '产业链与荣誉',
      children: [
        {
          id: 'Q25', name: '是否参与支撑重点产业链工作', weight: 3,
          type: 'compound',
          question: '贵企业是否参与工业和信息化部相关司局的重点产业链支撑工作？若参与，累计参与的项数为多少？',
          fields: [
            { key: 'has', label: '是否参与', type: 'yesno' },
            { key: 'count', label: '累计参与项数', unit: '项', placeholder: '0', dependsOn: 'has', dependsValue: 'yes' },
          ],
          score(v) {
            if (v.has !== 'yes') return 0;
            const c = +v.count || 0;
            if (c >= 5) return 1; if (c >= 3) return 0.7; if (c >= 1) return 0.4; return 0.2;
          },
        },
        {
          id: 'Q26', name: '是否获得相关称号、荣誉', weight: 2,
          type: 'compound',
          question: '贵企业是否获得工业和信息化部相关司局发布的制造业类荣誉称号？若获得，累计获得的项数为多少？',
          fields: [
            { key: 'has', label: '是否获得', type: 'yesno' },
            { key: 'count', label: '累计获得项数', unit: '项', placeholder: '0', dependsOn: 'has', dependsValue: 'yes' },
          ],
          score(v) {
            if (v.has !== 'yes') return 0;
            const c = +v.count || 0;
            if (c >= 5) return 1; if (c >= 3) return 0.7; if (c >= 1) return 0.4; return 0.2;
          },
        },
      ],
    }],
  },
];

window.GRADE_THRESHOLDS = [
  { min: 85, label: '优秀', color: '#13b06b' },
  { min: 70, label: '良好', color: '#3a7afe' },
  { min: 55, label: '合格', color: '#f5a623' },
  { min: 0,  label: '待提升', color: '#e95252' },
];

/* ==================================================================
 * 专精特新中小企业认定标准 · 题库（13 题，满分 100）
 * 一级权重：专业化 25 + 精细化 25 + 特色化 15 + 创新能力 35
 * ================================================================== */
window.INDICATORS_CERT = [
  /* ---------- 专业化 25 分 ---------- */
  {
    id: 'C_L1_01', name: '专业化', weight: 25,
    children: [{
      id: 'C_L2_01', name: '专业化指标',
      children: [
        {
          id: 'C01', name: '主营业务收入占比', weight: 5,
          type: 'single',
          question: '上年度主营业务收入总额占营业收入总额比重为多少？',
          options: [
            { label: 'A. 80% 以上', coef: 1 },     // 5/5
            { label: 'B. 70% - 80%', coef: 0.6 },  // 3/5
            { label: 'C. 60% - 70%', coef: 0.2 },  // 1/5
            { label: 'D. 60% 以下', coef: 0 },
          ],
        },
        {
          id: 'C02', name: '主营业务收入平均增长率', weight: 10,
          type: 'single',
          question: '近 2 年主营业务收入平均增长率为多少？',
          options: [
            { label: 'A. 10% 以上', coef: 1 },     // 10/10
            { label: 'B. 8% - 10%', coef: 0.8 },
            { label: 'C. 6% - 8%', coef: 0.6 },
            { label: 'D. 4% - 6%', coef: 0.4 },
            { label: 'E. 0% - 4%', coef: 0.2 },
            { label: 'F. 0% 以下', coef: 0 },
          ],
        },
        {
          id: 'C03', name: '从事特定细分市场年限', weight: 5,
          type: 'number',
          question: '从事特定细分市场年限为多少年？（每满 2 年得 1 分，最高 5 分）',
          unit: '年', placeholder: '请输入年限', min: 0, max: 999,
          // 分数 = min(floor(年限/2), 5)；coef = 分数 / 5
          score(v) {
            v = Math.max(0, +v || 0);
            const pts = Math.min(5, Math.floor(v / 2));
            return pts / 5;
          },
        },
        {
          id: 'C04', name: '主导产品所属领域情况', weight: 5,
          type: 'single',
          question: '主导产品所属领域情况为以下哪一项？',
          options: [
            { label: 'A. 在产业链供应链关键环节及关键领域"补短板""锻长板""填空白"取得实际成效', coef: 1 },  // 5/5
            { label: 'B. 属于工业"六基"领域、中华老字号名录或主导产品服务关键产业链重点龙头企业', coef: 0.6 },  // 3/5
            { label: 'C. 不属于以上情况', coef: 0 },
          ],
        },
      ],
    }],
  },

  /* ---------- 精细化 25 分 ---------- */
  {
    id: 'C_L1_02', name: '精细化', weight: 25,
    children: [{
      id: 'C_L2_02', name: '精细化指标',
      children: [
        {
          id: 'C05', name: '数字化水平', weight: 5,
          type: 'single',
          question: '企业数字化水平为以下哪一项？',
          options: [
            { label: 'A. 三级以上', coef: 1 },     // 5/5
            { label: 'B. 二级', coef: 0.6 },        // 3/5
            { label: 'C. 一级', coef: 0 },
          ],
        },
        {
          id: 'C06', name: '质量管理水平', weight: 5,
          type: 'multi',
          question: '质量管理水平：以下哪些项目企业已满足？（每项 3 分，本题最高 5 分）',
          // 多选每项 coef = 3/5，但最终 sum clamp 到 1，故实际 ≤ 1（即满足 2 项得 5 分封顶）
          options: [
            { label: 'A. 获得省级以上质量奖荣誉', coef: 0.6 },
            { label: 'B. 建立质量管理体系，获得 ISO9001 等质量管理体系认证证书', coef: 0.6 },
            { label: 'C. 拥有自主品牌', coef: 0.6 },
            { label: 'D. 参与制修订标准', coef: 0.6 },
            { label: 'E. 未满足上述任一项', coef: 0, exclusive: true },
          ],
        },
        {
          id: 'C07', name: '上年度净利率', weight: 10,
          type: 'single',
          question: '上年度净利率为多少？',
          options: [
            { label: 'A. 10% 以上', coef: 1 },
            { label: 'B. 8% - 10%', coef: 0.8 },
            { label: 'C. 6% - 8%', coef: 0.6 },
            { label: 'D. 4% - 6%', coef: 0.4 },
            { label: 'E. 2% - 4%', coef: 0.2 },
            { label: 'F. 2% 以下', coef: 0 },
          ],
        },
        {
          id: 'C08', name: '上年度资产负债率', weight: 5,
          type: 'single',
          question: '上年度资产负债率为多少？',
          options: [
            { label: 'A. 50% 以下', coef: 1 },
            { label: 'B. 50% - 60%', coef: 0.6 },
            { label: 'C. 60% - 70%', coef: 0.2 },
            { label: 'D. 70% 以上', coef: 0 },
          ],
        },
      ],
    }],
  },

  /* ---------- 特色化 15 分 ---------- */
  {
    id: 'C_L1_03', name: '特色化', weight: 15,
    children: [{
      id: 'C_L2_03', name: '地方特色指标',
      children: [
        {
          id: 'C09', name: '地方特色指标（由省级主管部门设定）', weight: 15,
          type: 'multi',
          question: '由省级中小企业主管部门结合本地产业状况自主设定 1-3 个指标进行评价。请勾选企业满足的项目（每项 5 分，本题满分 15 分）：',
          options: [
            { label: '地方特色指标 1（请联系当地主管部门确认具体内容）', coef: 1/3 },
            { label: '地方特色指标 2（请联系当地主管部门确认具体内容）', coef: 1/3 },
            { label: '地方特色指标 3（请联系当地主管部门确认具体内容）', coef: 1/3 },
            { label: '以上均不满足', coef: 0, exclusive: true },
          ],
        },
      ],
    }],
  },

  /* ---------- 创新能力 35 分 ---------- */
  {
    id: 'C_L1_04', name: '创新能力', weight: 35,
    children: [{
      id: 'C_L2_04', name: '创新能力指标',
      children: [
        {
          id: 'C10', name: '与主导产品相关的有效知识产权数量', weight: 10,
          type: 'single',
          question: '与企业主导产品相关的有效知识产权数量情况？',
          options: [
            { label: 'A. I 类高价值知识产权 1 项以上', coef: 1 },     // 10/10
            { label: 'B. 自主研发 I 类知识产权 1 项以上', coef: 0.8 }, // 8/10
            { label: 'C. I 类知识产权 1 项以上', coef: 0.6 },          // 6/10
            { label: 'D. II 类知识产权 1 项以上', coef: 0.2 },          // 2/10
            { label: 'E. 无', coef: 0 },
          ],
        },
        {
          id: 'C11', name: '上年度研发费用投入', weight: 10,
          type: 'single',
          question: '上年度研发费用投入情况？',
          options: [
            { label: 'A. 研发费用总额 500 万元以上 或 占营收比重 10% 以上', coef: 1 },
            { label: 'B. 研发费用总额 400-500 万元 或 占营收比重 8%-10%', coef: 0.8 },
            { label: 'C. 研发费用总额 300-400 万元 或 占营收比重 6%-8%', coef: 0.6 },
            { label: 'D. 研发费用总额 200-300 万元 或 占营收比重 4%-6%', coef: 0.4 },
            { label: 'E. 研发费用总额 100-200 万元 或 占营收比重 3%-4%', coef: 0.2 },
            { label: 'F. 不属于以上情况', coef: 0 },
          ],
        },
        {
          id: 'C12', name: '上年度研发人员占比', weight: 5,
          type: 'single',
          question: '上年度研发人员占比为多少？',
          options: [
            { label: 'A. 20% 以上', coef: 1 },
            { label: 'B. 10% - 20%', coef: 0.6 },
            { label: 'C. 5% - 10%', coef: 0.2 },
            { label: 'D. 5% 以下', coef: 0 },
          ],
        },
        {
          id: 'C13', name: '建立研发机构级别', weight: 10,
          type: 'single',
          question: '企业建立的研发机构级别为以下哪一项？',
          options: [
            { label: 'A. 国家级', coef: 1 },
            { label: 'B. 省级', coef: 0.8 },
            { label: 'C. 市级', coef: 0.4 },
            { label: 'D. 市级以下', coef: 0.2 },
            { label: 'E. 未建立研发机构', coef: 0 },
          ],
        },
      ],
    }],
  },
];

/* ==================================================================
 * 两套测评的元信息
 * ================================================================== */
window.SURVEY_TYPES = {
  eval: {
    id: 'eval',
    title: '专精特新小巨人企业认定自评',
    subtitle: '企业自评工具 · 试行版',
    desc: '本测评基于《中小企业专精特新发展评价指标体系》，从专业化、精细化、特色化、创新能力、经营效益、成长性、产业基础 7 个维度全面评估企业发展水平。',
    bank: 'INDICATORS_EVAL',
    integerScore: true,
  },
  cert: {
    id: 'cert',
    title: '专精特新中小企业认定自评',
    subtitle: '认定标准对照测评',
    desc: '依据《专精特新中小企业认定标准》打分项（专业化 25 + 精细化 25 + 特色化 15 + 创新能力 35），帮助企业评估认定可行性。',
    bank: 'INDICATORS_CERT',
    integerScore: true,
  },
};

/* 路由：根据 SURVEY_TYPE（默认从 sessionStorage 取）暴露 window.INDICATORS */
(function () {
  function detectType() {
    try {
      const v = sessionStorage.getItem('survey_type');
      if (v === 'cert' || v === 'eval') return v;
    } catch (e) {}
    return 'eval';
  }
  const type = window.SURVEY_TYPE || detectType();
  window.SURVEY_TYPE = type;
  window.INDICATORS = window[window.SURVEY_TYPES[type].bank];
})();
