import React from 'react';

export const TextBlock: React.FC = (props) => (
  <div className="text-block">
    {props.children}
    <style jsx global>{`
      .text-block {
        max-width: 800px;
        margin: 0 auto;
      }
    `}</style>
  </div>
);
