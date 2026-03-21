"use client";

import { useState, useRef, useEffect } from "react";
import { CAREER_DATA } from "@/data";
import { THEMES } from "@/lib/themes";
import type { Exam, University, ThemeColors } from "@/lib/types";
import { SideSheet } from "@/components/SideSheet";
import { ExamSheet } from "@/components/ExamSheet";
import { UniSheet } from "@/components/UniSheet";
import { InfoCard, Section, TextBlock } from "@/components/ui";

export default function Home() {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
  const [sheetData, setSheetData] = useState<Exam | University | null>(null);
  const [sheetType, setSheetType] = useState<"exam" | "uni" | null>(null);
  const [showActionPlan, setShowActionPlan] = useState(false);

  const careerRef = useRef<HTMLDivElement>(null);
  const geoRef = useRef<HTMLDivElement>(null);

  const career = selectedCareer ? CAREER_DATA[selectedCareer] : null;
  const theme = career ? THEMES[career.theme] : null;
  const geoData = career && selectedGeo ? career.paths[selectedGeo] : null;

  const openSheet = (data: Exam | University, type: "exam" | "uni") => {
    setSheetData(data);
    setSheetType(type);
  };

  const closeSheet = () => {
    setSheetData(null);
    setSheetType(null);
  };

  useEffect(() => {
    if (selectedCareer && careerRef.current) {
      setTimeout(() => careerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    }
  }, [selectedCareer]);

  useEffect(() => {
    if (selectedGeo && geoRef.current) {
      setTimeout(() => geoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    }
  }, [selectedGeo]);

  const careers = Object.values(CAREER_DATA);

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="text-center pt-11 pb-4 px-5">
        <div className="text-[10px] font-mono text-gray-600 tracking-[3px] uppercase mb-2.5">
          Career guidance system
        </div>
        <h1 className="text-[clamp(26px,5vw,42px)] font-bold text-white leading-tight mb-2.5">
          PCM Career Map
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          Complete guide from Class 12 to career. Click a path → exams → universities → action plan.
        </p>
      </div>

      {/* ── Career Circles (Mind Map) ── */}
      <div className="flex flex-wrap justify-center gap-3.5 py-7 px-4 max-w-3xl mx-auto">
        {careers.map((c) => {
          const t = THEMES[c.theme];
          const active = selectedCareer === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCareer(active ? null : c.id);
                setSelectedGeo(null);
                setShowActionPlan(false);
              }}
              className="w-[110px] h-[110px] rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 gap-1 border-2"
              style={{
                borderColor: active ? t.accent : t.ring,
                background: active ? t.accent + "22" : t.bg,
                color: active ? t.accent : t.dim,
                transform: active ? "scale(1.12)" : "scale(1)",
                boxShadow: active ? `0 0 28px ${t.accent}30` : "none",
              }}
            >
              <span className="text-2xl">{c.icon}</span>
              <span className="text-[11px] font-semibold text-center leading-tight px-1.5">
                {c.title.split("/")[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Career Detail Panel ── */}
      {career && theme && (
        <div ref={careerRef} className="max-w-[880px] mx-auto px-4 pb-10 animate-fade-up">
          {/* Career Header Card */}
          <div
            className="rounded-xl p-6 mb-5"
            style={{ background: theme.card, border: `1px solid ${theme.accent}18` }}
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="text-3xl">{career.icon}</span>
              <h2 className="text-[22px] font-bold text-white">{career.title}</h2>
            </div>
            <p className="text-gray-500 text-[13px] leading-relaxed mb-2.5">{career.desc}</p>
            <div
              className="text-xs leading-relaxed p-2.5 rounded-lg"
              style={{
                color: theme.text,
                background: theme.accent + "0d",
                border: `1px solid ${theme.accent}18`,
              }}
            >
              💡 {career.whyChoose}
            </div>
          </div>

          {/* Geography Selection Pills */}
          <div className="mb-5">
            <div className="text-[11px] text-gray-600 mb-2 font-semibold uppercase tracking-wider">
              Choose region
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(career.paths).map(([key, geo]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedGeo(selectedGeo === key ? null : key);
                    setShowActionPlan(false);
                  }}
                  className="px-4 py-2 text-[13px] rounded-full cursor-pointer font-medium transition-all duration-200 border-[1.5px]"
                  style={{
                    borderColor: selectedGeo === key ? theme.accent : "rgba(255,255,255,0.08)",
                    background: selectedGeo === key ? theme.accent + "1a" : "rgba(255,255,255,0.02)",
                    color: selectedGeo === key ? theme.accent : "#888",
                  }}
                >
                  {geo.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowActionPlan(!showActionPlan);
                  setSelectedGeo(null);
                }}
                className="px-4 py-2 text-[13px] rounded-full cursor-pointer font-medium transition-all duration-200 border-[1.5px]"
                style={{
                  borderColor: showActionPlan ? theme.accent : "rgba(255,255,255,0.08)",
                  background: showActionPlan ? theme.accent + "1a" : "rgba(255,255,255,0.02)",
                  color: showActionPlan ? theme.accent : "#888",
                }}
              >
                📋 Action plan
              </button>
            </div>
          </div>

          {/* Geo Content: Exams + Universities */}
          {geoData && (
            <div ref={geoRef} className="animate-fade-up">
              <p className="text-gray-500 text-xs leading-relaxed mb-5 p-3 bg-white/[0.02] rounded-lg">
                {geoData.overview}
              </p>

              {/* Exams */}
              <Section title="Entrance exams" color={theme.text}>
                <div className="flex flex-col gap-2">
                  {geoData.exams.map((exam, i) => (
                    <button
                      key={i}
                      onClick={() => openSheet(exam, "exam")}
                      className="text-left p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl cursor-pointer transition-all duration-200 flex justify-between items-center hover:border-white/10 group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white mb-0.5">{exam.name}</div>
                        <div className="text-[11px] text-gray-500">📅 {exam.when}</div>
                      </div>
                      <span className="text-base transition-transform group-hover:translate-x-1" style={{ color: theme.accent }}>
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </Section>

              {/* Universities */}
              {geoData.universities && geoData.universities.length > 0 && (
                <Section title={`Universities & colleges (${geoData.universities.length})`} color={theme.text}>
                  <div className="flex flex-col gap-2">
                    {geoData.universities.map((uni, i) => (
                      <button
                        key={i}
                        onClick={() => openSheet(uni, "uni")}
                        className="text-left p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl cursor-pointer transition-all duration-200 hover:border-white/10 group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white mb-0.5">{uni.name}</div>
                            <div className="text-[11px] text-gray-500 mb-1.5">
                              📍 {uni.location} · {uni.ranking}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{ background: theme.accent + "15", color: theme.text }}
                              >
                                💰 {uni.fees.split("=")[0].trim().substring(0, 35)}
                              </span>
                              {uni.pkg && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-500">
                                  📊 {uni.pkg.split("|")[0].trim().substring(0, 35)}
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className="text-base ml-2.5 flex-shrink-0 transition-transform group-hover:translate-x-1"
                            style={{ color: theme.accent }}
                          >
                            →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}

          {/* Action Plan */}
          {showActionPlan && career.actionPlan && (
            <div className="animate-fade-up">
              <h3 className="text-base font-bold text-white mb-4">📋 {career.actionPlan.title}</h3>
              {career.actionPlan.phases.map((phase, pi) => (
                <div
                  key={pi}
                  className="mb-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl"
                >
                  <h4 className="text-[13px] font-semibold mb-2.5" style={{ color: theme.accent }}>
                    {phase.phase}
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {phase.items.map((item, ii) => (
                      <div key={ii} className="flex gap-2 items-start">
                        <span className="text-[10px] mt-1.5 flex-shrink-0" style={{ color: theme.accent }}>
                          ●
                        </span>
                        <span className="text-xs text-gray-400 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Side Sheet: Exam Details ── */}
      <SideSheet open={sheetType === "exam" && !!sheetData} onClose={closeSheet}>
        {sheetData && sheetType === "exam" && theme && (
          <ExamSheet exam={sheetData as Exam} theme={theme} />
        )}
      </SideSheet>

      {/* ── Side Sheet: University Details ── */}
      <SideSheet open={sheetType === "uni" && !!sheetData} onClose={closeSheet}>
        {sheetData && sheetType === "uni" && theme && (
          <UniSheet uni={sheetData as University} theme={theme} />
        )}
      </SideSheet>

      {/* ── Footer ── */}
      <div className="text-center py-8 px-5 border-t border-white/[0.04]">
        <p className="text-[10px] text-gray-600">
          PCM Career Map · India · USA · Germany
        </p>
        <p className="text-[10px] text-gray-700 mt-1">
          Data is indicative. Always verify from official sources before making decisions.
        </p>
      </div>
    </div>
  );
}
