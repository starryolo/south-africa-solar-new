export type Language = 'zh' | 'en'
export type Currency = 'CNY' | 'ZAR'

// 汇率：1 CNY = 2.5 ZAR (示例汇率，需要根据实际情况更新)
export const EXCHANGE_RATE = 2.5

export interface TranslationEntry {
  zh: string
  en: string
}

export const translations: Record<string, TranslationEntry> = {
  appTitle: {
    zh: '南非商业光储充投资模型',
    en: 'South Africa Commercial PV+Storage+EV Charging Investment Model'
  },
  appSubtitle: {
    zh: '实时计算 · 动态分析',
    en: 'Real-time Calculation · Dynamic Analysis'
  },
  resetDefaults: {
    zh: '重置默认值',
    en: 'Reset Defaults'
  },
  panelSpecsTitle: {
    zh: '光伏板规格',
    en: 'PV Panel Specifications'
  },
  panelPower: {
    zh: '功率',
    en: 'Power'
  },
  panelEfficiency: {
    zh: '效率',
    en: 'Efficiency'
  },
  panelArea: {
    zh: '单块面积',
    en: 'Panel Area'
  },
  totalPanelArea: {
    zh: '总面积',
    en: 'Total Area'
  },
  systemSetup: {
    zh: '系统配置',
    en: 'System Setup'
  },
  financialParams: {
    zh: '财务参数',
    en: 'Financial Parameters'
  },
  investmentAnalysis: {
    zh: '投资分析',
    en: 'Investment Analysis'
  },
  cashflowAnalysis: {
    zh: '现金流分析',
    en: 'Cash Flow Analysis'
  },
  step1Title: {
    zh: '第一步：系统配置',
    en: 'Step 1: System Configuration'
  },
  step1Desc: {
    zh: '设置光伏、储能、充电桩、逆变器规格和数量',
    en: 'Set PV, storage, charging pile, and inverter specifications and quantities'
  },
  step2Title: {
    zh: '第二步：财务参数',
    en: 'Step 2: Financial Parameters'
  },
  step2Desc: {
    zh: '调整电价、费用率、贴现率等财务参数',
    en: 'Adjust electricity price, cost rates, discount rate and other financial parameters'
  },
  investmentResultsTitle: {
    zh: '投资分析结果',
    en: 'Investment Analysis Results'
  },
  investmentResultsDesc: {
    zh: '查看回收期、IRR、NPV、ROI等核心指标',
    en: 'View core indicators such as payback period, IRR, NPV, ROI'
  },
  cashflowResultsTitle: {
    zh: '现金流分析',
    en: 'Cash Flow Analysis'
  },
  cashflowResultsDesc: {
    zh: '查看25年现金流明细',
    en: 'View 25-year cash flow details'
  },
  importantNotes: {
    zh: '重要说明',
    en: 'Important Notes'
  },
  note1: {
    zh: '本模型为估算工具，实际投资需详细可行性研究',
    en: 'This model is an estimation tool, actual investment requires detailed feasibility study'
  },
  note2: {
    zh: '南非光照条件良好，平均峰值日照约5.5小时/天',
    en: 'South Africa has good sunlight conditions, average peak sun hours approx 5.5 hours/day'
  },
  note3: {
    zh: '建议储能容量与日发电量保持合理比例（建议20-40%）',
    en: 'Recommend maintaining reasonable ratio between storage capacity and daily generation (20-40%)'
  },
  note4: {
    zh: '电网可靠性较低的地区，储能价值更高',
    en: 'In areas with lower grid reliability, storage has higher value'
  },
  note5: {
    zh: '当前货币',
    en: 'Current Currency'
  },
  note7: {
    zh: '计算结果仅供参考',
    en: 'Calculation results for reference only'
  },
  simplePayback: {
    zh: '简单回收期',
    en: 'Simple Payback'
  },
  irr: {
    zh: '内部收益率',
    en: 'Internal Rate of Return'
  },
  npv: {
    zh: '净现值',
    en: 'Net Present Value'
  },
  roi: {
    zh: '投资回报率',
    en: 'Return on Investment'
  },
  systemOverview: {
    zh: '系统规模',
    en: 'System Overview'
  },
  pvCapacity: {
    zh: '光伏容量',
    en: 'PV Capacity'
  },
  storageCapacity: {
    zh: '储能容量',
    en: 'Storage Capacity'
  },
  usableStorage: {
    zh: '可用储能',
    en: 'Usable Storage'
  },
  chargingPower: {
    zh: '充电功率',
    en: 'Charging Power'
  },
  inverterCapacity: {
    zh: '逆变器容量',
    en: 'Inverter Capacity'
  },
  generationForecast: {
    zh: '发电量预测',
    en: 'Generation Forecast'
  },
  annualGeneration: {
    zh: '年发电量',
    en: 'Annual Generation'
  },
  generationPerSqm: {
    zh: '发电效率',
    en: 'Generation Efficiency'
  },
  investmentBreakdown: {
    zh: '投资成本明细',
    en: 'Investment Breakdown'
  },
  pvSystemCost: {
    zh: '光伏系统',
    en: 'PV System'
  },
  storageSystemCost: {
    zh: '储能系统',
    en: 'Storage System'
  },
  chargingSystemCost: {
    zh: '充电桩系统',
    en: 'Charging Pile System'
  },
  inverterCost: {
    zh: '逆变器',
    en: 'Inverters'
  },
  totalInvestment: {
    zh: '总投资',
    en: 'Total Investment'
  },
  chargingRevenue: {
    zh: '充电收入',
    en: 'Charging Revenue'
  },
  electricitySavings: {
    zh: '电费节省',
    en: 'Electricity Savings'
  },
  totalRevenue: {
    zh: '总收益',
    en: 'Total Revenue'
  },
  maintenanceCost: {
    zh: '运维成本',
    en: 'Maintenance Cost'
  },
  insuranceCost: {
    zh: '保险成本',
    en: 'Insurance Cost'
  },
  annualDepreciation: {
    zh: '年折旧',
    en: 'Annual Depreciation'
  },
  annualTax: {
    zh: '年税金',
    en: 'Annual Tax'
  },
  annualNetProfit: {
    zh: '年净利润',
    en: 'Annual Net Profit'
  },
  lcoeTitle: {
    zh: '平准化度电成本',
    en: 'Levelized Cost of Electricity'
  },
  lcoeDesc: {
    zh: '项目全生命周期平均发电成本',
    en: 'Average generation cost over project lifetime'
  },
  irrStepTitle: {
    zh: 'IRR计算详情',
    en: 'IRR Calculation Details'
  },
  irrFormula: {
    zh: 'IRR计算公式',
    en: 'IRR Calculation Formula'
  },
  yearColumn: {
    zh: '年份',
    en: 'Year'
  },
  cashFlowColumn: {
    zh: '现金流',
    en: 'Cash Flow'
  },
  discountedCashFlowColumn: {
    zh: '贴现现金流',
    en: 'Discounted Cash Flow'
  },
  cumulativeNpvColumn: {
    zh: '累计NPV',
    en: 'Cumulative NPV'
  },
  irrValue: {
    zh: 'IRR值',
    en: 'IRR Value'
  },
  liveOverview: {
    zh: '实时投资概览',
    en: 'Live Investment Overview'
  },
  paybackPeriod: {
    zh: '回收期',
    en: 'Payback'
  },
  systemScale: {
    zh: '系统规模',
    en: 'System Scale'
  },
  investmentAndRevenue: {
    zh: '投资与收益',
    en: 'Investment & Revenue'
  },
  pvEfficiency: {
    zh: '光伏效率',
    en: 'PV Efficiency'
  },
  systemDiagnostics: {
    zh: '系统诊断',
    en: 'System Diagnostics'
  },
  footerLine1: {
    zh: '© 2025 南非光储充投资分析工具',
    en: '© 2025 South Africa PV+Storage+EV Charging Investment Analysis Tool'
  }
}

export function t(key: string, lang: Language, params: Record<string, string | number> = {}): string {
  const translation = translations[key]
  if (!translation) return key
  
  let result = translation[lang] || translation.zh
  
  for (const [k, v] of Object.entries(params)) {
    result = result.replace(`{${k}}`, String(v))
  }
  
  return result
}

export function convertCurrency(amount: number, fromCurrency: Currency, toCurrency: Currency): number {
  if (fromCurrency === toCurrency) return amount
  if (fromCurrency === 'CNY' && toCurrency === 'ZAR') return amount * EXCHANGE_RATE
  if (fromCurrency === 'ZAR' && toCurrency === 'CNY') return amount / EXCHANGE_RATE
  return amount
}

export function formatCurrency(amount: number, currency: Currency, lang: Language): string {
  // 基础计算都是在CNY下进行的，所以这里需要先转换
  const convertedAmount = convertCurrency(amount, 'CNY', currency)
  
  const locale = lang === 'zh' ? 'zh-CN' : 'en-ZA'
  
  if (currency === 'ZAR') {
    return 'R' + convertedAmount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  } else {
    return convertedAmount.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' CNY'
  }
}

export function formatProfit(amount: number, currency: Currency, lang: Language): { text: string; className: string } {
  const convertedAmount = convertCurrency(amount, 'CNY', currency)
  const isNegative = convertedAmount < 0
  const absoluteAmount = Math.abs(convertedAmount)
  
  const locale = lang === 'zh' ? 'zh-CN' : 'en-ZA'
  
  let formattedText: string
  if (currency === 'ZAR') {
    formattedText = 'R' + absoluteAmount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  } else {
    formattedText = absoluteAmount.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' CNY'
  }
  
  if (lang === 'zh') {
    return {
      text: isNegative ? `-${formattedText}` : formattedText,
      className: isNegative ? 'text-destructive font-bold' : 'text-primary font-bold'
    }
  } else {
    return {
      text: isNegative ? `(${formattedText})` : formattedText,
      className: isNegative ? 'text-red-600 font-bold' : 'text-green-700 font-bold'
    }
  }
}

export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}
