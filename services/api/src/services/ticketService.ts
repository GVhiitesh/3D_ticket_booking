import crypto from 'crypto';
import QRCode from 'qrcode';

const QR_SECRET = process.env.QR_HMAC_SECRET || 'cineva_secure_qr_signature_secret_2026';

export class TicketService {
  /**
   * Generates a tamper-evident opaque token:
   * Format: CINEVA:v1:<ticketId>:<expiresTimestamp>:<HMAC-SHA256-Signature>
   */
  generateQRToken(ticketId: string, showTimeIso: string): string {
    const expires = new Date(showTimeIso).getTime() + 4 * 60 * 60 * 1000; // valid until 4h after showtime
    const payload = `TKT:${ticketId}:${expires}`;
    const hmac = crypto.createHmac('sha256', QR_SECRET).update(payload).digest('hex').substring(0, 16);
    return `CINEVA:v1:${ticketId}:${expires}:${hmac}`;
  }

  /**
   * Generates a Base64 Data URL QR Code image from a ticket payload
   */
  async generateQRCodeDataUrl(qrPayload: string): Promise<string> {
    try {
      return await QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 320,
        color: {
          dark: '#050505',
          light: '#ffffff',
        },
      });
    } catch (err: any) {
      console.error('[TicketService] QR Code generation error:', err);
      return '';
    }
  }

  /**
   * Validates a scanned QR payload against the cryptographic secret and expiration
   */
  validateQRToken(qrPayload: string): { isValid: boolean; ticketId?: string; reason?: string } {
    const parts = qrPayload.split(':');
    if (parts.length !== 5 || parts[0] !== 'CINEVA' || parts[1] !== 'v1') {
      return { isValid: false, reason: 'INVALID_FORMAT' };
    }

    const [, , ticketId, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr, 10);

    if (Date.now() > expires) {
      return { isValid: false, reason: 'TICKET_EXPIRED' };
    }

    const expectedPayload = `TKT:${ticketId}:${expires}`;
    const expectedSig = crypto.createHmac('sha256', QR_SECRET).update(expectedPayload).digest('hex').substring(0, 16);

    if (signature !== expectedSig) {
      return { isValid: false, reason: 'SIGNATURE_MISMATCH' };
    }

    return { isValid: true, ticketId };
  }
}

export const ticketService = new TicketService();
