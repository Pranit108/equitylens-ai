import RelationshipGraph from "@/components/graph/RelationshipGraph";

export default async function GraphPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2 capitalize">
        {company} Relationship Graph
      </h1>

      <p className="text-zinc-400 mb-8">
        Explore how this company connects with products,
        suppliers, customers and competitors.
      </p>

      <RelationshipGraph company={company} />
    </main>
  );
}