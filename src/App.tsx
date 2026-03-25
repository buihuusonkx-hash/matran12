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
  School,
  FileText,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MatrixData, MatrixGroup, MatrixItem } from './types';

// Grade 10 Initial Data from Image
const GRADE_10_INITIAL: MatrixGroup[] = [
  { id: 'g1', name: 'Đại số tổ hợp', items: [] },
  { id: 'g2', name: 'Một số yếu tố thống kê và xác suất', items: [] },
  { id: 'g3', name: 'Phương pháp tọa độ trong mặt phẳng', items: [] }
];

// Grade 11 Initial Data
const GRADE_11_INITIAL: MatrixGroup[] = [
  { id: 'g11-1', name: 'Hàm số mũ và hàm số lôgarit', items: [] },
  { id: 'g11-2', name: 'Quan hệ vuông góc trong không gian', items: [] },
  { id: 'g11-3', name: 'Xác suất có điều kiện và các quy tắc xác suất', items: [] }
];

export default function App() {
  const [grade, setGrade] = useState<number>(10);
  const [data, setData] = useState<MatrixData>({
    grade: 10,
    semester: 'II',
    examType: '',
    groups: GRADE_10_INITIAL
  });
  
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState<string | null>(null);

  // Sync data when grade changes
  useEffect(() => {
    setData(prev => ({
      ...prev,
      grade,
      groups: grade === 10 ? GRADE_10_INITIAL : GRADE_11_INITIAL
    }));
  }, [grade]);

  // Calculations based on USER'S POINT STRUCTURE
  // TN1: 12 câu - 3đ (0.25/c)
  // TN2: 2 câu (8 ý) - 2đ (1.0/c, hoặc 0.25/ý nếu tính lẻ? Thường tính theo mức độ đúng của 4 ý)
  // TN3: 4 câu - 2đ (0.5/c)
  // TL: 6 câu - 3đ (0.5/c)
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
    
    // Target distribution (Total 12-8-4-6)
    // TN1: 12, TN2: 8 ý, TN3: 4, TL: 6
    const newData = { ...data };
    newData.groups = newData.groups.map(group => ({
      ...group,
      items: group.items.map(item => {
        const r = item.periods / totals.p;
        return {
          ...item,
          mc_rec: Math.round(r * 8), mc_und: Math.round(r * 3), mc_app: Math.round(r * 1),
          tf_rec: Math.round(r * 3), tf_und: Math.round(r * 3), tf_app: Math.round(r * 2),
          sa_rec: Math.round(r * 2), sa_und: Math.round(r * 1), sa_app: Math.round(r * 1),
          essay_app: Math.round(r * 4), essay_adv: Math.round(r * 2)
        };
      })
    }));
    setData(newData);
    alert('Đã phân bổ tự động theo cấu trúc: TN1 (12), TN2 (2 câu), TN3 (4 câu), Tự luận (6 câu).');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] font-sans p-4 md:p-6 lg:p-8">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Title Section */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full shadow-md border border-slate-200 mb-6 group hover:shadow-lg transition-all">
             <div className="w-10 h-10 bg-[#0284c7] rounded-full flex items-center justify-center text-white shadow-inner group-hover:rotate-12 transition-transform">
                <BookOpen size={20} fill="currentColor" />
             </div>
             <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] uppercase tracking-tight">
               Ma Trận Toán 10, 11
             </h1>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/80 backdrop-blur-sm p-1.5 rounded-[22px] shadow-lg border border-white/50">
              <button 
                onClick={() => setGrade(10)}
                className={`flex items-center gap-2 px-8 py-3 rounded-[18px] font-bold text-sm transition-all ${grade === 10 ? 'bg-[#0284c7] text-white shadow-md scale-105' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <GraduationCap size={18} /> Khối 10
              </button>
              <button 
                onClick={() => setGrade(11)}
                className={`flex items-center gap-2 px-8 py-3 rounded-[18px] font-bold text-sm transition-all ${grade === 11 ? 'bg-[#0284c7] text-white shadow-md scale-105' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <GraduationCap size={18} /> Khối 11
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <ActionButton icon={<Layers size={20} />} label="Thêm Chủ đề" onClick={() => setIsAddingGroup(true)} bgColor="bg-slate-800" />
            <ActionButton icon={<Plus size={20} />} label="Thêm Bài học" onClick={() => { if (data.groups.length > 0) setIsAddingItem(data.groups[0].id); else setIsAddingGroup(true); }} bgColor="bg-[#8b5cf6]" />
            <ActionButton icon={<RefreshCw size={20} />} label="Tự động chia" onClick={handleAutoDistribute} bgColor="bg-[#10b981]" />
            <ActionButton icon={<FileDown size={20} />} label="Xuất Word" onClick={() => alert('Đang xử lý xuất file...')} bgColor="bg-[#0284c7]" />
          </div>
        </header>

        {/* Tip section */}
        <div className="bg-[#fffbeb] border border-[#fef3c7] p-5 mb-8 rounded-3xl flex items-start gap-4 shadow-sm">
          <div className="bg-[#f59e0b] p-2 rounded-xl text-white shadow-md">
            <Sparkles size={18} />
          </div>
          <p className="text-[#92400e] text-sm font-semibold leading-relaxed">
            <span className="font-extrabold uppercase text-[11px] block mb-1">Mẹo hay:</span> Click trực tiếp vào các ô số để cập nhật dữ liệu. Hệ thống sẽ tự tính điểm dựa trên cấu trúc: <span className="font-bold">TN1 (0.25đ), TN3 (0.5đ), TL (0.5đ)</span>. Riêng TN Dạng 2 tính <span className="font-bold text-red-600">1.0đ/câu</span> (trọn 4 ý).
          </p>
        </div>

        {/* Matrix Table */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-12">
          <div className="p-8 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#0284c7] rounded-full"></div>
              <h2 className="text-xl font-black text-[#0f172a] uppercase tracking-wide">
                Bảng Phân Phối Chi Tiết - TOÁN {grade}
              </h2>
            </div>
            <div className="flex gap-4">
              <Badge icon={<FileText size={14}/>} label="Ma trận chuẩn" color="sky" />
              <Badge icon={<CheckCircle2 size={14}/>} label="Hệ thống tự động" color="emerald" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[11px] font-black text-slate-500 uppercase">
                  <th rowSpan={2} className="p-6 border-b border-r border-slate-100 bg-slate-50/50 min-w-[320px] text-left">Nội dung kiến thức / Bài học</th>
                  <th colSpan={2} className="p-3 border-b border-r border-teal-100 bg-teal-50 text-teal-800">TN Dạng 1 (NLC)</th>
                  <th colSpan={3} className="p-3 border-b border-r border-amber-100 bg-amber-50 text-amber-800">TN Dạng 2 (Đ-S)</th>
                  <th colSpan={3} className="p-3 border-b border-r border-rose-100 bg-rose-50 text-rose-800">TN Dạng 3 (TLN)</th>
                  <th colSpan={2} className="p-3 border-b border-r border-[#f1f5f9] bg-slate-100 text-slate-800">Tự luận (TL)</th>
                  <th rowSpan={2} className="p-3 border-b border-slate-100 bg-slate-50 text-sky-800 text-xs">Tổng</th>
                  <th rowSpan={2} className="p-3 border-b border-slate-100 bg-slate-50"></th>
                </tr>
                <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <th className="p-2 border-r border-teal-50 bg-teal-50/30">Biết</th><th className="p-2 border-r border-teal-100 bg-teal-50/30">Hiểu</th>
                  <th className="p-2 border-r border-amber-50 bg-amber-50/30">Biết</th><th className="p-2 border-r border-amber-50 bg-amber-50/30">Hiểu</th><th className="p-2 border-r border-amber-100 bg-amber-50/30">VD</th>
                  <th className="p-2 border-r border-rose-50 bg-rose-50/30">Biết</th><th className="p-2 border-r border-rose-50 bg-rose-50/30">Hiểu</th><th className="p-2 border-r border-rose-100 bg-rose-50/30">VD</th>
                  <th className="p-2 border-r border-slate-200 bg-slate-100/30 text-slate-500">VD</th><th className="p-2 border-r border-slate-200 bg-slate-100/30 text-slate-500">VDC</th>
                </tr>
              </thead>
              <tbody>
                {data.groups.map((group, gIdx) => (
                  <React.Fragment key={group.id}>
                    <tr className="bg-slate-50/40 group">
                      <td colSpan={14} className="p-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-slate-300">
                            {gIdx + 1}
                          </span>
                          <span className="text-sm font-black text-slate-900 uppercase tracking-wide">
                            {group.name}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {group.items.map((item, iIdx) => {
                      const rowTotal = item.mc_rec + item.mc_und + item.mc_app + item.tf_rec + item.tf_und + item.tf_app + item.sa_rec + item.sa_und + item.sa_app + item.essay_app + item.essay_adv;
                      return (
                        <tr key={item.id} className="group/row hover:bg-sky-50/30 transition-all border-b border-slate-100">
                          <td className="p-5 pl-12 border-r border-slate-50">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{gIdx + 1}.{iIdx + 1}. {item.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{item.periods} tiết học</span>
                            </div>
                          </td>
                          <EditableCell value={item.mc_rec} onChange={v => handleUpdateItem(group.id, item.id, 'mc_rec', v)} color="teal" />
                          <EditableCell value={item.mc_und} onChange={v => handleUpdateItem(group.id, item.id, 'mc_und', v)} color="teal" />
                          
                          <EditableCell value={item.tf_rec} onChange={v => handleUpdateItem(group.id, item.id, 'tf_rec', v)} color="amber" />
                          <EditableCell value={item.tf_und} onChange={v => handleUpdateItem(group.id, item.id, 'tf_und', v)} color="amber" />
                          <EditableCell value={item.tf_app} onChange={v => handleUpdateItem(group.id, item.id, 'tf_app', v)} color="amber" />
                          
                          <EditableCell value={item.sa_rec} onChange={v => handleUpdateItem(group.id, item.id, 'sa_rec', v)} color="rose" />
                          <EditableCell value={item.sa_und} onChange={v => handleUpdateItem(group.id, item.id, 'sa_und', v)} color="rose" />
                          <EditableCell value={item.sa_app} onChange={v => handleUpdateItem(group.id, item.id, 'sa_app', v)} color="rose" />
                          
                          <EditableCell value={item.essay_app} onChange={v => handleUpdateItem(group.id, item.id, 'essay_app', v)} color="slate" />
                          <EditableCell value={item.essay_adv} onChange={v => handleUpdateItem(group.id, item.id, 'essay_adv', v)} color="slate" />
                          
                          <td className="p-2 text-center border-l border-slate-50">
                            <span className={`text-sm font-black ${rowTotal > 0 ? 'text-[#0284c7]' : 'text-slate-200'}`}>{rowTotal}</span>
                          </td>
                          <td className="p-2 text-center">
                            <button onClick={() => handleDeleteItem(group.id, item.id)} className="p-2 hover:bg-red-50 text-red-400 rounded-xl opacity-0 group-hover/row:opacity-100 transition-all"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 border-t-2 border-slate-800 text-white font-heavy">
                  <td className="p-6 text-right text-xs font-black uppercase tracking-[3px] text-slate-400">TỔNG SỐ CÂU / Ý</td>
                  <td colSpan={2} className="p-3 bg-teal-900/40 text-center font-black text-base">{totals.mc_r + totals.mc_u + totals.mc_a}</td>
                  <td colSpan={3} className="p-3 bg-amber-900/40 text-center font-black text-base">{totals.tf_r + totals.tf_u + totals.tf_a}</td>
                  <td colSpan={3} className="p-3 bg-rose-900/40 text-center font-black text-base">{totals.sa_r + totals.sa_u + totals.sa_a}</td>
                  <td colSpan={2} className="p-3 bg-slate-800 text-center font-black text-base">{totals.es_a + totals.es_v}</td>
                  <td className="p-3 bg-[#0284c7] text-center text-xl font-black">{totals.total}</td>
                  <td className="p-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Summary Dashboard based on User Point Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard 
            title="TN Dạng 1" 
            count={totals.mc_r + totals.mc_u + totals.mc_a} 
            max={12} 
            pts={((totals.mc_r + totals.mc_u + totals.mc_a) * 0.25).toFixed(2)} 
            icon={<CheckCircle2/>}
            color="teal"
            desc="Lựa chọn một đáp án đúng"
          />
          <StatCard 
            title="TN Dạng 2" 
            count={Math.floor((totals.tf_r + totals.tf_u + totals.tf_a) / 4)} 
            max={2} 
            pts={(Math.floor((totals.tf_r + totals.tf_u + totals.tf_a) / 4) * 1.0).toFixed(2)} 
            icon={<Layers/>}
            color="amber"
            desc="Đúng/Sai (4 ý mỗi câu)"
          />
          <StatCard 
            title="TN Dạng 3" 
            count={totals.sa_r + totals.sa_u + totals.sa_a} 
            max={4} 
            pts={((totals.sa_r + totals.sa_u + totals.sa_a) * 0.5).toFixed(2)} 
            icon={<RefreshCw/>}
            color="rose"
            desc="Trả lời ngắn"
          />
          <StatStatStat stat1={totals.es_a + totals.es_v} pts={((totals.es_a + totals.es_v) * 0.5).toFixed(2)} max={6} />
        </div>
      </div>

      {/* Modals for Editing */}
      <AnimatePresence>
        {isAddingGroup && <GroupModal onSave={handleAddGroup} onClose={() => setIsAddingGroup(false)} />}
        {isAddingItem && <ItemModal onSave={name => handleAddItem(isAddingItem, name)} onClose={() => setIsAddingItem(null)} />}
      </AnimatePresence>
    </div>
  );
}

// --- Internal UI Components ---

function StatCard({ title, count, max, pts, icon, color, desc }: any) {
  const isDone = count >= max;
  const colors: any = {
    teal: 'bg-teal-600', amber: 'bg-amber-500', rose: 'bg-rose-500'
  };
  
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden flex flex-col hover:shadow-xl transition-all h-full">
      <div className={`absolute top-0 right-0 w-24 h-24 ${colors[color]} opacity-5 rounded-full -mr-8 -mt-8`}></div>
      <div className={`w-14 h-14 rounded-2xl ${colors[color]} flex items-center justify-center text-white mb-6 shadow-lg shadow-${color}-200`}>
        {icon}
      </div>
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{title}</span>
      <div className="flex items-baseline gap-2 mb-2">
        <h4 className={`text-4xl font-black ${isDone ? 'text-slate-900' : 'text-slate-900'}`}>{count}</h4>
        <span className="text-slate-400 font-bold text-lg">/ {max} câu</span>
      </div>
      <p className="text-[11px] text-slate-400 font-bold uppercase mb-6 leading-tight">{desc}</p>
      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-500">Tiêu chuẩn điểm:</span>
        <span className={`text-xl font-black text-${color}-600`}>{pts}đ</span>
      </div>
    </div>
  );
}

function StatStatStat({ stat1, pts, max }: any) {
  return (
    <div className="bg-[#1e293b] p-8 rounded-[32px] shadow-xl text-white relative overflow-hidden h-full flex flex-col">
       <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl"></div>
       <div className="w-14 h-14 rounded-2xl bg-[#0284c7] flex items-center justify-center text-white mb-6 shadow-xl shadow-sky-900">
         <FileText/>
       </div>
       <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Phần Tự Luận</span>
       <div className="flex items-baseline gap-2 mb-2">
         <h4 className="text-4xl font-black">{stat1}</h4>
         <span className="text-slate-500 font-bold text-lg">/ {max} câu</span>
       </div>
       <p className="text-[11px] text-slate-500 font-bold uppercase mb-6">Trình bày chi tiết lời giải</p>
       <div className="mt-auto pt-6 border-t border-slate-700 flex items-center justify-between">
         <span className="text-sm font-bold text-slate-400">Tiêu chuẩn điểm:</span>
         <span className="text-xl font-black text-sky-400">{pts}đ</span>
       </div>
    </div>
  );
}

function EditableCell({ value, onChange, color }: { value: number, onChange: (v: number) => void, color: string }) {
  const styles: any = {
    teal: 'bg-teal-50', amber: 'bg-amber-50', rose: 'bg-rose-50', slate: 'bg-slate-100/50'
  };
  const activeText: any = {
    teal: 'text-teal-700', amber: 'text-amber-700', rose: 'text-rose-700', slate: 'text-slate-800'
  };
  
  return (
    <td className={`p-1 border-r border-slate-100 hover:${styles[color]} transition-colors`}>
      <input 
        type="number" 
        value={value || ''} 
        placeholder="0"
        onChange={e => onChange(parseInt(e.target.value) || 0)}
        className={`w-full bg-transparent text-center font-black text-sm p-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-${color === 'slate' ? 'slate' : color}-200 rounded-xl ${value > 0 ? activeText[color] : 'text-slate-200'} transition-all`}
      />
    </td>
  );
}

function ActionButton({ icon, label, onClick, bgColor }: any) {
  return (
    <button onClick={onClick} className={`${bgColor} hover:scale-105 active:scale-95 text-white p-5 rounded-[24px] shadow-lg shadow-black/10 transition-all flex items-center gap-4 group`}>
      <div className="bg-white/10 p-2.5 rounded-xl group-hover:rotate-6 transition-transform">{icon}</div>
      <span className="font-extrabold text-sm tracking-tight">{label}</span>
    </button>
  );
}

function Badge({ icon, label, color }: any) {
  const styles: any = {
    sky: 'bg-sky-100 text-sky-700', emerald: 'bg-emerald-100 text-emerald-700'
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${styles[color]}`}>
      {icon} {label}
    </div>
  );
}

function ModalContainer({ children, title, onClose }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-10 pb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 transition-colors rounded-2xl text-slate-400"><X size={24}/></button>
        </div>
        <div className="p-10 pt-0">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function GroupModal({ onSave, onClose }: any) {
  return (
    <ModalContainer title="Tạo Chủ đề Mới" onClose={onClose}>
      <form onSubmit={e => { e.preventDefault(); onSave(new FormData(e.currentTarget).get('name')); }}>
        <input name="name" autoFocus placeholder="Nhập tên tiêu đề (Ví dụ: Đại số Tổ hợp...)" className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl mb-8 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none font-bold text-lg" required />
        <div className="flex gap-4">
           <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-slate-400">Hủy</button>
           <button type="submit" className="flex-[2] py-4 bg-[#0284c7] text-white rounded-2xl font-black shadow-xl shadow-sky-200">Lưu ngay</button>
        </div>
      </form>
    </ModalContainer>
  );
}

function ItemModal({ onSave, onClose }: any) {
  return (
    <ModalContainer title="Thêm Bài học" onClose={onClose}>
      <form onSubmit={e => { e.preventDefault(); onSave(new FormData(e.currentTarget).get('name')); }}>
        <input name="name" autoFocus placeholder="Nhập tên bài học kiến thức..." className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl mb-8 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold text-lg" required />
        <div className="flex gap-4">
           <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-slate-400">Hủy</button>
           <button type="submit" className="flex-[2] py-4 bg-[#8b5cf6] text-white rounded-2xl font-black shadow-xl shadow-indigo-200">Thêm bài</button>
        </div>
      </form>
    </ModalContainer>
  );
}
