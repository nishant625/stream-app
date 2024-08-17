import { createViewerToken } from "@/actions/token";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const useViewerToken = (hostIdentity: string) => {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");

  useEffect(() => {
    const createToken = async () => {
      try {
        const viewerToken = await createViewerToken(hostIdentity);
        setToken(viewerToken);

        const decodedToken = jwtDecode(viewerToken) as JwtPayload & {
          name?: string;
          sub?: string;
        };

        const decodedName = decodedToken?.name;
        const decodedIdentity = decodedToken.sub;

        if (decodedIdentity) {
          setIdentity(decodedIdentity);
        }
        if (decodedName) {
          setName(decodedName);
        }
      } catch {
        toast.error("Something went wrong");
      }
    };
    createToken();
  }, [hostIdentity]);

  return {
    token,
    name,
    identity,
  };
};