/**
 * Cloudflare R2 private storage — Stage 4C, CourseDocument only.
 *
 * R2 is fully S3-API-compatible, so this uses the standard AWS SDK v3
 * pointed at R2's endpoint. The bucket itself has no public access; every
 * read or write goes through a short-lived signed URL generated here.
 *
 * Deliberately does NOT throw or connect at import time. Unlike JWT_SECRET
 * (which fails the whole process fast because every request needs it),
 * R2 is optional infrastructure that may not be configured yet — the rest
 * of the site (public routes, auth, everything not touching a course
 * document) must keep working regardless. isR2Configured() is the single
 * gate every caller checks before attempting anything.
 */

import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const UPLOAD_URL_EXPIRY_SECONDS = 300; // ~5 minutes
const DOWNLOAD_URL_EXPIRY_SECONDS = 120; // ~2 minutes

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

// Conservative allowlist for course resources: PDF plus common office
// document formats. Extension AND declared MIME type must both match —
// neither is trusted alone.
export const ALLOWED_FILE_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

function getEnv() {
  return {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
  };
}

export function isR2Configured(): boolean {
  const { accountId, accessKeyId, secretAccessKey, bucketName } = getEnv();
  return Boolean(accountId && accessKeyId && secretAccessKey && bucketName);
}

let cachedClient: S3Client | null = null;

function getClient(): S3Client {
  const { accountId, accessKeyId, secretAccessKey } = getEnv();
  if (!accountId || !accessKeyId || !secretAccessKey) {
    // Callers must check isR2Configured() first — this is a programming
    // error, not a user-facing condition, so it's fine to throw here.
    throw new Error('R2 is not configured');
  }
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return cachedClient;
}

function getBucketName(): string {
  const { bucketName } = getEnv();
  if (!bucketName) throw new Error('R2 is not configured');
  return bucketName;
}

/**
 * Builds a safe, unguessable object key. The client never chooses this —
 * it's always server-generated from a random UUID plus a validated
 * extension, never the raw uploaded filename, so a key can't be guessed
 * from a document's title or a file's original name.
 */
export function generateObjectKey(courseId: string | null, extension: string): string {
  const scope = courseId || 'platform';
  return `course-documents/${scope}/${randomUUID()}${extension}`;
}

export async function getUploadUrl(key: string, contentType: string): Promise<string> {
  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn: UPLOAD_URL_EXPIRY_SECONDS });
}

export async function getDownloadUrl(key: string): Promise<string> {
  const client = getClient();
  const command = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn: DOWNLOAD_URL_EXPIRY_SECONDS });
}

/**
 * Confirms an object actually landed in the bucket before a document
 * record is treated as ready. Returns false on any error (missing object,
 * network issue, etc.) rather than throwing — callers decide how to
 * respond; this never leaks credentials or bucket internals to a caller.
 */
export async function objectExists(key: string): Promise<boolean> {
  try {
    const client = getClient();
    await client.send(new HeadObjectCommand({ Bucket: getBucketName(), Key: key }));
    return true;
  } catch {
    return false;
  }
}
