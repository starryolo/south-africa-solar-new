"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalculationResult, SystemConfig, formatNumber, GCL_625W_SPECS } from "@/lib/calculations"
import { useApp } from "@/lib/app-context"
import { t, formatCurrency, formatProfit, convertCurrency } from "@/lib/i18n"

interface LivePreviewProps {
  config: SystemConfig
  result: CalculationResult
}

interface SystemWarning {
  type: "warning" | "info" | "success"
  message: string
}

export function LivePreview({ config, result }: LivePreviewProps) {
  const { language, currency } = useApp()
  
  // 计算系统匹配度和建议
  const warnings: SystemWarning[] = []
  
  // 检查逆变器容量与光伏容量匹配
  const pvCapacity = result.totalPVCapacity
  const inverterCapacity = result.totalInverterCapacity
  const inverterRatio = inverterCapacity / pvCapacity
  
  if (inverterRatio < 0.8) {
    warnings.push({
      type: "warning",
      message: language === 'zh' 
        ? `逆变器容量不足: 光伏 ${formatNumber(pvCapacity, 1)}kW vs 逆变器 ${formatNumber(inverterCapacity, 0)}kW (比例 ${formatNumber(inverterRatio * 100, 0)}%)，建议逆变器容量至少为光伏容量的80%`
        : `Inverter capacity insufficient: PV ${formatNumber(pvCapacity, 1)}kW vs Inverter ${formatNumber(inverterCapacity, 0)}kW (Ratio ${formatNumber(inverterRatio * 100, 0)}%). Recommend at least 80% inverter capacity relative to PV capacity.`
    })
  } else if (inverterRatio > 1.5) {
    warnings.push({
      type: "info",
      message: language === 'zh' 
        ? `逆变器容量过剩: 比例 ${formatNumber(inverterRatio * 100, 0)}%，可适当减少逆变器数量以降低成本`
        : `Inverter capacity excess: Ratio ${formatNumber(inverterRatio * 100, 0)}%. Can reduce inverter count to lower costs.`
    })
  } else {
    warnings.push({
      type: "success",
      message: language === 'zh' 
        ? `逆变器容量匹配良好 (${formatNumber(inverterRatio * 100, 0)}%)`
        : `Inverter capacity match good (${formatNumber(inverterRatio * 100, 0)}%)`
    })
  }
  
  // 检查储能与光伏匹配
  const storageToSolarRatio = result.totalStorageCapacity / (result.annualGeneration / 365)
  if (storageToSolarRatio < 0.3) {
    warnings.push({
      type: "info",
      message: language === 'zh' 
        ? `储能容量较小: 仅能存储约 ${formatNumber(storageToSolarRatio * 100, 0)}% 日发电量，可能影响电网备用价值`
        : `Storage capacity small: Only about ${formatNumber(storageToSolarRatio * 100, 0)}% of daily generation can be stored. May impact grid backup value.`
    })
  }
  
  // 检查充电桩功率与系统匹配
  const chargingPowerRatio = result.totalChargingPower / pvCapacity
  if (chargingPowerRatio > 0.8) {
    warnings.push({
      type: "info",
      message: language === 'zh' 
        ? `充电桩功率较高 (${formatNumber(chargingPowerRatio * 100, 0)}% 光伏容量)，高峰期可能需要电网补充供电`
        : `Charging power high (${formatNumber(chargingPowerRatio * 100, 0)}% of PV capacity). May require grid supplement during peak periods.`
    })
  }
  
  // 检查回收期
  if (result.simplePaybackYears > 10) {
    warnings.push({
      type: "warning",
      message: language === 'zh' 
        ? `回收期较长 (${formatNumber(result.simplePaybackYears, 1)}年)，建议优化配置或调整价格参数`
        : `Payback period long (${formatNumber(result.simplePaybackYears, 1)} years). Recommend optimizing configuration or adjusting price parameters.`
    })
  } else if (result.simplePaybackYears < 5) {
    warnings.push({
      type: "success",
      message: language === 'zh' 
        ? `投资回收期优秀 (${formatNumber(result.simplePaybackYears, 1)}年)，项目经济性良好`
        : `Excellent payback period (${formatNumber(result.simplePaybackYears, 1)} years). Good project economics.`
    })
  }

  // 计算光伏面积
  const panelArea = GCL_625W_SPECS.area * config.pvPanelCount

  return (
    <div className="space-y-4">
      {/* 实时关键指标 */}
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-2 px-3 md:px-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <svg className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="truncate">{t('liveOverview', language)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg">
              <div className="text-base md:text-xl font-bold text-primary truncate">
                {formatNumber(result.simplePaybackYears, 1)} {language === 'zh' ? '年' : 'yr'}
              </div>
              <div className="text-[10px] md:text-xs text-muted-foreground">{t('paybackPeriod', language)}</div>
            </div>
            <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg">
              <div className="text-base md:text-xl font-bold text-primary truncate">
                {formatNumber(result.irr, 2)}%
              </div>
              <div className="text-[10px] md:text-xs text-muted-foreground">IRR</div>
            </div>
            <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg">
              <div className={`text-base md:text-xl font-bold truncate ${result.npv >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {formatCurrency(result.npv, currency, language)}
              </div>
              <div className="text-[10px] md:text-xs text-muted-foreground">NPV</div>
            </div>
            <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg">
              <div className="text-base md:text-xl font-bold text-primary truncate">
                {formatNumber(result.roi, 1)}%
              </div>
              <div className="text-[10px] md:text-xs text-muted-foreground">ROI</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 系统规模实时显示 */}
      <Card className="border border-border">
        <CardHeader className="pb-2 px-3 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">{t('systemScale', language)}</CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
            <div className="flex flex-col md:flex-row md:justify-between gap-0.5">
              <span className="text-muted-foreground">{t('pvCapacity', language)}</span>
              <span className="font-medium">{formatNumber(pvCapacity, 1)} kW</span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between gap-0.5">
              <span className="text-muted-foreground">{t('panelArea', language)}</span>
              <span className="font-medium">{formatNumber(panelArea, 1)} m²</span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between gap-0.5">
              <span className="text-muted-foreground">{t('storageCapacity', language)}</span>
              <span className="font-medium">{formatNumber(result.totalStorageCapacity, 1)} kWh</span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between gap-0.5">
              <span className="text-muted-foreground">{t('chargingPower', language)}</span>
              <span className="font-medium">{formatNumber(result.totalChargingPower, 0)} kW</span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between gap-0.5">
              <span className="text-muted-foreground">{t('inverterCapacity', language)}</span>
              <span className="font-medium">{formatNumber(inverterCapacity, 0)} kW</span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between gap-0.5">
              <span className="text-muted-foreground">{t('annualGeneration', language)}</span>
              <span className="font-medium">{formatNumber(result.annualGeneration / 1000, 1)} MWh</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 投资与收益实时显示 */}
      <Card className="border border-border">
        <CardHeader className="pb-2 px-3 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">{t('investmentAndRevenue', language)}</CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">{t('totalInvestment', language)}</span>
              <span className="font-medium">{formatCurrency(result.totalInvestment, currency, language)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">{t('annualTotalRevenue', language)}</span>
              <span className="font-medium text-primary">{formatCurrency(result.annualTotalRevenue, currency, language)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">{t('annualNetProfit', language)}</span>
              {(() => {
                const profitFormatted = formatProfit(result.annualNetProfit, currency, language)
                return (
                  <span className={`font-medium ${profitFormatted.className}`}>
                    {profitFormatted.text}
                  </span>
                )
              })()}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">{t('lcoeTitle', language)}</span>
              <span className="font-medium">
                {(() => {
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
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 每平方米发电效率 */}
      <Card className="border border-border">
        <CardHeader className="pb-2 px-3 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">{t('pvEfficiency', language)}</CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">{language === 'zh' ? '年发电/m²' : 'Annual/m²'}</span>
              <span className="font-medium">{formatNumber(result.pvEfficiencyPerSqm, 0)} kWh</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">{language === 'zh' ? '日发电/m²' : 'Daily/m²'}</span>
              <span className="font-medium">{formatNumber(result.pvEfficiencyPerSqm / 365, 2)} kWh</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">{language === 'zh' ? '功率密度' : 'Power Density'}</span>
              <span className="font-medium">{formatNumber(config.pvPanelPower / GCL_625W_SPECS.area, 0)} W/m²</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">{language === 'zh' ? '系统效率' : 'System Efficiency'}</span>
              <span className="font-medium">85%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 系统诊断 */}
      <Card className="border border-border">
        <CardHeader className="pb-2 px-3 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">{t('systemDiagnostics', language)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-3 md:px-6">
          {warnings.map((warning, index) => (
            <Alert 
              key={index} 
              className={`py-2 px-3 ${
                warning.type === 'warning' 
                  ? 'border-amber-500 bg-amber-500/10' 
                  : warning.type === 'success' 
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-blue-500 bg-blue-500/10'
              }`}
            >
              <AlertDescription className={`text-[10px] md:text-xs leading-relaxed ${
                warning.type === 'warning' 
                  ? 'text-amber-700 dark:text-amber-300' 
                  : warning.type === 'success' 
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-blue-700 dark:text-blue-300'
              }`}>
                <span className="inline-block mr-1">
                  {warning.type === 'warning' && '⚠️'}
                  {warning.type === 'success' && '✓'}
                  {warning.type === 'info' && 'ℹ️'}
                </span>
                {warning.message}
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
