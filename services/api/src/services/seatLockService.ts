import Redis from 'ioredis';

export interface SeatHoldInfo {
  showId: string;
  seatCode: string;
  userId: string;
  expiresAt: number; // Unix timestamp in ms
}

class SeatLockService {
  private redis: Redis | null = null;
  // Fallback in-memory map for fast locks when Redis is not running
  private localHolds: Map<string, SeatHoldInfo> = new Map();

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    try {
      this.redis = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
      });

      this.redis.connect().catch((err) => {
        console.warn('[SeatLockService] Redis not available, using in-memory high-speed lock store:', err.message);
        this.redis = null;
      });
    } catch {
      this.redis = null;
    }

    // Cleanup expired local holds every 5 seconds
    setInterval(() => this.purgeExpiredHolds(), 5000);
  }

  private getKey(showId: string, seatCode: string): string {
    return `seat_hold:${showId}:${seatCode}`;
  }

  private purgeExpiredHolds(): void {
    const now = Date.now();
    for (const [key, hold] of this.localHolds.entries()) {
      if (hold.expiresAt <= now) {
        this.localHolds.delete(key);
      }
    }
  }

  /**
   * Atomically holds a set of seats for a customer for 10 minutes (600 seconds).
   * All-or-nothing guarantee: if any seat is unavailable or already held by someone else,
   * the entire hold request is rejected.
   */
  async holdSeats(
    showId: string,
    seatCodes: string[],
    userId: string,
    alreadyBookedSeatCodes: Set<string>
  ): Promise<{ success: boolean; heldSeats?: string[]; failedSeats?: string[]; expiresAt?: number }> {
    this.purgeExpiredHolds();
    const now = Date.now();
    const ttlSeconds = 600; // 10 minutes per Phase 0.4 specification
    const expiresAt = now + ttlSeconds * 1000;

    // Check if any seat is already permanently booked or currently held by someone else
    const unavailableSeats: string[] = [];

    for (const code of seatCodes) {
      if (alreadyBookedSeatCodes.has(code)) {
        unavailableSeats.push(code);
        continue;
      }

      if (this.redis) {
        try {
          const holder = await this.redis.get(this.getKey(showId, code));
          if (holder && holder !== userId) {
            unavailableSeats.push(code);
          }
        } catch {
          // fallback to local store check
          const localHold = this.localHolds.get(this.getKey(showId, code));
          if (localHold && localHold.userId !== userId && localHold.expiresAt > now) {
            unavailableSeats.push(code);
          }
        }
      } else {
        const localHold = this.localHolds.get(this.getKey(showId, code));
        if (localHold && localHold.userId !== userId && localHold.expiresAt > now) {
          unavailableSeats.push(code);
        }
      }
    }

    if (unavailableSeats.length > 0) {
      return { success: false, failedSeats: unavailableSeats };
    }

    // All seats available: atomically acquire holds
    const acquired: string[] = [];
    for (const code of seatCodes) {
      const key = this.getKey(showId, code);
      if (this.redis) {
        try {
          await this.redis.set(key, userId, 'EX', ttlSeconds);
        } catch {
          // fallback
        }
      }
      this.localHolds.set(key, { showId, seatCode: code, userId, expiresAt });
      acquired.push(code);
    }

    return {
      success: true,
      heldSeats: acquired,
      expiresAt,
    };
  }

  /**
   * Release held seats (e.g. customer cancels hold or checkout completes)
   */
  async releaseSeats(showId: string, seatCodes: string[]): Promise<void> {
    for (const code of seatCodes) {
      const key = this.getKey(showId, code);
      if (this.redis) {
        try {
          await this.redis.del(key);
        } catch {
          // ignore
        }
      }
      this.localHolds.delete(key);
    }
  }

  /**
   * Get active holds for a show
   */
  getActiveHolds(showId: string): Map<string, SeatHoldInfo> {
    this.purgeExpiredHolds();
    const result = new Map<string, SeatHoldInfo>();
    const now = Date.now();
    for (const [key, hold] of this.localHolds.entries()) {
      if (hold.showId === showId && hold.expiresAt > now) {
        result.set(hold.seatCode, hold);
      }
    }
    return result;
  }
}

export const seatLockService = new SeatLockService();
