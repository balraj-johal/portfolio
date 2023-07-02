import { Suspense } from "react";

import Title from "@/components/UI/Title";
import Subtitle from "@/components/UI/Subtitle";
import MyWork from "@/components/UI/MyWork";
import Main from "@/components/UI/Main";
import Hero from "@/components/UI/Hero";

export default async function Home() {
  return (
    <Main>
      <Hero>
        <Title>Balraj Johal</Title>
        <Subtitle>I do some things on the internet</Subtitle>
      </Hero>
      <Suspense>
        <MyWork />
      </Suspense>
    </Main>
  );
}
