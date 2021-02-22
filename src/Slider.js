import React, { useRef, useEffect } from 'react'

function Slider (){
  const canvasRef = useRef(null)
  let context = useRef(null)

  useEffect(()=>{
    const canvas = canvasRef.current
    context.current = canvas.getContext('2d')
  },[])
  
  useEffect(() => {
  let animationFrameId = null

  draw(0)
    animationFrameId = window.requestAnimationFrame(draw)
    console.log('draw with animationFrameId: ', animationFrameId)
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }

  }, [draw])
  
  return <div><canvas width={450} heigth={450} onPointerDown= {handleDown} onPointerUp={handleCancel} ref={canvasRef} /></div>

  function draw (e) {
     e && console.log(e.clientY)
    const ctx = context.current
    if (!ctx.canvas) return
    var radius = ctx.canvas.height / 4 ;
     drawFace(ctx, radius);
     const val = e.clientY / ctx.canvas.height
     const tmpVal = val < 0 ? 0 : val > 1 ? 1: val
    drawTime(ctx, radius, tmpVal)

  }

  function handleDown(ev) {
    canvasRef.current.onpointermove = handleMove; 
    console.log('hanlldedown ', ev)
    canvasRef.current.setPointerCapture(ev.pointerId);
  }

  function handleMove(e) {
    draw(e)
  }
  
  function handleCancel(ev) {
    canvasRef.current.onpointermove = null; 
    console.log('handlerelease ', ev)
    canvasRef.current.releasePointerCapture(ev.pointerId);
  }

  function drawFace(ctx, radius) {
    var grad;
    ctx.beginPath();
    ctx.arc(80, 80, radius, 0, 2*Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(80,80,radius*0.95, 80,80,radius*1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#444');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius*0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(80, 80, radius*0.1, 0, 2*Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  }
  
  function drawNumbers(ctx, radius) {
    var ang;
    var num;
    ctx.font = radius*0.15 + "px arial";
    //ctx.textBaseline="middle";
    ctx.textAlign="center";
    for(num = 1; num < 13; num++){
      ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(80, -radius);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius);
      ctx.rotate(-ang);
    }
  }
  
  function drawTime(ctx, radius, val){
      drawHand(ctx, -val*Math.PI*2, radius*4, radius*0.05);
  }
  
  function drawHand(ctx, pos, length, width) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.moveTo(80,80);
      ctx.rotate(pos);
      ctx.lineTo(80, -length);
      ctx.stroke();
      ctx.rotate(-pos);
  }
}

export default Slider






