import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

export function getSession() {
    return getServerSession(authOptions);
}
