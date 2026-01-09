import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Rocket, Target, PenTool, BarChart3, Presentation, Sparkles } from 'lucide-react';

const App = () => {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [bdTips, setBdTips] = useState(true);
  const scrollRef = useRef(null);

  const translations = {
    en: {
      title: "Ahyan Mentor AI",
      status: "Expert Startup Partner",
      welcome: "Assalamu Alaikum! I am Ahyan Mentor AI. I help beginner entrepreneurs with business planning, marketing, content, pricing, registration, and operations.",
      placeholder: "Ask Ahyan about your business...",
      tip: "Consistency is key. Focus on solving real problems for your customers.",
      footer: "Ahyan Mentor AI • Unlimited Expert Guidance",
      thinking: "Ahyan is thinking"
    },
    bn: {
      title: "আয়ান মেন্টর এআই",
      status: "এক্সপার্ট স্টার্টআপ পার্টনার",
      welcome: "আসসালামু আলাইকুম! আমি আয়ান মেন্টর এআই। আমি নতুন উদ্যোক্তাদের ব্যবসা পরিকল্পনা, মার্কেটিং, কন্টেন্ট, মূল্য নির্ধারণ, রেজিস্ট্রেশন ও অপারেশন নিয়ে সাহায্য করি।",
      placeholder: "ব্যবসায়িক পরামর্শের জন্য জিজ্ঞাসা করুন...",
      tip: "ব্যবসায় সফলতার মূল চাবিকাঠি হলো ধৈর্য। গ্রাহকের সমস্যার সমাধান করুন।",
      footer: "আয়ান মেন্টর এআই • উদ্যোক্তাদের জন্য বিশেষজ্ঞ পরামর্শ",
      thinking: "আয়ান চিন্তা করছে"
    }
  };

  const t = translations[language];

  const DEFAULT_KB = [
    { id: 'start', tags: ['business','start'], en: {q: 'how to start', a: 'Start by clarifying your product, validating with a few users, and writing a simple 1-page business plan.'}, bn: {q:'কিভাবে শুরু করবেন', a:'প্রথমে পণ্য স্পষ্ট করুন, কিছু ব্যবহারকারীর কাছে যাচাই করুন, এবং একটি ১-পেজ ব্যবসা পরিকল্পনা লিখুন।'}},
    { id: 'pricing', tags: ['price','pricing','margin'], en:{q:'pricing',a:'Calculate cost + desired margin. Research competitors.'}, bn:{q:'মূল্য',a:'খরচ + মার্জিন নির্ধারণ করুন। প্রতিযোগীদের দেখুন।'}},
    { id: 'marketing', tags:['marketing','ads','facebook'], en:{q:'marketing',a:'Use social media, content posts, and small budget ads to start.'}, bn:{q:'মার্কেটিং',a:'সোশ্যাল মিডিয়া, কন্টেন্ট পোস্ট ও ছোট বাজেটের বিজ্ঞাপন ব্যবহার করুন।'}},
    { id: 'register', tags:['bangladesh','register','license'], en:{q:'register',a:'Obtain trade license from local authority. Set up payment methods like bKash or Nagad.'}, bn:{q:'রেজিস্ট্রেশন',a:'স্থানীয় কর্তৃপক্ষ থেকে ট্রেড লাইসেন্স নিন। বিকাশ বা নগদের মাধ্যমে পেমেন্ট ব্যবস্থা করুন।'}}
  ];

  const [KB, setKB] = useState(() => {
    const saved = localStorage.getItem('ahyan_kb_v1');
    return saved ? JSON.parse(saved) : DEFAULT_KB;
  });

  const pushMessage = (text, role='bot') => {
    setMessages(prev => [...prev, {role, content: text, timestamp: new Date().toLocaleTimeString()}]);
  };

  useEffect(() => {
    pushMessage(t.welcome);
  }, [language]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if(!input.trim()) return;
    const userMsg = input;
    pushMessage(userMsg, 'user');
    setInput('');
    setTimeout(()=>{
      pushMessage(generateResponse(userMsg), 'bot');
    }, 300);
  };

  const generateResponse = (text) => {
    const tText = text.toLowerCase();
    const forbidden = ['sex','politics','porn','crime','bomb','weapon','kill','hate','terror','suicide','drugs','gamble'];
    if(forbidden.some(f=>tText.includes(f))) return language==='bn' ? 'আমি সেই ধরনের বিষয়ে সাহায্য করতে পারি না। শুধুমাত্র ব্যবসা সম্পর্কিত প্রশ্ন করুন।' : 'I cannot help with that topic. Please ask about business only.';

    let best=null, bestScore=0;
    KB.forEach(entry=>{
      let score=0;
      const candidates = [entry.en.q, entry.bn.q];
      candidates.forEach(c=>{ if(c && tText.includes(c.toLowerCase())) score+=1; });
      entry.tags.forEach(tag=>{ if(tText.includes(tag)) score+=1.5; });
      if(score>bestScore){bestScore=score; best=entry;}
    });

    if(best && bestScore>0){
      let ans = language==='bn' ? best.bn.a : best.en.a;
      if(bdTips && best.id==='register'){
        ans += language==='bn' ? '\n\nবাংলাদেশ টিপস: ট্রেড লাইসেন্স স্থানীয় সিটি করপোরেশন/পৌরসভার মাধ্যমে পান। বিকাশ মার্চেন্টের জন্য অফিসিয়াল নির্দেশিকা দেখুন।' : '\n\nBangladesh tip: Trade license comes from your city corporation/upazila. For bKash merchant, see official guidance.';
      }
      return ans;
    }

    return language==='bn' ? 'নিচে একটি দ্রুত চেকলিস্ট:\n1) পণ্যের ধারণা স্পষ্ট করুন।\n2) যাচাই করুন।\n3) ১-পেজ ব্যবসা পরিকল্পনা লিখুন।\n4) মূল্য নির্ধারণ করুন।\n5) সোশ্যাল মিডিয়ায় বিক্রি শুরু করুন।\n6) দৈনিক বিক্রি নোট করুন।' :
      'Quick checklist:\n1) Clarify product/service.\n2) Validate with few users.\n3) Write 1-page business plan.\n4) Price your product.\n5) Start selling on social media.\n6) Track daily sales.';
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-slate-50">
      <header className="flex justify-between mb-4">
        <div>
          <h1 className="font-bold text-lg">{t.title}</h1>
          <small>{t.status}</small>
        </div>
        <div className="flex gap-2">
          <select value={language} onChange={e=>setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
          <button onClick={()=>setBdTips(!bdTips)}>{bdTips ? 'Bangladesh Tips: ON' : 'Bangladesh Tips: OFF'}</button>
          <button onClick={()=>setMessages([])}>Clear</button>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto mb-4 p-2 border rounded">
          {messages.map((m,i)=>(
            <div key={i} className={`flex mb-2 ${m.role==='user'?'justify-end':'justify-start'}`}>
              <div className={`p-3 rounded ${m.role==='user'?'bg-blue-400 text-white':'bg-white text-slate-800'}`}>{m.content.split('\n').map((l,j)=><p key={j}>{l}</p>)}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 p-2 border rounded" value={input} onChange={e=>setInput(e.target.value)} placeholder={t.placeholder} onKeyDown={e=>e.key==='Enter' && handleSend()} />
          <button onClick={handleSend} className="bg-indigo-600 text-white px-4 rounded"><Send size={18} /></button>
        </div>
      </main>
      <footer className="mt-2 text-center text-sm text-gray-500">{t.footer}</footer>
    </div>
  );
};

export default App;
