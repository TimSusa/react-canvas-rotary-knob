import React, { useEffect, useRef, useState } from "react";

export default RotaryKnob;

function RotaryKnob({
  isDisabled = false,
  width = 160,
  height = 160,
  value = 80,
  max = 127,
  backgroundColor = "#ccc",
  color = "#37332ee0",
  showValueLabel = true,
  cbValChanged = (val: number) => val,
}) {
  const caretWidth = width / 40;
  const canvasRef: any = useRef(null);
  const context = useRef(null);
  const [val, setVal] = useState(value);
  const isDragging = useRef(false);
  const verticalDiff = useRef(0);
  const lastOffset = useRef(0);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    context.current = canvas.getContext("2d");
    const ctx: any = context.current;
    var radius = canvas.height / 2;
    lastOffset.current = valToY(val);
    ctx.lineWidth = caretWidth;
    ctx.lineCap = "round";
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = color;
    ctx.translate(radius, radius);
    draw(valToY(val));
    return () => {
      //ctx.translate(-radius, -radius);
      ctx.restore();
    };
  }, [width, height]);

  return (
    <div>
      <canvas
        width={width}
        height={height}
        onPointerDown={isDisabled ? noop : handleDown}
        onPointerMove={isDisabled ? noop : handleMove}
        onPointerUp={isDisabled ? noop : handleCancel}
        ref={canvasRef}
      />
      {showValueLabel && (
        <div>{val.toString().slice(0, 5)}</div>
      )}
    </div>
  );

  function yToVal(y: number) {
    const tH = canvasRef.current.height;
    const val = y / tH;
    const ttH = 1;
    const tmpVal = val < 0 ? 0 : val > ttH ? ttH : val;
    const ttval = isNaN(tmpVal) ? value : tmpVal;
    return ttval;
  }

  function valToY(val: number) {
    const tmpVal = canvasRef.current.height * val / max;
    return tmpVal;
  }

  function draw(vDiff: number) {
    const ctx: any = context.current;
    if (!ctx.canvas) return;
    const vall = yToVal(vDiff) * max;
    setVal(vall);
    cbValChanged(vall);
    drawCaret(ctx, -vall * Math.PI * 2);
  }

  function handleDown(ev: any) {
    canvasRef.current.setPointerCapture(ev.pointerId);
    verticalDiff.current = ev.nativeEvent.offsetY;
    isDragging.current = true;
  }

  function handleMove(e: any) {
    if (isDragging.current === true) {
      const tV = -e.nativeEvent.offsetY + verticalDiff.current +
        lastOffset.current;
      draw(tV);
    }
  }

  function handleCancel(ev: any) {
    canvasRef.current.releasePointerCapture(ev.pointerId);
    lastOffset.current = valToY(val);
    isDragging.current = false;
  }

  function drawCaret(ctx: any, pos: number) {
    ctx.clearRect(
      -canvasRef.current.width / 2,
      -canvasRef.current.height / 2,
      width,
      height,
    );
    ctx.lineWidth = caretWidth;
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      canvasRef.current.width / 2 - 2 * caretWidth,
      0,
      Math.PI * 2,
      true,
    );
    // ctx.closePath();
    ctx.fill();

    ctx.moveTo(0, 0);
    ctx.rotate(-pos);
    ctx.lineTo(0, -canvasRef.current.width / 2 + 2 * caretWidth);
    ctx.stroke();
    ctx.rotate(pos);
    //ctx.fill()
    // ctx.font = "30px Arial";
    //ctx.strokeText(val, -2*caretWidth, caretWidth);
  }
}

function noop() {}
