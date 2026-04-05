/**
 * Company Auto-Fill Background Queue
 *
 * Simple in-memory queue that processes company auto-fill tasks asynchronously.
 * Uses setTimeout to avoid blocking the HTTP response.
 */

import { autoFillCompanyInfo } from './companyFillService';
import { companyStore } from '../models/Company';

interface QueueItem {
  companyId: string;
  name: string;
  industry?: string;
  attempt: number;
}

const MAX_ATTEMPTS = 3;
const DELAY_MS = 2_000;

const queue: QueueItem[] = [];
let isProcessing = false;

/**
 * Add a company to the auto-fill queue.
 * Processing starts automatically if not already running.
 */
export function enqueueCompanyFill(item: QueueItem): void {
  queue.push(item);
  void processQueue();
}

async function processQueue(): Promise<void> {
  if (isProcessing) return;
  isProcessing = true;

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;

    console.info(`[companyFillQueue] Processing: ${item.name} (attempt ${item.attempt})`);

    const blocks = await autoFillCompanyInfo(item.name, item.industry);

    if (blocks) {
      try {
        await companyStore.updateSummary(item.companyId, blocks);
        console.info(`[companyFillQueue] ✅ Filled summary for: ${item.name}`);
      } catch (error) {
        console.error(`[companyFillQueue] Failed to update DB for: ${item.name}`, error);
      }
    } else if (item.attempt < MAX_ATTEMPTS) {
      console.warn(`[companyFillQueue] Retrying ${item.name} (attempt ${item.attempt + 1})`);
      queue.push({ ...item, attempt: item.attempt + 1 });
      await sleep(DELAY_MS);
    } else {
      console.info(`[companyFillQueue] ⏭ Skipping (no result): ${item.name}`);
    }

    // Small delay between companies to be polite
    await sleep(1_000);
  }

  isProcessing = false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
