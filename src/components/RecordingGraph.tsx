import { Box } from "@chakra-ui/react";
import {
  Chart,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  registerables,
} from "chart.js";
import { useEffect, useRef } from "react";
import { XYZData } from "../gestures";
import { getConfig as getRecordingChartConfig } from "../recording-graph";

interface RecordingGraphProps {
  data: XYZData;
}

const RecordingGraph = ({ data }: RecordingGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    Chart.unregister(...registerables);
    Chart.register([LinearScale, LineController, PointElement, LineElement]);
    const chart = new Chart(
      canvasRef.current?.getContext("2d") ?? new HTMLCanvasElement(),
      getRecordingChartConfig(data)
    );
    return () => {
      chart.destroy();
    };
  });

  return (
    <Box
      borderRadius="md"
      borderWidth={1}
      borderColor="gray.20"
      width="100%"
      height="100%"
    >
      <canvas ref={canvasRef} />
    </Box>
  );
};

export default RecordingGraph;
