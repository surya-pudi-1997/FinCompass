import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const AccountCardSkeleton: React.FC = () => {
  return (
    <Card className="w-full animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
          </div>
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-gray-200 rounded"></div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const AccountsListSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="h-9 w-32 bg-gray-300 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <AccountCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export { AccountCardSkeleton, AccountsListSkeleton };
