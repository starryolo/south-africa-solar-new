"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalculationResult, formatNumber, verifyIRR, SystemConfig, getIRRCalculationDetails } from "@/lib/calculations"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useApp } from "@/lib/app-context"
import { t, formatCurrency, formatProfit, convertCurrency } from "@/lib/i18n"

interface ResultsSummaryProps {
  result: CalculationResult
  config: SystemConfig
}

export function ResultsSummary({ result, config }: ResultsSummaryProps) {
  const { language, currency } = useApp()
  
  // 验证IRR计算精度
  const irrVerification = verifyIRR([-result.totalInvestment, ...result.cashFlows.map(cf => cf.netCashFlow)], result.irr)

  // IRR精度等级判定
  const getIRRPrecisionLabel = () => {
    if (irrVerification.precision < 0.01) return language === 'zh' ? '极高精度' : 'Extreme Precision'
    if (irrVerification.precision < 0.1) return language === 'zh' ? '高精度' : 'High Precision'
    if (irrVerification.precision < 1) return language === 'zh' ? '中等精度' : 'Medium Precision'
    return language === 'zh' ? '低精度' : 'Low Precision'
  }
  
  const getVerificationStatus = () => {
    return irrVerification.isValid ? (language === 'zh' ? '通过' : 'Pass') : (language === 'zh' ? '需复核' : 'Review Required')
  }

  // 格式化年份显示
  const formatYearLabel = (year: number) => {
    if (year === 0) return language === 'zh' ? '第0年' : 'Year 0'
    return language === 'zh' ? `第${year}年` : `Year ${year}`
  }

  return (
    <TooltipProvider>
    <div className="space-y-6">
      {/* 核心指标卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('simplePayback', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatNumber(result.simplePaybackYears, 1)} {language === 'zh' ? '年' : 'yr'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'zh' ? '投资回本时间' : 'Time to recover investment'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>{t('irr', language)}</span>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className={`${irrVerification.precision < 0.01 ? 'bg-green-500' : irrVerification.precision < 0.1 ? 'bg-green-400' : irrVerification.precision < 1 ? 'bg-yellow-500' : 'bg-red-500'} text-white text-xs`}>
                    {getIRRPrecisionLabel()}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1 text-xs">
                    <p>IRR {language === 'zh' ? '验证' : 'Verification'}: NPV@IRR = {irrVerification.npvAtIRR.toFixed(6)}</p>
                    <p>{language === 'zh' ? '精度误差' : 'Precision Error'}: {irrVerification.precision.toExponential(2)}</p>
                    <p>{language === 'zh' ? '算法' : 'Algorithm'}: Binary + Newton-Raphson</p>
                    <p>{language === 'zh' ? '迭代精度' : 'Iteration Precision'}: 1e-10</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatNumber(result.irr, 4)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'zh' ? '精确值' : 'Precise Value'}: {result.irr.toFixed(8)}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('npv', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${result.npv >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(result.npv, currency, language)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'zh' ? '项目净现值' : 'Project Net Present Value'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('roi', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatNumber(result.roi, 1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'zh' ? '年度投资回报' : 'Annual Return on Investment'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 系统规模 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>{t('systemOverview', language)}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.totalPVCapacity, 1)} kW
              </div>
              <div className="text-sm text-muted-foreground">{t('pvCapacity', language)}</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.totalStorageCapacity, 1)} kWh
              </div>
              <div className="text-sm text-muted-foreground">{t('storageCapacity', language)}</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.usableStorageCapacity, 1)} kWh
              </div>
              <div className="text-sm text-muted-foreground">{t('usableStorage', language)}</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.totalChargingPower, 0)} kW
              </div>
              <div className="text-sm text-muted-foreground">{t('chargingPower', language)}</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.totalInverterCapacity, 0)} kW
              </div>
              <div className="text-sm text-muted-foreground">{t('inverterCapacity', language)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 发电量预测 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>{t('generationForecast', language)}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.annualGeneration, 0)} kWh
              </div>
              <div className="text-sm text-muted-foreground">{t('annualGeneration', language)}</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.dailyGeneration, 1)} kWh
              </div>
              <div className="text-sm text-muted-foreground">{language === 'zh' ? '日均发电量' : 'Daily Average Generation'}</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.pvEfficiencyPerSqm, 0)} kWh/m²/{language === 'zh' ? '年' : 'yr'}
              </div>
              <div className="text-sm text-muted-foreground">{t('generationPerSqm', language)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 投资成本明细 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>{t('investmentBreakdown', language)}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">{t('pvSystemCost', language)}</span>
              <span className="font-medium">{formatCurrency(result.pvSystemCost, currency, language)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">{t('storageSystemCost', language)}</span>
              <span className="font-medium">{formatCurrency(result.storageSystemCost, currency, language)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">{t('chargingSystemCost', language)}</span>
              <span className="font-medium">{formatCurrency(result.chargingSystemCost, currency, language)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">{t('inverterCost', language)}</span>
              <span className="font-medium">{formatCurrency(result.inverterCost, currency, language)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">{language === 'zh' ? '其他成本（线缆、配电、土建等）' : 'Other costs (cabling, distribution, civil works, etc.)'}</span>
              <span className="font-medium">{formatCurrency(result.otherCosts, currency, language)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4">
              <span className="font-bold text-lg">{t('totalInvestment', language)}</span>
              <span className="font-bold text-lg text-primary">{formatCurrency(result.totalInvestment, currency, language)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 年度收益分析 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-secondary">
          <CardHeader className="bg-secondary text-secondary-foreground">
            <CardTitle>{language === 'zh' ? '年度收益（首年）' : 'Annual Revenue (Year 1)'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">{t('chargingRevenue', language)}</span>
                <span className="font-medium text-primary">{formatCurrency(result.annualChargingRevenue, currency, language)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">{t('electricitySavings', language)}</span>
                <span className="font-medium text-primary">{formatCurrency(result.annualElectricitySavings, currency, language)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4">
                <span className="font-bold">{t('totalRevenue', language)}</span>
                <span className="font-bold text-primary">{formatCurrency(result.annualTotalRevenue, currency, language)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary">
          <CardHeader className="bg-secondary text-secondary-foreground">
            <CardTitle>{language === 'zh' ? '年度成本与税务' : 'Annual Costs & Taxes'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">{t('maintenanceCost', language)}</span>
                <span className="font-medium">{formatCurrency(result.annualMaintenanceCost, currency, language)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">{t('insuranceCost', language)}</span>
                <span className="font-medium">{formatCurrency(result.annualInsuranceCost, currency, language)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">{t('annualDepreciation', language)}</span>
                <span className="font-medium">{formatCurrency(result.annualDepreciation, currency, language)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">{t('annualTax', language)}</span>
                <span className="font-medium">{formatCurrency(result.annualTax, currency, language)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4">
                <span className="font-bold">{t('annualNetProfit', language)}</span>
                {(() => {
                  const profitFormatted = formatProfit(result.annualNetProfit, currency, language)
                  return (
                    <span className={`font-bold ${profitFormatted.className}`}>
                      {profitFormatted.text}
                    </span>
                  )
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LCOE */}
  <Card className="border-2 border-secondary">
    <CardHeader className="bg-secondary text-secondary-foreground">
      <CardTitle>{t('lcoeTitle', language)}</CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-primary">
          {(() => {
            // LCOE需要转换货币
            const convertedLCOE = convertCurrency(result.lcoe, 'CNY', currency)
            const locale = language === 'zh' ? 'zh-CN' : 'en-ZA'
            if (currency === 'ZAR') {
              return 'R' + convertedLCOE.toLocaleString(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) + '/kWh'
            } else {
              return convertedLCOE.toLocaleString(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) + ' CNY/kWh'
            }
          })()}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t('lcoeDesc', language)}
        </p>
      </div>
    </CardContent>
  </Card>

      {/* IRR计算详情表格 */}
      <Card className="border-2 border-primary">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle>{t('irrStepTitle', language)}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">{t('irrFormula', language)}</h4>
            <div className="font-mono text-sm bg-background p-3 rounded border">
              NPV = CF₀ + CF₁/(1+r)¹ + CF₂/(1+r)² + ... + CF₂₅/(1+r)²⁵ = 0
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'zh' ? '其中' : 'where'}: CF₀ = -Initial Investment, r = IRR, CFₜ = Year t Net Cash Flow
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-2 px-2">{t('yearColumn', language)}</th>
                  <th className="text-right py-2 px-2">{t('cashFlowColumn', language)}</th>
                  <th className="text-right py-2 px-2">{language === 'zh' ? '折现因子 (1/(1+r)ᵗ)' : 'Discount Factor (1/(1+r)ᵗ)'}</th>
                  <th className="text-right py-2 px-2">{t('discountedCashFlowColumn', language)}</th>
                  <th className="text-right py-2 px-2">{t('cumulativeNpvColumn', language)}</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const cashFlows = [-result.totalInvestment, ...result.cashFlows.map(cf => cf.netCashFlow)]
                  const details = getIRRCalculationDetails(cashFlows, result.irr)
                  return details.map((detail) => {
                    const cfFormatted = formatProfit(detail.cashFlow, currency, language)
                    const discCfFormatted = formatProfit(detail.discountedCashFlow, currency, language)
                    const cumNpvFormatted = formatProfit(detail.cumulativeNPV, currency, language)
                    return (
                      <tr key={detail.year} className="border-b border-border hover:bg-muted/30">
                        <td className="py-2 px-2">
                          {formatYearLabel(detail.year)}
                        </td>
                        <td className="text-right py-2 px-2 font-mono">
                          {cfFormatted.text}
                        </td>
                        <td className="text-right py-2 px-2 font-mono">
                          {detail.discountFactor.toFixed(6)}
                        </td>
                        <td className="text-right py-2 px-2 font-mono">
                          {discCfFormatted.text}
                        </td>
                        <td className="text-right py-2 px-2 font-mono">
                          {cumNpvFormatted.text}
                        </td>
                      </tr>
                    )
                  })
                })()}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">{t('irrValue', language)}</span>
              <span className="font-bold text-lg text-primary">{result.irr.toFixed(4)}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'zh' ? '使用此折现率计算，最终累计NPV应接近0' : 'Using this discount rate, final cumulative NPV should approach 0'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  )
}
