import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Financial <span className="text-blue-400">Tools</span>
        </h1>
        <p className="text-xl text-slate-400">
          Simple calculators to help you make better financial decisions
        </p>
        <div className="grid grid-cols-1 gap-4 md:gap-8">
          <Link
            className="flex max-w-md flex-col gap-4 rounded-xl bg-blue-600/20 p-6 hover:bg-blue-600/30 transition-colors"
            href="/mortgage"
          >
            <h3 className="text-2xl font-bold">Mortgage Calculator →</h3>
            <div className="text-lg text-slate-300">
              Calculate your monthly payments, view amortization schedules, and
              see how much you&apos;ll pay in interest over the life of your
              loan.
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
