import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { aiApi } from '../../api/client';
import { scoreColor } from '../../lib/utils';
import { ShieldCheck, Upload, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { OriginalityReport } from '../../types';

export default function OriginalityCheckerPage() {
  const [report, setReport] = useState<OriginalityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { register, handleSubmit } = useForm();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    multiple: false
  });

  const onSubmit = async (data: any) => {
    if (!file && !data.text) {
      toast.error('Please upload a PDF/text file or input abstract text');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        res = await aiApi.originalityCheck(formData);
      } else {
        res = await aiApi.originalityCheck({ text: data.text });
      }
      setReport(res.data);
      toast.success('Originality check complete!');
    } catch {
      toast.error('Originality check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
          <ShieldCheck size={22} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Originality Checker</h1>
          <p className="text-xs text-slate-400">Scan synopsis, abstracts, or final reports for semantic duplication across all other papers and codebases</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Synopsis */}
        <div className="lg:col-span-1 glass-card self-start">
          <h3 className="font-display font-bold text-lg text-white mb-4">Upload Document</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-500 bg-primary-600/10' : 'border-white/10 hover:border-white/20'}`}>
              <input {...getInputProps()} />
              <Upload size={32} className="text-slate-500 mx-auto mb-2" />
              {file ? (
                <p className="text-xs text-white font-medium truncate">{file.name}</p>
              ) : (
                <p className="text-xs text-slate-400">Drag & drop abstract PDF or TXT here</p>
              )}
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative text-center"><span className="bg-surface-50 px-2 text-xs text-slate-500">or write abstract</span></div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1 flex items-center gap-1.5">
                <BookOpen size={14} /> Abstract Text
              </label>
              <textarea {...register('text')} rows={5} className="input-field resize-none text-xs" placeholder="Paste the synopsis abstract or proposal summary here..." />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Scanning document...' : 'Check Originality'}
            </button>
          </form>
        </div>

        {/* Semantic similarity matches list */}
        <div className="lg:col-span-2 glass-card flex flex-col justify-center min-h-[400px]">
          {!report ? (
            <div className="text-center py-16">
              <ShieldCheck size={48} className="text-slate-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-white mb-2">No active originality report</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">Provide a document to analyze matching sources and calculate semantic duplication metrics.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Originality Score</span>
                  <div className={`font-display text-4xl font-black ${scoreColor(report.originality_score)}`}>
                    {report.originality_score}%
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Verdict Status</span>
                  <div className={`font-display text-lg font-black mt-2 text-slate-200`}>
                    {report.verdict}
                  </div>
                </div>
              </div>

              {/* Similarity alerts */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                {report.originality_score > 70 ? (
                  <CheckCircle size={18} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={18} className="text-amber-400" />
                )}
                <div>
                  <h4 className="font-semibold text-white text-sm">Semantic Plagiarism Verdict</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {report.originality_score > 70
                      ? 'The document has passed original standard thresholds. It shows low similarity with other sources.'
                      : 'The document shows significant semantic overlap. Consider revising duplicate paragraphs or referencing sources.'}
                  </p>
                </div>
              </div>

              {/* Match list */}
              <div>
                <h4 className="font-display font-semibold text-sm text-white mb-3 font-medium">Matching Sources ({report.matched_projects.length})</h4>
                <div className="space-y-2 text-xs">
                  {report.matched_projects.length === 0 ? (
                    <p className="text-slate-500">No matching documents or reports discovered.</p>
                  ) : (
                    report.matched_projects.map((p, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{p.title}</p>
                          <p className="text-slate-500 mt-0.5">By {p.author}</p>
                        </div>
                        <span className="font-bold text-red-400">{p.similarity}% Match</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
