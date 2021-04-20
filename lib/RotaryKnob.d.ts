/// <reference types="react" />
export default RotaryKnob;
declare type tRotaryKnob = {
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
    caretWidth?: number | undefined;
    cbValChanged?: ((val: number) => number) | undefined;
    children?: never[];
};
declare function RotaryKnob({ isDisabled, width: tWidth, value, max, min, backgroundColor, color, caretColor, showValueLabel, debounceDelay, lineWidth, caretWidth: tCaretWidth, cbValChanged, }: tRotaryKnob): JSX.Element;
