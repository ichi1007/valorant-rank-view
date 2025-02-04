import LiveApp from "@/component/home/LiveApp";
import Phead from "@/component/home/Phead";
import About from "@/component/home/about";

export default function Home() {
  return (
    <div>
      <Phead />
      <About />
      <LiveApp />
    </div>
  );
}
