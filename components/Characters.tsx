import React, { useState } from 'react';

export const Characters: React.FC = () => {
  // Hàm tạo vị trí ngẫu nhiên trong khoảng an toàn của màn hình (tránh bị che khuất quá nhiều)
  const getRandomPosition = () => {
    const top = Math.floor(Math.random() * 70) + 10; // 10% - 80% chiều cao
    const left = Math.floor(Math.random() * 80) + 5; // 5% - 85% chiều rộng
    const rotate = Math.floor(Math.random() * 40) - 20; // Xoay nhẹ từ -20 đến 20 độ
    return { top: `${top}%`, left: `${left}%`, transform: `rotate(${rotate}deg)` };
  };

  // State vị trí cho Nick và Judy
  const [nickPos, setNickPos] = useState({ top: '15%', left: '75%', transform: 'rotate(12deg)' });
  const [judyPos, setJudyPos] = useState({ top: '75%', left: '10%', transform: 'rotate(-12deg)' });

  // State for speech bubbles
  const [nickBubble, setNickBubble] = useState(false);
  const [judyBubble, setJudyBubble] = useState(false);

  // Hàm xử lý khi click vào bất kỳ nhân vật nào
  const handleMoveBoth = () => {
    setNickPos(getRandomPosition());
    setJudyPos(getRandomPosition());
    setNickBubble(true);
    setJudyBubble(true);
    // Hide bubbles after 3 seconds
    setTimeout(() => {
      setNickBubble(false);
      setJudyBubble(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      
      {/* Nick Wilde */}
      <div 
        onClick={handleMoveBoth}
        style={nickPos}
        className="absolute w-32 h-32 md:w-40 md:h-40 pointer-events-auto cursor-pointer transition-all duration-1000 ease-in-out hover:scale-110 group"
      >
        <div className="w-full h-full rounded-full border-4 border-orange-500 shadow-xl overflow-hidden bg-orange-100 relative">
             <img 
                src="https://media.tenor.com/N34U-sr6cIwAAAAe/really.png" 
                alt="Nick Wilde" 
                className="w-full h-full object-cover scale-125 translate-y-2 group-hover:scale-135 transition-transform"
             />
        </div>
        <div className="absolute -bottom-2 w-full text-center">
            <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-orange-800 shadow-md">Nick</span>
        </div>
        {/* Speech Bubble for Nick */}
        {nickBubble && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-lg border-2 border-orange-300 animate-fade-in">
            <div className="text-sm font-bold text-orange-800">Anh thích em ❤️</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        )}
      </div>

      {/* Judy Hopps */}
      <div
        onClick={handleMoveBoth}
        style={judyPos}
        className="absolute w-28 h-28 md:w-36 md:h-36 pointer-events-auto cursor-pointer transition-all duration-1000 ease-in-out hover:scale-110 group"
      >
        <div className="w-full h-full rounded-full border-4 border-sky-500 shadow-xl overflow-hidden bg-sky-100 relative">
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsNzkX9z2tb0G0OsIkyL06TDYnucUUBO-ZFw&s"
                alt="Judy Hopps"
                className="w-full h-full object-cover scale-110 translate-y-1 group-hover:scale-125 transition-transform"
            />
        </div>
        <div className="absolute -bottom-2 w-full text-center">
            <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-sky-800 shadow-md">Judy</span>
        </div>
        {/* Speech Bubble for Judy */}
        {judyBubble && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-lg border-2 border-sky-300 animate-fade-in">
            <div className="text-sm font-bold text-sky-800">Cúttt điiii kinh quáaaa! </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        )}
      </div>

    </div>
  );
};