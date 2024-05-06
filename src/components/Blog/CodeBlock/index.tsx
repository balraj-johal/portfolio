"use client";

import { Highlight } from "prism-react-renderer";

import { ICodeBlockFields } from "@/types/generated/contentful";
import useIsClient from "@/hooks/useIsClient";

import { CodeBlockCodeWrapper } from "./styles";

interface Props {
  fields: unknown;
}

interface CodeBlockProps {
  code: string;
  title: string;
}

const CodeBlockServer = ({ code, title }: CodeBlockProps) => {
  return (
    <span className="visually-hidden" aria-hidden>
      <span>{title}</span>
      <span>{code}</span>
    </span>
  );
};

const CodeBlockClient = ({ code, title }: CodeBlockProps) => {
  const isClient = useIsClient();

  if (!isClient) return;
  return (
    <Highlight code={code} language="tsx">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <>
          <CodeBlockCodeWrapper
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
          </CodeBlockCodeWrapper>
        </>
      )}
    </Highlight>
  );
};

const CodeBlock = ({ fields }: Props) => {
  const { title, code } = fields as ICodeBlockFields;

  if (typeof code !== "string") return null;
  return (
    <>
      <CodeBlockServer code={code} title={title} />
      <CodeBlockClient code={code} title={title} />
    </>
  );
};

export default CodeBlock;
