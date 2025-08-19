import AdminDashboard from "@/components/AdminDasboard";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex items-center justify-center h-fit">
        < AdminDashboard/>
      </div>
    </Layout>
  );
}
