import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Clock, 
  Activity, 
  BookOpen, 
  Heart
} from 'lucide-react';

interface LabFinding {
  test: string;
  value: number;
  ref_low: number;
  ref_high: number;
  status: string;
}

interface HistoryItem {
  timestamp: string;
  summary: string;
}

interface ExplanationResponse {
  explanation: string;
  readability_score: number;
  findings: LabFinding[];
  alerts: string[];
  next_steps: string[];
  coverage_score: string;
  history: HistoryItem[];
}

export default function ReportExplainer() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'rag' | 'no_rag'>('rag');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplanationResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'explanation' | 'findings' | 'next_steps'>('explanation');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') {
        setError('Only PDF files are supported.');
        setFile(null);
      } else {
        setError(null);
        setFile(selected);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    setStep('Uploading PDF report...');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    // Dynamic stepper messages
    const stepTimer1 = setTimeout(() => {
      setStep('Extracting medical text and scanning charts...');
    }, 1500);

    const stepTimer2 = setTimeout(() => {
      setStep('Querying AI model for patient-friendly explanation...');
    }, 4500);

    try {
      const response = await fetch('http://127.0.0.1:8000/explain', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to explain the medical report.');
      }

      const data: ExplanationResponse = await response.json();
      setResult(data);
      setHistory(data.history || []);
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setError(err.message || 'Unable to connect to the backend Python server. Please verify the backend is running on http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  const formatTimestamp = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header / Navbar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-2 select-none">
          <svg className="w-8 h-8 fill-none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#1e293b" />
            <path d="M50 82C50 82 22 62 22 41C22 25.5 34.5 18 50 34C65.5 18 78 25.5 78 41C78 62 50 82 50 82Z" fill="#3b82f6" />
            <path d="M50 38V58M40 48H60" stroke="#8beb1c" strokeWidth="6" strokeLinecap="round" />
          </svg>
          <span className="font-extrabold text-blue-400 text-lg">BrightCare AI</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-white tracking-tight">
            Patient Friendly Medical Report Explainer
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Upload your laboratory PDF report to receive an easy-to-understand breakdown of your medical findings, flagged abnormalities, and helpful next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload Panel & History (Lg: 5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Upload Box */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" /> Upload Report
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* File Dropzone */}
                <div className="relative group rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-all duration-300 p-8 text-center bg-slate-950/40">
                  <input 
                    type="file" 
                    id="file-upload" 
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-15"
                  />
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6" />
                    </div>
                    {file ? (
                      <div>
                        <p className="text-sm font-bold text-white truncate max-w-[280px] mx-auto">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {(file.size / 1024).toFixed(1)} KB • PDF Document
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-slate-300">
                          Drag and drop your PDF here
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          or click to browse from files
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Explanation Mode Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Explanation Grounding Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMode('rag')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                        mode === 'rag' 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> RAG Grounded
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('no_rag')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                        mode === 'no_rag' 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Baseline No-RAG
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 flex items-start gap-1.5 px-1 leading-normal">
                    <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    {mode === 'rag' 
                      ? 'Recommends grounding the response entirely in context to prevent hallucinations.' 
                      : 'Summarizes the whole document directly without vector chunk context filtering.'
                    }
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !file}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                    loading || !file
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-700/50'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/10 hover:scale-[1.01]'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" /> Explain My Report
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="text-xs font-semibold leading-relaxed">
                  {error}
                </div>
              </div>
            )}

            {/* Loading Stepper Panel */}
            {loading && (
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-bold text-blue-400">{step}</span>
                </div>
                <div className="mt-4 w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full animate-[loading-bar_4s_infinite]" style={{ width: '60%' }} />
                </div>
              </div>
            )}

            {/* Local Storage / Past Explanations History */}
            {history.length > 0 && (
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-xl max-h-[300px] overflow-y-auto">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" /> Recent Explanations Log
                </h3>
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div key={index} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-colors">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Report #{history.length - index}</span>
                        <span>{formatTimestamp(item.timestamp)}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Structured Output Display (Lg: 7 columns) */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                
                {/* Visual Overview Metric Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Readability Ease Card */}
                  <div className="p-5 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Activity className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Readability Ease Score
                      </span>
                      <span className="block text-2xl font-black text-white mt-1">
                        {result.readability_score} / 100
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {result.readability_score >= 70 ? 'Very Easy to Read (Patient Friendly)' : 'Moderate Difficulty'}
                      </span>
                    </div>
                  </div>

                  {/* Identification Coverage Card */}
                  <div className="p-5 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Heart className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Extracted Findings
                      </span>
                      <span className="block text-lg font-black text-white mt-1 leading-tight">
                        {result.findings.length} Test Markers
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1 truncate">
                        {result.coverage_score}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Results Panel Container */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-2xl overflow-hidden">
                  
                  {/* Tab Selector Header */}
                  <div className="flex border-b border-slate-800 bg-slate-950/60 p-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('explanation')}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'explanation'
                          ? 'bg-slate-900 text-white border border-slate-800 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" /> Patient Explanation
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('findings')}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'findings'
                          ? 'bg-slate-900 text-white border border-slate-800 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Activity className="w-4 h-4 text-emerald-400" /> Lab Findings
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('next_steps')}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'next_steps'
                          ? 'bg-slate-900 text-white border border-slate-800 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Info className="w-4 h-4 text-indigo-400" /> Warnings & Next Steps
                    </button>
                  </div>

                  {/* Tab Content Display */}
                  <div className="p-6">
                    
                    {/* 1. Explanation Tab */}
                    {activeTab === 'explanation' && (
                      <div className="space-y-4 leading-relaxed animate-in fade-in duration-300">
                        <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-400" /> Simple Explanation Summary
                        </h3>
                        <div className="text-slate-300 text-sm space-y-4 whitespace-pre-line bg-slate-950/40 p-5 rounded-2xl border border-slate-900/60 leading-loose">
                          {result.explanation}
                        </div>
                      </div>
                    )}

                    {/* 2. Findings Tab */}
                    {activeTab === 'findings' && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-emerald-400" /> Extracted Values & Reference Limits
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                                <th className="pb-3 pt-1">Test Metric</th>
                                <th className="pb-3 pt-1">Patient Value</th>
                                <th className="pb-3 pt-1">Healthy Reference Range</th>
                                <th className="pb-3 pt-1 text-right">Status Flag</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40">
                              {result.findings.map((item, idx) => {
                                const isNormal = item.status.includes('Normal');
                                const isLow = item.status.includes('Low');
                                return (
                                  <tr key={idx} className="hover:bg-slate-950/20 transition-colors">
                                    <td className="py-4 font-bold text-slate-200">{item.test}</td>
                                    <td className="py-4 font-black text-white text-sm">{item.value}</td>
                                    <td className="py-4 text-slate-400 font-semibold">{item.ref_low} – {item.ref_high}</td>
                                    <td className="py-4 text-right">
                                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                                        isNormal 
                                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                          : isLow
                                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                          isNormal ? 'bg-emerald-400' : isLow ? 'bg-red-400' : 'bg-amber-400'
                                        }`} />
                                        {item.status.replace(/[✅❌⚠️]\s*/g, '')}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* 3. Next Steps Tab */}
                    {activeTab === 'next_steps' && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        
                        {/* Abnormal Alerts Card */}
                        {result.alerts.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-red-400" /> Abnormal Findings Flagged
                            </h4>
                            <div className="space-y-2">
                              {result.alerts.map((alert, idx) => (
                                <div key={idx} className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-bold flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                                  {alert}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Clinical Recommendations Cards */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-indigo-400" /> Patient Next Steps
                          </h4>
                          <div className="grid grid-cols-1 gap-2.5">
                            {result.next_steps.map((step, idx) => (
                              <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-colors flex gap-3 items-start text-xs text-slate-300 leading-relaxed font-semibold">
                                <span className="w-5 h-5 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <div>{step}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                </div>

                {/* Medical Disclaimer */}
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/20 flex gap-3 text-[10px] text-slate-500 leading-relaxed">
                  <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Disclaimer:</strong> This explanation is created by an artificial intelligence assistant for educational purposes only. It is not, and should not be used as, professional medical advice, diagnosis, or treatment. Please consult with a licensed healthcare provider regarding your health conditions.
                  </div>
                </div>

              </div>
            ) : (
              // Empty result state / placeholder
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-slate-900 border-dashed bg-slate-950/20 text-slate-500">
                <div className="w-16 h-16 rounded-3xl border border-slate-800 flex items-center justify-center bg-slate-900/30 text-slate-600 mb-4 animate-pulse">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-md font-bold text-slate-400 mb-1">No Report Analyzed Yet</h3>
                <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed">
                  Upload your laboratory PDF file on the left panel to display structured AI breakdowns.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
