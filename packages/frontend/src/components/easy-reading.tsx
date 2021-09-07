import React from 'react';

export const EasyReading: React.FC = (props) => (
  <div className="easy-reading">
    {props.children}

    <style jsx global>{`
      @media screen and (min-width: 400px) {
        .easy-reading {
          font-size: 1.3rem;
          line-height: 2;
        }

        .easy-reading p,
        .easy-reading ul,
        .easy-reading figure {
          margin-bottom: 2rem;
        }
      }
    `}</style>
  </div>
);
