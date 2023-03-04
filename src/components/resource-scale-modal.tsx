import type { V1StatefulSet, V1Deployment, V1ReplicaSet } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

import { camelToSnakeCase } from "../helpers/casing-helpers";
import { useCurrentContext } from "../providers/current-context-provider";
import { BaseModal, ModalButton } from "./modal";

interface ResourceScaleModalProps {
  isOpen: boolean;
  handleClose: () => void;
  selectedResource: V1Deployment | V1ReplicaSet | V1StatefulSet | null;
}
export function ResourceScaleModal({
  isOpen,
  handleClose,
  selectedResource,
}: ResourceScaleModalProps): JSX.Element {
  const [replicas, setReplicas] = useState<number>(selectedResource?.spec?.replicas || 0);
  const { currentContext } = useCurrentContext();

  useEffect(() => {
    setReplicas(selectedResource?.spec?.replicas || 0);
  }, [selectedResource]);

  const type = camelToSnakeCase(selectedResource?.kind);

  const scaleMutation = useMutation({
    mutationFn: (replicas: number) => {
      return invoke(`scale_${type}`, {
        context: currentContext,
        namespace: selectedResource?.metadata?.namespace,
        name: selectedResource?.metadata?.name,
        replicas,
      });
    },
    onSuccess: (_data, variables) => {
      handleClose();
      alert(
        `Scaled ${type.replace("_", " ")} ${
          selectedResource?.metadata?.name
        } to ${variables} replicas`
      );
    },
    onError: (_data) => {
      alert(_data);
    },
  });

  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={handleClose}
      title={`Scale ${selectedResource?.metadata?.name}`}
    >
      <div className="mt-2">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Current replica count: {selectedResource?.spec?.replicas}
        </p>
      </div>

      <input
        onChange={(e) => setReplicas(parseInt(e.target.value ?? ""))}
        type="number"
        value={replicas}
        className="mt-4 block w-full rounded-md border-gray-300 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:ring-slate-500 sm:text-sm"
        step={1}
        min={0}
      />

      <ModalButton label="Scale" onClick={() => scaleMutation.mutate(replicas)} />
    </BaseModal>
  );
}