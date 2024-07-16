import DOMPurify from 'dompurify';

const defaultOptions = {
    ALLOWED_TAGS: [ 'b', 'i', 'em', 'strong', 'a' ],
    ALLOWED_ATTR: ['href']
};

const sanitize = (dirty: any, options?: any) => ({
    __html: DOMPurify.sanitize(
        dirty,
        { ...defaultOptions, ...options }
    )
});

export const SanitizeHTML = ({ html, options }: { html: any, options?: any}) => (
    <div dangerouslySetInnerHTML={sanitize(html, options)} />
);