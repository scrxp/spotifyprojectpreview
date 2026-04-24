import React, { useState, useRef } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { ChevronLeft, MoreHorizontal, Heart, Download, Play, Shuffle, Plus, Trash2, Image as ImageIcon, Check, PenSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const EditableText = ({ value, onChange, className, isEditing, singleLine = true }: any) => {
  if (!isEditing) return <span className={className}>{value}</span>;
  
  return (
    <span
      className={`inline-block min-w-[20px] outline-none border-b hover:border-white/50 focus:border-[#1DB954] border-white/20 transition-colors empty:before:content-['Empty'] empty:before:text-white/30 cursor-text ${className}`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent || '')}
      onKeyDown={(e) => {
        if (singleLine && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    >
      {value}
    </span>
  );
};

const ExplicitIcon = () => (
  <span className="inline-flex flex-shrink-0 items-center justify-center bg-zinc-700 text-zinc-300 text-[8px] font-bold px-[3px] py-[1px] rounded-[2px] leading-none mr-2 uppercase">
    E
  </span>
);

export default function App() {
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const artistFileInputRef = useRef<HTMLInputElement>(null);
  
  const [albumData, setAlbumData] = useState({
    title: 'ASTROWORLD',
    artist: 'Travis Scott',
    type: 'Album',
    year: '2018',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=500&h=500',
    artistUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=500&h=500',
    color: '#654b38', // initial gradient color matching placeholder
  });

  const [tracks, setTracks] = useState([
    { id: '1', title: 'STARGAZING', artist: 'Travis Scott', explicit: true },
    { id: '2', title: 'CAROUSEL', artist: 'Travis Scott', explicit: true },
    { id: '3', title: 'SICKO MODE', artist: 'Travis Scott', explicit: true },
    { id: '4', title: 'R.I.P. SCREW', artist: 'Travis Scott, Swae Lee', explicit: false },
    { id: '5', title: 'STOP TRYING TO BE GOD', artist: 'Travis Scott', explicit: true },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create local object URL
    const url = URL.createObjectURL(file);
    setAlbumData(prev => ({ ...prev, coverUrl: url }));
    
    // Extract background color
    const fac = new FastAverageColor();
    fac.getColorAsync(url)
      .then(color => {
        setAlbumData(prev => ({ ...prev, color: color.hex }));
      })
      .catch(e => {
        console.error("Failed to extract color", e);
      });
  };

  const handleArtistImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setAlbumData(prev => ({ ...prev, artistUrl: url }));
  };

  const addTrack = () => {
    const newTrack = { 
      id: Math.random().toString(36).substring(7), 
      title: 'New Track', 
      artist: albumData.artist, 
      explicit: false 
    };
    setTracks([...tracks, newTrack]);
  };

  const removeTrack = (id: string) => {
    setTracks(tracks.filter(t => t.id !== id));
  };

  const updateTrack = (id: string, updates: any) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#090909] sm:p-8 font-sans text-white">
      {/* Mobile Frame Container (Applies on tablet/desktop) */}
      <div className="w-full h-full sm:h-[844px] sm:w-[390px] bg-black sm:rounded-[40px] sm:border-[8px] border-[#1a1a1a] relative overflow-hidden flex flex-col shadow-2xl selection:bg-[#1DB954] selection:text-black">
        
        {/* Colorful Gradient Backdrop */}
        <div 
          className="absolute inset-0 transition-colors duration-1000 ease-in-out pointer-events-none opacity-90"
          style={{ 
            background: `linear-gradient(to bottom, ${albumData.color} 0%, black 50%)`
          }}
        />
        
        {/* Scrollable Content Area */}
        <div className="relative z-10 flex-col flex h-full overflow-y-auto scrollbar-hide">
          
          {/* Header */}
          <div className="flex justify-between items-center px-6 pt-10 mb-6 sticky top-0 z-20">
            <button className="rounded-full bg-black/20 p-1 hover:bg-black/40 transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button className="rounded-full bg-black/20 p-2 hover:bg-black/40 transition-colors sm:hidden">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Cover Art Area */}
          <div className="px-10 mb-8 flex justify-center">
            <div 
              className={`w-56 h-56 shadow-2xl relative group bg-gradient-to-br from-zinc-700 to-zinc-900 ${editMode ? 'cursor-pointer ring-4 ring-[#1DB954]/50' : ''}`}
              onClick={() => editMode && fileInputRef.current?.click()}
            >
              <img src={albumData.coverUrl} className="w-full h-full object-cover" alt="Album Cover" />
              {editMode && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center hover:bg-black/40 transition-colors backdrop-blur-sm">
                  <ImageIcon className="w-10 h-10 mb-2 text-white" />
                  <span className="font-bold text-sm text-white drop-shadow-md">Change Art</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          {/* Album Title & Metadata */}
          <div className="px-6 mb-6">
            <h2 className="text-2xl font-bold mb-1 text-white">
              <EditableText 
                isEditing={editMode} 
                value={albumData.title} 
                onChange={(val: string) => setAlbumData({...albumData, title: val})} 
                singleLine={false} 
              />
            </h2>
            
            <div className="flex items-center gap-2 mb-4">
              <div 
                className={`w-5 h-5 rounded-full bg-zinc-700 overflow-hidden flex-shrink-0 relative group ${editMode ? 'cursor-pointer ring-2 ring-[#1DB954]/50' : ''}`}
                onClick={() => editMode && artistFileInputRef.current?.click()}
              >
                <img src={albumData.artistUrl} className="w-full h-full object-cover" alt="Artist Profile" />
                {editMode && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                     <ImageIcon className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <input type="file" ref={artistFileInputRef} className="hidden" accept="image/*" onChange={handleArtistImageUpload} />
              <span className="text-xs font-bold text-white hover:underline cursor-pointer">
                <EditableText 
                  isEditing={editMode} 
                  value={albumData.artist} 
                  onChange={(val: string) => setAlbumData({...albumData, artist: val})} 
                />
              </span>
            </div>
            
            <div className="text-[10px] text-zinc-400 font-medium mb-4 tracking-wider flex gap-1 items-center">
              <EditableText 
                isEditing={editMode} 
                value={albumData.type} 
                onChange={(val: string) => setAlbumData({...albumData, type: val})} 
              />
              <span> • </span>
              <EditableText 
                isEditing={editMode} 
                value={albumData.year} 
                onChange={(val: string) => setAlbumData({...albumData, year: val})} 
              />
            </div>
          </div>

          {/* Sticky Actions Row */}
          <div className="px-6 py-2 flex justify-between items-center sticky top-[50px] z-10 transition-colors bg-black/80 backdrop-blur-xl">
            <div className="flex items-center gap-5">
              <button>
                <Heart className="w-6 h-6 text-[#1DB954] fill-[#1DB954]" />
              </button>
              <button>
                <Download className="w-5 h-5 text-[#b3b3b3]" />
              </button>
              <button className="hidden sm:block">
                <MoreHorizontal className="w-6 h-6 text-[#b3b3b3]" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button>
                <Shuffle className="w-6 h-6 text-[#1DB954]" />
              </button>
              <button className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 transition-transform hover:bg-[#3be477] shadow-xl">
                <Play className="w-6 h-6 text-black fill-black ml-1" />
              </button>
            </div>
          </div>

          {/* Tracklist Area */}
          <div className="px-6 mt-6 pb-40 flex flex-col gap-5">
            <AnimatePresence mode="popLayout">
              {tracks.map((track) => (
                <motion.div 
                  key={track.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    {/* Delete Toggle (Edit Mode Only) */}
                    {editMode && (
                      <motion.button 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        exit={{ scale: 0 }}
                        onClick={() => removeTrack(track.id)} 
                        className="text-red-500 p-2 -ml-2 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                    
                    <div className="flex flex-col min-w-0 flex-1 gap-1">
                      <div className="text-sm font-medium text-white truncate">
                        <EditableText 
                          isEditing={editMode} 
                          value={track.title} 
                          onChange={(v: string) => updateTrack(track.id, {title: v})} 
                        />
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate flex items-center">
                        {/* Explicit Badge */}
                        {track.explicit && !editMode && <ExplicitIcon />}
                        
                        {editMode && (
                          <label className="mr-2 flex items-center gap-1 cursor-pointer bg-gray-800 px-1 py-0.5 rounded text-white text-[10px] uppercase font-bold shrink-0 hover:bg-gray-700 transition" title="Toggle Explicit">
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={track.explicit} 
                              onChange={(e) => updateTrack(track.id, {explicit: e.target.checked})} 
                            />
                            {track.explicit ? 'E (On)' : 'E (Off)'}
                          </label>
                        )}
                        
                        <EditableText 
                          isEditing={editMode} 
                          value={track.artist} 
                          onChange={(v: string) => updateTrack(track.id, {artist: v})} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Actions */}
                  {!editMode && (
                    <button className="shrink-0 ml-4">
                      <MoreHorizontal className="w-5 h-5 text-[#b3b3b3]" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Track Button (Edit Mode Only) */}
            {editMode && (
              <motion.button
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={addTrack}
                className="mt-6 flex items-center justify-center gap-2 py-4 rounded-full border-2 border-dashed border-gray-600/50 text-[#a7a7a7] font-bold hover:bg-white/5 hover:text-white transition-colors"
              >
                <Plus className="w-5 h-5" /> Add Track
              </motion.button>
            )}
          </div>
        </div>

        {/* Floating Customizer Toggle */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-full shadow-2xl"
          initial={{ y: 100 }} 
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
        >
          <button 
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 ${
              editMode 
                ? 'bg-white text-black hover:scale-105' 
                : 'bg-black/90 backdrop-blur-md text-white border border-white/10 hover:bg-gray-900 border-b-4 hover:border-b-white/20'
            }`}
          >
            {editMode ? (
              <>
                <Check className="w-5 h-5" /> Done Editing
              </>
            ) : (
              <>
                <PenSquare className="w-5 h-5" /> Customize Album
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
