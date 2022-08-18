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
            "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content."
          }
        />
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
      </ScrollContainer>
    </MainContainer>
  );
}
