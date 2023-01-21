import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { useCurrentNamespace } from "../namespaces/namespaces";

type Commands =
  | "get_cron_jobs"
  | "get_deployments"
  | "get_jobs"
  | "get_pods"
  | "get_replica_sets"
  | "get_stateful_sets";

export function useGetResourceList<T>(command: Commands) {
  const { namespace } = useCurrentNamespace();
  const result = useQuery(
    [command, namespace],
    () => {
      return invoke<{ items: T[] }>(command, { namespace });
    },
    // TODO: maybe make this configurable?
    { refetchInterval: 2000 }
  );

  return { ...result, data: result.data ?? { items: [] } };
}
