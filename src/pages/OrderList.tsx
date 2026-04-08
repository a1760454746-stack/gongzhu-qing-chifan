import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, CheckCircle2, Bike, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_MAP: Record<string, { text: string, color: string, icon: any }> = {
  pending: { text: '等待男朋友接单', color: 'text-orange-500', icon: Clock },
  accepted: { text: '男朋友已去美团下单', color: 'text-blue-500', icon: CheckCircle2 },
  delivering: { text: '骑手配送中', color: 'text-yellow-600', icon: Bike },
  completed: { text: '宝贝请享用', color: 'text-pink-500', icon: Heart },
};

export default function OrderList({ role }: { role: 'gf' | 'bf' }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  useEffect(() => {
    fetchOrders();
    // Poll for updates every 3 seconds
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-gray-50 h-full"
    >
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 ml-2">
          {role === 'gf' ? '我的订单' : '订单管理'}
        </h1>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">暂无订单</div>
        ) : (
          orders.map(order => {
            const StatusIcon = STATUS_MAP[order.status]?.icon || Clock;
            return (
              <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                  <div className="font-bold text-gray-800">{order.restaurantName}</div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${STATUS_MAP[order.status]?.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {STATUS_MAP[order.status]?.text}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-400 mb-4">
                  下单时间: {new Date(order.createdAt).toLocaleString()}
                </div>

                {role === 'bf' && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                    {order.status === 'pending' && (
                      <button onClick={() => updateStatus(order.id, 'accepted')} className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-bold">
                        我已去美团下单
                      </button>
                    )}
                    {order.status === 'accepted' && (
                      <button onClick={() => updateStatus(order.id, 'delivering')} className="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-sm font-bold">
                        骑手已取餐
                      </button>
                    )}
                    {order.status === 'delivering' && (
                      <button onClick={() => updateStatus(order.id, 'completed')} className="flex-1 bg-pink-500 text-white py-2 rounded-lg text-sm font-bold">
                        已送达宝贝手中
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
