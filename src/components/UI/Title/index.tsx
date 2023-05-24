"use client";

import { useApplicationState } from "@/contexts/applicationState";

import { HeadingOne, Text } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Title = ({ children, ...rest }: Props) => {
  const { loading } = useApplicationState();

  return (
    <HeadingOne>
      <Text animate={!loading} {...rest}>
        {children}
      </Text>
    </HeadingOne>
  );
};

export default Title;
