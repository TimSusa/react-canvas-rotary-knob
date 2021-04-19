import React, { useEffect, useRef, useState } from "react";
import { debounce } from "debounce";

export default RotaryKnob;

type tRotaryKnob = {
  isDisabled?: boolean | undefined;
  width?: number | undefined;
  value?: number | undefined;
  max?: number | undefined;
  min?: number | undefined;
  backgroundColor?: string | undefined;
  color?: string | undefined;
  caretColor?: string | undefined;
  showValueLabel?: boolean | undefined;
  debounceDelay?: number | undefined;
  lineWidth?: number | undefined;
  cbValChanged?: ((val: number) => number) | undefined;
};

function RotaryKnob({
  isDisabled = false,
  width: tWidth = 160,
  value = 80,
  max = 127,
  min = 0,
  backgroundColor = "#ccc",
  color = "#37332ee0",
  caretColor = "#67332ee0",
  showValueLabel = true,
  debounceDelay = 5,
  lineWidth = 40,
  cbValChanged = (val: number) => val,
}: tRotaryKnob) {
  const caretWidth = tWidth / lineWidth;
  const width = tWidth - 4 * caretWidth;
  const height = tWidth - 4 * caretWidth;
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  let context = useRef<CanvasRenderingContext2D | null>(null);
  const [val, setVal] = useState(value);
  const isDragging = useRef(false);
  const verticalDiff = useRef(0);
  const lastOffset = useRef(0);
  let send: any = useRef(null);
  const isFloatNumberMode = useRef(false);

  useEffect(() => {
    if ((max - min) <= 1) {
      isFloatNumberMode.current = true;
    }

    const canvas: HTMLCanvasElement = canvasRef.current!;
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
    context.current = ctx;
    canvas.focus();

    send.current = debounce(sendValOut, debounceDelay);
    function sendValOut(val: any) {
      return cbValChanged(isFloatNumberMode.current ? val : Math.floor(val));
    }

    return () => {
      send.current = null;
      ctx.restore();
    };
  }, [max, min, debounceDelay, cbValChanged]);

  useEffect(() => {
    lastOffset.current = valToY(val);
    if (context.current) {
      context.current.lineWidth = caretWidth;
      context.current.lineCap = "round";
      context.current.fillStyle = backgroundColor;
      context.current.strokeStyle = color;
    }

    draw(valToY(val));
    return () => {
      context.current && context.current.restore();
    };
  }, [color, backgroundColor, width, height, caretWidth]);

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
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const tH: number = canvas.height;
    const val = y / tH;
    const ttH = 1;
    const tmpVal = val < 0 ? 0 : val > ttH ? ttH : val;
    const ttval = isNaN(tmpVal) ? value : tmpVal;
    return ttval;
  }

  function valToY(val: number) {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const tmpVal = canvas.height * val / max;
    return tmpVal;
  }

  function draw(vDiff: number) {
    const ctx: any = context.current;
    if (!ctx.canvas) return;
    const yVal: number = yToVal(vDiff);
    const yValTmp: number = yVal * max;
    setVal(yValTmp);
    send.current(yValTmp);
    clearCanvasRect(ctx);
    drawCaret(ctx, yVal);
  }

  function handleDown(ev: any) {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    canvas.setPointerCapture(ev.pointerId);
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
    const canvas: HTMLCanvasElement = canvasRef.current!;
    canvas.releasePointerCapture(ev.pointerId);
    lastOffset.current = valToY(val);
    isDragging.current = false;
  }

  function clearCanvasRect(ctx: any) {
    // ctx.clearRect(
    //   -canvasRef.current.width / 2,
    //   -canvasRef.current.height / 2,
    //   width,
    //   height,
    // );
    ctx.restore();
  }
  function drawCaret(ctx: any, pos: number) {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);
    const xOffSet = canvas.width / 2;
    ctx.lineWidth = caretWidth;
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      xOffSet - caretWidth,
      0,
      Math.PI * 2,
      true,
    );
    ctx.strokeStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    const rot = -pos * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.rotate(-rot);
    ctx.lineTo(0, xOffSet - 4 * caretWidth);
    ctx.rotate(rot);
    ctx.strokeStyle = caretColor;
    ctx.lineWidth = caretWidth * 2;
    ctx.stroke();
    ctx.translate(-radius, -radius);
    ctx.closePath();
  }
}

function noop() {}
