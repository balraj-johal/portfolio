import { Text } from "@contentful/rich-text-types";

interface Props {
  content: Text;
}

const mappedMarks = (content: Text) => content.marks.map((mark) => mark.type);

const getMarkClassNames = (marks: string[]) => {
  let classNames = "";
  if (marks.includes("code")) classNames += "code ";
  if (marks.includes("bold")) classNames += "bold ";
  return classNames;
};

const RTText = ({ content }: Props) => {
  const marks = mappedMarks(content);

  if (content.value === "") return null;
  return <span className={getMarkClassNames(marks)}>{content.value}</span>;
};

export default RTText;
