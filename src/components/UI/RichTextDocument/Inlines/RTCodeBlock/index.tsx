"use client";

import { Highlight, themes } from "prism-react-renderer";

import { ICodeBlockFields } from "@/types/generated/contentful";
import useIsClient from "@/hooks/useIsClient";

import { RTCodeBlockCodeWrapper } from "./styles";

interface Props {
  fields: unknown;
}

interface CodeBlockProps {
  code: string;
  title: string;
}

// const RTCodeBlockServer = ({ code, title }: CodeBlockProps) => {
//   return (
//     <div className="visually-hidden">
//       <h5>{title}</h5>
//       <span>{code}</span>
//     </div>
//   );
// };

const RTCodeBlockClient = ({ code, title }: CodeBlockProps) => {
  const isClient = useIsClient();

  if (!isClient) return;
  return (
    <Highlight theme={themes.vsDark} code={code} language="tsx">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <>
          <strong>{title}</strong>
          <RTCodeBlockCodeWrapper
            style={style}
            aria-hidden
            suppressHydrationWarning
          >
            {tokens.map((line, i) => (
              <span key={i} {...getLineProps({ line })}>
                <span>{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            ))}
          </RTCodeBlockCodeWrapper>
        </>
      )}
    </Highlight>
  );
};

const RTCodeBlock = ({ fields }: Props) => {
  const { title, code } = fields as ICodeBlockFields;

  if (typeof code !== "string") return null;
  return (
    <>
      {/* <RTCodeBlockServer code={code} title={title} /> */}
      <RTCodeBlockClient code={code} title={title} />
    </>
  );
};

export default RTCodeBlock;
