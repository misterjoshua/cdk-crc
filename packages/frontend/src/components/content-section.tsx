import React from 'react';

export interface ContentSectionProps {
  readonly dark?: boolean;
}

export const ContentSection: React.FC<ContentSectionProps> = (props) => {
  const sectionClassName = props.dark ? 'text-white bg-black' : '';

  return (
    <section className={sectionClassName}>
      <div className="container">{props.children}</div>

      <style jsx>{`
        section {
          padding-top: 3rem;
          padding-bottom: 3rem;
        }
      `}</style>
    </section>
  );
};
