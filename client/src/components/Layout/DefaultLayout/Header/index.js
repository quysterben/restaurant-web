import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const cx = classNames.bind(styles);

function Header() {
    let navigate = useNavigate();

    const [authBox, setAuthBox] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();

        axios.post(`/api/logout`).then((res) => {
            if (res.data.status === 200) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_name');
                Swal.fire({
                    icon: 'success',
                    text: res.data.message,
                });
                navigate('/');
            }
        });
    };

    var auth = '';
    if (!localStorage.getItem('auth_token')) {
        auth = (
            <>
                <Link className={cx('auth-item')} to="/login">
                    <i class="fa-solid fa-right-to-bracket"></i>
                    <span> Login</span>
                </Link>
                <Link className={cx('auth-item')} to="/register">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span> Register</span>
                </Link>
            </>
        );
    } else {
        auth = (
            <>
                <div className={cx('auth-item')}>
                    <i className="fa-solid fa-user"></i>
                    <span> {localStorage.getItem('auth_name')}</span>
                </div>
                <div className={cx('auth-item')}>
                    <button onClick={(e) => handleLogout(e)} className={cx('logout-btn')}>
                        <i class="fa-solid fa-power-off"></i>
                        <span> Logout</span>
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <nav className={cx('nav')}>
                <div className={cx('navContent')}>
                    <img className={cx('navLogo')} src="logo.jpg" alt="..." />
                    <ul className={cx('navLink')}>
                        <li>
                            <Link to="/" className={cx('routeLink')}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className={cx('routeLink')}>
                                Dashboard
                            </Link>
                        </li>
                        <li>About</li>
                        <li>Blog</li>
                        <li>Contact</li>
                    </ul>
                </div>

                <button
                    onClick={(e) => {
                        setAuthBox(!authBox);
                    }}
                    className={cx('navSearchBtn')}
                >
                    <Tippy
                        disabled={false}
                        visible={authBox}
                        render={(attrs) => (
                            <div className={cx('auth-box')} tabIndex="-1" {...attrs}>
                                {auth}
                            </div>
                        )}
                    >
                        <i className="fa-solid fa-bars"></i>
                    </Tippy>
                </button>
            </nav>
        </>
    );
}

export default Header;
