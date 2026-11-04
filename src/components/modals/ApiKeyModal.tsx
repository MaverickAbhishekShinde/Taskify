import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Key, Sparkles, Check, X, ShieldAlert, Cpu } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, showToast } = useApp();
  const [keyInput, setKeyInput] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(keyInput.trim());
    showToast(
      keyInput.trim() ? 'Gemini API Key Saved' : 'Using Local Smart NLP Mode',
      keyInput.trim()
        ? 'Real-time Gemini Flash LLM processing is now activated.'
        : 'Smart deterministic NLP demo extraction engine active.',
      'info'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Engine Configuration</h3>
              <p className="text-xs text-slate-500">Configure LLM extraction preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100/80">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <span className="font-semibold">Local Smart NLP (Recommended):</span> Built-in intelligent parser extracts commitments, assignees, timestamps, and deadlines without any external credentials or rate limits.
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Google Gemini API Key (Optional)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                placeholder="AIzaSy... (leave empty for Built-in Smart Parser)"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              If left blank, Taskify runs in high-performance local deterministic NLP mode.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Keys are saved strictly inside your browser's localStorage.</span>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              setKeyInput('');
              setApiKey('');
              onClose();
              showToast('Reset to Built-in Engine', 'Default NLP engine enabled.', 'info');
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Clear Key & Use Default
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

