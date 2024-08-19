"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserInfo from "../../components/userinfo";

export default function Account() {
    // const { data: session, status } = useSession();
    // const router = useRouter();

    // useEffect(() => {
    //     if (status === "loading") return; // Do nothing while loading
    //     if (!session) {
    //         router.push("/login"); // Redirect to login page if not authenticated
    //     }
    // }, [session, status, router]); // 'router' should be included in the dependency array

    // if (status === "loading") return <div>Loading...</div>;
    
    return (
        <UserInfo />
    );
}
