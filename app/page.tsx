"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { SystemInputs } from "@/components/system-inputs"
import { FinancialInputs } from "@/components/financial-inputs"
import { ResultsSummary } from "@/components/results-summary"
import { CashFlowCharts } from "@/components/cash-flow-charts"
import { LivePreview } from "@/components/live-preview"
import { 
  SystemConfig, 
  SOUTH_AFRICA_DEFAULTS, 
  calculateInvestmentModel,
  GCL_625W_SPECS,
  formatNumber
} from "@/lib/calculations"

export default function HomePage() {
  const [config, setConfig] = useState<SystemConfig>(SOUTH_AFRICA_DEFAULTS)
  const [activeTab, setActiveTab] = useState("system")
  
  // 使用 useMemo 缓存计算结果 - 每当 config 变化时自动重新计算
  const result = useMemo(() => calculateInvestmentModel(config), [config])
  
  // 重置为默认值
  const handleReset = () => {
    setConfig(SOUTH_AFRICA_DEFAULTS)
  }

  // 计算光伏板面积
  const panelArea = GCL_625W_SPECS.area * config.pvPanelCount

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-secondary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">南非商业光储充投资模型</h1>
              <p className="text-xs text-muted-foreground">Solar + Storage + Charging Investment Model</p>
            </div>
          </div>
          <Button onClick={handleReset} variant="outline" className="border-secondary">
            重置为默认值
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 光伏板规格说明 */}
        <div className="mb-8 rounded-lg border-2 border-primary bg-primary/5 p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">协鑫 625W 双玻型光伏板参数</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <span className="text-muted-foreground">单块功率：</span>
              <span className="font-medium">{GCL_625W_SPECS.power}W</span>
            </div>
            <div>
              <span className="text-muted-foreground">转换效率：</span>
              <span className="font-medium">{(GCL_625W_SPECS.efficiency * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">单块面积：</span>
              <span className="font-medium">{formatNumber(GCL_625W_SPECS.area, 2)} m²</span>
            </div>
            <div>
              <span className="text-muted-foreground">当前配置总面积：</span>
              <span className="font-medium">{formatNumber(panelArea, 1)} m²</span>
            </div>
          </div>
        </div>

        {/* 主内容区域 - 双栏布局 */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧：配置输入区域 */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-muted">
                <TabsTrigger value="system" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  系统配置
                </TabsTrigger>
                <TabsTrigger value="financial" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  财务参数
                </TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  投资分析
                </TabsTrigger>
                <TabsTrigger value="cashflow" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  现金流
                </TabsTrigger>
              </TabsList>

              <TabsContent value="system" className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">步骤 1：系统配置</h2>
                  <p className="text-muted-foreground">配置光伏、储能、充电桩和逆变器的规格与数量，右侧实时显示计算结果</p>
                </div>
                <SystemInputs config={config} onChange={setConfig} />
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">步骤 2：财务参数</h2>
                  <p className="text-muted-foreground">设置电价、税务和投资相关参数，所有修改实时反映在投资收益中</p>
                </div>
                <FinancialInputs config={config} onChange={setConfig} />
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">投资收益分析</h2>
                  <p className="text-muted-foreground">基于当前配置的投资回报指标和成本收益明细</p>
                </div>
                <ResultsSummary result={result} config={config} />
              </TabsContent>

              <TabsContent value="cashflow" className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">现金流分析</h2>
                  <p className="text-muted-foreground">25年项目周期现金流预测和图表分析</p>
                </div>
                <CashFlowCharts result={result} />
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧：实时预览面板 (在配置页面时显示) */}
          {(activeTab === "system" || activeTab === "financial") && (
            <div className="lg:w-96 lg:flex-shrink-0">
              <div className="sticky top-24">
                <LivePreview config={config} result={result} />
              </div>
            </div>
          )}
        </div>

        {/* 底部说明 */}
        <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
          <h3 className="font-bold text-foreground mb-2">重要说明</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>本模型基于南非商业用电环境和税收政策设计</li>
            <li>南非企业所得税率为 27%，增值税 (VAT) 为 15%</li>
            <li>��再生能源投资在南非可享受加速折旧优惠政策</li>
            <li>南非电网可靠性约 70%，储能系统可提供备用电源价值</li>
            <li>所有计算结果仅供参考，实际投资需进行详细可行性研究</li>
            <li>货币单位：人民币 (CNY)</li>
            <li className="text-primary font-medium">数据实时联动：修改任何参数后，计算结果自动更新</li>
          </ul>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-border bg-muted/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>南非商业光储充投资经济模型计算器</p>
          <p className="mt-1">South Africa Commercial PV + Storage + EV Charging Investment Model</p>
        </div>
      </footer>
    </div>
  )
}
