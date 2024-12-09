import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Link, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import { TimerProvider } from "./context/TimerContext";
import TimersView from "./views/TimersView";
import DocumentationView from "./views/DocumentationView";
import AddTimer from "./views/AddTimer";
import { ErrorPage } from "./views/ErrorPageView";


const PageIndex = () => {
  return (
    <div>
      <h1>Assignment</h1>
      <ul>
        <li>
          <Link to="/">Timers</Link>
        </li>
        <li>
          <Link to="/docs">Documentation</Link>
        </li>
        <li>
          <Link to="/add">Add Timer</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageIndex />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <TimersView />,
        errorElement: <ErrorPage />,


      },
      {
        path: "/docs",
        element: <DocumentationView />,
        errorElement: <ErrorPage />,



      },
      {
        path: "/add",
        element: <AddTimer />,
        errorElement: <ErrorPage />,

      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TimerProvider>
      <RouterProvider router={router} />
    </TimerProvider>
  </StrictMode>
);
