import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCamera, FaDownload, FaUpload, FaCheck,
  FaTimes, FaSlidersH, FaMagic, FaArrowsAlt, FaTag
} from 'react-icons/fa';
import { MdFlipCameraAndroid } from 'react-icons/md';
import { BsCameraVideoFill } from 'react-icons/bs';
import axios from '../api/axios';

// ── Complete Store Eyewear Catalog (Real MAXVISION Products) ──
const ALL_STORE_GLASSES = [
  // ── Eyeglasses ──
  {
    id: 'vc-rb5228',
    name: 'Ray-Ban Highstreet RB5228',
    brand: 'Ray-Ban',
    category: 'eyeglasses',
    type: 'rectangle',
    frameColor: '#1A1A1A',
    lensColor: 'rgba(255, 255, 255, 0.08)',
    price: 6990,
    aspectRatio: 0.38,
    thumb: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'rb-clubmaster-3016',
    name: 'Ray-Ban Clubmaster RB3016',
    brand: 'Ray-Ban',
    category: 'eyeglasses',
    type: 'clubmaster',
    frameColor: '#5C3A21',
    lensColor: 'rgba(255, 255, 255, 0.08)',
    price: 8990,
    aspectRatio: 0.40,
    thumb: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'oakley-ox8154',
    name: 'Oakley Crosslink RX OX8154',
    brand: 'Oakley',
    category: 'eyeglasses',
    type: 'rectangle',
    frameColor: '#4A4E51',
    lensColor: 'rgba(255, 255, 255, 0.08)',
    price: 12990,
    aspectRatio: 0.36,
    thumb: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'titan-round-nxt',
    name: 'Titan Eye+ NXT Round Classic',
    brand: 'Titan Eye+',
    category: 'eyeglasses',
    type: 'round',
    frameColor: '#6B3A2A',
    lensColor: 'rgba(255, 255, 255, 0.08)',
    price: 3490,
    aspectRatio: 0.42,
    thumb: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'fastrack-nb034',
    name: 'Fastrack NB034BK1 Rectangle',
    brand: 'Fastrack',
    category: 'eyeglasses',
    type: 'rectangle',
    frameColor: '#111111',
    lensColor: 'rgba(255, 255, 255, 0.08)',
    price: 2290,
    aspectRatio: 0.38,
    thumb: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'vc-cateye-12480',
    name: 'Vincent Chase VC E12480 Cat Eye',
    brand: 'Vincent Chase',
    category: 'eyeglasses',
    type: 'catEye',
    frameColor: '#D15275',
    lensColor: 'rgba(210, 80, 120, 0.12)',
    price: 1999,
    aspectRatio: 0.40,
    thumb: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'jj-aviator-16200',
    name: 'John Jacobs JJ E16200 Aviator',
    brand: 'John Jacobs',
    category: 'eyeglasses',
    type: 'aviator',
    frameColor: '#C0C0C0',
    lensColor: 'rgba(255, 255, 255, 0.08)',
    price: 4490,
    aspectRatio: 0.42,
    thumb: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'la-slim-15321',
    name: 'Lenskart Air LA E15321 Slim',
    brand: 'Lenskart Air',
    category: 'eyeglasses',
    type: 'rectangle',
    frameColor: '#2563EB',
    lensColor: 'rgba(37, 99, 235, 0.10)',
    price: 2500,
    aspectRatio: 0.37,
    thumb: 'https://images.unsplash.com/photo-1604697964648-9f4aa1adc2cb?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'vp-geometric-3021',
    name: 'Vision Plus VP3021 Geometric',
    brand: 'Vision Plus',
    category: 'eyeglasses',
    type: 'geometric',
    frameColor: '#4B5563',
    lensColor: 'rgba(255, 255, 255, 0.08)',
    price: 1799,
    aspectRatio: 0.39,
    thumb: 'https://images.unsplash.com/photo-1485053329638-4e9f0ba3de14?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'rf-oval-ranchi',
    name: 'Ranchi Frames RF Classic Oval',
    brand: 'Ranchi Frames',
    category: 'eyeglasses',
    type: 'round',
    frameColor: '#1F2937',
    lensColor: 'rgba(255, 255, 255, 0.08)',
    price: 1299,
    aspectRatio: 0.41,
    thumb: 'https://images.unsplash.com/photo-1512095507099-b8fe50b3acb8?w=320&h=200&fit=crop&auto=format',
  },

  // ── Sunglasses ──
  {
    id: 'rb-wayfarer-2132',
    name: 'Ray-Ban Wayfarer RB2132',
    brand: 'Ray-Ban',
    category: 'sunglasses',
    type: 'wayfarer',
    frameColor: '#111111',
    lensColor: 'rgba(15, 35, 25, 0.65)', // G-15 green tint
    price: 9990,
    aspectRatio: 0.39,
    thumb: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'rb-aviator-3025',
    name: 'Ray-Ban Aviator Classic RB3025',
    brand: 'Ray-Ban',
    category: 'sunglasses',
    type: 'aviator',
    frameColor: '#D4AF37',
    lensColor: 'rgba(20, 50, 30, 0.62)',
    price: 11990,
    aspectRatio: 0.43,
    thumb: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'oakley-holbrook-9102',
    name: 'Oakley Holbrook OO9102',
    brand: 'Oakley',
    category: 'sunglasses',
    type: 'wayfarer',
    frameColor: '#1C1C1E',
    lensColor: 'rgba(20, 20, 25, 0.70)',
    price: 15490,
    aspectRatio: 0.38,
    thumb: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'fastrack-sport-109',
    name: 'Fastrack NBP109BK1 Sporty',
    brand: 'Fastrack',
    category: 'sunglasses',
    type: 'geometric',
    frameColor: '#0F172A',
    lensColor: 'rgba(30, 40, 60, 0.68)',
    price: 1495,
    aspectRatio: 0.37,
    thumb: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'vc-cateye-sun-14227',
    name: 'Vincent Chase Polarized Cat Eye',
    brand: 'Vincent Chase',
    category: 'sunglasses',
    type: 'catEye',
    frameColor: '#5C3A21',
    lensColor: 'rgba(80, 40, 20, 0.58)',
    price: 1699,
    aspectRatio: 0.40,
    thumb: 'https://images.unsplash.com/photo-1577744486770-020ab432438a?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'titan-dash-aviator',
    name: 'Titan Eye+ Dash UV400 Aviator',
    brand: 'Titan Eye+',
    category: 'sunglasses',
    type: 'aviator',
    frameColor: '#374151',
    lensColor: 'rgba(15, 30, 60, 0.65)',
    price: 3990,
    aspectRatio: 0.42,
    thumb: 'https://images.unsplash.com/photo-1522478706765-f001a9ad7e8b?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'asif-retro-round',
    name: 'Asif Collections Round Retro',
    brand: 'Asif Collections',
    category: 'sunglasses',
    type: 'round',
    frameColor: '#D4AF37',
    lensColor: 'rgba(90, 50, 25, 0.60)',
    price: 999,
    aspectRatio: 0.42,
    thumb: 'https://images.unsplash.com/photo-1529159696229-09e95dbd36d7?w=320&h=200&fit=crop&auto=format',
  },

  // ── Computer / Blue-Cut Glasses ──
  {
    id: 'blu-zero-13380',
    name: 'Lenskart Blu Zero Power LB',
    brand: 'Lenskart Blu',
    category: 'computer_glasses',
    type: 'rectangle',
    frameColor: '#18181B',
    lensColor: 'rgba(147, 197, 253, 0.22)', // blue-light blocking shimmer
    price: 1500,
    aspectRatio: 0.38,
    thumb: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'jj-blu-screen-16540',
    name: 'John Jacobs Blu Screen JJ',
    brand: 'John Jacobs',
    category: 'computer_glasses',
    type: 'rectangle',
    frameColor: '#1E3A8A',
    lensColor: 'rgba(147, 197, 253, 0.24)',
    price: 3490,
    aspectRatio: 0.39,
    thumb: 'https://images.unsplash.com/photo-1587091813089-8b8f8f71e01d?w=320&h=200&fit=crop&auto=format',
  },
  {
    id: 'vc-blu-slim-12300',
    name: 'Vincent Chase Blu Slim VC',
    brand: 'Vincent Chase',
    category: 'computer_glasses',
    type: 'catEye',
    frameColor: '#E11D48',
    lensColor: 'rgba(147, 197, 253, 0.20)',
    price: 1299,
    aspectRatio: 0.38,
    thumb: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=320&h=200&fit=crop&auto=format',
  },
];

// ── Realistic Canvas Glasses Renderer ──
const drawGlassesFrame = (ctx, frame, width, height) => {
  const fc = frame.frameColor || '#1A1A1A';
  const lc = frame.lensColor || 'rgba(255, 255, 255, 0.1)';
  const type = frame.type || 'rectangle';
  const sw = Math.max(3.2, width * 0.024);

  ctx.save();
  ctx.strokeStyle = fc;
  ctx.fillStyle = lc;
  ctx.lineWidth = sw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const halfW = width / 2;
  const halfH = height / 2;

  if (type === 'aviator') {
    const lensW = width * 0.42;
    const lensH = height * 0.90;
    const bridgeW = width * 0.12;

    // Double top bridge
    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, -halfH * 0.48);
    ctx.quadraticCurveTo(0, -halfH * 0.70, bridgeW / 2, -halfH * 0.48);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, -halfH * 0.18);
    ctx.quadraticCurveTo(0, -halfH * 0.38, bridgeW / 2, -halfH * 0.18);
    ctx.stroke();

    // Left teardrop lens
    ctx.beginPath();
    const lcx = -bridgeW / 2 - lensW / 2;
    ctx.ellipse(lcx, 0, lensW / 2, lensH / 2, 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right teardrop lens
    ctx.beginPath();
    const rcx = bridgeW / 2 + lensW / 2;
    ctx.ellipse(rcx, 0, lensW / 2, lensH / 2, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Temples
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH * 0.22);
    ctx.lineTo(lcx - lensW / 2, -halfH * 0.22);
    ctx.moveTo(halfW, -halfH * 0.22);
    ctx.lineTo(rcx + lensW / 2, -halfH * 0.22);
    ctx.stroke();
  } else if (type === 'round') {
    const radius = Math.min(width * 0.21, height * 0.45);
    const bridgeW = width * 0.14;

    // Bridge arc
    ctx.beginPath();
    ctx.arc(0, -radius * 0.12, bridgeW * 0.65, Math.PI * 0.85, Math.PI * 0.15, true);
    ctx.stroke();

    // Left circle lens
    ctx.beginPath();
    const lcx = -bridgeW / 2 - radius;
    ctx.arc(lcx, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right circle lens
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
    const lensW = width * 0.43;
    const lensH = height * 0.88;
    const bridgeW = width * 0.12;

    // Bridge
    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, -halfH * 0.1);
    ctx.quadraticCurveTo(0, -halfH * 0.35, bridgeW / 2, -halfH * 0.1);
    ctx.stroke();

    // Left cat-eye lens
    ctx.beginPath();
    const lcx = -bridgeW / 2 - lensW;
    ctx.moveTo(lcx + lensW, -halfH * 0.1);
    ctx.quadraticCurveTo(lcx + lensW * 0.5, halfH * 0.95, lcx, halfH * 0.35);
    ctx.quadraticCurveTo(lcx - 14, -halfH * 0.95, lcx + lensW * 0.3, -halfH * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right cat-eye lens
    ctx.beginPath();
    const rcx = bridgeW / 2;
    ctx.moveTo(rcx, -halfH * 0.1);
    ctx.quadraticCurveTo(rcx + lensW * 0.5, halfH * 0.95, rcx + lensW, halfH * 0.35);
    ctx.quadraticCurveTo(rcx + lensW + 14, -halfH * 0.95, rcx + lensW * 0.7, -halfH * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (type === 'clubmaster') {
    const lensW = width * 0.42;
    const lensH = height * 0.84;
    const bridgeW = width * 0.13;

    // Bridge
    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, -halfH * 0.15);
    ctx.quadraticCurveTo(0, -halfH * 0.42, bridgeW / 2, -halfH * 0.15);
    ctx.stroke();

    // Left bottom rim
    const lcx = -bridgeW / 2 - lensW / 2;
    ctx.beginPath();
    ctx.roundRect(lcx - lensW / 2, -lensH / 2, lensW, lensH, [4, 4, 18, 18]);
    ctx.fill();
    ctx.stroke();

    // Left heavy browline
    ctx.save();
    ctx.lineWidth = sw * 2.3;
    ctx.beginPath();
    ctx.moveTo(-halfW + 4, -halfH * 0.35);
    ctx.quadraticCurveTo(lcx, -halfH * 0.70, -bridgeW / 2, -halfH * 0.35);
    ctx.stroke();
    ctx.restore();

    // Right bottom rim
    const rcx = bridgeW / 2 + lensW / 2;
    ctx.beginPath();
    ctx.roundRect(rcx - lensW / 2, -lensH / 2, lensW, lensH, [4, 4, 18, 18]);
    ctx.fill();
    ctx.stroke();

    // Right heavy browline
    ctx.save();
    ctx.lineWidth = sw * 2.3;
    ctx.beginPath();
    ctx.moveTo(bridgeW / 2, -halfH * 0.35);
    ctx.quadraticCurveTo(rcx, -halfH * 0.70, halfW - 4, -halfH * 0.35);
    ctx.stroke();
    ctx.restore();
  } else if (type === 'geometric') {
    const r = Math.min(width * 0.22, height * 0.46);
    const bridgeW = width * 0.12;

    // Bridge
    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, 0);
    ctx.quadraticCurveTo(0, -halfH * 0.28, bridgeW / 2, 0);
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
    // Classic Wayfarer / Modern Rectangle
    const lensW = width * 0.42;
    const lensH = height * 0.86;
    const bridgeW = width * 0.14;

    // Bridge
    ctx.beginPath();
    ctx.moveTo(-bridgeW / 2, -halfH * 0.1);
    ctx.quadraticCurveTo(0, -halfH * 0.38, bridgeW / 2, -halfH * 0.1);
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

  // Realistic lens glare diagonal shine
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = Math.max(2, sw * 0.55);
  ctx.beginPath();
  ctx.moveTo(-width * 0.34, -height * 0.28);
  ctx.lineTo(-width * 0.18, height * 0.22);
  ctx.moveTo(width * 0.18, -height * 0.28);
  ctx.lineTo(width * 0.34, height * 0.22);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
};

const VirtualTryOn = () => {
  // ── States ──
  const [framesList, setFramesList] = useState(ALL_STORE_GLASSES);
  const [selectedFrame, setSelectedFrame] = useState(ALL_STORE_GLASSES[0]);
  const [filterCat, setFilterCat] = useState('all');
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const [cameraError, setCameraError] = useState('');
  const [aiStatus, setAiStatus] = useState('Standby');
  const [autoFit, setAutoFit] = useState(true);
  const [scaleOffset, setScaleOffset] = useState(1.0);
  const [yOffset, setYOffset] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);

  // ── Stable Refs for Render Loop (Fixes Stale Closure) ──
  const selectedFrameRef = useRef(selectedFrame);
  const autoFitRef = useRef(autoFit);
  const scaleOffsetRef = useRef(scaleOffset);
  const yOffsetRef = useRef(yOffset);

  // Keep refs synchronized immediately on any state change
  useEffect(() => {
    selectedFrameRef.current = selectedFrame;
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

  // DOM & Media Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const faceMeshRef = useRef(null);
  const animFrameId = useRef(null);
  const fileInputRef = useRef(null);

  // Filtered smoothed face state
  const smoothedFaceRef = useRef({
    x: 0,
    y: 0,
    width: 220,
    height: 88,
    angle: 0,
    detected: false,
  });

  // ── Fetch any additional products from backend API on mount ──
  useEffect(() => {
    const fetchApiProducts = async () => {
      try {
        const response = await axios.get('products/');
        if (response.data && response.data.length > 0) {
          const apiFrames = response.data
            .filter((p) => p.category !== 'contact_lenses')
            .map((p) => {
              // Map backend attributes to try-on specs
              let shape = 'rectangle';
              if (p.frame_shape === 'aviator') shape = 'aviator';
              else if (p.frame_shape === 'round') shape = 'round';
              else if (p.frame_shape === 'cat_eye') shape = 'catEye';
              else if (p.frame_shape === 'wayfarer') shape = 'wayfarer';
              else if (p.frame_shape === 'geometric') shape = 'geometric';

              let color = '#1F2937';
              const c = (p.frame_color || '').toLowerCase();
              if (c.includes('gold')) color = '#D4AF37';
              else if (c.includes('silver')) color = '#C0C0C0';
              else if (c.includes('blue')) color = '#2563EB';
              else if (c.includes('brown')) color = '#6B3A2A';
              else if (c.includes('tortoise')) color = '#5C3A21';
              else if (c.includes('pink')) color = '#D15275';
              else if (c.includes('gunmetal')) color = '#4B5563';

              return {
                id: `api-${p.id}`,
                name: p.name,
                brand: p.brand || 'MAXVISION',
                category: p.category,
                type: shape,
                frameColor: color,
                lensColor:
                  p.category === 'sunglasses'
                    ? 'rgba(15, 30, 40, 0.62)'
                    : 'rgba(255, 255, 255, 0.08)',
                price: p.price,
                aspectRatio: 0.39,
                thumb:
                  p.image_url ||
                  p.image ||
                  'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=320&h=200&fit=crop&auto=format',
              };
            });

          // Merge without duplicates
          setFramesList((prev) => {
            const existingIds = new Set(prev.map((f) => f.id));
            const newOnes = apiFrames.filter((f) => !existingIds.has(f.id));
            return [...prev, ...newOnes];
          });
        }
      } catch (err) {
        // Fallback to built-in catalog if offline or backend is booting
      }
    };
    fetchApiProducts();
  }, []);

  // ── Selection Click Handler: Immediately Updates State & Ref ──
  const handleSelectFrame = (frame) => {
    const nextSelection = selectedFrame?.id === frame.id ? null : frame;
    setSelectedFrame(nextSelection);
    selectedFrameRef.current = nextSelection;
  };

  // ── MediaPipe FaceMesh Initialization ──
  const initFaceMesh = useCallback(() => {
    return new Promise((resolve, reject) => {
      const setupInstance = () => {
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
        setupInstance();
      } else {
        let count = 0;
        const interval = setInterval(() => {
          count++;
          if (window.FaceMesh) {
            clearInterval(interval);
            setupInstance();
          } else if (count > 30) {
            clearInterval(interval);
            reject(new Error('MediaPipe script load timeout'));
          }
        }, 150);
      }
    });
  }, []);

  // ── Face Tracking Landmark Calculations ──
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

    // Pupil / eye centers
    const leftPupil = landmarks[468] || landmarks[33];
    const rightPupil = landmarks[473] || landmarks[263];

    // Temple roots
    const leftTemple = landmarks[234] || landmarks[33];
    const rightTemple = landmarks[454] || landmarks[263];

    // Nasal bridge between eyes
    const bridge = landmarks[168] || landmarks[6] || {
      x: (leftPupil.x + rightPupil.x) / 2,
      y: (leftPupil.y + rightPupil.y) / 2,
    };

    // Mirrored screen coordinates
    const p1X = (1 - leftPupil.x) * w;
    const p1Y = leftPupil.y * h;
    const p2X = (1 - rightPupil.x) * w;
    const p2Y = rightPupil.y * h;

    const targetCenterX = (1 - bridge.x) * w;
    const targetCenterY = (bridge.y * h + (p1Y + p2Y) / 2) / 2;

    // Head tilt roll angle
    const targetAngle = Math.atan2(p2Y - p1Y, p2X - p1X);

    // Physical frame scale based on temple span
    const t1X = (1 - leftTemple.x) * w;
    const t1Y = leftTemple.y * h;
    const t2X = (1 - rightTemple.x) * w;
    const t2Y = rightTemple.y * h;
    const templeSpan = Math.hypot(t2X - t1X, t2Y - t1Y);

    const targetWidth = templeSpan * 1.15;
    const currentFrame = selectedFrameRef.current;
    const targetHeight = targetWidth * (currentFrame?.aspectRatio || 0.39);

    // Smooth filtering (Low-pass filter for jitter reduction)
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

    setAiStatus('Face Locked & Auto-Fitted (AI)');
  }, []);

  // ── Canvas Render Loop (Reads Ref on Every Frame) ──
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

        // 1. Draw mirrored camera frame
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();

        // 2. Feed frame to MediaPipe every ~40ms (25fps tracking)
        if (faceMeshRef.current && timestamp - lastSendTime > 40) {
          lastSendTime = timestamp;
          try {
            await faceMeshRef.current.send({ image: video });
          } catch (e) {
            // ignore frame error during camera transition
          }
        }

        // 3. Draw Selected Glasses Frame directly from Ref
        const activeFrame = selectedFrameRef.current;
        if (activeFrame) {
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
            rh = (face.width * (activeFrame.aspectRatio || 0.39)) * sMult;
            rAngle = face.angle;
          } else {
            rx = w / 2;
            ry = h * 0.38 + yShift;
            rw = w * 0.48 * sMult;
            rh = rw * (activeFrame.aspectRatio || 0.39);
            rAngle = 0;
          }

          // Transform and draw precisely at face position
          ctx.translate(rx, ry);
          ctx.rotate(rAngle);

          if (activeFrame.customImage) {
            ctx.drawImage(
              activeFrame.customImage,
              -rw / 2,
              -rh / 2,
              rw,
              rh
            );
          } else {
            drawGlassesFrame(ctx, activeFrame, rw, rh);
          }

          ctx.restore();
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);
  }, []);

  // ── Camera Control ──
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

      await initFaceMesh();
      setCameraActive(true);
      startRenderLoop();
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Please allow camera permissions in your browser to use Virtual Try-On.');
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

  // ── Custom Glasses Image Upload Handler ──
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
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 20) || 'Custom Glasses',
          brand: 'Uploaded Design',
          category: 'eyeglasses',
          type: 'custom',
          customImage: img,
          aspectRatio: aspect,
          thumb: event.target.result,
          price: 0,
        };

        setFramesList((prev) => [newCustomFrame, ...prev]);
        setSelectedFrame(newCustomFrame);
        selectedFrameRef.current = newCustomFrame;
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
      {/* Hidden raw video feed */}
      <video ref={videoRef} playsInline muted style={{ display: 'none' }} />

      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 text-white py-10 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3 backdrop-blur-sm">
            <FaMagic className="text-yellow-400" /> AI Real-Time Face Fitting
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            Virtual Glasses Try-On
          </h1>
          <p className="text-blue-200 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Select any glasses on the left to see them automatically track and fit your face!
          </p>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT PANEL: All Glasses List (4 cols) ════ */}
          <div className="lg:col-span-5 flex flex-col gap-4">
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
                  Try your own transparent PNG glasses design
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex border-b border-gray-100 bg-gray-50/60">
                {[
                  { key: 'all', label: 'All Glasses' },
                  { key: 'eyeglasses', label: 'Eyeglasses' },
                  { key: 'sunglasses', label: 'Sunglasses' },
                  { key: 'computer_glasses', label: 'Computer' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilterCat(tab.key)}
                    className={`flex-1 py-3 text-xs font-bold transition-all ${
                      filterCat === tab.key
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* All Glasses Scrollable Cards List */}
              <div className="p-3 max-h-[580px] overflow-y-auto space-y-2.5">
                <div className="px-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Click any frame to wear it instantly ({filteredFrames.length} styles)
                </div>

                {filteredFrames.map((frame) => {
                  const isSelected = selectedFrame?.id === frame.id;
                  return (
                    <motion.div
                      key={frame.id}
                      whileHover={{ scale: 1.012 }}
                      whileTap={{ scale: 0.988 }}
                      onClick={() => handleSelectFrame(frame)}
                      className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-md ring-2 ring-blue-500/20'
                          : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50/50'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
                        <img
                          src={frame.thumb}
                          alt={frame.name}
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                            {frame.name}
                          </h4>
                          {frame.customImage && (
                            <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-1.5 py-0.5 rounded">
                              UPLOADED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">{frame.brand}</span>
                          <span>•</span>
                          <span className="capitalize">{frame.type}</span>
                          {frame.price > 0 && (
                            <>
                              <span>•</span>
                              <span className="font-bold text-green-700">₹{frame.price}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Selection Indicator Checkmark */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all font-bold text-xs ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'border-2 border-gray-300 text-transparent hover:border-gray-400'
                        }`}
                      >
                        <FaCheck size={11} />
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
            <div className="bg-black rounded-3xl overflow-hidden relative shadow-2xl border-4 border-gray-900 aspect-video flex items-center justify-center">

              {/* Standby State Overlay */}
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-b from-gray-900 via-gray-900 to-black p-6 text-center z-20">
                  <div className="w-20 h-20 bg-blue-600/20 border-2 border-blue-500/40 rounded-full flex items-center justify-center mb-5 text-blue-400 shadow-inner">
                    <BsCameraVideoFill size={36} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black mb-2">
                    Ready to Try On Glasses?
                  </h3>
                  <p className="text-gray-400 text-sm max-w-md mb-6 leading-relaxed">
                    Click below to open your front camera. Click any frame on the left and our AI face detector will automatically place and size it on your face in real time!
                  </p>
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all text-base"
                  >
                    <BsCameraVideoFill /> Start Live Mirror
                  </button>

                  {cameraError && (
                    <p className="mt-4 text-xs bg-red-900/60 border border-red-500 text-red-200 px-4 py-2 rounded-xl max-w-sm">
                      {cameraError}
                    </p>
                  )}
                </div>
              )}

              {/* Live Render Canvas (Synchronized Camera Feed + AI Overlay) */}
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

                  {/* Active Frame Pill at Bottom of Camera */}
                  {selectedFrame && (
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-white">
                      <div className="flex items-center gap-2 truncate">
                        <FaTag className="text-blue-400 text-xs" />
                        <span className="font-bold text-sm truncate">{selectedFrame.name}</span>
                        <span className="text-xs text-gray-300">({selectedFrame.brand})</span>
                      </div>
                      <button
                        onClick={() => handleSelectFrame(selectedFrame)}
                        className="text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
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
