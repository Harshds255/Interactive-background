import InteractiveBackground from "@/components/InteractiveBackground";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div className="div-center">
      <InteractiveBackground />
      <h1>Interactive Background</h1>
      <h2>
        This is a interactive background for next js and react js using simple
        javascript canvas.
      </h2>
    </div>
  );
}
