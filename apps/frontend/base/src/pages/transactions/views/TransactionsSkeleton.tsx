import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const TransactionsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4 pb-2 border-b">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-8 gap-4 py-3 border-b border-gray-100"
              >
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className={`h-4 bg-gray-200 rounded animate-pulse ${
                      colIndex === 7 ? "w-16 ml-auto" : ""
                    }`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
