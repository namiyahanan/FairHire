import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  ShieldCheck,
  Users,
  MessageSquare,
  Sparkles,
  Maximize2,
  Clock,
  Send,
  X,
  Radio,
  FileCode2,
  CheckCircle2
} from 'lucide-react';

const LiveMeetingRoomModal = ({
  isOpen = false,
  onClose,
  roomId = 'ROOM-301',
  roleTitle = 'Full Stack Engineer',
  interviewerName = 'Elena Rostova (Lead Technical Evaluator)',
  candidateName = 'Alex Morgan'
}) => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState('notes'); // 'notes' | 'chat'
  const [callDuration, setCallDuration] = useState(0);
  const [meetingNotes, setMeetingNotes] = useState(
    'Candidate demonstrates high competency in asynchronous JavaScript and database indexing. Solving problem 2 with optimal O(N) complexity.'
  );
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'Elena Rostova',
      time: '10:00 AM',
      text: 'Hello Alex! Welcome to the technical interview round. Please test your camera and audio.'
    },
    {
      sender: 'Alex Morgan',
      time: '10:01 AM',
      text: 'Hi Elena! Audio and video are active and clear on my end.'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const candidateVideoRef = useRef(null);
  const screenStreamRef = useRef(null);
  const localStreamRef = useRef(null);

  // Initialize hardware MediaDevices stream
  useEffect(() => {
    if (!isOpen) return;

    let stream = null;
    const startMeetingHardware = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: true
          });
          localStreamRef.current = stream;
          if (candidateVideoRef.current) {
            candidateVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Meeting camera permission denied or simulated:', err);
      }
    };

    startMeetingHardware();

    // Call duration interval
    const durationInterval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(durationInterval);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen]);

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = isMicMuted;
      });
    }
    setIsMicMuted((prev) => !prev);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = isVideoOff;
      });
    }
    setIsVideoOff((prev) => !prev);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = screenStream;
          if (candidateVideoRef.current) {
            candidateVideoRef.current.srcObject = screenStream;
          }
          setIsScreenSharing(true);
          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            if (candidateVideoRef.current && localStreamRef.current) {
              candidateVideoRef.current.srcObject = localStreamRef.current;
            }
          };
        }
      } catch (err) {
        console.warn('Screen share cancelled:', err);
      }
    } else {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (candidateVideoRef.current && localStreamRef.current) {
        candidateVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsScreenSharing(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      {
        sender: candidateName,
        time: now,
        text: newMessage.trim()
      }
    ]);
    setNewMessage('');
  };

  const formatMeetingTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Meeting Header */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                Live Video Interview Room ({roomId})
              </h3>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Encrypted & Proctored</span>
            </span>
          </div>

          {/* Center Call Timer */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono font-bold text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatMeetingTimer(callDuration)}</span>
          </div>

          {/* Right: Close/Leave Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            title="Leave Meeting Room"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Meeting Body: 2 Video Streams (Candidate & Recruiter) + Interactive Side Panel */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-950">
          
          {/* Main Video Stage (8 cols) */}
          <div className="lg:col-span-8 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              
              {/* 1. Recruiter / Interviewer Stream */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center aspect-video sm:aspect-auto sm:h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-navy-950 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-teal-500/20 text-teal-400 border-2 border-teal-400/40 flex items-center justify-center font-black text-2xl mb-2 shadow-lg">
                    ER
                  </div>
                  <h4 className="font-bold text-white text-sm">{interviewerName}</h4>
                  <p className="text-[11px] text-teal-300">Technical Interview Panel</p>
                </div>

                {/* Top status indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono backdrop-blur-xs border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Audio & Video Active</span>
                </div>

                {/* Name Tag Bottom */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-black/70 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                  <span className="font-bold">Interviewer: Elena Rostova</span>
                  <span className="text-[10px] text-teal-300 font-mono">1080p 60fps</span>
                </div>
              </div>

              {/* 2. Candidate Live Stream (Hardware Webcam / Audio Stream) */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-teal-500/50 shadow-inner flex items-center justify-center aspect-video sm:aspect-auto sm:h-full">
                <video
                  ref={candidateVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover mirror-mode ${isVideoOff ? 'hidden' : 'block'}`}
                />

                {isVideoOff && (
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <div className="w-20 h-20 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center font-bold text-xl mb-2">
                      AM
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">Camera is paused</p>
                  </div>
                )}

                {/* Bounding Box HUD Confirmation */}
                {!isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-28 h-32 border border-teal-400/80 rounded-xl flex items-center justify-center">
                      <span className="text-[8px] font-mono bg-black/80 px-1.5 py-0.5 rounded text-teal-300">
                        EYE TRACKING ON
                      </span>
                    </div>
                  </div>
                )}

                {/* Top status indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 text-[10px] font-mono backdrop-blur-xs border border-rose-500/40">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>CANDIDATE FEED ACTIVE</span>
                </div>

                {/* Name Tag Bottom */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-black/70 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                  <span className="font-bold">{candidateName} (Candidate)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {isMicMuted ? '🔇 Muted' : '🎙️ Mic Active'}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Meeting Controls Bar */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-3 shrink-0">
              
              {/* Mic Toggle */}
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isMicMuted
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMicMuted ? 'Unmute' : 'Mute'}</span>
              </button>

              {/* Video Toggle */}
              <button
                type="button"
                onClick={toggleVideo}
                className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isVideoOff
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title={isVideoOff ? 'Start Camera' : 'Stop Camera'}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                <span className="hidden sm:inline">{isVideoOff ? 'Start Cam' : 'Stop Cam'}</span>
              </button>

              {/* Screen Share Toggle */}
              <button
                type="button"
                onClick={toggleScreenShare}
                className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isScreenSharing
                    ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-900/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
              </button>

              {/* End Call Button */}
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-950/50 cursor-pointer active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Leave Call</span>
              </button>
            </div>

          </div>

          {/* Right Side Panel: Meeting Notes & Live Chat (4 cols) */}
          <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between bg-slate-900 p-4 space-y-3">
            
            {/* Tab switch buttons */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveSidePanel('notes')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSidePanel === 'notes'
                    ? 'bg-teal-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Live Notes</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSidePanel('chat')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSidePanel === 'chat'
                    ? 'bg-teal-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Room Chat ({chatMessages.length})</span>
              </button>
            </div>

            {/* Panel 1: Live Notes / Scratchpad */}
            {activeSidePanel === 'notes' && (
              <div className="flex-1 flex flex-col space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Shared Technical Notes & Code
                </span>
                <textarea
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  placeholder="Type interview notes, code snippets, or architecture diagrams..."
                  className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-mono text-teal-300 resize-none outline-none focus:border-teal-500/80 leading-relaxed custom-scrollbar shadow-inner"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>✓ Real-time sync active</span>
                  <span>Autosaved</span>
                </div>
              </div>
            )}

            {/* Panel 2: Live Room Chat */}
            {activeSidePanel === 'chat' && (
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-96">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <strong className="text-teal-400 font-bold">{msg.sender}</strong>
                        <span className="text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-200">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type message to panel..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

          </aside>

        </div>

      </div>
    </div>
  );
};

export default LiveMeetingRoomModal;
