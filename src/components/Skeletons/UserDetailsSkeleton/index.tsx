import React from "react";
import { alpha } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material";

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
          backgroundColor: theme.palette.background.paper,
        }}
      />

      <Skeleton
        variant="rectangular"
        width={"97%"}
        height={30}
        style={{
          //@ts-ignore
          border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
          backgroundColor: theme.palette.background.paper,
          borderRadius: "8px",
          marginTop: "17px",
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
            backgroundColor: theme.palette.background.paper,

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
            backgroundColor: theme.palette.background.paper,

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
            backgroundColor: theme.palette.background.paper,

            borderRadius: "8px",
          }}
        />
      </div>
    </div>
  );
};

export default Index;
