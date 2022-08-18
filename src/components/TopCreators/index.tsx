import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import MiniProfile from "../MiniProfile";
import MiniProfileSkeleton from "../Skeletons/MiniProfileSkeleton";
import axios from "axios";

const Heading = styled("div")(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "700",
}));

export default function TopCreator(props) {
  const [creators, setCreators] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchCreators = async () => {
    const result = await axios.get(
      "http://localhost:5001/users/getRisingCreators"
    );
    setCreators(result?.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <Heading>Rising Creators</Heading>

      {isLoading ? (
        <>
          <MiniProfileSkeleton />
          <MiniProfileSkeleton />
          <MiniProfileSkeleton />
          <MiniProfileSkeleton />
        </>
      ) : (
        //@ts-ignore
        creators.map((e) => {
          return (
            <MiniProfile
              userName={e.userName}
              address={e.address}
              image={"https://benjaminkor2.infura-ipfs.io/ipfs/" + e.image}
            />
          );
        })
      )}
    </div>
  );
}
