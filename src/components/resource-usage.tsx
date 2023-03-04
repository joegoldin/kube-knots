import {
  convertCpuToNanoCpu,
  convertMemoryToBytes,
  formatCpu,
  formatMemory,
} from "../helpers/unit-converter-helpers";

interface UsageProps {
  usage: string | undefined;
  request: string | undefined;
  maxWidth?: number;
  simpleLabel?: boolean;
}

export function CpuUsage({ usage, request, maxWidth = 40, simpleLabel = false }: UsageProps) {
  if (!usage || !request) {
    return null;
  }

  const usageNumber = convertCpuToNanoCpu(usage);

  return (
    <ResourceUsage
      simpleLabel={simpleLabel}
      barWidth={maxWidth}
      label={"CPU"}
      usage={usageNumber}
      request={convertCpuToNanoCpu(request)}
      formattedUsage={formatCpu(usageNumber)}
    />
  );
}

export function MemoryUsage({ usage, request, maxWidth = 40, simpleLabel = false }: UsageProps) {
  if (!usage || !request) {
    return null;
  }

  const usageNumber = convertMemoryToBytes(usage);

  return (
    <ResourceUsage
      simpleLabel={simpleLabel}
      barWidth={maxWidth}
      label={"Memory"}
      usage={usageNumber}
      request={convertMemoryToBytes(request)}
      formattedUsage={formatMemory(usageNumber)}
    />
  );
}

interface ResourceUsageProps {
  label: string;
  usage: number;
  request: number;
  barWidth: number;
  formattedUsage: string;
  simpleLabel: boolean;
}
export function ResourceUsage({
  label,
  usage,
  request,
  barWidth,
  formattedUsage,
  simpleLabel,
}: ResourceUsageProps) {
  const percent = Math.round((usage / request) * 100) || 0;

  const renderLabel = () => {
    if (simpleLabel) {
      return <div>{formattedUsage}</div>;
    }

    return (
      <>
        <div>{label}</div>
        <div>
          <span>{formattedUsage}</span>&sdot;
          <span>{percent}%</span>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex justify-between text-sm" style={{ width: barWidth }}>
        {renderLabel()}
      </div>
      <div
        className="box-content h-3 overflow-hidden rounded-md border border-gray-400 bg-gray-300 dark:bg-gray-500"
        style={{ width: barWidth }}
      >
        <div
          className={`h-3 ${percent >= 80 ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: Math.min((percent * barWidth) / 100, barWidth) }}
        />
      </div>
    </>
  );
}
