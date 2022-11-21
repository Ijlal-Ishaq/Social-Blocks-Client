/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Post from '../../components/Post';
import { styled, alpha } from '@mui/system';
import Header from '../../components/Header';
import axios from 'axios';
import CustomModal from '../../components/CustomModal';
import CustomFormModal from '../../components/CustomFormModal';
import { useWeb3React } from '@web3-react/core';
import Button from '../../components/Button';
import EditModal from './components/EditModal';
import Transparent from '../../assets/transparent.png';
import UserDetailsSkeleton from '../../components/Skeletons/UserDetailsSkeleton';
import PostSkeleton from '../../components/Skeletons/PostSkeleton';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import Loader from '../../components/Loader';
import Ad from '../../components/Ad';
import TopCreator from '../../components/TopCreators';
import UpcomingFeatures from '../../components/UpcomingFeatures';
import { SERVER_URL, SUBGRAPH_URL } from '../../utils/constants';
import FloatingActionButton from '../../components/FloatingActionButton';

const Body = styled('div')(({ theme }) => ({
  width: '100vw',
  maxHeight: '100vh',
  overflowY: 'auto',

  '::-webkit-scrollbar': {
    width: '13px',
    background: alpha(theme.palette.primary.main, 0.1),
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '3px',
    background: theme.palette.primary.main,
    height: '150px',
  },

  [theme.breakpoints.down('sm')]: {
    '::-webkit-scrollbar': {
      width: '13px',
      background: alpha(theme.palette.primary.main, 0.1),
      display: 'none',
    },
  },
}));

const MainDiv = styled('div')(({ theme }) => ({
  width: '450px',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '100px 0px',
  paddingTop: '70px',
  textAlign: 'center',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: '90px 10px',
    paddingTop: '60px',
  },
}));

const ProfilePicture = styled('img')(({ theme }) => ({
  width: '130px',
  height: '130px',
  margin: '15px auto',
  marginTop: '30px',
  borderRadius: '100%',
  boxShadow: '0 0 1rem 0 ' + alpha('#000', 0.2),
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  cursor: 'pointer',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
}));

const Heading = styled('div')(({ theme }) => ({
  fontSize: '27px',
  lineHeight: '27px',
  fontWeight: '300',
  color: theme.palette.text.primary,
  textAlign: 'center',
  marginTop: '-10px',
  lineBreak: 'anywhere',
}));

const SubHeading = styled('div')(({ theme }) => ({
  fontSize: '20px',
  lineHeight: '20px',
  marginTop: '5px',
  fontWeight: '700',
  color: theme.palette.text.primary,
  textAlign: 'center',
  lineBreak: 'anywhere',
}));

const Bio = styled('div')(({ theme }) => ({
  fontSize: '15px',
  lineHeight: '15px',
  fontWeight: '500',
  marginTop: '10px',
  color: theme.palette.text.primary,
  textAlign: 'center',
  lineBreak: 'anywhere',
}));

const InfoContainer = styled('div')(({ theme }) => ({
  width: '100%',
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  margin: '20px 0px',
  padding: '8px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-around',
}));

const InfoTab = styled('div')(({ theme }) => ({
  fontSize: '20px',
  fontWeight: '800',
  width: '100px',
  margin: '3px 0px',
  cursor: 'pointer',
}));

const PostTypeContainer = styled('div')(({ theme }) => ({
  width: '100%',
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  margin: '15px 0px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: '3px',
}));

const PostTypeTab = styled('div')<{ active?: boolean }>(
  ({ theme, active }) => ({
    fontSize: '17px',
    lineHeight: '17px',
    fontWeight: '500',
    width: 'calc(50% - 4px)',
    padding: '10px 0px',
    borderRadius: '5px',
    color: active ? theme.palette.background.paper : theme.palette.text.primary,
    backgroundColor: active ? alpha(theme.palette.text.primary, 0.5) : 'none',
    cursor: 'pointer',
    textAlign: 'center',
  }),
);

const AdDiv = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '65px',
  left: '0',
  height: 'calc(100vh - 65px)',
  width: 'calc(50vw - 233px)',

  display: 'flex',
  flexDirection: 'column',

  padding: '30px 70px',

  [theme.breakpoints.down('md')]: {
    padding: '30px 20px',
  },

  [theme.breakpoints.down('smd')]: {
    display: 'none',
  },
}));

const SuggestionsDiv = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '65px',
  right: '14px',
  height: 'calc(100vh - 65px)',
  width: 'calc(50vw - 235px)',

  display: 'flex',
  flexDirection: 'column',

  padding: '20px 70px',

  [theme.breakpoints.down('md')]: {
    padding: '20px 20px',
  },

  [theme.breakpoints.down('smd')]: {
    display: 'none',
  },
}));

export default function LetterAvatars() {
  const [createdPosts, setCreatedPosts] = useState<any[]>([]);
  const [createdPostsLoading, setCreatedPostsLoading] = useState(true);
  const [ownedPosts, setOwnedPosts] = useState<any[]>([]);
  const [ownedPostsLoading, setOwnedPostsLoading] = useState(true);
  const [postType, setPostType] = useState<string>('owned');
  const [followStatus, setFollowStatus] = useState<boolean>(false);
  const [loadDataModalStatus, setLoadDataModalStatus] = useState(false);

  const [address, setAddress] = useState('');
  const [user, setUser] = useState<any>(null);

  const [userFollowing, setUserFollowing] = useState<any>([]);
  const [userFollower, setUserFollower] = useState<any>([]);

  const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
  const { account } = useWeb3React();
  const navigate = useNavigate();
  const signature = useAppSelector(state => state.userReducer.signature);
  const walletAddress = useAppSelector(
    state => state.userReducer.walletAddress,
  );

  const getUserFollowing = async () => {
    await axios({
      url: `${SERVER_URL}/users/getFollowing/${address.toLowerCase()}`,
      method: 'get',
    }).then(response => {
      if (response?.data) {
        console.log(response.data);
        setUserFollowing(response.data.data);
      }
    });
  };

  const getUserFollowers = async () => {
    await axios({
      url: `${SERVER_URL}/users/getFollowers/${address.toLowerCase()}`,
      method: 'get',
    }).then(response => {
      if (response?.data) {
        console.log(response.data);
        setUserFollower(response.data.data);
        if (response.data.data.includes(account?.toLowerCase())) {
          setFollowStatus(true);
        }
      }
    });
  };

  const getCreatedPosts = async () => {
    const result = await axios.post(
      SUBGRAPH_URL,
      {
        query: `
      {
        posts(orderBy:createdAt orderDirection:desc where:{creator:"${address.toLowerCase()}" owner_not: "${address.toLowerCase()}"}){
            id
            creator {
              id
              address
              userName
              displayName
              bio
              image
            }
            owner {
              id
              address
              userName
              displayName
              bio
              image
            }
            uri
            buyStatus
            sellValue
    				metaData
            transferHistory
    				createdAt
        }
      }
      `,
      },
    );

    if (result.data?.data?.posts) {
      setCreatedPosts(result.data?.data?.posts);
      setTimeout(() => {
        setCreatedPostsLoading(false);
      }, 500);
    }
  };

  const getOwnedPosts = async () => {
    const result = await axios.post(
      SUBGRAPH_URL,
      {
        query: `
      {
        posts(orderBy:createdAt orderDirection:desc where:{owner: "${address.toLowerCase()}"}){
            id
            creator {
              id
              address
              userName
              displayName
              bio
              image
            }
            owner {
              id
              address
              userName
              displayName
              bio
              image
            }
            uri
            buyStatus
            sellValue
    				metaData
            transferHistory
    				createdAt
        }
      }
      `,
      },
    );

    if (result.data?.data?.posts) {
      setOwnedPosts(result.data?.data?.posts);
      setTimeout(() => {
        setOwnedPostsLoading(false);
      }, 500);
    }
  };

  const getUserDetails = async () => {
    const result = await axios.post(
      SUBGRAPH_URL,
      {
        query: `
      {
        user(id:"${address.toLowerCase()}"){
          userName
          displayName
          id
          address
          bio
          image
          rewardClaimed
          createdAt
        }
      }
      `,
      },
    );

    if (result.data?.data?.user) {
      console.log(result.data?.data?.user);
      setUser({ ...result.data?.data?.user });
      setLoadDataModalStatus(false);

      setTimeout(() => {
        setCreatedPostsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    setFollowStatus(false);
    setAddress(window.location.href.split('/')[4].toLowerCase());
  }, [window.location.href]);

  useEffect(() => {
    if (address && address !== '') {
      getUserDetails();
      getCreatedPosts();
      getOwnedPosts();
      getUserFollowers();
      getUserFollowing();
    }
  }, [address]);

  const follow = async () => {
    if (!account) {
      alert('Connect Wallet!');
      return;
    }
    setFollowStatus(true);
    await axios.post(`${SERVER_URL}/users/follow`, {
      userAddress: account?.toLowerCase(),
      address: account?.toLowerCase(),
      followUser: user?.address,
      signature,
    });
    setUserFollower([...userFollower, walletAddress?.toLowerCase()]);
    setFollowStatus(true);
  };

  const unFollow = async () => {
    if (!account) {
      alert('Connect Wallet!');
      return;
    }
    setFollowStatus(false);
    await axios.post(`${SERVER_URL}/users/unfollow`, {
      userAddress: account?.toLowerCase(),
      address: account?.toLowerCase(),
      followUser: user?.address,
      signature,
    });
    setFollowStatus(false);
  };

  const reloadData = async () => {
    let user_address = address;
    setAddress('');
    setAddress(user_address);
  };

  return (
    <Body>
      <Header />
      <MainDiv>
        {user ? (
          <>
            <ProfilePicture
              src={Transparent}
              style={{
                backgroundImage: `url(https://benjaminkor2.infura-ipfs.io/ipfs/${user?.image})`,
              }}
            />
            <Heading>{user?.displayName}</Heading>
            <SubHeading>@{user?.userName}</SubHeading>
            <Bio>{user?.bio}</Bio>
            <Button
              style={{ marginBottom: '0px', marginTop: '25px' }}
              onClick={() => {
                if (user?.address?.toLowerCase() === account?.toLowerCase()) {
                  setEditModalStatus(true);
                } else if (followStatus) {
                  unFollow();
                } else {
                  follow();
                }
              }}>
              {user?.address?.toLowerCase() === account?.toLowerCase()
                ? 'Edit Profile'
                : followStatus
                ? 'Unfollow'
                : 'follow'}
            </Button>
            <InfoContainer>
              <InfoTab>
                <div>{ownedPosts.length}</div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '500',
                  }}>
                  Posts
                </div>
              </InfoTab>
              <InfoTab
                onClick={() => {
                  navigate(`/followers/${user?.address}`);
                }}>
                <div>{userFollower?.length}</div>
                <div style={{ fontSize: '15px', fontWeight: '500' }}>
                  Followers
                </div>
              </InfoTab>
              <InfoTab
                onClick={() => {
                  navigate(`/followings/${user?.address}`);
                }}>
                <div>{userFollowing?.length}</div>
                <div style={{ fontSize: '15px', fontWeight: '500' }}>
                  Following
                </div>
              </InfoTab>
              {/* {!isMobile ? (
                <InfoTab>
                  <div>{user.rewardClaimed}</div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Reward
                  </div>
                </InfoTab>
              ) : null} */}
            </InfoContainer>
          </>
        ) : (
          <UserDetailsSkeleton />
        )}

        <PostTypeContainer>
          <PostTypeTab
            active={postType === 'owned' ? true : false}
            onClick={() => {
              setPostType('owned');
            }}>
            Owned Posts
          </PostTypeTab>
          <PostTypeTab
            active={postType === 'created' ? true : false}
            onClick={() => {
              setPostType('created');
            }}>
            Sold Posts
          </PostTypeTab>
        </PostTypeContainer>

        {createdPosts.length > 0 && postType === 'created' ? (
          createdPosts.map((item: any, index: number) => (
            <Post key={index} post={item} />
          ))
        ) : createdPostsLoading && postType === 'created' ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : postType === 'created' ? (
          <SubHeading>
            <br />
            No Sold Posts.
          </SubHeading>
        ) : null}

        {ownedPosts.length > 0 && postType === 'owned' ? (
          ownedPosts.map((item: any, index: number) => (
            <Post key={index} post={item} />
          ))
        ) : ownedPostsLoading && postType === 'owned' ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : postType === 'owned' ? (
          <SubHeading>
            <br />
            No Owned Posts.
          </SubHeading>
        ) : null}
      </MainDiv>

      <CustomFormModal
        open={editModalStatus}
        handleClose={() => {
          setEditModalStatus(false);
        }}>
        <EditModal
          image={user?.image}
          username={user?.userName}
          displayName={user?.displayName}
          bio={user?.bio}
          handleClose={() => {
            setEditModalStatus(false);
          }}
          reloadData={reloadData}
        />
      </CustomFormModal>
      <CustomModal
        open={loadDataModalStatus}
        handleClose={() => {
          setLoadDataModalStatus(false);
        }}>
        <Loader />
        <br /> <br />
        <Heading style={{ fontWeight: '400', fontSize: '20px' }}>
          Changes might take 10-15 secs to Reflect, you can{' '}
          <span
            style={{
              fontWeight: '700',
              fontSize: '25px',
              textDecoration: 'underline',
              textDecorationThickness: '3px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setLoadDataModalStatus(false);
            }}>
            close
          </span>
          this Modal.
        </Heading>
      </CustomModal>

      <AdDiv>
        <Ad />
        {/* <Ad /> */}
        {/* <Ad /> */}
      </AdDiv>
      <SuggestionsDiv>
        <TopCreator />
        <UpcomingFeatures />
        {/* <Ad /> */}
      </SuggestionsDiv>
      <FloatingActionButton />
      
    </Body>
  );
}
