import Hero from "@/components/UI/Hero";
import MyWork from "@/components/UI/MyWork";
import Title from "@/components/UI/Title";
import { MainElement } from "./styles";

export default function Home() {
  return (
    <MainElement>
      <Hero>
        <Title>Balraj Johal</Title>
      </Hero>
      <MyWork />
    </MainElement>
  );
}
