export default async function TestPage() {
  const res = await fetch("http://localhost:3000/api/health-check", {
    cache: "no-store",
    headers: {
      "accept-language": "fa"
    }
  });

  const data = await res.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        ATRIANA Connection Test
      </h1>
      <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
        <p>Status: {data.status}</p>
        <p>Message: {data.message}</p>
        <p>Server Time: {data.timestamp}</p>
      </div>
    </main>
  );
}
