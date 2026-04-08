/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import GFHome from './pages/GFHome';
import RestaurantDetail from './pages/RestaurantDetail';
import OrderSuccess from './pages/OrderSuccess';
import OrderList from './pages/OrderList';
import BFDashboard from './pages/BFDashboard';
import CustomOrder from './pages/CustomOrder';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore - React Router v6 Routes accepts key but types might not reflect it */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/gf" replace />} />
        
        {/* Girlfriend Routes (Public) */}
        <Route path="/gf" element={<GFHome />} />
        <Route path="/gf/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/gf/custom" element={<CustomOrder />} />
        <Route path="/gf/success" element={<OrderSuccess />} />
        <Route path="/gf/orders" element={<OrderList role="gf" />} />
        
        {/* Boyfriend Routes (Hidden URL) */}
        <Route path="/bf-admin-secret" element={<BFDashboard />} />
        <Route path="/bf-admin-secret/orders" element={<OrderList role="bf" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-pink-50 flex justify-center items-center p-0 sm:p-4">
      {/* Mobile container simulator */}
      <div className="w-full max-w-md bg-gray-50 h-screen sm:h-[90vh] sm:rounded-[2.5rem] sm:shadow-2xl relative flex flex-col overflow-hidden border-gray-200 sm:border-8">
        <HashRouter>
          <AnimatedRoutes />
        </HashRouter>
      </div>
    </div>
  );
}
