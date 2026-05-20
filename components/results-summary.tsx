"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalculationResult, formatCurrency, formatNumber, verifyIRR, SystemConfig } from "@/lib/calculations"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMemo } from "react"

interface ResultsSummaryProps {
  result: CalculationResult
  config: SystemConfig
}

export function ResultsSummary({ result, config }: ResultsSummaryProps) {
  // 验证IRR计算精度
  const irrVerification = useMemo(() => {
    const cashFlows = [-result.totalInvestment, ...result.cashFlows.map(cf => cf.netCashFlow)]
    return verifyIRR(cashFlows, result.irr)
  }, [result])

  // IRR精度等级判定
  const irrPrecisionLevel = useMemo(() => {
    if (irrVerification.precision < 0.01) return { label: "极高精度", color: "bg-green-500" }
    if (irrVerification.precision < 0.1) return { label: "高精度", color: "bg-green-400" }
    if (irrVerification.precision < 1) return { label: "中等精度", color: "bg-yellow-500" }
    return { label: "低精度", color: "bg-red-500" }
  }, [irrVerification])

  return (
    <TooltipProvider>
    <div className="space-y-6">
      {/* 核心指标卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              简单回收期
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatNumber(result.simplePaybackYears, 1)} 年
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              投资回本时间
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>内部收益率 IRR</span>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className={`${irrPrecisionLevel.color} text-white text-xs`}>
                    {irrPrecisionLevel.label}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1 text-xs">
                    <p>IRR验证: NPV@IRR = {irrVerification.npvAtIRR.toFixed(6)}</p>
                    <p>精度误差: {irrVerification.precision.toExponential(2)}</p>
                    <p>算法: 二分法 + 牛顿-拉弗森法</p>
                    <p>迭代精度: 1e-10</p>
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
              精确值: {result.irr.toFixed(8)}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              净现值 NPV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${result.npv >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(result.npv)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              项目净现值
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              投资回报率 ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatNumber(result.roi, 1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              年度投资回报
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 系统规模 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>系统规模总览</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.totalPVCapacity, 1)} kW
              </div>
              <div className="text-sm text-muted-foreground">光伏总容量</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.totalStorageCapacity, 1)} kWh
              </div>
              <div className="text-sm text-muted-foreground">储能总容量</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.usableStorageCapacity, 1)} kWh
              </div>
              <div className="text-sm text-muted-foreground">可用储能容量</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.totalChargingPower, 0)} kW
              </div>
              <div className="text-sm text-muted-foreground">充电总功率</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.totalInverterCapacity, 0)} kW
              </div>
              <div className="text-sm text-muted-foreground">逆变器总容量</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 发电量预测 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>发电量预测</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.annualGeneration, 0)} kWh
              </div>
              <div className="text-sm text-muted-foreground">年发电量</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.dailyGeneration, 1)} kWh
              </div>
              <div className="text-sm text-muted-foreground">日均发电量</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(result.pvEfficiencyPerSqm, 0)} kWh/m²/年
              </div>
              <div className="text-sm text-muted-foreground">每平方米发电量</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 投资成本明细 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>投资成本明细</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">光伏系统</span>
              <span className="font-medium">{formatCurrency(result.pvSystemCost)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">储能系统</span>
              <span className="font-medium">{formatCurrency(result.storageSystemCost)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">充电桩系统</span>
              <span className="font-medium">{formatCurrency(result.chargingSystemCost)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">逆变器</span>
              <span className="font-medium">{formatCurrency(result.inverterCost)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">其他成本 (线缆、配电、土建等)</span>
              <span className="font-medium">{formatCurrency(result.otherCosts)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4">
              <span className="font-bold text-lg">总投资</span>
              <span className="font-bold text-lg text-primary">{formatCurrency(result.totalInvestment)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 年度收益分析 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-secondary">
          <CardHeader className="bg-secondary text-secondary-foreground">
            <CardTitle>年度收益 (首年)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">充电服务收入</span>
                <span className="font-medium text-primary">{formatCurrency(result.annualChargingRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">电费节省</span>
                <span className="font-medium text-primary">{formatCurrency(result.annualElectricitySavings)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4">
                <span className="font-bold">年总收益</span>
                <span className="font-bold text-primary">{formatCurrency(result.annualTotalRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary">
          <CardHeader className="bg-secondary text-secondary-foreground">
            <CardTitle>年度成本与税务</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">运维成本</span>
                <span className="font-medium">{formatCurrency(result.annualMaintenanceCost)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">保险成本</span>
                <span className="font-medium">{formatCurrency(result.annualInsuranceCost)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">年折旧</span>
                <span className="font-medium">{formatCurrency(result.annualDepreciation)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">企业所得税</span>
                <span className="font-medium">{formatCurrency(result.annualTax)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4">
                <span className="font-bold">年净利润</span>
                <span className="font-bold text-primary">{formatCurrency(result.annualNetProfit)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LCOE */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>平准化度电成本 (LCOE)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">
              {formatNumber(result.lcoe, 2)} CNY/kWh
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              项目全生命周期平均度电成本
            </p>
          </div>
        </CardContent>
      </Card>

      {/* IRR详细计算说明 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>IRR 计算详情</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">计算参数</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">初始投资:</span>
                  <span>{formatCurrency(result.totalInvestment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">项目周期:</span>
                  <span>{config.projectLifeYears} 年</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">贴现率:</span>
                  <span>{config.discountRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">年衰减率:</span>
                  <span>{config.annualDegradation}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">验证结果</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IRR精确值:</span>
                  <span className="font-mono">{result.irr.toFixed(8)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NPV@IRR:</span>
                  <span className="font-mono">{irrVerification.npvAtIRR.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">计算误差:</span>
                  <span className="font-mono">{irrVerification.precision.toExponential(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">验证状态:</span>
                  <Badge variant={irrVerification.isValid ? "default" : "destructive"}>
                    {irrVerification.isValid ? "通过" : "需复核"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>计算方法:</strong> 采用二分法确定初始范围，再使用牛顿-拉弗森法精化结果，
              迭代精度设置为 1e-10。IRR 是使项目净现值 (NPV) 等于零的折现率，
              即满足 NPV = -初始投资 + Σ(年现金流 / (1+IRR)^t) = 0 的 IRR 值。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  )
}
