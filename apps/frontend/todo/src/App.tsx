import React, { Suspense } from "react";

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      hello
      {/* Lazy loaded About component from Admin app */}
    </Suspense>
  );
};

export default App;
