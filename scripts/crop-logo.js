import fs from 'fs';
import zlib from 'zlib';

function processPNG() {
  const origPath = 'C:/Users/Devansh Srivastava/.gemini/antigravity-ide/brain/2a507710-c8d3-40b2-a373-0bb193341c63/.user_uploaded/media_1786943878586.png';
  const buf = fs.readFileSync(origPath);
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
      colorType = buf.readUInt8(offset + 17);
    } else if (type === 'IDAT') {
      idatChunks.push(buf.slice(offset + 8, offset + 8 + length));
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }

  const rawData = zlib.inflateSync(Buffer.concat(idatChunks));
  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const scanlineLength = 1 + width * bytesPerPixel;
  const image = Buffer.alloc(width * height * 4);
  let prevScanline = Buffer.alloc(width * bytesPerPixel);

  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  for (let y = 0; y < height; y++) {
    const scanlineStart = y * scanlineLength;
    const filterType = rawData[scanlineStart];
    const currentScanline = Buffer.alloc(width * bytesPerPixel);

    for (let x = 0; x < width * bytesPerPixel; x++) {
      const rawByte = rawData[scanlineStart + 1 + x];
      const a = x >= bytesPerPixel ? currentScanline[x - bytesPerPixel] : 0;
      const b = prevScanline[x];
      const c = x >= bytesPerPixel ? prevScanline[x - bytesPerPixel] : 0;

      let val = 0;
      if (filterType === 0) val = rawByte;
      else if (filterType === 1) val = (rawByte + a) & 0xff;
      else if (filterType === 2) val = (rawByte + b) & 0xff;
      else if (filterType === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
      else if (filterType === 4) val = (rawByte + paeth(a, b, c)) & 0xff;
      currentScanline[x] = val;
    }
    prevScanline = currentScanline;

    for (let x = 0; x < width; x++) {
      const imgIdx = (y * width + x) * 4;
      const scanIdx = x * bytesPerPixel;
      image[imgIdx] = currentScanline[scanIdx];
      image[imgIdx + 1] = currentScanline[scanIdx + 1];
      image[imgIdx + 2] = currentScanline[scanIdx + 2];
      image[imgIdx + 3] = colorType === 6 ? currentScanline[scanIdx + 3] : 255;
    }
  }

  // Exact coordinates of the logo
  const minX = 224;
  const maxX = 798;
  const minY = 368;
  const maxY = 656;
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  console.log(`Cropping logo to: ${cropW} x ${cropH}`);

  function createPNG(cropImg, w, h) {
    const scanlineLen = 1 + w * 4;
    const rawOut = Buffer.alloc(h * scanlineLen);
    for (let y = 0; y < h; y++) {
      rawOut[y * scanlineLen] = 0;
      for (let x = 0; x < w; x++) {
        const srcIdx = (y * w + x) * 4;
        const dstIdx = y * scanlineLen + 1 + x * 4;
        rawOut[dstIdx] = cropImg[srcIdx];
        rawOut[dstIdx + 1] = cropImg[srcIdx + 1];
        rawOut[dstIdx + 2] = cropImg[srcIdx + 2];
        rawOut[dstIdx + 3] = cropImg[srcIdx + 3];
      }
    }
    const compressed = zlib.deflateSync(rawOut);
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;
    return Buffer.concat([
      sig,
      makeChunk('IHDR', ihdr),
      makeChunk('IDAT', compressed),
      makeChunk('IEND', Buffer.alloc(0))
    ]);
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const typeAndData = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  // 1. Crisp Teal version (rich brand teal #007D8C)
  const tealImg = Buffer.alloc(cropW * cropH * 4);
  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const srcIdx = ((minY + y) * width + (minX + x)) * 4;
      const dstIdx = (y * cropW + x) * 4;
      const r = image[srcIdx];
      const g = image[srcIdx + 1];
      const b = image[srcIdx + 2];
      const brightness = (r + g + b) / 3;

      if (brightness >= 244) {
        tealImg[dstIdx + 3] = 0;
      } else {
        const darkness = 255 - brightness;
        const alpha = Math.min(255, Math.round(darkness * 2.2));
        tealImg[dstIdx] = Math.round(r * 0.9);
        tealImg[dstIdx + 1] = Math.round(g * 0.95);
        tealImg[dstIdx + 2] = Math.round(b * 0.95);
        tealImg[dstIdx + 3] = alpha;
      }
    }
  }

  // 2. Pure White version (crisp pure white text + luminous emerald leaf #2AE8BF)
  const whiteImg = Buffer.alloc(cropW * cropH * 4);
  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const srcIdx = ((minY + y) * width + (minX + x)) * 4;
      const dstIdx = (y * cropW + x) * 4;
      const r = image[srcIdx];
      const g = image[srcIdx + 1];
      const b = image[srcIdx + 2];
      const brightness = (r + g + b) / 3;

      if (brightness >= 244) {
        whiteImg[dstIdx + 3] = 0;
      } else {
        const darkness = 255 - brightness;
        const alpha = Math.min(255, Math.round(darkness * 2.2));
        const isLeaf = (x > cropW * 0.70 && y < cropH * 0.45);
        if (isLeaf) {
          // Vibrant bright emerald green for the leaf in white mode
          whiteImg[dstIdx] = 0x2A;
          whiteImg[dstIdx + 1] = 0xE8;
          whiteImg[dstIdx + 2] = 0xBF;
        } else {
          // Pure crisp white for text
          whiteImg[dstIdx] = 255;
          whiteImg[dstIdx + 1] = 255;
          whiteImg[dstIdx + 2] = 255;
        }
        whiteImg[dstIdx + 3] = alpha;
      }
    }
  }

  fs.writeFileSync('public/ng-logo.png', createPNG(tealImg, cropW, cropH));
  fs.writeFileSync('public/ng-logo-teal.png', createPNG(tealImg, cropW, cropH));
  fs.writeFileSync('public/ng-logo-white.png', createPNG(whiteImg, cropW, cropH));

  console.log(`Successfully generated cropped transparent logos: ${cropW} x ${cropH}!`);
}

processPNG();
