// 南非光储充投资经济模型计算逻辑

export interface SystemConfig {
  // 光伏系统
  pvPanelPower: number // 单块光伏板功率 (W)
  pvPanelCount: number // 光伏板数量
  pvPanelPrice: number // 单块光伏板价格 (CNY)
  pvInstallationCost: number // 安装成本 (CNY/kW)
  
  // 储能系统
  batteryCapacity: number // 单块电池容量 (kWh)
  batteryCount: number // 电池数量
  batteryPrice: number // 单块电池价格 (CNY)
  batteryDOD: number // 放电深度 (%)
  
  // 充电桩
  chargerPower: number // 单桩功率 (kW)
  chargerCount: number // 充电桩数量
  chargerPrice: number // 单桩价格 (CNY)
  
  // 逆变器
  inverterPower: number // 逆变器功率 (kW)
  inverterCount: number // 逆变器数量
  inverterPrice: number // 单台逆变器价格 (CNY)
  
  // 运营参数
  electricityBuyPrice: number // 电网购电价格 (CNY/kWh)
  electricitySellPrice: number // 售电价格 (CNY/kWh) - 如果允许上网
  chargingPrice: number // 充电桩收费价格 (CNY/kWh)
  dailyChargingHours: number // 日均充电小时数
  chargerUtilization: number // 充电桩利用率 (%)
  
  // 财务参数
  corporateTaxRate: number // 企业所得税率 (%)
  vatRate: number // 增值税率 (%)
  depreciationYears: number // 折旧年限
  discountRate: number // 贴现率 (%)
  projectLifeYears: number // 项目周期 (年)
  annualDegradation: number // 年衰减率 (%)
  maintenanceCostRate: number // 年运维成本率 (%)
  insuranceRate: number // 保险费率 (%)
  
  // 南非特定参数
  peakSunHours: number // 南非年均峰值日照小时数
  gridReliability: number // 电网可靠性 (%) - 影响储能价值
}

export interface CalculationResult {
  // 系统规模
  totalPVCapacity: number // 总光伏容量 (kW)
  totalStorageCapacity: number // 总储能容量 (kWh)
  usableStorageCapacity: number // 可用储能容量 (kWh)
  totalChargingPower: number // 总充电功率 (kW)
  totalInverterCapacity: number // 总逆变器容量 (kW)
  
  // 发电量预测
  annualGeneration: number // 年发电量 (kWh)
  dailyGeneration: number // 日均发电量 (kWh)
  pvEfficiencyPerSqm: number // 每平方米发电效率 (kWh/m²/年)
  
  // 投资成本
  pvSystemCost: number // 光伏系统总成本
  storageSystemCost: number // 储能系统总成本
  chargingSystemCost: number // 充电桩系统总成本
  inverterCost: number // 逆变器总成本
  otherCosts: number // 其他成本 (线缆、配电等)
  totalInvestment: number // 总投资
  
  // 年度收益
  annualChargingRevenue: number // 充电收入
  annualElectricitySavings: number // 电费节省
  annualTotalRevenue: number // 年总收益
  
  // 年度成本
  annualMaintenanceCost: number // 年运维成本
  annualInsuranceCost: number // 年保险成本
  annualOperatingCost: number // 年运营成本总计
  
  // 税务计算
  annualDepreciation: number // 年折旧
  annualTaxableIncome: number // 应税收入
  annualTax: number // 年税金
  annualNetProfit: number // 年净利润
  
  // 投资回报指标
  simplePaybackYears: number // 简单回收期 (年)
  npv: number // 净现值
  irr: number // 内部收益率 (%)
  roi: number // 投资回报率 (%)
  lcoe: number // 平准化度电成本 (CNY/kWh)
  
  // 25年现金流
  cashFlows: YearlyData[]
}

export interface YearlyData {
  year: number
  generation: number
  revenue: number
  operatingCost: number
  depreciation: number
  taxableIncome: number
  tax: number
  netCashFlow: number
  cumulativeCashFlow: number
  discountedCashFlow: number
}

// 协鑫625W双玻光伏板参数
export const GCL_625W_SPECS = {
  power: 625, // W
  efficiency: 0.213, // 21.3% 效率
  area: 2.384 * 1.303, // 约 3.1 m²
  degradationRate: 0.004, // 年衰减率 0.4%
}

// 阳光电源（Sungrow）逆变器系列
export interface InverterModel {
  id: string
  name: string
  power: number // kW
  efficiency: number // %
  price: number // CNY
  type: 'string' | 'hybrid' | 'central'
  description: string
  maxDCInput: number // kW
  mpptCount: number
}

export const SUNGROW_INVERTERS: InverterModel[] = [
  // 组串式逆变器 - 商业系列
  {
    id: 'SG25CX',
    name: 'SG25CX',
    power: 25,
    efficiency: 98.5,
    price: 32000,
    type: 'string',
    description: '25kW 商业组串式逆变器',
    maxDCInput: 37.5,
    mpptCount: 3,
  },
  {
    id: 'SG30CX',
    name: 'SG30CX',
    power: 30,
    efficiency: 98.5,
    price: 38000,
    type: 'string',
    description: '30kW 商业组串式逆变器',
    maxDCInput: 45,
    mpptCount: 3,
  },
  {
    id: 'SG33CX',
    name: 'SG33CX',
    power: 33,
    efficiency: 98.5,
    price: 42000,
    type: 'string',
    description: '33kW 商业组串式逆变器',
    maxDCInput: 49.5,
    mpptCount: 3,
  },
  {
    id: 'SG40CX',
    name: 'SG40CX',
    power: 40,
    efficiency: 98.6,
    price: 48000,
    type: 'string',
    description: '40kW 商业组串式逆变器',
    maxDCInput: 60,
    mpptCount: 4,
  },
  {
    id: 'SG50CX',
    name: 'SG50CX',
    power: 50,
    efficiency: 98.7,
    price: 55000,
    type: 'string',
    description: '50kW 商业组串式逆变器',
    maxDCInput: 75,
    mpptCount: 5,
  },
  // 大功率组串式
  {
    id: 'SG110CX',
    name: 'SG110CX',
    power: 110,
    efficiency: 98.9,
    price: 98000,
    type: 'string',
    description: '110kW 大功率组串式逆变器',
    maxDCInput: 150,
    mpptCount: 9,
  },
  {
    id: 'SG125CX',
    name: 'SG125CX',
    power: 125,
    efficiency: 98.9,
    price: 115000,
    type: 'string',
    description: '125kW 大功率组串式逆变器',
    maxDCInput: 187.5,
    mpptCount: 10,
  },
  {
    id: 'SG250HX',
    name: 'SG250HX',
    power: 250,
    efficiency: 99.0,
    price: 195000,
    type: 'string',
    description: '250kW 超大功率组串式逆变器',
    maxDCInput: 375,
    mpptCount: 12,
  },
  // 储能混合逆变器
  {
    id: 'SH5.0RT',
    name: 'SH5.0RT',
    power: 5,
    efficiency: 97.8,
    price: 28000,
    type: 'hybrid',
    description: '5kW 户用储能混合逆变器',
    maxDCInput: 8,
    mpptCount: 2,
  },
  {
    id: 'SH8.0RT',
    name: 'SH8.0RT',
    power: 8,
    efficiency: 97.8,
    price: 35000,
    type: 'hybrid',
    description: '8kW 户用储能混合逆变器',
    maxDCInput: 13,
    mpptCount: 2,
  },
  {
    id: 'SH10RT',
    name: 'SH10RT',
    power: 10,
    efficiency: 97.8,
    price: 42000,
    type: 'hybrid',
    description: '10kW 户用储能混合逆变器',
    maxDCInput: 15,
    mpptCount: 2,
  },
  // 商业储能逆变器
  {
    id: 'ST100CP',
    name: 'ST100CP',
    power: 100,
    efficiency: 98.5,
    price: 125000,
    type: 'hybrid',
    description: '100kW 商业储能逆变器',
    maxDCInput: 150,
    mpptCount: 0,
  },
  {
    id: 'ST200CP',
    name: 'ST200CP',
    power: 200,
    efficiency: 98.6,
    price: 220000,
    type: 'hybrid',
    description: '200kW 商业储能逆变器',
    maxDCInput: 300,
    mpptCount: 0,
  },
]

// 根据光伏容量推荐合适的逆变器
export function recommendInverter(pvCapacityKW: number): InverterModel[] {
  // 逆变器容量通常为光伏容量的80%-110%
  const minCapacity = pvCapacityKW * 0.8
  const maxCapacity = pvCapacityKW * 1.3
  
  return SUNGROW_INVERTERS
    .filter(inv => inv.power >= 20) // 只推荐商业级
    .sort((a, b) => {
      // 优先推荐容量匹配度最高的
      const aRatio = a.power / pvCapacityKW
      const bRatio = b.power / pvCapacityKW
      const aScore = Math.abs(1 - aRatio)
      const bScore = Math.abs(1 - bRatio)
      return aScore - bScore
    })
    .slice(0, 5)
}

// 默认参数 (人民币)
export const SOUTH_AFRICA_DEFAULTS: SystemConfig = {
  pvPanelPower: 625,
  pvPanelCount: 100,
  pvPanelPrice: 1200, // CNY
  pvInstallationCost: 3500, // CNY/kW
  
  batteryCapacity: 10,
  batteryCount: 10,
  batteryPrice: 8000, // CNY
  batteryDOD: 90,
  
  chargerPower: 7,
  chargerCount: 4,
  chargerPrice: 18000, // CNY
  
  inverterPower: 15,
  inverterCount: 5,
  inverterPrice: 8000, // CNY
  
  electricityBuyPrice: 0.85, // CNY/kWh (商业电价)
  electricitySellPrice: 0.35, // CNY/kWh
  chargingPrice: 1.50, // CNY/kWh
  dailyChargingHours: 8,
  chargerUtilization: 60,
  
  corporateTaxRate: 27, // 南非企业所得税
  vatRate: 15, // 南非增值税
  depreciationYears: 10,
  discountRate: 12,
  projectLifeYears: 25,
  annualDegradation: 0.5,
  maintenanceCostRate: 1.5,
  insuranceRate: 0.5,
  
  peakSunHours: 5.5, // 南非平均
  gridReliability: 70, // 南非电网可靠性约70%
}

export function calculateInvestmentModel(config: SystemConfig): CalculationResult {
  // 系统规模计算
  const totalPVCapacity = (config.pvPanelPower * config.pvPanelCount) / 1000 // kW
  const totalStorageCapacity = config.batteryCapacity * config.batteryCount // kWh
  const usableStorageCapacity = totalStorageCapacity * (config.batteryDOD / 100)
  const totalChargingPower = config.chargerPower * config.chargerCount // kW
  const totalInverterCapacity = config.inverterPower * config.inverterCount // kW
  
  // 光伏板面积计算
  const panelArea = GCL_625W_SPECS.area * config.pvPanelCount // m²
  
  // 发电量计算 (考虑系统效率约85%)
  const systemEfficiency = 0.85
  const annualGeneration = totalPVCapacity * config.peakSunHours * 365 * systemEfficiency
  const dailyGeneration = annualGeneration / 365
  const pvEfficiencyPerSqm = annualGeneration / panelArea
  
  // 投资成本计算
  const pvSystemCost = config.pvPanelCount * config.pvPanelPrice + 
                       totalPVCapacity * config.pvInstallationCost
  const storageSystemCost = config.batteryCount * config.batteryPrice
  const chargingSystemCost = config.chargerCount * config.chargerPrice
  const inverterCost = config.inverterCount * config.inverterPrice
  const otherCosts = (pvSystemCost + storageSystemCost + chargingSystemCost + inverterCost) * 0.15 // 线缆、配电、土建等
  const totalInvestment = pvSystemCost + storageSystemCost + chargingSystemCost + inverterCost + otherCosts
  
  // 年度收益计算 (第一年)
  const dailyChargingEnergy = totalChargingPower * config.dailyChargingHours * (config.chargerUtilization / 100)
  const annualChargingRevenue = dailyChargingEnergy * 365 * config.chargingPrice
  
  // 电费节省 = 自发自用部分 (假设80%自用, 20%储能供夜间使用)
  const selfConsumptionRate = 0.80
  const annualElectricitySavings = annualGeneration * selfConsumptionRate * config.electricityBuyPrice +
                                   annualGeneration * (1 - selfConsumptionRate) * config.electricitySellPrice
  
  const annualTotalRevenue = annualChargingRevenue + annualElectricitySavings
  
  // 年度运营成本
  const annualMaintenanceCost = totalInvestment * (config.maintenanceCostRate / 100)
  const annualInsuranceCost = totalInvestment * (config.insuranceRate / 100)
  const annualOperatingCost = annualMaintenanceCost + annualInsuranceCost
  
  // 折旧计算 (直线法)
  const annualDepreciation = totalInvestment / config.depreciationYears
  
  // 税务计算
  const annualTaxableIncome = annualTotalRevenue - annualOperatingCost - annualDepreciation
  const annualTax = Math.max(0, annualTaxableIncome * (config.corporateTaxRate / 100))
  const annualNetProfit = annualTaxableIncome - annualTax + annualDepreciation // 加回折旧
  
  // 25年现金流计算
  const cashFlows: YearlyData[] = []
  let cumulativeCashFlow = -totalInvestment
  let totalDiscountedCashFlow = 0
  
  for (let year = 1; year <= config.projectLifeYears; year++) {
    // 考虑衰减
    const degradationFactor = Math.pow(1 - config.annualDegradation / 100, year - 1)
    const yearGeneration = annualGeneration * degradationFactor
    
    // 该年收益
    const yearChargingRevenue = annualChargingRevenue * degradationFactor
    const yearElectricitySavings = annualElectricitySavings * degradationFactor
    const yearRevenue = yearChargingRevenue + yearElectricitySavings
    
    // 该年折旧
    const yearDepreciation = year <= config.depreciationYears ? annualDepreciation : 0
    
    // 该年应税收入和税金
    const yearTaxableIncome = yearRevenue - annualOperatingCost - yearDepreciation
    const yearTax = Math.max(0, yearTaxableIncome * (config.corporateTaxRate / 100))
    
    // 该年净现金流
    const yearNetCashFlow = yearRevenue - annualOperatingCost - yearTax
    cumulativeCashFlow += yearNetCashFlow
    
    // 贴现现金流
    const discountFactor = Math.pow(1 + config.discountRate / 100, year)
    const discountedCashFlow = yearNetCashFlow / discountFactor
    totalDiscountedCashFlow += discountedCashFlow
    
    cashFlows.push({
      year,
      generation: yearGeneration,
      revenue: yearRevenue,
      operatingCost: annualOperatingCost,
      depreciation: yearDepreciation,
      taxableIncome: yearTaxableIncome,
      tax: yearTax,
      netCashFlow: yearNetCashFlow,
      cumulativeCashFlow,
      discountedCashFlow,
    })
  }
  
  // 投资回报指标
  const simplePaybackYears = totalInvestment / annualNetProfit
  const npv = -totalInvestment + totalDiscountedCashFlow
  const irr = calculateIRR([-totalInvestment, ...cashFlows.map(cf => cf.netCashFlow)])
  const roi = (annualNetProfit / totalInvestment) * 100
  
  // LCOE计算
  const totalLifetimeGeneration = cashFlows.reduce((sum, cf) => sum + cf.generation, 0)
  const totalLifetimeCost = totalInvestment + cashFlows.reduce((sum, cf) => sum + cf.operatingCost, 0)
  const lcoe = totalLifetimeCost / totalLifetimeGeneration
  
  return {
    totalPVCapacity,
    totalStorageCapacity,
    usableStorageCapacity,
    totalChargingPower,
    totalInverterCapacity,
    
    annualGeneration,
    dailyGeneration,
    pvEfficiencyPerSqm,
    
    pvSystemCost,
    storageSystemCost,
    chargingSystemCost,
    inverterCost,
    otherCosts,
    totalInvestment,
    
    annualChargingRevenue,
    annualElectricitySavings,
    annualTotalRevenue,
    
    annualMaintenanceCost,
    annualInsuranceCost,
    annualOperatingCost,
    
    annualDepreciation,
    annualTaxableIncome,
    annualTax,
    annualNetProfit,
    
    simplePaybackYears,
    npv,
    irr,
    roi,
    lcoe,
    
    cashFlows,
  }
}

// NPV计算函数
function calculateNPVAtRate(cashFlows: number[], rate: number): number {
  let npv = 0
  for (let t = 0; t < cashFlows.length; t++) {
    npv += cashFlows[t] / Math.pow(1 + rate, t)
  }
  return npv
}

// NPV导数计算
function calculateNPVDerivative(cashFlows: number[], rate: number): number {
  let derivative = 0
  for (let t = 1; t < cashFlows.length; t++) {
    derivative -= t * cashFlows[t] / Math.pow(1 + rate, t + 1)
  }
  return derivative
}

// IRR计算 (结合二分法和牛顿-拉弗森法，提高精度和稳定性)
function calculateIRR(cashFlows: number[], initialGuess: number = 0.1): number {
  const maxIterations = 1000
  const tolerance = 1e-10 // 极高精度
  
  // 首先检查现金流是否有效
  if (cashFlows.length < 2) return 0
  
  const initialInvestment = cashFlows[0]
  const totalReturns = cashFlows.slice(1).reduce((a, b) => a + b, 0)
  
  // 如果总回报小于初始投资，IRR为负
  if (initialInvestment < 0 && totalReturns < Math.abs(initialInvestment)) {
    // 使用二分法在负区间搜索
    return bisectionIRR(cashFlows, -0.99, 0, tolerance, maxIterations) * 100
  }
  
  // 首先尝试使用二分法确定IRR的大致范围
  let lowerBound = -0.99
  let upperBound = 10.0
  
  // 检查边界处的NPV符号
  const npvLower = calculateNPVAtRate(cashFlows, lowerBound)
  const npvUpper = calculateNPVAtRate(cashFlows, upperBound)
  
  // 如果两端NPV符号相同，尝试扩展搜索范围
  if (npvLower * npvUpper > 0) {
    // 尝试用牛顿法
    const newtonResult = newtonRaphsonIRR(cashFlows, initialGuess, tolerance, maxIterations)
    if (!isNaN(newtonResult) && isFinite(newtonResult)) {
      return newtonResult * 100
    }
    return 0
  }
  
  // 使用二分法获得初始估计
  const bisectionResult = bisectionIRR(cashFlows, lowerBound, upperBound, 1e-4, 100)
  
  // 然后用牛顿-拉弗森法精化结果
  const refinedResult = newtonRaphsonIRR(cashFlows, bisectionResult, tolerance, maxIterations)
  
  if (!isNaN(refinedResult) && isFinite(refinedResult) && refinedResult > -1 && refinedResult < 10) {
    return refinedResult * 100
  }
  
  return bisectionResult * 100
}

// 二分法求IRR
function bisectionIRR(
  cashFlows: number[], 
  lowerBound: number, 
  upperBound: number, 
  tolerance: number, 
  maxIterations: number
): number {
  let low = lowerBound
  let high = upperBound
  let mid = (low + high) / 2
  
  const npvLow = calculateNPVAtRate(cashFlows, low)
  
  for (let i = 0; i < maxIterations; i++) {
    mid = (low + high) / 2
    const npvMid = calculateNPVAtRate(cashFlows, mid)
    
    if (Math.abs(npvMid) < tolerance || (high - low) / 2 < tolerance) {
      return mid
    }
    
    if (npvMid * npvLow < 0) {
      high = mid
    } else {
      low = mid
    }
  }
  
  return mid
}

// 牛顿-拉弗森法求IRR (高精度)
function newtonRaphsonIRR(
  cashFlows: number[], 
  initialGuess: number, 
  tolerance: number, 
  maxIterations: number
): number {
  let rate = initialGuess
  
  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPVAtRate(cashFlows, rate)
    const derivative = calculateNPVDerivative(cashFlows, rate)
    
    // 检查导数是否接近零
    if (Math.abs(derivative) < 1e-15) {
      break
    }
    
    const newRate = rate - npv / derivative
    
    // 检查收敛
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate
    }
    
    // 限制rate在合理范围内
    rate = Math.max(-0.999, Math.min(newRate, 100))
  }
  
  return rate
}

// 验证IRR计算结果 (反向验证NPV是否接近0)
export function verifyIRR(cashFlows: number[], irr: number): { 
  isValid: boolean
  npvAtIRR: number 
  precision: number
} {
  const rate = irr / 100
  const npvAtIRR = calculateNPVAtRate(cashFlows, rate)
  const precision = Math.abs(npvAtIRR)
  
  return {
    isValid: precision < 1,
    npvAtIRR,
    precision
  }
}

// 格式化货币
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// 格式化数字
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}
