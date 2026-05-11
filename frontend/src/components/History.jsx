import { useEffect, useState } from 'react';
import { getHistory } from '../api';

export default function History({ isVisible, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isVisible) {
      loadHistory();
    }
  }, [isVisible]);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-3xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Modification History</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading && <div className="text-center text-slate-400">Loading history...</div>}
          {error && <div className="rounded-2xl bg-red-500/20 p-4 text-red-200 mb-4">{error}</div>}

          {!loading && !error && history.length === 0 && (
            <div className="text-center text-slate-500">No history records found.</div>
          )}

          <div className="space-y-4">
            {history.map((entry) => (
              <div key={entry._id} className="rounded-3xl bg-slate-800 p-4 border border-slate-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium">{entry.description}</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Modified by: <span className="text-cyan-300">{entry.modifierName}</span>
                      {entry.targetUserName && (
                        <> • Target: <span className="text-rose-300">{entry.targetUserName}</span></>
                      )}
                    </p>
                    <p className="text-slate-500 text-xs mt-2">{formatDate(entry.date)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.action === 'meal_update' ? 'bg-blue-500/20 text-blue-300' :
                      entry.action === 'user_removed' || entry.action === 'user_removed_bulk' ? 'bg-red-500/20 text-red-300' :
                      entry.action === 'bazar_added' ? 'bg-green-500/20 text-green-300' :
                      'bg-slate-500/20 text-slate-300'
                    }`}>
                      {entry.action.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {entry.details && Object.keys(entry.details).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <details className="text-sm">
                      <summary className="text-slate-400 cursor-pointer hover:text-slate-300">
                        View details
                      </summary>
                      <div className="mt-2 text-slate-300">
                        <pre className="whitespace-pre-wrap text-xs bg-slate-950 p-2 rounded">
                          {JSON.stringify(entry.details, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}