import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes"; // using default export

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
