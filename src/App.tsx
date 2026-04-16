import { useState } from 'react';
import './App.css';
import BsuLogo from './assets/bsu-logo.png';

interface RDANAFormData {
  inspector: string;
  inspectionDate: string;
  time: string;
  agencyCampus: string;
  areasInspected: string;
  buildingName: string;
  address: string;
  buildingMarshal: string;
  storyAboveGround: string;
  storyBelowGround: string;
  typeOfConstruction: string[];
  otherConstruction: string;
  primaryOccupancy: string[];
  otherOccupancy: string;
  evaluation: Record<string, string>;
  evaluationOther: string;
  damagePercentage: number;
  comments: string;
  posting: string;
  restrictions: {
    doNotEnter: boolean;
    doNotEnterText: string;
    briefEntry: boolean;
    briefEntryText: string;
    doNotUseFlooded: boolean;
    otherRestrictions: boolean;
    otherRestrictionsText: string;
  };
  furtherActions: {
    barricadesNeeded: boolean;
    barricadesText: string;
    detailedEval: boolean;
    evalStructural: boolean;
    evalGeotechnical: boolean;
    evalOther: boolean;
    otherRecommendations: boolean;
    otherRecommendationsText: string;
    commentsFurther: string;
  };
}

const defaultForm: RDANAFormData = {
  inspector: '',
  inspectionDate: '',
  time: '',
  agencyCampus: '',
  areasInspected: '',
  buildingName: '',
  address: '',
  buildingMarshal: '',
  storyAboveGround: '',
  storyBelowGround: '',
  typeOfConstruction: [],
  otherConstruction: '',
  primaryOccupancy: [],
  otherOccupancy: '',
  evaluation: {
    collapse: 'N/A',
    leaning: 'N/A',
    primaryMembers: 'N/A',
    fallingHazards: 'N/A',
    groundMovement: 'N/A',
    submergedFixtures: 'N/A',
    proximityRisks: 'N/A',
  },
  evaluationOther: '',
  damagePercentage: 0,
  comments: '',
  posting: '',
  restrictions: {
    doNotEnter: false, doNotEnterText: '',
    briefEntry: false, briefEntryText: '',
    doNotUseFlooded: false,
    otherRestrictions: false, otherRestrictionsText: '',
  },
  furtherActions: {
    barricadesNeeded: false, barricadesText: '',
    detailedEval: false, evalStructural: false, evalGeotechnical: false, evalOther: false,
    otherRecommendations: false, otherRecommendationsText: '',
    commentsFurther: '',
  },
};

const CONSTRUCTION_TYPES = ['Wood Frame', 'Steel Frame', 'Concrete Frame', 'Masonry'];
const OCCUPANCY_TYPES = [
  'Single Family Dwelling', 'Multi-residential', 'Emergency Services',
  'Industrial', 'Offices', 'Commercial', 'School', 'Government'
];

const EVAL_CONDITIONS = [
  { id: 'collapse', label: 'Structural Collapse', icon: '🏚️' },
  { id: 'leaning', label: 'Building or Story Leaning', icon: '📐' },
  { id: 'primaryMembers', label: 'Primary Member Damage', icon: '🔩' },
  { id: 'fallingHazards', label: 'Falling Hazards', icon: '⚠️' },
  { id: 'groundMovement', label: 'Ground Movement', icon: '🌍' },
  { id: 'submergedFixtures', label: 'Submerged Fixtures', icon: '💧' },
];

const SEVERITY_LEVELS = ["N/A", "MINOR", "MODERATE", "SEVERE"];

const STATUS_CONFIG: Record<string, any> = {
  Green: { color: "#059669", label: "INSPECTED", sub: "Safe to Occupy", emoji: "✅", bgLight: "#ecfdf5" },
  Yellow: { color: "#d97706", label: "RESTRICTED", sub: "Use with Caution", emoji: "⚠️", bgLight: "#fffbeb" },
  Red: { color: "#dc2626", label: "UNSAFE", sub: "Do Not Enter", emoji: "🚫", bgLight: "#fef2f2" },
};

export default function App() {
  const [form, setForm] = useState<RDANAFormData>(defaultForm);
  const [view, setView] = useState<'form' | 'report'>('form');

  const update = (key: keyof RDANAFormData, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const updateNested = (section: 'restrictions' | 'furtherActions', key: string, value: any) => 
    setForm(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  const toggleArray = (field: 'typeOfConstruction' | 'primaryOccupancy', item: string) => {
    setForm(prev => {
      const arr = prev[field];
      return arr.includes(item) ? { ...prev, [field]: arr.filter(i => i !== item) } : { ...prev, [field]: [...arr, item] };
    });
  };

  const getSeverityColor = (level: string) => {
    if (level === 'SEVERE') return 'bg-red-500 border-red-500 text-white';
    if (level === 'MODERATE') return 'bg-yellow-500 border-yellow-500 text-white';
    if (level === 'MINOR') return 'bg-blue-500 border-blue-500 text-white';
    return 'bg-slate-200 border-slate-300 text-slate-700';
  };

  // ----------------------------------------------------
  //               FORM VIEW
  // ----------------------------------------------------
  const renderForm = () => (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-32 animate-in fade-in duration-500">
      <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100">
        
        <div className="bg-slate-900 text-white flex items-center justify-center gap-4 py-6 px-6">
          <img src={BsuLogo} alt="BSU Logo" className="h-10 sm:h-12 w-auto object-contain" />
          <h1 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-wide">Rapid Damage Assessment Form</h1>
        </div>

        <div className="p-6 sm:p-10 space-y-12">
          
          {/* INSPECTION */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 uppercase tracking-wider">Inspection Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Inspector</label>
                <input type="text" className="w-full border-b border-slate-300 focus:border-red-500 px-2 py-1 outline-none transition-colors" 
                       value={form.inspector} onChange={e => update('inspector', e.target.value)} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Inspection date</label>
                  <input type="date" className="w-full border-b border-slate-300 focus:border-red-500 px-2 py-1 outline-none transition-colors text-sm" 
                         value={form.inspectionDate} onChange={e => update('inspectionDate', e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Time</label>
                  <input type="time" className="w-full border-b border-slate-300 focus:border-red-500 px-2 py-1 outline-none transition-colors text-sm" 
                         value={form.time} onChange={e => update('time', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Agency/Campus</label>
                <input type="text" className="w-full border-b border-slate-300 focus:border-red-500 px-2 py-1 outline-none transition-colors" 
                       value={form.agencyCampus} onChange={e => update('agencyCampus', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Areas inspected</label>
                <div className="flex gap-6">
                  {['Exterior Only', 'Exterior and interior'].map(area => (
                    <label key={area} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors ${form.areasInspected === area ? 'bg-red-500 border-red-500' : 'border-slate-400 group-hover:border-slate-600'}`}>
                        {form.areasInspected === area && <div className="w-2 h-2 bg-white" />}
                      </div>
                      <input type="radio" className="hidden" checked={form.areasInspected === area} onChange={() => update('areasInspected', area)} />
                      <span className="text-sm font-medium text-slate-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* BUILDING DESCRIPTION */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 uppercase tracking-wider">Building Description</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Building Name</label>
                  <input type="text" className="w-full border-b border-slate-300 focus:border-red-500 px-2 py-1 outline-none" value={form.buildingName} onChange={e => update('buildingName', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                  <input type="text" className="w-full border-b border-slate-300 focus:border-red-500 px-2 py-1 outline-none" value={form.address} onChange={e => update('address', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Building Marshal</label>
                  <input type="text" className="w-full border-b border-slate-300 focus:border-red-500 px-2 py-1 outline-none" value={form.buildingMarshal} onChange={e => update('buildingMarshal', e.target.value)} />
                </div>
                <div className="flex gap-6 items-center">
                  <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">Number of story</span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-slate-600">above grd:</span>
                    <input type="number" className="w-16 border-b border-slate-300 focus:border-red-500 text-center px-1 py-1 outline-none" value={form.storyAboveGround} onChange={e => update('storyAboveGround', e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-slate-600">below grd:</span>
                    <input type="number" className="w-16 border-b border-slate-300 focus:border-red-500 text-center px-1 py-1 outline-none" value={form.storyBelowGround} onChange={e => update('storyBelowGround', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3 text-center lg:text-left">Type of Construction</label>
                  <div className="grid grid-cols-2 gap-3">
                    {CONSTRUCTION_TYPES.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors ${form.typeOfConstruction.includes(type) ? 'bg-red-500 border-red-500' : 'border-slate-400 group-hover:border-slate-600 bg-white'}`}>
                          {form.typeOfConstruction.includes(type) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input type="checkbox" className="hidden" checked={form.typeOfConstruction.includes(type)} onChange={() => toggleArray('typeOfConstruction', type)} />
                        <span className="text-sm text-slate-700">{type}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                        <label className="flex items-center gap-2 cursor-pointer group shrink-0">
                          <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors ${form.otherConstruction ? 'bg-red-500 border-red-500' : 'border-slate-400 group-hover:border-slate-600 bg-white'}`}>
                            {form.otherConstruction !== '' && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className="text-sm text-slate-700">Other:</span>
                        </label>
                        <input type="text" className="border-b border-slate-300 focus:border-red-500 px-1 py-0.5 outline-none flex-1 text-sm text-slate-700 bg-transparent" value={form.otherConstruction} onChange={e => update('otherConstruction', e.target.value)} />
                     </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3 text-center lg:text-left">Primary Occupancy</label>
                  <div className="grid grid-cols-2 gap-3">
                    {OCCUPANCY_TYPES.map(occ => (
                      <label key={occ} className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center shrink-0 ${form.primaryOccupancy.includes(occ) ? 'bg-red-500 border-red-500' : 'border-slate-400 group-hover:border-slate-600'}`}>
                          {form.primaryOccupancy.includes(occ) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input type="checkbox" className="hidden" checked={form.primaryOccupancy.includes(occ)} onChange={() => toggleArray('primaryOccupancy', occ)} />
                        <span className="text-xs sm:text-sm text-slate-700">{occ}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-2 col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer group shrink-0">
                          <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors ${form.otherOccupancy ? 'bg-red-500 border-red-500' : 'border-slate-400 group-hover:border-slate-600 bg-white'}`}>
                            {form.otherOccupancy !== '' && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className="text-sm text-slate-700">Other:</span>
                        </label>
                        <input type="text" className="border-b border-slate-300 focus:border-red-500 px-1 py-0.5 outline-none flex-1 text-sm bg-transparent" value={form.otherOccupancy} onChange={e => update('otherOccupancy', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* EVALUATION (DARK DESIGN FROM REF IMAGE) */}
          <section className="bg-slate-900 -mx-6 sm:-mx-10 px-6 sm:px-10 py-10 my-8 shadow-inner">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-white flex items-center gap-3">
                 <span className="text-xl">🔍</span> Damage Evaluation Matrix
               </h2>
               <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                 <span className="text-sm font-semibold text-white">Estimated Damage: <span className="text-emerald-400 font-bold">{form.damagePercentage}%</span></span>
               </div>
            </div>
            
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr>
                    <th className="text-slate-400 text-xs font-bold uppercase tracking-widest pb-4 w-2/5">Condition</th>
                    {SEVERITY_LEVELS.map(level => (
                      <th key={level} className={`text-center text-xs font-bold uppercase tracking-widest pb-4 w-1/5 ${
                        level === 'SEVERE' ? 'text-red-400' : level === 'MODERATE' ? 'text-amber-400' : level === 'MINOR' ? 'text-blue-400' : 'text-slate-400'
                      }`}>{level}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="space-y-3">
                  {[...EVAL_CONDITIONS, {id: 'proximityRisks', label: 'Proximity risks / other', icon: '🚧'}].map(cond => (
                    <tr key={cond.id} className="bg-slate-800/60 hover:bg-slate-800 rounded-2xl border border-white/5 transition-colors">
                      <td className="py-4 px-5 rounded-l-2xl">
                         <div className="flex items-center gap-3">
                           <span className="text-lg opacity-80">{cond.icon}</span>
                           <span className="text-sm font-semibold text-slate-200">{cond.label}</span>
                         </div>
                         {cond.id === 'proximityRisks' && (
                           <input type="text" className="mt-2 w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
                                  placeholder="Specify risk..." value={form.evaluationOther} onChange={e => update('evaluationOther', e.target.value)} />
                         )}
                      </td>
                      {SEVERITY_LEVELS.map(level => {
                        const isSelected = form.evaluation[cond.id] === level;
                        return (
                          <td key={level} className={`text-center py-4 ${level === 'SEVERE' ? 'rounded-r-2xl' : ''}`}>
                            <label className="inline-flex cursor-pointer transition-transform hover:scale-110 active:scale-95">
                              <div className={`w-12 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-200 ${
                                isSelected 
                                  ? (level === 'SEVERE' ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 
                                     level === 'MODERATE' ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 
                                     level === 'MINOR' ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 
                                     'bg-slate-200 border-slate-200 shadow-[0_0_15px_rgba(226,232,240,0.4)]')
                                  : 'bg-transparent border-slate-700 hover:border-slate-500'
                              }`}>
                                <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                                  isSelected ? (level === 'N/A' ? 'bg-slate-500' : level === 'SEVERE' ? 'bg-red-400' : level === 'MODERATE' ? 'bg-amber-400' : 'bg-blue-400') : 'opacity-10 bg-slate-400'
                                }`} />
                              </div>
                              <input type="radio" className="hidden" 
                                     checked={isSelected} 
                                     onChange={() => setForm(p => ({ ...p, evaluation: { ...p.evaluation, [cond.id]: level } }))} />
                            </label>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10">
               <div className="flex justify-between items-center mb-6">
                 <span className="text-sm font-semibold text-slate-300">Estimated % of Damage</span>
                 <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{form.damagePercentage}%</span>
               </div>
               <div className="relative pt-1">
                  <input type="range" min="0" max="100" value={form.damagePercentage} onChange={e => update('damagePercentage', Number(e.target.value))}
                         className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer outline-none slider-thumb"
                         style={{ background: `linear-gradient(to right, #3b82f6 ${form.damagePercentage}%, #334155 ${form.damagePercentage}%)` }} />
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-4 px-1 uppercase tracking-wider">
                    <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                  </div>
               </div>
            </div>
            
          </section>

          {/* POSTING & RESTRICTIONS */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 uppercase tracking-wider">Posting & Restrictions</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {[
                { id: 'Green', label: 'INSPECTED', sub: '(Green placard)', active: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                { id: 'Yellow', label: 'RESTRICTED', sub: '(Yellow placard)', active: 'border-amber-500 bg-amber-50 text-amber-800' },
                { id: 'Red', label: 'UNSAFE', sub: '(Red placard)', active: 'border-red-500 bg-red-50 text-red-800' },
              ].map(placard => (
                <label key={placard.id} className={`flex items-center gap-3 cursor-pointer group flex-1 justify-center py-3 px-4 rounded-xl border-2 transition-all ${form.posting === placard.id ? placard.active : 'border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'}`}>
                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${form.posting === placard.id ? 'border-current bg-current' : 'border-slate-400 group-hover:border-slate-600 bg-white'}`}>
                    {form.posting === placard.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <input type="radio" className="hidden" checked={form.posting === placard.id} onChange={() => update('posting', placard.id)} />
                  <div className="flex flex-col items-center">
                    <span className="font-black tracking-wide leading-tight">{placard.label}</span>
                    <span className="text-[10px] opacity-80 font-semibold">{placard.sub}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="space-y-4">
              {/* Do not enter */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 px-2">
                <label className="flex items-center gap-3 cursor-pointer group shrink-0 mb-1 sm:mb-0">
                  <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${form.restrictions.doNotEnter ? 'border-red-500' : 'border-slate-400 bg-white'}`}>
                    {form.restrictions.doNotEnter && <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={form.restrictions.doNotEnter} onChange={e => updateNested('restrictions', 'doNotEnter', e.target.checked)} />
                  <span className="text-sm font-medium text-slate-700">Do not enter following areas:</span>
                </label>
                <input type="text" className="flex-1 bg-transparent border-b border-slate-300 focus:border-red-500 outline-none px-2 py-1 text-sm" value={form.restrictions.doNotEnterText} onChange={e => updateNested('restrictions', 'doNotEnterText', e.target.value)} />
              </div>
              {/* Brief entry */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 px-2">
                <label className="flex items-center gap-3 cursor-pointer group shrink-0 mb-1 sm:mb-0">
                  <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${form.restrictions.briefEntry ? 'border-red-500' : 'border-slate-400 bg-white'}`}>
                    {form.restrictions.briefEntry && <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={form.restrictions.briefEntry} onChange={e => updateNested('restrictions', 'briefEntry', e.target.checked)} />
                  <span className="text-sm font-medium text-slate-700">Brief entry allowed for contents:</span>
                </label>
                <input type="text" className="flex-1 bg-transparent border-b border-slate-300 focus:border-red-500 outline-none px-2 py-1 text-sm" value={form.restrictions.briefEntryText} onChange={e => updateNested('restrictions', 'briefEntryText', e.target.value)} />
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-3 items-start">
                <span className="text-sm font-bold text-slate-700 mt-2 shrink-0">General Comments:</span>
                <textarea className="w-full border border-slate-300 focus:border-red-500 rounded-xl outline-none resize-none px-4 py-3 text-sm leading-relaxed bg-white shadow-sm" rows={3}
                  value={form.comments} onChange={e => update('comments', e.target.value)} placeholder="Enter general comments here..." />
            </div>
          </section>

        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex gap-4 print:hidden z-50">
          <button onClick={() => setView('report')} className="bg-slate-900 text-white shadow-xl shadow-slate-900/30 hover:shadow-2xl hover:shadow-slate-900/40 px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all uppercase hover:-translate-y-1 flex items-center gap-2 border border-slate-700">
            Preview Official Report 📝
          </button>
      </div>
    </div>
  );

  // ----------------------------------------------------
  //               REPORT VIEW (IMAGE 2)
  // ----------------------------------------------------
  const renderReport = () => {
    const config = STATUS_CONFIG[form.posting] || STATUS_CONFIG.Green;
    
    return (
      <div className="min-h-screen bg-slate-900 px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
           <button onClick={() => setView('form')} className="px-5 py-2.5 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
             <span className="text-xl">←</span> Back to Form
           </button>
           <button onClick={() => window.print()} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/40 transition-all flex items-center gap-2">
             Print / Save PDF
           </button>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:bg-white">
          
          {/* Header */}
          <div className="bg-[#1e293b] px-10 py-12 relative flex justify-between items-start print:bg-white print:border-b-2 print:border-black">
             <img src={BsuLogo} alt="BSU Logo" className="absolute left-10 top-12 h-16 w-auto object-contain print:h-14" />
             <div className="pl-[5.5rem] relative z-10">
               <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 print:text-black">Official Document</div>
               <h1 className="text-3xl font-black text-white tracking-tight mb-1 print:text-black">Rapid Damage Assessment</h1>
               <h2 className="text-sm font-medium text-slate-400 tracking-wide print:text-slate-600">Building Inspection Report</h2>
             </div>
             {form.posting && (
               <div className={`px-6 py-3 rounded-2xl ${
                 form.posting === 'Red' ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 
                 form.posting === 'Yellow' ? 'bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]' : 
                 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
               } print:border-2 print:border-black print:bg-transparent print:shadow-none`}>
                 <span className="text-white font-black text-xl flex items-center gap-2 print:text-black">
                   {config.emoji} {config.label}
                 </span>
               </div>
             )}

             <div className="absolute bottom-0 left-0 w-full px-10 pb-6 flex gap-12 mt-12 pt-6 border-t border-white/10 print:border-black/20 print:static print:mt-10">
                <div><div className="text-[9px] font-black tracking-widest text-slate-500 uppercase pb-1 print:text-slate-500">Date</div><div className="text-sm font-bold text-white print:text-black">{form.inspectionDate || '—'}</div></div>
                <div><div className="text-[9px] font-black tracking-widest text-slate-500 uppercase pb-1 print:text-slate-500">Time</div><div className="text-sm font-bold text-white print:text-black">{form.time || '—'}</div></div>
                <div><div className="text-[9px] font-black tracking-widest text-slate-500 uppercase pb-1 print:text-slate-500">Inspector</div><div className="text-sm font-bold text-white print:text-black">{form.inspector || '—'}</div></div>
                <div><div className="text-[9px] font-black tracking-widest text-slate-500 uppercase pb-1 print:text-slate-500">Agency</div><div className="text-sm font-bold text-white print:text-black">{form.agencyCampus || '—'}</div></div>
             </div>
          </div>

          <div className="p-10 space-y-12">
            
            {/* Section 1 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-blue-500 opacity-70">📄</span>
                <h3 className="text-xs font-black text-slate-500 tracking-widest uppercase">Section 1 — Building Description</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Building Name', value: form.buildingName },
                   { label: 'Primary Occupancy', value: form.primaryOccupancy.join(', ') || form.otherOccupancy },
                   { label: 'Construction Type', value: form.typeOfConstruction.join(', ') || form.otherConstruction },
                   { label: 'Number of Stories', value: form.storyAboveGround },
                   { label: 'Inspection Type', value: form.areasInspected },
                   { label: 'Estimated Damage', value: `${form.damagePercentage}%` },
                 ].map(item => (
                   <div key={item.label} className="border border-slate-200 rounded-2xl p-5 break-inside-avoid">
                     <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">{item.label}</div>
                     <div className="text-base font-bold text-slate-800">{item.value || '—'}</div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Section 2 */}
            <div className="break-inside-avoid">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-blue-500 opacity-70">🔍</span>
                <h3 className="text-xs font-black text-slate-500 tracking-widest uppercase">Section 2 — Evaluation Matrix</h3>
              </div>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left font-black text-slate-500 text-[10px] tracking-widest uppercase py-4 px-6">Condition</th>
                      <th className="text-center font-black text-slate-500 text-[10px] tracking-widest uppercase py-4 px-6">Severity</th>
                      <th className="text-center font-black text-slate-500 text-[10px] tracking-widest uppercase py-4 px-6">Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {EVAL_CONDITIONS.map(cond => {
                      const level = form.evaluation[cond.id];
                      return (
                        <tr key={cond.id} className="bg-white">
                          <td className="py-4 px-6 font-bold text-slate-800 border-r border-slate-100 flex items-center gap-3 w-1/2">
                            <span>{cond.icon}</span> {cond.label}
                          </td>
                          <td className="py-4 px-6 w-1/3">
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full transition-all ${
                                level === 'SEVERE' ? 'w-full bg-red-500' : 
                                level === 'MODERATE' ? 'w-2/3 bg-amber-500' : 
                                level === 'MINOR' ? 'w-1/3 bg-blue-500' : 'w-0'
                              }`} />
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center border-l border-slate-100">
                            <span className={`px-3 py-1 text-xs font-black tracking-wide rounded-md border ${getSeverityColor(level)}`}>
                              {level}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3 & 4 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b-2 border-slate-200 break-inside-avoid">
              
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-red-500 opacity-70">🚦</span>
                  <h3 className="text-xs font-black text-slate-500 tracking-widest uppercase">Section 3 — Verdict</h3>
                </div>
                <div className={`rounded-3xl p-8 text-center h-full flex flex-col justify-center shadow-lg border-2 ${
                  form.posting === 'Red' ? 'bg-red-500 border-red-500 text-white shadow-red-500/30' : 
                  form.posting === 'Yellow' ? 'bg-amber-500 border-amber-500 text-white shadow-amber-500/30' : 
                  'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/30'
                } print:shadow-none print:border-black print:text-black print:bg-transparent`}>
                  <div className="text-6xl mb-4 print:hidden">{config.emoji}</div>
                  <h2 className="text-4xl font-black mb-2 tracking-tight">{config.label}</h2>
                  <p className="text-sm font-bold opacity-90 uppercase tracking-widest">{config.sub}</p>
                  <div className="mt-8 pt-6 border-t border-current/20 text-2xl font-black text-white print:text-black">
                     {form.damagePercentage}% Damage
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-slate-500 opacity-70">📝</span>
                  <h3 className="text-xs font-black text-slate-500 tracking-widest uppercase">Section 4 — Assessment Notes</h3>
                </div>
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
                    <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Comments & Observations</div>
                    <div className="text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">{form.comments || 'No comments written.'}</div>
                  </div>
                  <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
                    <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Detailed Restrictions / Actions</div>
                    <ul className="text-sm font-medium text-slate-700 space-y-2">
                       {form.restrictions.doNotEnter && <li>• Do not enter: <span className="font-bold">{form.restrictions.doNotEnterText}</span></li>}
                       {form.restrictions.briefEntry && <li>• Brief entry allowed for contents: <span className="font-bold">{form.restrictions.briefEntryText}</span></li>}
                       {(!form.restrictions.doNotEnter && !form.restrictions.briefEntry) && <li className="text-slate-500 italic">No specific restrictions documented.</li>}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

             <div className="flex justify-between items-end pt-4 pb-4">
                <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">RDANA-GEN-2026</div>
                <div className="text-center w-64 border-t-2 border-slate-800 pt-2">
                  <div className="text-sm font-black text-slate-800 truncate">{form.inspector || 'Inspector Name'}</div>
                  <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Authorized Assessor</div>
                </div>
             </div>

          </div>
        </div>
      </div>
    );
  }

  return view === 'form' ? renderForm() : renderReport();
}
