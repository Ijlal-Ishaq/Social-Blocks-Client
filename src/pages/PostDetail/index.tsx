/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { styled, alpha } from '@mui/system';
import { FC, useEffect, useState } from 'react';
import Button from '../../components/Button';
import Header from '../../components/Header/index';
import Profile from '../../components/Profile/index';
import axios from 'axios';
import PostDetailsSkeleton from '../../components/Skeletons/PostDetailsSkeleton/index';
import { useAppSelector } from '../../hooks';
import CustomModal from '../../components/CustomModal';
import CustomFormModal from '../../components/CustomFormModal';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { CONTRACT_ADDRESS } from '../../contract/constants';
import contractAbi from '../../contract/contractAbi.json';
import ChangeStatusModal from './ChangeStatusModal/index';
import User from '../../components/User';
import { useTheme } from '@emotion/react';
import IosShareIcon from '@mui/icons-material/IosShare';
import Ad from '../../components/Ad';
import TopCreator from '../../components/TopCreators';
import UpcomingFeatures from '../../components/UpcomingFeatures';
import { SERVER_URL, SUBGRAPH_URL } from '../../utils/constants';
import ReactPlayer from 'react-player';

const Body = styled('div')(({ theme }) => ({
  width: '100vw',
  maxHeight: '100vh',
  overflowY: 'auto',

  '::-webkit-scrollbar': {
    width: '13px',
    //@ts-ignore
    background: alpha(theme.palette.primary.main, 0.1),
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '3px',
    //@ts-ignore
    background: theme.palette.primary.main,
    height: '150px',
  },

  //@ts-ignore
  [theme.breakpoints.down('sm')]: {
    '::-webkit-scrollbar': {
      width: '13px',
      //@ts-ignore
      background: alpha(theme.palette.primary.main, 0.1),
      display: 'none',
    },
  },
}));

const MainContainer = styled('div')(({ theme }) => ({
  width: '450px',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '100px 0px',
  paddingTop: '70px',

  //@ts-ignore
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: '90px 10px',
    paddingTop: '70px',
  },
}));

const MainDiv = styled('div')(({ theme }) => ({
  width: '100%',
  height: 'fit-content',
  marginLeft: 'auto',
  marginRight: 'auto',
  margin: '15px 0px',
  borderRadius: '9px',
  //@ts-ignore
  [theme.breakpoints.down('sm')]: {},
}));

const PostContent = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'fit-content',
  maxHeight: '550px',
  minHeight: '300px',
  objectFit: 'cover',
  boxShadow: '0 0 1rem 0 ' + alpha('#000', 0.2),
  //@ts-ignore
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  borderRadius: '8px',
}));

const Heading = styled('div')(({ theme }) => ({
  fontSize: '20px',
  fontWeight: '500',
  //@ts-ignore
  color: theme.palette.text.primary,
  textAlign: 'center',
  marginTop: '17px',
  marginBottom: '0px',
  marginLeft: '7px',
  marginRight: '7px',
}));

const InfoContainer = styled('div')(({ theme }) => ({
  width: '100%',
  //@ts-ignore
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  margin: '10px 0px',
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
  margin: '5px 0px',
  textAlign: 'center',
}));

const Input = styled('input')(({ theme }) => ({
  fontSize: '20px',
  fontWeight: '400',
  //@ts-ignore
  color: theme.palette.text.primary,
  margin: '5px 0px',
  marginTop: '0px',
  padding: '9px 18px',
  width: '100%',
  //@ts-ignore
  backgroundColor: theme.palette.background.paper,
  //@ts-ignore
  border: 'solid 3px ' + alpha(theme.palette.text.primary, 0.5),
  borderRadius: '5px',
}));

const TextArea = styled('textarea')(({ theme }) => ({
  fontSize: '20px',
  fontWeight: '400',
  //@ts-ignore
  color: theme.palette.text.primary,
  margin: '5px 0px',
  marginTop: '0px',
  padding: '9px 18px',
  width: '100%',
  //@ts-ignore
  backgroundColor: theme.palette.background.paper,
  //@ts-ignore
  border: 'solid 3px ' + alpha(theme.palette.text.primary, 0.5),
  borderRadius: '5px',
  overflowY: 'auto',
  resize: 'vertical',
  minHeight: '100px',

  '::-webkit-scrollbar': {
    width: '5px',
    //@ts-ignore
    background: alpha(theme.palette.primary.main, 0.1),
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '5px',
    //@ts-ignore
    background: theme.palette.primary.main,
  },
}));

const HorizontalSlider = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  overflowX: 'auto',
  alignItems: 'center',

  '::-webkit-scrollbar': {
    height: '8px',
    //@ts-ignore
    background: alpha(theme.palette.primary.main, 0.1),
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '5px',
    //@ts-ignore
    background: theme.palette.primary.main,
  },
}));

const CommentBody = styled('div')(({ theme }) => ({
  padding: '5px 10px',
  margin: '7px 0px',
  marginBottom: '15px',
  border: 'solid 3px ' + alpha(theme.palette.text.primary, 0.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '9px',
}));

const CommentText = styled('div')(({ theme }) => ({
  fontSize: '20px',
  fontWeight: '500',
  textAlign: 'left',
  wordBreak: 'break-all',
}));

const CommentUser = styled('div')(({ theme }) => ({
  fontSize: '15px',
  fontWeight: '500',
  textAlign: 'right',
  cursor: 'pointer',
}));

const Ring = styled('div')(({ theme }) => ({
  height: '20px',
  width: '20px',
  borderRadius: '100%',
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
}));

const HorizontalDivider = styled('div')(({ theme }) => ({
  height: '2px',
  width: '30px',
  backgroundColor: alpha(theme.palette.text.primary, 0.5),
}));

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

const PostDetail: FC = () => {
  const [commentStatus, setCommentStatus] = useState(false);
  const [commentingModalStatus, setCommentingModalStatus] = useState(false);
  const [buyModalStatus, setBuyModalStatus] = useState(false);
  const [claimModalStatus, setClaimModalStatus] = useState(false);
  const [statusFormModalStatus, setStatusFormModalStatus] = useState(false);
  const [statusModalStatus, setStatusModalStatus] = useState(false);
  const [biddingModalStatus, setBiddingModalStatus] = useState(false);
  const [claimingBidModalStatus, setClaimingBidModalStatus] = useState(false);
  const [loadDataModalStatus, setLoadDataModalStatus] = useState(false);

  const [postId, setPostId] = useState('');
  const [postDetails, setPostDetails] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [transferHistory, setTransferHistory] = useState<any[]>([]);

  const [commentText, setCommentText] = useState<string>('');
  const signature = useAppSelector(state => state.userReducer.signature);

  const navigate = useNavigate();
  const { account } = useWeb3React();
  const web3Context = useWeb3React();

  const [likes, setLikes] = useState<any[]>([]);
  const [postMediaType, setPostMediaType] = useState<string>('image');
  const [biddingTimestamp, setBiddingTimestamp] = useState<any>();
  const [biddingDate, setBiddingDate] = useState<Date>();
  const [biddingPrice, setBiddingPrice] = useState<any>('---');
  const [biddingAddress, setBiddingAddress] = useState<string>('---');

  const [claimableAmount, setClaimableAmount] = useState(0);

  const [bidAmmount, setBidAmount] = useState(0);

  const theme = useTheme();
  //@ts-ignore

  const getPostDetails = async () => {
    if (postId !== '') {
      const result = await axios.post(
        SUBGRAPH_URL,
        {
          query: `
          {
            post(id:"${postId.toString()}"){
              id
              creator{
                id
                address
                userName
                displayName
                bio
                image
                rewardClaimed
                createdAt
              }
              owner{
                id
                address
                userName
                displayName
                bio
                image
                rewardClaimed
                createdAt
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

      if (result.data?.data?.post) {
        setPostDetails(result.data?.data?.post);
      }

      const transferResult = await axios.get(
        `${SERVER_URL}/posts/getTransferHistory/` + postId,
      );

      setTransferHistory(transferResult?.data?.usersInOrder);

      const [type, likes] = await Promise.all([
        axios.post(`${SERVER_URL}/type/getType/`, {
          postId,
        }),
        axios.post(`${SERVER_URL}/likes/getlikes/`, {
          postId,
        }),
      ]);

      setLikes(likes?.data.likesArray);
      setPostMediaType(type.data.type);

      // setLikes(result?.data?.likesArray);
      setLoadDataModalStatus(false);
    }
  };

  const setComment = async () => {
    if (!account) {
      alert('Connect Wallet!');
      return;
    }

    if (commentText !== '') {
      setCommentingModalStatus(true);
      let result = await axios.post(`${SERVER_URL}/comment/setcomment`, {
        postId: parseInt(postId),
        comment: commentText,
        userAddress: account?.toLowerCase(),
        signature,
      });
      setComments([...comments, result?.data?.comment]);
      setCommentText('');
      setCommentingModalStatus(false);
    }
  };

  const getComments = async () => {
    if (postId !== '') {
      const result = await axios.get(
        `${SERVER_URL}/comment/getcomments/` + postId,
      );
      setComments(result?.data?.comments);
      if (result?.data?.comments?.length == 0) {
        setCommentStatus(true);
      }
    }
  };

  const getBiddingDetails = async () => {
    try {
      const web3 = new Web3(
        'https://aurora-testnet.infura.io/v3/7f6f5921404842ba992a4d334431c6f7',
      );
      const contract = new web3.eth.Contract(
        contractAbi as any,
        CONTRACT_ADDRESS,
      );
      const info = await contract.methods.getLastBidInfoById(postId).call();
      let date = new Date(info[2] * 1000);
      setBiddingDate(date);
      if (info[1] == '0') {
        setBiddingPrice(postDetails?.sellValue / 10 ** 18);
      } else {
        setBiddingPrice(info[1] / 10 ** 18);
      }

      if (parseInt(info[0]) > postDetails.sellValue) {
        setPostDetails(state => ({
          ...state,
          sellValue: info[0],
        }));
      }
      setBiddingAddress(info[0]);
      setBiddingTimestamp(info[2]);
    } catch (error) {
      console.log(error)
    }
  };

  const reloadData = async () => {
    let post_id = postId;
    setPostId('0');
    setPostId(post_id);
  };

  const buy = async () => {
    if (!account) {
      alert('Connect Wallet!');
      return;
    }
    const web3 = new Web3(web3Context?.library?.currentProvider);
    const contract = new web3.eth.Contract(
      contractAbi as any,
      CONTRACT_ADDRESS,
    );

    setBuyModalStatus(true);

    contract.methods
      .buyPost(postId)
      .send({ from: account, value: postDetails.sellValue })
      .on('transactionHash', hash => {
        console.log('transaction hash: ' + hash);
      })
      .on('confirmation', async function (confirmationNumber) {
        if (confirmationNumber === 0) {
          setBuyModalStatus(false);
          reloadData();
        }
      })
      .on('error', async function (error) {
        setBuyModalStatus(false);
      });
  };

  const claimReward = async () => {
    try {
      setClaimModalStatus(true);
      const web3 = new Web3(web3Context?.library?.currentProvider);
      const contract = new web3.eth.Contract(
        contractAbi as any,
        CONTRACT_ADDRESS,
      );

      const data = await axios.post(`${SERVER_URL}/likes/getLikesHash`, {
        signature,
        userAddress: account,
        likes: likes.length,
        postId: postId,
      });

      await contract.methods
        //@ts-ignore
        .claimPostReward(
          data.data.postId,
          data.data.likesCount,
          data.data.signature,
        )
        .send({
          from: account,
        })
        .on('transactionHash', hash => {
          console.log('transaction hash: ' + hash);
        })
        .on('confirmation', confirmationNumber => {
          if (confirmationNumber === 0) {
            console.log('confirmationNumber =', confirmationNumber);
            setClaimModalStatus(false);
            getClaimableAmount();
          }
        })
        .on('error', async function (error) {
          console.log(error);
          setClaimModalStatus(false);
        });
    } catch (error) {
      console.log('error -', error);
      setClaimModalStatus(false);
    }
  };

  const changeStatus = async (status, price, bidDuration) => {
    const web3 = new Web3(web3Context?.library?.currentProvider);
    const contract = new web3.eth.Contract(
      contractAbi as any,
      CONTRACT_ADDRESS,
    );

    if (status === '2') {
      price = '1';
    }

    if (status != '' && !isNaN(parseFloat(price)) && parseFloat(price) > 0) {
      setStatusFormModalStatus(false);
      setStatusModalStatus(true);

      var date = new Date();
      date.setDate(date.getDate() + bidDuration);
      console.log('aaa', price);

      contract.methods
        .changePostInfo(
          postId,
          status,
          Web3.utils.toWei(price),
          Math.floor(date.getTime() / 1000).toString(),
        )
        .send({ from: account })
        .on('transactionHash', hash => {
          console.log('transaction hash: ' + hash);
        })
        .on('confirmation', confirmationNumber => {
          if (confirmationNumber === 0) {
            console.log('confirmationNumber =', confirmationNumber);
            setStatusModalStatus(false);
            reloadData();
          }
        })
        .on('error', async function (error) {
          setStatusModalStatus(false);
        });
    }
    // const info = await contract.methods.getLastBidInfoById(postId).call();
  };

  const getClaimableAmount = async () => {
    const web3 = new Web3(
      'https://aurora-testnet.infura.io/v3/7f6f5921404842ba992a4d334431c6f7',
    );
    const contract = new web3.eth.Contract(
      contractAbi as any,
      CONTRACT_ADDRESS,
    );
    let likesClaimed = await contract.methods.idToLikes(postId).call();
    setClaimableAmount((likes.length - parseInt(likesClaimed)) * 0.001);
  };

  const bid = async () => {
    if (!account) {
      alert('Connect Wallet!');
      return;
    }
    const web3 = new Web3(web3Context?.library?.currentProvider);
    const contract = new web3.eth.Contract(
      contractAbi as any,
      CONTRACT_ADDRESS,
    );

    if (!isNaN(bidAmmount) && bidAmmount > parseFloat(biddingPrice)) {
      setBiddingModalStatus(true);

      contract.methods
        .bid(postId)
        .send({
          from: account,
          value: web3.utils.toWei(bidAmmount.toString(), 'ether'),
        })
        .on('transactionHash', hash => {
          console.log('transaction hash: ' + hash);
        })
        .on('confirmation', async function (confirmationNumber) {
          if (confirmationNumber === 0) {
            setBiddingModalStatus(false);
            reloadData();
          }
        })
        .on('error', async function (error) {
          setBiddingModalStatus(false);
        });
    }
  };

  const claimBid = async () => {
    if (!account) {
      alert('Connect Wallet!');
      return;
    }
    const web3 = new Web3(web3Context?.library?.currentProvider);
    const contract = new web3.eth.Contract(
      contractAbi as any,
      CONTRACT_ADDRESS,
    );

    setClaimingBidModalStatus(true);

    contract.methods
      .claimBid(postId)
      .send({
        from: account,
      })
      .on('transactionHash', hash => {
        console.log('transaction hash: ' + hash);
      })
      .on('confirmation', async function (confirmationNumber) {
        if (confirmationNumber === 0) {
          setClaimingBidModalStatus(false);
          reloadData();
        }
      })
      .on('error', async function (error) {
        setClaimingBidModalStatus(false);
      });
  };

  useEffect(() => {
    setPostId(window.location.href.split('/')[4]);
  }, []);

  useEffect(() => {
    if (postId != '0') {
      getPostDetails();
      getComments();
    }
  }, [postId]);

  useEffect(() => {
    if (postDetails?.buyStatus === 1) {
      getBiddingDetails();
    }
  }, [postDetails]);

  useEffect(() => {
    if (likes.length > 0) {
      getClaimableAmount();
    }
  }, [likes]);

  return (
    <Body>
      <Header />
      <MainContainer>
        {postDetails ? (
          <MainDiv>
            <Heading
              style={{
                fontWeight: '800',
                fontSize: '25px',
                marginBottom: '10px',
              }}>
              PostId#{postId}
            </Heading>
            {postMediaType === 'image' ? (
              <PostContent
                src={
                  'https://benjaminkor2.infura-ipfs.io/ipfs/' +
                  JSON.parse(postDetails?.metaData).image
                }
              />
            ) : (
              <ReactPlayer
                url={
                  'https://benjaminkor2.infura-ipfs.io/ipfs/' +
                  JSON.parse(postDetails?.metaData).image
                }
                width={'100%'}
                height={'fit-content'}
                controls={true}
                style={{ margin: 'auto', cursor: 'pointer' }}
              />
            )}
            <Heading style={{ marginTop: '10px', fontWeight: '700' }}>
              {JSON.parse(postDetails?.metaData).name}
            </Heading>
            <Heading style={{ fontSize: '17px', marginTop: '10px' }}>
              "{JSON.parse(postDetails?.metaData).description}"
            </Heading>
            <InfoContainer>
              <InfoTab>
                <div>{likes.length}</div>
                <div style={{ fontSize: '15px', fontWeight: '500' }}>Likes</div>
              </InfoTab>
              <InfoTab>
                <div>{comments.length}</div>
                <div style={{ fontSize: '15px', fontWeight: '500' }}>
                  Comments
                </div>
              </InfoTab>
              <InfoTab>
                <div>
                  {postDetails.buyStatus == 0 ? (
                    <>{postDetails?.sellValue / 10 ** 18}</>
                  ) : postDetails.buyStatus == 1 ? (
                    <>{biddingPrice}</>
                  ) : (
                    <>NFS</>
                  )}
                </div>
                <div style={{ fontSize: '15px', fontWeight: '500' }}>
                  Value<span style={{ fontSize: '10px' }}>(ETH)</span>
                </div>
              </InfoTab>
            </InfoContainer>
            {postDetails?.owner?.address === account?.toLowerCase() ? (
              <>
                <Heading style={{ marginBottom: '10px', marginTop: '30px' }}>
                  Reward :&nbsp;
                  <span
                    style={{ fontWeight: '700', cursor: 'pointer' }}
                    title={claimableAmount + ' Social Blocks Token'}>
                    {claimableAmount + ' '}
                    &nbsp;SBT
                  </span>
                </Heading>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <a
                    href="https://testnet.aurorascan.dev/address/0xa030a24efb9348632dd17ea11294805bed482d6c"
                    target={'_blank'}
                    style={{
                      fontWeight: '700',
                      textDecoration: 'none',
                      //@ts-ignore
                      color: theme.palette.text.primary,
                    }}
                    rel="noreferrer">
                    Social Blocks Token (SBT)
                  </a>
                  &nbsp;
                  <IosShareIcon
                    style={{ transform: 'rotate(90deg)' }}
                    onClick={() => {
                      window.open(
                        'https://testnet.aurorascan.dev/address/0xa030a24efb9348632dd17ea11294805bed482d6c',
                        '_blank',
                      );
                    }}
                  />
                </div>
                <Button
                  onClick={() => claimReward()}
                  style={{ marginTop: '25px' }}>
                  Claim Reward
                </Button>
              </>
            ) : null}
            <Heading style={{ textAlign: 'left' }}>Creator :</Heading>
            <Profile
              userName={postDetails?.creator?.userName}
              displayName={postDetails?.creator?.displayName}
              image={postDetails?.creator?.image}
              address={postDetails?.creator?.address}
            />
            <Heading style={{ textAlign: 'left' }}>Owner :</Heading>
            <Profile
              userName={postDetails?.owner?.userName}
              displayName={postDetails?.owner?.displayName}
              image={postDetails?.owner?.image}
              address={postDetails?.owner?.address}
            />
            <Heading
              style={{
                textAlign: 'left',
                marginBottom: '0px',
              }}>
              Status :
            </Heading>
            <Heading
              style={{
                textAlign: 'left',
                fontSize: '30px',
                marginTop: '0px',
                fontWeight: '700',
              }}>
              &#8226; &nbsp;
              {postDetails?.buyStatus === 0
                ? 'Buyable.'
                : postDetails?.buyStatus === 1
                ? 'Biddable.'
                : 'Not for sale.'}
            </Heading>
            {
              // buy status is buyable
              postDetails?.buyStatus === 0 ? (
                <>
                  <Heading
                    style={{
                      textAlign: 'left',
                      marginBottom: '0px',
                    }}>
                    Value :
                  </Heading>
                  <Heading
                    style={{
                      textAlign: 'left',
                      fontSize: '30px',
                      fontWeight: '700',
                    }}>
                    {postDetails.buyStatus == 0 ? (
                      <>&#8226; {postDetails?.sellValue / 10 ** 18} ETH</>
                    ) : postDetails.buyStatus == 1 ? (
                      <>&#8226; {postDetails?.sellValue / 10 ** 18} ETH</>
                    ) : (
                      <>&#8226; Not For Sale.</>
                    )}
                  </Heading>

                  {postDetails.owner.address === account?.toLowerCase() ? (
                    <Button
                      style={{ marginTop: '25px' }}
                      onClick={() => {
                        setStatusFormModalStatus(true);
                      }}>
                      Change Status &#38; Price
                    </Button>
                  ) : (
                    <Button
                      style={{ marginTop: '25px' }}
                      onClick={() => {
                        buy();
                      }}>
                      Buy
                    </Button>
                  )}
                </>
              ) : // buy status is bidding
              postDetails?.buyStatus === 1 ? (
                <>
                  <Heading
                    style={{
                      marginTop: '10px',
                      textAlign: 'left',
                      marginBottom: '0px',
                    }}>
                    Bidding Ends :
                  </Heading>
                  <Heading
                    style={{
                      textAlign: 'left',
                      fontSize: '30px',
                      marginTop: '0px',
                      fontWeight: '700',
                    }}>
                      {/* {console.log("biddingDate",biddingDate)} */}
                    &#8226; {biddingDate && biddingDate.toDateString()}
                    &nbsp; <br />
                    &nbsp; &nbsp;
                    <span style={{ fontSize: '25px', lineHeight: '10px' }}>
                      @&nbsp;{biddingDate && biddingDate.getHours() + 'h : '}
                      {biddingDate && biddingDate.getHours() + 'm : '}
                      {biddingDate && biddingDate.getSeconds() + 's'}&nbsp;
                    </span>
                  </Heading>
                  <Heading
                    style={{
                      marginTop: '10px',
                      textAlign: 'left',
                      marginBottom: '0px',
                    }}>
                    Last Bid :
                  </Heading>
                  <Heading
                    style={{
                      textAlign: 'left',
                      fontSize: '30px',
                      marginTop: '0px',
                      fontWeight: '700',
                    }}>
                    &#8226; {biddingPrice} ETH
                  </Heading>
                  <Heading
                    style={{
                      marginTop: '10px',
                      textAlign: 'left',
                      marginBottom: '0px',
                    }}>
                    Last Bidder :
                  </Heading>
                  <Heading
                    style={{
                      textAlign: 'left',
                      fontSize: '30px',
                      marginTop: '0px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      navigate(
                        `/profile/${
                          biddingAddress !==
                          '0x0000000000000000000000000000000000000000'
                            ? biddingAddress
                            : postDetails.owner.address
                        }`,
                      );
                    }}>
                    &#8226;
                    {biddingAddress ===
                    '0x0000000000000000000000000000000000000000'
                      ? postDetails.owner.address.slice(0, 7) +
                        '...' +
                        postDetails.owner.address.slice(35, 43)
                      : biddingAddress.slice(0, 7) +
                        '...' +
                        biddingAddress.slice(35, 43)}
                  </Heading>

                  {postDetails.owner.address !== account?.toLowerCase() ? (
                    <>
                      <Heading
                        style={{
                          marginTop: '10px',
                          textAlign: 'left',
                          marginBottom: '0px',
                        }}>
                        Your Bid (ETH) :
                      </Heading>
                      <Input
                        placeholder="Enter amount"
                        type={'number'}
                        style={{ marginTop: '10px' }}
                        onChange={e => {
                          setBidAmount(parseFloat(e.target.value));
                        }}
                      />
                      <Button
                        style={{ marginTop: '25px' }}
                        onClick={() => {
                          bid();
                        }}>
                        Bid
                      </Button>
                    </>
                  ) : Math.floor(Date.now() / 1000) >
                    parseInt(biddingTimestamp) ? (
                    <Button
                      style={{ marginTop: '25px' }}
                      onClick={() => {
                        claimBid();
                      }}>
                      Claim Bid
                    </Button>
                  ) : (
                    <Button style={{ marginTop: '25px', opacity: '0.3' }}>
                      Claim Bid
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {postDetails.owner.address === account?.toLowerCase() ? (
                    <Button
                      style={{ marginTop: '25px' }}
                      onClick={() => {
                        setStatusFormModalStatus(true);
                      }}>
                      Change Status &#38; Price
                    </Button>
                  ) : null}
                </>
              )
            }
            <br />
            <Heading
              style={{
                marginTop: '10px',
                textAlign: 'left',
                marginBottom: '0px',
              }}>
              Transfer history :
            </Heading>
            <HorizontalSlider>
              <div>
                <Ring />
              </div>

              <div>
                <HorizontalDivider />
              </div>

              {transferHistory.map(e => {
                return (
                  <>
                    <User
                      userName={e?.userName}
                      displayName={e?.displayName}
                      image={e?.image}
                      address={e?.address}
                    />
                    <div>
                      <HorizontalDivider />
                    </div>
                  </>
                );
              })}

              <div>
                <Ring />
              </div>
            </HorizontalSlider>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Heading
                style={{
                  marginTop: '10px',
                  textAlign: 'left',
                  marginBottom: '0px',
                }}>
                Comments :
              </Heading>
              <Heading
                style={{
                  marginTop: '10px',
                  textAlign: 'left',
                  marginBottom: '0px',
                  marginLeft: 'auto',
                  cursor: 'pointer',
                  fontSize: '30px',
                }}
                onClick={() => {
                  setCommentStatus(!commentStatus);
                }}>
                {commentStatus ? '-' : '+'}
              </Heading>
            </div>
            {commentStatus ? (
              <>
                <TextArea
                  placeholder="Enter your comment..."
                  style={{ marginTop: '10px' }}
                  value={commentText}
                  onChange={e => {
                    setCommentText(e.target.value);
                  }}
                />
                <Button
                  style={{ marginTop: '15px' }}
                  onClick={() => {
                    setComment();
                  }}>
                  Comment
                </Button>
              </>
            ) : null}
            {comments.length > 0 ? (
              comments.map((comment, i) => {
                return (
                  <CommentBody key={i}>
                    <CommentText>{comment.comment}</CommentText>
                    <CommentUser
                      onClick={() =>
                        navigate(`/profile/${comment.userAddress}`)
                      }>
                      @{comment.userName}
                    </CommentUser>
                  </CommentBody>
                );
              })
            ) : (
              <Heading
                style={{
                  textAlign: 'left',
                  fontSize: '30px',
                  marginTop: '0px',
                  fontWeight: '700',
                }}>
                &#8226; No Comments.
              </Heading>
            )}
            <CustomModal open={commentingModalStatus} handleClose={() => {}}>
              <Loader />
              <div style={{ width: '100%', height: '30px' }} />
              <Heading>Adding Comment</Heading>
            </CustomModal>
            <CustomModal open={buyModalStatus} handleClose={() => {}}>
              <Loader />
              <div style={{ width: '100%', height: '30px' }} />
              <Heading>Buying Post</Heading>
            </CustomModal>
            <CustomModal open={claimModalStatus} handleClose={() => {}}>
              <Loader />
              <div style={{ width: '100%', height: '30px' }} />
              <Heading>Claming Reward</Heading>
            </CustomModal>
            <CustomFormModal
              open={statusFormModalStatus}
              handleClose={() => {
                setStatusFormModalStatus(false);
              }}>
              <ChangeStatusModal
                title={JSON.parse(postDetails?.metaData)?.name}
                description={JSON.parse(postDetails?.metaData)?.description}
                changeStatus={changeStatus}
              />
            </CustomFormModal>
            <CustomModal open={statusModalStatus} handleClose={() => {}}>
              <Loader />
              <div style={{ width: '100%', height: '30px' }} />
              <Heading>Changing Status</Heading>
            </CustomModal>
            <CustomModal open={biddingModalStatus} handleClose={() => {}}>
              <Loader />
              <div style={{ width: '100%', height: '30px' }} />
              <Heading>Bidding</Heading>
            </CustomModal>
            <CustomModal open={claimingBidModalStatus} handleClose={() => {}}>
              <Loader />
              <div style={{ width: '100%', height: '30px' }} />
              <Heading>Claming</Heading>
            </CustomModal>
            <CustomModal
              open={loadDataModalStatus}
              handleClose={() => {
                setLoadDataModalStatus(false);
              }}>
              <Loader />
              <div style={{ width: '100%', height: '30px' }} />
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
                </span>{' '}
                this Modal.
              </Heading>
            </CustomModal>
          </MainDiv>
        ) : (
          <MainDiv>
            <PostDetailsSkeleton />
          </MainDiv>
        )}
        <AdDiv>
          <Ad />
          <Ad />
          {/* <Ad /> */}
        </AdDiv>
        <SuggestionsDiv>
          <TopCreator />
          <UpcomingFeatures />
          {/* <Ad /> */}
        </SuggestionsDiv>
      </MainContainer>
    </Body>
  );
};

export default PostDetail;
