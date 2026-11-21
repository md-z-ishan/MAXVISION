import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCamera, FaDownload, FaStopCircle, FaRedo,
  FaSearchPlus, FaSearchMinus, FaArrowUp, FaArrowDown,
  FaCheck, FaTimes
} from 'react-icons/fa';
import { MdFlipCameraAndroid } from 'react-icons/md';
import { BsCameraVideoFill, BsCameraVideoOffFill } from 'react-icons/bs';

// ─── Glasses Collection ───────────────────────────────────────────────
const frames = [
  {
    id: 1, name: 'Classic Black', brand: 'Ray-Ban Style',
    category: 'eyeglasses', type: 'rectangle',
    frameColor: '#111111', lensColor: 'rgba(20,20,20,0.18)',
    thumb: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 2, name: 'Gold Aviator', brand: 'Pilot Classic',
    category: 'sunglasses', type: 'aviator',
    frameColor: '#C9A42C', lensColor: 'rgba(0,80,80,0.42)',
    thumb: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 3, name: 'Brown Round', brand: 'Vintage Circle',
    category: 'eyeglasses', type: 'round',
    frameColor: '#6B3A2A', lensColor: 'rgba(100,60,30,0.14)',
    thumb: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 4, name: 'Pink Cat Eye', brand: 'Fashion Forward',
    category: 'eyeglasses', type: 'catEye',
    frameColor: '#D4688A', lensColor: 'rgba(212,104,138,0.14)',
    thumb: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 5, name: 'Navy Wayfarer', brand: 'Street Style',
    category: 'sunglasses', type: 'wayfarer',
    frameColor: '#1a237e', lensColor: 'rgba(10,20,80,0.52)',
    thumb: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 6, name: 'Silver Geometric', brand: 'Modern Edge',
    category: 'eyeglasses', type: 'geometric',
    frameColor: '#757575', lensColor: 'rgba(100,100,120,0.12)',
    thumb: 'https://images.unsplash.com/photo-1485053329638-4e9f0ba3de14?w=320&h=200&fit=crop&auto=format',
  },
];

// ─── SVG Glasses Overlays ─────────────────────────────────────────────
const GlassesSVG = ({ frame }) => {
  const { frameColor: fc, lensColor: lc, type } = frame;
  const sw = 7; // stroke-width

  if (type === 'rectangle') return (
    <svg viewBox="0 0 400 140" width="100%" style={{ display: 'block' }}>
      {/* temples */}
      <line x1="0" y1="58" x2="22" y2="58" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      <line x1="378" y1="58" x2="400" y2="58" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      {/* left lens */}
      <rect x="22" y="20" width="150" height="90" rx="12" ry="12" fill={lc} stroke={fc} strokeWidth={sw} />
      {/* bridge */}
      <path d="M172 55 Q200 42 228 55" fill="none" stroke={fc} strokeWidth={sw - 1} />
      {/* right lens */}
      <rect x="228" y="20" width="150" height="90" rx="12" ry="12" fill={lc} stroke={fc} strokeWidth={sw} />
      {/* nose pads */}
      <ellipse cx="175" cy="62" rx="5" ry="7" fill={fc} opacity="0.5" />
      <ellipse cx="225" cy="62" rx="5" ry="7" fill={fc} opacity="0.5" />
    </svg>
  );

  if (type === 'aviator') return (
    <svg viewBox="0 0 400 155" width="100%" style={{ display: 'block' }}>
      <line x1="0" y1="52" x2="22" y2="52" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      <line x1="378" y1="52" x2="400" y2="52" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      {/* double bridge */}
      <path d="M165 44 Q200 32 235 44" fill="none" stroke={fc} strokeWidth={sw - 2} />
      <path d="M165 56 Q200 44 235 56" fill="none" stroke={fc} strokeWidth={sw - 2} />
      {/* left lens (teardrop) */}
      <path d="M22 25 Q22 10 97 10 Q165 10 165 55 Q165 115 97 125 Q22 115 22 65 Z"
        fill={lc} stroke={fc} strokeWidth={sw} />
      {/* right lens (teardrop) */}
      <path d="M378 25 Q378 10 303 10 Q235 10 235 55 Q235 115 303 125 Q378 115 378 65 Z"
        fill={lc} stroke={fc} strokeWidth={sw} />
      <ellipse cx="168" cy="52" rx="5" ry="6" fill={fc} opacity="0.6" />
      <ellipse cx="232" cy="52" rx="5" ry="6" fill={fc} opacity="0.6" />
    </svg>
  );

  if (type === 'round') return (
    <svg viewBox="0 0 400 140" width="100%" style={{ display: 'block' }}>
      <line x1="0" y1="60" x2="30" y2="60" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      <line x1="370" y1="60" x2="400" y2="60" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      {/* left circle */}
      <circle cx="105" cy="62" r="75" fill={lc} stroke={fc} strokeWidth={sw} />
      {/* bridge arc */}
      <path d="M180 52 Q200 40 220 52" fill="none" stroke={fc} strokeWidth={sw - 1} />
      {/* right circle */}
      <circle cx="295" cy="62" r="75" fill={lc} stroke={fc} strokeWidth={sw} />
      <ellipse cx="183" cy="58" rx="5" ry="7" fill={fc} opacity="0.5" />
      <ellipse cx="217" cy="58" rx="5" ry="7" fill={fc} opacity="0.5" />
    </svg>
  );

  if (type === 'catEye') return (
    <svg viewBox="0 0 400 140" width="100%" style={{ display: 'block' }}>
      <line x1="0" y1="55" x2="20" y2="55" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      <line x1="380" y1="30" x2="400" y2="22" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      {/* left cat-eye lens */}
      <path d="M20 95 Q20 20 100 15 Q155 12 170 50 Q175 70 160 100 Q100 115 20 95 Z"
        fill={lc} stroke={fc} strokeWidth={sw} />
      {/* bridge */}
      <path d="M170 52 Q200 42 230 52" fill="none" stroke={fc} strokeWidth={sw - 1} />
      {/* right cat-eye lens */}
      <path d="M380 25 Q360 10 300 15 Q245 12 230 50 Q225 70 240 100 Q300 115 380 95 Z"
        fill={lc} stroke={fc} strokeWidth={sw} />
      <ellipse cx="173" cy="58" rx="5" ry="7" fill={fc} opacity="0.5" />
      <ellipse cx="227" cy="58" rx="5" ry="7" fill={fc} opacity="0.5" />
    </svg>
  );

  if (type === 'wayfarer') return (
    <svg viewBox="0 0 400 140" width="100%" style={{ display: 'block' }}>
      <line x1="0" y1="48" x2="18" y2="48" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      <line x1="382" y1="48" x2="400" y2="48" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      {/* left wayfarer (trapezoidal) */}
      <path d="M18 15 L168 15 L175 100 L12 100 Z" fill={lc} stroke={fc} strokeWidth={sw} strokeLinejoin="round" />
      {/* bridge */}
      <path d="M168 44 Q200 34 232 44" fill="none" stroke={fc} strokeWidth={sw} />
      {/* right wayfarer */}
      <path d="M382 15 L232 15 L225 100 L388 100 Z" fill={lc} stroke={fc} strokeWidth={sw} strokeLinejoin="round" />
      {/* thick top bar */}
      <line x1="18" y1="15" x2="168" y2="15" stroke={fc} strokeWidth={sw + 5} strokeLinecap="round" />
      <line x1="232" y1="15" x2="382" y2="15" stroke={fc} strokeWidth={sw + 5} strokeLinecap="round" />
      <ellipse cx="172" cy="50" rx="5" ry="7" fill={fc} opacity="0.5" />
      <ellipse cx="228" cy="50" rx="5" ry="7" fill={fc} opacity="0.5" />
    </svg>
  );

  // geometric / hexagon
  return (
    <svg viewBox="0 0 400 140" width="100%" style={{ display: 'block' }}>
      <line x1="0" y1="58" x2="22" y2="58" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      <line x1="378" y1="58" x2="400" y2="58" stroke={fc} strokeWidth={sw} strokeLinecap="round" />
      {/* left hexagon */}
      <polygon points="52,15 142,15 170,58 142,100 52,100 22,58"
        fill={lc} stroke={fc} strokeWidth={sw} />
      {/* bridge */}
      <path d="M170 50 Q200 40 230 50" fill="none" stroke={fc} strokeWidth={sw - 1} />
      {/* right hexagon */}
      <polygon points="348,15 258,15 230,58 258,100 348,100 378,58"
        fill={lc} stroke={fc} strokeWidth={sw} />
      <ellipse cx="173" cy="58" rx="5" ry="7" fill={fc} opacity="0.5" />
      <ellipse cx="227" cy="58" rx="5" ry="7" fill={fc} opacity="0.5" />
    </svg>
  );
};

// ─── Main Component ───────────────────────────────────────────────────
const VirtualTryOn = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [glassesScale, setGlassesScale] = useState(72);   // % of container width
  const [glassesY, setGlassesY] = useState(32);           // % from top of container
  const [filterCat, setFilterCat] = useState('all');
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('user');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const overlayRef = useRef(null);

  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError('Camera access denied. Please allow camera permission in browser settings.');
      setCameraActive(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  const flipCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  useEffect(() => {
    if (cameraActive) startCamera();
  }, [facingMode]);

  useEffect(() => () => stopCamera(), []);

  // ── Capture Photo ──
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !cameraActive) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    // Mirror for selfie cam
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (facingMode === 'user') {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // Draw glasses overlay if selected
    if (selectedFrame && overlayRef.current) {
      const svgEl = overlayRef.current.querySelector('svg');
      if (svgEl) {
        const svgData = new XMLSerializer().serializeToString(svgEl);
        const img = new Image();
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          // Calculate glasses position on canvas matching CSS overlay
          const gw = canvas.width * (glassesScale / 100);
          const gh = gw * 0.4; // aspect ratio of SVG
          const gx = (canvas.width - gw) / 2;
          const gy = canvas.height * (glassesY / 100);
          ctx.drawImage(img, gx, gy, gw, gh);
          URL.revokeObjectURL(url);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setCapturedImage(dataUrl);
        };
        img.src = url;
        return;
      }
    }
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.92));
  }, [cameraActive, selectedFrame, glassesScale, glassesY, facingMode]);

  const downloadPhoto = useCallback(() => {
    if (!capturedImage) return;
    const a = document.createElement('a');
    a.href = capturedImage;
    a.download = `maxvision-tryon-${Date.now()}.jpg`;
    a.click();
  }, [capturedImage]);

  const filteredFrames = filterCat === 'all'
    ? frames
    : frames.filter(f => f.category === filterCat);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block bg-white/20 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3">
            🕶️ Virtual Try-On
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-2">Try Glasses in Real Time</h1>
          <p className="text-blue-200 max-w-lg mx-auto text-sm">
            Select a frame, start your camera, and see how it looks — no store visit needed.
          </p>
        </motion.div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">

        {/* ══ LEFT PANEL — Frame Selection ══ */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Category tabs */}
            <div className="flex border-b border-gray-100">
              {['all', 'eyeglasses', 'sunglasses'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors
                    ${filterCat === cat
                      ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {cat === 'all' ? 'All' : cat === 'eyeglasses' ? 'Eyeglasses' : 'Sunglasses'}
                </button>
              ))}
            </div>

            <div className="p-4">
              <p className="text-xs text-gray-400 font-semibold mb-3">
                {filteredFrames.length} frames available — click to select
              </p>

              {/* Frame Cards */}
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {filteredFrames.map(frame => (
                  <motion.div
                    key={frame.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFrame(frame.id === selectedFrame?.id ? null : frame)}
                    className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-200
                      ${selectedFrame?.id === frame.id
                        ? 'border-blue-500 shadow-md shadow-blue-100'
                        : 'border-gray-100 hover:border-blue-200'}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative bg-gray-50">
                      <img
                        src={frame.thumb}
                        alt={frame.name}
                        className="w-full h-28 object-cover"
                        loading="lazy"
                      />
                      {/* Glasses color dot */}
                      <span
                        className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: frame.frameColor }}
                      />
                      {selectedFrame?.id === frame.id && (
                        <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <FaCheck size={10} /> Selected
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-2.5">
                      <p className="font-bold text-sm text-gray-900">{frame.name}</p>
                      <p className="text-xs text-gray-400">{frame.brand} · {frame.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ══ RIGHT PANEL — Camera + Try-On ══ */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Camera Viewport */}
          <div className="bg-black rounded-2xl overflow-hidden relative shadow-xl" style={{ aspectRatio: '16/9', minHeight: 300 }}>

            {/* Camera not active placeholder */}
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-gradient-to-br from-gray-900 to-gray-800">
                <BsCameraVideoOffFill size={56} className="text-gray-500 mb-4" />
                <p className="text-lg font-bold text-gray-300 mb-1">Camera is off</p>
                <p className="text-sm text-gray-500 mb-6">Click "Start Camera" to begin try-on</p>
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  <BsCameraVideoFill /> Start Camera
                </button>
                {cameraError && (
                  <p className="mt-4 text-red-400 text-sm bg-red-900/30 px-4 py-2 rounded-lg max-w-xs text-center">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

            {/* Video feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                display: cameraActive ? 'block' : 'none',
              }}
            />

            {/* ── Glasses SVG Overlay ── */}
            {cameraActive && selectedFrame && (
              <div
                ref={overlayRef}
                className="absolute left-1/2 pointer-events-none"
                style={{
                  width: `${glassesScale}%`,
                  transform: 'translateX(-50%)',
                  top: `${glassesY}%`,
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
                  transition: 'top 0.1s, width 0.1s',
                }}
              >
                <GlassesSVG frame={selectedFrame} />
              </div>
            )}

            {/* Guide hint when active but no frame selected */}
            {cameraActive && !selectedFrame && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
                👈 Select a frame from the left panel to try on
              </div>
            )}

            {/* Top toolbar */}
            {cameraActive && (
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={flipCamera}
                  className="bg-black/50 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                  title="Flip camera"
                >
                  <MdFlipCameraAndroid size={18} />
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                  title="Stop camera"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            )}
          </div>

          {/* ── Controls ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Size slider */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2 mb-2">
                  <FaSearchPlus className="text-blue-500" /> Frame Size
                  <span className="ml-auto text-blue-600 font-black">{glassesScale}%</span>
                </label>
                <input
                  type="range" min="40" max="95" value={glassesScale}
                  onChange={e => setGlassesScale(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Smaller</span><span>Larger</span>
                </div>
              </div>

              {/* Vertical position slider */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2 mb-2">
                  <FaArrowUp className="text-blue-500" /> Vertical Position
                  <span className="ml-auto text-blue-600 font-black">{glassesY}%</span>
                </label>
                <input
                  type="range" min="15" max="60" value={glassesY}
                  onChange={e => setGlassesY(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Higher</span><span>Lower</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-5">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  <BsCameraVideoFill /> Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  <FaStopCircle /> Stop Camera
                </button>
              )}

              <button
                onClick={capturePhoto}
                disabled={!cameraActive}
                className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-colors
                  ${cameraActive
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                <FaCamera /> Capture Photo
              </button>

              {capturedImage && (
                <button
                  onClick={downloadPhoto}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  <FaDownload /> Download
                </button>
              )}

              {selectedFrame && (
                <button
                  onClick={() => setSelectedFrame(null)}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-5 py-3 rounded-xl border border-red-200 transition-colors"
                >
                  <FaTimes /> Remove Frame
                </button>
              )}
            </div>
          </div>

          {/* ── Captured Photo Preview ── */}
          <AnimatePresence>
            {capturedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <FaCamera className="text-green-500" /> Captured Photo
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={downloadPhoto}
                      className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaDownload size={12} /> Save Photo
                    </button>
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="text-gray-400 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                <img
                  src={capturedImage}
                  alt="Your try-on"
                  className="w-full rounded-xl max-h-80 object-contain bg-gray-50"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
