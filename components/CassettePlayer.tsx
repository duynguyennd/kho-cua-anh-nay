import React, { useState, useEffect } from 'react';

interface CassettePlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSongSelected: (filename: string) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  onPlaybackComplete?: () => void;
}

export const CassettePlayer: React.FC<CassettePlayerProps> = ({ isPlaying, onTogglePlay, onSongSelected, audioRef, onPlaybackComplete }) => {
  const [trackName, setTrackName] = useState<string>("Chưa có băng");
  const [showSongList, setShowSongList] = useState(false);
  const [isInsertingTape, setIsInsertingTape] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [frequencyBars, setFrequencyBars] = useState(Array(12).fill(0));
  const [isMuted, setIsMuted] = useState(false);

  const songs = [
    { filename: "Hngle - KHÔNG BUÔNG ft. Ari - Official Music Video - YouTube.mp3", displayName: "Hngle - KHÔNG BUÔNG ft. Ari" },
    { filename: "Anh Chưa Từng Hết Yêu.mp3", displayName: "Anh Chưa Từng Hết Yêu" },
    { filename: "Em Không Khóc.mp3", displayName: "Em Không Khóc" },
    { filename: "Giờ Thì.mp3", displayName: "Giờ Thì" },
    { filename: "hí lô.mp3", displayName: "Hí Lô" },
    { filename: "Khiem.mp3", displayName: "Khiêm" },
    { filename: "Người Đầu Tiên.mp3", displayName: "Người Đầu Tiên" },
    { filename: "Thằng Điên.mp3", displayName: "Thằng Điên" },
    { filename: "Đừng Nghe Máy.mp3", displayName: "Đừng Nghe Máy" },
    { filename: "we dont talk anymore demo vocal.mp3", displayName: "We Don't Talk Anymore (Demo Vocal)" },
    { filename: "Không Thể Cùng Nhau Suốt Kiếp demo.mp3", displayName: "Không Thể Cùng Nhau Suốt Kiếp (Demo)" },
    { filename: "chưa bao giờ demo.mp3", displayName: "Chưa Bao Giờ (Demo)" }
  ];

  // Update time display
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, [audioRef]);

  // Frequency visualizer animation
  useEffect(() => {
    if (!isPlaying) {
      setFrequencyBars(Array(12).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setFrequencyBars(prev => 
        Array(12).fill(0).map(() => Math.random() * 100)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  const handleSongSelect = (filename: string, displayName: string) => {
    setShowSongList(false);
    setIsInsertingTape(true);
    // Simulate tape insertion animation
    setTimeout(() => {
      setTrackName(displayName);
      setIsInsertingTape(false);
      onSongSelected(filename);
    }, 2000); // 2 seconds for animation
  };

  const handleAudioEnded = () => {
    onTogglePlay(); // Stop spinner/reset icon
    if (onPlaybackComplete) {
      onPlaybackComplete(); // Trigger popup in App
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Helper component for a Reel
  const Reel = ({ spinning, isLeft }: { spinning: boolean; isLeft: boolean }) => (
    <div className={`w-24 h-24 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center relative shadow-inner overflow-hidden transition-all duration-300 ${spinning ? 'animate-spin-reel animate-pulse' : ''}`}>
      <div className={`absolute w-full h-full rounded-full border-[14px] border-amber-900/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] ${isLeft ? 'scale-90' : 'scale-75'}`}></div>
      <div className="absolute w-full h-full flex items-center justify-center">
        <div className="w-2 h-full bg-gray-300 shadow-sm"></div>
        <div className="h-2 w-full bg-gray-300 shadow-sm"></div>
        <div className="w-2 h-full bg-gray-300 rotate-45 shadow-sm"></div>
        <div className="h-2 w-full bg-gray-300 rotate-45 shadow-sm"></div>
      </div>
      <div className="absolute w-6 h-6 bg-white rounded-full border-2 border-gray-300 z-10 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-lg mx-auto transform transition-transform hover:scale-105 duration-500">
      {/* Cassette Body */}
      <div className={`bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl p-4 shadow-2xl border-4 border-sky-800 relative overflow-hidden transition-all duration-500 ${isPlaying ? 'shadow-[0_0_30px_rgba(255,165,0,0.8)]' : ''}`}>

        {/* Decorative Screws */}
        <div className="absolute top-2 left-2 w-4 h-4 bg-gray-300 rounded-full border border-gray-500 shadow-inner"></div>
        <div className="absolute top-2 right-2 w-4 h-4 bg-gray-300 rounded-full border border-gray-500 shadow-inner"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 bg-gray-300 rounded-full border border-gray-500 shadow-inner"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-gray-300 rounded-full border border-gray-500 shadow-inner"></div>

        {/* Label Area */}
        <div className="bg-sky-50/90 rounded-lg h-24 mb-3 mx-4 flex flex-col items-center justify-center border border-sky-300 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-orange-400 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-full h-4 bg-purple-400 opacity-20"></div>
          <h3 className="font-handwriting text-2xl text-sky-900 font-extrabold truncate max-w-[85%] z-10 tracking-tight">
            {trackName}
          </h3>
          <div className="flex items-center gap-2 mt-1 z-10">
              <p className="text-[10px] text-sky-600 uppercase tracking-[0.2em] font-bold">
                  Nghe Gì Chọn Đê
              </p>
          </div>
        </div>

        {/* Cassette Lid */}
        <div className={`bg-gray-700 rounded-xl mx-6 h-36 relative shadow-lg border-2 border-gray-600 transition-transform duration-1000 origin-top ${isInsertingTape ? 'rotate-x-90' : 'rotate-x-0'}`}>
          {/* Window / Reels Section */}
          <div className="bg-gray-800 rounded-xl p-2 h-full relative flex items-center justify-center gap-4 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] border-2 border-gray-600">
            <div className="absolute inset-0 bg-white opacity-[0.03] pointer-events-none rounded-xl"></div>

            {/* Tape Insertion Animation */}
            {isInsertingTape && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-10 bg-amber-800 rounded-lg shadow-lg animate-slide-in-tape relative overflow-hidden border-2 border-amber-900">
                  {/* Tape Spools */}
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-amber-600 rounded-full border border-amber-700 flex items-center justify-center">
                    <div className="w-3 h-3 bg-amber-900 rounded-full"></div>
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-amber-600 rounded-full border border-amber-700 flex items-center justify-center">
                    <div className="w-3 h-3 bg-amber-900 rounded-full"></div>
                  </div>
                  {/* Tape Label */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-amber-100 font-bold text-xs">CASSETTE</div>
                    <div className="text-amber-200 text-[8px] mt-0.5">T90</div>
                  </div>
                  {/* Magnetic Tape Strip */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-1 bg-black opacity-80 rounded"></div>
                  </div>
                </div>
              </div>
            )}

            {!isInsertingTape && (
              <>
                <Reel spinning={isPlaying} isLeft={true} />

                {/* Tape Bridge */}
                <div className="h-16 w-24 relative flex items-center justify-center overflow-visible z-0">
                   <div className="absolute w-32 h-20 bg-gray-900 -z-10 rounded-lg opacity-80"></div>
                   <div className="w-full h-10 bg-black relative overflow-hidden flex items-center opacity-90 border-t border-b border-gray-700">
                      {isPlaying && (
                        <>
                          <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.05)_3px,transparent_4px)] animate-tape-move"></div>
                          {/* Moving Tape Line */}
                          <div className="absolute w-full h-0.5 bg-amber-400 animate-tape-unwind opacity-70"></div>
                        </>
                      )}
                   </div>
                </div>

                <Reel spinning={isPlaying} isLeft={false} />
              </>
            )}
          </div>
        </div>

        {/* Bottom Trapezoid */}
        <div className="mt-2 mx-16 h-12 bg-gray-700 clip-trapezoid flex items-center justify-center rounded-b-lg border-t border-gray-600 relative">
           <div className="w-20 h-3 bg-gray-400 rounded-full shadow-inner flex gap-2 justify-center items-center">
             <div className="w-1 h-1 bg-black rounded-full"></div>
             <div className="w-1 h-1 bg-black rounded-full"></div>
           </div>
        </div>

        {/* Frequency Visualizer - Only shows when playing */}
        {isPlaying && (
          <div className="mt-4 mx-6 flex items-end justify-center gap-1 h-20 bg-black/30 rounded-lg p-3 backdrop-blur-sm border border-orange-400/50">
            {frequencyBars.map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-t-sm shadow-lg transition-all duration-100"
                style={{
                  height: `${Math.min(height, 100)}%`,
                  minHeight: '4px',
                  opacity: 0.8 + (height / 200)
                }}
              />
            ))}
          </div>
        )}

        {/* Progress Bar and Time Display */}
        <div className="mt-4 mx-6 space-y-2">
          {/* Progress Input */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:h-3 transition-all"
            style={{
              background: `linear-gradient(to right, #f97316 0%, #f97316 ${progressPercentage}%, #e0f2fe ${progressPercentage}%, #e0f2fe 100%)`
            }}
          />
          {/* Time Display */}
          <div className="flex justify-between text-xs font-bold text-sky-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Sound Waves when playing */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-orange-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-orange-300 rounded-full animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-orange-200 rounded-full animate-ping opacity-25" style={{animationDelay: '1s'}}></div>
        </div>
      )}

      {/* Primary Controls */}
      <div className="mt-8 flex justify-center items-center gap-4">
        
        {/* Load Button */}
        <button
            onClick={() => setShowSongList(true)}
            className="bg-sky-100 hover:bg-white text-sky-700 border-2 border-sky-300 px-4 py-2 rounded-full font-bold shadow-md transition-all hover:-translate-y-1 flex items-center gap-2 text-sm"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            <span>Nạp</span>
        </button>

        {/* Mute Button */}
        <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full border-2 shadow-lg flex items-center justify-center transition-all active:scale-95 ${
              isMuted 
                ? 'bg-red-500 border-red-700 text-white' 
                : 'bg-sky-100 border-sky-300 text-sky-700 hover:bg-white'
            }`}
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 4.06c0-1.336-1.616-2.256-2.73-1.72l-5.24 3.03H5.5c-.823 0-1.5.677-1.5 1.5v6c0 .823.677 1.5 1.5 1.5h3.03l5.24 3.03c1.114.536 2.73-.384 2.73-1.72V4.06zM15.3 12c0 1.13-.713 2.09-1.714 2.523.541-.413.996-.96 1.298-1.606.865-2.06.233-4.815-1.426-5.93.45.784.714 1.64.714 2.513z"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 4.06c0-1.336-1.616-2.256-2.73-1.72l-5.24 3.03H5.5c-.823 0-1.5.677-1.5 1.5v6c0 .823.677 1.5 1.5 1.5h3.03l5.24 3.03c1.114.536 2.73-.384 2.73-1.72V4.06zM15.3 12c0 1.13-.713 2.09-1.714 2.523.541-.413.996-.96 1.298-1.606.865-2.06.233-4.815-1.426-5.93.45.784.714 1.64.714 2.513z"/></svg>
          )}
        </button>

        {/* Play/Pause Button */}
        <button 
          onClick={onTogglePlay}
          className={`w-20 h-20 rounded-full border-4 shadow-xl flex items-center justify-center transition-transform active:scale-95 ${
            isPlaying 
              ? 'bg-orange-500 border-orange-700 ring-4 ring-orange-300 animate-pulse' 
              : 'bg-green-500 border-green-700 hover:bg-green-400'
          }`}
        >
          {isPlaying ? (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          ) : (
            <svg className="w-8 h-8 text-white translate-x-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        {/* Volume/Info Button */}
        <button
            className="w-12 h-12 rounded-full border-2 border-sky-300 bg-sky-100 text-sky-700 shadow-lg hover:bg-white transition-all active:scale-95 flex items-center justify-center"
            title="Thông tin bài hát"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
        </button>
      </div>

      {/* Song Selection Modal */}
      {showSongList && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowSongList(false)}>
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full text-center animate-float transform transition-all border-4 border-sky-300 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowSongList(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-xl font-bold text-sky-800 mb-4">Chọn Băng Nhạc</h3>
            <div className="space-y-3">
              {songs.map((song, index) => (
                <button
                  key={index}
                  onClick={() => handleSongSelect(song.filename, song.displayName)}
                  className="w-full bg-sky-100 hover:bg-sky-200 text-sky-700 border-2 border-sky-300 px-4 py-3 rounded-lg font-bold shadow-md transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                  <span>{song.displayName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />
    </div>
  );
};
