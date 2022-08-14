import { styled, alpha } from "@mui/material";
import MiniProfile from "../MiniProfile";

const Heading = styled("div")(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "700",
}));

export default function TopCreator(props) {
  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <Heading>Rising Creators</Heading>
      <MiniProfile
        userName={"casey_neistat"}
        address="0x23e05938b4619035870836d22c4ef9988623c384"
        image={"https://i1.sndcdn.com/avatars-000429608763-sjstbb-t500x500.jpg"}
      />
      <MiniProfile
        userName={"dan_mace"}
        address="0x23e05938b4619035870836d22c4ef9988623c384"
        image={
          "https://pbs.twimg.com/profile_images/1486017488475373572/w9AG-Of1_400x400.jpg"
        }
      />
      <MiniProfile
        userName={"peter_mckinnon"}
        address="0x23e05938b4619035870836d22c4ef9988623c384"
        image={
          "https://starktimes.com/wp-content/uploads/2022/03/Peter-McKinnon-7.jpg"
        }
      />
      <MiniProfile
        userName={"irfan_junejo"}
        address="0x23e05938b4619035870836d22c4ef9988623c384"
        image={"https://i.hipinpakistan.com/large/2018/10/5bcdd224927cd.jpg"}
      />
    </div>
  );
}
