/** Renders schema.org data. `<` is escaped so content can't close the script tag. */
const LT_ESCAPE = String.fromCharCode(92) + 'u003c';

export default function JsonLd({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, LT_ESCAPE),
            }}
        />
    );
}
