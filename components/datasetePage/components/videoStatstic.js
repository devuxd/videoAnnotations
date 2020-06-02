import { totalTime, getAnnotationsStatstics } from "../../../API/statstics";
import PiChart from "../components/piChart";
import { getAnnotationsTitle } from "../../../API/db";
import { mainColor } from "../../../API/color";

function VideoStatstic({ rotate, domId, video }) {
  const annotationsStatstics = getAnnotationsStatstics(video.annotations);
  const color = mainColor(getAnnotationsTitle().annotations);

  return (
    <>
      <button
        type="button"
        class="btn btn-info"
        onClick={() => rotate(domId, "close")}
      >
        Back
      </button>
      <div>
        <PiChart
          data={annotationsStatstics.sort((a, b) => b - a)}
          id={domId}
          totalTime={video.videoLength}
          color={color}
        ></PiChart>
      </div>
    </>
  );
}

export default VideoStatstic;
