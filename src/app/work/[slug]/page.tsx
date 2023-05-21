interface Props {
  params: {
    slug: string;
  };
}

export default function Home({ params }: Props) {
  const { slug } = params;

  return <h1>{slug}</h1>;
}
