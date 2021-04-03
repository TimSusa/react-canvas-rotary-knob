import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
export default RotaryKnob;
function RotaryKnob({ width = 160, height = 160, value = 80, max = 127, backgroundColor = "#ccc", color = "#37332ee0", }) {
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
        const ctx = context.current;
        var radius = canvas.height / 2;
        lastOffset.current = valToY(val);
        ctx.translate(radius, radius);
        drawGrad(ctx);
        draw(valToY(val));
    }, []);
    return (_jsxs("div", { children: [_jsx("canvas", { width: width, height: height, onPointerDown: handleDown, onPointerMove: handleMove, onPointerUp: handleCancel, ref: canvasRef }, void 0),
            _jsx("div", { children: val.toString().slice(0, 5) }, void 0)] }, void 0));
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
    function drawGrad(ctx) {
        ctx.beginPath();
        const tmpGrad = ctx.createLinearGradient(0, 0, 0, 170);
        tmpGrad.addColorStop(0, backgroundColor);
        tmpGrad.addColorStop(1, color);
        ctx.fillStyle = tmpGrad;
        ctx.fillRect(20, 20, 150, 100);
        ctx.fill();
        ctx.closePath();
    }
    function draw(vDiff) {
        const ctx = context.current;
        if (!ctx.canvas)
            return;
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
    function drawCaret(ctx, pos) {
        ctx.clearRect(-canvasRef.current.width / 2, -canvasRef.current.height / 2, width, height);
        ctx.lineWidth = caretWidth;
        ctx.beginPath();
        ctx.arc(0, 0, canvasRef.current.width / 2 - 2 * caretWidth, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = caretWidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(-pos);
        ctx.lineTo(0, -canvasRef.current.width / 2 + 2 * caretWidth);
        ctx.stroke();
        ctx.rotate(pos);
        // ctx.font = "30px Arial";
        //ctx.strokeText(val, -2*caretWidth, caretWidth);
    }
}
