import Hero from "@/components/UI/Hero";
import { MainElement } from "@/components/UI/Main/styles";
import MyWork from "@/components/UI/MyWork";
import Title from "@/components/UI/Title";

export default function Home() {
  return (
    <>
      <Hero>
        <Title>Balraj Johal</Title>
      </Hero>
      <MyWork />
    </>
  );
}
