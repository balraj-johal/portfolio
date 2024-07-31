interface Props {
  heading: string;
  list: string[];
  className: string;
}

const VerticalList = ({ heading, list, className }: Props) => {
  return (
    <div className={className}>
      <h2>{heading}</h2>
      <ul>
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default VerticalList;
