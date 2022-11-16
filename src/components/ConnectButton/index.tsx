import * as React from 'react';
import Button from '../Button/index';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useWeb3React } from '@web3-react/core';
import { useNavigate } from 'react-router-dom';
import { conciseWalletAddress } from '../../utils/formattingFunctions';
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import { chainChangeRequest } from '../../utils';

type Props = {
  connectMetamask: () => any;
};

export default function ConnectButton(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { active, account, deactivate } = useWeb3React();
  const navigate = useNavigate();

  const btnRef = React.useRef();

  const theme = useTheme();
  //@ts-ignore
  const isMobile = useMediaQuery(theme?.breakpoints?.down('sm'));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('called');

    if (active && account) {
      setAnchorEl(event.currentTarget);
    } else {
      // props.connectMetamask();
      chainChangeRequest('0x4e454153', props.connectMetamask);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ width: 'fit-content' }}>
      <Button
        onClick={handleClick}
        style={{ margin: '0px' }}
        //@ts-ignore
        ref={btnRef}>
        {active && account
          ? conciseWalletAddress(account)
          : isMobile
          ? 'Connect'
          : 'Connect Wallet'}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <MenuItem
          onClick={() => {
            navigate(`/profile/${account}`);
          }}
          sx={{
            fontSize: '17px',
            //@ts-ignore
            width: btnRef?.current?.offsetWidth,
            fontFamily: 'Poppins',
          }}>
          <AccountBoxIcon style={{ height: '20px' }} />
          &nbsp; Profile
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>Change Wallet</MenuItem> */}
        <MenuItem
          onClick={() => {
            deactivate();
            navigate(`/home`);
          }}
          sx={{ fontSize: '17px', fontFamily: 'Poppins' }}>
          <LogoutIcon style={{ height: '20px' }} />
          &nbsp; Disconnect
        </MenuItem>
      </Menu>
    </div>
  );
}
