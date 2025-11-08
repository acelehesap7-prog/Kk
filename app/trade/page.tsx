'use client'

import { useEffect, useRef } from 'react'
import { Card, TabGroup, Tab, TabList, TabPanel, TabPanels } from '@tremor/react'
import { Button } from '@/components/ui/button'

let tvScriptLoadingPromise: Promise<void>

export default function TradePage() {
  const onLoadScriptRef = useRef<(() => void) | null>()

  useEffect(() => {
    onLoadScriptRef.current = createWidget

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script')
        script.id = 'tradingview-widget-loading-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.type = 'text/javascript'
        script.onload = resolve as () => void

        document.head.appendChild(script)
      })
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    )

    return () => {
      onLoadScriptRef.current = null
    }
  }, [])

  function createWidget() {
    if (document.getElementById('tradingview_chart') && 'TradingView' in window) {
      new (window as any).TradingView.widget({
        autosize: true,
        symbol: 'BINANCE:BTCUSDT',
        interval: '1',
        timezone: 'Europe/Istanbul',
        theme: 'dark',
        style: '1',
        locale: 'tr',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_chart',
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Chart Section */}
      <div className="flex-grow">
        <div id="tradingview_chart" style={{ height: 'calc(100vh - 64px)' }} />
      </div>

      {/* Trading Panel */}
      <div className="w-full lg:w-96 border-l border-accent">
        <Card className="h-full rounded-none">
          <TabGroup>
            <TabList>
              <Tab>Al</Tab>
              <Tab>Sat</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="space-y-4 p-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Miktar (BTC)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 rounded-md bg-accent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fiyat (USDT)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 rounded-md bg-accent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Toplam (USDT)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 rounded-md bg-accent"
                      placeholder="0.00"
                    />
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    Al
                  </Button>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="space-y-4 p-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Miktar (BTC)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 rounded-md bg-accent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fiyat (USDT)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 rounded-md bg-accent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Toplam (USDT)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 rounded-md bg-accent"
                      placeholder="0.00"
                    />
                  </div>
                  <Button className="w-full bg-red-500 hover:bg-red-600">
                    Sat
                  </Button>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </div>
    </div>
  )
}