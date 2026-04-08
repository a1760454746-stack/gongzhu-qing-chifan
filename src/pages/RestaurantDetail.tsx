import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options state
  const [activeItem, setActiveItem] = useState<any>(null);
  const [tempOption, setTempOption] = useState('正常冰');
  const [sugarOption, setSugarOption] = useState('正常糖');

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then(res => res.json())
      .then(data => setRestaurant(data));
  }, [id]);

  if (!restaurant) return <div className="p-8 text-center text-gray-500">加载中...</div>;

  const updateCart = (cartKey: string, delta: number) => {
    setCart(prev => {
      const current = prev[cartKey] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev };
      if (next === 0) delete newCart[cartKey];
      else newCart[cartKey] = next;
      return newCart;
    });
  };

  const getItemQuantity = (itemId: string) => {
    return Object.entries(cart)
      .filter(([key]) => key.startsWith(itemId))
      .reduce((sum: number, [_, qty]) => sum + (qty as number), 0);
  };

  const handleAddClick = (item: any) => {
    if (restaurant.type === 'milktea' || restaurant.type === 'coffee') {
      setActiveItem(item);
      setTempOption('正常冰');
      setSugarOption('正常糖');
    } else {
      updateCart(item.id, 1);
    }
  };

  const handleMinusClick = (item: any) => {
    const cartKey = Object.keys(cart).find(key => key.startsWith(item.id));
    if (cartKey) {
      updateCart(cartKey, -1);
    }
  };

  const confirmOptions = () => {
    if (!activeItem) return;
    const optionsStr = `${tempOption}, ${sugarOption}`;
    const cartKey = `${activeItem.id}|${optionsStr}`;
    updateCart(cartKey, 1);
    setActiveItem(null);
  };

  const totalItems = Object.values(cart).reduce((a: number, b: number) => a + b, 0) as number;

  const submitOrder = async () => {
    if (totalItems === 0) return;
    setIsSubmitting(true);
    
    const items = Object.entries(cart).map(([cartKey, quantity]) => {
      const [itemId, optionsStr] = cartKey.split('|');
      const menuItem = restaurant.menu.find((m: any) => m.id === itemId);
      return {
        id: itemId,
        name: menuItem.name + (optionsStr ? ` (${optionsStr})` : ''),
        quantity,
        price: menuItem.price
      };
    });

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          items,
          totalAmount: 0 // Free for GF
        })
      });
      navigate('/gf/success');
    } catch (e) {
      alert('下单失败，请重试');
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-white h-full relative"
    >
      {/* Header Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <div className="absolute bottom-4 left-4 text-white">
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold"
          >
            {restaurant.name}
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm opacity-90 mt-1"
          >
            {restaurant.description}
          </motion.p>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-yellow-400 rounded-full"></span>
          招牌必点
        </h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {restaurant.menu.map((item: any) => (
            <motion.div variants={itemVariants} key={item.id} className="flex gap-3">
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover shadow-sm" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-gray-800 text-[15px]">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-red-500 font-bold text-lg">
                    <span className="text-sm">¥</span>0
                  </span>
                  <div className="flex items-center gap-3">
                    <AnimatePresence>
                      {getItemQuantity(item.id) > 0 && (
                        <>
                          <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={() => handleMinusClick(item)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-medium w-4 text-center"
                          >
                            {getItemQuantity(item.id)}
                          </motion.span>
                        </>
                      )}
                    </AnimatePresence>
                    {(restaurant.type === 'milktea' || restaurant.type === 'coffee') ? (
                      <button
                        onClick={() => handleAddClick(item)}
                        className="px-3 py-1 bg-yellow-400 rounded-full text-xs font-bold text-gray-800"
                      >
                        选规格
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddClick(item)}
                        className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-gray-800"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Options Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl p-6 pb-8"
            >
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex gap-4 mb-6">
                <img src={activeItem.image} alt={activeItem.name} className="w-20 h-20 rounded-lg object-cover" />
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{activeItem.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{activeItem.desc}</p>
                  <p className="text-red-500 font-bold mt-2">¥0</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-700 mb-2">温度</h4>
                  <div className="flex flex-wrap gap-2">
                    {['正常冰', '少冰', '去冰', '常温', '温', '热'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setTempOption(opt)}
                        className={`px-4 py-1.5 rounded-full text-sm border ${
                          tempOption === opt 
                            ? 'bg-yellow-100 border-yellow-400 text-yellow-700 font-bold' 
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 mb-2">甜度</h4>
                  <div className="flex flex-wrap gap-2">
                    {['正常糖', '七分甜', '半糖', '三分甜', '不另外加糖'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setSugarOption(opt)}
                        className={`px-4 py-1.5 rounded-full text-sm border ${
                          sugarOption === opt 
                            ? 'bg-yellow-100 border-yellow-400 text-yellow-700 font-bold' 
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={confirmOptions}
                className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl mt-8"
              >
                加入购物车
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="absolute bottom-4 left-4 right-4 bg-gray-800 rounded-full p-2 pl-4 flex items-center justify-between shadow-2xl z-10"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center -mt-6 shadow-lg border-4 border-white">
                  <ShoppingCart className="w-6 h-6 text-gray-800" />
                </div>
                <span className="absolute -top-6 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              </div>
              <div className="text-white">
                <div className="font-bold text-lg">¥0</div>
                <div className="text-[10px] text-gray-400">男朋友买单，随便点</div>
              </div>
            </div>
            <button 
              onClick={submitOrder}
              disabled={isSubmitting}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold text-sm disabled:opacity-50"
            >
              {isSubmitting ? '提交中...' : '去结算'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
