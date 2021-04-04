import React, { useEffect, useRef, useState } from "react";
import { debounce } from "debounce";
export default RotaryKnob;
function RotaryKnob({ isDisabled = false, width: tWidth = 160, height: tHeight = 160, value = 80, max = 127, min = 0, backgroundColor = "#ccc", color = "#37332ee0", showValueLabel = true, debounceDelay = 5, lineWidth = 40, cbValChanged = (val) => val, }) {
    const caretWidth = tWidth / lineWidth;
    const width = tWidth - 4 * caretWidth;
    const height = tWidth - 4 * caretWidth;
    const canvasRef = useRef(null);
    const context = useRef(null);
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
    }, [max, min, debounceDelay, caretWidth]);
    useEffect(() => {
        const canvas = canvasRef.current;
        context.current = canvas.getContext("2d");
        const ctx = context.current;
        var radius = canvas.height / 2;
        lastOffset.current = valToY(val);
        ctx.lineWidth = caretWidth;
        ctx.lineCap = "round";
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = color;
        ctx.translate(radius, radius);
        draw(valToY(val));
        return () => {
            ctx.restore();
        };
    }, [color, backgroundColor, width, height]);
    return (React.createElement("div", null,
        React.createElement("canvas", { width: width, height: height, onPointerDown: isDisabled ? noop : handleDown, onPointerMove: isDisabled ? noop : handleMove, onPointerUp: isDisabled ? noop : handleCancel, ref: canvasRef }),
        showValueLabel && (React.createElement("div", null, val.toString().slice(0, 5)))));
    function yToVal(y) {
        const tH = canvasRef.current.height;
        const val = y / tH;
        const ttH = 1;
        const tmpVal = val < 0 ? 0 : val > ttH ? ttH : val;
        const ttval = isNaN(tmpVal) ? value : tmpVal;
        return ttval;
    }
    function valToY(val) {
        const tmpVal = canvasRef.current.height * val / max;
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
        drawCaret(ctx, -yVal * Math.PI * 2);
    }
    function handleDown(ev) {
        canvasRef.current.setPointerCapture(ev.pointerId);
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
        canvasRef.current.releasePointerCapture(ev.pointerId);
        lastOffset.current = valToY(val);
        isDragging.current = false;
    }
    function clearCanvasRect(ctx) {
        ctx.clearRect(-canvasRef.current.width / 2, -canvasRef.current.height / 2, width, height);
        //ctx.closePath()
        ctx.restore();
    }
    function drawCaret(ctx, pos) {
        const xOffSet = canvasRef.current.width / 2;
        ctx.lineWidth = caretWidth;
        ctx.beginPath();
        ctx.arc(0, 0, xOffSet - caretWidth, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.moveTo(0, 0);
        ctx.rotate(-pos);
        ctx.lineTo(0, -xOffSet + 2 * caretWidth);
        ctx.stroke();
        ctx.rotate(pos);
        ctx.closePath();
        // ctx.restore();
        //ctx.fill()
        // ctx.font = "30px Arial";
        //ctx.strokeText(val, -2*caretWidth, caretWidth);
    }
}
function noop() { }
