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
import { useApp } from "@/lib/app-context"
import { t, formatNumber as tFormatNumber } from "@/lib/i18n"

export default function HomePage() {
  const [config, setConfig] = useState<SystemConfig>(SOUTH_AFRICA_DEFAULTS)
  const [activeTab, setActiveTab] = useState("system")
  const { language, setLanguage, currency, setCurrency } = useApp()
  
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
              <h1 className="text-lg font-bold text-foreground">{t('appTitle', language)}</h1>
              <p className="text-xs text-muted-foreground">{t('appSubtitle', language)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <div className="flex border border-border rounded-md overflow-hidden">
              <Button
                variant={language === 'zh' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none h-8 px-3"
                onClick={() => setLanguage('zh')}
              >
                中文
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none h-8 px-3"
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
            </div>
            {/* Currency Switch */}
            <div className="flex border border-border rounded-md overflow-hidden">
              <Button
                variant={currency === 'CNY' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none h-8 px-3"
                onClick={() => setCurrency('CNY')}
              >
                CNY
              </Button>
              <Button
                variant={currency === 'ZAR' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none h-8 px-3"
                onClick={() => setCurrency('ZAR')}
              >
                ZAR
              </Button>
            </div>
            <Button onClick={handleReset} variant="outline" className="border-secondary">
              {t('resetDefaults', language)}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 光伏板规格说明 */}
        <div className="mb-8 rounded-lg border-2 border-primary bg-primary/5 p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">{t('panelSpecsTitle', language)}</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <span className="text-muted-foreground">{t('panelPower', language)}:</span>
              <span className="font-medium">{GCL_625W_SPECS.power}W</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('panelEfficiency', language)}:</span>
              <span className="font-medium">{(GCL_625W_SPECS.efficiency * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('panelArea', language)}:</span>
              <span className="font-medium">{formatNumber(GCL_625W_SPECS.area, 2)} m²</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('totalPanelArea', language)}:</span>
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
                  {t('systemSetup', language)}
                </TabsTrigger>
                <TabsTrigger value="financial" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  {t('financialParams', language)}
                </TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  {t('investmentAnalysis', language)}
                </TabsTrigger>
                <TabsTrigger value="cashflow" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  {t('cashflowAnalysis', language)}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="system" className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">{t('step1Title', language)}</h2>
                  <p className="text-muted-foreground">{t('step1Desc', language)}</p>
                </div>
                <SystemInputs config={config} onChange={setConfig} />
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">{t('step2Title', language)}</h2>
                  <p className="text-muted-foreground">{t('step2Desc', language)}</p>
                </div>
                <FinancialInputs config={config} onChange={setConfig} />
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">{t('investmentResultsTitle', language)}</h2>
                  <p className="text-muted-foreground">{t('investmentResultsDesc', language)}</p>
                </div>
                <ResultsSummary result={result} config={config} />
              </TabsContent>

              <TabsContent value="cashflow" className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">{t('cashflowResultsTitle', language)}</h2>
                  <p className="text-muted-foreground">{t('cashflowResultsDesc', language)}</p>
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
          <h3 className="font-bold text-foreground mb-2">{t('importantNotes', language)}</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>{t('note1', language)}</li>
            <li>{t('note2', language)}</li>
            <li>{t('note3', language)}</li>
            <li>{t('note4', language)}</li>
            <li>{t('note5', language)}</li>
            <li>{t('note6', language)}: {currency}</li>
            <li className="text-primary font-medium">{t('note7', language)}</li>
          </ul>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-border bg-muted/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t('footerLine1', language)}</p>
        </div>
      </footer>
    </div>
  )
}
