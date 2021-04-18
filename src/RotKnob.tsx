import React, { ReactElement, ReactNode, useEffect, useRef } from "react";

type KnobTypes = {
  angleArc?: number;
  angleOffset?: number;
  bgColor?: string;
  canvasClassName?: string;
  className?: string;
  clockwise?: boolean;
  cursor?: ([number, boolean]);
  disableMouseWheel?: boolean;
  disableTextInput?: boolean;
  displayCustom?: Function;
  displayInput?: boolean;
  fgColor?: string;
  font?: string;
  fontWeight?: string;
  height?: number;
  inputColor?: string;
  lineCap?: ["butt", "round"];
  log?: boolean;
  max?: number;
  min?: number;
  onChange?: Function;
  onChangeEnd?: Function;
  readOnly?: boolean;
  step?: number;
  stopper?: boolean;
  thickness?: number;
  title?: string;
  value?: number;
  width?: number;
  children:
    | ReactNode
    | ((args: { onChange: Function; value: number }) => ReactNode);
};

function Knob(props: KnobTypes): ReactElement {
  const {
    onChange = () => {},
    onChangeEnd = () => {},
    min = 0,
    max = 100,
    step = 1,
    log = false,
    width = 200,
    height = 200,
    thickness = 0.35,
    lineCap,
    bgColor = "#EEE",
    fgColor = "#EA2",
    inputColor = "",
    font = "Arial",
    fontWeight = "bold",
    clockwise = true,
    cursor,
    stopper = true,
    readOnly = false,
    disableTextInput = false,
    displayInput = true,
    angleArc = 360,
    angleOffset = 0.0,
    disableMouseWheel = false,
    className = "",
    canvasClassName = "",
    children = null,
    title = "You n me",
    value = 33,
  } = props;
  const w = width || 200;
  const h = height || w;
  const cursorExt = cursor ? 0.3 : (1 / 100);
  const aA: number = angleArc * Math.PI / 180;
  const aO: number = angleOffset * Math.PI / 180;
  const sA: number = (1.5 * Math.PI) + aO;
  const eA = (1.5 * Math.PI) + aO + aA;
  const digits = Math.max(
    String(Math.abs(min)).length,
    String(Math.abs(max)).length,
    2,
  ) + 2;

  const canvasRef: any = useRef(null);
  const touchIndex = useRef(NaN);
  const xy = useRef(NaN);
  const lineWidth = useRef(NaN);
  const radius = useRef(NaN);


  useEffect(() => {
    drawCanvas();
  }, [xy]);
  // componentWillReceiveProps(nextProps: any) {
  //   if (nextProps.width && w !== nextProps.width) {
  //     w = nextProps.width;
  //   }
  //   if (nextProps.height && h !== nextProps.height) {
  //     h = nextProps.height;
  //   }
  // }

  // componentDidUpdate() {
  //   drawCanvas();
  // }

  // componentWillUnmount() {
  //   canvasRef.removeEventListener("touchstart", handleTouchStart);
  // }

  function getArcToValue(v: number) {
    let sA1: number;
    let eA1: number;
    const angle = !log
      ? ((v - min) * aA) /
        (max - min)
      : Math.log(Math.pow((v / min), aA)) /
        Math.log(max / min);
    if (!clockwise) {
      sA1 = eA + 0.00001;
      eA1 = sA - angle - 0.00001;
    } else {
      sA1 = sA - 0.00001;
      eA1 = sA + angle + 0.00001;
    }
    if (cursor) {
      sA1 = eA - cursorExt;
      eA1 += cursorExt;
    }
    return {
      sA: sA1,
      eA: eA1,
      acw: !clockwise && !cursor,
    };
  } // Calculate ratio to scale canvas to avoid blurriness on HiDPI devices

  function getCanvasScale(ctx: any) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1;
    return devicePixelRatio / backingStoreRatio;
  }

  function coerceToStep(v: any) {
    let val = !log
      ? (~~(((v < 0) ? -0.5 : 0.5) + (v / step))) * step
      : Math.pow(
        step,
        ~~(((Math.abs(v) < 1) ? -0.5 : 0.5) +
          (Math.log(v) / Math.log(step))),
      );
    val = Math.max(Math.min(val, max), min);
    if (isNaN(val)) val = 0;
    return Math.round(val * 1000) / 1000;
  }

  function eventToValue(e: any) {
    const bounds = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    let a = Math.atan2(x - (w / 2), (w / 2) - y) - aO;
    if (!clockwise) {
      a = aA - a - (2 * Math.PI);
    }
    if (aA !== Math.PI * 2 && (a < 0) && (a > -0.5)) {
      a = 0;
    } else if (a < 0) {
      a += Math.PI * 2;
    }
    const val = !log
      ? (a * (max - min) / aA) + min
      : Math.pow(max / min, a / aA) *
        min;
    return coerceToStep(val);
  }

  function handleMouseDown(e: any) {
    onChange(eventToValue(e));
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keyup", handleEsc);
  }

  function handleMouseMove(e: any) {
    e.preventDefault();
    onChange(eventToValue(e));
  }

  function handleMouseUp(e: any) {
    onChangeEnd(eventToValue(e));
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("keyup", handleEsc);
  }

  function handleTouchStart(e: any) {
    e.preventDefault();
    touchIndex.current = e.targetTouches.length - 1;
    onChange(eventToValue(e.targetTouches[touchIndex.current]));
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);
  }

  function handleTouchMove(e: any) {
    e.preventDefault();
    onChange(eventToValue(e.targetTouches[touchIndex.current]));
  }

  function handleTouchEnd(e: any) {
    onChangeEnd(eventToValue(e));
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchEnd);
  }

  function handleEsc(e: any) {
    if (e.keyCode === 27) {
      e.preventDefault();
      handleMouseUp(null);
    }
  }

  function renderCenter() {
    return (
      <input
        style={{
          width: `${((w / 2) + 4) >> 0}px`,
          height: `${(w / 3) >> 0}px`,
          position: "absolute",
          verticalAlign: "middle",
          marginTop: `${(w / 3) >> 0}px`,
          marginLeft: `-${((w * 3 / 4) + 2) >> 0}px`,
          border: 0,
          background: "none",
          font: `${fontWeight} ${(w / digits) >>
            0}px ${font}`,
          textAlign: "center",
          color: inputColor || fgColor,
          padding: "0px",
          WebkitAppearance: "none",
        }}
        type="text"
        value={value}
        onChange={handleTextInput}

        onKeyDown={handleArrowKey}
        readOnly={readOnly || disableTextInput}
      />
    );
  }

  return (
    <div
      className={className}
      style={{ width: w, height: h, display: "inline-block" }}
      onWheel={(readOnly || disableMouseWheel) ? () => {} : handleWheel}
    >
      <canvas
        ref={canvasRef}
        className={canvasClassName}
        style={{ width: "100%", height: "100%" }}
        onMouseDown={ handleMouseDown}
        onTouchStart={handleTouchStart}

        title={title ? `${title}: ${value}` : `value`}
      />
      {renderCenter()}
    </div>
  );


  function handleTextInput(e: any) {
    const val = Math.max(Math.min(+e.target.value, max), min) ||
      min;
    onChange(val);
  }

  function handleWheel(e: any) {
    e.preventDefault();
    if (e.deltaX > 0 || e.deltaY > 0) {
      onChange(coerceToStep(
        !log ? value + step : value * step,
      ));
    } else if (e.deltaX < 0 || e.deltaY < 0) {
      onChange(coerceToStep(
        !log ? value - step : value / step,
      ));
    }
  }

  function handleArrowKey(e: any) {
    if (e.keyCode === 37 || e.keyCode === 40) {
      e.preventDefault();
      onChange(coerceToStep(
        !log ? value - step : value / step,
      ));
    } else if (e.keyCode === 38 || e.keyCode === 39) {
      e.preventDefault();
      onChange(coerceToStep(
        !log ? value + step : value * step,
      ));
    }
  }

  function drawCanvas() {
    const ctx = canvasRef.current.getContext("2d");
    const scale = getCanvasScale(ctx);
    canvasRef.current.width = w * scale; // clears the canvas
    canvasRef.current.height = h * scale;
    ctx.scale(scale, scale);
    xy.current = w / 2; // coordinates of canvas center
    lineWidth.current = xy.current * thickness;
    radius.current = xy.current - (lineWidth.current / 2);
    ctx.lineWidth = lineWidth.current;
    ctx.lineCap = lineCap;
    // background arc
    ctx.beginPath();
    ctx.strokeStyle = bgColor;
    ctx.arc(
      xy.current,
      xy.current,
      radius.current,
      eA - 0.00001,
      sA + 0.00001,
      true,
    );
    ctx.stroke();
    // foreground arc
    const a = getArcToValue(value);
    ctx.beginPath();
    ctx.strokeStyle = fgColor;
    ctx.arc(
      xy,
      xy,
      radius.current,
      a.sA,
      a.eA,
      a.acw,
    );
    ctx.stroke();
  }

}

export default Knob;
