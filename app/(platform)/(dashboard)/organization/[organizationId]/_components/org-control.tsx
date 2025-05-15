"use client"

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

export const OrgControl = () => {
    const params = useParams();
    const orgId = params.organizationId as string | undefined;

    useEffect(() => {
        if (!orgId) return;
        Cookies.set("orgId", orgId, { expires: 7 });
    }, [orgId]);

    return null;
};
