/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { styled, alpha } from '@mui/material';
import { useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '../../hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactPlayer from 'react-player';
import { SERVER_URL } from '../../utils/constants';

const MainDiv = styled('div')(({ theme }) => ({
  width: '100%',
  height: 'fit-content',
  marginLeft: 'auto',
  marginRight: 'auto',
  margin: '13px 0px',
  backgroundColor: theme.palette.background.paper,
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  borderRadius: '9px',
  boxShadow: '0 0 1rem 0 ' + alpha('#000', 0.2),

  [theme.breakpoints.down('sm')]: {},
}));

const PostHeader = styled('div')(({ theme }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  padding: '10px',
  alignItems: 'center',
}));

const PostPicture = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  objectFit: 'cover',
  borderRadius: '30px',
  boxShadow: '0 0 1rem 0 ' + alpha('#000', 0.2),
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  cursor: 'pointer',
}));

const PostUsername = styled('div')(({ theme }) => ({
  fontSize: '15px',
  fontWeight: '500',
  color: theme.palette.text.primary,
  textAlign: 'left',
  marginLeft: '10px',
  cursor: 'pointer',
  wordBreak: 'break-all',
}));

const PostDescription = styled('div')(({ theme }) => ({
  fontSize: '15px',
  fontWeight: '500',
  color: theme.palette.text.primary,
  textAlign: 'left',
  cursor: 'pointer',
  wordBreak: 'break-word',
}));

const PostContent = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'fit-content',
  maxHeight: '450px',
  minHeight: '300px',
  objectFit: 'cover',
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  boxShadow: '0 0 1rem 0 ' + alpha('#000', 0.2),
  borderTop: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  borderBottom: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  cursor: 'pointer',
}));

const PostBottom = styled('div')(({ theme }) => ({
  width: '100%',
  height: 'fit-content',
  padding: '10px',
  marginTop: '-7px',
}));

const PostBuy = styled('div')(({ theme }) => ({
  fontSize: '15px',
  lineHeight: '19px',
  fontWeight: '500',
  marginLeft: 'auto',
  backgroundColor: theme.palette.background.default,
  padding: '0px 7px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
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
  id: string;
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
  metaData: string;
}

const Post: React.FC<Props> = props => {
  const [likeStatus, setLikeStatus] = React.useState(false);
  const [postType, setPostType] = React.useState(null);
  const [postLikes, setPostLikes] = React.useState<any>(
    props.post.likesArray?.length,
  );
  const [copyOf, setCopyOf] = React.useState<any>(0);
  const { account } = useWeb3React();
  const theme = useTheme();
  const navigate = useNavigate();
  const signature = useAppSelector(state => state.userReducer.signature);

  useEffect(() => {
    if (account && props.post?.likesArray?.includes(account)) {
      setLikeStatus(true);
    }
  }, [props.post.likesArray, account]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post(`${SERVER_URL}/type/getType`, {
          postId: props.post.id,
        });

        setPostType(data?.type || 'image');
      } catch (e) {
        console.log('e -', e);
      }
    })();
  }, [props.post.id]);

  const handleLike = async () => {
    if (!account) {
      alert('Connect Wallet!');
      return;
    }

    setLikeStatus(true);
    setPostLikes(postLikes + 1);

    await axios.post(`${SERVER_URL}/likes/setLikes`, {
      postId: props.post.id,
      postUserAddress: props.post.owner.id,
      userAddress: account,
      signature,
    });
  };

  const getCopyOf = async () => {
    const postId = props?.post?.id;
    const res = await axios.get(`${SERVER_URL}/posts/getCopies/` + postId);
    if (res?.data?.copyOf) {
      setCopyOf(res.data.copyOf);
    }
  };

  useEffect(() => {
    postType === 'image' && getCopyOf();
  }, [postType]);

  if (!props.post.owner?.id) return null;

  return (
    <MainDiv>
      <PostHeader>
        <PostPicture
          onClick={() => navigate(`/profile/${props.post.owner.id}`)}
          src={
            'https://benjaminkor2.infura-ipfs.io/ipfs/' + props.post.owner.image
          }
        />
        <PostUsername
          onClick={() => navigate(`/profile/${props.post.owner.id}`)}>
          @{props.post.owner.userName}
        </PostUsername>
        {/* </div> */}
        <MoreVertIcon
          style={{
            marginLeft: 'auto',
            height: '25px',
            width: '25px',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/post/${props.post.id}`)}
        />
      </PostHeader>
      <div style={{ position: 'relative' }}>
        {postType === 'image' ? (
          <PostContent
            src={
              'https://benjaminkor2.infura-ipfs.io/ipfs/' +
              JSON.parse(props.post.metaData).image
            }
            onClick={() => navigate(`/post/${props.post.id}`)}
          />
        ) : (
          <ReactPlayer
            url={
              'https://benjaminkor2.infura-ipfs.io/ipfs/' +
              JSON.parse(props.post.metaData).image
            }
            width={'100%'}
            height={'fit-content'}
            controls={true}
            style={{ margin: 'auto', cursor: 'pointer' }}
          />
        )}
        {props.post.owner.id !== props.post.creator.id ? (
          <div
            style={{
              position: 'absolute',
              bottom: '19px',
              right: '53px',
              padding: '5px 10px',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: 'rgb(0 0 0 / 20%) 0px 0px 1rem 0px',
              backdropFilter: 'blur(10px)',
              height: '35px',
            }}
            onClick={() => navigate(`/profile/${props.post.creator.id}`)}>
            <span
              style={{
                //@ts-ignore
                color: theme.palette.background.default,
                opacity: '1',
                fontSize: '15px',
                lineHeight: '15px',
                fontWeight: '700',
              }}>
              @{props.post.creator.userName}
            </span>
            &nbsp;
          </div>
        ) : null}

        {copyOf != 0 ? (
          <div
            style={{
              position: 'absolute',
              top: '7px',
              left: '7px',
              padding: '5px 10px',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: 'rgb(0 0 0 / 20%) 0px 0px 1rem 0px',
              backdropFilter: 'blur(10px)',
              height: '35px',
            }}
            onClick={() => navigate(`/post/${copyOf}`)}>
            <span
              style={{
                //@ts-ignore
                color: theme.palette.primary.main,
                opacity: '1',
                fontSize: '15px',
                lineHeight: '10px',
                fontWeight: '1000',
              }}>
              *COPY* <span style={{ fontWeight: '500' }}>of Post#{copyOf}</span>
            </span>
          </div>
        ) : null}

        {account?.toLowerCase() ===
        props.post.owner.address.toLowerCase() ? null : (
          <div
            style={{
              position: 'absolute',
              bottom: '19px',
              right: '10px',
              borderRadius: '7px',
              height: '35px',
              width: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: 'rgb(0 0 0 / 20%) 0px 0px 1rem 0px',
              backdropFilter: 'blur(10px)',
            }}>
            {likeStatus ? (
              <FavoriteIcon
                style={{
                  //@ts-ignore
                  fill: theme?.palette?.primary?.main,
                  cursor: 'pointer',
                  height: '30px',
                }}
              />
            ) : (
              <FavoriteIcon
                style={{
                  //@ts-ignore
                  fill: theme?.palette?.background.default,
                  cursor: 'pointer',
                  height: '30px',
                }}
                onClick={() => {
                  handleLike();
                }}
              />
            )}
          </div>
        )}
      </div>
      <PostBottom>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PostDescription
            style={{
              fontWeight: '700',
              flex: 1,
            }}>
            {JSON.parse(props.post.metaData).name}
          </PostDescription>
          {props.post.buyStatus === 2 ? (
            <PostBuy onClick={() => navigate(`/post/${props.post.id}`)}>
              NFS
            </PostBuy>
          ) : props.post.buyStatus === 1 ? (
            <PostBuy onClick={() => navigate(`/post/${props.post.id}`)}>
              Bidding
            </PostBuy>
          ) : (
            <PostBuy onClick={() => navigate(`/post/${props.post.id}`)}>
              {props.post.sellValue / 10 ** 18} Matic
            </PostBuy>
          )}
        </div>
        <PostDescription
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            marginTop: '5px',
            lineHeight: '15px',
          }}>
          ~{JSON.parse(props.post.metaData).description}
        </PostDescription>
      </PostBottom>
    </MainDiv>
  );
};

export default Post;
