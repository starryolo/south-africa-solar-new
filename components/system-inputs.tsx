"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SystemConfig, GCL_625W_SPECS, formatNumber } from "@/lib/calculations"

interface SystemInputsProps {
  config: SystemConfig
  onChange: (config: SystemConfig) => void
}

export function SystemInputs({ config, onChange }: SystemInputsProps) {
  const updateConfig = (field: keyof SystemConfig, value: number) => {
    onChange({ ...config, [field]: value })
  }

  // 计算派生值
  const pvCapacity = (config.pvPanelPower * config.pvPanelCount) / 1000
  const pvArea = GCL_625W_SPECS.area * config.pvPanelCount
  const totalStorageCapacity = config.batteryCapacity * config.batteryCount
  const usableStorageCapacity = totalStorageCapacity * (config.batteryDOD / 100)
  const totalChargingPower = config.chargerPower * config.chargerCount
  const totalInverterCapacity = config.inverterPower * config.inverterCount
  const inverterRatio = totalInverterCapacity / pvCapacity

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 光伏系统配置 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            光伏系统配置
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* 实时计算显示 */}
          <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">总容量: </span>
              <span className="font-bold text-primary">{formatNumber(pvCapacity, 1)} kW</span>
            </div>
            <div>
              <span className="text-muted-foreground">总面积: </span>
              <span className="font-bold text-primary">{formatNumber(pvArea, 1)} m²</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pvPanelPower">单块光伏板功率 (W)</Label>
              <Input
                id="pvPanelPower"
                type="number"
                value={config.pvPanelPower}
                onChange={(e) => updateConfig("pvPanelPower", Number(e.target.value))}
                className="border-secondary"
              />
              <p className="text-xs text-muted-foreground">协鑫625W双玻型</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pvPanelCount">光伏板数量 (块)</Label>
              <Input
                id="pvPanelCount"
                type="number"
                value={config.pvPanelCount}
                onChange={(e) => updateConfig("pvPanelCount", Number(e.target.value))}
                className="border-secondary"
              />
              <Slider
                value={[config.pvPanelCount]}
                onValueChange={([value]) => updateConfig("pvPanelCount", value)}
                min={10}
                max={500}
                step={10}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pvPanelPrice">单块价格 (CNY)</Label>
              <Input
                id="pvPanelPrice"
                type="number"
                value={config.pvPanelPrice}
                onChange={(e) => updateConfig("pvPanelPrice", Number(e.target.value))}
                className="border-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pvInstallationCost">安装成本 (CNY/kW)</Label>
              <Input
                id="pvInstallationCost"
                type="number"
                value={config.pvInstallationCost}
                onChange={(e) => updateConfig("pvInstallationCost", Number(e.target.value))}
                className="border-secondary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="peakSunHours">年均峰值日照 (小时/天)</Label>
            <Input
              id="peakSunHours"
              type="number"
              step="0.1"
              value={config.peakSunHours}
              onChange={(e) => updateConfig("peakSunHours", Number(e.target.value))}
              className="border-secondary"
            />
            <Slider
              value={[config.peakSunHours]}
              onValueChange={([value]) => updateConfig("peakSunHours", value)}
              min={3}
              max={8}
              step={0.1}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">南非平均约 5.0-6.0 小时</p>
          </div>
        </CardContent>
      </Card>

      {/* 储能系统配置 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            储能系统配置
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* 实时计算显示 */}
          <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">总容量: </span>
              <span className="font-bold text-primary">{formatNumber(totalStorageCapacity, 1)} kWh</span>
            </div>
            <div>
              <span className="text-muted-foreground">可用容量: </span>
              <span className="font-bold text-primary">{formatNumber(usableStorageCapacity, 1)} kWh</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batteryCapacity">单块电池容量 (kWh)</Label>
              <Input
                id="batteryCapacity"
                type="number"
                step="0.01"
                value={config.batteryCapacity}
                onChange={(e) => updateConfig("batteryCapacity", Number(e.target.value))}
                className="border-secondary"
              />
              <p className="text-xs text-muted-foreground">标准 5.12kWh 模块</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="batteryCount">电池数量 (块)</Label>
              <Input
                id="batteryCount"
                type="number"
                value={config.batteryCount}
                onChange={(e) => updateConfig("batteryCount", Number(e.target.value))}
                className="border-secondary"
              />
              <Slider
                value={[config.batteryCount]}
                onValueChange={([value]) => updateConfig("batteryCount", value)}
                min={1}
                max={50}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batteryPrice">单块价格 (CNY)</Label>
              <Input
                id="batteryPrice"
                type="number"
                value={config.batteryPrice}
                onChange={(e) => updateConfig("batteryPrice", Number(e.target.value))}
                className="border-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batteryDOD">放电深度 DOD (%)</Label>
              <Input
                id="batteryDOD"
                type="number"
                value={config.batteryDOD}
                onChange={(e) => updateConfig("batteryDOD", Number(e.target.value))}
                className="border-secondary"
              />
              <Slider
                value={[config.batteryDOD]}
                onValueChange={([value]) => updateConfig("batteryDOD", value)}
                min={50}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 充电桩配置 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            充电桩配置
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* 实时计算显示 */}
          <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">总功率: </span>
              <span className="font-bold text-primary">{formatNumber(totalChargingPower, 0)} kW</span>
            </div>
            <div>
              <span className="text-muted-foreground">日充电量: </span>
              <span className="font-bold text-primary">
                {formatNumber(totalChargingPower * config.dailyChargingHours * (config.chargerUtilization / 100), 0)} kWh
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chargerPower">单桩功率 (kW)</Label>
              <Input
                id="chargerPower"
                type="number"
                value={config.chargerPower}
                onChange={(e) => updateConfig("chargerPower", Number(e.target.value))}
                className="border-secondary"
              />
              <p className="text-xs text-muted-foreground">7kW 交流充电桩</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chargerCount">充电桩数量 (台)</Label>
              <Input
                id="chargerCount"
                type="number"
                value={config.chargerCount}
                onChange={(e) => updateConfig("chargerCount", Number(e.target.value))}
                className="border-secondary"
              />
              <Slider
                value={[config.chargerCount]}
                onValueChange={([value]) => updateConfig("chargerCount", value)}
                min={1}
                max={20}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chargerPrice">单桩价格 (CNY)</Label>
              <Input
                id="chargerPrice"
                type="number"
                value={config.chargerPrice}
                onChange={(e) => updateConfig("chargerPrice", Number(e.target.value))}
                className="border-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chargerUtilization">利用率 (%): {config.chargerUtilization}%</Label>
              <Slider
                value={[config.chargerUtilization]}
                onValueChange={([value]) => updateConfig("chargerUtilization", value)}
                min={10}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chargingPrice">充电价格 (CNY/kWh)</Label>
              <Input
                id="chargingPrice"
                type="number"
                step="0.01"
                value={config.chargingPrice}
                onChange={(e) => updateConfig("chargingPrice", Number(e.target.value))}
                className="border-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyChargingHours">日均充电时长 (小时)</Label>
              <Input
                id="dailyChargingHours"
                type="number"
                value={config.dailyChargingHours}
                onChange={(e) => updateConfig("dailyChargingHours", Number(e.target.value))}
                className="border-secondary"
              />
              <Slider
                value={[config.dailyChargingHours]}
                onValueChange={([value]) => updateConfig("dailyChargingHours", value)}
                min={1}
                max={24}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 逆变器配置 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            逆变器配置
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* 实时计算显示 */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">总容量: </span>
              <span className="font-bold text-primary">{formatNumber(totalInverterCapacity, 0)} kW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">容量比 (逆变器/光伏): </span>
              <span className={`font-bold ${inverterRatio >= 0.8 && inverterRatio <= 1.5 ? 'text-green-600' : 'text-amber-600'}`}>
                {formatNumber(inverterRatio * 100, 0)}%
              </span>
            </div>
            {inverterRatio < 0.8 && (
              <p className="text-xs text-amber-600">建议增加逆变器容量至光伏容量的80%以上</p>
            )}
            {inverterRatio > 1.5 && (
              <p className="text-xs text-amber-600">逆变器容量过剩，可适当减少以降低成本</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inverterPower">单台功率 (kW)</Label>
              <Input
                id="inverterPower"
                type="number"
                value={config.inverterPower}
                onChange={(e) => updateConfig("inverterPower", Number(e.target.value))}
                className="border-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inverterCount">逆变器数量 (台)</Label>
              <Input
                id="inverterCount"
                type="number"
                value={config.inverterCount}
                onChange={(e) => updateConfig("inverterCount", Number(e.target.value))}
                className="border-secondary"
              />
              <Slider
                value={[config.inverterCount]}
                onValueChange={([value]) => updateConfig("inverterCount", value)}
                min={1}
                max={20}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inverterPrice">单台价格 (CNY)</Label>
            <Input
              id="inverterPrice"
              type="number"
              value={config.inverterPrice}
              onChange={(e) => updateConfig("inverterPrice", Number(e.target.value))}
              className="border-secondary"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
