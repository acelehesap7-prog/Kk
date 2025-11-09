import React from 'react'
import { IMarketService, MarketData } from '@/types/market.types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { DollarSign } from 'lucide-react'
import { OrderBook } from './OrderBook'

interface TradingWidgetProps {
  market: MarketData
  marketService: IMarketService
  onTrade: (params: {
    symbol: string
    amount: number
    price: number
    type: 'buy' | 'sell'
    orderType: 'market' | 'limit'
    leverage: number
  }) => void
}

export function TradingWidget({ market, marketService, onTrade }: TradingWidgetProps) {
  const [orderType, setOrderType] = React.useState<'market' | 'limit'>('market')
  const [tradeType, setTradeType] = React.useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = React.useState('')
  const [price, setPrice] = React.useState(market.price.toString())
  const [leverage, setLeverage] = React.useState(1)

  React.useEffect(() => {
    setPrice(market.price.toString())
  }, [market.price])

  const handleTrade = () => {
    if (!amount || (orderType === 'limit' && !price)) {
      alert('Please fill in all required fields')
      return
    }

    onTrade({
      symbol: market.symbol,
      amount: parseFloat(amount),
      price: orderType === 'market' ? market.price : parseFloat(price),
      type: tradeType,
      orderType,
      leverage
    })
  }

  const positionValue = parseFloat(amount || '0') * market.price
  const marginRequired = positionValue / leverage

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Trade {market.symbol}</span>
            </div>
            <div className="text-2xl font-bold">${market.price.toFixed(4)}</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Order Type */}
            <Tabs value={orderType} onValueChange={(val) => setOrderType(val as 'market' | 'limit')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="limit">Limit</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Trade Type */}
            <Tabs value={tradeType} onValueChange={(val) => setTradeType(val as 'buy' | 'sell')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy / Long</TabsTrigger>
                <TabsTrigger value="sell">Sell / Short</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid gap-4">
              {/* Amount */}
              <div>
                <label className="text-sm font-medium">Amount (Lots)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.01"
                  min="0.01"
                  step="0.01"
                />
              </div>

              {/* Price for limit orders */}
              {orderType === 'limit' && (
                <div>
                  <label className="text-sm font-medium">Limit Price</label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={market.price.toString()}
                    step="0.0001"
                  />
                </div>
              )}

              {/* Leverage */}
              <div>
                <label className="text-sm font-medium">Leverage</label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                >
                  {[1, 2, 5, 10, 20, 50, 100].map(x => (
                    <option key={x} value={x}>{x}:1</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trade Information */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position Value:</span>
                <span>${positionValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Required Margin:</span>
                <span>${marginRequired.toFixed(2)}</span>
              </div>
            </div>

            {/* Order Book */}
            <OrderBook
              marketService={marketService}
              symbol={market.symbol}
              marketType={market.marketType}
            />

            {/* Trade Button */}
            <Button
              onClick={handleTrade}
              className="w-full"
              variant={tradeType === 'buy' ? 'default' : 'destructive'}
            >
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {market.symbol}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}