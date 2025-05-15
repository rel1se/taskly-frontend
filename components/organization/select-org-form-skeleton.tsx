import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {ChevronRight} from "lucide-react";

export const SelectOrgSkeleton = () => {
    return (
        <Card className="w-[600px] p-6">
            <CardHeader>
                <CardTitle className="text-2xl">Выберите организацию</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                    <div
                        key={idx}
                        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100 rounded-2xl"
                    >
                        <div className="flex items-center gap-x-4">
                            <Skeleton className="w-16 h-16 rounded-md" />
                            <Skeleton className="h-6 w-40 rounded" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-400" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
