import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCamera, FaDownload, FaUpload, FaCheck, FaTimes,
  FaSlidersH, FaArrowsAlt, FaPlus, FaCheckCircle,
  FaSpinner, FaGlasses, FaTrash
} from 'react-icons/fa';
import { MdFlipCameraAndroid } from 'react-icons/md';
import { BsCameraVideoFill } from 'react-icons/bs';
import axios from '../api/axios';

// ── Built-in Store Glasses (Using Real Photographic Images) ──
const INITIAL_STORE_GLASSES = [
  {
    id: 'rb-wayfarer-classic',
    name: 'Ray-Ban Wayfarer Classic',
    brand: 'Ray-Ban',
    category: 'sunglasses',
    price: 9990,
    imageSrc: '/images/sunglasses_rectangle_1778585337465.png',
  },
  {
    id: 'rb-aviator-gold',
    name: 'Ray-Ban Aviator Classic',
    brand: 'Ray-Ban',
    category: 'sunglasses',
    price: 11990,
    imageSrc: '/images/sunglasses_aviator_1778585307519.png',
  },
  {
    id: 'oakley-holbrook-sport',
    name: 'Oakley Holbrook Sport',
    brand: 'Oakley',
    category: 'sunglasses',
    price: 15490,
    imageSrc: '/images/sunglasses_square_1778585405954.png',
  },
  {
    id: 'vc-cateye-glam',
    name: 'Vincent Chase Cat-Eye Glam',
    brand: 'Vincent Chase',
    category: 'sunglasses',
    price: 1699,
    imageSrc: '/images/sunglasses_cateye_1778585356948.png',
  },
  {
    id: 'asif-retro-round',
    name: 'Asif Collections Round Retro',
    brand: 'Asif Collections',
    category: 'sunglasses',
    price: 999,
    imageSrc: '/images/sunglasses_round_1778585321001.png',
  },
  {
    id: 'vintage-clubmaster-sun',
    name: 'Vintage Clubmaster Sun',
    brand: 'MAXVISION Sun',
    category: 'sunglasses',
    price: 2499,
    imageSrc: '/images/sunglasses_clubmaster_1778585391348.png',
  },
  {
    id: 'fastrack-sport-geo',
    name: 'Fastrack Sport Geometric',
    brand: 'Fastrack',
    category: 'sunglasses',
    price: 1495,
    imageSrc: '/images/sunglasses_geometric_1778585376931.png',
  },
  {
    id: 'vc-rectangle-black',
    name: 'Ray-Ban Highstreet Rectangle',
    brand: 'Ray-Ban',
    category: 'eyeglasses',
    price: 6990,
    imageSrc: '/images/eyeglasses_rectangle_1778585167025.png',
  },
  {
    id: 'rb-clubmaster-optical',
    name: 'Ray-Ban Clubmaster Optical',
    brand: 'Ray-Ban',
    category: 'eyeglasses',
    price: 8990,
    imageSrc: '/images/eyeglasses_clubmaster_1778585256926.png',
  },
  {
    id: 'oakley-crosslink-rx',
    name: 'Oakley Crosslink RX',
    brand: 'Oakley',
    category: 'eyeglasses',
    price: 12990,
    imageSrc: '/images/eyeglasses_square_1778585274768.png',
  },
  {
    id: 'titan-round-nxt',
    name: 'Titan Eye+ NXT Round',
    brand: 'Titan Eye+',
    category: 'eyeglasses',
    price: 3490,
    imageSrc: '/images/eyeglasses_round_1778585243803.png',
  },
  {
    id: 'vc-cateye-pink',
    name: 'Vincent Chase Cat-Eye Rose',
    brand: 'Vincent Chase',
    category: 'eyeglasses',
    price: 1999,
    imageSrc: '/images/eyeglasses_cateye_1778585181224.png',
  },
  {
    id: 'jj-aviator-silver',
    name: 'John Jacobs Aviator Steel',
    brand: 'John Jacobs',
    category: 'eyeglasses',
    price: 4490,
    imageSrc: '/images/eyeglasses_aviator_1778585200650.png',
  },
  {
    id: 'vp-geometric-hex',
    name: 'Vision Plus Hexagonal',
    brand: 'Vision Plus',
    category: 'eyeglasses',
    price: 1799,
    imageSrc: '/images/eyeglasses_geometric_1778585220940.png',
  },
];

// ── In-Memory Cache for Transparent Cutout Images ──
const transparentImageCache = new Map();

/**
 * Automatically removes white background and trims to bounding box of glasses.
 * Returns { imageElement, aspectRatio }
 */
const prepareTransparentGlasses = (src) => {
  if (transparentImageCache.has(src)) {
    return Promise.resolve(transparentImageCache.get(src));
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const rawW = img.naturalWidth || img.width;
        const rawH = img.naturalHeight || img.height;

        const c = document.createElement('canvas');
        c.width = rawW;
        c.height = rawH;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, rawW, rawH);
        const data = imgData.data;

        // Sample background lightness from edges
        let minX = rawW;
        let minY = rawH;
        let maxX = 0;
        let maxY = 0;
        let hasForeground = false;

        for (let y = 0; y < rawH; y++) {
          for (let x = 0; x < rawW; x++) {
            const idx = (y * rawW + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // White/near-white or light grey background threshold
            if (r > 230 && g > 230 && b > 230) {
              data[idx + 3] = 0; // Make transparent
            } else if (r > 205 && g > 205 && b > 205) {
              // Smooth boundary
              data[idx + 3] = Math.floor(data[idx + 3] * 0.35);
            } else {
              hasForeground = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        // Put transparent image data back
        ctx.putImageData(imgData, 0, 0);

        // Auto-trim to actual glasses boundaries if detected
        let finalCanvas = c;
        if (hasForeground && maxX > minX && maxY > minY) {
          const trimW = Math.max(10, maxX - minX + 1);
          const trimH = Math.max(10, maxY - minY + 1);
          const trimC = document.createElement('canvas');
          trimC.width = trimW;
          trimC.height = trimH;
          const trimCtx = trimC.getContext('2d');
          trimCtx.drawImage(c, minX, minY, trimW, trimH, 0, 0, trimW, trimH);
          finalCanvas = trimC;
        }

        const outImg = new Image();
        outImg.onload = () => {
          const res = {
            image: outImg,
            aspectRatio: finalCanvas.height / finalCanvas.width,
          };
          transparentImageCache.set(src, res);
          resolve(res);
        };
        outImg.src = finalCanvas.toDataURL('image/png');
      } catch (err) {
        // Fallback for CORS or canvas errors
        const fallback = {
          image: img,
          aspectRatio: (img.naturalHeight || 1) / (img.naturalWidth || 2.5),
        };
        transparentImageCache.set(src, fallback);
        resolve(fallback);
      }
    };

    img.onerror = () => {
      resolve(null);
    };

    img.src = src;
  });
};

const VirtualTryOn = () => {
  // ── States ──
  const [framesList, setFramesList] = useState(() => {
    try {
      const saved = localStorage.getItem('maxvision_owner_glasses');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_STORE_GLASSES];
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_STORE_GLASSES;
  });

  const [selectedFrame, setSelectedFrame] = useState(INITIAL_STORE_GLASSES[0]);
  const [filterCat, setFilterCat] = useState('all');
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const [cameraError, setCameraError] = useState('');
  const [aiStatus, setAiStatus] = useState('Standby');
  const [autoFit, setAutoFit] = useState(true);
  const [scaleOffset, setScaleOffset] = useState(1.0);
  const [yOffset, setYOffset] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessingCutout, setIsProcessingCutout] = useState(false);

  // ── Owner Add Glasses Modal State ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFrameName, setNewFrameName] = useState('');
  const [newFrameBrand, setNewFrameBrand] = useState('MAXVISION');
  const [newFramePrice, setNewFramePrice] = useState('2999');
  const [newFrameCategory, setNewFrameCategory] = useState('sunglasses');
  const [newFramePreview, setNewFramePreview] = useState(null);

  // ── Stable Refs for 60fps Canvas Loop ──
  const selectedFrameRef = useRef(selectedFrame);
  const autoFitRef = useRef(autoFit);
  const scaleOffsetRef = useRef(scaleOffset);
  const yOffsetRef = useRef(yOffset);
  const loadedCutoutRef = useRef(null); // Currently prepared transparent Image object

  // Synchronize state to refs
  useEffect(() => {
    selectedFrameRef.current = selectedFrame;
    if (selectedFrame?.imageSrc) {
      setIsProcessingCutout(true);
      prepareTransparentGlasses(selectedFrame.imageSrc).then((res) => {
        if (res) {
          loadedCutoutRef.current = res;
        }
        setIsProcessingCutout(false);
      });
    } else {
      loadedCutoutRef.current = null;
    }
  }, [selectedFrame]);

  useEffect(() => {
    autoFitRef.current = autoFit;
  }, [autoFit]);

  useEffect(() => {
    scaleOffsetRef.current = scaleOffset;
  }, [scaleOffset]);

  useEffect(() => {
    yOffsetRef.current = yOffset;
  }, [yOffset]);

  // DOM Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const faceMeshRef = useRef(null);
  const animFrameId = useRef(null);
  const fileInputRef = useRef(null);

  // Face landmarks tracker state
  const smoothedFaceRef = useRef({
    x: 0,
    y: 0,
    width: 220,
    height: 80,
    angle: 0,
    detected: false,
  });

  // ── Fetch any new products from Backend API on mount ──
  useEffect(() => {
    const fetchApiProducts = async () => {
      try {
        const response = await axios.get('products/');
        if (response.data && response.data.length > 0) {
          const apiFrames = response.data
            .filter((p) => p.category === 'eyeglasses' || p.category === 'sunglasses')
            .map((p) => ({
              id: `api-${p.id}`,
              name: p.name,
              brand: p.brand || 'MAXVISION',
              category: p.category,
              price: p.price,
              imageSrc:
                p.image_url ||
                p.image ||
                (p.category === 'sunglasses'
                  ? '/images/sunglasses_aviator_1778585307519.png'
                  : '/images/eyeglasses_rectangle_1778585167025.png'),
            }));

          setFramesList((prev) => {
            const existingIds = new Set(prev.map((f) => f.id));
            const newOnes = apiFrames.filter((f) => !existingIds.has(f.id));
            return [...prev, ...newOnes];
          });
        }
      } catch (err) {
        // Fallback to built-in glasses
      }
    };
    fetchApiProducts();
  }, []);

  // ── Select Frame Handler (Immediate UI & Ref update) ──
  const handleSelectFrame = (frame) => {
    const next = selectedFrame?.id === frame.id ? null : frame;
    setSelectedFrame(next);
    selectedFrameRef.current = next;
  };

  // ── MediaPipe FaceMesh Initialization ──
  const initFaceMesh = useCallback(() => {
    return new Promise((resolve, reject) => {
      const setup = () => {
        try {
          const fm = new window.FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
          });
          fm.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
          fm.onResults(onFaceResults);
          faceMeshRef.current = fm;
          resolve(fm);
        } catch (e) {
          reject(e);
        }
      };

      if (window.FaceMesh) {
        setup();
      } else {
        let count = 0;
        const interval = setInterval(() => {
          count++;
          if (window.FaceMesh) {
            clearInterval(interval);
            setup();
          } else if (count > 30) {
            clearInterval(interval);
            reject(new Error('MediaPipe script load timeout'));
          }
        }, 150);
      }
    });
  }, []);

  // ── Calculate Precise Face Landmarks ──
  const onFaceResults = useCallback((results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      smoothedFaceRef.current.detected = false;
      setAiStatus('Align face with camera');
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    // Pupil points
    const leftPupil = landmarks[468] || landmarks[33];
    const rightPupil = landmarks[473] || landmarks[263];

    // Temple roots
    const leftTemple = landmarks[234] || landmarks[33];
    const rightTemple = landmarks[454] || landmarks[263];

    // Bridge between eyes
    const bridge = landmarks[168] || landmarks[6] || {
      x: (leftPupil.x + rightPupil.x) / 2,
      y: (leftPupil.y + rightPupil.y) / 2,
    };

    // Mirrored coordinates
    const p1X = (1 - leftPupil.x) * w;
    const p1Y = leftPupil.y * h;
    const p2X = (1 - rightPupil.x) * w;
    const p2Y = rightPupil.y * h;

    const targetCenterX = (1 - bridge.x) * w;
    const targetCenterY = (bridge.y * h + (p1Y + p2Y) / 2) / 2;

    // Head tilt roll angle
    const targetAngle = Math.atan2(p2Y - p1Y, p2X - p1X);

    // Temple distance scale
    const t1X = (1 - leftTemple.x) * w;
    const t1Y = leftTemple.y * h;
    const t2X = (1 - rightTemple.x) * w;
    const t2Y = rightTemple.y * h;
    const templeSpan = Math.hypot(t2X - t1X, t2Y - t1Y);

    const targetWidth = templeSpan * 1.15;
    const cutout = loadedCutoutRef.current;
    const targetHeight = targetWidth * (cutout?.aspectRatio || 0.40);

    // Exponential smoothing for steady 60fps tracking
    const prev = smoothedFaceRef.current;
    if (!prev.detected) {
      prev.x = targetCenterX;
      prev.y = targetCenterY;
      prev.width = targetWidth;
      prev.height = targetHeight;
      prev.angle = targetAngle;
      prev.detected = true;
    } else {
      const alpha = 0.40;
      prev.x = prev.x * (1 - alpha) + targetCenterX * alpha;
      prev.y = prev.y * (1 - alpha) + targetCenterY * alpha;
      prev.width = prev.width * (1 - alpha) + targetWidth * alpha;
      prev.height = prev.height * (1 - alpha) + targetHeight * alpha;

      let dAngle = targetAngle - prev.angle;
      while (dAngle < -Math.PI) dAngle += Math.PI * 2;
      while (dAngle > Math.PI) dAngle -= Math.PI * 2;
      prev.angle += dAngle * alpha;
    }

    setAiStatus('Face Locked & Fitted');
  }, []);

  // ── Canvas Render Loop (Draws Real Photographic Glasses) ──
  const startRenderLoop = useCallback(() => {
    let lastSendTime = 0;

    const render = async (timestamp) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
        }

        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // 1. Draw mirrored raw video
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();

        // 2. Feed video frame to MediaPipe every ~40ms (25fps tracking)
        if (faceMeshRef.current && timestamp - lastSendTime > 40) {
          lastSendTime = timestamp;
          try {
            await faceMeshRef.current.send({ image: video });
          } catch (e) {
            // ignore frame switch
          }
        }

        // 3. Draw the EXACT SAME PHOTOGRAPHIC GLASSES on the face
        const cutoutObj = loadedCutoutRef.current;
        if (cutoutObj && cutoutObj.image) {
          ctx.save();

          const face = smoothedFaceRef.current;
          const isAuto = autoFitRef.current;
          const sMult = scaleOffsetRef.current;
          const yShift = yOffsetRef.current;

          let rx, ry, rw, rh, rAngle;

          if (isAuto && face.detected) {
            rx = face.x;
            ry = face.y + yShift;
            rw = face.width * sMult;
            rh = (face.width * cutoutObj.aspectRatio) * sMult;
            rAngle = face.angle;
          } else {
            rx = w / 2;
            ry = h * 0.38 + yShift;
            rw = w * 0.50 * sMult;
            rh = (rw * cutoutObj.aspectRatio);
            rAngle = 0;
          }

          // Translate to nose bridge & rotate with head tilt
          ctx.translate(rx, ry);
          ctx.rotate(rAngle);

          // Subtle realistic drop-shadow beneath glasses
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
          ctx.shadowBlur = Math.max(4, rw * 0.035);
          ctx.shadowOffsetY = Math.max(3, rw * 0.02);

          // Render the genuine photographic glasses cutout
          ctx.drawImage(
            cutoutObj.image,
            -rw / 2,
            -rh / 2,
            rw,
            rh
          );

          ctx.restore();
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);
  }, []);

  // ── Camera Lifecycle ──
  const startCamera = async () => {
    setCameraError('');
    setAiStatus('Initializing AI Face Tracker...');
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      await initFaceMesh();
      setCameraActive(true);
      startRenderLoop();
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Camera access required. Please enable camera permission in your browser.');
      setCameraActive(false);
      setAiStatus('Camera Offline');
    }
  };

  const stopCamera = useCallback(() => {
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setAiStatus('Standby');
    smoothedFaceRef.current.detected = false;
  }, []);

  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
  }, [facingMode]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // ── Owner: Select Image File ──
  const handleOwnerImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!newFrameName) {
      setNewFrameName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewFramePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // ── Owner: Save New Glasses to Catalog ──
  const handleSaveOwnerGlasses = () => {
    if (!newFramePreview) {
      alert('Please select a glasses image first.');
      return;
    }

    const newFrame = {
      id: `owner-${Date.now()}`,
      name: newFrameName || 'Custom Signature Frame',
      brand: newFrameBrand || 'MAXVISION',
      category: newFrameCategory,
      price: parseInt(newFramePrice, 10) || 1999,
      imageSrc: newFramePreview,
      isOwnerAdded: true,
    };

    const updated = [newFrame, ...framesList];
    setFramesList(updated);

    // Save owner glasses in localStorage
    try {
      const ownerOnly = updated.filter((f) => f.isOwnerAdded);
      localStorage.setItem('maxvision_owner_glasses', JSON.stringify(ownerOnly));
    } catch (e) {
      // storage quota
    }

    // Immediately select the new glasses
    setSelectedFrame(newFrame);
    selectedFrameRef.current = newFrame;

    // Reset and close modal
    setShowAddModal(false);
    setNewFrameName('');
    setNewFramePreview(null);
  };

  // ── Delete Owner Added Glasses ──
  const handleDeleteOwnerFrame = (frameId, e) => {
    e.stopPropagation();
    const updated = framesList.filter((f) => f.id !== frameId);
    setFramesList(updated);
    try {
      const ownerOnly = updated.filter((f) => f.isOwnerAdded);
      localStorage.setItem('maxvision_owner_glasses', JSON.stringify(ownerOnly));
    } catch (e) {
      // ignore
    }
    if (selectedFrame?.id === frameId) {
      const next = updated[0] || null;
      setSelectedFrame(next);
      selectedFrameRef.current = next;
    }
  };

  // ── Photo Capture & Download ──
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);
  };

  const downloadPhoto = () => {
    if (!capturedImage) return;
    const a = document.createElement('a');
    a.href = capturedImage;
    a.download = `maxvision-tryon-${Date.now()}.jpg`;
    a.click();
  };

  const filteredFrames =
    filterCat === 'all'
      ? framesList
      : framesList.filter((f) => f.category === filterCat);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 font-sans">
      {/* Hidden raw video element */}
      <video ref={videoRef} playsInline muted style={{ display: 'none' }} />

      {/* ── Professional Header Banner ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-10 px-4 text-center relative border-b border-blue-900/40">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3 backdrop-blur-sm">
            <FaGlasses className="text-blue-400" /> Professional 3D Optical Try-On
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            Real Photographic Virtual Mirror
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Select any real glasses from the collection. The exact photographic frame is accurately scaled, rotated, and fitted to your face in real time.
          </p>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT PANEL: Store Glasses & Owner Upload (5 cols) ════ */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

              {/* Owner Action: Add Glasses Image Button */}
              <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-gray-200">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-700/20 transition-all text-sm"
                >
                  <FaPlus className="text-xs" /> Owner Studio: Add Glasses Image
                </button>
                <p className="text-[11px] text-gray-500 text-center mt-2 font-medium">
                  Add custom glasses photos to display and try on live
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                {[
                  { key: 'all', label: 'All Glasses' },
                  { key: 'eyeglasses', label: 'Eyeglasses' },
                  { key: 'sunglasses', label: 'Sunglasses' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilterCat(tab.key)}
                    className={`flex-1 py-3 text-xs font-bold transition-all ${
                      filterCat === tab.key
                        ? 'text-blue-700 border-b-2 border-blue-700 bg-white font-black'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Glasses Cards List */}
              <div className="p-3 max-h-[580px] overflow-y-auto space-y-2.5">
                <div className="px-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Select any frame ({filteredFrames.length} available)</span>
                  {isProcessingCutout && (
                    <span className="text-blue-600 flex items-center gap-1 font-semibold">
                      <FaSpinner className="animate-spin text-xs" /> Fitting...
                    </span>
                  )}
                </div>

                {filteredFrames.map((frame) => {
                  const isSelected = selectedFrame?.id === frame.id;
                  return (
                    <motion.div
                      key={frame.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectFrame(frame)}
                      className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex items-center gap-3.5 relative ${
                        isSelected
                          ? 'border-blue-700 bg-blue-50/70 shadow-md ring-2 ring-blue-600/20'
                          : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50/50'
                      }`}
                    >
                      {/* Real Photographic Glasses Image */}
                      <div className="w-24 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200 p-1">
                        <img
                          src={frame.imageSrc}
                          alt={frame.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-blue-950 font-black' : 'text-gray-900'}`}>
                            {frame.name}
                          </h4>
                          {frame.isOwnerAdded && (
                            <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                              Owner
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">{frame.brand}</span>
                          <span>•</span>
                          <span className="capitalize">{frame.category}</span>
                          {frame.price > 0 && (
                            <>
                              <span>•</span>
                              <span className="font-bold text-green-700">₹{frame.price}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Checkmark or Delete */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {frame.isOwnerAdded && (
                          <button
                            onClick={(e) => handleDeleteOwnerFrame(frame.id, e)}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete custom frame"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-blue-700 text-white shadow-sm'
                              : 'border-2 border-gray-300 text-transparent'
                          }`}
                        >
                          <FaCheck size={11} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ════ RIGHT PANEL: Live AI Try-On Screen (7 cols) ════ */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Camera Viewport Canvas */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden relative shadow-2xl border-4 border-slate-900 aspect-video flex items-center justify-center">

              {/* Standby State Overlay */}
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-b from-slate-900 via-slate-900 to-black p-6 text-center z-20">
                  <div className="w-20 h-20 bg-blue-600/20 border-2 border-blue-500/40 rounded-full flex items-center justify-center mb-5 text-blue-400">
                    <BsCameraVideoFill size={36} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black mb-2">
                    Front Camera Ready
                  </h3>
                  <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
                    Click Start Camera to open your live mirror. Selected glasses will automatically place, size, and align to your face using real-time landmark tracking.
                  </p>
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2.5 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-700/30 transition-all text-base"
                  >
                    <BsCameraVideoFill /> Start Camera
                  </button>

                  {cameraError && (
                    <p className="mt-4 text-xs bg-red-900/60 border border-red-500 text-red-200 px-4 py-2 rounded-xl max-w-sm">
                      {cameraError}
                    </p>
                  )}
                </div>
              )}

              {/* Live Render Canvas (Synchronized Camera Feed + Real Photographic Glasses) */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
                style={{ display: cameraActive ? 'block' : 'none' }}
              />

              {/* Status Badges */}
              {cameraActive && (
                <>
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-xs font-semibold">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        smoothedFaceRef.current.detected
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-amber-400'
                      }`}
                    />
                    {aiStatus}
                  </div>

                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <button
                      onClick={flipCamera}
                      className="bg-slate-950/75 hover:bg-slate-900 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/10 transition-colors"
                      title="Flip Camera"
                    >
                      <MdFlipCameraAndroid size={18} />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-red-600/80 hover:bg-red-700 backdrop-blur-md text-white p-2.5 rounded-xl transition-colors"
                      title="Stop Camera"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>

                  {/* Active Frame Info Bar */}
                  {selectedFrame && (
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-white">
                      <div className="flex items-center gap-2.5 truncate">
                        <FaGlasses className="text-blue-400 text-sm flex-shrink-0" />
                        <span className="font-bold text-sm truncate">{selectedFrame.name}</span>
                        <span className="text-xs text-slate-400">({selectedFrame.brand})</span>
                      </div>
                      <button
                        onClick={() => handleSelectFrame(selectedFrame)}
                        className="text-xs bg-white/15 hover:bg-white/25 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ════ Try-On Controls Bar ════ */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                {/* Auto-Fit AI Mode Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAutoFit(!autoFit)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      autoFit
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <FaCheckCircle className={autoFit ? 'text-emerald-600' : 'text-gray-400'} />
                    Auto Face-Fit: {autoFit ? 'ON (AI Tracking)' : 'OFF (Manual)'}
                  </button>
                  <span className="text-xs text-gray-500 hidden sm:inline font-medium">
                    {autoFit
                      ? 'Photographic frame tracks head rotation, tilt, and distance'
                      : 'Manual position active'}
                  </span>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  {cameraActive && (
                    <button
                      onClick={capturePhoto}
                      className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm text-sm transition-all"
                    >
                      <FaCamera /> Capture Photo
                    </button>
                  )}
                  {selectedFrame && (
                    <button
                      onClick={() => handleSelectFrame(selectedFrame)}
                      className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-3.5 py-2.5 rounded-xl transition-colors"
                    >
                      <FaTimes /> Remove Frame
                    </button>
                  )}
                </div>
              </div>

              {/* Fine-Tuning Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <FaSlidersH className="text-blue-600" /> Frame Size Multiplier
                    </span>
                    <span className="text-blue-700 font-black">{Math.round(scaleOffset * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.35"
                    step="0.02"
                    value={scaleOffset}
                    onChange={(e) => setScaleOffset(parseFloat(e.target.value))}
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-0.5 font-medium">
                    <span>Tighter</span>
                    <span>Standard</span>
                    <span>Wider</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <FaArrowsAlt className="text-blue-600" /> Nose Bridge Height
                    </span>
                    <span className="text-blue-700 font-black">{yOffset} px</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="2"
                    value={yOffset}
                    onChange={(e) => setYOffset(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-0.5 font-medium">
                    <span>Higher</span>
                    <span>Centered</span>
                    <span>Lower</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ════ Photo Captured Preview Modal ════ */}
            <AnimatePresence>
              {capturedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg flex flex-col md:flex-row items-center gap-6"
                >
                  <div className="w-full md:w-56 rounded-xl overflow-hidden shadow-inner border border-gray-200 bg-black flex-shrink-0">
                    <img
                      src={capturedImage}
                      alt="Your Virtual Try-On Snapshot"
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                      Photo Captured
                    </span>
                    <h4 className="font-black text-gray-900 text-lg mb-1">
                      {selectedFrame?.name || 'MAXVISION Eyewear'}
                    </h4>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed font-medium">
                      Save your high-resolution try-on photo or show it to our staff at any MAXVISION branch in Ranchi!
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={downloadPhoto}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <FaDownload /> Download Image (.JPG)
                      </button>
                      <button
                        onClick={() => setCapturedImage(null)}
                        className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 font-bold px-4 py-2.5 rounded-xl text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* ════ OWNER MODAL: Add New Glasses Image ════ */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Owner Studio: Add Glasses
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Upload any glasses image to add it directly to the virtual mirror
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Upload Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 hover:border-blue-600 rounded-2xl p-6 text-center bg-blue-50/40 hover:bg-blue-50/70 cursor-pointer transition-all mb-5"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleOwnerImageSelect}
                  className="hidden"
                />

                {newFramePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={newFramePreview}
                      alt="Preview"
                      className="max-h-28 object-contain mb-2"
                    />
                    <span className="text-xs font-bold text-blue-700">
                      Click to choose a different image
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-600/10 text-blue-700 rounded-full flex items-center justify-center mb-3">
                      <FaUpload size={20} />
                    </div>
                    <p className="text-sm font-bold text-gray-800 mb-1">
                      Click to upload glasses image
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      PNG, JPG, or WEBP (transparent or white background)
                    </p>
                  </div>
                )}
              </div>

              {/* Form Inputs */}
              <div className="space-y-3.5 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Glasses Model Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ray-Ban Aviator Gradient"
                    value={newFrameName}
                    onChange={(e) => setNewFrameName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ray-Ban"
                      value={newFrameBrand}
                      onChange={(e) => setNewFrameBrand(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2999"
                      value={newFramePrice}
                      onChange={(e) => setNewFramePrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewFrameCategory('sunglasses')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        newFrameCategory === 'sunglasses'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Sunglasses
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewFrameCategory('eyeglasses')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        newFrameCategory === 'eyeglasses'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Eyeglasses
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOwnerGlasses}
                  className="flex-1 py-3 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md shadow-blue-700/20 transition-all"
                >
                  Save & Try On Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VirtualTryOn;
