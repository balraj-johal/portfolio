import { CursorType } from "@/types/cursor";

interface Props {
  cursorType: CursorType;
}

const CustomCursorContent = ({ cursorType }: Props) => {
  switch (cursorType) {
    case CursorType.Link:
      return <>&gt;</>;
    default:
      return null;
  }
};

export default CustomCursorContent;
