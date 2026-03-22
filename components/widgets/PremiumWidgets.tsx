"use client";

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Clock,
  Users,
  Truck,
  AlertCircle
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ title, value, change, icon: Icon, trend = 'neutral' }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="widget-glass p-6 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-semibold ${getChangeColor()}`}>
            {change}
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
      </div>
    </div>
  );
}

interface RecentOrderProps {
  id: string;
  customer: string;
  amount: string;
  status: 'pending' | 'processing' | 'completed';
  date: string;
  items: number;
}

export function RecentOrdersWidget({ orders }: { orders: RecentOrderProps[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'processing':
        return <Package className="h-3 w-3" />;
      case 'completed':
        return <Truck className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="widget-glass p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
          View All →
        </button>
      </div>
      
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(order.status)} border`}>
                {getStatusIcon(order.status)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{order.amount}</p>
              <p className="text-xs text-gray-500">{order.items} items</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StockItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export function StockSummaryWidget({ stocks }: { stocks: StockItem[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const lowStockItems = stocks.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = stocks.filter(item => item.status === 'out-of-stock').length;

  return (
    <div className="widget-glass p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Stock Summary</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <span className="text-xs font-medium text-gray-600">{lowStockItems} Low</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="text-xs font-medium text-gray-600">{outOfStockItems} Out</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {stocks.slice(0, 5).map((stock, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${getStatusColor(stock.status)}`}>
                <Package className="h-3 w-3" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{stock.name}</p>
                <p className="text-xs text-gray-500">{stock.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                {stock.quantity} {stock.unit}
              </p>
              <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${getStatusColor(stock.status)}`}>
                {stock.status.replace('-', ' ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PendingDelivery {
  id: string;
  customer: string;
  location: string;
  estimatedTime: string;
  items: number;
  priority: 'high' | 'medium' | 'low';
}

export function PendingDeliveriesWidget({ deliveries }: { deliveries: PendingDelivery[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="widget-glass p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Pending Deliveries</h3>
        <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
          {deliveries.length} Active
        </div>
      </div>
      
      <div className="space-y-3">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Truck className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{delivery.customer}</p>
                <p className="text-xs text-gray-500">{delivery.location}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500">{delivery.estimatedTime}</p>
              <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${getPriorityColor(delivery.priority)}`}>
                {delivery.priority}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
