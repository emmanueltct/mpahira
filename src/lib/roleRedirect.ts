import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRoleRedirect(role: string) {
  const router = useRouter();

  useEffect(() => {
    switch (role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "seller":
        router.push("/seller/portal");
        break;
      case "Buyer":
        // Do nothing: stay on homepage
        break;
      default:
        router.push("/login");
    }
  }, [role, router]);
}
