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

const RTCodeBlockServer = ({ code, title }: CodeBlockProps) => {
  return (
    <span className="visually-hidden" aria-hidden>
      <span>{title}</span>
      <span>{code}</span>
    </span>
  );
};

const RTCodeBlockClient = ({ code, title }: CodeBlockProps) => {
  const isClient = useIsClient();

  if (!isClient) return;
  return (
    <Highlight theme={themes.vsDark} code={code} language="tsx">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <>
          <RTCodeBlockCodeWrapper
            style={style}
            aria-label={code}
            suppressHydrationWarning
          >
            <strong>{title}</strong>
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
      <RTCodeBlockServer code={code} title={title} />
      <RTCodeBlockClient code={code} title={title} />
    </>
  );
};

export default RTCodeBlock;
