import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import style from './ViewRestaurant.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

function ViewRestaurant() {
    const url = useParams();
    let navigate = useNavigate();

    const [restaurant, setRestaurant] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        img: '',
        description: '',
        loading: true,
    });

    useEffect(() => {
        axios
            .get(`api/restaurant/${url.id}`)
            .then((res) => {
                if (res.data.status === 200) {
                    setRestaurant({
                        name: res.data.restaurant.name,
                        userName: res.data.restaurant.userName,
                        address: res.data.restaurant.address,
                        phoneNumber: res.data.restaurant.phoneNumber,
                        img: res.data.restaurant.img,
                        description: res.data.restaurant.description,
                        loading: false,
                    });
                } else if (res.data.status === 404) {
                    Swal.fire({
                        icon: 'warning',
                        text: res.data.message,
                    });
                    navigate('/');
                }
            })
            .catch((err) => console.log(err));
    }, [url.id, navigate]);

    let HTMLRestaurant = '';
    if (restaurant.loading) {
        HTMLRestaurant = (
            <div className="row justify-content-center">
                <h1 className="d-flex justify-content-evenly ">Loading...</h1>
            </div>
        );
    } else {
        HTMLRestaurant = (
            <div className="container shadow p-3 mb-5 bg-body rounded" style={{ marginTop: 'px' }}>
                <div className="row">
                    <div className="col-4 text-center">
                        <img
                            className="shadow mb-5 bg-body rounded"
                            src={restaurant.img}
                            alt="..."
                            height="400px"
                            width="400px"
                        />
                    </div>
                    <div className="col-8">
                        <h2 className={cx('name')}>{restaurant.name}</h2>
                        <ul className={cx('information-list')} style={{ paddingLeft: 0 }}>
                            <li>
                                <span>
                                    <i class="fa-solid fa-user-pen"></i>
                                    <span>
                                        {' '}
                                        Shared by <span className={cx('user-name')}>{restaurant.userName}</span>
                                    </span>
                                </span>
                            </li>
                            <li>
                                <span>
                                    <i className="fa-solid fa-location-dot"></i> <span> {restaurant.address} </span>
                                </span>
                            </li>
                            <li>
                                <span>
                                    <i className="fa-solid fa-phone"></i>{' '}
                                    <a href="tel:{restaurant.phoneNumber}">{restaurant.phoneNumber}</a>
                                </span>
                            </li>
                        </ul>
                        <hr />
                        <div>
                            <p className={cx('description')}>{restaurant.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '80px', marginBottom: '50px' }}>
            {HTMLRestaurant}
        </div>
    );
}

export default ViewRestaurant;
