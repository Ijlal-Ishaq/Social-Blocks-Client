import { FC, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { create } from 'ipfs-http-client';

import FieldFileInput, { CustomFile } from '../../components/FieldFileInput';
import Button from '../../components/Button';
import CustomModal from '../../components/CustomModal';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { CONTRACT_ADDRESS } from '../../contract/constants';
import contractAbi from '../../contract/contractAbi.json';
import { SERVER_URL } from '../../utils/constants';
import axios from 'axios';

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
  height: 'fit-content',
  margin: '60px auto',
  backgroundColor: theme.palette.background.paper,
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  borderRadius: '9px',
  boxShadow: '0 0 1rem 0 ' + alpha('#000', 0.2),
  padding: '30px 20px',

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
    width: '90%',
    padding: '15px',
    marginTop: '50px',

    '::-webkit-scrollbar': {
      width: '13px',
      background: alpha(theme.palette.primary.main, 0.1),
      display: 'none',
    },
  },
}));

const Label = styled('div')(({ theme }) => ({
  fontSize: '17px',
  fontWeight: '500',
  color: theme.palette.text.primary,
  textAlign: 'left',
  width: '100%',
  marginTop: '10px',
  marginBottom: '3px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const Input = styled('input')(({ theme }) => ({
  fontSize: '17px',
  fontWeight: '400',
  color: theme.palette.text.primary,
  margin: '5px 0px',
  marginTop: '0px',
  padding: '7px 14px',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  borderRadius: '5px',
  marginBottom: '0px',

  ':focus': {
    outline: 'none',
  },
}));

const TextArea = styled('textarea')(({ theme }) => ({
  fontSize: '17px',
  fontWeight: '400',
  color: theme.palette.text.primary,
  margin: '5px 0px',
  marginTop: '0px',
  padding: '7px 14px',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
  borderRadius: '5px',
  overflowY: 'auto',
  resize: 'vertical',
  minHeight: '100px',
  marginBottom: '0px',

  '::-webkit-scrollbar': {
    width: '5px',
    background: alpha(theme.palette.primary.main, 0.1),
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '5px',
    background: theme.palette.primary.main,
  },
}));

const Heading = styled('div')(({ theme }) => ({
  fontSize: '25px',
  fontWeight: '700',
  color: theme.palette.text.primary,
  textAlign: 'center',
  marginBottom: '15px',
}));

const RadioIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 20,
  height: 20,
  border: 'solid 2px ' + theme.palette.text.primary,
  margin: '4px',
}));

const RadioCheckIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 20,
  height: 20,
  backgroundColor: theme.palette.primary.main,
  border: 'solid 2px ' + theme.palette.text.primary,
  margin: '4px',
}));

interface PreviewImageParams {
  src: string;
  height: number;
  width: number;
}

const Index: FC = () => {
  const [previewImage] = useState<PreviewImageParams | null>(null);
  const [titleValue, setTitleValue] = useState<string>('');
  const [descValue, setDescValue] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<CustomFile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState('2');
  const [price, setPrice] = useState('');
  const theme = useTheme();
  const [bidDuration, setBidDuration] = useState<number>(1);
  const [modalText] = useState<string>('Creating Post');
  const web3Context = useWeb3React();

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus((event.target as HTMLInputElement).value);
  };

  const navigate = useNavigate();

  const uploadFileAndCreatePost = async () => {
    try {
      if (status === '2') {
        setPrice('0');
      }
      if (
        selectedFile &&
        !isNaN(parseInt(price)) &&
        titleValue !== '' &&
        descValue !== ''
      ) {
        setLoading(true);

        const arrayBuffer = await selectedFile.arrayBuffer();
        const mediaType = selectedFile.type.split('/')[0];

        const projectId = '2DFPFIAaXx9w2afULnEiEsSk6VF';
        const projectSecret = '9efe90a3f717625277f8464bc47952f1';

        const auth =
          'Basic ' +
          Buffer.from(projectId + ':' + projectSecret).toString('base64');

        const options = {
          host: 'ipfs.infura.io',
          port: 5001,
          protocol: 'https',
          headers: {
            authorization: auth,
          },
        };

        const client = create(options); //create("https://ipfs.infura.io:5001/api/v0");

        const result = await client.add({
          path: 'socialblocks',
          content: arrayBuffer,
        });

        let URI_Obj = {
          name: titleValue,
          description: descValue,
          image: result.cid.toString(),
        };
        let URI = await client.add(JSON.stringify(URI_Obj));

        const web3 = new Web3(web3Context?.library?.currentProvider);
        const contract = new web3.eth.Contract(
          contractAbi as any,
          CONTRACT_ADDRESS,
        );

        const maxTokenId = await contract.methods.maxTokenId().call();

        await axios.post(`${SERVER_URL}/type/setType`, {
          postId: maxTokenId,
          type: mediaType,
        });

        var date = new Date();
        date.setDate(date.getDate() + bidDuration);

        contract.methods
          .mint(
            status,
            Web3.utils.toWei(price),
            Math.floor(date.getTime() / 1000).toString(),
            URI.cid.toString(),
            JSON.stringify(URI_Obj),
          )
          .send({
            from: web3Context.account,
          })
          .on('transactionHash', async hash => {
            // console.log("hash 0", hash);
          })
          .on('error', () => {
            // console.log("hash 0", hash);
            setLoading(false);
          })
          .on('confirmation', function (confirmationNumber) {
            if (confirmationNumber === 0) {
              navigate('/home');
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Body>
      <MainDiv>
        <Heading>Create Post</Heading>
        <Label>Content :</Label>
        <div style={{ height: 'fit-content' }}>
          <FieldFileInput onFileSelect={setSelectedFile} />
        </div>
        <Label>
          Title :
          <span style={{ fontSize: '10px' }}>
            <span
              style={{ color: theme.palette.primary.main, fontSize: '13px' }}>
              *
            </span>
            (title must not exceed 15 characters.)
          </span>
        </Label>
        <Input
          placeholder="Enter title."
          value={titleValue}
          onChange={e => setTitleValue(e.target.value)}
          maxLength={15}
        />
        <Label>Description :</Label>
        <TextArea
          placeholder="Enter description."
          value={descValue}
          onChange={e => setDescValue(e.target.value)}
        />
        <Label>Status :</Label>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={status}
          onChange={handleStatusChange}>
          <FormControlLabel
            value="2"
            control={
              <Radio
                icon={<RadioIcon />}
                checkedIcon={<RadioCheckIcon />}
                sx={{
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                  //@ts-ignore
                  color: theme.palette.text.primary,
                  '&.Mui-checked': {
                    //@ts-ignore
                    color: theme.palette.primary.main,
                  },
                }}
                disableRipple
              />
            }
            sx={{ fontFamily: 'Poppins' }}
            label="Not For Sale"
          />
          <FormControlLabel
            value="1"
            control={
              <Radio
                icon={<RadioIcon />}
                checkedIcon={<RadioCheckIcon />}
                sx={{
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                  //@ts-ignore
                  color: theme.palette.text.primary,
                  '&.Mui-checked': {
                    //@ts-ignore
                    color: theme.palette.primary.main,
                  },
                }}
                disableRipple
              />
            }
            label="Biddable"
          />
          <FormControlLabel
            value="0"
            control={
              <Radio
                icon={<RadioIcon />}
                checkedIcon={<RadioCheckIcon />}
                sx={{
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                  //@ts-ignore
                  color: theme.palette.text.primary,
                  '&.Mui-checked': {
                    //@ts-ignore
                    color: theme.palette.primary.main,
                  },
                }}
                disableRipple
              />
            }
            label="Buyable"
          />
        </RadioGroup>
        {status === '0' && (
          <>
            <Label>Price (Matic) :</Label>
            <Input
              placeholder="Enter price."
              value={price}
              onChange={e => setPrice(e.target.value)}
              type="number"
              min={0}
            />
          </>
        )}
        {status === '1' && (
          <>
            <Label>Base Price (Matic) :</Label>
            <Input
              placeholder="Enter base price."
              value={price}
              onChange={e => setPrice(e.target.value)}
              type="number"
              min={0}
            />
            <Label>
              Bidding Duration (days) :
              <span style={{ fontSize: '10px' }}>
                <span
                  style={{
                    color: theme.palette.primary.main,
                    fontSize: '13px',
                  }}>
                  *
                </span>
                (minimum duration 1 day.)
              </span>
            </Label>

            <Input
              placeholder="Bidding duration in days."
              value={bidDuration ? bidDuration : 0}
              onChange={e => setBidDuration(parseInt(e.target.value))}
              type="number"
              min={1}
            />
          </>
        )}
        <Button
          disabled={Boolean(previewImage)}
          style={{ width: '100%', marginTop: '25px', marginBottom: '0px' }}
          onClick={() => uploadFileAndCreatePost()}>
          Create Post
        </Button>
        <CustomModal open={loading} handleClose={() => {}}>
          <Loader />
          <div style={{ width: '100%', height: '30px' }} />
          <Heading>{modalText}</Heading>
        </CustomModal>
      </MainDiv>
    </Body>
  );
};

export default Index;
