import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { getAssessmentIdForTrack } from '../../services/candidateApi';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AssessmentDebug = () => {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);

  const addLog = (msg, data = null, isError = false) => {
    const entry = {
      time: new Date().toISOString().split('T')[1].slice(0, 8),
      msg,
      data: data !== null ? JSON.stringify(data, null, 2) : null,
      isError
    };
    setLogs(prev => [...prev, entry]);
    console[isError ? 'error' : 'log']('[DEBUG]', msg, data || '');
  };

  const runDiagnostics = async () => {
    setLogs([]);
    setRunning(true);
    const log = addLog;

    // 1. Supabase config
    log('--- SUPABASE CONFIG ---');
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    log('Key format valid', key?.startsWith('eyJ') ? 'YES' : 'WARNING — not a JWT (starts with eyJ)');

    // 2. getAssessmentIdForTrack — our new helper
    log('--- getAssessmentIdForTrack ---');
    const realUUID = await getAssessmentIdForTrack('backend-developer');
    log('Resolved assessment_id (UUID)', realUUID);
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(realUUID);
    log('Is valid UUID', isUUID ? 'YES ✅' : 'NO ❌', !isUUID);

    // 3. Test INSERT with real UUID
    log('--- assessment_results INSERT (with real UUID) ---');
    const testCandId = `debug-${Date.now()}`;
    const payload = {
      candidate_id: testCandId,
      track_id: 'backend-developer',
      assessment_id: realUUID,
      assessment_name: 'Debug Test',
      score: 15,
      total_score: 20,
      percentage: 75,
      feedback: 'Debug insert test with real UUID',
      status: 'completed',
      started_at: new Date(Date.now() - 1200000).toISOString(),
      completed_at: new Date().toISOString()
    };
    log('Payload', payload);
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .insert(payload)
        .select()
        .single();
      if (error) {
        log('INSERT ERROR ❌', { code: error.code, message: error.message, hint: error.hint }, true);
      } else {
        log('INSERT SUCCESS ✅ — row id', data?.id);
        // cleanup
        await supabase.from('assessment_results').delete().eq('candidate_id', testCandId);
        log('Cleanup done');
      }
    } catch (e) {
      log('INSERT EXCEPTION', e.message, true);
    }

    // 4. assessment_questions
    log('--- assessment_questions (first 2 rows) ---');
    const { data: qs, error: qErr } = await supabase
      .from('assessment_questions')
      .select('question_id, assessment_id, category, question_text, correct_answer, is_valid')
      .limit(2);
    if (qErr) log('ERROR', qErr.message, true);
    else {
      log('Rows', qs?.length);
      qs?.forEach((q, i) => log(`Q${i}`, q));
    }

    // 5. candidate_pipeline
    log('--- candidate_pipeline ---');
    const { data: pipe, error: pErr } = await supabase.from('candidate_pipeline').select('*').limit(3);
    if (pErr) log('ERROR', pErr.message, true);
    else log('Rows', pipe?.length + ' ' + JSON.stringify(pipe?.map(p => p.candidate_id)));

    log('--- DONE ---');
    setRunning(false);
  };


  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-sm font-semibold">
          ⚠️ TEMPORARY DEBUG PAGE — Remove after diagnosis.
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-navy-900">Assessment DB Diagnostics</h1>
          <button
            onClick={runDiagnostics}
            disabled={running}
            className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm disabled:opacity-50 cursor-pointer hover:bg-teal-700 transition-colors"
          >
            {running ? 'Running...' : 'Run Diagnostics'}
          </button>
        </div>

        <div className="bg-slate-950 rounded-2xl p-5 font-mono text-xs space-y-1 min-h-64 max-h-[70vh] overflow-y-auto">
          {logs.length === 0 && (
            <p className="text-slate-500">Click "Run Diagnostics" to test Supabase connectivity and table access...</p>
          )}
          {logs.map((entry, i) => (
            <div key={i} className={entry.isError ? 'text-rose-400' : entry.msg.startsWith('---') ? 'text-amber-300 mt-3 font-bold' : 'text-emerald-300'}>
              <span className="text-slate-500">[{entry.time}]</span>{' '}
              <span>{entry.msg}</span>
              {entry.data && (
                <pre className="ml-4 text-slate-300 whitespace-pre-wrap break-all text-[10px]">{entry.data}</pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentDebug;
