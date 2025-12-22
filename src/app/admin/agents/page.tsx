import AgentListPage from "@/components/admin/agentList";

import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <AgentListPage/>
      </div>
    </Layout>
  );
}
