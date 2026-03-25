/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  FileDown, 
  RefreshCw, 
  PlusCircle, 
  Save, 
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MatrixData, MatrixGroup, MatrixItem } from './types';

const INITIAL_DATA: MatrixData = {
  groups: []
};

export default function App() {
  const [data, setData] = useState<MatrixData>(INITIAL_DATA);
  const [editingItem, setEditingItem] = useState<{groupId: string, item: MatrixItem} | null>(null);
  const [editingGroup, setEditingGroup] = useState<MatrixGroup | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState<string | null>(null); // groupId

  // Calculations
  const totals = useMemo(() => {
    let mc_rec = 0, mc_und = 0;
    let tf_rec = 0, tf_und = 0, tf_app = 0;
    let sa_und = 0, sa_app = 0, sa_adv = 0;
    let totalPeriods = 0;

    data.groups.forEach(g => {
      g.items.forEach(i => {
        mc_rec += i.mc_recognition;
        mc_und += i.mc_understanding;
        tf_rec += i.tf_recognition;
        tf_und += i.tf_understanding;
        tf_app += i.tf_application;
        sa_und += i.sa_understanding;
        sa_app += i.sa_application;
        sa_adv += i.sa_advanced;
        totalPeriods += i.periods;
      });
    });

    const totalQuestions = mc_rec + mc_und + tf_rec + tf_und + tf_app + sa_und + sa_app + sa_adv;
    
    return {
      mc_rec, mc_und,
      tf_rec, tf_und, tf_app,
      sa_und, sa_app, sa_adv,
      totalQuestions,
      totalPeriods
    };
  }, [data]);

  const handleUpdateItem = (groupId: string, itemId: string, field: keyof MatrixItem, value: number) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === groupId ? {
        ...g,
        items: g.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
      } : g)
    }));
  };

  const handleDeleteItem = (groupId: string, itemId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      setData(prev => ({
        ...prev,
        groups: prev.groups.map(g => g.id === groupId ? {
          ...g,
          items: g.items.filter(i => i.id !== itemId)
        } : g)
      }));
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ chương này?')) {
      setData(prev => ({
        ...prev,
        groups: prev.groups.filter(g => g.id !== groupId)
      }));
    }
  };

  const handleAddGroup = (name: string) => {
    const newGroup: MatrixGroup = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      items: []
    };
    setData(prev => ({ ...prev, groups: [...prev.groups, newGroup] }));
    setIsAddingGroup(false);
  };

  const handleAddItem = (groupId: string, name: string) => {
    const newItem: MatrixItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      periods: 1,
      mc_recognition: 0, mc_understanding: 0,
      tf_recognition: 0, tf_understanding: 0, tf_application: 0,
      sa_understanding: 0, sa_application: 0, sa_advanced: 0
    };
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === groupId ? { ...g, items: [...g.items, newItem] } : g)
    }));
    setIsAddingItem(null);
  };

  const handleAutoDistribute = () => {
    if (totals.totalPeriods === 0) {
      alert('Vui lòng nhập số tiết cho các bài học!');
      return;
    }

    // Standard distribution totals
    const distribution = {
      mc_rec: 8, mc_und: 4,
      tf_rec: 1, tf_und: 2, tf_app: 1,
      sa_und: 2, sa_app: 3, sa_adv: 1
    };

    const newData = { ...data };
    
    // Distribute proportionally
    newData.groups = newData.groups.map(group => ({
      ...group,
      items: group.items.map(item => {
        const ratio = item.periods / totals.totalPeriods;
        return {
          ...item,
          mc_recognition: Math.round(ratio * distribution.mc_rec),
          mc_understanding: Math.round(ratio * distribution.mc_und),
          tf_recognition: Math.round(ratio * distribution.tf_rec),
          tf_understanding: Math.round(ratio * distribution.tf_und),
          tf_application: Math.round(ratio * distribution.tf_app),
          sa_understanding: Math.round(ratio * distribution.sa_und),
          sa_application: Math.round(ratio * distribution.sa_app),
          sa_advanced: Math.round(ratio * distribution.sa_adv)
        };
      })
    }));

    // Adjust for rounding errors (ensure totals match exactly)
    const checkAndAdjust = (field: keyof MatrixItem, target: number) => {
      let currentTotal = 0;
      newData.groups.forEach(g => g.items.forEach(i => currentTotal += (i[field] as number)));
      
      if (currentTotal !== target && newData.groups.length > 0) {
        // Find the item with most periods to adjust
        let bestItem: {gIdx: number, iIdx: number, periods: number} | null = null;
        newData.groups.forEach((g, gIdx) => g.items.forEach((i, iIdx) => {
          if (!bestItem || i.periods > bestItem.periods) {
            bestItem = {gIdx, iIdx, periods: i.periods};
          }
        }));

        if (bestItem) {
          const {gIdx, iIdx} = bestItem;
          const val = newData.groups[gIdx].items[iIdx][field] as number;
          (newData.groups[gIdx].items[iIdx][field] as any) = val + (target - currentTotal);
        }
      }
    };

    Object.entries(distribution).forEach(([field, target]) => {
      checkAndAdjust(field as keyof MatrixItem, target);
    });

    setData(newData);
    alert('Đã tự động phân bổ câu hỏi dựa trên số tiết!');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-[#1e293b]">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-[#cbd5e1] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-bottom border-[#cbd5e1] bg-[#f1f5f9]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#0284c7] uppercase tracking-tight">
              Ma Trận Đề Kiểm Tra Môn Toán 12
            </h1>
            <p className="text-sm text-[#64748b] mt-1 italic">
              (Dành cho kỳ thi tốt nghiệp THPT và kiểm tra định kỳ)
            </p>
            <p className="text-xs text-[#94a3b8] mt-2 font-medium">
              Thiết kế bởi: <span className="text-[#0369a1]">Bùi Thị Kiên</span>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setIsAddingGroup(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#64748b] hover:bg-[#475569] text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <PlusCircle size={18} /> Thêm Chương
            </button>
            <button 
              onClick={() => {
                if (data.groups.length > 0) {
                  setIsAddingItem(data.groups[data.groups.length - 1].id);
                } else {
                  alert('Vui lòng thêm chương trước khi thêm bài!');
                  setIsAddingGroup(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <Plus size={18} /> Thêm Bài Mới
            </button>
            <button 
              onClick={handleAutoDistribute}
              className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <RefreshCw size={18} /> Tự Động Phân Bổ
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg font-semibold text-sm transition-colors">
              <FileDown size={18} /> Xuất File Word
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 w-12">STT</th>
                <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 w-16">Số tiết</th>
                <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 min-w-[250px]">Nội dung kiến thức, đơn vị kiến thức</th>
                <th colSpan={8} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2">Số câu hỏi theo mức độ nhận thức</th>
                <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 w-20">Tổng số câu</th>
                <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 w-20">Tỷ lệ (%)</th>
                <th rowSpan={3} className="border border-[#cbd5e1] bg-[#e0f2fe] p-2 w-24">Thao tác</th>
              </tr>
              <tr>
                <th colSpan={2} className="border border-[#cbd5e1] bg-[#f0fdf4] p-2">Trắc nghiệm nhiều phương án</th>
                <th colSpan={3} className="border border-[#cbd5e1] bg-[#fefce8] p-2">Trắc nghiệm đúng/sai</th>
                <th colSpan={3} className="border border-[#cbd5e1] bg-[#fff1f2] p-2">Trắc nghiệm trả lời ngắn</th>
              </tr>
              <tr>
                <th className="border border-[#cbd5e1] bg-[#f0fdf4] p-1 font-normal text-[11px]">NB</th>
                <th className="border border-[#cbd5e1] bg-[#f0fdf4] p-1 font-normal text-[11px]">TH</th>
                <th className="border border-[#cbd5e1] bg-[#fefce8] p-1 font-normal text-[11px]">NB</th>
                <th className="border border-[#cbd5e1] bg-[#fefce8] p-1 font-normal text-[11px]">TH</th>
                <th className="border border-[#cbd5e1] bg-[#fefce8] p-1 font-normal text-[11px]">VD</th>
                <th className="border border-[#cbd5e1] bg-[#fff1f2] p-1 font-normal text-[11px]">TH</th>
                <th className="border border-[#cbd5e1] bg-[#fff1f2] p-1 font-normal text-[11px]">VD</th>
                <th className="border border-[#cbd5e1] bg-[#fff1f2] p-1 font-normal text-[11px]">VDC</th>
              </tr>
            </thead>
            <tbody>
              {data.groups.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-20 text-center text-[#94a3b8]">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-[#f1f5f9] rounded-full text-[#cbd5e1]">
                        <PlusCircle size={48} />
                      </div>
                      <p className="text-lg font-medium text-[#64748b]">Chưa có dữ liệu ma trận</p>
                      <button 
                        onClick={() => setIsAddingGroup(true)}
                        className="px-6 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg font-semibold transition-colors shadow-sm"
                      >
                         Bắt đầu bằng cách thêm chương mới
                      </button>
                    </div>
                  </td>
                </tr>
              ) : data.groups.map((group, gIdx) => (
                <React.Fragment key={group.id}>
                  {/* Group Header */}
                  <tr className="bg-[#f8fafc] font-bold">
                    <td className="border border-[#cbd5e1] p-2 text-center">{gIdx + 1}</td>
                    <td className="border border-[#cbd5e1] p-2 text-center text-[#64748b]">
                      {group.items.reduce((acc, i) => acc + i.periods, 0)}
                    </td>
                    <td className="border border-[#cbd5e1] p-2 text-left uppercase text-[#0369a1]">
                      {group.name}
                    </td>
                    <td colSpan={8} className="border border-[#cbd5e1] p-2"></td>
                    <td className="border border-[#cbd5e1] p-2 text-center">
                      {group.items.reduce((acc, i) => acc + i.mc_recognition + i.mc_understanding + i.tf_recognition + i.tf_understanding + i.tf_application + i.sa_understanding + i.sa_application + i.sa_advanced, 0)}
                    </td>
                    <td className="border border-[#cbd5e1] p-2 text-center">
                      {((group.items.reduce((acc, i) => acc + i.mc_recognition + i.mc_understanding + i.tf_recognition + i.tf_understanding + i.tf_application + i.sa_understanding + i.sa_application + i.sa_advanced, 0) / (totals.totalQuestions || 1)) * 100).toFixed(1)}%
                    </td>
                    <td className="border border-[#cbd5e1] p-2">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => setIsAddingItem(group.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-[#f5f3ff] text-[#8b5cf6] hover:bg-[#ede9fe] rounded transition-colors font-semibold"
                          title="Thêm bài mới"
                        >
                          <Plus size={14} /> Thêm bài mới
                        </button>
                        <button 
                          onClick={() => setEditingGroup(group)}
                          className="p-1 text-[#0284c7] hover:bg-[#f0f9ff] rounded transition-colors"
                          title="Sửa tên chương"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteGroup(group.id)}
                          className="p-1 text-[#ef4444] hover:bg-[#fef2f2] rounded transition-colors"
                          title="Xóa chương"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Items */}
                  {group.items.map((item, iIdx) => {
                    const itemTotal = item.mc_recognition + item.mc_understanding + item.tf_recognition + item.tf_understanding + item.tf_application + item.sa_understanding + item.sa_application + item.sa_advanced;
                    return (
                      <tr key={item.id} className="hover:bg-[#f1f5f9] transition-colors">
                        <td className="border border-[#cbd5e1] p-2 text-center text-[#64748b]">{gIdx + 1}.{iIdx + 1}</td>
                        <td className="border border-[#cbd5e1] p-1 bg-white">
                          <input 
                            type="number" 
                            min="1"
                            value={item.periods}
                            onChange={(e) => handleUpdateItem(group.id, item.id, 'periods', parseInt(e.target.value) || 1)}
                            className="w-full bg-transparent text-center focus:outline-none font-medium"
                          />
                        </td>
                        <td className="border border-[#cbd5e1] p-2 text-left pl-6 font-medium">
                          {item.name}
                        </td>
                        {/* MC */}
                        <td className="border border-[#cbd5e1] p-1 bg-[#f0fdf4]">
                          <input 
                            type="number" 
                            min="0"
                            value={item.mc_recognition}
                            onChange={(e) => handleUpdateItem(group.id, item.id, 'mc_recognition', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent text-center focus:outline-none font-semibold"
                          />
                        </td>
                        <td className="border border-[#cbd5e1] p-1 bg-[#f0fdf4]">
                          <input 
                            type="number" 
                            min="0"
                            value={item.mc_understanding}
                            onChange={(e) => handleUpdateItem(group.id, item.id, 'mc_understanding', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent text-center focus:outline-none font-semibold"
                          />
                        </td>
                        {/* TF */}
                        <td className="border border-[#cbd5e1] p-1 bg-[#fefce8]">
                          <input 
                            type="number" 
                            min="0"
                            value={item.tf_recognition}
                            onChange={(e) => handleUpdateItem(group.id, item.id, 'tf_recognition', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent text-center focus:outline-none font-semibold"
                          />
                        </td>
                        <td className="border border-[#cbd5e1] p-1 bg-[#fefce8]">
                          <input 
                            type="number" 
                            min="0"
                            value={item.tf_understanding}
                            onChange={(e) => handleUpdateItem(group.id, item.id, 'tf_understanding', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent text-center focus:outline-none font-semibold"
                          />
                        </td>
                        <td className="border border-[#cbd5e1] p-1 bg-[#fefce8]">
                          <input 
                            type="number" 
                            min="0"
                            value={item.tf_application}
                            onChange={(e) => handleUpdateItem(group.id, item.id, 'tf_application', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent text-center focus:outline-none font-semibold"
                          />
                        </td>
                        {/* SA */}
                        <td className="border border-[#cbd5e1] p-1 bg-[#fff1f2]">
                          <input 
                            type="number" 
                            min="0"
                            value={item.sa_understanding}
                            onChange={(e) => handleUpdateItem(group.id, item.id, 'sa_understanding', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent text-center focus:outline-none font-semibold"
                          />
                        </td>
                        <td className="border border-[#cbd5e1] p-1 bg-[#fff1f2]">
                          <input 
                            type="number" 
                            min="0"
                            value={item.sa_application}
                            onChange={(e) => handleUpdateItem(group.id, item.id, 'sa_application', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent text-center focus:outline-none font-semibold"
                          />
                        </td>
                        <td className="border border-[#cbd5e1] p-1 bg-[#fff1f2]">
                          <input 
                            type="number" 
                            min="0"
                            value={item.sa_advanced}
                            onChange={(e) => handleUpdateItem(group.id, item.id, 'sa_advanced', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent text-center focus:outline-none font-semibold"
                          />
                        </td>
                        <td className="border border-[#cbd5e1] p-2 text-center font-bold text-[#0369a1]">
                          {itemTotal}
                        </td>
                        <td className="border border-[#cbd5e1] p-2 text-center text-[#64748b]">
                          {((itemTotal / (totals.totalQuestions || 1)) * 100).toFixed(1)}%
                        </td>
                        <td className="border border-[#cbd5e1] p-2">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => setEditingItem({groupId: group.id, item})}
                              className="p-1 text-[#0284c7] hover:bg-[#f0f9ff] rounded transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(group.id, item.id)}
                              className="p-1 text-[#ef4444] hover:bg-[#fef2f2] rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#f1f5f9] font-bold text-[#0f172a]">
                <td className="border border-[#cbd5e1] p-2"></td>
                <td className="border border-[#cbd5e1] p-2 text-center bg-[#e0f2fe]">{totals.totalPeriods}</td>
                <td className="border border-[#cbd5e1] p-3 text-right uppercase">Tổng cộng</td>
                <td className="border border-[#cbd5e1] p-2 text-center bg-[#dcfce7]">{totals.mc_rec}</td>
                <td className="border border-[#cbd5e1] p-2 text-center bg-[#dcfce7]">{totals.mc_und}</td>
                <td className="border border-[#cbd5e1] p-2 text-center bg-[#fef9c3]">{totals.tf_rec}</td>
                <td className="border border-[#cbd5e1] p-2 text-center bg-[#fef9c3]">{totals.tf_und}</td>
                <td className="border border-[#cbd5e1] p-2 text-center bg-[#fef9c3]">{totals.tf_app}</td>
                <td className="border border-[#cbd5e1] p-2 text-center bg-[#fee2e2]">{totals.sa_und}</td>
                <td className="border border-[#cbd5e1] p-2 text-center bg-[#fee2e2]">{totals.sa_app}</td>
                <td className="border border-[#cbd5e1] p-2 text-center bg-[#fee2e2]">{totals.sa_adv}</td>
                <td className="border border-[#cbd5e1] p-2 text-center text-[#0284c7] text-lg">{totals.totalQuestions}</td>
                <td className="border border-[#cbd5e1] p-2 text-center">100%</td>
                <td className="border border-[#cbd5e1] p-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Summary Info */}
        <div className="p-6 bg-[#f8fafc] border-t border-[#cbd5e1]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-[#cbd5e1] shadow-sm">
              <h3 className="font-bold text-[#0369a1] mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                Phần I: Trắc nghiệm 4 lựa chọn
              </h3>
              <p className="text-sm text-[#64748b]">Số câu: <span className="font-bold text-[#1e293b]">{totals.mc_rec + totals.mc_und}</span></p>
              <p className="text-sm text-[#64748b]">Điểm: <span className="font-bold text-[#1e293b]">{((totals.mc_rec + totals.mc_und) * 0.25).toFixed(2)}</span></p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#cbd5e1] shadow-sm">
              <h3 className="font-bold text-[#0369a1] mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                Phần II: Trắc nghiệm Đúng/Sai
              </h3>
              <p className="text-sm text-[#64748b]">Số câu: <span className="font-bold text-[#1e293b]">{totals.tf_rec + totals.tf_und + totals.tf_app}</span></p>
              <p className="text-sm text-[#64748b]">Điểm: <span className="font-bold text-[#1e293b]">4.00</span> (Mỗi câu 1đ)</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#cbd5e1] shadow-sm">
              <h3 className="font-bold text-[#0369a1] mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                Phần III: Trắc nghiệm trả lời ngắn
              </h3>
              <p className="text-sm text-[#64748b]">Số câu: <span className="font-bold text-[#1e293b]">{totals.sa_und + totals.sa_app + totals.sa_adv}</span></p>
              <p className="text-sm text-[#64748b]">Điểm: <span className="font-bold text-[#1e293b]">{((totals.sa_und + totals.sa_app + totals.sa_adv) * 0.5).toFixed(2)}</span></p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-[#cbd5e1] text-center">
          <p className="text-[#64748b] text-sm">
            App được thiết kế bởi <span className="text-[#0284c7] font-bold">Bùi Thị Kiên</span>
          </p>
        </div>
      </div>




      {/* Modals */}
      <AnimatePresence>
        {(isAddingGroup || editingGroup) && (
          <Modal 
            title={editingGroup ? "Sửa tên chương" : "Thêm chương mới"} 
            onClose={() => { setIsAddingGroup(false); setEditingGroup(null); }}
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
              if (editingGroup) {
                setData(prev => ({
                  ...prev,
                  groups: prev.groups.map(g => g.id === editingGroup.id ? { ...g, name } : g)
                }));
                setEditingGroup(null);
              } else {
                handleAddGroup(name);
              }
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#64748b] mb-1">Tên chương</label>
                <input 
                  name="name"
                  defaultValue={editingGroup?.name || ''}
                  autoFocus
                  className="w-full p-2 border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:border-transparent outline-none"
                  placeholder="Nhập tên chương..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => { setIsAddingGroup(false); setEditingGroup(null); }}
                  className="px-4 py-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0284c7] text-white rounded-lg font-semibold hover:bg-[#0369a1] transition-colors"
                >
                  Lưu
                </button>
              </div>
            </form>
          </Modal>
        )}

        {(isAddingItem || editingItem) && (
          <Modal 
            title={editingItem ? "Sửa tên mục" : "Thêm đơn vị kiến thức"} 
            onClose={() => { setIsAddingItem(null); setEditingItem(null); }}
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
              if (editingItem) {
                setData(prev => ({
                  ...prev,
                  groups: prev.groups.map(g => g.id === editingItem.groupId ? {
                    ...g,
                    items: g.items.map(i => i.id === editingItem.item.id ? { ...i, name } : i)
                  } : g)
                }));
                setEditingItem(null);
              } else if (isAddingItem) {
                handleAddItem(isAddingItem, name);
              }
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#64748b] mb-1">Tên đơn vị kiến thức</label>
                <input 
                  name="name"
                  defaultValue={editingItem?.item.name || ''}
                  autoFocus
                  className="w-full p-2 border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:border-transparent outline-none"
                  placeholder="Nhập tên đơn vị kiến thức..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => { setIsAddingItem(null); setEditingItem(null); }}
                  className="px-4 py-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0284c7] text-white rounded-lg font-semibold hover:bg-[#0369a1] transition-colors"
                >
                  Lưu
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#cbd5e1] bg-[#f8fafc]">
          <h2 className="font-bold text-[#0f172a]">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f1f5f9] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
