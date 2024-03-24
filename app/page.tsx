import { HypothesisTester } from "@/components/hypothesis-tester";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-4 mx-4">
      <HypothesisTester apiKey={process.env.GROQ_API_KEY} />
    </main>
  );
}
