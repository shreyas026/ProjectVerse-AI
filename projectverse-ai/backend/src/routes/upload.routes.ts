import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.post('/image', authenticate, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file uploaded' } });
    return;
  }
  // Upload to Cloudinary
  // const result = await cloudinary.uploader.upload(req.file.buffer.toString('base64'), { folder: 'projectverse' });
  res.json({ success: true, data: { url: 'https://placeholder.image.url', publicId: 'placeholder' } });
}));

export default router;
