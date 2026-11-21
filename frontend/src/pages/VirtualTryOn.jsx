import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCamera, FaDownload, FaRedo, FaUpload, FaCheck,
  FaTimes, FaEye, FaSlidersH, FaMagic, FaArrowsAlt
} from 'react-icons/fa';
import { MdFlipCameraAndroid } from 'react-icons/md';
import { BsCameraVideoFill, BsCameraVideoOffFill } from 'react-icons/bs';

// ── Built-in Preset Frames ──
const INITIAL_FRAMES = [
  {
    id: 'wayfarer-black',
    name: 'Wayfarer Classic',
    brand: 'Ray-Ban Style',
    category: 'eyeglasses',
    type: 'wayfarer',
    frameColor: '#121212',
    lensColor: 'rgba(20, 25, 30, 0.22)',
    aspectRatio: 0.38,
    thumb: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'aviator-gold',
    name: 'Gold Pilot Aviator',
    brand: 'MAXVISION Signature',
    category: 'sunglasses',
    type: 'aviator',
    frameColor: '#D4AF37',
    lensColor: 'rgba(10, 60, 60, 0.55)',
    aspectRatio: 0.42,
    thumb: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'round-vintage',
    name: 'Vintage Round',
    brand: 'John Jacobs Style',
    category: 'eyeglasses',
    type: 'round',
    frameColor: '#5C3826',
    lensColor: 'rgba(90, 50, 20, 0.16)',
    aspectRatio: 0.40,
    thumb: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'cateye-pink',
    name: 'Chic Cat-Eye',
    brand: 'Vincent Chase Glam',
    category: 'eyeglasses',
    type: 'catEye',
    frameColor: '#D15275',
    lensColor: 'rgba(210, 80, 120, 0.18)',
    aspectRatio: 0.38,
    thumb: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'clubmaster-black',
    name: 'Clubmaster Browline',
    brand: 'Retro Iconic',
    category: 'sunglasses',
    type: 'clubmaster',
    frameColor: '#1A1A1A',
    lensColor: 'rgba(20, 45, 30, 0.58)',
    aspectRatio: 0.40,
    thumb: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'geometric-silver',
    name: 'Hexagonal Geometric',
    brand: 'Titan Edge',
    category: 'eyeglasses',
    type: 'geometric',
    frameColor: '#8E9AA0',
    lensColor: 'rgba(100, 120, 140, 0.14)',
    aspectRatio: 0.38,
    thumb: 'https://images.unsplash.com/photo-1485053329638-4e9f0ba3de14?w=320&h=200&fit=crop&auto=format',
  },
];

// Helper to draw realistic glasses presets onto canvas
const drawPresetGlasses = (ctx, frame, width, height) => {
  const { frameColor: fc, lensColor: lc, type } = frame;
  const sw = Math.max(3, width * 0.022); // dynamic stroke weight

  ctx.save();
  ctx.strokeStyle = fc;
  ctx.fillStyle = lc;
  ctx.lineWidth = sw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const halfW = width / 2;
  const halfH = height / 2;

  if (type === 'aviator') {
    // Teardrop lenses with double bridge
    const lensW = width * 0.42;
    const lensH = height * 0.88;
    const bridgeW = width * 0.12;

    // Double top bridge
    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, -halfH * 0.45);
    ctx.quadraticCurveTo(0, -halfH * 0.65, bridgeW / 2, -halfH * 0.45);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, -halfH * 0.15);
    ctx.quadraticCurveTo(0, -halfH * 0.35, bridgeW / 2, -halfH * 0.15);
    ctx.stroke();

    // Left lens
    ctx.beginPath();
    const lcx = -bridgeW / 2 - lensW / 2;
    ctx.ellipse(lcx, 0, lensW / 2, lensH / 2, 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right lens
    ctx.beginPath();
    const rcx = bridgeW / 2 + lensW / 2;
    ctx.ellipse(rcx, 0, lensW / 2, lensH / 2, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Temples
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH * 0.2);
    ctx.lineTo(lcx - lensW / 2, -halfH * 0.2);
    ctx.moveTo(halfW, -halfH * 0.2);
    ctx.lineTo(rcx + lensW / 2, -halfH * 0.2);
    ctx.stroke();
  } else if (type === 'round') {
    // Perfect round glasses
    const radius = Math.min(width * 0.21, height * 0.44);
    const bridgeW = width * 0.14;

    // Bridge
    ctx.beginPath();
    ctx.arc(0, -radius * 0.1, bridgeW * 0.65, Math.PI * 0.85, Math.PI * 0.15, true);
    ctx.stroke();

    // Left Circle
    ctx.beginPath();
    const lcx = -bridgeW / 2 - radius;
    ctx.arc(lcx, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right Circle
    ctx.beginPath();
    const rcx = bridgeW / 2 + radius;
    ctx.arc(rcx, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Temples
    ctx.beginPath();
    ctx.moveTo(-halfW, 0);
    ctx.lineTo(lcx - radius, 0);
    ctx.moveTo(halfW, 0);
    ctx.lineTo(rcx + radius, 0);
    ctx.stroke();
  } else if (type === 'catEye') {
    // Cat-eye swept wings
    const lensW = width * 0.43;
    const lensH = height * 0.85;
    const bridgeW = width * 0.12;

    // Bridge
    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, -halfH * 0.1);
    ctx.quadraticCurveTo(0, -halfH * 0.35, bridgeW / 2, -halfH * 0.1);
    ctx.stroke();

    // Left Cat-Eye
    ctx.beginPath();
    const lcx = -bridgeW / 2 - lensW;
    ctx.moveTo(lcx + lensW, -halfH * 0.1);
    ctx.quadraticCurveTo(lcx + lensW * 0.5, halfH * 0.9, lcx, halfH * 0.3);
    ctx.quadraticCurveTo(lcx - 12, -halfH * 0.9, lcx + lensW * 0.3, -halfH * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Cat-Eye
    ctx.beginPath();
    const rcx = bridgeW / 2;
    ctx.moveTo(rcx, -halfH * 0.1);
    ctx.quadraticCurveTo(rcx + lensW * 0.5, halfH * 0.9, rcx + lensW, halfH * 0.3);
    ctx.quadraticCurveTo(rcx + lensW + 12, -halfH * 0.9, rcx + lensW * 0.7, -halfH * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (type === 'clubmaster') {
    // Browline thick top, thin wire bottom
    const lensW = width * 0.42;
    const lensH = height * 0.82;
    const bridgeW = width * 0.13;

    // Bridge
    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, -halfH * 0.15);
    ctx.quadraticCurveTo(0, -halfH * 0.4, bridgeW / 2, -halfH * 0.15);
    ctx.stroke();

    // Left lens wire bottom
    const lcx = -bridgeW / 2 - lensW / 2;
    ctx.beginPath();
    ctx.roundRect(lcx - lensW / 2, -lensH / 2, lensW, lensH, [4, 4, 18, 18]);
    ctx.fill();
    ctx.stroke();

    // Left thick browline
    ctx.save();
    ctx.lineWidth = sw * 2.2;
    ctx.beginPath();
    ctx.moveTo(-halfW + 4, -halfH * 0.35);
    ctx.quadraticCurveTo(lcx, -halfH * 0.65, -bridgeW / 2, -halfH * 0.35);
    ctx.stroke();
    ctx.restore();

    // Right lens wire bottom
    const rcx = bridgeW / 2 + lensW / 2;
    ctx.beginPath();
    ctx.roundRect(rcx - lensW / 2, -lensH / 2, lensW, lensH, [4, 4, 18, 18]);
    ctx.fill();
    ctx.stroke();

    // Right thick browline
    ctx.save();
    ctx.lineWidth = sw * 2.2;
    ctx.beginPath();
    ctx.moveTo(bridgeW / 2, -halfH * 0.35);
    ctx.quadraticCurveTo(rcx, -halfH * 0.65, halfW - 4, -halfH * 0.35);
    ctx.stroke();
    ctx.restore();
  } else if (type === 'geometric') {
    // Hexagonal geometry
    const r = Math.min(width * 0.22, height * 0.46);
    const bridgeW = width * 0.12;

    // Bridge
    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, 0);
    ctx.quadraticCurveTo(0, -halfH * 0.25, bridgeW / 2, 0);
    ctx.stroke();

    const drawHex = (cx) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        const x = cx + r * Math.cos(a);
        const y = r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    drawHex(-bridgeW / 2 - r);
    drawHex(bridgeW / 2 + r);

    // Temples
    ctx.beginPath();
    ctx.moveTo(-halfW, 0);
    ctx.lineTo(-bridgeW / 2 - r * 1.86, 0);
    ctx.moveTo(halfW, 0);
    ctx.lineTo(bridgeW / 2 + r * 1.86, 0);
    ctx.stroke();
  } else {
    // Classic Wayfarer / Rectangle
    const lensW = width * 0.42;
    const lensH = height * 0.85;
    const bridgeW = width * 0.14;

    // Bridge
    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, -halfH * 0.1);
    ctx.quadraticCurveTo(0, -halfH * 0.35, bridgeW / 2, -halfH * 0.1);
    ctx.stroke();

    // Left lens
    const lcx = -bridgeW / 2 - lensW / 2;
    ctx.beginPath();
    ctx.roundRect(lcx - lensW / 2, -lensH / 2, lensW, lensH, [10, 10, 16, 16]);
    ctx.fill();
    ctx.stroke();

    // Right lens
    const rcx = bridgeW / 2 + lensW / 2;
    ctx.beginPath();
    ctx.roundRect(rcx - lensW / 2, -lensH / 2, lensW, lensH, [10, 10, 16, 16]);
    ctx.fill();
    ctx.stroke();

    // Temples
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH * 0.15);
    ctx.lineTo(lcx - lensW / 2, -halfH * 0.15);
    ctx.moveTo(halfW, -halfH * 0.15);
    ctx.lineTo(rcx + lensW / 2, -halfH * 0.15);
    ctx.stroke();
  }

  // Realistic lens glare reflection
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = Math.max(2, sw * 0.6);
  ctx.beginPath();
  ctx.moveTo(-width * 0.32, -height * 0.25);
  ctx.lineTo(-width * 0.18, height * 0.2);
  ctx.moveTo(width * 0.18, -height * 0.25);
  ctx.lineTo(width * 0.32, height * 0.2);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
};

const VirtualTryOn = () => {
  // State
  const [framesList, setFramesList] = useState(INITIAL_FRAMES);
  const [selectedFrame, setSelectedFrame] = useState(INITIAL_FRAMES[0]);
  const [filterCat, setFilterCat] = useState('all');
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const [cameraError, setCameraError] = useState('');
  const [aiStatus, setAiStatus] = useState('Standby'); // Standby, Loading AI, Tracking, No Face
  const [autoFit, setAutoFit] = useState(true);
  const [scaleOffset, setScaleOffset] = useState(1.0); // manual scale multiplier
  const [yOffset, setYOffset] = useState(0); // manual Y shift in px
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImageObj, setUploadedImageObj] = useState(null);

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const faceMeshRef = useRef(null);
  const animFrameId = useRef(null);
  const fileInputRef = useRef(null);

  // Smoothing tracker state for face
  const smoothedFaceRef = useRef({
    x: 0,
    y: 0,
    width: 200,
    height: 80,
    angle: 0,
    detected: false,
  });

  // ── Load MediaPipe FaceMesh dynamically if not yet ready ──
  const initFaceMesh = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.FaceMesh) {
        try {
          const fm = new window.FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
          });
          fm.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
          fm.onResults(onFaceResults);
          faceMeshRef.current = fm;
          resolve(fm);
        } catch (err) {
          console.error("FaceMesh init error:", err);
          reject(err);
        }
      } else {
        // Wait or retry
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (window.FaceMesh) {
            clearInterval(interval);
            try {
              const fm = new window.FaceMesh({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
              });
              fm.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
              });
              fm.onResults(onFaceResults);
              faceMeshRef.current = fm;
              resolve(fm);
            } catch (err) {
              reject(err);
            }
          } else if (attempts > 30) {
            clearInterval(interval);
            reject(new Error("FaceMesh library script timeout"));
          }
        }, 200);
      }
    });
  }, []);

  // ── Process FaceMesh Landmarks ──
  const onFaceResults = useCallback((results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      smoothedFaceRef.current.detected = false;
      setAiStatus('Searching for face...');
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    // Landmark 33: left eye outer corner, 263: right eye outer corner
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];

    // Landmark 234: left temple, 454: right temple
    const leftTemple = landmarks[234] || leftEye;
    const rightTemple = landmarks[454] || rightEye;

    // Landmark 168: bridge of nose between eyes
    const bridge = landmarks[168] || landmarks[6] || {
      x: (leftEye.x + rightEye.x) / 2,
      y: (leftEye.y + rightEye.y) / 2,
    };

    // Calculate position in canvas pixels
    // Note: Video is mirrored (scaleX(-1)), so landmark.x mirrors as: (1 - landmark.x) * w
    const targetX = (1 - bridge.x) * w;
    const targetY = bridge.y * h;

    // Calculate rotation angle (roll)
    // Mirrored dx calculation:
    const dx = (1 - rightEye.x) * w - (1 - leftEye.x) * w;
    const dy = rightEye.y * h - leftEye.y * h;
    const targetAngle = Math.atan2(dy, dx);

    // Calculate glasses width based on temple distance
    const templeDist = Math.hypot(
      ((1 - rightTemple.x) - (1 - leftTemple.x)) * w,
      (rightTemple.y - leftTemple.y) * h
    );

    // Natural frame width is ~1.15 to 1.25x the temple span
    const targetWidth = templeDist * 1.18;
    const targetHeight = targetWidth * (selectedFrame?.aspectRatio || 0.4);

    // Exponential smoothing (Low-Pass Filter) to remove jitter
    const prev = smoothedFaceRef.current;
    const alpha = 0.35; // responsiveness

    prev.x = prev.detected ? prev.x * (1 - alpha) + targetX * alpha : targetX;
    prev.y = prev.detected ? prev.y * (1 - alpha) + targetY * alpha : targetY;
    prev.width = prev.detected ? prev.width * (1 - alpha) + targetWidth * alpha : targetWidth;
    prev.height = prev.detected ? prev.height * (1 - alpha) + targetHeight * alpha : targetHeight;
    prev.angle = prev.detected ? prev.angle * (1 - alpha) + targetAngle * alpha : targetAngle;
    prev.detected = true;

    setAiStatus('Tracking Face (Auto-Fit AI)');
  }, [selectedFrame]);

  // ── Render Loop ──
  const startRenderLoop = useCallback(() => {
    let lastSendTime = 0;

    const render = async (timestamp) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        // Set canvas resolution to match video stream
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
        }

        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // 1. Draw mirrored video feed
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();

        // 2. Send frame to MediaPipe every ~40ms (25fps tracking for performance)
        if (faceMeshRef.current && timestamp - lastSendTime > 40) {
          lastSendTime = timestamp;
          try {
            await faceMeshRef.current.send({ image: video });
          } catch (e) {
            // Ignored frame error during switch
          }
        }

        // 3. Draw glasses if selected
        const face = smoothedFaceRef.current;
        if (selectedFrame) {
          ctx.save();

          let renderX, renderY, renderW, renderH, renderAngle;

          if (autoFit && face.detected) {
            // AI Auto-Adjust according to user's real face
            renderX = face.x;
            renderY = face.y + yOffset;
            renderW = face.width * scaleOffset;
            renderH = face.height * scaleOffset;
            renderAngle = face.angle;
          } else {
            // Fallback manual center positioning if no face detected yet
            renderX = w / 2;
            renderY = h * 0.38 + yOffset;
            renderW = w * 0.48 * scaleOffset;
            renderH = renderW * (selectedFrame?.aspectRatio || 0.4);
            renderAngle = 0;
          }

          // Apply transformation to align glasses precisely to face
          ctx.translate(renderX, renderY);
          ctx.rotate(renderAngle);

          // Draw either custom uploaded glasses image or built-in vector frame
          if (selectedFrame.customImage) {
            ctx.drawImage(
              selectedFrame.customImage,
              -renderW / 2,
              -renderH / 2,
              renderW,
              renderH
            );
          } else {
            drawPresetGlasses(ctx, selectedFrame, renderW, renderH);
          }

          ctx.restore();
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);
  }, [autoFit, selectedFrame, scaleOffset, yOffset]);

  // ── Camera Lifecycle ──
  const startCamera = async () => {
    setCameraError('');
    setAiStatus('Starting AI Face Tracking...');
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

      // Initialize FaceMesh
      await initFaceMesh();
      setCameraActive(true);
      startRenderLoop();
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError('Camera access required. Please allow camera permissions in your browser.');
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

  // ── Handle Custom Glasses Image Upload ──
  const handleGlassesImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const aspect = img.height / img.width;
        const newCustomFrame = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 18) || 'Custom Glasses',
          brand: 'My Upload',
          category: 'eyeglasses',
          type: 'custom',
          customImage: img,
          aspectRatio: aspect,
          thumb: event.target.result,
        };

        setFramesList((prev) => [newCustomFrame, ...prev]);
        setSelectedFrame(newCustomFrame);
        setUploadedImageObj(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* ── Hidden video element for raw feed ── */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{ display: 'none' }}
      />

      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white py-10 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3 backdrop-blur-sm">
            <FaMagic className="text-yellow-400" /> AI-Powered Real-Time Virtual Mirror
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            Virtual 3D Glasses Try-On
          </h1>
          <p className="text-blue-200 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Glasses automatically track, rotate, and scale to your face shape in real time.
            Try available frames or upload your own image!
          </p>
        </div>
      </div>

      {/* ── Main Container ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT PANEL: Frame Selection (4 cols) ════ */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

              {/* Upload Custom Glasses Button */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleGlassesImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all text-sm"
                >
                  <FaUpload className="text-base" /> Upload Custom Glasses Image
                </button>
                <p className="text-[11px] text-gray-500 text-center mt-2 font-medium">
                  Supports transparent PNG or glasses photo
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex border-b border-gray-100 bg-gray-50/50">
                {[
                  { key: 'all', label: 'All Frames' },
                  { key: 'eyeglasses', label: 'Eyeglasses' },
                  { key: 'sunglasses', label: 'Sunglasses' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilterCat(tab.key)}
                    className={`flex-1 py-3 text-xs font-bold transition-all ${
                      filterCat === tab.key
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Frames Grid */}
              <div className="p-4 max-h-[520px] overflow-y-auto space-y-3">
                {filteredFrames.map((frame) => {
                  const isSelected = selectedFrame?.id === frame.id;
                  return (
                    <motion.div
                      key={frame.id}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => setSelectedFrame(isSelected ? null : frame)}
                      className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                          : 'border-gray-100 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
                        <img
                          src={frame.thumb}
                          alt={frame.name}
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-gray-900 text-sm truncate">
                            {frame.name}
                          </h4>
                          {frame.customImage && (
                            <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-1.5 py-0.5 rounded">
                              CUSTOM
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          {frame.brand}
                        </p>
                      </div>

                      {/* Selection Checkmark */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'border-2 border-gray-300 text-transparent'
                        }`}
                      >
                        <FaCheck size={10} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ════ RIGHT PANEL: Live AI Try-On Screen (8 cols) ════ */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Camera Viewport Canvas */}
            <div className="bg-black rounded-3xl overflow-hidden relative shadow-2xl border-4 border-gray-900 aspect-video flex items-center justify-center">

              {/* Standby State Overlay */}
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-b from-gray-900 via-gray-900 to-black p-6 text-center z-20">
                  <div className="w-20 h-20 bg-blue-600/20 border-2 border-blue-500/40 rounded-full flex items-center justify-center mb-5 text-blue-400">
                    <BsCameraVideoFill size={36} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black mb-2">
                    Front Camera Required
                  </h3>
                  <p className="text-gray-400 text-sm max-w-md mb-6 leading-relaxed">
                    Click the button below to activate your webcam. The AI face detector will automatically scale and fit the selected frame to your face!
                  </p>
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all text-base"
                  >
                    <BsCameraVideoFill /> Start Live Try-On Camera
                  </button>

                  {cameraError && (
                    <p className="mt-4 text-xs bg-red-900/60 border border-red-500 text-red-200 px-4 py-2 rounded-xl max-w-sm">
                      {cameraError}
                    </p>
                  )}
                </div>
              )}

              {/* Live Render Canvas (Synchronized Camera + AI Glasses) */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
                style={{ display: cameraActive ? 'block' : 'none' }}
              />

              {/* Status & Camera Badges */}
              {cameraActive && (
                <>
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-xs font-semibold">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        smoothedFaceRef.current.detected
                          ? 'bg-green-400 animate-pulse'
                          : 'bg-yellow-400'
                      }`}
                    />
                    {aiStatus}
                  </div>

                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <button
                      onClick={flipCamera}
                      className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/10 transition-colors"
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
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    <FaMagic /> Auto Face-Fit: {autoFit ? 'ON (AI Tracking)' : 'OFF (Manual)'}
                  </button>
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {autoFit
                      ? 'Glasses automatically follow head tilt, angle, & distance'
                      : 'Manual sizing active'}
                  </span>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  {cameraActive && (
                    <button
                      onClick={capturePhoto}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm text-sm transition-all"
                    >
                      <FaCamera /> Capture Photo
                    </button>
                  )}
                  {selectedFrame && (
                    <button
                      onClick={() => setSelectedFrame(null)}
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
                      <FaSlidersH className="text-blue-500" /> Frame Size Multiplier
                    </span>
                    <span className="text-blue-600 font-black">{Math.round(scaleOffset * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.4"
                    step="0.02"
                    value={scaleOffset}
                    onChange={(e) => setScaleOffset(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-0.5">
                    <span>Tighter Fit</span>
                    <span>Standard</span>
                    <span>Wider Fit</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <FaArrowsAlt className="text-blue-500" /> Nose Bridge Height
                    </span>
                    <span className="text-blue-600 font-black">{yOffset} px</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="2"
                    value={yOffset}
                    onChange={(e) => setYOffset(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-0.5">
                    <span>Higher on Bridge</span>
                    <span>Centered</span>
                    <span>Lower on Nose</span>
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
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                      📸 Snapshot Ready
                    </span>
                    <h4 className="font-black text-gray-900 text-lg mb-1">
                      Looking Great with {selectedFrame?.name || 'MAXVISION Frames'}!
                    </h4>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                      Download your try-on photo to save it, share with friends, or show it to your optician at our Ranchi stores!
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={downloadPhoto}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-green-600/20 transition-all"
                      >
                        <FaDownload /> Download Image (.JPG)
                      </button>
                      <button
                        onClick={() => setCapturedImage(null)}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-bold px-4 py-2.5 rounded-xl text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
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
    </div>
  );
};

export default VirtualTryOn;
