import LiveApp from "@/component/home/LiveApp";
import Phead from "@/component/home/Phead";
import About from "@/component/home/about";
import Header from "@/component/home/HomeHeader";
import WaitlistSec from "@/component/home/waitlist";
import Footer from "@/component/footer";

export default function Home() {
  return (
    <div>
      <Header />
      <Phead />
      <About />
      <LiveApp />
      <WaitlistSec />
      <Footer />
    </div>
  );
}
