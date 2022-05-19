import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import style from './Login.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

function Login() {
    let navigate = useNavigate();

    const [loginInput, setLoginInput] = useState({
        email: '',
        password: '',
        error_list: [],
    });

    useEffect(() => {
        if (localStorage.getItem('auth_token')) {
            navigate('/');
        }
    }, [navigate]);

    const handleInput = (e) => {
        e.persist();
        setLoginInput({
            ...loginInput,
            [e.target.name]: e.target.value,
        });
    };

    const loginSubmit = (e) => {
        e.preventDefault();

        const data = {
            email: loginInput.email,
            password: loginInput.password,
        };

        axios.get(`/sanctum/csrf-cookie`).then((response) => {
            axios.post(`/api/login`, data).then((res) => {
                if (res.data.status === 200) {
                    localStorage.setItem('auth_token', res.data.token);
                    localStorage.setItem('auth_name', res.data.username);
                    Swal.fire({
                        icon: 'success',
                        text: res.data.message,
                    });
                    navigate('/');
                } else if (res.data.status === 401) {
                    Swal.fire({
                        icon: 'warning',
                        text: res.data.message,
                    });
                } else {
                    setLoginInput({
                        ...loginInput,
                        error_list: res.data.validation_errors,
                    });
                }
            });
        });
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h4>Login</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={loginSubmit}>
                                <div className="form-group mb-3">
                                    <label>Email</label>
                                    <input
                                        type=""
                                        name="email"
                                        onChange={(e) => handleInput(e)}
                                        className="form-control"
                                        autocomplete="off"
                                        value={loginInput.email}
                                    />
                                    <span>{loginInput.error_list.email}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={(e) => handleInput(e)}
                                        className="form-control"
                                        value={loginInput.password}
                                    />
                                    <span>{loginInput.error_list.password}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <button type="submit" className="btn btn-primary">
                                        Login
                                    </button>
                                    <button type="button" className="btn btn-secondary">
                                        <Link to="/register">Register</Link>
                                    </button>
                                    <Link className={cx('back-btn')} to="/">
                                        Go back ?
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
