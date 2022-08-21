import { useLayoutEffect, useRef, useState } from "react";
import { styled, alpha } from "@mui/material";
import Feature from "../Feature";

const MainContainer = styled("div")(({ theme }) => ({
  width: "100%",
  marginTop: "10px",
  flex: "1",
  display: "flex",
  flexDirection: "column",
}));

const Heading = styled("div")(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "700",
  marginBottom: "3px",
}));

const ScrollContainer = styled("div")<{ height?: any }>(
  ({ theme, height }) => ({
    height: height ? height - 20 : "0px",
    overflow: "auto",
    paddingRight: "9px",

    "::-webkit-scrollbar": {
      width: "5px",
      background: alpha(theme.palette.primary.main, 0.1),
    },

    "::-webkit-scrollbar-thumb": {
      borderRadius: "5px",
      background: theme.palette.primary.main,
    },
  })
);

export default function UpcomingFeatures(props) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    function updateHeight() {
      //@ts-ignore
      setHeight(ref?.current?.offsetHeight);
    }
    window.addEventListener("resize", updateHeight);
    updateHeight();
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    //@ts-ignore
    <MainContainer ref={ref}>
      <Heading>Upcoming Features</Heading>
      <ScrollContainer height={height}>
        <Feature
          title={"ContentTypes"}
          description={
            "We are planning to add multiple content types like text, short videos and music to target most art forms."
          }
        />
        <Feature
          title={"SuperMails"}
          description={
            "These are special mails that an individual can send to his/her favorite creator, it is like fan mail in the real world."
          }
        />
        <Feature
          title={"SuperBadges"}
          description={
            "These are special kinds of digital badges that a creator can create and assign to one of their follower. These badges will have numerous utilities."
          }
        />
      </ScrollContainer>
    </MainContainer>
  );
}
