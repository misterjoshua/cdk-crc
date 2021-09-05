import React from 'react';

export const TextBlock: React.FC = (props) => (
  <>
    <div className="text-block">{props.children}</div>
    <style jsx>{`
      .text-block {
        max-width: 800px;
        margin: 0 auto;
      }
    `}</style>
  </>
);
