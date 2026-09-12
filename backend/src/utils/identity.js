const crypto = require("crypto");

const AADHAAR_PATTERN = /^\d{12}$/;

const getEncryptionKey = () => {
  const encodedKey = process.env.IDENTITY_ENCRYPTION_KEY;
  if (!encodedKey) {
    const error = new Error("Identity storage is unavailable. Configure IDENTITY_ENCRYPTION_KEY.");
    error.statusCode = 503;
    throw error;
  }

  const key = Buffer.from(encodedKey, "base64");
  if (key.length !== 32) {
    const error = new Error("IDENTITY_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
    error.statusCode = 503;
    throw error;
  }
  return key;
};

const normalizeAadhaar = (value) => String(value || "").replace(/\s|-/g, "");

const validateAadhaar = (value) => AADHAAR_PATTERN.test(normalizeAadhaar(value));

const encryptAadhaar = (value) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(normalizeAadhaar(value), "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(".");
};

const getAadhaarFingerprint = (value) =>
  crypto
    .createHmac("sha256", getEncryptionKey())
    .update(normalizeAadhaar(value))
    .digest("hex");

const getAadhaarLast4 = (value) => normalizeAadhaar(value).slice(-4);

module.exports = {
  encryptAadhaar,
  getAadhaarFingerprint,
  getAadhaarLast4,
  normalizeAadhaar,
  validateAadhaar,
};
