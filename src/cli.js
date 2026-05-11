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
  const normalizedFeather = Math.floor(feather);
  if (!inputPath || !outputPath) {
    throw new Error("Missing required parameters: --input and --output are required. Use --help for usage instructions.");
  }

  if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(width) || Number.isNaN(height) || Number.isNaN(feather)) {
    throw new Error("Invalid numeric parameters: --x, --y, --width, --height, and --feather must be valid numbers.");
  }

  if (width <= 0 || height <= 0 || normalizedFeather < 1) {
    throw new Error("Width and height must be greater than 0, and feather must be at least 1.");
  }

  await removeWatermark(
    path.resolve(process.cwd(), inputPath),
    path.resolve(process.cwd(), outputPath),
    { x, y, width, height },
    normalizedFeather
  );

  console.log(`Successfully processed: ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
