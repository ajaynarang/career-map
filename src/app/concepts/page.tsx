"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── CONCEPT A: "The Conversation" ───
// Guided, chatbot-style, one question at a time

function ConceptA() {
  const [step, setStep] = useState(0);
  const messages = [
    { type: "bot", text: "Hey there! You're in Class 10 with PCM." },
    { type: "bot", text: "That's one of the most powerful combinations. Let me show you what's possible." },
    { type: "bot", text: "But first — what kind of person are you?" },
  ];

  const options = [
    { emoji: "🔧", label: "I love building things", sub: "Apps, robots, machines" },
    { emoji: "🔬", label: "I want to discover how things work", sub: "Research, experiments, theories" },
    { emoji: "💰", label: "I want to make smart money", sub: "Markets, strategy, business" },
    { emoji: "✈️", label: "I want adventure", sub: "Travel, uniforms, adrenaline" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center">
      <div className="max-w-lg w-full pt-20">
        <div className="space-y-4 mb-10">
          {messages.slice(0, step + 1).map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.8 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs flex-shrink-0">
                C
              </div>
              <div className="bg-zinc-900 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed max-w-sm">
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>

        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-3"
          >
            {options.map((o, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 text-left cursor-pointer transition-colors"
              >
                <div className="text-2xl mb-2">{o.emoji}</div>
                <div className="text-sm font-semibold mb-0.5">{o.label}</div>
                <div className="text-[11px] text-zinc-500">{o.sub}</div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {step < 2 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={() => setStep(step + 1)}
            className="mx-auto block px-6 py-2 rounded-full bg-blue-500 text-sm font-medium cursor-pointer hover:bg-blue-400 transition-colors"
          >
            Continue
          </motion.button>
        )}
      </div>

      <div className="fixed bottom-6 left-6 text-[10px] text-zinc-600 uppercase tracking-widest">
        Concept A: The Conversation
      </div>
    </div>
  );
}

// ─── CONCEPT B: "The Wheel" ───
// Full-screen rotating wheel of careers, cinematic reveals

function ConceptB() {
  const [selected, setSelected] = useState<number | null>(null);
  const careers = [
    { name: "Engineering", tagline: "Build the future", color: "#3B82F6", salary: "₹6-55 LPA", icon: "⚙️" },
    { name: "Science", tagline: "Discover the unknown", color: "#8B5CF6", salary: "₹5-40 LPA", icon: "🔬" },
    { name: "Finance", tagline: "Master the markets", color: "#F59E0B", salary: "₹8-80 LPA", icon: "📈" },
    { name: "Design", tagline: "Create what's next", color: "#EC4899", salary: "₹4-30 LPA", icon: "🎨" },
    { name: "Aviation", tagline: "Touch the sky", color: "#6366F1", salary: "₹12-50 LPA", icon: "✈️" },
    { name: "Defence", tagline: "Serve with honor", color: "#10B981", salary: "₹6-20 LPA", icon: "🛡️" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background gradient */}
      {selected !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 50%, ${careers[selected].color}15 0%, transparent 60%)` }}
        />
      )}

      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="text-center">
          {selected === null ? (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-zinc-600 text-xs uppercase tracking-[5px] mb-6"
              >
                Spin to explore
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-bold mb-16"
              >
                What will
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">you become?</span>
              </motion.h1>

              {/* Circular layout */}
              <div className="relative w-[400px] h-[400px] mx-auto">
                <div className="absolute inset-0 rounded-full border border-zinc-800/50" />
                <div className="absolute inset-8 rounded-full border border-zinc-800/30" />

                {careers.map((c, i) => {
                  const angle = (i / careers.length) * Math.PI * 2 - Math.PI / 2;
                  const x = Math.cos(angle) * 160;
                  const y = Math.sin(angle) * 160;

                  return (
                    <motion.button
                      key={i}
                      className="absolute cursor-pointer"
                      style={{ left: `calc(50% + ${x}px - 40px)`, top: `calc(50% + ${y}px - 40px)` }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelected(i)}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                    >
                      <div
                        className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
                        style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}
                      >
                        <span className="text-2xl">{c.icon}</span>
                        <span className="text-[9px] mt-1 font-medium" style={{ color: c.color }}>{c.name}</span>
                      </div>
                    </motion.button>
                  );
                })}

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-xs text-zinc-600">You</div>
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto px-6"
            >
              <button onClick={() => setSelected(null)} className="text-xs text-zinc-500 hover:text-white mb-8 cursor-pointer">
                ← Back
              </button>
              <div className="text-6xl mb-4">{careers[selected].icon}</div>
              <h2 className="text-5xl font-bold mb-2">{careers[selected].name}</h2>
              <p className="text-xl mb-2" style={{ color: careers[selected].color }}>{careers[selected].tagline}</p>
              <p className="text-zinc-500 mb-8">Starting salary: {careers[selected].salary}</p>

              <div className="flex gap-3 justify-center">
                <button className="px-6 py-3 rounded-full text-sm font-medium cursor-pointer" style={{ background: careers[selected].color }}>
                  Explore countries →
                </button>
                <button className="px-6 py-3 rounded-full bg-zinc-900 border border-zinc-700 text-sm cursor-pointer hover:bg-zinc-800">
                  See action plan
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 left-6 text-[10px] text-zinc-600 uppercase tracking-widest">
        Concept B: The Wheel
      </div>
    </div>
  );
}

// ─── CONCEPT C: "The Magazine" ───
// Full-screen editorial spreads, swipe between careers like stories

function ConceptC() {
  const [current, setCurrent] = useState(0);
  const careers = [
    { name: "Engineering & Tech", tagline: "The path that opens every door", color: "#3B82F6", salary: "₹6-55 LPA in India\n$80-150K in USA", bg: "from-blue-950 to-zinc-950", desc: "From building AI to launching rockets — engineering is the most flexible career path. A CS degree alone opens doors to tech, finance, consulting, startups, and research." },
    { name: "Science & Research", tagline: "For the deeply curious", color: "#8B5CF6", salary: "₹5-40 LPA in India\n$60-120K in USA", bg: "from-purple-950 to-zinc-950", desc: "Physics, chemistry, mathematics — if you want to understand the universe and push human knowledge forward, this is your calling." },
    { name: "Finance & Business", tagline: "Where numbers become power", color: "#F59E0B", salary: "₹8-80 LPA in India\n$100-200K in USA", bg: "from-amber-950 to-zinc-950", desc: "Quant trading, investment banking, actuarial science — PCM students dominate these fields because they think in numbers." },
    { name: "Aviation", tagline: "The office above the clouds", color: "#6366F1", salary: "₹12-50 LPA starting", bg: "from-indigo-950 to-zinc-950", desc: "Become a commercial pilot — one of the most prestigious careers in the world. PCM is mandatory. The sky is literally the limit." },
  ];

  const c = careers[current];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${c.bg} text-white overflow-hidden transition-all duration-700`}>
      {/* Navigation dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        {careers.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${i === current ? "bg-white h-6" : "bg-zinc-600 hover:bg-zinc-400"}`}
          />
        ))}
      </div>

      <div className="flex items-center min-h-screen px-8 md:px-16 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[4px] mb-6" style={{ color: c.color }}>
                  {String(current + 1).padStart(2, "0")} / {String(careers.length).padStart(2, "0")}
                </div>

                <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] mb-4">
                  {c.name}
                </h1>

                <p className="text-xl md:text-2xl font-light mb-6" style={{ color: c.color }}>
                  {c.tagline}
                </p>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-md">
                  {c.desc}
                </p>

                <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 inline-block">
                  <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Starting salary</div>
                  <div className="text-sm font-semibold whitespace-pre-line" style={{ color: c.color }}>{c.salary}</div>
                </div>

                <div className="flex gap-3">
                  <button className="px-8 py-3.5 rounded-full text-sm font-bold cursor-pointer transition-all hover:shadow-lg" style={{ background: c.color, boxShadow: `0 10px 30px ${c.color}30` }}>
                    Explore this path →
                  </button>
                </div>
              </div>

              {/* Right: Visual (placeholder) */}
              <div className="hidden md:flex items-center justify-center">
                <div className="w-80 h-80 rounded-3xl flex items-center justify-center text-8xl" style={{ background: `${c.color}08`, border: `1px solid ${c.color}15` }}>
                  {current === 0 ? "⚙️" : current === 1 ? "🔬" : current === 2 ? "📈" : "✈️"}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-8 left-8 right-8 flex justify-between items-center z-20">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          className={`text-sm cursor-pointer ${current === 0 ? "text-zinc-700" : "text-zinc-400 hover:text-white"}`}
          disabled={current === 0}
        >
          ← Previous
        </button>
        <div className="text-[10px] text-zinc-600 uppercase tracking-widest">
          Concept C: The Magazine
        </div>
        <button
          onClick={() => setCurrent(Math.min(careers.length - 1, current + 1))}
          className={`text-sm cursor-pointer ${current === careers.length - 1 ? "text-zinc-700" : "text-zinc-400 hover:text-white"}`}
          disabled={current === careers.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ─── Concept Chooser ───

export default function ConceptsPage() {
  const [active, setActive] = useState<"a" | "b" | "c" | null>(null);

  if (active === "a") return <ConceptA />;
  if (active === "b") return <ConceptB />;
  if (active === "c") return <ConceptC />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-3">3 Design Concepts</h1>
        <p className="text-zinc-500 mb-12">Click each to experience it. Then tell me which one speaks to you.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { id: "a" as const, title: "The Conversation", desc: "Chat-style guided experience. The app asks you questions and recommends careers based on your personality. Like talking to a real counselor.", color: "#3B82F6" },
            { id: "b" as const, title: "The Wheel", desc: "Full-screen circular layout. You're at the center, careers orbit around you. Click to zoom into cinematic reveals. Minimal, dramatic.", color: "#8B5CF6" },
            { id: "c" as const, title: "The Magazine", desc: "Editorial full-screen spreads. Swipe between careers like stories. Large typography, moody gradients, salary data front and center.", color: "#EC4899" },
          ].map((concept) => (
            <motion.button
              key={concept.id}
              whileHover={{ y: -8, boxShadow: `0 20px 40px ${concept.color}20` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(concept.id)}
              className="p-8 rounded-3xl text-left cursor-pointer relative overflow-hidden"
              style={{ background: `linear-gradient(160deg, ${concept.color}12 0%, rgba(24,24,27,1) 60%)`, border: `1.5px solid ${concept.color}25` }}
            >
              <div className="text-3xl font-bold mb-2" style={{ color: concept.color }}>{concept.id.toUpperCase()}</div>
              <h3 className="text-xl font-bold mb-2">{concept.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{concept.desc}</p>
              <div className="mt-6 text-xs font-medium" style={{ color: concept.color }}>
                Try it →
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
