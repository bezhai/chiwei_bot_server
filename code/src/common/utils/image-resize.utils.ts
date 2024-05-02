import * as sharp from 'sharp';

export async function resizeImage(
  fileBuffer: Buffer,
): Promise<{ outFile: Buffer; imgWidth: number; imgHeight: number }> {
  try {
    const img = sharp(fileBuffer);
    const metadata = await img.metadata();

    if (
      !metadata ||
      metadata.width === undefined ||
      metadata.height === undefined
    ) {
      throw new Error('Error getting image metadata');
    }

    let newImg: sharp.Sharp;
    const targetSize = 4 * 1024 * 1024; // 4MB

    if (fileBuffer.length >= 9 * 1024 * 1024) {
      const rate = Math.sqrt(targetSize / fileBuffer.length);
      const newWidth = Math.floor(metadata.width * rate);
      newImg = img.resize(newWidth);
    } else {
      newImg = img;
    }

    const outputBuffer = await newImg.toBuffer();
    const outputMetadata = await sharp(outputBuffer).metadata();

    return {
      outFile: outputBuffer,
      imgWidth: outputMetadata.width || 0,
      imgHeight: outputMetadata.height || 0,
    };
  } catch (err) {
    throw new Error(`Error resizing image: ${(err as Error).message}`);
  }
}
