import Router from "@/router/Router";
import React, { Suspense } from "react";
import { Toaster } from "sonner";

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Toaster />
      <Router />
      {/* Lazy loaded About component from Admin app */}
    </Suspense>
  );
};

export default App;
