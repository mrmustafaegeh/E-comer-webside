import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useProtectedRoute = () => {
  const router = useRouter();

  const { isLoggedIn, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  return { isLoggedIn, role };
};
