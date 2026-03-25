import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  FileDown, 
  RefreshCw, 
  PlusCircle, 
  X,
  GraduationCap,
  Calendar,
  AlertCircle,
  ChevronRight,
  BookOpen,
  Layers,
  Sparkles,
  Search,
  School
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MatrixData, MatrixGroup, MatrixItem } from './types';

// Grade 10 Initial Data from Image
const GRADE_10_INITIAL: MatrixGroup[] = [
  {
    id: 'g1',
    name: 'Đại số tổ hợp',
    items: [
      { id: '1.1', name: 'Quy tắc cộng. Quy tắc nhân. Sơ đồ hình cây', periods: 3, mc_rec: 1, mc_und: 1, mc_app: 0, tf_rec: 1, tf_und: 1, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '1.2', name: 'Hoán vị, chỉnh hợp, tổ hợp', periods: 4, mc_rec: 1, mc_und: 1, mc_app: 0, tf_rec: 1, tf_und: 1, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '1.3', name: 'Nhị thức Newton', periods: 2, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 0, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
    ]
  },
  {
    id: 'g2',
    name: 'Một số yếu tố thống kê và xác suất',
    items: [
      { id: '2.1', name: 'Số gần đúng. Sai số', periods: 2, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 0, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '2.2', name: 'Các số đặc trưng đo xu thế trung tâm', periods: 3, mc_rec: 1, mc_und: 1, mc_app: 0, tf_rec: 1, tf_und: 1, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
    ]
  },
  {
    id: 'g3',
    name: 'Phương pháp tọa độ trong mặt phẳng',
    items: [
      { id: '3.1', name: 'Tọa độ của vector', periods: 3, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 1, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '3.2', name: 'Biểu thức tọa độ của các phép toán', periods: 2, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 0, tf_app: 0, sa_rec: 0, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '3.3', name: 'Phương trình đường thẳng', periods: 3, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 1, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '3.4', name: 'Vị trí tương đối và góc. Khoảng cách', periods: 2, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 0, tf_app: 0, sa_rec: 0, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '3.5', name: 'Phương trình đường tròn', periods: 3, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 1, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
    ]
  }
];

// Grade 11 Initial Data
const GRADE_11_INITIAL: MatrixGroup[] = [
  {
    id: 'g11-1',
    name: 'Hàm số mũ và hàm số lôgarit',
    items: [
      { id: '11.1', name: 'Phép tính lũy thừa và logarit', periods: 3, mc_rec: 1, mc_und: 1, mc_app: 0, tf_rec: 1, tf_und: 1, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '11.2', name: 'Hàm số mũ và logarit', periods: 4, mc_rec: 1, mc_und: 1, mc_app: 0, tf_rec: 1, tf_und: 1, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '11.3', name: 'Phương trình, bất phương trình mũ và logarit', periods: 3, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 0, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
    ]
  },
  {
    id: 'g11-2',
    name: 'Quan hệ vuông góc trong không gian',
    items: [
      { id: '11.4', name: 'Đường thẳng và mặt phẳng vuông góc', periods: 4, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 0, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '11.5', name: 'Hai mặt phẳng vuông góc', periods: 4, mc_rec: 1, mc_und: 1, mc_app: 0, tf_rec: 1, tf_und: 1, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
      { id: '11.6', name: 'Khoảng cách trong không gian', periods: 3, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 1, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
    ]
  },
  {
    id: 'g11-3',
    name: 'Xác suất có điều kiện và các quy tắc xác suất',
    items: [
      { id: '11.7', name: 'Biến cố độc lập và quy tắc nhân', periods: 2, mc_rec: 1, mc_und: 0, mc_app: 0, tf_rec: 1, tf_und: 0, tf_app: 0, sa_rec: 1, sa_und: 0, sa_app: 0, essay_app: 0, essay_adv: 0 },
    ]
  }
];

export default function App() {
  const [grade, setGrade] = useState<number>(10);
  const [data, setData] = useState<MatrixData>({
    grade: 10,
    semester: 'II',
    examType: 'Giữa Học Kỳ II',
    groups: GRADE_10_INITIAL
  });
  
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'export'>('matrix');

  // Sync data when grade changes
  useEffect(() => {
    setData(prev => ({
      ...prev,
      grade,
      groups: grade === 10 ? GRADE_10_INITIAL : GRADE_11_INITIAL
    }));
  }, [grade]);

  // Calculations
  const totals = useMemo(() => {
    const t = {
      p: 0, mc_r: 0, mc_u: 0, mc_a: 0, tf_r: 0, tf_u: 0, tf_a: 0, sa_r: 0, sa_u: 0, sa_a: 0, es_a: 0, es_v: 0, total: 0
    };

    data.groups.forEach(g => {
      g.items.forEach(i => {
        t.p += i.periods;
        t.mc_r += i.mc_rec; t.mc_u += i.mc_und; t.mc_a += i.mc_app;
        t.tf_r += i.tf_rec; t.tf_u += i.tf_und; t.tf_a += i.tf_app;
        t.sa_r += i.sa_rec; t.sa_u += i.sa_und; t.sa_a += i.sa_app;
        t.es_a += i.essay_app; t.es_v += i.essay_adv;
      });
    });

    t.total = t.mc_r + t.mc_u + t.mc_a + t.tf_r + t.tf_u + t.tf_a + t.sa_r + t.sa_u + t.sa_a + t.es_a + t.es_v;
    return t;
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
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === groupId ? { ...g, items: g.items.filter(i => i.id !== itemId) } : g)
    }));
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
      mc_rec: 0, mc_und: 0, mc_app: 0,
      tf_rec: 0, tf_und: 0, tf_app: 0,
      sa_rec: 0, sa_und: 0, sa_app: 0,
      essay_app: 0, essay_adv: 0
    };
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === groupId ? { ...g, items: [...g.items, newItem] } : g)
    }));
    setIsAddingItem(null);
  };

  const handleAutoDistribute = () => {
    if (totals.p === 0) return alert('Vui lòng nhập số tiết!');
    
    // Total questions for 4 parts structure (Standard)
    const targets = {
      mc: 12, // Dạng 1
      tf: 16, // Dạng 2 (items)
      sa: 6, // Dạng 3
      es: 0 // Tự luận (can be adjusted)
    };

    const newData = { ...data };
    newData.groups = newData.groups.map(group => ({
      ...group,
      items: group.items.map(item => {
        const r = item.periods / totals.p;
        return {
          ...item,
          mc_rec: Math.round(r * 10), mc_und: Math.round(r * 2), mc_app: 0,
          tf_rec: Math.round(r * 6), tf_und: Math.round(r * 6), tf_app: Math.round(r*4),
          sa_rec: Math.round(r * 6), sa_und: 0, sa_app: 0,
        };
      })
    }));
    setData(newData);
    alert('Đã phân bổ tự động (gần đúng)! Bạn nên điều chỉnh lại để khớp tổng 12-16-6.');
  };

  const handleExportWord = () => {
    alert('Đang chuẩn bị trích xuất file... \n(Trong môi trường ứng dụng thực tế, file Word sẽ được tải về ngay lập tức)');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-400 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-3xl -ml-64 -mb-64"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation & Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <School size={14} />
                Ứng dụng Ma Trận Đề Kiểm Tra
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <BookOpen className="text-sky-600" size={36} />
                MA TRẬN {data.examType.toUpperCase()}
              </h1>
              <p className="text-slate-500 font-medium">
                Xây dựng khung đề thi chuẩn hóa theo quy định của Bộ Giáo dục & Đào tạo.
              </p>
            </div>

            <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
              <button 
                onClick={() => setGrade(10)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${grade === 10 ? 'bg-sky-600 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <GraduationCap size={18} /> Khối 10
              </button>
              <button 
                onClick={() => setGrade(11)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${grade === 11 ? 'bg-sky-600 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <GraduationCap size={18} /> Khối 11
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button onClick={() => setIsAddingGroup(true)} className="group bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-2xl shadow-sm transition-all flex items-center gap-4">
              <div className="bg-slate-700 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Layers size={24} />
              </div>
              <div className="text-left font-bold text-sm">Thêm Chủ đề</div>
            </button>
            <button 
              onClick={() => {
                if (data.groups.length > 0) setIsAddingItem(data.groups[0].id);
                else setIsAddingGroup(true);
              }}
              className="group bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-sm transition-all flex items-center gap-4"
            >
              <div className="bg-indigo-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Plus Circle size={24} />
              </div>
              <div className="text-left font-bold text-sm">Thêm Bài học</div>
            </button>
            <button onClick={handleAutoDistribute} className="group bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl shadow-sm transition-all flex items-center gap-4">
              <div className="bg-emerald-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <RefreshCw size={24} />
              </div>
              <div className="text-left font-bold text-sm">Tự động chia</div>
            </button>
            <button onClick={handleExportWord} className="group bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-2xl shadow-sm transition-all flex items-center gap-4">
              <div className="bg-sky-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <FileDown size={24} />
              </div>
              <div className="text-left font-bold text-sm">Tải về Word</div>
            </button>
          </div>
        </header>

        {/* Tip section */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-xl flex items-start gap-4 shadow-sm">
          <Sparkles className="text-amber-500 shrink-0" size={20} />
          <p className="text-amber-800 text-sm font-medium leading-relaxed">
            <span className="font-bold">Mẹo:</span> Click trực tiếp vào các ô số trong bảng để thay đổi nội dung. Tổng số câu và tỷ lệ phần trăm sẽ tự động cập nhật ngay lập tức.
          </p>
        </div>

        {/* Matrix Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-sky-900 flex items-center gap-2 uppercase tracking-wide">
              <Search size={18} />
              Bảng Ma Trận Chi Tiết - Toán {grade}
            </h2>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <div className="flex items-center gap-1"><Calendar size={14} /> Học kỳ {data.semester}</div>
              <div className="bg-slate-200 w-px h-4"></div>
              <div>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</div>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[10px] font-extrabold text-slate-500 uppercase">
                  <th rowSpan={2} className="p-4 border border-slate-100 bg-slate-50/50 min-w-[280px] text-left">Nội dung / Đơn vị kiến thức</th>
                  <th colSpan={3} className="p-2 border border-slate-100 bg-teal-50 text-teal-700">TN Dạng 1 (Multiple Choice)</th>
                  <th colSpan={3} className="p-2 border border-slate-100 bg-amber-50 text-amber-700">TN Dạng 2 (True/False)</th>
                  <th colSpan={3} className="p-2 border border-slate-100 bg-rose-50 text-rose-700">TN Dạng 3 (Short Answer)</th>
                  <th colSpan={2} className="p-2 border border-slate-100 bg-slate-100 text-slate-800">Tự luận</th>
                  <th rowSpan={2} className="p-2 border border-slate-100 bg-slate-50 text-sky-700 font-black text-xs">Tổng</th>
                  <th rowSpan={2} className="p-2 border border-slate-100 bg-slate-50">#</th>
                </tr>
                <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                  {/* NLC */}
                  <th className="p-2 border border-slate-100 bg-teal-50/30">Biết</th>
                  <th className="p-2 border border-slate-100 bg-teal-50/30">Hiểu</th>
                  <th className="p-2 border border-slate-100 bg-teal-50/30">VD</th>
                  {/* DS */}
                  <th className="p-2 border border-slate-100 bg-amber-50/30">Biết</th>
                  <th className="p-2 border border-slate-100 bg-amber-50/30">Hiểu</th>
                  <th className="p-2 border border-slate-100 bg-amber-50/30">VD</th>
                  {/* TLN */}
                  <th className="p-2 border border-slate-100 bg-rose-50/30">Biết</th>
                  <th className="p-2 border border-slate-100 bg-rose-50/30">Hiểu</th>
                  <th className="p-2 border border-slate-100 bg-rose-50/30">VD</th>
                  {/* TL */}
                  <th className="p-2 border border-slate-100 bg-slate-100/50">VD</th>
                  <th className="p-2 border border-slate-100 bg-slate-100/50">VDC</th>
                </tr>
              </thead>
              <AnimatePresence mode="popLayout">
                <tbody className="divide-y divide-slate-100">
                  {data.groups.map((group, gIdx) => (
                    <React.Fragment key={group.id}>
                      {/* Group Header */}
                      <tr className="bg-slate-50/80 group">
                        <td colSpan={14} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="bg-sky-600 text-white w-7 h-7 flex items-center justify-center rounded-lg text-xs font-black shadow-sm">
                                {gIdx + 1}
                              </span>
                              <span className="text-sm font-black text-slate-900 uppercase">
                                {group.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setIsAddingItem(group.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white text-emerald-600 rounded-lg transition-all"
                              >
                                <Plus size={16} />
                              </button>
                              <button 
                                onClick={() => {
                                  if(confirm('Xóa cả chương này?')) {
                                    setData(prev => ({ ...prev, groups: prev.groups.filter(g => g.id !== group.id) }));
                                  }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {/* Lessons */}
                      {group.items.map((item, iIdx) => {
                        const rowTotal = item.mc_rec + item.mc_und + item.mc_app + item.tf_rec + item.tf_und + item.tf_app + item.sa_rec + item.sa_und + item.sa_app + item.essay_app + item.essay_adv;
                        return (
                          <motion.tr 
                            layout
                            key={item.id} 
                            className="bg-white hover:bg-slate-50 group/row transition-colors"
                          >
                            <td className="p-4 pl-12">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-800 leading-tight">{gIdx + 1}.{iIdx + 1}. {item.name}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">({item.periods} tiết)</span>
                              </div>
                            </td>
                            {/* NLC - Green */}
                            <MatrixCell value={item.mc_rec} onChange={v => handleUpdateItem(group.id, item.id, 'mc_rec', v)} color="teal" />
                            <MatrixCell value={item.mc_und} onChange={v => handleUpdateItem(group.id, item.id, 'mc_und', v)} color="teal" />
                            <MatrixCell value={item.mc_app} onChange={v => handleUpdateItem(group.id, item.id, 'mc_app', v)} color="teal" />
                            {/* DS - Amber */}
                            <MatrixCell value={item.tf_rec} onChange={v => handleUpdateItem(group.id, item.id, 'tf_rec', v)} color="amber" />
                            <MatrixCell value={item.tf_und} onChange={v => handleUpdateItem(group.id, item.id, 'tf_und', v)} color="amber" />
                            <MatrixCell value={item.tf_app} onChange={v => handleUpdateItem(group.id, item.id, 'tf_app', v)} color="amber" />
                            {/* TLN - Rose */}
                            <MatrixCell value={item.sa_rec} onChange={v => handleUpdateItem(group.id, item.id, 'sa_rec', v)} color="rose" />
                            <MatrixCell value={item.sa_und} onChange={v => handleUpdateItem(group.id, item.id, 'sa_und', v)} color="rose" />
                            <MatrixCell value={item.sa_app} onChange={v => handleUpdateItem(group.id, item.id, 'sa_app', v)} color="rose" />
                            {/* TL - Slate */}
                            <MatrixCell value={item.essay_app} onChange={v => handleUpdateItem(group.id, item.id, 'essay_app', v)} color="slate" />
                            <MatrixCell value={item.essay_adv} onChange={v => handleUpdateItem(group.id, item.id, 'essay_adv', v)} color="slate" />
                            
                            <td className="p-2 border-l border-slate-100 text-center">
                              <span className={`text-sm font-black ${rowTotal > 0 ? 'text-sky-600' : 'text-slate-300'}`}>
                                {rowTotal}
                              </span>
                            </td>
                            <td className="p-2 text-center">
                              <button 
                                onClick={() => handleDeleteItem(group.id, item.id)}
                                className="opacity-0 group-hover/row:opacity-100 p-1.5 hover:bg-rose-50 text-rose-400 rounded-lg transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </AnimatePresence>
              <tfoot>
                <tr className="bg-slate-900 text-white font-heavy">
                  <td className="p-5 text-right text-xs font-black uppercase tracking-widest text-slate-400">Tổng cộng số câu / ý</td>
                  <td colSpan={3} className="p-2 bg-teal-800 text-center font-bold">{totals.mc_r + totals.mc_u + totals.mc_a}</td>
                  <td colSpan={3} className="p-2 bg-amber-800 text-center font-bold">{totals.tf_r + totals.tf_u + totals.tf_a}</td>
                  <td colSpan={3} className="p-2 bg-rose-800 text-center font-bold">{totals.sa_r + totals.sa_u + totals.sa_a}</td>
                  <td colSpan={2} className="p-2 bg-slate-700 text-center font-bold">{totals.es_a + totals.es_v}</td>
                  <td className="p-2 bg-sky-600 text-center text-lg font-black">{totals.total}</td>
                  <td className="p-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        {/* Footer Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Phần 1: Multiple Choice" count={totals.mc_r + totals.mc_u + totals.mc_a} points={((totals.mc_r + totals.mc_r + totals.mc_a) * 0.25).toFixed(2)} color="teal" />
          <SummaryCard title="Phần 2: True/False " count={totals.tf_r + totals.tf_u + totals.tf_a} points={(4).toFixed(2)} color="amber" subtitle="(4 câu x 4 ý)" />
          <SummaryCard title="Phần 3: Short Answer" count={totals.sa_r + totals.sa_u + totals.sa_a} points={((totals.sa_r + totals.sa_u + totals.sa_a) * 0.5).toFixed(2)} color="rose" />
          <SummaryCard title="Phần 4: Tự luận" count={totals.es_a + totals.es_v} points={(totals.es_a + totals.es_v > 0 ? "Theo tỉ lệ" : "0.00")} color="indigo" />
        </div>

        {/* Designer Credit */}
        <footer className="mt-12 text-center pb-12">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-sky-500" /> 
              Phát triển bởi đội ngũ chuyên gia toán học
            </p>
        </footer>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddingGroup && (
          <Modal title="Thêm Chủ đề Mới" onClose={() => setIsAddingGroup(false)}>
            <form onSubmit={e => { e.preventDefault(); handleAddGroup(new FormData(e.currentTarget).get('name') as string); }}>
              <input name="name" autoFocus placeholder="Ví dụ: Đại số Tổ hợp..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none mb-6 font-bold" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddingGroup(false)} className="px-6 py-3 text-slate-500 font-bold">Hủy</button>
                <button type="submit" className="px-8 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-sky-600/20 active:scale-95 transition-all">Lưu chủ đề</button>
              </div>
            </form>
          </Modal>
        )}
        {isAddingItem && (
          <Modal title="Thêm Bài học Mới" onClose={() => setIsAddingItem(null)}>
            <form onSubmit={e => { e.preventDefault(); handleAddItem(isAddingItem, new FormData(e.currentTarget).get('name') as string); }}>
              <input name="name" autoFocus placeholder="Ví dụ: Hoán vị, Chỉnh hợp..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none mb-6 font-bold" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddingItem(null)} className="px-6 py-3 text-slate-500 font-bold">Hủy</button>
                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">Thêm bài học</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function MatrixCell({ value, onChange, color }: { value: number, onChange: (v: number) => void, color: string }) {
  const bgStyles: Record<string, string> = {
    teal: 'hover:bg-teal-50 focus-within:bg-teal-50',
    amber: 'hover:bg-amber-50 focus-within:bg-amber-50',
    rose: 'hover:bg-rose-50 focus-within:bg-rose-50',
    slate: 'hover:bg-slate-50 focus-within:bg-slate-50'
  };
  
  const textStyles: Record<string, string> = {
    teal: 'text-teal-700',
    amber: 'text-amber-700',
    rose: 'text-rose-700',
    slate: 'text-slate-700'
  };

  return (
    <td className={`p-1 border border-slate-100 transition-colors ${bgStyles[color] || ''}`}>
      <input 
        type="number" 
        value={value === 0 ? '' : value}
        onChange={e => onChange(parseInt(e.target.value) || 0)}
        placeholder="0"
        className={`w-full bg-transparent text-center focus:outline-none font-black text-sm p-2 ${value > 0 ? textStyles[color] : 'text-slate-200'}`}
      />
    </td>
  );
}

function SummaryCard({ title, count, points, color, subtitle }: { title: string, count: number, points: string, color: string, subtitle?: string }) {
  const themes: Record<string, string> = {
    teal: 'bg-teal-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-600'
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className={`w-10 h-10 rounded-2xl ${themes[color]} mb-4 flex items-center justify-center text-white`}>
        <Activity size={20} />
      </div>
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-slate-900">{count}</span>
        <span className="text-slate-400 text-sm font-bold">câu / ý</span>
      </div>
      {subtitle && <p className="text-[10px] text-slate-400 font-bold mb-4">{subtitle}</p>}
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500">Dự kiến điểm</span>
        <span className={`text-sm font-black text-${color}-600`}>{points}đ</span>
      </div>
    </div>
  );
}

function Activity({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
      >
        <div className="flex items-center justify-between p-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-2xl transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>
        <div className="p-8 pt-0">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
