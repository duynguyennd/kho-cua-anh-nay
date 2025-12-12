import React, { useState, useRef } from 'react';
import { CassettePlayer } from './components/CassettePlayer';
import { Characters } from './components/Characters';

// Floating Bubbles Component
const FloatingBubbles: React.FC = () => {
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    size: Math.random() * 20 + 10, // 10-30px
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-r from-pink-300 to-purple-300 opacity-60 animate-float"
          style={{
            left: bubble.left,
            top: bubble.top,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDelay: bubble.delay,
            animationDuration: '6s',
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // States for the Ending Card Feature
  const [showCard, setShowCard] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // State for QR Code Modal
  const [showQR, setShowQR] = useState(false);

  // State for button jumping
  const [buttonClicks, setButtonClicks] = useState(0);
  const [buttonPosition, setButtonPosition] = useState({ top: 'auto', left: 'auto' });

  // State for card image - use fixed image from public folder
  const cardImageUrl = '/images/card-image.jpg';

  const handleTogglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioRef.current.src) {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            alert("Không thể phát nhạc. Vui lòng thử lại.");
          }
        } else {
          alert("Hãy tải băng nhạc lên trước nhé!");
        }
      }
    }
  };

  const handleSongSelected = (filename: string) => {
    if (audioRef.current) {
      audioRef.current.src = `/music/${filename}`;
      audioRef.current.load(); // Ensure the audio is loaded
      setIsPlaying(false);
      // Reset card state when new song is selected
      setShowCard(false);
      setShowFinalMessage(false);
      // Reset button jumping state
      setButtonClicks(0);
      setButtonPosition({ top: 'auto', left: 'auto' });
    }
  };

  const handlePlaybackComplete = () => {
    setShowCard(true);
  };

  const handleEncouragementClick = () => {
    const newClicks = buttonClicks + 1;
    setButtonClicks(newClicks);
    if (newClicks < 5) {
      // Move button to random position within the container
      setButtonPosition({
        top: `${Math.random() * 60 + 20}%`,
        left: `${Math.random() * 60 + 20}%`
      });
    } else {
      // After 5 clicks, show the final message
      setShowFinalMessage(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Not used - image is fixed
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&color=0369a1`;

  return (
    <div className="relative min-h-screen bg-pulse-theme flex flex-col items-center justify-center p-4 overflow-hidden">

      {/* Floating Bubbles Background */}
      <FloatingBubbles />

      {/* QR Code Button (Top Right) */}
      <button 
        onClick={() => setShowQR(true)}
        className="fixed top-4 right-4 z-50 bg-white/50 hover:bg-white p-2 rounded-xl shadow-sm border border-sky-200 text-sky-700 transition-all hover:scale-110"
        title="Lấy mã QR chia sẻ"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 6h6v6H6V6zm12 0h6v6h-6V6zm-6 12h6v6h-6v-6z"></path></svg>
      </button>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
           <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-xs w-full text-center animate-float transform transition-all border-4 border-sky-300 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowQR(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <h3 className="text-xl font-bold text-sky-800 mb-4">Quét để mở Kho Nhạc</h3>
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 mb-4 inline-block">
                <img src={qrImageUrl} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
              </div>
              <p className="text-xs text-sky-500">Đưa camera vào để mở web trên điện thoại khác nhé!</p>
           </div>
        </div>
      )}

      {/* Final Cute Message Overlay */}
      {showFinalMessage && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in duration-700">
          <div className="relative">
             <div className="absolute inset-0 bg-pink-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
             <svg className="w-40 h-40 text-pink-500 animate-bounce relative z-10 drop-shadow-xl" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
             </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-pink-600 mt-8 text-center drop-shadow-sm" style={{fontFamily: 'Nunito, sans-serif'}}>
             Giỏi lắm em tắt được rồi này
          </h2>
        </div>
      )}

      {/* Ending Card Overlay (Hide if Final Message is showing) */}
      {showCard && !showFinalMessage && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center relative border-4 border-sky-200 transform rotate-1">
             {/* Decorative Tape */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-orange-200/80 rotate-[-2deg] shadow-sm"></div>
             
             {/* Image */}
             <div className="mb-4 rounded-lg overflow-hidden border-2 border-gray-100">
               <img 
                 src={cardImageUrl} 
                 alt="Memory" 
                 className="w-full h-auto object-contain bg-gradient-to-br from-sky-50 to-pink-50"
               />
             </div>

             {/* Personal Message */}
             <h2 className="text-2xl font-bold text-sky-800 mb-2" style={{fontFamily: 'Nunito, sans-serif'}}>
               Gửi Tới em
               
             </h2>
             <p className="text-gray-600 mb-6 italic" style={{fontFamily: 'cursive'}}>
               "Cảm ơn vì đã lắng nghe. Dù hôm nay có thế nào, hãy luôn nhớ rằng em là người tuyệt vời và xứng đáng với những điều tốt đẹp nhất. có gì a vẫn đợi đó nha!"
             </p>

             {/* Encouragement Button */}
             <div className="relative w-full h-20 flex justify-center items-center">
                <button
                  onClick={handleEncouragementClick}
                  style={{
                    position: buttonClicks >= 5 ? 'absolute' : 'relative',
                    top: buttonPosition.top,
                    left: buttonPosition.left,
                    transform: buttonClicks >= 5 ? 'translate(-50%, -50%)' : 'none'
                  }}
                  className={`bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 z-50 text-lg uppercase tracking-wider ${buttonClicks >= 5 ? 'animate-bounce-random' : ''}`}
                >
                  Tắt đây!
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Decorative Characters */}
      <Characters />

      {/* Main Content Area */}
      <div className="z-20 w-full max-w-4xl flex flex-col items-center gap-8">
        
        {/* Header / Logo */}
        <div className="text-center animate-float">
            <h1 className="text-5xl md:text-7xl font-black text-sky-800 tracking-tighter drop-shadow-sm uppercase hover:scale-105 transition-transform duration-300">
                KHO CỦA <span className="text-orange-500 animate-pulse">ANH NÀY</span>
            </h1>
            <p className="text-sky-600 font-bold mt-2 text-lg animate-bounce">Máy phát nhạc cá nhân</p>
        </div>

        {/* The Cassette Player */}
        <div className="w-full">
            <CassettePlayer
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                onSongSelected={handleSongSelected}
                audioRef={audioRef}
                onPlaybackComplete={handlePlaybackComplete}
            />
        </div>

      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 text-center text-sky-400 text-xs w-full opacity-60">
        © 2025 Kho Của Anh Này. Music Player.
      </div>
    </div>
  );
}

export default App;