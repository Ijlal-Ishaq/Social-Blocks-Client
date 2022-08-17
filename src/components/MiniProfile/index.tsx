import React from "react";
import { styled, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const MainDiv = styled("div")(({ theme }) => ({
  width: "100%",
  height: "fit-content",
  marginLeft: "auto",
  marginRight: "auto",
  margin: "7px 0px",
  backgroundColor: theme.palette.background.paper,
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  borderRadius: "9px",
  boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),
  cursor: "pointer",
  overflow: "hidden",

  [theme.breakpoints.down("sm")]: {},
}));

const PostHeader = styled("div")(({ theme }) => ({
  width: "100%",
  height: "fit-content",
  display: "flex",
  padding: "9px",
  alignItems: "center",
  justifyContent: "flex-start",
}));

const PostPicture = styled("img")(({ theme }) => ({
  width: "30px",
  height: "30px",
  objectFit: "cover",
  borderRadius: "40px",
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  cursor: "pointer",
}));

const PostUsername = styled("div")(({ theme }) => ({
  fontSize: "17px",
  lineHeight: "17px",
  fontWeight: "500",
  color: theme.palette.text.primary,
  textAlign: "left",
  marginLeft: "10px",
  cursor: "pointer",
}));

type Props = {
  image;
  userName;
  address;
};

const Profile: React.FC<Props> = (props) => {
  const navigate = useNavigate();

  return (
    <MainDiv onClick={() => navigate(`/profile/${props.address}`)}>
      <PostHeader>
        <PostPicture src={props.image} />
        <div style={{ flex: "1", overflow: "hidden" }}>
          {/* <PostDisplayname>{props.displayName}</PostDisplayname> */}
          <PostUsername>@{props.userName}</PostUsername>
        </div>
        <MoreVertIcon
          style={{
            marginLeft: "auto",
            height: "30px",
            width: "20px",
            cursor: "pointer",
          }}
        />
      </PostHeader>
    </MainDiv>
  );
};

export default Profile;
