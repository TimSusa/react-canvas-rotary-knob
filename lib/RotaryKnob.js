import React, { useEffect, useRef, useState } from "react";
import { debounce } from "debounce";
export default RotaryKnob;
function RotaryKnob({ isDisabled = false, width: tWidth = 160, value = 80, max = 127, min = 0, backgroundColor = "#9b9b9b", color = "#37332ee0", caretColor = "#67332ee0", showValueLabel = true, debounceDelay = 5, lineWidth = 40, caretWidth: tCaretWidth = 160 / 40, cbValChanged = (val) => val, }) {
    const caretWidth = tCaretWidth
        ? (tWidth / tCaretWidth)
        : (tWidth / lineWidth);
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
        // set up context
        const canvas = canvasRef.current;
        let ctx = canvas.getContext("2d");
        context.current = ctx;
        canvas.focus();
        // set up callback
        send.current = debounce(sendValOut, debounceDelay);
        function sendValOut(val) {
            return cbValChanged(isFloatNumberMode.current ? val : Math.floor(val));
        }
        return () => {
            send.current = null;
            ctx.restore();
        };
    }, [max, min, debounceDelay, cbValChanged]);
    // initial draw
    useEffect(() => {
        lastOffset.current = valToY(val);
        if (context.current) {
            context.current.lineWidth = lineWidth;
            context.current.lineCap = "round";
            context.current.fillStyle = backgroundColor;
            context.current.strokeStyle = color;
        }
        draw(lastOffset.current);
        return () => {
            context.current && context.current.restore();
        };
    }, [color, backgroundColor, caretColor, width, height, caretWidth, lineWidth]);
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
        const tmpVal = canvas.height * (val - min) / (max - min);
        return tmpVal;
    }
    function draw(vDiff) {
        const ctx = context.current;
        if (!ctx.canvas)
            return;
        const yVal = yToVal(vDiff);
        const yValTmp = (1 - yVal) * min + yVal * max;
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
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(0, 0, xOffSet - lineWidth, 0, Math.PI * 2, true);
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
