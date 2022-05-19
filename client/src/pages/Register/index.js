import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import style from './Register.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

function Register() {
    let navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('auth_token')) {
            navigate('/');
        }
    }, [navigate]);

    const [registerInput, setRegisterInput] = useState({
        name: '',
        email: '',
        password: '',
        error_list: [],
    });

    const handleInput = (e) => {
        e.persist();
        setRegisterInput({
            ...registerInput,
            [e.target.name]: e.target.value,
        });
    };

    const registerSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: registerInput.name,
            email: registerInput.email,
            password: registerInput.password,
        };

        axios.get(`/sanctum/csrf-cookie`).then((response) => {
            axios.post(`/api/register`, data).then((res) => {
                if (res.data.status === 200) {
                    localStorage.setItem('auth_token', res.data.token);
                    localStorage.setItem('auth_name', res.data.username);
                    Swal.fire({
                        icon: 'success',
                        text: res.data.message,
                    });
                    navigate('/');
                } else {
                    setRegisterInput({
                        ...registerInput,
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
                            <h4>Register</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={registerSubmit}>
                                <div className="form-group mb-3">
                                    <label>Username</label>
                                    <input
                                        type=""
                                        name="name"
                                        onChange={(e) => handleInput(e)}
                                        value={registerInput.name}
                                        autocomplete="off"
                                        className="form-control"
                                    />
                                    <span>{registerInput.error_list.name}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Email</label>
                                    <input
                                        type=""
                                        name="email"
                                        autocomplete="off"
                                        onChange={(e) => handleInput(e)}
                                        value={registerInput.email}
                                        className="form-control"
                                    />
                                    <span>{registerInput.error_list.email}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={(e) => handleInput(e)}
                                        value={registerInput.password}
                                        className="form-control"
                                    />
                                    <span>{registerInput.error_list.password}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <button type="submit" className="btn btn-primary">
                                        Register
                                    </button>
                                    <Link className={cx('back-btn')} to="/login">
                                        You have account ?
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

export default Register;
