import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import style from './Home.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

function Home() {
    const [list, setList] = useState({
        restaurants: [],
        loading: true,
    });

    useEffect(() => {
        axios
            .get(`/api/restaurants`)
            .then((res) =>
                setList({
                    restaurants: res.data.restaurants,
                    loading: false,
                }),
            )
            .catch((err) => console.log(err));
    }, []);

    var HTMLList = '';
    if (list.loading) {
        HTMLList = (
            <div className="row justify-content-center">
                <h1 className="d-flex justify-content-evenly ">Loading...</h1>
            </div>
        );
    } else {
        HTMLList = (
            <div className="row row-cols-4 g-4">
                {list.restaurants.map((item, index) => {
                    return (
                        <div key={index} className="col">
                            <div className="card" style={{ height: '100%', position: 'relative' }}>
                                <img className={cx('item-img')} src={`${item.img}`} alt="..." height="271px" />
                                <div className="card-body" style={{ minHeight: '200px', minWidth: '160px' }}>
                                    <h5 className={cx('card-title', 'name-text')}>{item.name}</h5>
                                    <p className={cx('card-text', 'address-text')}>
                                        <i class="fa-solid fa-location-dot"></i>
                                        <span> {item.address}</span>
                                    </p>
                                    <p className={cx('card-text', 'address-text')}>
                                        <span>
                                            <i class="fa-solid fa-user-pen"></i>
                                            <span>
                                                {' '}
                                                Shared by <span className={cx('user-name')}>{item.userName}</span>
                                            </span>
                                        </span>
                                    </p>
                                    <Link
                                        to={`/restaurant/${item.id}`}
                                        className={cx('btn btn-primary', 'explore-btn')}
                                    >
                                        Explore
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '80px', marginBottom: '50px' }}>
            {HTMLList}
        </div>
    );
}

export default Home;
