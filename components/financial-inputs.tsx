"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SystemConfig, formatNumber, formatCurrency } from "@/lib/calculations"

interface FinancialInputsProps {
  config: SystemConfig
  onChange: (config: SystemConfig) => void
}

export function FinancialInputs({ config, onChange }: FinancialInputsProps) {
  const updateConfig = (field: keyof SystemConfig, value: number) => {
    onChange({ ...config, [field]: value })
  }

  // 计算派生值
  const pvCapacity = (config.pvPanelPower * config.pvPanelCount) / 1000
  const annualGeneration = pvCapacity * config.peakSunHours * 365 * 0.85
  const totalChargingPower = config.chargerPower * config.chargerCount
  const dailyChargingEnergy = totalChargingPower * config.dailyChargingHours * (config.chargerUtilization / 100)
  
  // 收益预估
  const annualChargingRevenue = dailyChargingEnergy * 365 * config.chargingPrice
  const annualElectricitySavings = annualGeneration * 0.8 * config.electricityBuyPrice + 
                                   annualGeneration * 0.2 * config.electricitySellPrice

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 电价参数 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            电价参数
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* 实时收益预估 */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">预估年充电收入:</span>
              <span className="font-bold text-primary">{formatCurrency(annualChargingRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">预估年电费节省:</span>
              <span className="font-bold text-primary">{formatCurrency(annualElectricitySavings)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-border">
              <span className="text-muted-foreground">预估年总收益:</span>
              <span className="font-bold text-primary">{formatCurrency(annualChargingRevenue + annualElectricitySavings)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="electricityBuyPrice">电网购电价 (ZAR/kWh): {config.electricityBuyPrice}</Label>
              <Slider
                value={[config.electricityBuyPrice]}
                onValueChange={([value]) => updateConfig("electricityBuyPrice", value)}
                min={1.5}
                max={5}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground">南非商业电价约 2.5-3.5 ZAR</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="electricitySellPrice">上网售电价 (ZAR/kWh): {config.electricitySellPrice}</Label>
              <Slider
                value={[config.electricitySellPrice]}
                onValueChange={([value]) => updateConfig("electricitySellPrice", value)}
                min={0.5}
                max={3}
                step={0.05}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gridReliability">电网可靠性 (%): {config.gridReliability}%</Label>
            <Slider
              value={[config.gridReliability]}
              onValueChange={([value]) => updateConfig("gridReliability", value)}
              min={50}
              max={100}
              step={5}
            />
            <p className="text-xs text-muted-foreground">南非电网可靠性约 70%，影响储能价值</p>
          </div>
        </CardContent>
      </Card>

      {/* 税务参数 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            南非税务参数
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* 税务信息说明 */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              南非税务体系：企业所得税 {config.corporateTaxRate}% + 增值税 {config.vatRate}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              可再生能源投资可享受Section 12B加速折旧优惠
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="corporateTaxRate">企业所得税率 (%): {config.corporateTaxRate}%</Label>
              <Slider
                value={[config.corporateTaxRate]}
                onValueChange={([value]) => updateConfig("corporateTaxRate", value)}
                min={15}
                max={35}
                step={1}
              />
              <p className="text-xs text-muted-foreground">南非企业税率 27%</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatRate">增值税率 VAT (%): {config.vatRate}%</Label>
              <Slider
                value={[config.vatRate]}
                onValueChange={([value]) => updateConfig("vatRate", value)}
                min={0}
                max={20}
                step={1}
              />
              <p className="text-xs text-muted-foreground">南非 VAT 15%</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="depreciationYears">折旧年限 (年): {config.depreciationYears}年</Label>
            <Slider
              value={[config.depreciationYears]}
              onValueChange={([value]) => updateConfig("depreciationYears", value)}
              min={3}
              max={25}
              step={1}
            />
            <p className="text-xs text-muted-foreground">南非可再生能源可享受加速折旧优惠 (3-10年)</p>
          </div>
        </CardContent>
      </Card>

      {/* 投资参数 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            投资参数
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* 投资参数说明 */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              贴现率影响NPV计算，项目周期影响总收益
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountRate">贴现率 (%): {config.discountRate}%</Label>
              <Slider
                value={[config.discountRate]}
                onValueChange={([value]) => updateConfig("discountRate", value)}
                min={5}
                max={20}
                step={0.5}
              />
              <p className="text-xs text-muted-foreground">常用范围: 8-15%</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectLifeYears">项目周期 (年): {config.projectLifeYears}年</Label>
              <Slider
                value={[config.projectLifeYears]}
                onValueChange={([value]) => updateConfig("projectLifeYears", value)}
                min={10}
                max={30}
                step={1}
              />
              <p className="text-xs text-muted-foreground">光伏设计寿命通常25年</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 运营参数 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            运营参数
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* 运营成本预估 */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              年衰减率 {config.annualDegradation}% | 运维成本率 {config.maintenanceCostRate}% | 保险费率 {config.insuranceRate}%
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annualDegradation">年衰减率 (%): {config.annualDegradation}%</Label>
              <Slider
                value={[config.annualDegradation]}
                onValueChange={([value]) => updateConfig("annualDegradation", value)}
                min={0.1}
                max={2}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">优质组件年衰减约0.4-0.7%</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceCostRate">年运维成本率 (%): {config.maintenanceCostRate}%</Label>
              <Slider
                value={[config.maintenanceCostRate]}
                onValueChange={([value]) => updateConfig("maintenanceCostRate", value)}
                min={0.5}
                max={3}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">占总投资的百分比</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="insuranceRate">保险费率 (%): {config.insuranceRate}%</Label>
            <Slider
              value={[config.insuranceRate]}
              onValueChange={([value]) => updateConfig("insuranceRate", value)}
              min={0.1}
              max={2}
              step={0.1}
            />
            <p className="text-xs text-muted-foreground">占总投资的年百分比</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
