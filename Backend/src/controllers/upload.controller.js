import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import prisma from '../db/prisma.js';
import { presignedUrlSchema, uploadConfirmSchema } from '../utils/validation.js';
import { generateUploadUrl, checkObjectExists, deleteObject } from '../utils/s3.js';
import { uploadImage } from '../utils/cloudinary.js';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

// helpers
const sanitizeFileName = (name) => name.replace(/[^a-zA-Z0-9-_\.]/g, '_');

// authenticated
export const getPresignedUrl = async (req, res, next) => {
  try {
    const validated = presignedUrlSchema.parse(req.body);
    const { fileName, fileType, folder, fileSize } = validated;

    if (!ALLOWED_TYPES.includes(fileType)) {
      return res.status(400).json({ success: false, message: 'Unsupported file type' });
    }

    if (fileSize && fileSize > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit' });
    }

    const nameSanitized = sanitizeFileName(fileName);
    const key = `${folder}/${Date.now()}_${uuidv4()}_${nameSanitized}`;

    const uploadUrl = await generateUploadUrl({ key, contentType: fileType, expiresIn: 900, acl: folder === 'speaker-photos' || folder === 'sponsors' ? 'public-read' : 'private' });

    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({ success: true, uploadUrl, fileKey: key, publicUrl });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};

/**
 * Public upload for sponsorship logos (unauthenticated)
 * Uses Cloudinary for direct upload of base64/buffer
 */
export const uploadPublicLogo = async (req, res, next) => {
  try {
    const { file } = req.body; // Expect base64 string
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const result = await uploadImage(file, 'sponsors');
    res.status(200).json({ 
      success: true, 
      url: result.url,
      publicId: result.publicId 
    });
  } catch (error) {
    console.error('Public upload error:', error);
    next(error);
  }
};

// admin only
export const deleteFile = async (req, res, next) => {
  try {
    const key = req.params.key;
    if (!key) {
      return res.status(400).json({ success: false, message: 'File key required' });
    }

    await deleteObject(key);
    res.status(200).json({ success: true, message: 'File deleted' });
  } catch (error) {
    next(error);
  }
};

// authenticated
export const confirmUpload = async (req, res, next) => {
  try {
    const { fileKey, folder, relatedId } = uploadConfirmSchema.parse(req.body);

    const exists = await checkObjectExists(fileKey);
    if (!exists) {
      return res.status(400).json({ success: false, message: 'File not found on S3' });
    }

    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    // update appropriate record if possible
    switch (folder) {
      case 'speaker-photos': {
        const speaker = await prisma.speaker.findUnique({ where: { userId: req.user.id } });
        if (!speaker) {
          return res.status(404).json({ success: false, message: 'Speaker profile not found' });
        }
        await prisma.speaker.update({ where: { id: speaker.id }, data: { photoUrl: publicUrl, photoKey: fileKey } });
        break;
      }
      case 'sponsors': {
        if (req.user.role !== 'ADMIN') {
          return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        if (!relatedId) {
          return res.status(400).json({ success: false, message: 'sponsor id required' });
        }
        await prisma.sponsor.update({ where: { id: relatedId }, data: { logoUrl: publicUrl, logoKey: fileKey } });
        break;
      }
      case 'certificates': {
        if (req.user.role !== 'ADMIN') {
          return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        if (!relatedId) {
          return res.status(400).json({ success: false, message: 'certificate id required' });
        }
        await prisma.certificate.update({ where: { id: relatedId }, data: { fileUrl: publicUrl, fileKey: fileKey } });
        break;
      }
      default:
        break;
    }

    res.status(200).json({ success: true, publicUrl });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};
