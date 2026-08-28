import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check, RotateCcw, Paintbrush, Eraser } from 'lucide-react';

const COLORS = ['#1e1e1e', '#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#ec4899', '#ffffff'];
const SIZES = [2, 4, 8, 14];

export default function DoodleModal({ isOpen, onClose, onSendDoodle }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#1e1e1e');
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set dimensions with retina support
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Warm paper sketchbook background
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw light sketchbook grid lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 20; x < rect.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 20; y < rect.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
  }, [isOpen]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#faf8f5' : color;
    ctx.lineWidth = isEraser ? lineWidth * 3 : lineWidth;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const handleSend = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSendDoodle(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-lg glass-card rounded-3xl overflow-hidden sketch-border shadow-2xl flex flex-col bg-card/95"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <Paintbrush size={18} className="text-primary" />
            <h2 className="text-base font-heading font-bold">Hand-Drawn Sketch Pad</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-card/60 text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="p-4 flex justify-center">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-64 rounded-2xl sketch-border shadow-inner cursor-crosshair touch-none bg-[#faf8f5]"
          />
        </div>

        {/* Toolbar */}
        <div className="px-4 pb-4 space-y-3">
          {/* Colors and Eraser */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto py-1">
            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setIsEraser(false);
                  }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c && !isEraser ? 'scale-110 border-primary shadow-sm ring-2 ring-primary/40' : 'border-border'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEraser(!isEraser)}
                className={`p-2 rounded-xl sketch-border transition-colors ${
                  isEraser ? 'bg-primary text-primary-foreground' : 'bg-card/40 hover:bg-card/70'
                }`}
                title="Eraser"
              >
                <Eraser size={16} />
              </button>

              <button
                onClick={clearCanvas}
                className="p-2 rounded-xl sketch-border bg-card/40 hover:bg-card/70 text-muted-foreground hover:text-foreground"
                title="Clear"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Line widths & Send */}
          <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-body">Stroke:</span>
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setLineWidth(s)}
                  className={`w-7 h-7 rounded-xl sketch-border flex items-center justify-center ${
                    lineWidth === s ? 'bg-primary/20 text-primary font-bold' : 'bg-card/40'
                  }`}
                >
                  <span
                    className="rounded-full bg-current"
                    style={{ width: Math.max(3, s), height: Math.max(3, s) }}
                  />
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-heading font-bold hover:bg-card/40 sketch-border"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-xl sketch-fill text-xs font-heading font-bold text-primary-foreground flex items-center gap-1.5"
              >
                <Check size={15} /> Send Doodle
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
