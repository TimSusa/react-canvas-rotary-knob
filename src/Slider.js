import React, { useEffect, useRef, useState } from "react";

function Slider({ width = 160, height = 160, value = 0.5 }) {
  //const $window = window || {};
  const canvasRef = useRef(null);
  let context = useRef(null);
  let animationFrameId = useRef(null);
  const [val, setVal] = useState(value);
  const isDragging = useRef(false);
  const verticalDiff = useRef(0);
  const lastOffset = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;

    context.current = canvas.getContext("2d");
    var radius = canvas.height / 2;
    context.current.translate(radius, radius);
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
      <div>{val.toString()}</div>
    </div>
  );

  function yToVal(y) {
    const val = y / canvasRef.current.height;
    //const tmpVal = val < 0 ? 0 : val > 1 ? 1 : val;
    const ttval = isNaN(val) ? value : val;
    console.log('yToVal ', val, y, ttval)
    return ttval;
  }


  function valToY(val) {
    const tmpVal = canvasRef.current.height * val
    //console.log('valToY ', val, tmpVal)
    return tmpVal
  }

  function draw(vDiff) {
    const ctx = context.current;
    if (!ctx.canvas) return;
    const val = yToVal(vDiff);
    setVal(val);
    drawHand(ctx, -val * Math.PI*2 );
  }

  function handleDown(ev) {
    console.log('handle down ', ev.nativeEvent.offsetY)
    //animationFrameId.current = $window.requestAnimationFrame(draw);

    canvasRef.current.setPointerCapture(ev.pointerId);
    // if (isDragging.current === false) {
    //   verticalDiff.current = ev.nativeEvent.offsetY ;
    // } 


    verticalDiff.current = ev.nativeEvent.offsetY;
    isDragging.current = true;
  }

  function handleMove(e) {
    if (isDragging.current === true) {
      const tV = -e.nativeEvent.offsetY + verticalDiff.current + lastOffset.current
      console.log('last offset ', tV, lastOffset.current)

      draw(tV);
    }
  }

  function handleCancel(ev) {
    canvasRef.current.releasePointerCapture(ev.pointerId);
    //$window.cancelAnimationFrame(animationFrameId.current);
    lastOffset.current = valToY(val)
    isDragging.current = false;
  }

  function drawHand(ctx, pos) {
    ctx.clearRect(
      -canvasRef.current.width / 2,
      -canvasRef.current.height / 2,
      width,
      height,
    );
    console.log('rot ', pos)
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.arc(0, 0, canvasRef.current.width / 2, 0, Math.PI * 2, true);
    ctx.moveTo(0, 0);
    ctx.rotate(-pos);
    ctx.lineTo(0, -height / 2);
    ctx.stroke();
    ctx.rotate(pos);
  }
}

export default Slider;
