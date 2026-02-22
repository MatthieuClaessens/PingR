import { useEffect, useState, useCallback, useMemo } from 'react';
import http from "../../api/http-common";
import { getToken } from "../../services/authenticationService";
import { NavBar } from '../../components/globals/NavBar';
import { 
    Mail, ChevronLeft, ChevronRight, 
    MoreHorizontal, Ban, VolumeX, ShieldAlert,
    UserMinus, Info, Activity, PieChart as PieIcon,
    Users, ShieldCheck
} from 'lucide-react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, CartesianGrid } from 'recharts';

interface UserAccountDTO {
    accountId: number;
    accountName: string;
    accountEmail: string;
    role: 'ADMIN' | 'MODERATOR' | 'USER';
    avatarPath?: string;
}

export const DashboardPage = () => {
    const [users, setUsers] = useState<UserAccountDTO[]>([]);
    const [page, setPage] = useState<number>(0);
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = useCallback(() => {
        setIsLoading(true);
        http.get(`/users?page=${page}&size=20`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        .then(res => {
            setUsers(res.data.content || res.data);
        })
        .catch(err => console.error("Erreur API:", err))
        .finally(() => setIsLoading(false));
    }, [page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const closeMenu = () => setActiveMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    const stats = useMemo(() => {
        const adminCount = users.filter(u => u.role === 'ADMIN').length;
        const modCount = users.filter(u => u.role === 'MODERATOR').length;
        const userCount = users.filter(u => u.role === 'USER').length;

        const roleData = [
            { name: 'ADMIN', value: adminCount, color: '#EF3C56' },
            { name: 'MOD', value: modCount, color: '#FFA500' },
            { name: 'USER', value: userCount, color: '#444' },
        ].filter(s => s.value > 0);

        return { total: users.length, roleData, adminCount };
    }, [users]);

    const handleAction = (userId: number, action: string, value?: string) => {
        setActiveMenu(null);
        const headers = { 'Authorization': `Bearer ${getToken()}` };

        if (action === 'ROLE') {
            http.put(`/users/${userId}/role?role=${value}`, {}, { headers })
                .then(() => {
                    setUsers(prev => prev.map(u => 
                        u.accountId === userId ? { ...u, role: value as any } : u
                    ));
                })
                .catch(() => alert("Erreur lors du changement de rôle"));
        } else if (action === 'BAN') {
            if (window.confirm("Bannir définitivement cet accès ?")) {
                setUsers(prev => prev.filter(u => u.accountId !== userId));
            }
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-[#EEEEEE] font-sans pb-20">
            <NavBar />
            
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-[#EF3C56] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EF3C56]">Système Admin</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter italic uppercase">Dashboard</h1>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-[#0D0D0D] border border-[#1A1A1A] px-5 py-3 rounded-2xl flex items-center gap-4">
                            <Users size={16} className="text-[#444]" />
                            <div>
                                <p className="text-[8px] font-black text-[#444] uppercase tracking-widest">Data_Pool</p>
                                <p className="text-xl font-black italic">{stats.total}</p>
                            </div>
                        </div>
                        <div className="bg-[#0D0D0D] border border-[#1A1A1A] px-5 py-3 rounded-2xl flex items-center gap-4">
                            <ShieldCheck size={16} className="text-[#EF3C56]" />
                            <div>
                                <p className="text-[8px] font-black text-[#444] uppercase tracking-widest">Privilégiés</p>
                                <p className="text-xl font-black italic text-[#EF3C56]">{stats.adminCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-8 rounded-[2.5rem] flex flex-col items-center shadow-2xl">
                        <div className="w-full flex items-center gap-3 mb-6">
                            <PieIcon size={16} className="text-[#EF3C56]" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#444]">Répartition des privilèges</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie data={stats.roleData} innerRadius={50} outerRadius={65} paddingAngle={8} dataKey="value">
                                    {stats.roleData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#0D0D0D', border: '1px solid #222', borderRadius: '12px', fontSize: '10px'}} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex gap-6 mt-6">
                            {stats.roleData.map(s => (
                                <div key={s.name} className="flex flex-col items-center">
                                    <span className="text-[14px] font-black italic text-white">{s.value}</span>
                                    <span className="text-[8px] font-bold text-[#444] uppercase tracking-tighter">{s.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#0D0D0D] border border-[#1A1A1A] p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Activity size={120} strokeWidth={1} />
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <Info size={16} className="text-[#EF3C56]" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#444]">Status de la Database</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-4">
                            <div>
                                <p className="text-[10px] font-bold text-[#333] uppercase mb-2">Flux de données</p>
                                <p className="text-sm font-mono text-green-500">SYNCHRONISÉ</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#333] uppercase mb-2">Dernière mise à jour</p>
                                <p className="text-sm font-mono text-[#666]">{new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <div className="mt-10 h-[60px] flex items-end gap-1">
                            {[40,70,45,90,65,80,30,50,95,60].map((h, i) => (
                                <div key={i} className="flex-1 bg-[#EF3C56]/20 rounded-t-sm" style={{height: `${h}%`}} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#EF3C56]/20 to-transparent rounded-[2.5rem] blur opacity-25" />
                    <div className="relative overflow-visible bg-[#0D0D0D] border border-[#1A1A1A] rounded-[2rem]">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#1A1A1A] bg-white/[0.02]">
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#444]">Utilisateur</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#444]">Email</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#444]">Rôle</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#444] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#151515]">
                                {users.map((user) => (
                                    <tr key={user.accountId} className="group/row hover:bg-white/[0.01] transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-2xl bg-[#151515] border border-[#222] flex items-center justify-center text-[#EF3C56] font-black group-hover/row:border-[#EF3C56]/50 transition-all">
                                                    {user.accountName.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-lg tracking-tighter">{user.accountName}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-[#666] font-mono text-sm">
                                                <Mail size={14} /> {user.accountEmail}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase ${
                                                user.role === 'ADMIN' ? 'bg-[#EF3C56]/10 border-[#EF3C56]/30 text-[#EF3C56]' : 'bg-[#151515] border-[#222] text-[#888]'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right relative">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === user.accountId ? null : user.accountId); }}
                                                className="p-3 hover:bg-[#1A1A1A] rounded-xl text-[#444] hover:text-white transition-all"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>

                                            {activeMenu === user.accountId && (
                                                <div className="absolute right-6 top-16 w-52 bg-[#0D0D0D] border border-[#222] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
                                                    <div className="p-2 flex flex-col gap-1 text-left">
                                                        <div className="px-3 py-2 text-[9px] font-black text-[#333] uppercase">Modération</div>
                                                        <button onClick={() => handleAction(user.accountId, 'MUTE')} className="flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg transition-colors"><VolumeX size={14} className="text-orange-500" /> Sourdine</button>
                                                        <button onClick={() => handleAction(user.accountId, 'BAN')} className="flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"><Ban size={14} /> Bannir</button>
                                                        <div className="h-px bg-[#1A1A1A] my-1" />
                                                        <div className="px-3 py-2 text-[9px] font-black text-[#333] uppercase">Permissions</div>
                                                        <button onClick={() => handleAction(user.accountId, 'ROLE', 'ADMIN')} className="flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg transition-colors text-white"><ShieldAlert size={14} className="text-[#EF3C56]" /> Passer Admin</button>
                                                        <button onClick={() => handleAction(user.accountId, 'ROLE', 'USER')} className="flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg transition-colors text-[#888]"><UserMinus size={14} /> Passer User</button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {isLoading && <div className="p-10 text-center font-mono text-xs text-[#EF3C56] animate-pulse uppercase tracking-[0.5em]">Synchronisation...</div>}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-10">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="group flex items-center gap-3 px-6 py-3 rounded-2xl border border-[#1A1A1A] hover:border-[#EF3C56]/50 bg-[#0D0D0D] disabled:opacity-20 transition-all">
                        <ChevronLeft size={18} /> <span className="text-xs font-black uppercase">Précédent</span>
                    </button>
                    <div className="text-xs font-mono font-bold text-[#EF3C56] bg-[#0D0D0D] border border-[#1A1A1A] px-4 py-2 rounded-full shadow-inner uppercase tracking-tighter">
                        Index_{page + 1}
                    </div>
                    <button onClick={() => setPage(p => p + 1)} className="group flex items-center gap-3 px-6 py-3 rounded-2xl border border-[#1A1A1A] hover:border-[#EF3C56]/50 bg-[#0D0D0D] transition-all">
                        <span className="text-xs font-black uppercase">Suivant</span> <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </main>
    );
};