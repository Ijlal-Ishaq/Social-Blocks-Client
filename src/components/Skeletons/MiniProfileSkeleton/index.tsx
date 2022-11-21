import React from "react";
import { styled, alpha } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@emotion/react";

const MainDiv = styled("div")(({ theme }) => ({
  width: "100%",
  height: "fit-content",
  margin: "13px 0px",
  marginLeft: "auto",
  marginRight: "auto",
  backgroundColor: theme.palette.background.paper,
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  borderRadius: "9px",
  boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),

  [theme.breakpoints.down("sm")]: {},
}));

const PostHeader = styled("div")(({ theme }) => ({
  width: "100%",
  height: "fit-content",
  display: "flex",
  padding: "9px",
  alignItems: "center",
}));

type Props = any;

const Index: React.FC<Props> = () => {
  const theme = useTheme();
  return (
    <MainDiv>
      <PostHeader>
        <Skeleton
          variant="circular"
          width={30}
          height={30}
          style={{
            //@ts-ignore
            border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
          }}
        />
        &nbsp;&nbsp; 
        <div style={{ flex: 1 }}>
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={20}
            style={{
              //@ts-ignore
              border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
              borderRadius: "8px",
            }}
          />
        </div>
      </PostHeader>
    </MainDiv>
  );
};

export default Index;
