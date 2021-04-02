import React, { useEffect, useRef, useState } from "react";

function RotaryKnob ({ width = 160, height = 160, value = 80, max = 127 }) {
  const caretWidth = width / 40;
  const canvasRef = useRef(null);
  const context = useRef(null);
  const [val, setVal] = useState(value);
  const isDragging = useRef(false);
  const verticalDiff = useRef(0);
  const lastOffset = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;

    context.current = canvas.getContext("2d");
    var radius = canvas.height / 2;
    context.current.translate(radius, radius);
    lastOffset.current = valToY(val)

    draw(valToY(val));
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
      <div>{val.toString().slice(0, 5)}</div>
    </div>
  );

  function yToVal(y) {
    const tH = canvasRef.current.height
    const val = y / tH;
    const ttH = 1
    const tmpVal = val < 0 ? 0 : val > ttH ? ttH : val;
    const ttval = isNaN(tmpVal) ? value : tmpVal;
    return ttval;
  }


  function valToY(val) {
    const tmpVal = canvasRef.current.height * val / max
    return tmpVal
  }

  function draw(vDiff) {
    const ctx = context.current;
    if (!ctx.canvas) return;
    const val = yToVal(vDiff);
    setVal(val * max);
    drawCaret(ctx, -val * Math.PI * 2);
  }

  function handleDown(ev) {
    canvasRef.current.setPointerCapture(ev.pointerId);
    verticalDiff.current = ev.nativeEvent.offsetY;
    isDragging.current = true;
  }

  function handleMove(e) {
    if (isDragging.current === true) {
      const tV = -e.nativeEvent.offsetY + verticalDiff.current + lastOffset.current
      draw(tV);
    }
  }

  function handleCancel(ev) {
    canvasRef.current.releasePointerCapture(ev.pointerId);
    lastOffset.current = valToY(val)
    isDragging.current = false;
  }

  function drawCaret(ctx, pos) {
    ctx.clearRect(
      -canvasRef.current.width / 2,
      -canvasRef.current.height / 2,
      width,
      height,
    );
    ctx.beginPath();
    ctx.lineWidth = caretWidth;
    ctx.lineCap = "round";
    ctx.arc(0, 0, canvasRef.current.width / 2 - 2 * caretWidth, 0, Math.PI * 2, true);
    ctx.moveTo(0, 0);
    ctx.rotate(-pos);
    ctx.lineTo(0, -canvasRef.current.width / 2 + 2 * caretWidth);
    ctx.stroke();
    ctx.rotate(pos);
  }
}

export default RotaryKnob
  ;
