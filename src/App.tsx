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
  const [step, setStep] = useState(0);

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
    if (level === 'MODERATE') return 'bg-amber-500 border-amber-500 text-white';
    if (level === 'MINOR') return 'bg-blue-500 border-blue-500 text-white';
    return 'bg-slate-200 border-slate-300 text-slate-700';
  };

  const isFormComplete = () => {
    // Basic validation required to preview report
    return form.inspector.trim() !== '' && 
           form.buildingName.trim() !== '' && 
           form.posting !== '';
  };

  const handlePreviewClick = () => {
    if (!isFormComplete()) {
      alert("Please ensure the Inspector Name, Building Name, and Final Posting (Verdict) are filled out before generating the report.");
      return;
    }
    setView('report');
  };

  const renderStep = () => {
    if (step === 0) return (
      <section className="animate-in fade-in slide-in-from-right-4 duration-300">
        <h2 className="text-xl font-bold text-red-900 border-b-2 border-red-100 pb-2 mb-6 uppercase tracking-wider flex items-center gap-2">
          <span className="text-red-500">1.</span> Inspection Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Inspector</label>
            <input type="text" className="w-full border-b-2 border-slate-200 focus:border-red-500 px-2 py-2 outline-none transition-colors bg-white/50" 
                   value={form.inspector} onChange={e => update('inspector', e.target.value)} placeholder="Required" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Inspection date</label>
              <input type="date" className="w-full border-b-2 border-slate-200 focus:border-red-500 px-2 py-2 outline-none transition-colors text-sm bg-white/50" 
                     value={form.inspectionDate} onChange={e => update('inspectionDate', e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
              <input type="time" className="w-full border-b-2 border-slate-200 focus:border-red-500 px-2 py-2 outline-none transition-colors text-sm bg-white/50" 
                     value={form.time} onChange={e => update('time', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Agency/Campus</label>
            <input type="text" className="w-full border-b-2 border-slate-200 focus:border-red-500 px-2 py-2 outline-none transition-colors bg-white/50" 
                   value={form.agencyCampus} onChange={e => update('agencyCampus', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Areas inspected</label>
            <div className="flex gap-6">
              {['Exterior Only', 'Exterior and interior'].map(area => (
                <label key={area} className="flex items-center gap-2 cursor-pointer group bg-white/80 px-4 py-2 rounded-xl border border-red-50 hover:border-red-200 transition-colors">
                  <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-colors ${form.areasInspected === area ? 'bg-red-500 border-red-500' : 'border-slate-300'}`}>
                    {form.areasInspected === area && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <input type="radio" className="hidden" checked={form.areasInspected === area} onChange={() => update('areasInspected', area)} />
                  <span className="text-sm font-bold text-slate-700">{area}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>
    );

    if (step === 1) return (
      <section className="animate-in fade-in slide-in-from-right-4 duration-300">
        <h2 className="text-xl font-bold text-red-900 border-b-2 border-red-100 pb-2 mb-6 uppercase tracking-wider flex items-center gap-2">
          <span className="text-red-500">2.</span> Building Description
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Building Name</label>
              <input type="text" className="w-full border-b-2 border-slate-200 focus:border-red-500 px-2 py-2 outline-none bg-white/50" value={form.buildingName} onChange={e => update('buildingName', e.target.value)} placeholder="Required" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
              <input type="text" className="w-full border-b-2 border-slate-200 focus:border-red-500 px-2 py-2 outline-none bg-white/50" value={form.address} onChange={e => update('address', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Building Marshal</label>
              <input type="text" className="w-full border-b-2 border-slate-200 focus:border-red-500 px-2 py-2 outline-none bg-white/50" value={form.buildingMarshal} onChange={e => update('buildingMarshal', e.target.value)} />
            </div>
            <div className="flex gap-6 items-center bg-white/50 p-3 rounded-xl border border-red-50">
              <span className="text-sm font-bold text-slate-700 whitespace-nowrap">Number of stories:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Above grd:</span>
                <input type="number" className="w-16 border-b-2 border-slate-200 focus:border-red-500 text-center px-1 py-1 outline-none bg-transparent font-bold text-red-900" value={form.storyAboveGround} onChange={e => update('storyAboveGround', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Below grd:</span>
                <input type="number" className="w-16 border-b-2 border-slate-200 focus:border-red-500 text-center px-1 py-1 outline-none bg-transparent font-bold text-red-900" value={form.storyBelowGround} onChange={e => update('storyBelowGround', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="space-y-8 bg-white/80 p-6 rounded-2xl border border-red-100 shadow-sm shadow-red-100/50">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3 text-center lg:text-left">Type of Construction</label>
              <div className="grid grid-cols-2 gap-3">
                {CONSTRUCTION_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${form.typeOfConstruction.includes(type) ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-sm' : 'border-2 border-slate-300 bg-white group-hover:border-red-300'}`}>
                      {form.typeOfConstruction.includes(type) && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input type="checkbox" className="hidden" checked={form.typeOfConstruction.includes(type)} onChange={() => toggleArray('typeOfConstruction', type)} />
                    <span className="text-sm font-semibold text-slate-700">{type}</span>
                  </label>
                ))}
                <div className="flex items-center gap-2 col-span-2 mt-2">
                   <span className="text-sm font-semibold text-slate-700">Other:</span>
                   <input type="text" className="border-b-2 border-slate-200 focus:border-red-500 px-1 py-0.5 outline-none flex-1 text-sm text-slate-700 bg-transparent font-bold" value={form.otherConstruction} onChange={e => update('otherConstruction', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="border-t border-red-100 pt-6">
              <label className="block text-sm font-bold text-slate-800 mb-3 text-center lg:text-left">Primary Occupancy</label>
              <div className="grid grid-cols-2 gap-3">
                {OCCUPANCY_TYPES.map(occ => (
                  <label key={occ} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${form.primaryOccupancy.includes(occ) ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-sm' : 'border-2 border-slate-300 bg-white group-hover:border-red-300'}`}>
                      {form.primaryOccupancy.includes(occ) && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input type="checkbox" className="hidden" checked={form.primaryOccupancy.includes(occ)} onChange={() => toggleArray('primaryOccupancy', occ)} />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">{occ}</span>
                  </label>
                ))}
                <div className="flex items-center gap-2 col-span-2 mt-2">
                    <span className="text-sm font-semibold text-slate-700">Other:</span>
                    <input type="text" className="border-b-2 border-slate-200 focus:border-red-500 px-1 py-0.5 outline-none flex-1 text-sm bg-transparent font-bold" value={form.otherOccupancy} onChange={e => update('otherOccupancy', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );

    if (step === 2) return (
      <section className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between mb-6 border-b-2 border-red-100 pb-2">
           <h2 className="text-xl font-bold text-red-900 uppercase tracking-wider flex items-center gap-2">
             <span className="text-red-500">3.</span> Damage Evaluation Matrix
           </h2>
           <div className="bg-red-50 px-4 py-1.5 rounded-full border border-red-200">
             <span className="text-sm font-bold text-red-900">Damage: <span className="text-red-600">{form.damagePercentage}%</span></span>
           </div>
        </div>
        
        <div className="bg-white/80 rounded-2xl shadow-sm border border-red-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gradient-to-r from-red-50 to-white">
                <tr>
                  <th className="text-slate-500 text-xs font-black uppercase tracking-widest py-4 px-6 w-2/5 border-b border-red-100">Condition</th>
                  {SEVERITY_LEVELS.map(level => (
                    <th key={level} className={`text-center text-xs font-black uppercase tracking-widest py-4 border-b border-red-100 w-1/5 ${
                      level === 'SEVERE' ? 'text-red-600' : level === 'MODERATE' ? 'text-amber-600' : level === 'MINOR' ? 'text-blue-600' : 'text-slate-400'
                    }`}>{level}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {[...EVAL_CONDITIONS, {id: 'proximityRisks', label: 'Proximity risks / other', icon: '🚧'}].map(cond => (
                  <tr key={cond.id} className="hover:bg-red-50/50 transition-colors group/row">
                    <td className="py-4 px-6">
                       <div className="flex items-center gap-3">
                         <span className="text-lg opacity-80">{cond.icon}</span>
                         <span className="text-sm font-bold text-slate-800">{cond.label}</span>
                       </div>
                       {cond.id === 'proximityRisks' && (
                         <input type="text" className="mt-2 w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-bold focus:border-red-500 outline-none transition-colors"
                                placeholder="Specify risk..." value={form.evaluationOther} onChange={e => update('evaluationOther', e.target.value)} />
                       )}
                    </td>
                    {SEVERITY_LEVELS.map(level => {
                      const isSelected = form.evaluation[cond.id] === level;
                      return (
                        <td key={level} className="text-center py-4">
                          <label className="inline-flex cursor-pointer transition-transform hover:scale-110 active:scale-95">
                            <div className={`w-12 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-200 ${
                              isSelected 
                                ? (level === 'SEVERE' ? 'bg-red-50 border-red-500 shadow-sm shadow-red-200' : 
                                   level === 'MODERATE' ? 'bg-amber-50 border-amber-500 shadow-sm shadow-amber-200' : 
                                   level === 'MINOR' ? 'bg-blue-50 border-blue-500 shadow-sm shadow-blue-200' : 
                                   'bg-slate-100 border-slate-400 shadow-sm')
                                : 'bg-white border-slate-200 group-hover/row:border-slate-300'
                            }`}>
                              <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                                isSelected ? (level === 'N/A' ? 'bg-slate-500' : level === 'SEVERE' ? 'bg-red-500' : level === 'MODERATE' ? 'bg-amber-500' : 'bg-blue-500') : 'opacity-0'
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
          
          <div className="p-8 bg-gradient-to-t from-red-50/50 to-transparent border-t border-slate-100">
             <div className="flex justify-between items-center mb-6">
               <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Estimated % of Damage</span>
               <span className="text-4xl font-black text-red-600 drop-shadow-sm">{form.damagePercentage}%</span>
             </div>
             <div className="relative pt-2">
                <input type="range" min="0" max="100" value={form.damagePercentage} onChange={e => update('damagePercentage', Number(e.target.value))}
                       className="w-full h-3 bg-red-100 rounded-full appearance-none cursor-pointer outline-none slider-thumb-red"
                       style={{ background: `linear-gradient(to right, #ef4444 ${form.damagePercentage}%, #fee2e2 ${form.damagePercentage}%)` }} />
                <div className="flex justify-between text-xs font-bold text-red-900/40 mt-4 px-1 uppercase tracking-wider">
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
             </div>
          </div>
        </div>
      </section>
    );

    if (step === 3) return (
      <section className="animate-in fade-in slide-in-from-right-4 duration-300">
        <h2 className="text-xl font-bold text-red-900 border-b-2 border-red-100 pb-2 mb-6 uppercase tracking-wider flex items-center gap-2">
          <span className="text-red-500">4.</span> Posting & Restrictions
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {[
            { id: 'Green', label: 'INSPECTED', sub: '(Green placard)', active: 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md shadow-emerald-100 border-2' },
            { id: 'Yellow', label: 'RESTRICTED', sub: '(Yellow placard)', active: 'border-amber-500 bg-amber-50 text-amber-900 shadow-md shadow-amber-100 border-2' },
            { id: 'Red', label: 'UNSAFE', sub: '(Red placard)', active: 'border-red-500 bg-red-50 text-red-900 shadow-md shadow-red-100 border-2' },
          ].map(placard => (
            <label key={placard.id} className={`flex items-center gap-4 cursor-pointer group flex-1 justify-center py-4 px-4 rounded-2xl border transition-all ${form.posting === placard.id ? placard.active : 'border-slate-200 bg-white hover:border-slate-300 text-slate-500'}`}>
              <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-colors ${form.posting === placard.id ? 'border-current bg-current' : 'border-slate-300 group-hover:border-slate-400'}`}>
                {form.posting === placard.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <input type="radio" className="hidden" checked={form.posting === placard.id} onChange={() => update('posting', placard.id)} />
              <div className="flex flex-col items-center">
                <span className={`font-black tracking-widest leading-tight ${form.posting === placard.id ? 'text-lg' : 'text-base'}`}>{placard.label}</span>
                <span className="text-[10px] opacity-80 font-bold uppercase">{placard.sub}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="bg-white/80 p-8 rounded-2xl border border-red-50 shadow-sm shadow-red-50">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">Restrictions</h3>
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <label className="flex items-center gap-3 cursor-pointer group shrink-0 mb-1 sm:mb-0">
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${form.restrictions.doNotEnter ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-sm' : 'border-2 border-slate-300 bg-white group-hover:border-red-300'}`}>
                  {form.restrictions.doNotEnter && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input type="checkbox" className="hidden" checked={form.restrictions.doNotEnter} onChange={e => updateNested('restrictions', 'doNotEnter', e.target.checked)} />
                <span className="text-sm font-bold text-slate-700">Do not enter following areas:</span>
              </label>
              <input type="text" className="flex-1 bg-transparent border-b-2 border-slate-200 focus:border-red-500 outline-none px-2 py-1 text-sm font-bold text-red-900" 
                     value={form.restrictions.doNotEnterText} onChange={e => updateNested('restrictions', 'doNotEnterText', e.target.value)} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <label className="flex items-center gap-3 cursor-pointer group shrink-0 mb-1 sm:mb-0">
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${form.restrictions.briefEntry ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-sm' : 'border-2 border-slate-300 bg-white group-hover:border-red-300'}`}>
                  {form.restrictions.briefEntry && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input type="checkbox" className="hidden" checked={form.restrictions.briefEntry} onChange={e => updateNested('restrictions', 'briefEntry', e.target.checked)} />
                <span className="text-sm font-bold text-slate-700">Brief entry allowed for contents:</span>
              </label>
              <input type="text" className="flex-1 bg-transparent border-b-2 border-slate-200 focus:border-red-500 outline-none px-2 py-1 text-sm font-bold text-red-900" 
                     value={form.restrictions.briefEntryText} onChange={e => updateNested('restrictions', 'briefEntryText', e.target.value)} />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-start">
              <span className="text-sm font-bold text-slate-700 mt-2 shrink-0">General Comments:</span>
              <textarea className="w-full border-2 border-slate-200 focus:border-red-500 rounded-xl outline-none resize-none px-4 py-3 text-sm leading-relaxed bg-white shadow-sm font-medium" rows={3}
                value={form.comments} onChange={e => update('comments', e.target.value)} placeholder="Enter general comments here..." />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center bg-red-50 p-6 rounded-2xl border border-red-100">
             <div>
                <h3 className="font-black text-red-900 text-lg">Report Generation</h3>
                <p className="text-xs font-bold text-red-900/60 uppercase tracking-widest mt-1">Status: {isFormComplete() ? 'Ready' : 'Incomplete'}</p>
             </div>
             <button onClick={handlePreviewClick} 
               className={`px-8 py-3.5 rounded-full font-black text-sm tracking-widest transition-all uppercase flex items-center gap-2 ${
                 isFormComplete() 
                 ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/50 cursor-pointer' 
                 : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300'
               }`}>
               Preview Official Report
             </button>
          </div>
        </div>
      </section>
    );
  };

  // ----------------------------------------------------
  //               MAIN WRAPPER - SCROLLING FORM
  // ----------------------------------------------------
  const renderMultiStepForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-white selection:bg-red-100 selection:text-red-900 pb-32">
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-500 h-2 w-full fixed top-0 z-50 shadow-md"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-red-900/5 rounded-3xl overflow-hidden border border-red-100">
          
          <div className="bg-white border-b border-red-100 py-6 px-8 flex items-center gap-6">
            <img src={BsuLogo} alt="BSU Logo" className="h-12 sm:h-14 w-auto object-contain" />
            <div>
               <h1 className="text-2xl sm:text-3xl font-black text-red-900 tracking-tight">RDANA Generator</h1>
               <p className="text-[10px] font-bold text-red-900/50 uppercase tracking-widest">Rapid Damage Assessment & Needs Analysis</p>
            </div>
          </div>

          <div className="bg-red-50/50 border-b border-red-100 px-8 py-4">
             <div className="flex gap-2 sm:gap-4 overflow-x-auto hide-scrollbar">
                {['Inspection', 'Building', 'Evaluation', 'Final'].map((lbl, idx) => (
                  <button key={idx} onClick={() => setStep(idx)}
                     className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-center transition-all ${
                       step === idx ? 'bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-md shadow-red-500/30 font-black' : 'bg-white text-slate-500 font-bold hover:bg-red-50 border border-slate-200'
                     }`}>
                    <div className="text-xs uppercase tracking-widest">{lbl}</div>
                  </button>
                ))}
             </div>
          </div>

          <div className="p-6 sm:p-10 min-h-[500px]">
            {renderStep()}
          </div>
          
          <div className="bg-slate-50 border-t border-slate-200 px-10 py-6 flex justify-between items-center rounded-b-3xl">
             <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wider uppercase transition-colors border ${
                  step === 0 ? 'border-transparent text-slate-300' : 'border-slate-300 text-slate-600 hover:bg-white hover:shadow-sm'
                }`}>
                Back
             </button>
             <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Step {step + 1} of 4
             </div>
             {step < 3 ? (
               <button onClick={() => setStep(s => s + 1)}
                  className="px-6 py-2.5 rounded-full font-black text-sm tracking-wider uppercase transition-all bg-slate-900 text-white hover:bg-black shadow-md hover:-translate-y-0.5">
                  Next Step
               </button>
             ) : (
               <div className="w-[100.5px]"></div>
             )}
          </div>

        </div>
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
             <span className="text-xl">←</span> Edit Form
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

  return view === 'form' ? renderMultiStepForm() : renderReport();
}
