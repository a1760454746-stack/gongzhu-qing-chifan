import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ListOrdered, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BFDashboard() {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setPendingCount(data.filter((o: any) => o.status === 'pending').length);
      });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-gray-50 h-full"
    >
      {/* Header */}
      <div className="bg-blue-600 pt-12 pb-8 px-6 rounded-b-3xl shadow-md text-white">
        <h1 className="text-2xl font-bold mb-2">专属骑手控制台</h1>
        <p className="text-blue-100 opacity-90">随时待命，为宝贝服务！</p>
      </div>

      {/* Stats */}
      <div className="p-6 -mt-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/bf-admin-secret/orders')}
          className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-between cursor-pointer"
        >
          <div>
            <h2 className="text-gray-500 text-sm font-medium mb-1">待处理订单</h2>
            <div className="text-4xl font-bold text-gray-800">
              {pendingCount} <span className="text-lg text-gray-400 font-normal">单</span>
            </div>
          </div>
          <div className="relative">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Bell className={`w-8 h-8 text-blue-500 ${pendingCount > 0 ? 'animate-bounce' : ''}`} />
            </div>
            {pendingCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="p-6 pt-0 space-y-4">
        <h3 className="font-bold text-gray-800 mb-4">快捷操作</h3>
        
        <button 
          onClick={() => navigate('/bf-admin-secret/orders')}
          className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 text-left"
        >
          <div className="bg-purple-50 p-3 rounded-lg">
            <ListOrdered className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <div className="font-bold text-gray-800">全部订单管理</div>
            <div className="text-xs text-gray-500 mt-1">更新订单状态，同步给宝贝</div>
          </div>
        </button>

        <div className="w-full bg-pink-50 p-4 rounded-xl shadow-sm flex items-center gap-4 text-left border border-pink-100">
          <div className="bg-pink-100 p-3 rounded-lg">
            <Heart className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <div className="font-bold text-gray-800">操作指南</div>
            <div className="text-xs text-gray-500 mt-1">
              1. 收到订单后，去真实美团App下单<br/>
              2. 在这里点击"我已下单"<br/>
              3. 根据美团骑手状态，更新这里的状态
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
