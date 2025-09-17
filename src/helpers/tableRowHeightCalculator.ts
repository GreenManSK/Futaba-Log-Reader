import { ILogEntry } from '../data/ILogEntry';

const lineHeight = 1.3;
const fontSize = 15;
const callIdFontSize = 12;
const messagePadding = 5;

export const calculateEntryHeight = (
    entry: ILogEntry,
    classWidth: number,
    messageWidth: number
) => {
    const font = getBodyFont();
    const normalSize = getFontSize(font, fontSize);
    const callIdSize = getFontSize(font, callIdFontSize);

    const classHeight =
        estimateRowHeight(
            entry.loggingClass,
            normalSize,
            classWidth,
            lineHeight
        ) + messagePadding;
    const idHeight = entry.callId
        ? estimateRowHeight(
              entry.loggingClass,
              callIdSize,
              classWidth,
              lineHeight
          )
        : 0;
    const messageHeight =
        estimateRowHeight(entry.message, normalSize, messageWidth, lineHeight) +
        messagePadding;

    return Math.max(classHeight + idHeight, messageHeight);
};

let cachedFontFamily: string | undefined = undefined;
const getBodyFont = () => {
    if (cachedFontFamily) {
        return cachedFontFamily;
    }
    const style = window.getComputedStyle(document.body);
    cachedFontFamily = style.fontFamily || 'sans-serif';
    return cachedFontFamily;
};

type FontSize = { width: number; height: number };
let fontCanvas: HTMLCanvasElement | undefined = undefined;
const fontSizeCache: Record<string, FontSize> = {};
const getFontSize = (font: string, size: number): FontSize => {
    const cacheKey = `${font}-${size}`;
    if (fontSizeCache[cacheKey] !== undefined) {
        return fontSizeCache[cacheKey];
    }
    const canvas =
        fontCanvas || (fontCanvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    if (!context) return { width: 0, height: 0 };
    context.font = `${size}px ${font}`;
    fontSizeCache[cacheKey] = {
        width: context.measureText('A').width,
        height: size,
    };
    return fontSizeCache[cacheKey];
};

const estimateRowHeight = (
    text: string,
    fontSize: FontSize,
    cellWidth: number,
    lineHeight: number
) => {
    const textWidth = text.length * fontSize.width;
    let lines = Math.max(1, Math.ceil(textWidth / cellWidth));
    if (lines >= 2) {
        // Safety for forced breaking
        lines += 1;
    }

    return lines * lineHeight * fontSize.height;
};
