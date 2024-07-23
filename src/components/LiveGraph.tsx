import { HStack } from "@chakra-ui/react";
import { useSize } from "@chakra-ui/react-use-size";
import { useEffect, useMemo, useRef, useState } from "react";
import { SmoothieChart, TimeSeries } from "smoothie";
import { useConnectionStage } from "../connection-stage-hooks";

const LiveGraph = () => {
  const { isConnected } = useConnectionStage();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [chart, setChart] = useState<SmoothieChart | undefined>(undefined);
  const lineWidth = 2;

  const liveGraphContainerRef = useRef(null);
  const { width, height } = useSize(liveGraphContainerRef) ?? {
    width: 100,
    height: 100,
  };

  const lineX = useMemo(() => new TimeSeries(), []);
  const lineY = useMemo(() => new TimeSeries(), []);
  const lineZ = useMemo(() => new TimeSeries(), []);
  const recordLines = useMemo(() => new TimeSeries(), []);

  // On mount draw smoothieChart
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const smoothieChart = new SmoothieChart({
      maxValue: 2.3,
      minValue: -2,
      millisPerPixel: 7,
      grid: {
        fillStyle: "#ffffff00",
        strokeStyle: "rgba(48,48,48,0.20)",
        millisPerLine: 3000,
        borderVisible: false,
      },
      interpolation: "linear",
    });

    smoothieChart.addTimeSeries(lineX, { lineWidth, strokeStyle: "#f9808e" });
    smoothieChart.addTimeSeries(lineY, { lineWidth, strokeStyle: "#80f98e" });
    smoothieChart.addTimeSeries(lineZ, { lineWidth, strokeStyle: "#808ef9" });
    smoothieChart.addTimeSeries(recordLines, {
      lineWidth: 3,
      strokeStyle: "#4040ff44",
      fillStyle: "#0000ff07",
    });
    setChart(smoothieChart);
    smoothieChart.streamTo(canvasRef.current, 0);
    smoothieChart.render();
    return () => {
      smoothieChart.stop();
    };
  }, [lineX, lineY, lineZ, recordLines]);

  useEffect(() => {
    if (isConnected) {
      chart?.start();
    } else {
      chart?.stop();
    }
  }, [chart, isConnected]);

  const { connectActions } = useConnectionStage();

  useEffect(() => {
    if (isConnected) {
      connectActions.addAccelerometerListener(({ data }) => {
        const t = new Date().getTime();
        lineX.append(t, data.x / 1000, false);
        lineY.append(t, data.y / 1000, false);
        lineZ.append(t, data.z / 1000, false);
      });
    }
  }, [connectActions, isConnected, lineX, lineY, lineZ]);

  // TODO Recording logic
  return (
    <HStack
      ref={liveGraphContainerRef}
      width="100%"
      height="100%"
      overflow="hidden"
    >
      <canvas
        ref={canvasRef}
        height={height}
        id="smoothie-chart"
        width={width - 30}
      />
    </HStack>
  );
};

export default LiveGraph;
