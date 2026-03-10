import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// AWS SDK client is already installed in package.json
// configure via environment variables: AWS_REGION, AWS_BUCKET_NAME, optionally AWS_BUCKET_ARN

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;

if (!bucketName || !region) {
  console.warn('S3 bucket configuration is incomplete (AWS_BUCKET_NAME or AWS_REGION missing)');
}

const s3Client = new S3Client({ region });

export const generateUploadUrl = async ({ key, contentType, expiresIn = 900, acl = 'private' }) => {
  if (!bucketName) throw new Error('Bucket name not configured');

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    ACL: acl,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
};

export const checkObjectExists = async (key) => {
  if (!bucketName) throw new Error('Bucket name not configured');

  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
    return true;
  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw err;
  }
};

export const deleteObject = async (key) => {
  if (!bucketName) throw new Error('Bucket name not configured');
  await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
};

export const uploadBuffer = async ({ key, buffer, contentType = 'application/pdf', acl = 'private' }) => {
  if (!bucketName) throw new Error('Bucket name not configured');
  const command = new PutObjectCommand({ Bucket: bucketName, Key: key, Body: buffer, ContentType: contentType, ACL: acl });
  await s3Client.send(command);
  return true;
};

export const generateSignedGetUrl = async (key, expiresIn = 900) => {
  if (!bucketName) throw new Error('Bucket name not configured');
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
};

export { s3Client };
