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

export const EasyReading: React.FC = (props) => (
  <div className="easy-reading">
    {props.children}

    <style jsx global>{`
      .easy-reading {
        font-size: 1.3rem;
        line-height: 2;
      }
      .easy-reading p {
        margin-bottom: 2rem;
      }
    `}</style>
  </div>
);
