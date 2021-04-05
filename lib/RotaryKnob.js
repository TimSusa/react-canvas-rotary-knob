import React, { useEffect, useRef, useState } from "react";
import { debounce } from "debounce";
export default RotaryKnob;
function RotaryKnob({ isDisabled = false, width: tWidth = 160, value = 80, max = 127, min = 0, backgroundColor = "#ccc", color = "#37332ee0", caretColor = "#67332ee0", showValueLabel = true, debounceDelay = 5, lineWidth = 40, cbValChanged = (val) => val, }) {
    const caretWidth = tWidth / lineWidth;
    const width = tWidth - 4 * caretWidth;
    const height = tWidth - 4 * caretWidth;
    let canvasRef = useRef(null);
    let context = useRef(null);
    const [val, setVal] = useState(value);
    const isDragging = useRef(false);
    const verticalDiff = useRef(0);
    const lastOffset = useRef(0);
    let send = useRef(null);
    const isFloatNumberMode = useRef(false);
    useEffect(() => {
        if ((max - min) <= 1) {
            isFloatNumberMode.current = true;
        }
        send.current = debounce(sendValOut, debounceDelay);
        function sendValOut(val) {
            return cbValChanged(isFloatNumberMode.current ? val : Math.floor(val));
        }
        return () => {
            send.current = null;
        };
    }, [max, min, debounceDelay]);
    useEffect(() => {
        const canvas = canvasRef.current;
        let ctx = canvas.getContext("2d");
        context.current = ctx;
        canvas.focus();
        return () => {
            ctx.restore();
        };
    }, []);
    useEffect(() => {
        const ctx = context.current;
        lastOffset.current = valToY(val);
        ctx.lineWidth = caretWidth;
        ctx.lineCap = "round";
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = color;
        draw(valToY(val));
        return () => {
            ctx.restore();
        };
    }, [color, backgroundColor, width, height, caretWidth]);
    useEffect(() => {
        draw(valToY(value));
    }, [value]);
    return (React.createElement("div", null,
        React.createElement("canvas", { width: width, height: height, onPointerDown: isDisabled ? noop : handleDown, onPointerMove: isDisabled ? noop : handleMove, onPointerUp: isDisabled ? noop : handleCancel, ref: canvasRef }),
        showValueLabel && (React.createElement("div", null, val.toString().slice(0, 5)))));
    function yToVal(y) {
        const canvas = canvasRef.current;
        const tH = canvas.height;
        const val = y / tH;
        const ttH = 1;
        const tmpVal = val < 0 ? 0 : val > ttH ? ttH : val;
        const ttval = isNaN(tmpVal) ? value : tmpVal;
        return ttval;
    }
    function valToY(val) {
        const canvas = canvasRef.current;
        const tmpVal = canvas.height * val / max;
        return tmpVal;
    }
    function draw(vDiff) {
        const ctx = context.current;
        if (!ctx.canvas)
            return;
        const yVal = yToVal(vDiff);
        const yValTmp = yVal * max;
        setVal(yValTmp);
        send.current(yValTmp);
        clearCanvasRect(ctx);
        drawCaret(ctx, yVal);
    }
    function handleDown(ev) {
        const canvas = canvasRef.current;
        canvas.setPointerCapture(ev.pointerId);
        verticalDiff.current = ev.nativeEvent.offsetY;
        isDragging.current = true;
    }
    function handleMove(e) {
        if (isDragging.current === true) {
            const tV = -e.nativeEvent.offsetY + verticalDiff.current +
                lastOffset.current;
            draw(tV);
        }
    }
    function handleCancel(ev) {
        const canvas = canvasRef.current;
        canvas.releasePointerCapture(ev.pointerId);
        lastOffset.current = valToY(val);
        isDragging.current = false;
    }
    function clearCanvasRect(ctx) {
        // ctx.clearRect(
        //   -canvasRef.current.width / 2,
        //   -canvasRef.current.height / 2,
        //   width,
        //   height,
        // );
        ctx.restore();
    }
    function drawCaret(ctx, pos) {
        const canvas = canvasRef.current;
        const radius = canvas.height / 2;
        ctx.translate(radius, radius);
        const xOffSet = canvas.width / 2;
        ctx.lineWidth = caretWidth;
        ctx.beginPath();
        ctx.arc(0, 0, xOffSet - caretWidth, 0, Math.PI * 2, true);
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
function noop() { }
