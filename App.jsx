import React, { useState, useEffect } from 'react';
import { Play, Pause, ZoomIn, ZoomOut, Music } from 'lucide-react';

// 測試用歌詞資料（支援 [Chord] 格式）
const sampleSong = {
  title: "愛錯",
  artist: "王力宏",
  originalKey: "C#",
  lyrics: `[C] 我來到你的城市
[G] 走過你來時的路
[Am] 想像著沒有你的日子
[F] 是不是會很孤獨`
};

export default function App() {
  const [fontSize, setFontSize] = useState(24); // 預設字體大小
  const [isScrolling, setIsScrolling] = useState(false); // 自動滾動開關
  const [scrollSpeed, setScrollSpeed] = useState(2); // 滾動速度

  // 自動滾動效果
  useEffect(() => {
    let interval;
    if (isScrolling) {
      interval = setInterval(() => {
        window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isScrolling, scrollSpeed]);

  // 將 [Chord]歌詞 格式解析為 HTML (和弦在上，歌詞在下)
  const parseLine = (line) => {
    const regex = /\[(.*?)\]([^\[]*)/g;
    let match;
    const parts = [];

    // 如果整行沒有和弦標註
    if (!line.includes('[')) {
      return <div className="py-1">{line}</div>;
    }

    while ((match = regex.exec(line)) !== null) {
      parts.push({ chord: match[1], text: match[2] });
    }

    return (
      <div className="flex flex-wrap items-end gap-x-2 my-2">
        {parts.map((part, index) => (
          <div key={index} className="flex flex-col items-start">
            {/* 和弦：藍色突顯 */}
            <span className="text-blue-400 font-bold text-lg leading-none mb-1">
              {part.chord}
            </span>
            {/* 歌詞 */}
            <span className="leading-tight">{part.text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 pb-24 font-sans">
      {/* 頂部導覽列 */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <Music className="text-blue-500" />
          <h1 className="text-xl font-bold tracking-wide">StageNote</h1>
        </div>
        <span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-semibold">
          演出模式
        </span>
      </header>

      {/* 歌曲資訊卡片 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-1">{sampleSong.title}</h2>
        <p className="text-slate-400 text-sm">{sampleSong.artist}</p>
        <div className="mt-3 inline-block bg-slate-800 px-3 py-1 rounded-md text-xs font-mono text-slate-300">
          Key: <span className="text-yellow-400 font-bold">{sampleSong.originalKey}</span>
        </div>
      </div>

      {/* 歌詞顯示區 */}
      <main className="leading-relaxed tracking-wider" style={{ fontSize: `${fontSize}px` }}>
        {sampleSong.lyrics.split('\n').map((line, idx) => (
          <div key={idx}>{parseLine(line)}</div>
        ))}
      </main>

      {/* 底部控制列（固定在螢幕下方） */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-3 flex justify-around items-center">
        {/* 字體縮小 */}
        <button 
          onClick={() => setFontSize(prev => Math.max(16, prev - 2))}
          className="p-3 bg-slate-800 rounded-full active:scale-95 transition"
        >
          <ZoomOut size={20} />
        </button>

        {/* 自動滾動 播放/暫停 */}
        <button 
          onClick={() => setIsScrolling(!isScrolling)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition active:scale-95 ${
            isScrolling ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
          }`}
        >
          {isScrolling ? <Pause size={20} /> : <Play size={20} />}
          <span>{isScrolling ? '暫停滾動' : '開始滾動'}</span>
        </button>

        {/* 字體放大 */}
        <button 
          onClick={() => setFontSize(prev => Math.min(40, prev + 2))}
          className="p-3 bg-slate-800 rounded-full active:scale-95 transition"
        >
          <ZoomIn size={20} />
        </button>
      </div>
    </div>
  );
}
