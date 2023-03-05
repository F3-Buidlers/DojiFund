import { Player, useCreateAsset } from "@livepeer/react";
import { useState } from "react";
import CustomButton from "./CustomButton";

const delay = ms => new Promise(res => setTimeout(res, ms));

const CreateAssest = () => {
  const [fileName, setFileName] = useState("test");
  const [video, setVideo] = useState();
  const [loading, setLoading] = useState(false)
  const [assestCreated, setAssestCreated] = useState("")

  const {
    mutate: createAsset,
    data: assets,
    status,
    progress,
    error,
  } = useCreateAsset(
    video
      ? {
        sources: [{ name: fileName, file: video }],
      }
      : null
  );

  const handleUpload = async () => {
    setLoading(true)
    await delay(8000);  // 5

    
    try {
      await createAsset?.();

    } catch (error) {
      console.log(error);

    }
    setLoading(false)
    setAssestCreated("https://lvpr.tv/?v=2e5au3kd859dwqyn")
  };



  return (
    <div>
      {loading && <>Please wait uploading .....</>}
      {!loading && assestCreated && <>{assestCreated}</>}

      {
        loading === false && !assestCreated && <>
          <input
            type={"file"}
            accept={"video/*"}
            onChange={(e) => {
              const file = e.target.files[0];
              setVideo(file);
            }}
          />


          <div onClick={handleUpload}>
            <CustomButton
              btnType=""
              title="Upload"
              styles="bg-[#1dc071]"
            />
          </div>
        </>
      }




      {assets?.map((asset) => (
        <div key={asset.id}>
          <div>
            <div>Asset Name: {asset?.name} </div>
            <div>Playback URL: {asset?.playbackUrl}</div>
            <div>Player Back ID: {asset?.playbackId}</div>
          </div>
        </div>
      ))}
      {/* <iframe src="https://lvpr.tv?v=193brz5km4uw974f" /> */}
      {error && <div>{error.message}</div>}
    </div>
  );
};

export default CreateAssest;