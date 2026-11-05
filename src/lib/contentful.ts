import type { Document } from '@contentful/rich-text-types';

export type Work = {
    id: string;
    slug: string;
    title: string;
    url: string;
    order: number;
    description: Document | null;
    /** First paragraph as plain text, for meta and the home teaser. */
    summary: string;
    image: { src: string; width: number; height: number } | null;
};

type Link = { sys: { id: string } };
type Entry = {
    sys: { id: string };
    fields: {
        title?: string;
        url?: string;
        order?: number;
        description?: Document;
        image?: Link;
    };
};
type Asset = {
    sys: { id: string };
    fields: {
        file?: { url: string; details?: { image?: { width: number; height: number } } };
    };
};
type EntriesResponse = { items: Entry[]; includes?: { Asset?: Asset[] } };

const SPACE = process.env.CONTENTFUL_SPACE_ID ?? 'p4f2iuzeb1al';

function slugify(s: string) {
    return s
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-');
}

function plainText(doc: Document | undefined): string {
    const first = doc?.content.find((n) => n.nodeType === 'paragraph');
    if (!first || !('content' in first)) return '';
    return first.content
        .map((n) => ('value' in n ? n.value : ''))
        .join('')
        .trim();
}

/**
 * Projects from Contentful. Content only exists in en-US, so both site
 * locales read the same entries. Cached for an hour (ISR).
 */
export async function getWorks(): Promise<Work[]> {
    const token = process.env.CONTENTFUL_TOKEN;
    if (!token) {
        console.warn('[contentful] CONTENTFUL_TOKEN is not set, rendering without projects.');
        return [];
    }

    try {
        const res = await fetch(
            `https://cdn.contentful.com/spaces/${SPACE}/environments/master/entries?content_type=myWork&order=fields.order&include=1&limit=100`,
            {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 3600, tags: ['works'] },
            },
        );
        if (!res.ok) {
            console.error(`[contentful] ${res.status} ${res.statusText}`);
            return [];
        }
        const data = (await res.json()) as EntriesResponse;
        const assets = new Map((data.includes?.Asset ?? []).map((a) => [a.sys.id, a]));

        return data.items.map((item, index) => {
            const f = item.fields;
            const asset = f.image ? assets.get(f.image.sys.id) : undefined;
            const file = asset?.fields.file;
            const title = f.title ?? 'Untitled';
            return {
                id: item.sys.id,
                slug: slugify(title),
                title,
                url: f.url ?? '',
                order: f.order ?? index,
                description: f.description ?? null,
                summary: plainText(f.description),
                image: file
                    ? {
                          src: `https:${file.url}`,
                          width: file.details?.image?.width ?? 1900,
                          height: file.details?.image?.height ?? 900,
                      }
                    : null,
            };
        });
    } catch (err) {
        console.error('[contentful] request failed', err);
        return [];
    }
}
