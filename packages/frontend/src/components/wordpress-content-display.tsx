import parse, { Element } from 'html-react-parser';

export interface WordpressContentDisplayProps {
  readonly content: string;
}

function fixElement(element: Element) {
  if (element.tagName === 'table') {
    element.attribs.class = `${element.attribs.class ?? ''} table`.trim();
  } else if (element.tagName === 'td' || element.tagName === 'th') {
    element.attribs.class = `${element.attribs.class ?? ''} col`.trim();
  }

  return undefined;
}

export const WordpressContentDisplay: React.FC<WordpressContentDisplayProps> = (
  props,
) => (
  <div className="wordpress-content-display">
    {parse(props.content, {
      replace: (domNode) => {
        if (domNode.nodeType === 1) {
          return fixElement(domNode as Element);
        }
      },
    })}

    <style jsx global>{`
      .wordpress-content-display figure.aligncenter {
        text-align: center;
      }
      .wordpress-content-display img {
        max-width: 100%;
        height: auto;
      }
    `}</style>
  </div>
);
