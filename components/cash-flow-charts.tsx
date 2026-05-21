"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalculationResult, formatCurrency, formatNumber } from "@/lib/calculations"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts"

interface CashFlowChartsProps {
  result: CalculationResult
}

export function CashFlowCharts({ result }: CashFlowChartsProps) {
  // 准备图表数据
  const cashFlowData = result.cashFlows.map((cf) => ({
    year: `第${cf.year}年`,
    yearNum: cf.year,
    发电量: Math.round(cf.generation),
    年净现金流: Math.round(cf.netCashFlow),
    累计现金流: Math.round(cf.cumulativeCashFlow),
    折现现金流: Math.round(cf.discountedCashFlow),
    年收益: Math.round(cf.revenue),
    运营成本: Math.round(cf.operatingCost),
    税金: Math.round(cf.tax),
  }))

  // 投资构成数据
  const investmentData = [
    { name: "光伏系统", value: result.pvSystemCost, fill: "hsl(var(--chart-1))" },
    { name: "储能系统", value: result.storageSystemCost, fill: "hsl(var(--chart-2))" },
    { name: "充电桩", value: result.chargingSystemCost, fill: "hsl(var(--chart-3))" },
    { name: "逆变器", value: result.inverterCost, fill: "hsl(var(--chart-4))" },
    { name: "其他成本", value: result.otherCosts, fill: "hsl(var(--chart-5))" },
  ]

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' && entry.name.includes('发电量') 
                ? `${formatNumber(entry.value, 0)} kWh`
                : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* 累计现金流图 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>累计现金流曲线</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="yearNum" 
                  tickFormatter={(value) => `${value}年`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="累计现金流"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="年净现金流"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            红线为年净现金流，蓝色区域为累计现金流
          </p>
        </CardContent>
      </Card>

      {/* 发电量衰减曲线 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>年发电量预测 (含衰减)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="yearNum" 
                  tickFormatter={(value) => `${value}年`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="发电量"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 年度收支对比 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>年度收支对比</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData.filter((_, i) => i % 5 === 0 || i === cashFlowData.length - 1)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="年收益" fill="hsl(var(--chart-1))" />
                <Bar dataKey="运营成本" fill="hsl(var(--chart-3))" />
                <Bar dataKey="税金" fill="hsl(var(--chart-5))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 投资构成 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>投资构成分析</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" name="投资金额" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
            {investmentData.map((item, index) => (
              <div key={index}>
                <div className="font-medium">{item.name}</div>
                <div className="text-muted-foreground">
                  {((item.value / result.totalInvestment) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 现金流明细表 */}
      <Card className="border-2 border-secondary">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>现金流明细表</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">年份</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">发电量 (kWh)</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">年收益</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">运营成本</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">折旧</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">税金</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">净现金流</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">累计现金流</th>
              </tr>
            </thead>
            <tbody>
              {result.cashFlows.slice(0, 10).map((cf, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50">
                  <td className="py-2 px-2">第{cf.year}年</td>
                  <td className="text-right py-2 px-2">{formatNumber(cf.generation, 0)}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(cf.revenue)}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(cf.operatingCost)}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(cf.depreciation)}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(cf.tax)}</td>
                  <td className="text-right py-2 px-2 text-primary font-medium">
                    {formatCurrency(cf.netCashFlow)}
                  </td>
                  <td className={`text-right py-2 px-2 font-medium ${cf.cumulativeCashFlow >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {formatCurrency(cf.cumulativeCashFlow)}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-border">
                <td colSpan={8} className="text-center py-2 text-muted-foreground">
                  ... 省略第11-25年数据 ...
                </td>
              </tr>
              {result.cashFlows.slice(-1).map((cf, index) => (
                <tr key={index} className="bg-muted/30 font-medium">
                  <td className="py-2 px-2">第{cf.year}年</td>
                  <td className="text-right py-2 px-2">{formatNumber(cf.generation, 0)}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(cf.revenue)}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(cf.operatingCost)}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(cf.depreciation)}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(cf.tax)}</td>
                  <td className="text-right py-2 px-2 text-primary">
                    {formatCurrency(cf.netCashFlow)}
                  </td>
                  <td className="text-right py-2 px-2 text-primary">
                    {formatCurrency(cf.cumulativeCashFlow)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
