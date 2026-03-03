import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export function getSession() {
    return getServerSession(authOptions);
}