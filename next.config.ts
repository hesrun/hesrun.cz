import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    turbopack: {
        root: process.cwd(),
        rules: {
            '*.css': {
                loaders: ['@tailwindcss/turbopack'],
                as: '*.css',
            },
        },
    },
    images: {
        remotePatterns: [{ protocol: 'https', hostname: 'images.ctfassets.net' }],
    },
};

export default withNextIntl(nextConfig);
