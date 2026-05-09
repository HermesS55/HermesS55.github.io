import { useEffect, useMemo, useState } from 'react';

const menu = ['Dashboard', 'Müşteriler', 'İşler', 'Notlar', 'Yapılacaklar'];
const store = {
  get: (k, d=[]) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d)),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};

export default function App() {
  const [tab, setTab] = useState('Dashboard');
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [customerForm, setCustomerForm] = useState({ name: '', status: 'yeni görüşme', customer_type: 'web sitesi' });
  const [jobForm, setJobForm] = useState({ title: '', category: 'Web sitesi', status: 'planlandı', priority: 'normal', price: 0, paid_amount: 0 });

  const loadAll = () => { setCustomers(store.get('customers')); setJobs(store.get('jobs')); setNotes(store.get('notes')); setTodos(store.get('todos')); };
  useEffect(() => { loadAll(); }, []);
  const save = (key, list) => { store.set(key, list); loadAll(); };
  const dashboard = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const dueSoon = jobs.filter(j => j.due_date && j.due_date >= today && j.due_date <= new Date(Date.now() + 3*86400000).toISOString().slice(0,10) && j.status !== 'tamamlandı').length;
    return {
      activeCustomers: customers.filter(c => c.status !== 'iptal').length,
      pendingJobs: jobs.filter(j => ['planlandı','devam ediyor','müşteri dönüşü bekleniyor'].includes(j.status)).length,
      dueSoon,
      totalReceived: jobs.reduce((a,b)=>a+Number(b.paid_amount||0),0),
      totalExpected: jobs.reduce((a,b)=>a+Number(b.price||0),0)
    };
  }, [customers, jobs]);

  return <div className="app"><aside className="sidebar">{menu.map(m => <button key={m} className={m===tab?'active':''} onClick={() => setTab(m)}>{m}</button>)}</aside><main className="content">
    {tab === 'Dashboard' && <section><h1>Profesyonel İş Takip Dashboard</h1><div className="cards"><Card t="Aktif Müşteri" v={dashboard.activeCustomers} /><Card t="Bekleyen İş" v={dashboard.pendingJobs} /><Card t="Teslimi Yaklaşan" v={dashboard.dueSoon} /><Card t="Alınan / Beklenen" v={`${dashboard.totalReceived}₺ / ${dashboard.totalExpected}₺`} /></div></section>}
    {tab === 'Müşteriler' && <section><h2>Müşteri Yönetimi</h2><form onSubmit={e=>{e.preventDefault(); save('customers', [{...customerForm,id:Date.now()}, ...customers]); setCustomerForm({ name: '', status: 'yeni görüşme', customer_type: 'web sitesi' });}} className="form">{['name','phone','instagram','website','email','first_contact_date','notes'].map(k => <input key={k} placeholder={k} value={customerForm[k]||''} onChange={e=>setCustomerForm({...customerForm,[k]:e.target.value})} />)}<button>Kaydet</button></form><ul>{customers.map(c => <li key={c.id}><b>{c.name}</b> - {c.customer_type} - {c.status}</li>)}</ul></section>}
    {tab === 'İşler' && <section><h2>İş / Proje Takibi</h2><form onSubmit={e=>{e.preventDefault(); save('jobs', [{...jobForm, id:Date.now(), customer_name:customers.find(c=>c.id===Number(jobForm.customer_id))?.name}, ...jobs]); setJobForm({ title: '', category: 'Web sitesi', status: 'planlandı', priority: 'normal', price: 0, paid_amount: 0 });}} className="form"><input placeholder="İş başlığı" value={jobForm.title||''} onChange={e=>setJobForm({...jobForm,title:e.target.value})}/><select value={jobForm.customer_id||''} onChange={e=>setJobForm({...jobForm,customer_id:e.target.value})}><option value="">Müşteri seç</option>{customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input placeholder="Kategori" value={jobForm.category||''} onChange={e=>setJobForm({...jobForm,category:e.target.value})}/><input placeholder="Teslim tarihi (YYYY-MM-DD)" value={jobForm.due_date||''} onChange={e=>setJobForm({...jobForm,due_date:e.target.value})}/><button>İş Ekle</button></form><ul>{jobs.map(j => <li key={j.id}><b>{j.title}</b> - {j.customer_name || 'Müşteri yok'} - {j.status}</li>)}</ul></section>}
    {tab === 'Notlar' && <section><h2>Günlük Notlar</h2><form onSubmit={e=>{e.preventDefault(); save('notes', [{id:Date.now(),content:e.target.note.value},...notes]); e.target.reset();}}><input name="note" placeholder="Not girin"/><button>Not Ekle</button></form><ul>{notes.map(n => <li key={n.id}>{n.content}</li>)}</ul></section>}
    {tab === 'Yapılacaklar' && <section><h2>Yapılacaklar</h2><form onSubmit={e=>{e.preventDefault(); save('todos', [{id:Date.now(),title:e.target.todo.value},...todos]); e.target.reset();}}><input name="todo" placeholder="Görev girin"/><button>Ekle</button></form><ul>{todos.map(t => <li key={t.id}>{t.title}</li>)}</ul></section>}
  </main></div>;
}
function Card({t,v}){return <div className="card"><small>{t}</small><h3>{v}</h3></div>}
