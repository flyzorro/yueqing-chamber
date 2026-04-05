/**
 * Company Auto-Fill Service
 *
 * Searches for company websites via DuckDuckGo HTML and scrapes content
 * to generate Block[] JSON for Company.summary.
 */

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'video'; url: string; poster?: string }
  | { type: 'gallery'; images: { url: string; caption?: string }[] }
  | { type: 'divider' };

// ---------------------------------------------------------------------------
// DuckDuckGo HTML search — parse results to find "官网" links
// ---------------------------------------------------------------------------

/**
 * Search DuckDuckGo HTML for the company website URL.
 * Returns the first result whose link text contains "官网".
 */
export async function searchCompanyWebsite(
  companyName: string,
  industry?: string
): Promise<string | null> {
  const query = industry
    ? `${companyName} ${industry} 官网`
    : `${companyName} 官网`;

  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.warn('[companyFill] DuckDuckGo search failed:', response.status);
      return null;
    }

    const html = await response.text();

    // DuckDuckGo HTML result links look like:
    // <a href="https://example.com" class="result__a" ...>...官网...<a href="https://example.com/about" ...>
    // We want the outer <a> with the result URL and link text containing "官网"
    const linkRegex = /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/gi;
    const textRegex = /官网/;

    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      const linkText = match[2];

      if (textRegex.test(linkText)) {
        return href;
      }
    }

    // Fallback: return first https link that looks like a main domain
    const firstLink = /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*class="result__a"[^>]*>/i.exec(html);
    if (firstLink) {
      return firstLink[1];
    }

    return null;
  } catch (error) {
    console.warn('[companyFill] DuckDuckGo search error:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Playwright page fetch
// ---------------------------------------------------------------------------

/**
 * Fetch a URL using Playwright headless browser and return the page text.
 * Returns null on timeout or error.
 */
export async function fetchCompanyPage(url: string): Promise<string | null> {
  // Lazy-import so the rest of the service works without a browser in tests
  const { chromium } = await import('playwright');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });

    // Grab meta description and og:image before extracting body
    const description = await page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute('content') ?? '',
    ).catch(() => '');

    const ogImage = await page.$eval(
      'meta[property="og:image"]',
      (el) => el.getAttribute('content') ?? '',
    ).catch(() => '');

    // Try to extract article/main content
    const articleText = await page.$eval(
      'article, main, [role="main"]',
      (el) => (el as HTMLElement).innerText ?? '',
    ).catch(() => '');

    const bodyText = await page.evaluate(() => {
      // Remove script/style/nav/footer, keep visible text
      const clone = document.body.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('script,style,nav,footer,header,[role="navigation"]').forEach((el) => el.remove());
      return clone.innerText.replace(/\s+/g, ' ').trim();
    });

    // Return description if article body is too short
    const text = articleText.trim() || bodyText;
    const result = text.length > 100 ? text : (description || bodyText);

    // Attach metadata for extractCompanyInfo
    const enriched = `__META__: description=${description}|ogImage=${ogImage}\n${result}`;
    return enriched;
  } catch (error) {
    console.warn('[companyFill] Playwright fetch error:', url, error);
    return null;
  } finally {
    await browser?.close();
  }
}

// ---------------------------------------------------------------------------
// Text extraction → Block[]
// ---------------------------------------------------------------------------

export interface ExtractedCompanyInfo {
  description: string;
  imageUrl: string | null;
}

/**
 * Parse the raw page text (possibly prefixed with __META__) into structured info.
 */
export function parseCompanyPageText(raw: string): ExtractedCompanyInfo {
  let description = '';
  let imageUrl: string | null = null;

  const metaMatch = raw.match(/__META__:\s*description=(.*?)\|ogImage=(.*?)(?:\n|$)/s);
  if (metaMatch) {
    description = metaMatch[1]?.trim() ?? '';
    const ogImage = metaMatch[2]?.trim() ?? '';
    if (ogImage) imageUrl = ogImage;
  }

  // No meta, use the first ~500 chars of visible text as description
  if (!description) {
    const cleanText = raw
      .replace(/__META__.*?(?:\n|$)/s, '')
      .replace(/\s+/g, ' ')
      .trim();
    description = cleanText.slice(0, 500);
  }

  return { description, imageUrl };
}

/**
 * Generate Block[] from extracted company info.
 */
export function buildBlocks(info: ExtractedCompanyInfo): Block[] {
  const blocks: Block[] = [];

  blocks.push({ type: 'heading', level: 2, text: '公司简介' });

  if (info.description) {
    // Clean up the description
    const cleanDesc = info.description.replace(/\s+/g, ' ').trim();
    blocks.push({ type: 'paragraph', text: cleanDesc });
  }

  if (info.imageUrl) {
    blocks.push({ type: 'image', url: info.imageUrl, caption: '企业图片' });
  }

  return blocks;
}

/**
 * Full pipeline: search → fetch → extract → build Block[].
 * Returns null on any failure (no blocks = summary stays null in DB).
 */
export async function autoFillCompanyInfo(
  companyName: string,
  industry?: string
): Promise<Block[] | null> {
  try {
    const websiteUrl = await searchCompanyWebsite(companyName, industry);
    if (!websiteUrl) {
      console.info('[companyFill] No website found for:', companyName);
      return null;
    }

    const pageText = await fetchCompanyPage(websiteUrl);
    if (!pageText) {
      console.info('[companyFill] Failed to fetch page:', websiteUrl);
      return null;
    }

    const info = parseCompanyPageText(pageText);
    if (!info.description) {
      console.info('[companyFill] No content extracted for:', companyName);
      return null;
    }

    return buildBlocks(info);
  } catch (error) {
    console.error('[companyFill] Auto-fill error for:', companyName, error);
    return null;
  }
}
