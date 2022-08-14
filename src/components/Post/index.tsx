/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { styled, alpha } from "@mui/material";
import { useTheme } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from "../../hooks";
import { useMediaQuery } from "@mui/material";
import Transparent from "../../assets/transparent.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { injected } from "../../utils/connector";

const MainDiv = styled("div")(({ theme }) => ({
  width: "100%",
  height: "fit-content",
  marginLeft: "auto",
  marginRight: "auto",
  margin: "13px 0px",
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
  padding: "10px",
  alignItems: "center",
}));

const PostPicture = styled("img")(({ theme }) => ({
  width: "30px",
  height: "30px",
  objectFit: "cover",
  borderRadius: "30px",
  boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  cursor: "pointer",
}));

const PostDisplayname = styled("div")(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "500",
  color: theme.palette.text.primary,
  textAlign: "left",
  marginLeft: "15px",
  cursor: "pointer",
  wordBreak: "break-all",
}));

const PostUsername = styled("div")(({ theme }) => ({
  fontSize: "15px",
  fontWeight: "500",
  color: theme.palette.text.primary,
  textAlign: "left",
  marginLeft: "10px",
  cursor: "pointer",
  wordBreak: "break-all",
}));

const PostDescription = styled("div")(({ theme }) => ({
  fontSize: "15px",
  fontWeight: "500",
  color: theme.palette.text.primary,
  textAlign: "left",
  cursor: "pointer",
  wordBreak: "break-word",
}));

const PostContent = styled("img")(({ theme }) => ({
  width: "100%",
  height: "fit-content",
  maxHeight: "450px",
  minHeight: "300px",
  objectFit: "cover",
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
  boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),
  borderTop: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  borderBottom: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  cursor: "pointer",
}));

const PostBottom = styled("div")(({ theme }) => ({
  width: "100%",
  height: "fit-content",
  padding: "10px",
  marginTop: "-7px",
}));

const PostBuy = styled("div")(({ theme }) => ({
  fontSize: "15px",
  lineHeight: "19px",
  fontWeight: "500",
  marginLeft: "auto",
  backgroundColor: theme.palette.background.default,
  padding: "0px 7px",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
}));

type Props = {
  post: SinglePost;
};

export interface User {
  id: string;
  address: string;
  userName: string;
  displayName: string;
  bio: string;
  image: string;
}

export interface SinglePost {
  _id: string;
  creator: User;
  owner: User;
  name: string;
  description: string;
  buyStatus: number;
  sellValue: number;
  image: string;
  transferHistory: any[];
  createdAt: string;
  updatedAt: string;
  likesArray: string[];
}

const Post: React.FC<Props> = (props) => {
  const [likeStatus, setLikeStatus] = React.useState(false);
  const [postLikes, setPostLikes] = React.useState<any>(
    props.post.likesArray?.length
  );
  const { account, activate } = useWeb3React();
  const theme = useTheme();
  //@ts-ignore
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const signature = useAppSelector((state) => state.userReducer.signature);
  const walletAddress = useAppSelector(
    (state) => state.userReducer.walletAddress
  );

  useEffect(() => {
    if (account && props?.post?.likesArray?.includes(account)) {
      setLikeStatus(true);
    }
  }, [props.post.likesArray, account]);

  const handleLike = async () => {
    if (!signature && !walletAddress) {
      await activate(injected);
      return;
    }

    setLikeStatus(true);
    setPostLikes(postLikes + 1);

    await axios.post("https://socialblocks.herokuapp.com/likes/setLikes", {
      postId: props.post._id,
      postUserAddress: props.post.owner.id,
      userAddress: walletAddress,
      signature,
    });
  };

  if (!props.post.owner?.id) return null;

  return (
    <MainDiv>
      <PostHeader>
        <PostPicture
          onClick={() => navigate(`/profile/${props.post.owner.id}`)}
          src={props.post.owner.image}
        />
        <PostUsername
          onClick={() => navigate(`/profile/${props.post.owner.id}`)}
        >
          @{props.post.owner.userName}
        </PostUsername>
        {/* </div> */}
        <MoreVertIcon
          style={{
            marginLeft: "auto",
            height: "25px",
            width: "25px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/post/${props.post._id}`)}
        />
      </PostHeader>
      <div style={{ position: "relative" }}>
        <PostContent
          // src={props.post.image}
          src={
            "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGVuc3xlbnwwfHwwfHw%3D&w=1000&q=80"
          }
          onClick={() => navigate(`/post/${props.post._id}`)}
        />
        {props.post.owner.id !== props.post.creator.id ? (
          <div
            style={{
              position: "absolute",
              bottom: "19px",
              right: "53px",
              padding: "5px 10px",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              background: "rgba(255, 255, 255, 0.1)",
              boxShadow: "rgb(0 0 0 / 20%) 0px 0px 1rem 0px",
              backdropFilter: "blur(10px)",
              height: "35px",
            }}
            onClick={() => navigate(`/profile/${props.post.creator.id}`)}
          >
            <span
              style={{
                //@ts-ignore
                color: theme.palette.background.default,
                opacity: "1",
                fontSize: "15px",
                lineHeight: "15px",
                fontWeight: "700",
              }}
            >
              @{props.post.creator.userName}
            </span>
            &nbsp;
          </div>
        ) : null}

        <div
          style={{
            position: "absolute",
            bottom: "19px",
            right: "10px",
            borderRadius: "7px",
            height: "35px",
            width: "35px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.1)",
            boxShadow: "rgb(0 0 0 / 20%) 0px 0px 1rem 0px",
            backdropFilter: "blur(10px)",
          }}
        >
          {likeStatus ? (
            <FavoriteIcon
              style={{
                //@ts-ignore
                fill: theme?.palette?.primary?.main,
                cursor: "pointer",
                height: "30px",
              }}
            />
          ) : (
            <FavoriteIcon
              style={{
                //@ts-ignore
                fill: theme?.palette?.background.default,
                cursor: "pointer",
                height: "30px",
              }}
              onClick={() => {
                handleLike();
              }}
            />
          )}
        </div>
      </div>
      <PostBottom>
        <div style={{ display: "flex", alignItems: "center" }}>
          <PostDescription
            style={{
              fontWeight: "700",
              flex: 1,
            }}
          >
            {props.post.name}
          </PostDescription>
          {props.post.buyStatus === 2 ? (
            <PostBuy onClick={() => navigate(`/post/${props.post._id}`)}>
              NFS
            </PostBuy>
          ) : props.post.buyStatus === 1 ? (
            <PostBuy onClick={() => navigate(`/post/${props.post._id}`)}>
              Bidding
            </PostBuy>
          ) : (
            <PostBuy onClick={() => navigate(`/post/${props.post._id}`)}>
              {props.post.sellValue / 10 ** 18} Eth
            </PostBuy>
          )}
        </div>
        <PostDescription
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
            marginTop: "5px",
            lineHeight: "15px",
          }}
        >
          ~{props.post.description}
        </PostDescription>
      </PostBottom>
    </MainDiv>
  );
};

export default Post;
