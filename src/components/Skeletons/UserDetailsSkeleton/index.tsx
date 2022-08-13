import React from "react";
import { styled, alpha } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@emotion/react";

const Index: React.FC = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "30px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Skeleton
        variant="circular"
        width={130}
        height={130}
        style={{
          //@ts-ignore
          border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
        }}
      />

      <Skeleton
        variant="rectangular"
        width={"50%"}
        height={20}
        style={{
          //@ts-ignore
          border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
          borderRadius: "8px",
          marginBottom: "8px",
          marginTop: "17px",
        }}
      />
      <Skeleton
        variant="rectangular"
        width={"75%"}
        height={30}
        style={{
          //@ts-ignore
          border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
          borderRadius: "8px",
        }}
      />
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          marginTop: "15px",
        }}
      >
        <Skeleton
          variant="rectangular"
          width={"30%"}
          height={50}
          style={{
            //@ts-ignore
            border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
            borderRadius: "8px",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={"30%"}
          height={50}
          style={{
            //@ts-ignore
            border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
            borderRadius: "8px",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={"30%"}
          height={50}
          style={{
            //@ts-ignore
            border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
            borderRadius: "8px",
          }}
        />
      </div>
    </div>
  );
};

export default Index;
