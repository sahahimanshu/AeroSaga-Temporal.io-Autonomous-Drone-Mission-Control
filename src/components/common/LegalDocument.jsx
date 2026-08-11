import './LegalDocument.css';

/**
 * Renders a structured legal document (sections of heading + paragraphs)
 * inside a modal body. Shared by the Terms & Conditions and Privacy
 * Policy modals so both reuse the same layout/styling.
 */
function LegalDocument({ sections, effectiveDate }) {
  return (
    <div className="legal-document">
      {effectiveDate && <p className="legal-document__meta">Effective date: {effectiveDate}</p>}
      {sections.map((section) => (
        <section key={section.heading} className="legal-document__section">
          <h3 className="legal-document__heading">{section.heading}</h3>
          {section.body.map((paragraph, index) => (
            <p key={index} className="legal-document__paragraph">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

export default LegalDocument;