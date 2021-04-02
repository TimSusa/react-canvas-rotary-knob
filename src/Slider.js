import React, { useEffect, useRef, useState } from "react";

function Slider({ width = 160, height = 160, value = 0.5 }) {
  const $window = window || {};
  const canvasRef = useRef(null);
  let context = useRef(null);
  let animationFrameId = useRef(null);
  const [val, setVal] = useState(value);
  const isDragging = useRef(false);
  const verticalDiff = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;

    context.current = canvas.getContext("2d");
    var radius = canvas.height / 2;
    context.current.translate(radius, radius);
    draw(0);
  }, []);

  return (
    <div
    >
      <canvas
        width={width}
        height={height}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleCancel}
        ref={canvasRef}
      />
      <div>{val.toString()}</div>
    </div>
  );

  function yToVal(y: number) {
    const val = y / canvasRef.current.height ;
    const tmpVal = val < 0 ? 0 : val > 1 ? 1 : val;
    const ttval = isNaN(tmpVal) ? value : tmpVal;

    return ttval;
  }

  function draw(vDiff: number) {
    const ctx = context.current;
    if (!ctx.canvas) return;
    const val = -yToVal(vDiff);
    const v = val + 1;
    setVal(v);
    if (isNaN(val)) return;
    drawHand(ctx, val * Math.PI * 2);
  }

  function handleDown(ev) {
    console.log('handle down ', ev.nativeEvent.offsetY )
    isDragging.current = true;
    //animationFrameId.current = $window.requestAnimationFrame(draw);
    canvasRef.current.setPointerCapture(ev.pointerId);
    verticalDiff.current = ev.nativeEvent.offsetY ;
  }

  function handleMove(e) {
    if (isDragging.current === true) {
      const tV = e.nativeEvent.offsetY - verticalDiff.current 
      draw(tV);
    }
  }

  function handleCancel(ev) {
    canvasRef.current.releasePointerCapture(ev.pointerId);
    //$window.cancelAnimationFrame(animationFrameId.current);
    isDragging.current = false;
  }

  function drawHand(ctx, pos: number) {
    ctx.clearRect(
      -canvasRef.current.width / 2,
      -canvasRef.current.height / 2,
      width,
      height,
    );

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.arc(0, 0, canvasRef.current.width / 2, 0, Math.PI * 2, true);
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -height / 2);
    ctx.stroke();
    ctx.rotate(-pos);
  }
}

export default Slider;
