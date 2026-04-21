import React from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Zap, 
  Target, 
  Gamepad2, 
  Copy, 
  CheckCircle2, 
  Crown, 
  ChevronRight, 
  MessageCircle,
  Smartphone,
  ShieldCheck,
  Star,
  Users,
  Instagram,
  Twitter,
  Youtube,
  Send
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onViewPlans: () => void;
  onPlaySound: (sound: string) => void;
  sounds: any;
}

export function LandingPage({ onStart, onViewPlans, onPlaySound, sounds }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      {/* Top Banner / Ticker */}
      <div className="bg-red-600 py-1 overflow-hidden whitespace-nowrap border-b border-black z-[110] relative">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex items-center gap-10 font-gamer text-[8px] tracking-[0.3em] uppercase text-white"
        >
          <span>🔥 NOVO MODO CACHORRÃO ATIVADO</span>
          <span>⚡ 50% DE DESCONTO NO PLANO DESENROLADO</span>
          <span>💎 SEJA ELITE HOJE</span>
          <span>🚀 DESENROLA AI v3.0 ONLINE</span>
          <span>🔥 NOVO MODO CACHORRÃO ATIVADO</span>
          <span>⚡ 50% DE DESCONTO NO PLANO DESENROLADO</span>
          <span>💎 SEJA ELITE HOJE</span>
          <span>🚀 DESENROLA AI v3.0 ONLINE</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.4)]">
              <Flame size={24} className="text-white" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tighter uppercase">
              Desenrola <span className="text-red-600">AI</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-gamer uppercase tracking-widest text-gray-400">
            <a href="#how-it-works" className="hover:text-red-500 transition-colors">Como Funciona</a>
            <a href="#modes" className="hover:text-red-500 transition-colors">Modos</a>
            <a href="#plans" className="hover:text-red-500 transition-colors">Planos</a>
          </div>

          <button 
            onClick={() => { onPlaySound(sounds.CLIQUE); onStart(); }}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-full font-gamer text-[10px] tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,0,0.3)] active:scale-95 uppercase"
          >
            Acessar Terminal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
        {/* Abstract Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-[10px] font-gamer tracking-[0.2em] uppercase mb-6"
              >
                <Zap size={12} className="fill-red-500" />
                Evolution v3.0 Online
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl font-heading font-extrabold tracking-tighter leading-[0.9] mb-8 uppercase">
                DO VÁCUO AO <br/>
                <span className="text-red-600 text-glow-red glitch" data-text="DOMÍNIO.">DOMÍNIO.</span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                O app que transforma qualquer vácuo em domínio total. Uma experiência de <span className="text-white font-bold">vídeo game</span> aplicada ao seu papo. Sinta o controle de cada conversa com nossa I.A de elite.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => { onPlaySound(sounds.ABERTURA); onStart(); }}
                  className="px-10 py-5 bg-red-600 hover:bg-red-500 text-white font-gamer text-xs tracking-widest rounded-2xl shadow-[0_8px_0_#990000] active:shadow-none active:translate-y-2 transition-all uppercase flex items-center justify-center gap-3"
                >
                  Testar Grátis ⚡
                  <ChevronRight size={16} />
                </button>
            <a 
              href="#plans"
              onClick={() => onPlaySound(sounds.CLIQUE)}
              className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-gamer text-xs tracking-widest transition-all uppercase text-center"
            >
              Ver Planos 💰
            </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full animate-pulse" />
              <div className="bg-[#0a0a0a] border border-red-600/30 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden group">
                <div className="bg-black/80 w-full h-[600px] rounded-[2.5rem] overflow-hidden flex flex-col border border-white/5">
                  {/* Fake UI Header */}
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <Flame size={20} className="text-white" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-gamer tracking-widest">DESENROLA.AI</div>
                        <div className="text-[8px] text-red-500 font-gamer animate-pulse uppercase">Modo: Dominador Ativo</div>
                      </div>
                    </div>
                  </div>
                  {/* Fake Chat */}
                  <div className="flex-1 p-6 space-y-4 font-sans uppercase">
                    <div className="flex justify-start">
                      <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%] text-[10px] border border-white/10">
                        Oi, cheguei agora... o que manda?
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-red-600 p-4 rounded-2xl rounded-tr-none max-w-[80%] text-[10px] shadow-lg">
                        Acabou de chegar e já quer mandar? <br/> Gosto dessa atitude. 😉
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%] text-[10px] border border-white/10">
                        Kkkk convencido né?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Announcements / News Section */}
      <section className="bg-black py-12 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-red-600" />
            <h2 className="text-xl font-heading font-black tracking-tighter uppercase italic">Patch Notes & News</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnnouncementCard 
              tag="Update"
              title="NOVA I.A: MODO CACHORRÃO LIBERADO 🔥"
              desc="A atualização 3.0 traz o motor mais agressivo de todos. Domine qualquer conversa com 1 clique."
            />
            <AnnouncementCard 
              tag="Promo"
              title="SEJA ELITE COM 50% DE DESCONTO 💎"
              desc="Aproveite a oferta de lançamento para o plano desenrolado. Vagas limitadas para os primeiros 500."
            />
            <AnnouncementCard 
              tag="Event"
              title="COMUNIDADE DISCORD EM BREVE 🎧"
              desc="Prepare-se para entrar no chat oficial e trocar as melhores 'calls' com a comunidade."
            />
          </div>
        </div>
      </section>

      {/* Problem Section (The Bia Moment) */}
      <section className="py-32 px-6 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 uppercase">A CENA QUE VOCÊ <span className="text-red-600">ODEIA.</span></h2>
            <p className="text-gray-500 font-gamer text-xs tracking-widest uppercase">Um vácuo desses destrói qualquer moral.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-black/40 border border-white/5 rounded-[2rem] p-8 shadow-inner overflow-hidden relative"
            >
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                <img src="https://picsum.photos/seed/bia/100/100" alt="Bia" className="w-10 h-10 rounded-full border border-red-500/20" />
                <span className="font-bold text-sm tracking-tight">Bia <span className="text-gray-600 text-[10px] font-normal ml-2">online</span></span>
              </div>

              <div className="space-y-4 pr-10">
                <div className="flex justify-end">
                  <div className="bg-[#054640] p-3 rounded-xl rounded-tr-none text-xs">oi, tudo bem?</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-[#202c33] p-3 rounded-xl rounded-tl-none text-xs">kkk</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#054640] p-3 rounded-xl rounded-tr-none text-xs">kkkk e você?</div>
                </div>
              </div>
              
              <div className="mt-8 text-right">
                <span className="text-[10px] text-gray-600 italic">visualizado às 18:50...</span>
              </div>

              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring', damping: 12 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[4px] z-20"
              >
                <div className="text-center p-6 border-2 border-red-600 rounded-3xl bg-black">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-8xl mb-4 font-heading font-black text-red-600 drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]"
                  >
                    💀
                  </motion.div>
                  <h3 className="text-5xl font-heading font-black uppercase text-red-600 italic tracking-tighter glitch" data-text="MISSÃO FALHOU">MISSÃO FALHOU</h3>
                </div>
              </motion.div>
            </motion.div>

            <div className="space-y-8">
              <div className="p-6 bg-white/5 rounded-3xl border-l-4 border-red-600">
                <p className="text-lg text-gray-300 italic">"Parei de falar porque não sabia o que responder..."</p>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Quantas vezes você perdeu o interesse dela porque o papo morreu? <br/><br/>
                O "kkk" é o cemitério de 90% das conversas. Se você não souber como desenrolar a partir daí, o jogo acaba antes de começar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section (The Desenrola Way) */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 uppercase">AGORA OLHA O QUE <span className="text-red-500 text-glow-red">MUDA.</span></h2>
            <p className="text-gray-500 font-gamer text-xs tracking-widest uppercase">Uma resposta muda o destino da sua conta.</p>
          </motion.div>

          <div className="bg-[#0a0a0a] border-2 border-red-600/30 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(255,0,0,0.1)]">
            <div className="bg-red-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="text-white fill-white" />
                <span className="font-gamer font-bold text-sm tracking-widest">MOTOR DESENROLA ATIVADO</span>
              </div>
              <div className="text-[10px] font-gamer text-white/70">LATÊNCIA: 12ms</div>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-gamer text-gray-500 uppercase tracking-widest">Input Capturado:</span>
                <div className="bg-white/5 p-4 rounded-2xl text-sm italic">
                  "kkk" (Bia)
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-gamer text-red-500 uppercase tracking-widest">Sugestão de Elite:</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-red-600/10 rounded text-[8px] font-gamer text-red-500 border border-red-500/20 uppercase">Provocador</span>
                  </div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-red-600 p-6 rounded-3xl rounded-tr-none shadow-[0_10px_30px_rgba(255,0,0,0.3)]"
                >
                  <p className="text-xl font-heading font-bold text-white leading-tight">
                    "kkk esse ‘kkk’ aí veio meio suspeito… tava ocupada ou só não quis me dar moral mesmo? 😏"
                  </p>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-gamer text-green-500 uppercase tracking-widest mb-1">Reação Provocada:</p>
                  <p className="text-xs text-gray-300">"kkkk nada a ver 😅 tava ocupada sim, mas gostei da ousadia"</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-3xl font-heading font-black italic uppercase tracking-tighter text-white">
              UMA RESPOSTA <span className="text-red-600">MUDA TUDO.</span>
            </h3>
          </div>
        </div>
      </section>

      {/* Social Hub Section */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter uppercase mb-4 italic">Siga o Fluxo dos desenrolados ⚡</h2>
            <p className="text-gray-500 font-gamer text-xs tracking-widest uppercase">Acompanhe os bastidores e os melhores packs de resposta</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <SocialLink 
              icon={<Instagram size={32} />} 
              label="Instagram" 
              handle="@desenrola.aii" 
              color="hover:text-pink-500" 
              onClick={() => onPlaySound(sounds.CLIQUE)} 
              href="https://www.instagram.com/desenrola.aii?igsh=aTVhODc5NnhkMDhj"
            />
            <SocialLink 
              icon={<Smartphone size={32} />} 
              label="TikTok" 
              handle="@desenrola.aii" 
              color="hover:text-cyan-400" 
              onClick={() => onPlaySound(sounds.CLIQUE)} 
              href="https://tiktok.com/@desenrola.aii"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 px-6 bg-[#050505] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 uppercase">COMO DOMINAR O <span className="text-red-600">GAME.</span></h2>
            <p className="text-gray-500 font-gamer text-[10px] tracking-[0.4em] uppercase">Tutorial de Gameplay v3.0</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <HowItWorksCard 
              index="01"
              icon={<Target className="text-red-600" size={32} />}
              title="COLE A MENSAGEM"
              desc="Copie aquele vácuo ou resposta curta dela e jogue no terminal."
            />
            <HowItWorksCard 
              index="02"
              icon={<Gamepad2 className="text-red-600" size={32} />}
              title="ESCOLHA O MODO"
              desc="Qual seu objetivo? Atitude, humor ou curiosidade? Você decide."
            />
            <HowItWorksCard 
              index="03"
              icon={<Zap className="text-red-600" size={32} />}
              title="GERE A RESPOSTA"
              desc="Nosso motor processa trilhões de conexões para a resposta perfeita."
            />
            <HowItWorksCard 
              index="04"
              icon={<Copy className="text-red-600" size={32} />}
              title="COPIE E ENVIE"
              desc="Só copiar, colar e assistir a mágica acontecer. GG WP."
            />
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section id="modes" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-5xl md:text-7xl font-heading font-extrabold uppercase leading-none mb-4">ESCOLHA SEU <br/><span className="text-red-600">PERSONAGEM.</span></h2>
              <p className="text-gray-500 font-gamer text-xs tracking-widest uppercase">Cada modo é uma estratégia diferente para vencer.</p>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-red-600" />
              <div className="w-12 h-1 bg-white/10" />
              <div className="w-12 h-1 bg-white/10" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModeCard 
              title="CURIOSO" 
              desc="Cria interesse imediato. Faz ela querer explicar mais." 
              icon="🧐" 
              color="from-blue-600/20"
            />
            <ModeCard 
              title="PROVOCADOR" 
              desc="Demonstra valor e atitude. Não aceita respostas curtas." 
              icon="😏" 
              color="from-red-600/20"
            />
            <ModeCard 
              title="ENGRAÇADO" 
              desc="Quebra o gelo com humor de elite. Leveza que conquista." 
              icon="😂" 
              color="from-yellow-600/20"
            />
            <ModeCard 
              title="NATURAL" 
              desc="Papo que flui como se fosse mágica. Funciona sempre." 
              icon="🧠" 
              color="from-green-600/20"
            />
          </div>
        </div>
      </section>

      {/* Why Use Section */}
      <section className="py-32 px-6 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              <BenefitCard icon={<ShieldCheck size={24}/>} title="RESPOSTAS RÁPIDAS" desc="Sem mais 30 mins pensando." />
              <BenefitCard icon={<Star size={24}/>} title="INTELIGÊNCIA REAL" desc="Processamento semântico de elite." />
              <BenefitCard icon={<Users size={24}/>} title="EM QUALQUER APP" desc="Tinder, Insta, Whats, Bumble." />
              <BenefitCard icon={<Zap size={24}/>} title="SEM VÁCUO" desc="Nunca mais fique sem assunto." />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-heading font-extrabold uppercase mb-8 leading-[0.9]">QUEM SABE RESPONDER, <span className="text-red-600">DOMINA O JOGO.</span></h2>
              <p className="text-xl text-gray-400 leading-relaxed mb-10">
                O vácuo nada mais é do que a falta de estímulo na conversa. O Desenrola AI te dá o combo de habilidades necessárias para manter o interesse no nível máximo.
              </p>
              <button 
                onClick={() => { onPlaySound(sounds.CLIQUE); onStart(); }}
                className="group flex items-center gap-4 text-white font-gamer text-xs tracking-widest uppercase"
              >
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                  <ChevronRight size={20} />
                </div>
                Começar Dominação
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-32 px-6 bg-black relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 uppercase">SELECIONE SEU <span className="text-red-600">EQUIPAMENTO.</span></h2>
            <p className="text-gray-500 font-gamer text-[10px] tracking-[0.4em] uppercase">Upgrade de performance v4.0</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Plan 1 */}
            <PlanCard 
              tier="🥉"
              name="DESENGONÇADO"
              price="GRÁTIS"
              features={["10 usos por dia", "Acesso aos modos básicos", "Comunidade Discord"]}
              btnText="Usar Free ⚡"
              onClick={onStart}
              onPlaySound={onPlaySound}
              sounds={sounds}
            />
            {/* Plan 2 */}
            <PlanCard 
              tier="🥈"
              name="DESENROLADO"
              price="R$9,90"
              features={["Respostas ilimitadas", "Melhor qualidade I.A", "Prioridade no processamento", "Dashboard premium"]}
              btnText="Ativar Elite 👑"
              isPremium
              onClick={() => window.open('https://pay.kiwify.com.br/2AGmOIQ', '_blank')}
              onPlaySound={onPlaySound}
              sounds={sounds}
            />
            {/* Plan 3 */}
            <PlanCard 
              tier="🥇"
              name="CACHORRÃO"
              price="R$15,00"
              features={["Tudo do Elite", "I.A Ultra Avançada", "Suporte 24/7 VIP", "Efeito Glow no Perfil", "🔥 Dominar o Jogo"]}
              btnText="Virar Lendário 🔥"
              className="border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.1)]"
              onClick={() => window.open('https://pay.kiwify.com.br/2AGmOIQ', '_blank')}
              onPlaySound={onPlaySound}
              sounds={sounds}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/20 via-black to-black" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl md:text-8xl font-heading font-black italic uppercase leading-[0.85] tracking-tighter mb-12">
            SEU PAPO NÃO <br/>
            PRECISA MORRER <br/>
            NO <span className="text-red-600 text-glow-red">'KKK'.</span>
          </h2>
          <button 
            onClick={() => { onPlaySound(sounds.ABERTURA); onStart(); }}
            className="px-16 py-8 bg-red-600 hover:bg-red-500 text-white font-gamer text-lg tracking-[0.2em] rounded-3xl shadow-[0_12px_0_#990000] active:shadow-none active:translate-y-3 transition-all uppercase flex items-center justify-center gap-4 mx-auto"
          >
            Começar Agora ⚡
          </button>
          
          <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-40">
            <Smartphone size={32} />
            <ShieldCheck size={32} />
            <Gamepad2 size={32} />
          </div>
        </motion.div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-gray-500 text-[10px] font-gamer tracking-widest uppercase">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
               <Flame size={18} className="text-white" />
             </div>
             <span>© 2026 DESENROLA AI — DOMINE O GAME</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HowItWorksCard({ index, icon, title, desc }: { index: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-[2.5rem] transition-all group"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="p-4 bg-black rounded-2xl border border-white/10 group-hover:border-red-600/50 transition-colors">
          {icon}
        </div>
        <span className="text-4xl font-heading font-black text-white/10 group-hover:text-red-600/20 transition-colors tracking-tighter leading-none">{index}</span>
      </div>
      <h3 className="text-xl font-heading font-bold mb-4 uppercase tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function AnnouncementCard({ tag, title, desc }: { tag: string, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/5 bg-gradient-to-br from-red-600/20 to-black flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent opacity-50" />
        <Zap size={40} className="text-red-600/20 group-hover:text-red-600/40 transition-colors" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-red-600 text-[10px] font-gamer uppercase tracking-widest rounded-lg shadow-lg">{tag}</span>
        </div>
      </div>
      <h3 className="text-lg font-heading font-bold uppercase tracking-tight mb-2 group-hover:text-red-500 transition-colors text-white">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{desc}</p>
    </motion.div>
  );
}

function SocialLink({ icon, label, handle, color, onClick, href }: { icon: React.ReactNode, label: string, handle: string, color: string, onClick?: () => void, href?: string }) {
  return (
    <motion.a
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      className={`flex flex-col items-center gap-4 transition-all ${color}`}
    >
      <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center shadow-lg group">
        <div className="transform group-hover:rotate-12 transition-transform">
          {icon}
        </div>
      </div>
      <div className="text-center text-white">
        <div className="text-[10px] font-gamer text-gray-500 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-sm font-bold tracking-tight">{handle}</div>
      </div>
    </motion.a>
  );
}

function ModeCard({ title, desc, icon, color }: { title: string, desc: string, icon: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className={`p-10 rounded-[3rem] bg-gradient-to-br ${color} to-transparent border border-white/5 hover:border-red-600/40 transition-all cursor-default group relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 p-8 text-5xl opacity-40 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 scale-150 group-hover:scale-100 duration-500">
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl font-heading font-black mb-4 uppercase tracking-tighter text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="text-[10px] font-gamer text-gray-500 uppercase tracking-widest">Atributo Especial Ativo</span>
        </div>
      </div>
    </motion.div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] transition-all">
      <div className="text-red-600 mb-4">{icon}</div>
      <h4 className="text-xs font-gamer uppercase tracking-widest mb-2 text-white">{title}</h4>
      <p className="text-[10px] text-gray-500 leading-relaxed uppercase">{desc}</p>
    </div>
  );
}

function PlanCard({ tier, name, price, features, btnText, isPremium, className, onClick, onPlaySound, sounds }: any) {
  return (
    <motion.div 
      whileHover={{ y: -15 }}
      className={`flex flex-col p-10 bg-[#0a0a0a] border border-white/10 rounded-[3rem] relative transition-all group ${isPremium ? 'border-red-600/50 scale-105 z-20 shadow-[0_0_60px_rgba(255,0,0,0.15)] bg-gradient-to-b from-red-600/10 to-black' : 'hover:border-white/20'} ${className}`}
    >
      {isPremium && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white font-gamer text-[8px] px-4 py-1.5 rounded-full tracking-[0.3em] uppercase w-max">
          🎯 Recomendado
        </div>
      )}
      
      <div className="text-center mb-10">
        <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500 drop-shadow-md">{tier}</div>
        <h3 className="text-2xl font-heading font-black tracking-tighter mb-2 uppercase">{name}</h3>
        <div className="text-4xl font-heading font-black text-red-600 text-glow-red italic tracking-widest mb-2">{price}</div>
        <p className="text-[10px] font-gamer text-gray-500 uppercase tracking-widest">Licença Vitalícia v1.0</p>
      </div>

      <div className="flex-1 space-y-4 mb-10">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2 size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300 font-medium leading-tight">{f}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => { onPlaySound(isPremium ? sounds.SUCESSO : sounds.CLIQUE); onClick(); }}
        className={`w-full py-5 rounded-2xl font-gamer text-[10px] tracking-widest uppercase transition-all ${isPremium ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_6px_0_#990000] active:shadow-none active:translate-y-1' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
      >
        {btnText}
      </button>
    </motion.div>
  );
}
