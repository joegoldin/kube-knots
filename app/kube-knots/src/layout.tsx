import { Cog8ToothIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useState, type PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import iconUrl from "../src-tauri/icons/32x32.png";
import { NamespaceSelect } from "./components/namespace-select";
import { QueryWrapper } from "./components/query-wrapper";
import { Context, ContextSwitcher } from "./core/contexts";
import { useNamespace } from "./providers/namespaces-provider";
import { useTheme } from "./providers/theme-provider";
import {
  allRoutes,
  clusterRoutes,
  configurationRoutes,
  networkingRoutes,
  workloadsRoutes,
} from "./router";
import { UpdateButton } from "./settings/update-button";

const Settings = lazy(() =>
  import("./settings/settings").then((module) => ({ default: module.Settings }))
);

const ResourceCreateEditDrawer = lazy(() =>
  import("./components/resource-create-edit-drawer").then((module) => ({
    default: module.ResourceCreateEditDrawer,
  }))
);

export function Layout({ children }: PropsWithChildren) {
  const sections = [
    { title: "Overview", titleRoute: "/overview", routes: allRoutes },
    { title: "Workload", titleRoute: "/workload-overview", routes: workloadsRoutes },
    { title: "Networking", titleRoute: "/networking-overview", routes: networkingRoutes },
    { title: "Configurations", titleRoute: "/configuration-overview", routes: configurationRoutes },
    { title: "Cluster", titleRoute: null, routes: clusterRoutes },
  ] as const;

  const { namespaceQuery } = useNamespace();

  const [showSetting, setShowSetting] = useState(false);
  const [showContextSwitcher, setShowContextSwitcher] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const { theme, systemTheme } = useTheme();
  const themeToUse = theme === "system" ? systemTheme : theme;

  return (
    <div className="min-h-screen">
      <div className="fixed inset-y-0 flex w-40 flex-col bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
        <Link to="/" className="flex h-16 items-center px-4 font-medium">
          <img src={iconUrl} className="mr-2 h-6 w-6" alt="Icon" />
          Kube Knots
        </Link>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-4 px-4">
            {sections.map(({ title, titleRoute, routes }) => (
              <div key={title}>
                <Link
                  to={titleRoute}
                  className={`mt-8 font-bold ${titleRoute ? "" : "cursor-default"}`}
                  search={{}}
                  params={{}}
                >
                  {title}
                </Link>
                {routes.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center rounded-md px-2 py-1 text-sm font-medium text-gray-800 hover:bg-gray-400 focus:outline-none dark:text-gray-100 hover:dark:bg-gray-500 ${
                      window.location.pathname === item.path ? "bg-gray-300 dark:bg-gray-600" : ""
                    }`}
                    search={{}}
                    params={{}}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex flex-col pl-40 dark:bg-gray-800">
        <div className="sticky top-0 z-10 flex h-16 w-full shrink-0 items-center justify-between bg-gray-200 p-4 shadow dark:bg-gray-700">
          <div className="flex items-end gap-2">
            <NamespaceSelect />

            <button
              onClick={() => setShowCreate(true)}
              className="flex cursor-pointer items-center rounded-md bg-gray-100 p-2 shadow hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <PlusIcon className="m-0 block h-6 w-6 fill-gray-600 hover:fill-gray-800 dark:fill-gray-400 dark:hover:fill-gray-200" />
              <span>Create</span>
            </button>
          </div>
          <button onClick={() => setShowContextSwitcher(true)}>
            <Context />
          </button>
          <div className="flex items-center gap-2">
            <UpdateButton />
            <Cog8ToothIcon
              className="h-6 w-6 cursor-pointer fill-gray-600 hover:fill-gray-800 dark:fill-gray-400 dark:hover:fill-gray-200"
              onClick={() => setShowSetting(true)}
            />
          </div>
          <Suspense>
            <Settings isOpen={showSetting} handleClose={() => setShowSetting(false)} />
          </Suspense>
          <Suspense>
            <ResourceCreateEditDrawer
              action="create"
              isOpen={showCreate}
              handleClose={() => setShowCreate(false)}
              selectedResource={null}
            />
          </Suspense>
          <ContextSwitcher
            isOpen={showContextSwitcher}
            handleClose={() => setShowContextSwitcher(false)}
          />
        </div>

        <main className="flex-1 select-none">
          <div className="mx-auto max-w-7xl">
            {namespaceQuery && (
              <QueryWrapper query={namespaceQuery}>
                <div className="p-4">{children}</div>
              </QueryWrapper>
            )}
          </div>
        </main>
      </div>
      <ToastContainer
        theme={themeToUse}
        position="bottom-right"
        autoClose={3000}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
