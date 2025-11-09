import React from 'react'
import { IMarketService, OrderBook as IOrderBook } from '@/types/market.types'

interface OrderBookProps {
  marketService: IMarketService
  symbol: string
  marketType: string
}

export function OrderBook({ marketService, symbol, marketType }: OrderBookProps) {
  const [orderbook, setOrderbook] = React.useState<IOrderBook | null>(null)

  React.useEffect(() => {
    let mounted = true

    const loadOrderBook = async () => {
      try {
        const data = await marketService.getOrderBook(symbol, marketType)
        if (mounted) {
          setOrderbook(data)
        }
      } catch (error) {
        console.error('Error loading order book:', error)
      }
    }

    loadOrderBook()
    const interval = setInterval(loadOrderBook, 1000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [marketService, symbol, marketType])

  if (!orderbook) {
    return (
      <div className="flex items-center justify-center h-48">
        Loading order book...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Bids */}
      <div>
        <h4 className="text-sm font-medium mb-2">Bids</h4>
        <div className="space-y-1">
          {orderbook.bids.map(([price, amount], index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-green-600">{price.toFixed(2)}</span>
              <span>{amount.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Asks */}
      <div>
        <h4 className="text-sm font-medium mb-2">Asks</h4>
        <div className="space-y-1">
          {orderbook.asks.map(([price, amount], index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-red-600">{price.toFixed(2)}</span>
              <span>{amount.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}