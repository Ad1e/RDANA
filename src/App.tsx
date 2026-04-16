import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Printer, 
  FileText,
  Activity,
  Edit,
  ClipboardList
} from 'lucide-react';

interface EvaluationData {
  [key: string]: 'N/A' | 'Minor' | 'Moderate' | 'Severe';
}

interface FormData {
  inspectorName: string;
  date: string;
  agency: string;
  buildingName: string;
  constructionType: string;
  primaryOccupancy: string;
  storyCount: number | '';
  inspectionType: 'Exterior Only' | 'Exterior and Interior';
  evaluation: EvaluationData;
  damagePercentage: number;
  posting: 'Green' | 'Yellow' | 'Red';
  comments: string;
  actionPlan: string;
}

const EVALUATION_CATEGORIES = [
  { id: 'collapse', label: 'Structural Collapse' },
  { id: 'leaning', label: 'Building or Story Leaning' },
  { id: 'primaryMember', label: 'Primary Member Damage' },
  { id: 'fallingHazards', label: 'Falling Hazards' },
  { id: 'groundMovement', label: 'Ground Movement' },
  { id: 'submergedFixtures', label: 'Submerged Fixtures' },
];

const SEVERITY_LEVELS = ['N/A', 'Minor', 'Moderate', 'Severe'];

const STATUS_CONFIG = {
  Green: { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', bg: 'bg-emerald-500', icon: CheckCircle, label: 'INSPECTED (Safe)' },
  Yellow: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', bg: 'bg-yellow-500', icon: AlertTriangle, label: 'RESTRICTED (Use Caution)' },
  Red: { color: 'bg-red-100 text-red-800 border-red-300', bg: 'bg-red-500', icon: ShieldAlert, label: 'UNSAFE (Do Not Enter)' },
};

function App() {
  const [formData, setFormData] = useState<FormData>({
    inspectorName: 'Ruel M. Panday',
    date: '25 Oct 24',
    agency: 'BatStateU Balayan',
    buildingName: 'Ralph G. Recto Building',
    constructionType: 'Masonry',
    primaryOccupancy: 'School',
    storyCount: 2,
    inspectionType: 'Exterior and Interior',
    evaluation: {
      collapse: 'N/A',
      leaning: 'N/A',
      primaryMember: 'Minor',
      fallingHazards: 'Minor',
      groundMovement: 'N/A',
      submergedFixtures: 'N/A',
    },
    damagePercentage: 10,
    posting: 'Green',
    comments: '3 broken windows in the classrooms. No leaks.',
    actionPlan: 'GSO repair schedule for October 28.',
  });

  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'storyCount' ? (value ? parseInt(value) : '') : value,
    }));
  };

  const handleEvaluationChange = (categoryId: string, level: 'N/A' | 'Minor' | 'Moderate' | 'Severe') => {
    setFormData((prev) => ({
      ...prev,
      evaluation: {
        ...prev.evaluation,
        [categoryId]: level,
      },
    }));
  };

  const renderForm = () => (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Header Section */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white overflow-hidden relative group hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80"></div>
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <ClipboardList className="w-6 h-6" />
            </div>
            Inspection Logistics
          </h2>
          <p className="text-slate-500 text-sm mt-2 ml-14">Log the primary details of the inspection event.</p>
        </div>
        <div className="p-8 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              Inspector Name
            </label>
            <input
              type="text"
              name="inspectorName"
              value={formData.inspectorName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
            />
          </div>
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Date
            </label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
              placeholder="dd MMM yy"
            />
          </div>
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              Agency / Campus
            </label>
            <input
              type="text"
              name="agency"
              value={formData.agency}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Building Details */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white overflow-hidden relative group hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 opacity-80"></div>
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
              <Building className="w-6 h-6" />
            </div>
            Building Specifications
          </h2>
          <p className="text-slate-500 text-sm mt-2 ml-14">Define the structure under assessment.</p>
        </div>
        <div className="p-8 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Building Name</label>
            <input
              type="text"
              name="buildingName"
              value={formData.buildingName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-slate-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Construction Type</label>
            <input
              type="text"
              name="constructionType"
              value={formData.constructionType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-slate-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Primary Occupancy</label>
            <input
              type="text"
              name="primaryOccupancy"
              value={formData.primaryOccupancy}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-slate-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Story Count</label>
            <input
              type="number"
              name="storyCount"
              value={formData.storyCount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-slate-800"
            />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4 p-5 bg-teal-50/50 rounded-2xl border border-teal-100">
            <label className="block text-sm font-bold text-slate-700 mb-4">Inspection Scope</label>
            <div className="flex flex-wrap gap-6">
              {['Exterior Only', 'Exterior and Interior'].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <input
                      type="radio"
                      name="inspectionType"
                      value={type}
                      checked={formData.inspectionType === type}
                      onChange={handleInputChange}
                      className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-full checked:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all cursor-pointer bg-white"
                    />
                    <div className="absolute w-3 h-3 rounded-full bg-teal-500 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none scale-50 peer-checked:scale-100 duration-200 origin-center"></div>
                  </div>
                  <span className="text-slate-700 font-semibold group-hover:text-slate-900 transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Grid */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white overflow-hidden relative group hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 opacity-80"></div>
        <div className="p-8 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                <Activity className="w-6 h-6" />
              </div>
              Evaluation Matrix
            </h2>
            <p className="text-slate-500 text-sm mt-2 ml-14">Observe and categorize conditions based on severity.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm ml-14 sm:ml-0">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Calculated Damage</span>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500">{formData.damagePercentage}%</span>
          </div>
        </div>
        
        <div className="p-8 pt-6">
          <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-4 px-6 font-bold text-slate-700 w-2/5">Condition Category</th>
                  {SEVERITY_LEVELS.map((level) => (
                    <th key={level} className="py-4 px-4 font-bold text-slate-600 text-center w-1/6">
                      {level}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {EVALUATION_CATEGORIES.map((category) => (
                  <tr key={category.id} className="hover:bg-rose-50/30 transition-colors group/row">
                    <td className="py-5 px-6 text-slate-800 font-semibold">{category.label}</td>
                    {SEVERITY_LEVELS.map((level) => {
                      const isSelected = formData.evaluation[category.id] === level;
                      const activeColor = 
                        level === 'Severe' ? 'bg-red-500 border-red-500' :
                        level === 'Moderate' ? 'bg-yellow-500 border-yellow-500' :
                        level === 'Minor' ? 'bg-blue-500 border-blue-500' :
                        'bg-slate-400 border-slate-400';
                        
                      return (
                        <td key={level} className="py-5 px-4 text-center">
                          <label className="inline-flex flex-col items-center justify-center cursor-pointer group/label w-full h-full relative">
                            <input
                              type="radio"
                              name={`eval-${category.id}`}
                              checked={isSelected}
                              onChange={() => handleEvaluationChange(category.id, level as 'N/A' | 'Minor' | 'Moderate' | 'Severe')}
                              className="peer sr-only"
                            />
                            <div className={`w-7 h-7 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${isSelected ? activeColor + ' ring-4 ring-rose-500/20' : 'border-slate-300 bg-white group-hover/label:border-slate-400'}`}>
                               {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                            </div>
                          </label>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 p-6 bg-slate-50/80 rounded-2xl border border-slate-100">
            <label className="block font-bold text-slate-800 mb-6 flex justify-between items-center">
              <span className="text-lg">Overall Damage Estimate</span>
              <span className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-rose-600 font-black text-xl shadow-sm">
                {formData.damagePercentage}%
              </span>
            </label>
            <div className="relative pt-1 px-2">
              <input
                type="range"
                name="damagePercentage"
                min="0"
                max="100"
                value={formData.damagePercentage}
                onChange={handleInputChange}
                className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer outline-none slider-thumb"
                style={{
                  background: `linear-gradient(to right, #f43f5e ${formData.damagePercentage}%, #e2e8f0 ${formData.damagePercentage}%)`
                }}
              />
              <div className="flex justify-between text-xs font-bold text-slate-400 mt-4 px-1 uppercase tracking-wider">
                <span>0%<br/><span className="text-[10px] font-medium text-slate-300">None</span></span>
                <span className="text-center">25%<br/><span className="text-[10px] font-medium text-slate-300">Slight</span></span>
                <span className="text-center">50%<br/><span className="text-[10px] font-medium text-slate-300">Moderate</span></span>
                <span className="text-center">75%<br/><span className="text-[10px] font-medium text-slate-300">Heavy</span></span>
                <span className="text-right">100%<br/><span className="text-[10px] font-medium text-slate-300">Total</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posting Status & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Posting */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white overflow-hidden lg:col-span-1 flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-80"></div>
          <div className="p-8 pb-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-slate-800 rounded-xl text-white group-hover:bg-slate-700 transition-colors duration-300">
                <ShieldAlert className="w-6 h-6" />
              </div>
              Placard Status
            </h2>
          </div>
          <div className="p-8 flex-grow flex flex-col justify-center space-y-4">
            {(['Green', 'Yellow', 'Red'] as const).map((status) => {
              const config = STATUS_CONFIG[status];
              const Icon = config.icon;
              const isSelected = formData.posting === status;
              
              return (
                <button
                  key={status}
                  onClick={() => setFormData({ ...formData, posting: status })}
                  className={`relative overflow-hidden w-full p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 text-left group/btn ${
                    isSelected 
                      ? config.color + ' shadow-lg shadow-' + config.color.split('-')[1] + '-500/20 scale-[1.03] border-transparent'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  )}
                  <Icon className={`w-10 h-10 transition-transform duration-300 ${isSelected ? 'scale-110' : 'text-slate-400 group-hover/btn:scale-110'}`} />
                  <div>
                    <div className="font-extrabold text-xl tracking-tight leading-none mb-1">{status}</div>
                    <div className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'opacity-90' : 'text-slate-400'}`}>{config.label}</div>
                  </div>
                  {isSelected && (
                    <div className="absolute right-4 rounded-full bg-white/30 p-1">
                      <CheckCircle className="w-5 h-5 text-current" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comments & Action Plan */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white overflow-hidden lg:col-span-2 flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-400 to-slate-600 opacity-80"></div>
          <div className="p-8 pb-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700 group-hover:bg-slate-200 transition-colors duration-300">
                <FileText className="w-6 h-6" />
              </div>
              Assessment Log
            </h2>
          </div>
          <div className="p-8 space-y-8 flex-grow flex flex-col">
            <div className="flex-grow flex flex-col">
              <label className="block text-sm font-bold text-slate-700 mb-2">Comments & Specific Observations</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                rows={4}
                className="w-full flex-grow px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm font-medium text-slate-800"
                placeholder="Detail observations, e.g., '3 broken windows in the classrooms. No leaks.'"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Action Plan / Recommendations</label>
              <textarea
                name="actionPlan"
                value={formData.actionPlan}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm font-medium text-slate-800"
                placeholder="Recommended next steps, e.g., 'GSO repair schedule for October 28.'"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 pb-16">
        <button
          onClick={() => setIsPreview(true)}
          className="relative overflow-hidden group bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 flex items-center gap-3 hover:-translate-y-1"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Printer className="w-6 h-6 relative z-10" />
          <span className="relative z-10 text-lg">Generate Official Report</span>
        </button>
      </div>
    </div>
  );

  const renderPreview = () => {
    const postingConfig = STATUS_CONFIG[formData.posting];
    
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in slide-in-from-bottom-8 duration-500 pb-20">
        <div className="no-print mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <button
            onClick={() => setIsPreview(false)}
            className="text-slate-600 hover:text-slate-900 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Back to Edit
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print to PDF
          </button>
        </div>

        {/* Start PDF Layout */}
        <div className="bg-white shadow-2xl print:shadow-none print:border-none border border-slate-200 p-8 md:p-12 print:p-0 font-sans print:text-black">
          
          <div className="text-center mb-8 border-b-2 border-slate-800 pb-6 print:border-black">
            <h1 className="text-3xl font-black text-slate-900 print:text-black tracking-tight mb-1">
              RAPID DAMAGE ASSESSMENT AND NEEDS ANALYSIS
            </h1>
            <h2 className="text-xl font-bold text-slate-600 print:text-gray-800 uppercase tracking-widest">
              Building Inspection Report
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-8 text-sm">
            <div>
              <div className="text-slate-500 font-bold uppercase text-xs mb-1">Inspector</div>
              <div className="font-semibold text-lg border-b border-slate-300 pb-1">{formData.inspectorName || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500 font-bold uppercase text-xs mb-1">Date</div>
              <div className="font-semibold text-lg border-b border-slate-300 pb-1">{formData.date || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500 font-bold uppercase text-xs mb-1">Agency / Campus</div>
              <div className="font-semibold text-lg border-b border-slate-300 pb-1">{formData.agency || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500 font-bold uppercase text-xs mb-1">Inspection Type</div>
              <div className="font-semibold text-lg border-b border-slate-300 pb-1 w-fit bg-slate-100 px-3 py-0.5 rounded print:bg-transparent print:px-0">
                {formData.inspectionType}
              </div>
            </div>
          </div>

          <div className="mb-8 border border-slate-300 print:border-black rounded-lg overflow-hidden print-break-inside-avoid">
            <div className="bg-slate-100 print:bg-gray-200 p-3 border-b border-slate-300 print:border-black border-2 border-transparent border-b-slate-300 print:border-b-black font-bold text-slate-800 print:text-black uppercase text-sm tracking-wider">
              1. Building Description
            </div>
            <div className="p-4 grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500 font-semibold w-32 inline-block">Building Name:</span> <span className="font-bold text-base">{formData.buildingName || '—'}</span></div>
              <div><span className="text-slate-500 font-semibold w-32 inline-block">Occupancy:</span> <span className="font-bold text-base">{formData.primaryOccupancy || '—'}</span></div>
              <div><span className="text-slate-500 font-semibold w-32 inline-block">Construction:</span> <span className="font-bold text-base">{formData.constructionType || '—'}</span></div>
              <div><span className="text-slate-500 font-semibold w-32 inline-block">Stories:</span> <span className="font-bold text-base">{formData.storyCount || '—'}</span></div>
            </div>
          </div>

          <div className="mb-8 border border-slate-300 print:border-black rounded-lg overflow-hidden print-break-inside-avoid">
             <div className="bg-slate-100 print:bg-gray-200 p-3 border-b border-slate-300 print:border-black font-bold text-slate-800 print:text-black uppercase text-sm tracking-wider flex justify-between">
              <span>2. Evaluation Matrix</span>
              <span>Estimated Damage: {formData.damagePercentage}%</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 print:bg-gray-100 border-b border-slate-300 print:border-black">
                  <th className="p-3 text-left w-1/2">Observed Conditions</th>
                  <th className="p-3 text-center">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 print:divide-gray-300">
                {EVALUATION_CATEGORIES.map(cat => {
                  const level = formData.evaluation[cat.id];
                  return (
                    <tr key={cat.id}>
                      <td className="p-3 font-medium text-slate-700 print:text-black">{cat.label}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          level === 'Severe' ? 'bg-red-100 text-red-800 border border-red-200 print:border-none' : 
                          level === 'Moderate' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 print:border-none' : 
                          level === 'Minor' ? 'bg-blue-100 text-blue-800 border border-blue-200 print:border-none' :
                          'text-slate-400'
                        }`}>
                          {level}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print-break-inside-avoid">
            <div className="border border-slate-300 print:border-black rounded-lg overflow-hidden flex flex-col">
              <div className="bg-slate-100 print:bg-gray-200 p-3 border-b border-slate-300 print:border-black font-bold text-slate-800 print:text-black uppercase text-sm tracking-wider">
                3. Posting Assessment
              </div>
              <div className="p-6 flex-grow flex items-center justify-center">
                <div className={`border-4 rounded-xl p-6 text-center w-full max-w-xs print:border-black ${formData.posting === 'Red' ? 'border-red-600 bg-red-50' : formData.posting === 'Yellow' ? 'border-yellow-500 bg-yellow-50' : 'border-emerald-500 bg-emerald-50'} print:bg-transparent`}>
                  <div className={`text-4xl font-black mb-1 uppercase ${formData.posting === 'Red' ? 'text-red-700' : formData.posting === 'Yellow' ? 'text-yellow-600' : 'text-emerald-700'} print:text-black`}>
                    {formData.posting}
                  </div>
                  <div className="text-sm font-bold text-slate-600 print:text-black uppercase">
                    {postingConfig.label}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="border border-slate-300 print:border-black rounded-lg overflow-hidden flex-grow flex flex-col">
                <div className="bg-slate-100 print:bg-gray-200 p-3 border-b border-slate-300 print:border-black font-bold text-slate-800 print:text-black uppercase text-sm tracking-wider">
                  Comments
                </div>
                <div className="p-4 text-sm whitespace-pre-wrap flex-grow print:border-b-0 min-h-[80px]">
                  {formData.comments || 'No comments provided.'}
                </div>
              </div>

              <div className="border border-slate-300 print:border-black rounded-lg overflow-hidden">
                <div className="bg-slate-100 print:bg-gray-200 p-3 border-b border-slate-300 print:border-black font-bold text-slate-800 print:text-black uppercase text-sm tracking-wider">
                  Action Plan
                </div>
                <div className="p-4 text-sm whitespace-pre-wrap">
                  {formData.actionPlan || 'No action plan specified.'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t-2 border-slate-800 print:border-black flex justify-between items-end print-break-inside-avoid">
            <div className="text-xs text-slate-400 font-mono tracking-wider">
              RDANA-GEN-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
            </div>
            <div className="text-center w-64">
              <div className="border-b border-slate-800 print:border-black mb-2 h-8"></div>
              <div className="text-sm font-bold uppercase text-slate-800 print:text-black">{formData.inspectorName || 'Inspector Signature'}</div>
              <div className="text-xs text-slate-500">Authorized Assessor</div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Dynamic Background Pattern added via index.css body */}

      {/* App Header (no-print) */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white shadow-[0_4px_30px_rgb(0,0,0,0.03)] no-print sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/30">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">
                RDANA <span className="font-light text-slate-400">Generator</span>
              </h1>
              <p className="text-[10px] font-bold text-indigo-500 tracking-widest uppercase">Rapid Damage Assessment System</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enterprise Validated</span>
          </div>
        </div>
      </header>

      <main className="py-8 lg:py-12 relative z-10">
        {!isPreview ? renderForm() : renderPreview()}
      </main>
    </div>
  );
}

export default App;
