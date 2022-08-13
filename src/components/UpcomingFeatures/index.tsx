import { styled } from "@mui/material";
import Feature from "../Feature";

const Heading = styled("div")(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "700",
}));

export default function UpcomingFeatures(props) {
  return (
    <div
      style={{
        width: "100%",
        flex: "1",
      }}
    >
      <Heading>Upcoming Features</Heading>
      <Feature
        title={"SuperMails"}
        description={
          "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content."
        }
      />
      <Feature
        title={"SuperBadges"}
        description={
          "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content."
        }
      />
    </div>
  );
}
