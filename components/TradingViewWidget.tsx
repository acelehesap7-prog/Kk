import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    TradingView: any
  }
}

interface TradingViewWidgetProps {
  symbol: string
  theme?: 'light' | 'dark'
}

export default function TradingViewWidget({ symbol, theme = 'light' }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'tr',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [symbol, theme])

  return <div id="tradingview_widget" ref={containerRef} style={{ height: '400px' }} />
}