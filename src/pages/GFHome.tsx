import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Star, MapPin, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GFHome() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex-1 flex flex-col bg-gray-50 relative h-full overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Header */}
        <div className="bg-yellow-400 pt-12 pb-6 px-4 rounded-b-[2rem] shadow-sm relative overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-300 rounded-full opacity-50 blur-3xl"
          />
          <div className="flex items-center gap-2 text-gray-800 mb-4 relative z-10">
            <MapPin className="w-5 h-5" />
            <span className="font-bold text-lg">咪咪的专属小窝</span>
          </div>
{/*           
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-full px-4 py-3 flex items-center gap-2 shadow-sm relative z-10"
          >
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="想吃点什么呀？" 
              className="flex-1 outline-none text-gray-700 bg-transparent"
              readOnly
              onClick={() => alert('直接在下面选就好啦！')}
            />
          </motion.div> */}
        </div>

        {/* Categories */}
        {/* <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-4 gap-4 p-4 mt-2"
        >
          {['简阳羊肉', '奶茶果汁', '烧烤烤鱼', '川菜面馆'].map((cat, i) => (
            <motion.div 
              variants={itemVariants}
              key={i} 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center text-2xl">
                {['🍲', '🧋', '🍢', '🍜'][i]}
              </div>
              <span className="text-xs font-medium text-gray-700">{cat}</span>
            </motion.div>
          ))}
        </motion.div> */}

        {/* Custom Order Banner */}
        <div className="px-4 mt-2">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/gf/custom')}
            className="relative bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl p-4 text-white shadow-lg flex items-center justify-between overflow-hidden cursor-pointer"
          >
            {/* Shimmer effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
            <div className="relative z-10">
              <h3 className="font-bold text-lg flex items-center gap-2">
                ✨ 没找到想吃的？
              </h3>
              <p className="text-pink-100 text-xs mt-1">直接粘贴美团链接，或者打字告诉我！</p>
            </div>
            <div className="relative z-10 bg-white text-pink-500 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
              去许愿 →
            </div>
          </motion.div>
        </div>

        {/* Restaurant List */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-yellow-400 rounded-full"></span>
            精选推荐
          </h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {restaurants.map((r, i) => (
              <motion.div
                variants={itemVariants}
                key={r.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/gf/restaurant/${r.id}`)}
                className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm cursor-pointer"
              >
                <img src={r.image} alt={r.name} className="w-24 h-24 object-cover rounded-xl" />
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 text-[15px] leading-tight">{r.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1.5">
                      <span className="flex items-center gap-0.5 text-orange-500 font-bold">
                        <Star className="w-3 h-3 fill-orange-500" /> {r.rating}
                      </span>
                      <span>月售 999+</span>
                      <span>{r.deliveryTime}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{r.description}</p>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <span className="text-[10px] text-pink-500 border border-pink-200 bg-pink-50 px-1.5 py-0.5 rounded-md font-medium">男朋友买单</span>
                    <span className="text-[10px] text-orange-500 border border-orange-200 bg-orange-50 px-1.5 py-0.5 rounded-md font-medium">免配送费</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-around py-3 pb-safe z-20">
        <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center text-yellow-500 cursor-pointer">
          <div className="p-1"><Star className="w-6 h-6 fill-current" /></div>
          <span className="text-[10px] font-bold">首页</span>
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => navigate('/gf/orders')}>
          <div className="p-1"><FileText className="w-6 h-6" /></div>
          <span className="text-[10px] font-medium">订单</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
