import CryptoJS from "crypto-js";

const EXPORT_PREFIX = "CFR1:";

/**
 * AES-encrypt ledger data for secure export.
 * @param {Object} data - Serializable ledger payload
 * @param {string} passphrase - Encryption passphrase
 * @returns {string} Encrypted string with version prefix
 */
export function encryptExport(data, passphrase) {
  if (!passphrase) {
    throw new Error("Passphrase is required for export encryption");
  }

  const json = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(json, passphrase).toString();
  return `${EXPORT_PREFIX}${encrypted}`;
}

/**
 * Decrypt and parse an encrypted export string.
 * @param {string} encryptedStr
 * @param {string} passphrase
 * @returns {Object} Parsed ledger data
 */
export function decryptExport(encryptedStr, passphrase) {
  if (!passphrase) {
    throw new Error("Passphrase is required for import decryption");
  }

  const payload = encryptedStr.startsWith(EXPORT_PREFIX)
    ? encryptedStr.slice(EXPORT_PREFIX.length)
    : encryptedStr;

  const bytes = CryptoJS.AES.decrypt(payload, passphrase);
  const json = bytes.toString(CryptoJS.enc.Utf8);

  if (!json) {
    throw new Error("Decryption failed — invalid passphrase or corrupted file");
  }

  return JSON.parse(json);
}

/**
 * Trigger a browser download of encrypted export data.
 */
export function downloadEncryptedExport(data, passphrase, filename = "cashflow-runway-export.cfr") {
  const encrypted = encryptExport(data, passphrase);
  const blob = new Blob([encrypted], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default { encryptExport, decryptExport, downloadEncryptedExport };
