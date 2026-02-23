import { useEffect, useState, useCallback, useMemo } from 'react';
import http from "../../api/http-common";
import { getToken } from "../../services/authenticationService";
import { NavBar } from '../../components/globals/NavBar';
import { 
    MoreHorizontal, Ban, ShieldAlert,
    ChevronLeft, ChevronRight, Activity, Users
} from 'lucide-react';
import { 
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, 
    AreaChart, Area, XAxis, CartesianGrid 
} from 'recharts';

interface UserAccountDTO {
    accountId: number;
    accountName: string;
    accountEmail: string;
    role: 'ADMIN' | 'MODERATOR' | 'USER';
}

interface PageResponse {
    content: UserAccountDTO[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export const DashboardPage = () => {
    const [users, setUsers] = useState<UserAccountDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchUsers = useCallback(() => {
        setIsLoading(true);
        http.get(`/users?page=${page}&size=8`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        .then(res => {
            if (res.data.content !== undefined) {
                setUsers(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
                setTotalElements(res.data.totalElements || 0);
            } else {
                setUsers(Array.isArray(res.data) ? res.data : []);
                setTotalPages(1);
                setTotalElements(Array.isArray(res.data) ? res.data.length : 0);
            }
        })
        .catch(err => console.error("Erreur API:", err))
        .finally(() => setIsLoading(false));
    }, [page]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const roleStats = useMemo(() => {
        const counts = {
            ADMIN: users.filter(u => u.role === 'ADMIN').length,
            MOD: users.filter(u => u.role === 'MODERATOR').length,
            USER: users.filter(u => u.role === 'USER').length,
        };
        return [
            { name: 'ADMIN', value: counts.ADMIN, color: '#EF3C56' },
            { name: 'MOD', value: counts.MOD, color: '#FFA500' },
            { name: 'USER', value: counts.USER, color: '#444' },
        ].filter(s => s.value > 0 || (users.length === 0 && s.name === 'USER'));
    }, [users]);

    const activityData = [
        { time: '08:00', val: 30 }, { time: '10:00', val: 45 },
        { time: '12:00', val: 25 }, { time: '14:00', val: 65 },
        { time: '16:00', val: 38 }, { time: '18:00', val: 52 }
    ];

    return (
        <div className="h-screen w-full bg-[#050505] text-[#EEEEEE] font-sans overflow-y-auto">
            <NavBar />
            
            <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
                
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Console Admin</h1>
                        <p className="text-[10px] text-[#444] font-bold uppercase tracking-widest mt-1">Status: Online</p>
                    </div>
                    <div className="bg-[#0D0D0D] border border-[#1A1A1A] px-6 py-3 rounded-2xl flex items-center gap-3">
                        <Users size={16} className="text-[#EF3C56]" />
                        <span className="text-xl font-black tabular-nums">{totalElements || users.length}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-8 rounded-[2.5rem]">
                        <p className="text-[10px] font-black uppercase text-[#444] mb-6 tracking-widest">Rôles</p>
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={roleStats} innerRadius={60} outerRadius={75} dataKey="value" nameKey="name" stroke="none" paddingAngle={4}>
                                        {roleStats.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#0D0D0D', border: '1px solid #222'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#0D0D0D] border border-[#1A1A1A] p-8 rounded-[2.5rem]">
                        <p className="text-[10px] font-black uppercase text-[#444] mb-8 tracking-widest">Activité Simulée</p>
                        <div className="h-[160px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                                    <Area type="monotone" dataKey="val" stroke="#EF3C56" fill="#EF3C56" fillOpacity={0.1} strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-[2rem] overflow-x-auto shadow-2xl">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-[#1A1A1A] text-[10px] font-black uppercase text-[#444]">
                                <th className="p-8">Identité</th>
                                <th className="p-8">Email</th>
                                <th className="p-8">Rôle</th>
                                <th className="p-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#151515]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-[#444]">
                                        Chargement...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-[#444]">
                                        Aucun utilisateur trouvé
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.accountId} className="hover:bg-white/[0.01] transition-all">
                                        <td className="p-8 font-bold tracking-tighter uppercase italic">{u.accountName}</td>
                                        <td className="p-8 font-mono text-xs text-[#555]">{u.accountEmail}</td>
                                        <td className="p-8">
                                            <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black ${u.role === 'ADMIN' ? 'border-[#EF3C56] text-[#EF3C56]' : 'border-[#222] text-[#444]'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-8 text-right relative">
                                            <button onClick={() => setActiveMenu(activeMenu === u.accountId ? null : u.accountId)} className="p-3 text-[#333] hover:text-white">
                                                <MoreHorizontal size={20} />
                                            </button>
                                            {activeMenu === u.accountId && (
                                                <div className="absolute right-8 top-20 w-48 bg-[#0D0D0D] border border-[#222] rounded-2xl z-50 p-2 shadow-2xl">
                                                    <button className="w-full text-left px-3 py-3 text-[10px] font-bold hover:bg-white/5 rounded-xl text-[#EF3C56]">Promouvoir Admin</button>
                                                    <button className="w-full text-left px-3 py-3 text-[10px] font-bold text-red-500 hover:bg-red-500/10 rounded-xl mt-1">Révoquer Accès</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-12 mb-20">
                    <div className="text-[10px] font-black text-[#444] uppercase tracking-widest">
                        Page {page + 1} / {totalPages || 1}
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo(0,0); }}
                            className="p-4 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl text-[#EF3C56] hover:border-[#EF3C56]/50 disabled:opacity-20 transition-all"
                            disabled={page === 0}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            onClick={() => { setPage(p => p + 1); window.scrollTo(0,0); }}
                            className="p-4 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl text-[#EF3C56] hover:border-[#EF3C56]/50 disabled:opacity-20 transition-all"
                            disabled={totalPages > 0 ? page + 1 >= totalPages : users.length < 8}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};