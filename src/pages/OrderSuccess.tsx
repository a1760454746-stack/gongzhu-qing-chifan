import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex-1 flex flex-col items-center justify-center p-6 bg-white"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="relative"
      >
        <CheckCircle2 className="w-24 h-24 text-green-500" />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2"
        >
          <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
        </motion.div>
      </motion.div>

      <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-2">下单成功啦！</h1>
      <p className="text-gray-500 text-center mb-8">
        已经通知你的专属骑手（男朋友）<br/>
        他正在火速前往真实美团为你下单~
      </p>

      <div className="w-full space-y-4">
        <button 
          onClick={() => navigate('/gf/orders')}
          className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold text-lg shadow-sm"
        >
          查看订单状态
        </button>
        <button 
          onClick={() => navigate('/gf')}
          className="w-full bg-gray-100 text-gray-600 py-4 rounded-xl font-bold text-lg"
        >
          返回首页
        </button>
      </div>
    </motion.div>
  );
}
