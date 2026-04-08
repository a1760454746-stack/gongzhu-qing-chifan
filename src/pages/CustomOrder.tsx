import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Link as LinkIcon, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomOrder() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOrder = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: 'custom',
          restaurantName: '✨ 宝贝的专属心愿单',
          items: [{
            id: 'custom-item',
            name: content,
            quantity: 1,
            price: 0
          }],
          totalAmount: 0,
          isCustom: true
        })
      });
      navigate('/gf/success');
    } catch (e) {
      alert('发送失败，请重试');
      setIsSubmitting(false);
    }
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
        <h1 className="text-lg font-bold text-gray-800 ml-2">随便点 / 贴链接</h1>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-4 text-pink-500">
            <LinkIcon className="w-6 h-6" />
            <h2 className="font-bold text-lg text-gray-800">想吃什么直接告诉我！</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            因为美团没有开放全部商家，你可以直接在真实的【美团/饿了么】App里挑好，然后把分享链接粘贴在这里，或者直接打字告诉我你想吃啥~
          </p>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="例如：&#10;1. 粘贴美团的分享链接&#10;2. 或者写：想吃楼下那家麻辣烫，加个煎蛋！"
            className="w-full h-40 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
          ></textarea>
        </motion.div>

        <div className="mt-auto pb-8">
          <button
            onClick={submitOrder}
            disabled={isSubmitting || !content.trim()}
            className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold text-lg shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            {isSubmitting ? '发送中...' : '发送给男朋友买单'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
