import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Callback() {
  const router = useRouter();
  const { code, error } = router.query;

  useEffect(() => {
    if (code) {
      fetch(`/api/auth?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          if (typeof window !== "undefined") {
            router.push("/");
          }
        })
        .catch((err) => console.error(err));
    }

    if (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      if (typeof window !== "undefined") {
        router.push("/");
      }
    }
  }, [code, error]);

  return <div />;
}
