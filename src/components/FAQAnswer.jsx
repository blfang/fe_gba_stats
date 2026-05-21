import ReactMarkdown from 'react-markdown';

/**
 * Renders FAQ answer text with Markdown support.
 * Links open in a new tab with noopener noreferrer for security.
 */
function MarkdownLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function FAQAnswer({ segments }) {
  if (typeof segments === 'string') {
    return (
      <div className="faq-answer">
        <ReactMarkdown
          components={{
            a: MarkdownLink,
          }}
        >
          {segments}
        </ReactMarkdown>
      </div>
    );
  }

  // Backwards-compatible: also handle structured segment arrays
  return (
    <div className="faq-answer">
      {segments.map((seg, i) => {
        if (seg.type === 'link') {
          return (
            <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer">
              {seg.text}
            </a>
          );
        }
        if (seg.type === 'break') {
          return <br key={i} />;
        }
        return <span key={i}>{seg.text}</span>;
      })}
    </div>
  );
}