import React, { useState, useEffect, useCallback } from 'react'; // <-- Thêm useCallback
import {
  MessagesSquare,
  LineChart,
  ShoppingCart,
  Users,
  Percent,
  PieChart,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Calendar,
  Search,
  RefreshCw,
  BarChart,
  CheckCircle, 
  Eye,
  BarChart2, 
  Trash2,     
  X as XIcon, 
  AlertTriangle,
  Maximize,
  ArrowDownCircle,
  Bot,
  User,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

// ===============================================
// === CÁC HÀM HỖ TRỢ (HELPERS) MỚI ===
// ===============================================

// Hàm 1: Định dạng ngày giờ cho bảng (ví dụ: 2025/11/11 03:09)
function formatDateTime(isoString) {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}/${m}/${d} ${h}:${min}`;
  } catch (e) {
    return isoString;
  }
}

// Hàm 2: Định dạng thời gian cho tin nhắn chat (ví dụ: 03:09 AM)
function formatTimestamp(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return '';
  }
}

// Hàm 3: Lấy 3 chữ cái đầu của ngày (ví dụ: 'Tuesday' -> 'Tue')
function getDayAbbreviation(dayName) {
  if (!dayName) return '';
  return dayName.substring(0, 3);
}


// ===============================================
// === PHẦN 1: COMPONENT THẺ THỐNG KÊ ===
// ===============================================
// (Component StatCard không đổi, chỉ nhận props)
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = colorConfig[color] || colorConfig.blue; 

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex items-start space-x-4">
      <div className={`p-3 rounded-full ${colors.bg}`}>
        <Icon className={colors.text} size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

// (Ánh xạ màu cũng không đổi)
const colorConfig = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
};

// ===============================================
// === PHẦN 2: COMPONENT BIỂU ĐỒ (ĐÃ CẬP NHẬT) ===
// ===============================================

// Dữ liệu cho chú giải (legend) - (Cái này vẫn giữ lại)
const legendData = [
  { day: 'Mon', color: 'bg-blue-500' },
  { day: 'Tue', color: 'bg-green-500' },
  { day: 'Wed', color: 'bg-purple-500' },
  { day: 'Thu', color: 'bg-yellow-500' },
  { day: 'Fri', color: 'bg-pink-500' },
  { day: 'Sat', color: 'bg-blue-800' },
  { day: 'Sun', color: 'bg-red-500' },
];

// Component Biểu đồ Cuộc trò chuyện (ĐÃ CẬP NHẬT)
// Nhận 'dailyStats' và 'totalConversations' từ props
const ConversationsChart = ({ dailyStats, totalConversations }) => {
  
  // Tính toán tổng trung bình
  const dailyAverage = (dailyStats && dailyStats.length > 0)
    ? (totalConversations / dailyStats.length).toFixed(0) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Conversations (Last 7 Days)
      </h2>

      {/* Phần "biểu đồ" hiển thị dữ liệu (ĐÃ CẬP NHẬT) */}
      <div className="flex justify-around items-center text-center mb-6 px-4">
        {/* Loop qua 'dailyStats' từ API */}
        {dailyStats && dailyStats.map((item) => {
          // === CẬP NHẬT: THÊM MÀU ===
          const dayAbbr = getDayAbbreviation(item.dayOfWeek);
          const legendItem = legendData.find(l => l.day === dayAbbr);
          // Chuyển 'bg-blue-500' thành 'text-blue-500'
          const colorClass = legendItem 
            ? legendItem.color.replace('bg-', 'text-') 
            : 'text-gray-700';
          // =========================

          return (
            <div key={item.date} className="flex flex-col items-center space-y-1">
              <span className={`text-sm font-medium ${colorClass}`}>{dayAbbr}</span>
              <span className="text-lg font-bold text-gray-800">{item.count}</span>
            </div>
          );
        })}
      </div>

      {/* Đường kẻ ngang */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Phần chú giải (Legend) */}
      <div className="flex justify-center items-center space-x-4 flex-wrap px-4">
        {legendData.map((item) => (
          <div key={item.day} className="flex items-center space-x-1.5 my-1">
            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
            <span className="text-xs font-medium text-gray-600">{item.day}</span>
          </div>
        ))}
      </div>

      {/* Đường kẻ ngang */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Phần tổng kết (Summary) (ĐÃ CẬP NHẬT) */}
      <div className="flex justify-around items-center text-center">
        <div className="px-4">
          <p className="text-3xl font-bold text-gray-900">{totalConversations}</p>
          <p className="text-sm font-medium text-gray-500">Total Conversations</p>
        </div>
        <div className="px-4">
          <p className="text-3xl font-bold text-gray-900">{dailyAverage}</p>
          <p className="text-sm font-medium text-gray-500">Daily Average</p>
        </div>
      </div>
    </div>
  );
};

// ===============================================
// === PHẦN 3: COMPONENT LỌC VÀ TABS ===
// ===============================================
// (Component này không thay đổi vì nó chỉ chứa UI, không chứa data)
const ConversationsFilterTabs = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      
      {/* Hàng 1: Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {/* Tab 1: Conversations (Active) */}
        <button className="flex items-center space-x-2 px-4 py-3 border-b-2 border-yellow-500 text-yellow-600 font-semibold">
          <MessagesSquare size={18} />
          <span>Conversations</span>
        </button>
        {/* Tab 2: Orders */}
        <button className="flex items-center space-x-2 px-4 py-3 text-gray-500 hover:text-gray-700">
          <ShoppingCart size={18} />
          <span>Orders</span>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">12</span>
        </button>
        {/* Tab 3: Delivered */}
        <button className="flex items-center space-x-2 px-4 py-3 text-gray-500 hover:text-gray-700">
          <CheckCircle size={18} />
          <span>Delivered</span>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">25</span>
        </button>
      </div>

      {/* Hàng 2: Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        
        {/* Date Range */}
        <div className="flex items-center space-x-2">
          <label htmlFor="dateRange" className="text-sm font-medium text-gray-700">Date Range:</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="mm/dd/yyyy" 
              className="border border-gray-300 rounded-md p-2 pl-8 text-sm w-36"
            />
            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative">
            <input 
              type="text" 
              placeholder="mm/dd/yyyy" 
              className="border border-gray-300 rounded-md p-2 pl-8 text-sm w-36"
            />
            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Lead Quality */}
        <div className="flex items-center space-x-2">
          <label htmlFor="leadQuality" className="text-sm font-medium text-gray-700">Lead Quality:</label>
          <select 
            id="leadQuality"
            className="border border-gray-300 rounded-md p-2 text-sm bg-white"
          >
            <option>All</option>
            <option>Good</option>
            <option>OK</option>
            <option>Spam</option>
          </select>
        </div>
      </div>

      {/* Hàng 3: Search & Actions */}
      <div className="flex flex-wrap items-center gap-4">
        
        {/* Search Input */}
        <div className="relative flex-grow min-w-[200px]">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="border border-gray-300 rounded-md p-2 pl-10 text-sm w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Action Buttons */}
        <button className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md text-sm">
          <Search size={16} />
          <span>Search</span>
        </button>
        <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-md text-sm">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
        <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-md text-sm">
          <BarChart size={16} />
          <span>Advanced Analysis</span>
        </button>
      </div>

    </div>
  );
};

// ===============================================
// === PHẦN 4: COMPONENT BẢNG HỘI THOẠI (ĐÃ CẬP NHẬT) ===
// ===============================================

// Component nhỏ cho thẻ "Status" (ĐÃ CẬP NHẬT)
// Nhận 'status' từ API (1=undefine, 2=potential, 3=spam)
const StatusTag = ({ status }) => {
  let colors = '';
  let text = '';
  switch (status) {
    case 2: // Potential
      colors = 'bg-green-100 text-green-700';
      text = 'Potential';
      break;
    case 3: // Spam
      colors = 'bg-red-100 text-red-700';
      text = 'Spam';
      break;
    case 1: // Undefine
    default:
      colors = 'bg-gray-100 text-gray-700';
      text = 'Undefined'; // (1 = undefine)
  }
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors}`}>
      {text}
    </span>
  );
};

// Component nhỏ cho thẻ "Analyze" (ĐÃ CẬP NHẬT)
// Nhận 'analyzed' từ API (1=pending, 2=analyzed)
const AnalyzeTag = ({ analyzed }) => {
  let colors = '';
  let text = '';
  switch (analyzed) {
    case 2: // Analyzed
      colors = 'bg-green-100 text-green-700';
      text = 'Analyzed';
      break;
    case 1: // Pending
    default:
      colors = 'bg-yellow-100 text-yellow-700';
      text = 'Pending';
      break;
  }
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors}`}>
      {text}
    </span>
  );
};


// Component Bảng chính (ĐÃ CẬP NHẬT)
// Nhận 'conversations' từ props
const ConversationsTable = ({ conversations, onViewClick, onAnalyzeClick, onDeleteClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md mt-6 overflow-x-auto">
      {/* Header của Bảng */}
      <div className="flex justify-between items-center p-6">
        <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Show:</span>
          <select className="border border-gray-300 rounded-md p-1 bg-white">
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>per page</span>
        </div>
      </div>

      {/* Bảng dữ liệu (ĐÃ CẬP NHẬT) */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            {/* CẬP NHẬT: Đổi tên cột */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analyze</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Loop qua 'conversations' từ API */}
          {conversations && conversations.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{row.id}</td>
              {/* CẬP NHẬT: Logic "Guest" */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {row.userId ? `${row.userId}` : 'Guest'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">N/A</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* Dùng StatusTag (logic 1,2,3) */}
                <StatusTag status={row.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* Dùng AnalyzeTag (logic 1,2) */}
                <AnalyzeTag analyzed={row.analyzed} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {/* Dùng hàm formatDateTime */}
                {formatDateTime(row.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => onViewClick(row)} 
                    className="flex items-center text-orange-500 hover:text-orange-700"
                  >
                    <Eye size={16} className="mr-1" /> View
                  </button>
                  {/* CẬP NHẬT: Bỏ "..." */}
                  <button 
                    onClick={() => onAnalyzeClick(row)} 
                    className="flex items-center text-green-500 hover:text-green-700"
                  >
                    <BarChart2 size={16} className="mr-1" /> Analyze
                  </button>
                  {/* CẬP NHẬT: Bỏ "..." */}
                  <button 
                    onClick={() => onDeleteClick(row)} 
                    className="flex items-center text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ===============================================
// === PHẦN 5: COMPONENT MODAL CHI TIẾT (ĐÃ CẬP NHẬT) ===
// ===============================================
const ConversationDetailModal = ({ conversation, onClose }) => {
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  if (!conversation) return null;

  // Lấy tin nhắn từ API (mặc định là mảng rỗng nếu không có)
  const messages = conversation.messages || [];

  return (
    // Lớp nền mờ
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      
      {/* Nội dung Modal */}
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Conversation Details</h2>
            <p className="text-sm text-gray-500">View analysis information and messages</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Thân Modal (cho phép cuộn) */}
        <div className="p-6 overflow-y-auto">
          {/* Conversation ID */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Conversation ID</h3>
            <p className="text-sm text-gray-800 font-mono bg-gray-100 p-2 rounded">
              {conversation.id}
            </p>
          </div>

          {/* Customer Info Analysis (ĐÃ CẬP NHẬT) */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer Information Analysis</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertTriangle className="text-yellow-500" size={20} />
              <p className="text-sm text-yellow-700">
                {/* Cập nhật logic: (1=pending, 2=analyzed) */}
                {conversation.analyzed === 2
                  ? 'Conversation has been analyzed.' 
                  : 'Not analyzed yet. Click "Analyze" to analyze the conversation.'
                }
              </p>
            </div>
          </div>

          {/* Message History (ĐÃ CẬP NHẬT) */}
          <div>
            {/* Header Lịch sử tin nhắn */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">Message History</h3>
                {/* Hiển thị tổng số tin nhắn từ API */}
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{messages.length} messages</span>
                {/* (Các tag khác có thể cần logic phức tạp hơn) */}
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700">
                  <Maximize size={14} />
                  <span>Full View</span>
                </button>
                <button className="flex items-center space-x-1 text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300">
                  <ArrowDownCircle size={14} />
                  <span>Scroll</span>
                </button>
              </div>
            </div>

            {/* Khung Chat (ĐÃ CẬP NHẬT) */}
            <div 
              className={`bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4 overflow-y-auto ${
                isChatExpanded ? 'max-h-[60vh]' : 'max-h-64'
              } transition-all duration-300 ease-in-out`}
            >
              {/* === HIỂN THỊ TIN NHẮN TỪ API === */}
              {messages.length === 0 && (
                <p className="text-sm text-gray-500 text-center">No messages in this conversation.</p>
              )}
              
              {messages.map((message, index) => (
                message.sender === 'bot' ? (
                  // Tin nhắn AI
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-gray-200 p-2 rounded-full">
                      <Bot size={20} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-semibold text-sm text-gray-800">AI Assistant</span>
                        <span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
                      </div>
                      <div className="bg-gray-200 p-3 rounded-lg mt-1">
                        {/* Dùng 'pre-wrap' để giữ nguyên định dạng xuống dòng */}
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Tin nhắn Customer
                  <div key={index} className="flex items-start space-x-3 justify-end">
                    <div className="flex-1 max-w-md">
                      <div className="flex items-baseline space-x-2 justify-end">
                        <span className="font-semibold text-sm text-orange-600">Customer</span>
                        <span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-lg mt-1">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-full">
                      <User size={20} className="text-orange-600" />
                    </div>
                  </div>
                )
              ))}
              {/* === HẾT TIN NHẮN TỪ API === */}
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex gap-2">
            <button
              onClick={() => setIsChatExpanded(true)}
              className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-md ${
                isChatExpanded
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={isChatExpanded}
            >
              <ChevronUp size={14} />
              <span>Expand</span>
            </button>
            <button
              onClick={() => setIsChatExpanded(false)}
              className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-md ${
                !isChatExpanded
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
              disabled={!isChatExpanded}
            >
              <ChevronDown size={14} />
              <span>Collapse</span>
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold px-4 py-2 rounded-md text-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};


// ===============================================
// === PHẦN 6: COMPONENT MODAL XÁC NHẬN ===
// ===============================================
// (Component này không thay đổi)
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type }) => {
  if (!isOpen) return null;

  const isDelete = type === 'delete';
  const confirmColor = isDelete
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-green-600 hover:bg-green-700';
  
  const icon = isDelete
    ? <AlertTriangle size={24} className="text-red-500" />
    : <BarChart2 size={24} className="text-green-500" />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full">
              {icon}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
          <button 
            onClick={onClose}
            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold px-4 py-2 rounded-md text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`text-white font-semibold px-4 py-2 rounded-md text-sm ${confirmColor}`}
          >
            {isDelete ? 'Delete' : 'Analyze'}
          </button>
        </div>
      </div>
    </div>
  );
};


// ===============================================
// === PHẦN 7: COMPONENT APP CHÍNH (ĐÃ CẬP NHẬT) ===
// ===============================================
export default function App() {
  
  // === STATE MỚI ĐỂ QUẢN LÝ DATA TỪ API ===
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewData, setOverviewData] = useState(null); // Sẽ chứa { stats, conversations }

  // === STATE CŨ CHO MODALS ===
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: null, 
    data: null,
    title: '',
    message: ''
  });

  // === HÀM GỌI API (ĐÃ DI CHUYỂN RA NGOÀI) ===
  // (Chúng ta di chuyển hàm này ra ngoài useEffect để có thể gọi lại)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Giả định backend chạy trên localhost:8080
      // SỬA LỖI: Thêm các tùy chọn 'mode' và 'method' rõ ràng
      const response = await fetch('http://localhost:8083/api/v1/overview', {
        method: 'GET',
        mode: 'cors', // Thêm 'mode: cors'
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }); 
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code === 0 && data.result) {
        setOverviewData(data.result); // Lưu trữ { stats, conversations }
        setError(null);
      } else {
        throw new Error('Invalid data structure from API.');
      }

    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Mảng rỗng '[]' nghĩa là hàm này không thay đổi

  // === useEffect (CHỈ GỌI fetchData) ===
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Mảng rỗng '[]' nghĩa là chỉ chạy 1 lần khi component được tải

  
  // === CÁC HÀM XỬ LÝ (Handlers) CHO MODALS ===
  const handleViewClick = (conversationData) => {
    setSelectedConversation(conversationData);
  };
  const handleCloseModal = () => {
    setSelectedConversation(null);
  };
  const handleAnalyzeClick = (conversation) => {
    setConfirmationState({
      isOpen: true,
      type: 'analyze',
      data: conversation,
      title: 'Confirm Analysis', 
      message: `Are you sure you want to analyze conversation ID: ${conversation.id}?`
    });
  };
  const handleDeleteClick = (conversation) => {
    setConfirmationState({
      isOpen: true,
      type: 'delete',
      data: conversation,
      title: 'Confirm Deletion', 
      message: `Are you sure you want to delete conversation ID: ${conversation.id}? This action cannot be undone.`
    });
  };
  const handleCloseConfirmation = useCallback(() => { // (Thêm useCallback)
    setConfirmationState({ isOpen: false, type: null, data: null, title: '', message: '' });
  }, []);

  // === HÀM XÁC NHẬN (ĐÃ CẬP NHẬT ĐỂ GỌI API) ===
  const handleConfirmAction = useCallback(async () => {
    const { type, data } = confirmationState;
    
    // Đóng modal ngay lập tức
    handleCloseConfirmation();

    if (type === 'analyze') {
      console.log("Analyzing conversation:", data.id);
      try {
        // GỌI API ANALYZE
        const response = await fetch(`http://localhost:8083/api/v1/analyze/${data.id}`, {
          method: 'POST', // Theo @PostMapping
          mode: 'cors', // Thêm 'mode: cors'
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Analyze API failed! status: ${response.status}`);
        }
        
        // Nếu thành công, gọi lại 'fetchData' để làm mới toàn bộ dashboard
        await fetchData();
        
      } catch (err) {
        console.error("Failed to analyze conversation:", err);
        // (Trong tương lai, bạn có thể hiển thị thông báo lỗi cho người dùng ở đây)
      }
      
    } else if (type === 'delete') {
      console.log("Deleting conversation:", data.id);
      
      // === CẬP NHẬT: THÊM LOGIC GỌI API DELETE ===
      try {
        const response = await fetch(`http://localhost:8083/api/v1/delete/${data.id}`, {
          method: 'DELETE', // Theo @DeleteMapping
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`Delete API failed! status: ${response.status}`);
        }

        // Nếu thành công, gọi lại 'fetchData' để làm mới
        await fetchData();

      } catch (err) {
        console.error("Failed to delete conversation:", err);
      }
      // ==========================================
    }
  }, [confirmationState, fetchData, handleCloseConfirmation]); // Thêm dependencies

  // === XỬ LÝ TRẠNG THÁI LOADING VÀ ERROR (MỚI) ===
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p className="text-xl font-medium text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p className="text-xl font-medium text-red-600">Error: {error}</p>
      </div>
    );
  }
  
  // Nếu không loading, không error, nhưng data vẫn rỗng (lỗi API)
  if (!overviewData || !overviewData.stats || !overviewData.conversations) {
     return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p className="text-xl font-medium text-red-600">Failed to load valid data from API.</p>
      </div>
    );
  }

  // === CHUẨN BỊ DATA CHO THẺ THỐNG KÊ (MỚI) ===
  // Ánh xạ data từ API (overviewData.stats) sang các thẻ
  const derivedStats = [
    { 
      id: 1, 
      title: 'Total Conversations', 
      value: overviewData.stats.totalConversations, 
      icon: MessagesSquare, 
      color: 'blue' 
    },
    { 
      id: 2, 
      title: 'Analyzed', 
      value: overviewData.stats.analyzedCount, 
      icon: LineChart, 
      color: 'green' 
    },
    { 
      id: 3, 
      title: 'Pending', 
      value: overviewData.stats.pendingCount, 
      icon: Clock, 
      color: 'yellow' // Đổi 'Pending' sang màu vàng cho hợp lý
    },
    { 
      id: 4, 
      title: 'Potential (Good)', // 'potentialCount' từ API
      value: overviewData.stats.potentialCount, 
      icon: CheckCircle2, 
      color: 'green' 
    },
    { 
      id: 5, 
      title: 'Spam', 
      value: overviewData.stats.spamCount, 
      icon: XCircle, 
      color: 'red' 
    },
  ];

  // === RENDER GIAO DIỆN CHÍNH ===
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans relative">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Manage user conversation
      </h1>

      <div className="space-y-6">
        
        {/* === PHẦN THỐNG KÊ (CÁC THẺ) (ĐÃ CẬP NHẬT) === */}
        {/* Chỉ hiển thị 1 hàng 5 thẻ dựa trên API */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {derivedStats.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* === PHẦN BIỂU ĐỒ (ĐÃ CẬP NHẬT) === */}
        <ConversationsChart 
          dailyStats={overviewData.stats.dailyStats}
          totalConversations={overviewData.stats.totalConversations}
        />

        {/* === PHẦN LỌC VÀ TABS === */}
        <ConversationsFilterTabs />

        {/* === PHẦN BẢNG HỘI THOẠI (ĐÃ CẬP NHẬT) === */}
        <ConversationsTable 
          conversations={overviewData.conversations} // Truyền data từ API
          onViewClick={handleViewClick}
          onAnalyzeClick={handleAnalyzeClick} 
          onDeleteClick={handleDeleteClick}
        />

      </div>

      {/* === PHẦN MODAL (HIỂN THỊ CÁC COMPONENT) === */}
      
      {/* Modal 1: Xem chi tiết */}
      <ConversationDetailModal 
        conversation={selectedConversation} 
        onClose={handleCloseModal} 
      />

      {/* Modal 2: Xác nhận */}
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationState.title}
        message={confirmationState.message}
        type={confirmationState.type}
      />

    </div>
  );
}