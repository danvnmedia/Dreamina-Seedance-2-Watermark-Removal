const sharp = require("sharp");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function parseRegion(region, width, height) {
  const x = clamp(Math.floor(Number(region.x)), 0, width - 1);
  const y = clamp(Math.floor(Number(region.y)), 0, height - 1);
  const w = clamp(Math.floor(Number(region.width)), 1, width - x);
  const h = clamp(Math.floor(Number(region.height)), 1, height - y);
  return { x, y, width: w, height: h };
}

function getIndex(x, y, channels, width) {
  return (y * width + x) * channels;
}

/**
 * Computes average RGBA values from neighboring pixels outside the watermark region.
 * @param {Uint8ClampedArray} source Raw source pixel buffer.
 * @param {number} width Image width.
 * @param {number} height Image height.
 * @param {number} channels Number of channels (after ensureAlpha, typically 4).
 * @param {number} tx Target x coordinate to fill.
 * @param {number} ty Target y coordinate to fill.
 * @param {{x:number,y:number,width:number,height:number}} region Watermark region bounds.
 * @param {number} feather Sampling radius around the target pixel.
 * @returns {[number, number, number, number]} Averaged [r, g, b, a].
 */
function sampleNeighborAverage(source, width, height, channels, tx, ty, region, feather) {
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let sumA = 0;
  let count = 0;

  for (let dy = -feather; dy <= feather; dy += 1) {
    for (let dx = -feather; dx <= feather; dx += 1) {
      const nx = tx + dx;
      const ny = ty + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
        continue;
      }

      const insideWatermark =
        nx >= region.x &&
        nx < region.x + region.width &&
        ny >= region.y &&
        ny < region.y + region.height;

      if (insideWatermark) {
        continue;
      }

      const idx = getIndex(nx, ny, channels, width);
      sumR += source[idx];
      sumG += source[idx + 1];
      sumB += source[idx + 2];
      sumA += channels > 3 ? source[idx + 3] : 255;
      count += 1;
    }
  }

  if (count === 0) {
    return [0, 0, 0, 255];
  }

  return [
    Math.round(sumR / count),
    Math.round(sumG / count),
    Math.round(sumB / count),
    Math.round(sumA / count)
  ];
}

/**
 * Removes watermark area by filling target region with averaged neighbor pixels.
 * @param {string} inputPath Path to input image.
 * @param {string} outputPath Path where output image is saved.
 * @param {{x:number,y:number,width:number,height:number}} region Watermark rectangle.
 * @param {number} [feather=6] Sampling radius used for interpolation.
 * @returns {Promise<void>} Resolves when output file is written.
 */
async function removeWatermark(inputPath, outputPath, region, feather = 6) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;
  const safeRegion = parseRegion(region, width, height);
  const maxY = safeRegion.y + safeRegion.height;
  const maxX = safeRegion.x + safeRegion.width;
  const source = new Uint8ClampedArray(data);
  const output = new Uint8ClampedArray(data);

  for (let y = safeRegion.y; y < maxY; y += 1) {
    for (let x = safeRegion.x; x < maxX; x += 1) {
      const [r, g, b, a] = sampleNeighborAverage(
        source,
        width,
        height,
        channels,
        x,
        y,
        safeRegion,
        feather
      );
      const idx = getIndex(x, y, channels, width);
      output[idx] = r;
      output[idx + 1] = g;
      output[idx + 2] = b;
      if (channels > 3) {
        output[idx + 3] = a;
      }
    }
  }

  await sharp(Buffer.from(output), {
    raw: { width, height, channels }
  }).toFile(outputPath);
}

module.exports = {
  removeWatermark
};
