import React, { useEffect, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store, useAppDispatch } from "@/redux";
import { hydrate } from "@/redux/slices/authSlice";
import { router } from "@/routes";
import "./styles.css";

const AuthHydrator = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthHydrator>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </AuthHydrator>
    </Provider>
  </React.StrictMode>,
);
