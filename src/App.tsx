import {  useRef, useState } from "react";
import { SketchPicker } from "react-color";
import "./App.css";
import RotaryKnob from "./RotaryKnob";

function App() {
  const [width, setWidth] = useState(250);
  const [max, setMax] = useState(127);
  const [min, setMin] = useState(27);
  const [lineWidth, setlineWidth] = useState(10);
  const [lineColor, setLineColor] = useState("#4a4a4a");
  const [bgColor, setBgColor] = useState("#9b9b9b");
  const [caretColor, setCaretColor] = useState("#b8e986");
  const [caretWidth, setCaretWidth] = useState(35);
  const [isColorPickerShown, setIsColorPickerShown] = useState(false);
  const currentColorCb: any = useRef(() => []);
  return (
    <div className="App">
      <h2>Canvas Rotary Knob Configurator</h2>
      {isColorPickerShown &&
        (<SketchPicker onChangeComplete={currentColorCb.current}>
        </SketchPicker>)}
      <div className="flex-wrap">
        <div className="flex-left">
          <label>width:</label>
          <input
            name="size"
            type="range"
            min={30}
            max={600}
            onChange={onWidthChange}
          >
          </input>
          <label>max:</label>
          <input
            name="max"
            type="input"
            value={max}
            min={30}
            max={600}
            onChange={onMaxChange}
          >
          </input>

          <label>min:</label>
          <input
            name="min"
            type="input"
            value={min}
            min={30}
            max={600}
            onChange={onMinChange}
          >
          </input>

          <label>line width:</label>
          <input
            name="line-width"
            type="range"
            value={lineWidth}
            min={1}
            max={25}
            onChange={onLineWidthChange}
          >
          </input>
          <label>caret width:</label>
          <input
            name="caret-width"
            type="range"
            value={caretWidth}
            min={15}
            max={100}
            onChange={onCaretWidthChange}
          >
          </input>

          <label>Line Color:</label>

          <input
            name="line-color"
            type="text"
            value={lineColor}
            onChange={() => {}}
            onClick={() => {
              currentColorCb.current = onLineColorChange;
              setIsColorPickerShown(true);
            }}
          >
          </input>

          <label>background Color:</label>

          <input
            name="b-color"
            type="text"
            value={bgColor}
            onChange={() => {}}
            onClick={() => {
              currentColorCb.current = onBgColorChange;
              setIsColorPickerShown(true);
            }}
          >
          </input>

          <label>caret Color:</label>
          <input
            name="c-color"
            type="text"
            value={caretColor}
            onChange={() => {}}
            onClick={() => {
              currentColorCb.current = onCaretColorChange;
              setIsColorPickerShown(true);
            }}
          >
          </input>
        </div>

        <div className="flex-right">
          <RotaryKnob
            width={width}
            max={max}
            min={min}
            lineWidth={lineWidth}
            color={lineColor}
            backgroundColor={bgColor}
            caretColor={caretColor}
            caretWidth={caretWidth}
          >
            {}
          </RotaryKnob>
        </div>
      </div>
    </div>
  );
  function onWidthChange(e: any) {
    setWidth(e.target.value);
  }
  function onMaxChange(e: any) {
    setMax(e.target.value);
  }
  function onMinChange(e: any) {
    setMin(e.target.value);
  }
  function onLineWidthChange(e: any) {
    setlineWidth(e.target.value);
  }
  function onCaretWidthChange(e: any) {
    setCaretWidth(e.target.value);
  }

  function onLineColorChange(e: any) {
    e.target && setLineColor(e.target.value);
    e.hex && setLineColor(e.hex);
    setIsColorPickerShown(false);
  }

  function onBgColorChange(e: any) {
    e.target && setBgColor(e.target.value);
    e.hex && setBgColor(e.hex);
    setIsColorPickerShown(false);
  }
  function onCaretColorChange(e: any) {
    e.target && setCaretColor(e.target.value);
    e.hex && setCaretColor(e.hex);
    setIsColorPickerShown(false);
  }
}

export default App;
