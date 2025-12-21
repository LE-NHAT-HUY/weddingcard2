// node process-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'raw-images'); // nơi chứa ảnh gốc
const outDir = path.join(__dirname, 'public', 'images', 'optimized'); // nơi xuất ảnh đã tối ưu

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// các kích thước sẽ resize
const sizes = [480, 768, 1024, 1280, 1920];
const quality = 70; // chỉnh 60-80 nếu muốn dung lượng nhỏ hơn

(async () => {
  const files = fs.readdirSync(inputDir).filter(f => /\.(jpe?g|png)$/i.test(f));

  for (const file of files) {
    const name = path.parse(file).name;
    const input = path.join(inputDir, file);

    // đọc metadata để debug orientation nếu cần
    const metadata = await sharp(input).metadata();
    console.log(`${file} - original orientation:`, metadata.orientation);

    for (const w of sizes) {
      const baseOut = path.join(outDir, `${name}-${w}`);

      // Xuất AVIF, xoay theo EXIF, loại bỏ metadata orientation
      await sharp(input)
        .rotate() // xoay tự động theo EXIF
        .resize({ width: w, withoutEnlargement: true })
        .withMetadata({ orientation: undefined }) // loại bỏ EXIF orientation
        .avif({ quality })
        .toFile(`${baseOut}.avif`);

      // Xuất WebP, tương tự
      await sharp(input)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .withMetadata({ orientation: undefined })
        .webp({ quality })
        .toFile(`${baseOut}.webp`);
    }

    // Tạo bản blur placeholder, xoay + loại bỏ orientation
    const blurBuf = await sharp(input)
      .rotate()
      .resize(20)
      .blur()
      .withMetadata({ orientation: undefined })
      .toBuffer();

    const blurBase64 = `data:image/jpeg;base64,${blurBuf.toString('base64')}`;
    fs.writeFileSync(path.join(outDir, `${name}-blur.txt`), blurBase64, 'utf8');

    console.log(`Processed ${file}`);
  }

  console.log('✅ All images processed successfully.');
})();
