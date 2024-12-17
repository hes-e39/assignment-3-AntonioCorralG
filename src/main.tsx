import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Link, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { TimerProvider } from "./context/TimerContext";
import TimersView from "./views/TimersView";
import DocumentationView from "./views/DocumentationView";
import AddTimer from "./views/AddTimer";
import HistoryView from './views/HistoryView';
import { ErrorPage } from "./views/ErrorPageView";


const PageIndex = () => {
  return (
    <TimerProvider>
    {/* <ErrorBoundary FallbackComponent={ErrorPage}> */}
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
            <li>
              <Link to="/history">Workout History</Link>
            </li>
          </ul>
          <Outlet />
        </div>
      {/* </ErrorBoundary> */}
    </TimerProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageIndex />,
    children: [
      {
        index: true,
        element: <TimersView />,
      },
      {
        path: "/docs",
        element: <DocumentationView />,
      },
      {
        path: "/add",
        element: <AddTimer />,
      },
      {
        path: "/history",
        element: <HistoryView />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
