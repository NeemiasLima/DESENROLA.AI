/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  User, 
  Zap, 
  Sparkles, 
  Flame, 
  Shield, 
  Lock, 
  Copy, 
  Check, 
  Menu, 
  X,
  History,
  Info,
  CreditCard,
  Crown,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Trash2,
  Plus,
  Instagram,
  ExternalLink,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Github,
  Twitter,
  Facebook,
  LogIn,
  Mail,
  Smartphone as Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { LandingPage } from './components/LandingPage';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const LOGO_URL = "https://picsum.photos/seed/desenrola/400/400"; // Placeholder para a logo enviada

type Plan = 'Desengonçado' | 'Desenrolado' | 'Cachorrão';

interface AttachedFile {
  id: string;
  type: string;
  data: string; // base64
  name: string;
}

interface HistoryItem {
  id: string;
  timestamp: number;
  mensagem: string;
  contexto: string;
  objetivo: string;
  plan: Plan;
  responses: ResponseSet;
}

interface ResponseSet {
  [key: string]: string;
  curioso: string;
  provocador: string;
  engracado: string;
  natural: string;
}

interface ResponseMode {
  id: string;
  icon: string;
  name: string;
  description: string;
  preview: string;
  planRequired: Plan;
  recommended?: boolean;
}

const RESPONSE_MODES: ResponseMode[] = [
  { 
    id: 'natural', 
    icon: '🧠', 
    name: 'Natural', 
    description: 'Resposta simples que funciona', 
    preview: 'kkk pois é... como tá teu dia?',
    planRequired: 'Desengonçado',
    recommended: true
  },
  { 
    id: 'curioso', 
    icon: '🧐', 
    name: 'Curioso', 
    description: 'Puxa assunto e gera curiosidade', 
    preview: 'kkk tu sempre responde assim?',
    planRequired: 'Desengonçado'
  },
  { 
    id: 'provocador', 
    icon: '😏', 
    name: 'Provocador', 
    description: 'Atitude e leve provocação', 
    preview: 'esse "verdade" foi econômico demais kkk',
    planRequired: 'Desenrolado'
  },
  { 
    id: 'engracado', 
    icon: '😂', 
    name: 'Engraçado', 
    description: 'Leve, divertido e descontraído', 
    preview: 'kkkk vou precisar de mais que isso!',
    planRequired: 'Desenrolado'
  }
];

interface ResponseItemProps {
  key?: string | number;
  icon: string;
  title: string;
  text: string;
  onCopy: () => void;
  isCopied: boolean;
  index: number;
  selectedMode: string;
}

const SOUNDS = {
  ABERTURA: 'https://cdn.freesound.org/previews/270/270304_5123851-lq.mp3', // Retro level start
  CLIQUE: 'https://cdn.freesound.org/previews/256/256113_3263906-lq.mp3', // UI Click
  PROCESSANDO: 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3', // Tech/Computer beep
  SUCESSO: 'https://cdn.freesound.org/previews/511/511484_10615437-lq.mp3', // Power up
  COPIAR: 'https://cdn.freesound.org/previews/171/171697_2437358-lq.mp3', // Short tick
  COIN: 'https://cdn.freesound.org/previews/135/135936_2456488-lq.mp3', // Mario Coin Sound
  BGM: 'https://dl.dropboxusercontent.com/s/at6rce6z7m3v5b1/super-mario-bros-theme.mp3?dl=0' // Mario 8-bit stable link
};

const PLAN_INFO = {
  'Desengonçado': {
    price: 'GRÁTIS',
    limit: 10,
    icon: <Shield className="text-gray-400" size={18} />,
    color: 'bg-gray-800',
    description: 'MODO BÁSICO ATIVADO. SEM BUFFS DE CRIATIVIDADE.',
    link: 'https://pay.kiwify.com.br/2AGmOIQ'
  },
  'Desenrolado': {
    price: 'R$ 9,90',
    limit: 50,
    icon: <Zap className="text-red-500" size={18} />,
    color: 'bg-red-600',
    description: 'DESENROLADO EDITION: +100 DE CARISMA E FLUIDEZ.',
    link: 'https://pay.kiwify.com.br/2AGmOIQ'
  },
  'Cachorrão': {
    price: 'R$ 15,00',
    limit: Infinity,
    icon: <Crown className="text-red-600" size={18} />,
    color: 'bg-red-600 shadow-[0_0_10px_#ff0000]',
    description: 'MODO GOD: CONFIANÇA MÁXIMA E DOMÍNIO TOTAL.',
    link: 'https://pay.kiwify.com.br/2AGmOIQ'
  }
};

export default function App() {
  const [mensagem, setMensagem] = useState('');
  const [contexto, setContexto] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [plan, setPlan] = useState<Plan>('Desengonçado');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [usoAtual, setUsoAtual] = useState(0);
  const [limiteAtingido, setLimiteAtingido] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<ResponseSet | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedMode, setSelectedMode] = useState<string>('natural');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showLanding, setShowLanding] = useState(false); // Mudado para false para forçar login primeiro
  const [isMobile, setIsMobile] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const playSound = (soundUrl: string) => {
    if (!soundEnabled) return;
    const audio = new Audio(soundUrl);
    audio.volume = 0.4;
    audio.play().catch(e => console.log('Interação do usuário necessária para som:', e));
  };

  // Verificação de autenticação persistente
  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
      setShowLanding(false);
      setSessionStarted(true);
    }
    // Simula um loading de sistema gamer
    const timer = setTimeout(() => {
      setCheckingAuth(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setSessionStarted(true);
    playSound(SOUNDS.SUCESSO);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setShowLanding(true);
    setSessionStarted(false);
    playSound(SOUNDS.CLIQUE);
  };

  // Global interaction listener to start audio context
  useEffect(() => {
    const handleInteraction = () => {
      if (soundEnabled && bgmRef.current && bgmRef.current.paused) {
        bgmRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, [soundEnabled]);

  useEffect(() => {
    if (soundEnabled && !loading) {
      if (!bgmRef.current) {
        bgmRef.current = new Audio(SOUNDS.BGM);
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.30;
      }
      bgmRef.current.play().catch(e => console.log('BGM block:', e));
    } else if (bgmRef.current) {
      bgmRef.current.pause();
    }
  }, [soundEnabled, loading]);

  const responseRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Som de abertura
  useEffect(() => {
    if (sessionStarted) {
      const timer = setTimeout(() => {
        playSound(SOUNDS.ABERTURA);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sessionStarted]);

  // Som ao terminar de carregar resposta
  useEffect(() => {
    if (!loading && responses) {
      playSound(SOUNDS.SUCESSO);
    }
  }, [loading, responses]);

  // Carregar uso e histórico salvos localmente
  useEffect(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('last_usage_date');
    
    if (lastDate !== today) {
      localStorage.setItem('usage_count', '0');
      localStorage.setItem('last_usage_date', today);
      setUsoAtual(0);
    } else {
      const savedUsage = localStorage.getItem('usage_count');
      if (savedUsage) setUsoAtual(parseInt(savedUsage));
    }
    
    const savedHistory = localStorage.getItem('chat_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Contador de tempo para reset (meia-noite)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const secs = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
      
      setTimeLeft(`${hours}:${mins}:${secs}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('usage_count', usoAtual.toString());
  }, [usoAtual]);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (responses && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [responses]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1];
        const newFile: AttachedFile = {
          id: Math.random().toString(36).substr(2, 9),
          type: file.type,
          data: base64Data,
          name: file.name
        };
        setAttachedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const generateAIResponses = async () => {
    if (!mensagem && attachedFiles.length === 0) return;

    setLoading(true);
    setResponses(null);
    playSound(SOUNDS.PROCESSANDO);

    // Incrementar uso (mas permitir gerar para ver o valor)
    setUsoAtual(prev => prev + 1);

    const systemInstruction = `Você é um especialista em comunicação realista de WhatsApp/Instagram. Seu objetivo é gerar respostas naturais, curtas e com personalidade, como se fossem escritas por uma pessoa confiante — nunca como frases prontas da internet.
    
    FOCO ATUAL: O usuário selecionou o modo "${selectedMode}", então priorize a máxima qualidade para este estilo específico, mas ainda gere as outras 3 opções para comparação.

REGRAS DE OURO:
1. NATURALIDADE TOTAL: Deve parecer uma conversa real entre duas pessoas. Se parecer frase pronta, meme ou ensaiada -> REFAÇA.
2. CURTO E DIRETO: Máximo de 1 a 2 linhas. Diretas e fluidas, sem explicações longas.
3. SEM CLICHÊS (PROIBIDO): Proibido frases como "minha humildade é meu defeito", "sou assim mesmo", ou qualquer coisa genérica de "bio" de internet.
4. HUMOR NATURAL: Leve e sutil. Nada de roteiros de piada, frases absurdas ou teatrais.
5. GANCHO OBRIGATÓRIO: Toda resposta deve puxar a conversa, gerar curiosidade ou abrir espaço para resposta.
6. ANTI-GENÉRICO: Proibido "kkk e você?", "me conta mais", "legal".

DIFERENÇA ENTRE PLANOS:
🆓 Desengonçado: Simples, básico, pouco criativo. Neutro e sem impacto ou provocação forte.
💸 Desenrolado: Natural, envolvente, leve provocação e boa fluidez. Alguém que sabe conversar.
🔥 Cachorrão: Mais presença e confiança. Direto e com personalidade afiada. Deve ser NATURAL, não forçado. SEM ARROGÂNCIA e SEM EXAGERO. Se parecer igual ao Desenrolado ou forçado, REFAÇA.

TESTE FINAL (OBRIGATÓRIO):
Antes de entregar, você deve avaliar internamente:
- "Eu mandaria isso na vida real?"
- "Parece natural ou forçado/teatral?"
- "Tem personalidade real ou é clichê?"
- "Está condizente com o nível do plano?"
Se falhar em qualquer ponto, descarte e gere uma nova opção.`;

    const textPart = {
      text: `
Analise como o Desenrola.AI:
Uso atual: ${usoAtual}
Plano: ${plan}
Mensagem texto recebida: ${mensagem || 'Analisar apenas anexo multimídia'}
Contexto: ${contexto || 'Não informado'}
Objetivo: ${objetivo || 'Continuar a conversa da melhor forma'}

Gere as 4 melhores respostas do mundo.`
    };

    const fileParts = attachedFiles.map(file => ({
      inlineData: {
        mimeType: file.type,
        data: file.data
      }
    }));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [textPart, ...fileParts] }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              curioso: { type: Type.STRING },
              provocador: { type: Type.STRING },
              engracado: { type: Type.STRING },
              natural: { type: Type.STRING },
            },
            required: ['curioso', 'provocador', 'engracado', 'natural']
          }
        }
      });

      const data = JSON.parse(response.text);
      setResponses(data);

      // Salvar no histórico
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        mensagem: mensagem || (attachedFiles.length > 0 ? "[Anexo Enviado]" : ""),
        contexto,
        objetivo,
        plan,
        responses: data
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50)); // Mantém os últimos 50
    } catch (error) {
      console.error("Erro ao gerar respostas:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setMensagem(item.mensagem);
    setContexto(item.contexto);
    setObjetivo(item.objetivo);
    setPlan(item.plan);
    setResponses(item.responses);
    setLimiteAtingido(false);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const copyToClipboard = (text: string, id: string) => {
    const limit = PLAN_INFO[plan].limit;
    if (usoAtual > limit) {
      setShowPaywall(true);
      playSound(SOUNDS.COIN); // Som de moedas
      return;
    }

    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playSound(SOUNDS.COIN);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 space-y-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-24 h-24 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin shadow-[0_0_20px_#ff000033]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Flame size={40} className="text-red-600 animate-pulse" />
          </div>
        </motion.div>
        
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-gamer text-white uppercase tracking-widest">Verificando Protocolos</h2>
          <p className="text-[10px] font-gamer text-red-600/50 uppercase tracking-[0.4em] animate-pulse">Sincronizando com o terminal de segurança...</p>
        </div>

        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute top-0 bottom-0 w-1/2 bg-red-600 shadow-[0_0_15px_#ff0000]"
          />
        </div>
      </div>
    );
  }

  // BLOQUEIO TOTAL: Se não está logado, vai para AuthScreen (ou Landing se solicitado explicitamente)
  if (!isLoggedIn) {
    if (showLanding) {
      return (
        <LandingPage 
          onStart={() => {
            playSound(SOUNDS.CLIQUE);
            setShowLanding(false); // Volta para o AuthScreen
          }} 
          onViewPlans={() => {
             playSound(SOUNDS.CLIQUE);
             setShowLanding(false);
          }} 
          onPlaySound={playSound}
          sounds={SOUNDS}
        />
      );
    }

    return (
      <AuthScreen 
        onLogin={handleLoginSuccess} 
        onViewLanding={() => {
          playSound(SOUNDS.CLIQUE);
          setShowLanding(true);
        }}
        onPlaySound={playSound}
      />
    );
  }

  return (
    <div className={`flex h-screen bg-black text-gray-100 overflow-hidden font-sans ${isMobile ? 'flex-col' : 'flex-row'}`}>
      {/* Dashboard Mode - Desktop Sidebar */}
      {!isMobile && (
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            className="w-72 bg-[#050505] border-r border-red-600/10 flex flex-col h-full z-40"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.3)]">
                  <Flame size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-gamer tracking-tighter text-white uppercase">Desenrola <span className="text-red-600">AI</span></h1>
                  <span className="text-[8px] font-gamer text-red-500/50 uppercase tracking-[0.2em]">Desktop Edition v2.5</span>
                  <div className="mt-2 py-1 px-2 border border-red-600/20 rounded bg-red-600/5">
                    <p className="text-[7px] font-gamer text-gray-400 uppercase leading-tight tracking-widest">
                      Missão: Transformar seu papo em uma experiência de <span className="text-red-500">Video Game</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-gamer text-gray-500 mb-4 px-2 uppercase tracking-widest">Controles de Sistema</p>
                <NavButton icon={<MessageSquare size={18} />} label="Nova Cantada" active />
                <NavButton icon={<History size={18} />} label="Histórico Desenrola" />
                <NavButton icon={<Crown size={18} />} label="Upgrade Viral" onClick={() => setShowPlans(true)} color="text-yellow-500" />
              </div>
            </div>

            <div className="mt-auto p-4 border-t border-red-600/5 space-y-4">
              <div className="bg-[#111111] p-4 rounded-xl border border-red-600/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-gamer text-gray-400">STATUS DA CONTA</span>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3, 
                        ease: "easeInOut" 
                      }}
                      className="flex items-center justify-center"
                    >
                      {PLAN_INFO[plan].icon}
                    </motion.div>
                    <span className="text-[10px] font-gamer text-red-600 uppercase">{plan}</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((usoAtual / (PLAN_INFO[plan].limit || 10)) * 100, 100)}%` }}
                    className="h-full bg-red-600"
                  />
                </div>
                <p className="text-[8px] text-gray-500 font-mono text-center">LIMIT: {usoAtual}/{PLAN_INFO[plan].limit}</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-gamer text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase"
              >
                <LogIn className="rotate-180" size={14} />
                Encerrar Transmissão
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full bg-[#080808]">
        {/* Mobile Header */}
        {isMobile && (
          <header className="h-16 border-b border-red-600/10 px-4 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-red-600" />
              <span className="font-gamer text-sm tracking-tighter uppercase">Desenrola <span className="text-red-600">AI</span></span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 text-gray-400 hover:text-white"
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-red-600"
              >
                <Menu size={24} />
              </button>
            </div>
          </header>
        )}

        {/* Sidebar for Mobile */}
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed right-0 top-0 bottom-0 w-[80%] bg-[#0a0a0a] border-l border-red-600/20 z-[70] flex flex-col p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-gamer text-xs tracking-widest">MENU <span className="text-red-600">DESENROLA</span></span>
                  <button onClick={() => setSidebarOpen(false)}><X className="text-red-600" /></button>
                </div>
                
                <div className="mb-8 py-2 px-3 border border-red-600/20 rounded-xl bg-red-600/5">
                  <p className="text-[8px] font-gamer text-gray-500 uppercase leading-relaxed tracking-[0.2em]">
                    Objetivo: Sinta-se dentro de um <span className="text-red-500 font-bold">VÍDEO GAME</span> enquanto domina o game da conquista.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <button onClick={() => { setPlan('Desenrolado'); setShowPlans(true); setSidebarOpen(false); }} className="w-full p-4 bg-red-600 rounded-xl font-gamer text-[10px] shadow-[0_4px_0_#990000]">UPGRADE VIP</button>
                  <button onClick={() => { setIsLoggedIn(false); setShowLanding(true); setSidebarOpen(false); }} className="w-full p-4 bg-[#111111] rounded-xl font-gamer text-[10px] text-gray-400">SAIR</button>
                </div>

                <div className="mt-auto pt-6 border-t border-red-600/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-gamer text-gray-500 uppercase tracking-widest">Nível Atual</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-red-600/10 rounded-lg border border-red-600/20">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        {PLAN_INFO[plan].icon}
                      </motion.div>
                      <span className="text-[9px] font-gamer text-red-500 uppercase">{plan}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-gamer text-gray-500">CONSUMO</span>
                    <span className="text-[10px] font-gamer text-red-600 uppercase">{usoAtual}/{PLAN_INFO[plan].limit}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${Math.min((usoAtual / (PLAN_INFO[plan].limit || 10)) * 100, 100)}%` }}
                      className="h-full bg-red-600"
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Header */}
        {!isMobile && (
          <header className="h-20 border-b border-red-600/5 px-10 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-500 font-mono text-[10px] uppercase tracking-widest border-r border-white/10 pr-6">
                <Shield size={14} className="text-red-600" />
                <span>Status: <span className="text-red-500">Connected</span></span>
              </div>
              <p className="text-[10px] font-gamer text-gray-400 uppercase tracking-widest">Protocolo Fusion Ativo</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-red-600 overflow-hidden shadow-lg">
                    <img src={`https://picsum.photos/seed/user${i}/40/40`} alt="Active User" />
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-3 bg-[#111111] rounded-xl text-gray-400 hover:text-red-500 transition-all border border-white/5"
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>
          </header>
        )}

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide">
          <AnimatePresence>
            {!responses && !loading && !limiteAtingido && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto min-h-[70vh]"
              >
                {!sessionStarted ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center gap-4 mb-12">
                      <div className={`p-4 rounded-3xl border ${!isMobile ? 'bg-red-600/20 border-red-500 border-2' : 'bg-white/5 border-white/10 opacity-40'} transition-all duration-500`}>
                        <Monitor size={48} className={!isMobile ? 'text-red-500' : 'text-gray-500'} />
                      </div>
                      <div className="h-0.5 w-12 bg-white/5" />
                      <div className={`p-4 rounded-3xl border ${isMobile ? 'bg-red-600/20 border-red-500 border-2' : 'bg-white/5 border-white/10 opacity-40'} transition-all duration-500`}>
                        <Smartphone size={48} className={isMobile ? 'text-red-500' : 'text-gray-500'} />
                      </div>
                    </div>
                    
                    <h1 className="text-2xl md:text-5xl font-gamer mb-8 tracking-tighter text-white leading-tight">
                      SINCRO DA <span className="text-red-600">ENGINE</span> <br/>
                      <span className="text-red-500/50">DETECÇÃO: {!isMobile ? 'DESKTOP' : 'MOBILE'}</span>
                    </h1>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9, backgroundColor: "#990000" }}
                      onClick={() => {
                        setSessionStarted(true);
                        playSound(SOUNDS.CLIQUE);
                      }}
                      className="font-gamer text-xs bg-red-600 hover:bg-red-500 text-white px-12 py-6 rounded-2xl shadow-[0_8px_0_#990000] active:shadow-none active:translate-y-2 transition-all animate-pulse uppercase tracking-widest"
                    >
                      INICIAR OPERAÇÃO ⚡
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 relative group">
                      <div className="absolute -inset-1 bg-red-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative bg-[#0a0a0a] p-4 rounded-full border border-red-600/50 shadow-2xl shadow-red-600/20">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Flame size={48} className="text-red-600 fill-red-600/20" />
                        </motion.div>
                      </div>
                    </div>
                    <h1 
                      className="text-3xl md:text-5xl font-gamer mb-6 tracking-tighter text-white select-none drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                    >
                      DESENROLA<span className="text-red-600">.AI</span>
                    </h1>
                    <p className="text-[10px] md:text-sm text-gray-400 mb-8 leading-relaxed font-mono uppercase tracking-[0.4em]">
                      [ SISTEMA FUSION ATIVO ] <br/>
                      <span className="text-red-500 underline decoration-red-500/30 underline-offset-8 mt-2">IA DE ELITE PARA CADA VÁCUO</span>
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4">
                      <FeatureCard icon={<Sparkles className="text-red-500" size={18} />} title="⚡ IA MUNDIAL" desc="HARDWARE DE PONTA PARA CADA RESPOSTA." />
                      <FeatureCard icon={<Flame className="text-red-600" size={18} />} title="🔥 4 ESTILOS" desc="CURIOSO, PROVOCADOR, ENGRAÇADO E NATURAL." />
                      <FeatureCard icon={<Zap className="text-red-400" size={18} />} title="🏆 RANK S" desc="CONVERSAS QUE NUNCA ESFRIAM." />
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        {/* Responses Rendering */}
        <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide">
          <div className="max-w-3xl mx-auto py-10 px-4 md:px-0 space-y-8 pb-48">
            {loading && (
              <div className="flex flex-col items-center gap-6 py-20">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                  <Flame className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 animate-pulse" size={40} />
                </div>
                <div className="text-center space-y-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-red-500 text-sm font-gamer tracking-[0.3em] uppercase animate-pulse">CARREGANDO MAPA DA CONQUISTA...</p>
                    <p className="text-white text-[10px] font-gamer uppercase tracking-widest">RANK: {plan === 'Cachorrão' ? 'LENDA' : plan === 'Desenrolado' ? 'ELITE' : 'PLATINA'}</p>
                  </div>
                  
                  <div className="w-48 h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden mx-auto">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="h-full bg-red-600"
                    />
                  </div>
                  
                  <p className="text-gray-500 text-[8px] font-mono uppercase tracking-[0.2em] animate-pulse">Sincronizando com Gemini 1.5 Pro Ultra Deep Logic</p>
                </div>
              </div>
            )}

            {responses && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
                ref={responseRef}
              >
                <div className="flex items-center gap-2 mb-8 border-b border-red-600/10 pb-4">
                  <History className="text-gray-600" size={16} />
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Relatório Desenrola.AI <span className="text-red-600 px-2 bg-red-600/10 rounded ml-2">{plan} Edition</span></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(['curioso', 'provocador', 'engracado', 'natural'] as const).map((styleKey, index) => (
                    <ResponseItem 
                      key={styleKey}
                      icon={styleKey === 'curioso' ? "🧐" : styleKey === 'provocador' ? "😏" : styleKey === 'engracado' ? "😂" : "🧠"} 
                      title={styleKey === 'curioso' ? "Modo Curioso" : styleKey === 'provocador' ? "Modo Killer" : styleKey === 'engracado' ? "Modo Engraçado" : "Modo Natural"} 
                      text={responses[styleKey]} 
                      onCopy={() => copyToClipboard(responses[styleKey], styleKey)} 
                      isCopied={copiedId === styleKey}
                      index={index}
                      selectedMode={selectedMode}
                    />
                  ))}
                </div>

                {/* Upsell Logic */}
                {plan === 'Desengonçado' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-12 p-8 bg-gradient-to-br from-red-600/10 to-transparent border border-red-600/20 rounded-3xl text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Zap size={60} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-gamer text-white mb-4 uppercase tracking-tighter">Protocolo Premium Disponível</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                      As melhores respostas estão bloqueadas no hardware gratuito. Desbloqueie a <span className="text-red-500">Engine Ninja</span> para dominar o papo.
                    </p>
                    <button 
                      onClick={() => setShowPlans(true)}
                      className="bg-red-600 hover:bg-red-500 text-white font-gamer py-4 px-10 rounded-xl shadow-[0_4px_0_#990000] active:shadow-none active:translate-y-1 transition-all uppercase text-[10px] tracking-widest"
                    >
                      ATIVAR MUNDO FUSION ⚡
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className={`absolute bottom-0 left-0 right-0 pt-10 pb-6 px-4 backdrop-blur-md ${isMobile ? 'bg-black/90 border-t border-red-600/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'}`}>
          <div className="max-w-3xl mx-auto relative px-2">
            
            {/* Ability Cards / Mode Selector */}
            <div className={`grid gap-2 mb-4 px-1 ${isMobile ? 'grid-cols-4' : 'grid-cols-4'}`}>
              {RESPONSE_MODES.map((mode) => {
                const isLocked = mode.planRequired !== 'Desengonçado' && plan === 'Desengonçado';
                const isSelected = selectedMode === mode.id;

                return (
                  <motion.div
                    key={mode.id}
                    whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={() => {
                      if (isLocked) {
                        setShowPlans(true);
                        playSound(SOUNDS.CLIQUE);
                      } else {
                        setSelectedMode(mode.id);
                        playSound(SOUNDS.CLIQUE);
                      }
                    }}
                    className={`relative p-2 md:p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-1 overflow-hidden group
                      ${isSelected ? 'bg-red-600/10 ring-1 ring-red-600/40 animate-pulse-neon' : 'bg-[#0a0a0a] border-white/5 hover:border-red-600/30'}
                      ${isLocked ? 'opacity-60 grayscale' : 'opacity-100'}
                    `}
                  >
                    {!isMobile && mode.recommended && (
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-[6px] font-gamer px-2 py-1 rounded-bl-lg shadow-lg">
                        HOT
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg md:text-xl">{mode.icon}</span>
                      {!isMobile && isLocked && <Lock size={12} className="text-gray-600" />}
                    </div>
                    
                    <div className={`text-[7px] md:text-[8px] font-gamer uppercase tracking-tighter ${isSelected ? 'text-red-500' : 'text-gray-400'}`}>
                      {isMobile ? mode.name.split(' ')[1] : mode.name}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="bg-[#111111] border border-red-600/30 rounded-3xl shadow-2xl overflow-hidden focus-within:border-red-600/80 transition-all ring-1 ring-red-600/10">
              <div className="flex flex-col p-4 md:p-5 gap-0">
                <textarea 
                  rows={2}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="bg-transparent w-full resize-none outline-none text-sm placeholder:text-gray-600 py-2 border-b border-white/5 pb-4 custom-scrollbar"
                  placeholder="Cole sua treta aqui..."
                />
                
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*,audio/*" className="hidden" />
                      <button onClick={() => { playSound(SOUNDS.CLIQUE); fileInputRef.current?.click(); }} className="flex items-center gap-2 px-3 py-2 bg-[#050505] border border-white/5 rounded-2xl text-[9px] font-bold text-gray-400 hover:text-red-500 transition uppercase tracking-wider">
                        <ImageIcon size={14} />
                        {!isMobile && <span>Print</span>}
                      </button>
                      <button onClick={() => { playSound(SOUNDS.CLIQUE); fileInputRef.current?.click(); }} className="flex items-center gap-2 px-3 py-2 bg-[#050505] border border-white/5 rounded-2xl text-[9px] font-bold text-gray-400 hover:text-red-500 transition uppercase tracking-wider">
                        <Mic size={14} />
                        {!isMobile && <span>Áudio</span>}
                      </button>
                      <div className="flex-1">
                        <input value={contexto} onChange={e => setContexto(e.target.value)} placeholder="QUEM É?" className="bg-[#050505] border border-white/5 rounded-xl px-4 py-2 text-[9px] font-mono uppercase outline-none focus:border-red-600 transition w-full text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 md:w-32">
                      <input value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder="OBJETIVO?" className="bg-[#050505] border border-white/5 rounded-xl px-4 py-2 text-[9px] font-mono uppercase outline-none focus:border-red-600 transition w-full text-white h-11" />
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        playSound(SOUNDS.CLIQUE);
                        generateAIResponses();
                      }}
                      disabled={(!mensagem && attachedFiles.length === 0) || loading}
                      className="bg-red-600 hover:bg-red-500 disabled:bg-gray-800 text-white p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(255,0,0,0.4)] h-11 w-11 flex items-center justify-center border-2 border-red-400/30"
                    >
                      {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Send size={18} fill="currentColor" />}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Modal */}
      <AnimatePresence>
        {showPlans && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowPlans(false)}
               className="fixed inset-0 bg-black/90 backdrop-blur-lg"
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="relative bg-[#050505] rounded-[2rem] border border-red-600/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] max-w-4xl w-full p-8 md:p-12 overflow-y-auto max-h-[90vh]"
             >
                <button onClick={() => setShowPlans(false)} className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition">
                  <X size={28} />
                </button>

                <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-3xl font-gamer mb-3 tracking-tighter text-white">UPGRADE <span className="text-red-600 italic">SYSTEM</span></h2>
                  <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">DESBLOQUEIE HARDWARE DE ELITE PARA SUAS CONVERSAS.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(PLAN_INFO).map(([nome, info]) => (
                    <div 
                      key={nome}
                      className={`p-8 rounded-xl transition-all relative overflow-hidden group bg-black neon-border neon-glow ${nome === 'Desenrolado' ? 'animate-pulse-neon' : ''} ${plan === nome ? 'ring-4 ring-red-600/40' : ''}`}
                    >
                      <div className={`w-14 h-14 rounded-xl ${info.color} flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition duration-500 border border-red-500/30`}>
                        {info.icon}
                      </div>
                      <h3 className="text-xs font-gamer text-white uppercase tracking-tighter mb-1">{nome}</h3>
                      <p className="text-2xl font-gamer text-red-500 mt-2 mb-4 drop-shadow-[0_0_5px_#ff0000]">{info.price}</p>
                      <p className="text-[10px] text-gray-400 mb-8 leading-relaxed font-mono uppercase tracking-tight">{info.description}</p>
                      
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95, backgroundColor: "#990000" }}
                        onClick={() => {
                          if (nome === 'Desengonçado') {
                            setPlan('Desengonçado');
                            setShowPlans(false);
                            // Se voltar pro gratuito mas já estoirou o limite, mantém bloqueado
                            if (usoAtual >= 10) setLimiteAtingido(true);
                          } else {
                            // Abre o link da Kiwify para compra real
                            window.open(info.link, '_blank');
                            // Removida a ativação automática para evitar bypass
                          }
                        }}
                        className={`w-full py-4 rounded-xl font-gamer text-[8px] transition-all uppercase tracking-widest shadow-[0_4px_0_#990000] active:shadow-none active:translate-y-1 ${nome === 'Cachorrão' ? 'bg-white text-black hover:bg-red-600 hover:text-white border-2 border-gray-200' : nome === 'Desenrolado' ? 'bg-red-600 hover:bg-red-500 text-white border-2 border-red-400' : 'bg-[#111111] hover:bg-white hover:text-black text-gray-400 border-2 border-white/10'}`}
                      >
                        {plan === nome ? 'ATIVO' : 'COMPRAR NOW'}
                      </motion.button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 flex flex-col items-center gap-6 border-t border-red-600/20 pt-10">
                  <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><CreditCard size={14} className="text-red-600"/> Pix Imediato</span>
                    <span className="flex items-center gap-2"><Sparkles size={14} className="text-red-600"/> IA Fusion Cloud</span>
                    <span className="flex items-center gap-2"><Lock size={14} className="text-red-600"/> Conversa Anônima</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-[10px] font-gamer text-red-500 tracking-tighter mb-2 italic">DESENROLADOS AI: QUEM USA, DESENROLA DIFERENTE</p>
                    <div className="flex items-center gap-4 mb-2">
                      <a 
                        href="https://www.instagram.com/desenrola.aii?igsh=aTVhODc5NnhkMDhj" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-red-600/30 rounded-xl text-[8px] font-gamer text-gray-400 hover:text-white hover:neon-border transition-all duration-300 group"
                      >
                        <Instagram size={12} className="group-hover:text-red-500" />
                        <span>INSTAGRAM</span>
                      </a>
                      <a 
                        href="https://www.tiktok.com/@desenrola.aii" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-red-600/30 rounded-xl text-[8px] font-gamer text-gray-400 hover:text-white hover:neon-border transition-all duration-300 group"
                      >
                        <svg className="w-3 h-3 group-hover:text-red-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.41-.1z"/>
                        </svg>
                        <span>TIKTOK</span>
                      </a>
                    </div>
                    <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                      <div className="flex flex-col items-center gap-1">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414C17.702 15.011 17.85 14.6362 17.9142 14.1685C18.1065 14.281 18.2982 14.3797 18.4942 14.4714C18.5771 14.5361 18.6534 14.6148 18.7242 14.7114C18.9142 15.0114 19.3142 15.1114 19.6142 14.9114C19.9142 14.7114 20.0142 14.3114 19.8142 14.0114C19.7142 13.8114 19.5142 13.6114 19.3142 13.5114C19.111 13.4114 18.911 13.3114 18.611 13.2571L19.4682 9.47956C19.5312 9.2005 19.3569 8.91899 19.0779 8.85044C18.7984 8.78189 18.5173 8.95156 18.4487 9.23062L17.595 13.0076C17.3888 12.8398 17.1524 12.693 16.8903 12.5714C16.8524 12.3332 16.7915 12.0833 16.6896 11.8214C16.4896 11.2214 16.0896 10.8214 15.4896 10.6214C15.0896 10.4214 14.6896 10.4214 14.3896 10.5214C14.0896 10.3214 13.6896 10.2214 13.2896 10.3214C13.0895 10.2796 12.8715 10.25 12.64 10.25C12.449 10.25 12.261 10.271 12.08 10.3111C11.7801 10.2214 11.3801 10.3214 11.0801 10.5214C10.7801 10.4214 10.3801 10.4214 9.98014 10.6214C9.38014 10.8214 8.98014 11.2214 8.78014 11.8214C8.67823 12.0833 8.61729 12.3332 8.5794 12.5714C8.31726 12.693 8.08085 12.8398 7.87469 13.0076L7.02096 9.23062C6.95284 8.95156 6.67175 8.78189 6.39221 8.85044C6.11325 8.91899 5.93892 9.2005 6.00199 9.47956L6.85869 13.2571C6.55869 13.3114 6.35869 13.4114 6.15551 13.5114C5.95551 13.6114 5.75551 13.8114 5.65551 14.0114C5.45551 14.3114 5.55551 14.7114 5.85551 14.9114C6.15551 15.1114 6.55551 15.0114 6.74551 14.7114C6.81635 14.6148 6.89264 14.5361 6.97551 14.4714C7.17148 14.3797 7.36319 14.281 7.55551 14.1685C7.61917 14.6362 7.76722 15.011 7.94665 15.3414C8.1634 15.7414 8.5634 15.9414 8.9634 15.9414H16.5063C16.9063 15.9414 17.3063 15.7414 17.523 15.3414V15.3414ZM12.0001 11.5C12.4142 11.5 12.75 11.8358 12.75 12.25C12.75 12.6642 12.4142 13 12.0001 13C11.586 13 11.25 12.6642 11.25 12.25C11.25 11.8358 11.586 11.5 12.0001 11.5ZM15.2891 11.9614C15.5891 12.0614 15.7891 12.2614 15.8891 12.5614C15.9366 12.7214 15.961 12.8714 15.961 13.0114C15.861 13.1114 15.761 13.2114 15.661 13.3114C15.461 13.4114 15.211 13.5114 15.011 13.5614C14.761 13.5614 14.511 13.5114 14.261 13.4114C14.164 13.3114 14.114 13.2114 14.064 13.1114C14.014 12.9614 14.014 12.8614 14.014 12.7114C14.014 12.4114 14.214 12.2114 14.514 12.1114C14.814 12.0114 15.0891 11.9614 15.2891 11.9614V11.9614ZM9.43914 13.0114C9.43914 12.8714 9.46354 12.7214 9.51099 12.5614C9.61099 12.2614 9.81099 12.0614 10.111 11.9614C10.311 11.9614 10.5891 12.0114 10.8891 12.1114C11.1891 12.2114 11.3891 12.4114 11.3891 12.7114C11.3891 12.8614 11.3891 12.9614 11.3391 13.1114C11.2891 13.2114 11.2391 13.3114 11.1391 13.4114C10.8891 13.5114 10.6391 13.5614 10.3891 13.5614C10.1891 13.5114 9.93914 13.4114 9.73914 13.3114C9.63914 13.2114 9.53914 13.1114 9.43914 13.0114V13.0114ZM16.5063 15.1914H8.9634C8.8634 15.1914 8.7634 15.0914 8.7134 14.9914C8.6634 14.8914 8.6134 14.6914 8.6134 14.5914C8.6134 14.4914 8.7134 14.3914 8.8134 14.2914C9.0134 14.1914 9.21339 14.0914 9.41339 13.9914C9.71339 13.8914 10.0134 13.8414 10.3134 13.8414C10.6134 13.8414 10.9134 13.8914 11.2134 13.9914C11.4134 14.0914 11.6131 14.1914 11.8131 14.2414C11.8845 14.3313 11.9757 14.4069 12.0801 14.4614C12.1846 14.516 12.2997 14.548 12.4178 14.5552C12.536 14.5623 12.6545 14.5445 12.7651 14.5029C12.8757 14.4613 12.9759 14.4 13.0588 14.3229C13.2588 14.2429 13.4588 14.1429 13.6588 14.0429C13.9588 13.9429 14.2587 13.8929 14.5587 13.8929C14.8587 13.8929 15.1587 13.9429 15.4587 14.0429C15.6587 14.1429 15.8587 14.2429 16.0587 14.3429C16.1587 14.4429 16.2587 14.5429 16.2587 14.6429C16.2587 14.7429 16.2087 14.9429 16.1587 15.0429C16.1087 15.1429 16.0087 15.1929 15.9087 15.1929H16.5063V15.1914Z"></path></svg>
                        <span className="text-[7px] font-gamer text-gray-500">ANDROID</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.057 12.7634C17.0254 10.8242 18.6631 9.87329 18.7392 9.81635C17.8427 8.50854 16.4526 8.31885 15.9623 8.30322C14.7865 8.18896 13.5651 9.00195 12.9663 9.00195C12.3674 9.00195 11.3537 8.31299 10.3708 8.33203C9.07635 8.35156 7.86475 9.08838 7.19946 10.2456C5.85291 12.5713 6.85303 16.0303 8.14661 17.9043C8.78345 18.8232 9.53125 19.8516 10.5186 19.8154C11.4648 19.7803 11.8225 19.2085 12.9739 19.2085C14.1245 19.2085 14.4607 19.8154 15.4594 19.7969C16.4719 19.7803 17.1118 18.875 17.7441 17.9531C18.4739 16.8833 18.7773 15.854 18.7944 15.8032C18.7563 15.7871 17.0872 15.146 17.057 12.7634V12.7634ZM15.3442 6.94043C15.8716 6.30225 16.2256 5.41357 16.1284 4.52686C15.3677 4.55762 14.4446 5.03467 13.8994 5.67041C13.4116 6.23779 12.979 7.14795 13.0974 8.0166C13.9536 8.0835 14.8213 7.57568 15.3442 6.94043V6.94043Z"></path></svg>
                        <span className="text-[7px] font-gamer text-gray-500">IPHONE</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.44922L9.75043 4.77783V11.7222H0V3.44922ZM0 12.2778H9.75043V19.2222L0 20.5508V12.2778ZM10.8222 4.63184L24 2.83398V11.7222H10.8222V4.63184ZM10.8222 12.2778H24V21.166L10.8222 19.3682V12.2778Z"></path></svg>
                        <span className="text-[7px] font-gamer text-gray-500">WINDOWS</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C13.2356 0 14.4539 0.183416 15.6186 0.525816L12.0469 6.71181C10.1558 7.04259 8.63086 8.35123 7.91742 10.0632L1.87943 10.0632C3.59379 4.14446 9.01168 0 12 0ZM12 24C10.0336 24 8.16335 23.5422 6.50552 22.7351L10.068 16.5516C11.5317 17.5898 13.5186 17.4727 14.865 16.2926L20.1009 19.3151C18.1067 22.1852 14.808 24 12 24ZM24 12C24 14.2884 23.4439 16.4468 22.4632 18.3515L17.218 15.3211C17.3887 14.5367 17.3075 13.7113 16.9744 12.9667C16.9744 12.9667 16.9744 12.9667 16.9744 12.9667L16.9744 12.9667L20.5471 6.77978C22.6865 8.16726 24 10.4571 24 12ZM12 16.931C9.27663 16.931 7.06897 14.7234 7.06897 12C7.06897 9.27663 9.27663 7.06897 12 7.06897C14.7234 7.06897 16.931 9.27663 16.931 12C16.931 14.7234 14.7234 16.931 12 16.931Z"></path></svg>
                        <span className="text-[7px] font-gamer text-gray-500">CHROMEOS</span>
                      </div>
                    </div>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaywall(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[#0a0a0a] border-2 border-red-600 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_#ff000030] text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-red-600/10 rounded-full border border-red-600/30">
                  <Lock size={32} className="text-red-600" />
                </div>
              </div>
              
              <h2 className="text-xl md:text-2xl font-gamer text-white mb-4 tracking-tighter leading-tight">
                VOCÊ CHEGOU NO <span className="text-red-600">LIMITE DE HOJE</span> 🎮
              </h2>
              
              <p className="text-gray-400 text-sm mb-8 leading-relaxed font-mono uppercase">
                ESSA RESPOSTA PODE SALVAR SEU PAPO AGORA... <br/>
                <span className="text-red-500 font-bold">DESBLOQUEIE PARA CONTINUAR SEM TRAVAR 😏</span>
              </p>

              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setShowPaywall(false);
                    setShowPlans(true);
                  }}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-gamer py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-[0_4px_0_#990000] active:shadow-none active:translate-y-1 transition-all uppercase text-[10px]"
                >
                  <Zap size={14} />
                  <span>DESBLOQUEAR AGORA ⚡</span>
                </button>
                
                <button 
                  onClick={() => setShowPaywall(false)}
                  className="w-full bg-[#111111] border border-white/5 text-gray-500 hover:text-white font-gamer py-4 px-6 rounded-2xl transition-all uppercase text-[8px]"
                >
                  ESPERAR ATÉ AMANHÃ
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-red-600/10 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-[8px] font-gamer text-gray-600">
                  <Smartphone size={10} />
                  <span>MODO EXTREMO DISPONÍVEL</span>
                </div>
                <div className="text-[10px] font-gamer text-red-600/80 animate-pulse tracking-widest">
                  RESET EM: {timeLeft}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
   </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-5 bg-black rounded-xl neon-border neon-glow text-left transition-all group cursor-default shadow-lg">
      <div className="mb-3 group-hover:scale-125 transition-all duration-300 origin-left drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">{icon}</div>
      <div className="text-[10px] font-gamer text-white mb-2 uppercase tracking-tighter">{title}</div>
      <div className="text-[10px] text-gray-500 leading-snug font-mono uppercase lg:text-[11px]">{desc}</div>
    </div>
  );
}

function ResponseItem({ icon, title, text, onCopy, isCopied, index, selectedMode }: ResponseItemProps) {
  const isSelected = title.toLowerCase().includes(selectedMode.toLowerCase()) || 
                     (selectedMode === 'natural' && title.toLowerCase().includes('natural'));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.01 }}
      className={`bg-black p-6 md:p-8 rounded-2xl ring-1 transition-all duration-500 group relative overflow-hidden
        ${isSelected 
          ? 'ring-red-600/50 shadow-[0_0_40px_rgba(255,0,0,0.15)] bg-red-600/[0.03]' 
          : 'ring-white/[0.05] shadow-2xl hover:ring-red-600/20'}
      `}
    >
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl filter grayscale group-hover:grayscale-0 transition duration-500">{icon}</span>
          <div className="flex flex-col">
            <span className="text-[8px] font-gamer uppercase tracking-[0.1em] text-red-600/80 drop-shadow-[0_0_2px_#ff0000]">{title}</span>
            {isSelected && (
              <span className="text-[6px] font-gamer text-white animate-pulse mt-1">[ ABILITY SELECTED ]</span>
            )}
          </div>
        </div>
        <button 
          onClick={onCopy}
          className={`flex items-center gap-2 text-[8px] font-gamer px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all uppercase tracking-widest shadow-[0_4px_0_#990000] active:shadow-none active:translate-y-1 ${isCopied ? 'bg-red-600 text-white shadow-[0_0_15px_#ff0000]' : 'bg-[#111111] text-gray-500 hover:text-white hover:bg-red-600/20 border-2 border-white/5'}`}
        >
          {isCopied ? <Check size={12} /> : <Copy size={12} />}
          {isCopied ? 'GOT IT!' : 'COPY'}
        </button>
      </div>
      <p className="text-base md:text-lg text-white leading-relaxed font-mono uppercase tracking-tight">"{text}"</p>
      
      {/* Level Up Overlay */}
      <AnimatePresence>
        {isCopied && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1.5, y: -40 }}
            exit={{ opacity: 0, scale: 2, y: -100 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-red-600 text-white font-gamer text-xl px-6 py-2 rounded-lg shadow-[0_0_30px_#ff0000] rotate-[-5deg] border-2 border-white">
              LEVEL UP!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic decoration */}
      <div className="absolute -bottom-8 -right-8 opacity-[0.02] scale-[4] rotate-45 pointer-events-none group-hover:opacity-[0.08] group-hover:text-red-500 transition-all duration-700">
        <Flame size={60} />
      </div>
    </motion.div>
  );
}

function NavButton({ icon, label, active = false, onClick, color = "text-gray-400" }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, color?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group
        ${active ? 'bg-red-600/10 border border-red-600/20 text-white' : 'hover:bg-white/5 border border-transparent text-gray-500 hover:text-white'}
      `}
    >
      <div className={`${active ? 'text-red-500' : color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] font-gamer uppercase tracking-widest">{label}</span>
    </button>
  );
}

function AuthScreen({ onLogin, onViewLanding, onPlaySound }: { onLogin: () => void, onViewLanding: () => void, onPlaySound: (s: string) => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [authenticating, setAuthenticating] = useState<string | null>(null);

  const handleSocialLogin = (platform: string) => {
    onPlaySound(SOUNDS.PROCESSANDO);
    setAuthenticating(platform);
    // Simula o redirecionamento e autenticação
    setTimeout(() => {
      onLogin();
    }, 2500);
  };

  const handleManualLogin = () => {
    if (!email || !pass) {
      setError('Credenciais obrigatórias para acesso.');
      onPlaySound(SOUNDS.CLIQUE);
      return;
    }
    setError('');
    handleSocialLogin('TERMINAL');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 overflow-y-auto relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <AnimatePresence>
        {authenticating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center space-y-6"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Flame size={32} className="text-red-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-gamer text-white uppercase tracking-tighter">Conectando ao {authenticating}</h2>
                <p className="text-[10px] font-gamer text-gray-500 uppercase tracking-widest animate-pulse">Sincronizando protocolos de segurança...</p>
              </div>
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-1/2 h-full bg-red-600 shadow-[0_0_15px_#ff0000]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-red-600/20 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_100px_rgba(255,0,0,0.1)] relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <button 
            onClick={() => { onPlaySound(SOUNDS.CLIQUE); onViewLanding(); }}
            className="absolute top-8 left-8 text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 font-gamer text-[8px] uppercase tracking-widest"
          >
            <ExternalLink size={14} />
            Info
          </button>
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(255,0,0,0.4)] mb-6 relative group overflow-hidden">
            <Flame size={48} className="text-white fill-white/20 relative z-10" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.4),transparent)]"
            />
          </div>
          <h1 className="text-4xl font-gamer tracking-tighter text-white text-center uppercase leading-none">
            <span className="block text-red-600 text-sm tracking-[0.4em] mb-2">PROJETO</span>
            Desenrola AI
          </h1>
          <p className="text-[10px] font-gamer text-gray-500 mt-4 tracking-[0.4em] uppercase border-t border-white/5 pt-4">Segurança Multinível v2.5</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <SocialBtn icon={<Github size={20} />} label="GITHUB" onClick={() => handleSocialLogin('GITHUB')} onPlaySound={onPlaySound} />
            <SocialBtn icon={<Twitter size={20} fill="currentColor" />} label="X / TWITTER" onClick={() => handleSocialLogin('TWITTER')} onPlaySound={onPlaySound} />
            <SocialBtn icon={<Facebook size={20} fill="currentColor" />} label="FACEBOOK" onClick={() => handleSocialLogin('FACEBOOK')} onPlaySound={onPlaySound} />
            <SocialBtn icon={<ExternalLink size={20} />} label="GOOGLE" onClick={() => handleSocialLogin('GOOGLE')} onPlaySound={onPlaySound} />
          </div>

          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-4 text-[8px] font-gamer text-gray-600 bg-[#0a0a0a] uppercase tracking-widest">Ou acesse via terminal</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[8px] font-gamer text-gray-500 uppercase tracking-widest px-2">E-Mail do Agente</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@dominio.com" 
                  className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-mono focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[8px] font-gamer text-gray-500 uppercase tracking-widest px-2">Senha de Criptografia</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={16} />
                <input 
                  type="password" 
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-mono focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleManualLogin}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-gamer py-5 rounded-2xl shadow-[0_6px_0_#990000] active:shadow-none active:translate-y-1 transition-all uppercase text-[10px] tracking-widest"
          >
            Sincronizar Conta ⚡
          </button>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[8px] font-gamer text-red-500 text-center uppercase tracking-widest"
            >
              [ ERRO ]: {error}
            </motion.p>
          )}

          <p className="text-center text-[8px] font-gamer text-gray-600 hover:text-white transition-colors cursor-pointer uppercase tracking-widest">
            Ainda não tem acesso? Solicitar Credenciais
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function SocialBtn({ icon, label, onClick, onPlaySound }: { icon: React.ReactNode, label: string, onClick: () => void, onPlaySound: (s: string) => void }) {
  return (
    <button 
      onClick={() => { onPlaySound(SOUNDS.CLIQUE); onClick(); }}
      className="flex flex-col items-center justify-center gap-2 p-4 bg-black border border-white/5 rounded-2xl hover:border-red-600/50 hover:bg-white/5 transition-all group"
    >
      <div className="text-gray-500 group-hover:text-red-600 transition-colors">
        {icon}
      </div>
      <span className="text-[7px] font-gamer text-gray-500 group-hover:text-white uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function PlusIcon(props: any) {
  return (
    <svg 
      fill="none" 
      stroke="currentColor" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="3" 
      viewBox="0 0 24 24" 
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}


