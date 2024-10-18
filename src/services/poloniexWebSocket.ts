import { useMarketStore } from '@/stores/market'

interface PoloniexTrade {
    id: string;
    price: string;
    quantity: string;
    ts: number;
    takerSide: string;
}

class PoloniexWebSocket {
    private ws: WebSocket | null = null;
    private reconnectInterval: number = 5000;
    private url: string = 'wss://ws.poloniex.com/ws/public';

    constructor() {
        this.connect();
    }

    private connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('Connected to Poloniex WebSocket');
            this.subscribe();
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.channel === 'trades' && data.data && data.data.length > 0) {
                this.handleTradeData(data.data);
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected from Poloniex WebSocket. Reconnecting...');
            setTimeout(() => this.connect(), this.reconnectInterval);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.ws?.close();
        };
    }

    private subscribe() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const subscribeMessage = {
                event: 'subscribe',
                channel: ['trades'],
                symbols: ['BTC_USDT']
            };
            this.ws.send(JSON.stringify(subscribeMessage));
        }
    }

    private handleTradeData(trades: PoloniexTrade[]) {
        const marketStore = useMarketStore();
        trades.forEach(trade => {
            marketStore.addTrade({
                id: trade.id,
                price: trade.price,
                quantity: trade.quantity,
                time: trade.ts,
                takerSide: trade.takerSide
            });
        });
    }

    public close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export const poloniexWebSocket = new PoloniexWebSocket();