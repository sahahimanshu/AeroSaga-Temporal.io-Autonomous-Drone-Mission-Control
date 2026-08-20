// <<<<<<< HEAD
// import { BrowserRouter } from 'react-router-dom';
// import AppRoutes from './routes/AppRoutes.jsx';
// =======
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import MainLayout from "./layouts/MainLayout";
// import Dashboard from "./pages/Dashboard";
// >>>>>>> origin/Komal

// function App() {
//   return (
//     <BrowserRouter>
// <<<<<<< HEAD
//       <AppRoutes />
// =======
//       <Routes>
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Dashboard />} />
//         </Route>
//       </Routes>
// >>>>>>> origin/Komal
//     </BrowserRouter>
//   );
// }

// <<<<<<< HEAD
// export default App;
// =======
// export default App;
// >>>>>>> origin/Komal


import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;