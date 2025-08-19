import UsersListPage from "@/components/admin/allUser";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <UsersListPage/>
      </div>
    </Layout>
  );
}
