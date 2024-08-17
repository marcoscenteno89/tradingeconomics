import Image from "next/image";
import styles from "./page.module.css";
import TEComponent from "./components/trading-economics";

export default function Home() {
  return (
    <main className="container-md py-4">
      <TEComponent />
    </main>
  );
}
