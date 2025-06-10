import LoadingSpinner from "@/Components/Loading";
import LoginPage from "@/Components/LoginOrSignupPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginPage />
    </Suspense>
  );
}
