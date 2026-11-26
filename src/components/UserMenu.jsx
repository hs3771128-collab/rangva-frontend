import { Avatar, Menu, MenuItem } from '@mui/material';
import React from 'react'
import { FaHeart, FaHome, FaShoppingCart, FaUserShield } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import BackDrop from './BackDrop';
import { logOutUser } from '../store/actions';

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user && user?.roles?.includes("ROLE_SELLER");

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const logOutHandler = () => {
        handleClose();
        dispatch(logOutUser(navigate));
    };

    return (
        <div className='relative z-30'>
            <div
                className='flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition'
                onClick={handleClick}
            >
                <Avatar
                    alt={user?.username}
                    sx={{ width: 34, height: 34, bgcolor: '#C05B45', fontSize: 14 }}
                >
                    {user?.username?.slice(0, 1).toUpperCase()}
                </Avatar>
            </div>

            <Menu
                className='mt-6'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{ list: { sx: { width: 190, py: 1 } } }}
            >
                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                    <span className='font-semibold text-[13px] text-ink'>
                        {user?.username}
                    </span>
                </MenuItem>

                <Link to="/">
                    <MenuItem className="flex gap-2" onClick={handleClose}>
                        <FaHome className='text-[15px]' />
                        <span className='font-medium text-[13px]'>Home</span>
                    </MenuItem>
                </Link>

                <Link to="/wishlist">
                    <MenuItem className="flex gap-2" onClick={handleClose}>
                        <FaHeart className='text-[14px] text-terra' />
                        <span className='font-medium text-[13px]'>Wishlist</span>
                    </MenuItem>
                </Link>

                <Link to="/cart">
                    <MenuItem className="flex gap-2" onClick={handleClose}>
                        <FaShoppingCart className='text-[14px]' />
                        <span className='font-medium text-[13px]'>Cart</span>
                    </MenuItem>
                </Link>

                {(isAdmin || isSeller) && (
                    <Link to={isAdmin ? "/admin" : "/seller"}>
                        <MenuItem className="flex gap-2" onClick={handleClose}>
                            <FaUserShield className='text-[14px]' />
                            <span className='font-medium text-[13px]'>
                                {isAdmin ? "Admin panel" : "Seller panel"}
                            </span>
                        </MenuItem>
                    </Link>
                )}

                <MenuItem onClick={logOutHandler} className="flex gap-2">
                    <div className='w-full flex gap-2 items-center bg-ink text-white px-3 py-1.5 rounded-md'>
                        <IoExitOutline className='text-[16px]' />
                        <span className='font-semibold text-[13px]'>Logout</span>
                    </div>
                </MenuItem>
            </Menu>

            {open && <BackDrop />}
        </div>
    );
}

export default UserMenu;
