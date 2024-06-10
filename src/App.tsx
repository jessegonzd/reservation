import { Suspense } from "react";
import "./App.css";
import AppRoutes from "src/routes/router";

function App() {
  return (
    <div className="app">
      <Suspense fallback={'Loading...'}>
        <AppRoutes />
      </Suspense>
    </div>
  );
}

export default App;
