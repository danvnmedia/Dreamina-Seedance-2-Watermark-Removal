#!/usr/bin/env node
const path = require("path");
const { removeWatermark } = require("./removeWatermark");

function getArg(flag, fallback = undefined) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return fallback;
  }
  return process.argv[index + 1];
}

function showUsage() {
  console.log(`
Usage:
  node src/cli.js --input <inputFile> --output <outputFile> --x <number> --y <number> --width <number> --height <number> [--feather <number>]

Example:
  node src/cli.js --input ./input.png --output ./output.png --x 980 --y 700 --width 240 --height 100 --feather 8
`);
}

function isInvalidNumber(value) {
  return Number.isNaN(value);
}

async function main() {
  if (process.argv.includes("--help") || process.argv.length <= 2) {
    showUsage();
    return;
  }

  const inputPath = getArg("--input");
  const outputPath = getArg("--output");
  const x = Number(getArg("--x"));
  const y = Number(getArg("--y"));
  const width = Number(getArg("--width"));
  const height = Number(getArg("--height"));
  const feather = Number(getArg("--feather", "6"));
  const hasMissingRequiredParam = !inputPath || !outputPath;
  const hasInvalidNumericParam =
    isInvalidNumber(x) ||
    isInvalidNumber(y) ||
    isInvalidNumber(width) ||
    isInvalidNumber(height);

  if (hasMissingRequiredParam || hasInvalidNumericParam) {
    throw new Error("Missing required parameters or invalid parameters. Use --help for usage instructions.");
  }

  if (width <= 0 || height <= 0 || feather < 1) {
    throw new Error("Width and height must be greater than 0, and feather must be at least 1.");
  }

  await removeWatermark(
    path.resolve(process.cwd(), inputPath),
    path.resolve(process.cwd(), outputPath),
    { x, y, width, height },
    Math.floor(feather)
  );

  console.log(`Successfully processed: ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
