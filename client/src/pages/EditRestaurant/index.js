import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function EditRestaurant() {
    let navigate = useNavigate();
    const url = useParams();

    const [input, setInput] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        img: {},
        imgPreview: '',
        description: '',
        errorList: [],
        loading: true,
    });

    useEffect(() => {
        if (!localStorage.getItem('auth_token')) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You havent logged in yet!',
            });
            navigate('/');
        }
        //Get Data before Edit
        axios.get(`/sanctum/csrf-cookie`).then((response) => {
            axios.get(`/api/edit-restaurant/${url.id}`).then((res) => {
                if (res.data.status === 200) {
                    setInput({
                        name: res.data.restaurant.name,
                        address: res.data.restaurant.address,
                        phoneNumber: res.data.restaurant.phoneNumber,
                        img: res.data.restaurant.img,
                        imgPreview: res.data.restaurant.img,
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
            });
        });
    }, [url.id, navigate]);

    const handleInput = (e) => {
        if (e.target.name === 'img') {
            setInput({
                ...input,
                [e.target.name]: e.target.files[0],
                imgPreview: URL.createObjectURL(e.target.files[0]),
            });
        } else {
            setInput({
                ...input,
                [e.target.name]: e.target.value,
            });
        }
    };

    const updateRestaurant = (e) => {
        e.preventDefault();

        const fData = new FormData();
        fData.append('img', input.img);
        fData.append('name', input.name);
        fData.append('address', input.address);
        fData.append('phoneNumber', input.phoneNumber);
        fData.append('description', input.description);
        fData.append('_method', 'put');

        axios.get(`/sanctum/csrf-cookie`).then((response) => {
            axios.post(`/api/edit-restaurant/${url.id}`, fData).then((res) => {
                if (res.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        text: res.data.message,
                    });
                    navigate('/dashboard');
                } else {
                    setInput({
                        ...input,
                        errorList: res.data.validation_errors,
                    });
                }
            });
        });
    };

    let HTMLData = '';
    if (input.loading === true) {
        HTMLData = <h1>Loading...</h1>;
    } else {
        HTMLData = (
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4>
                                Edit Restaurant
                                <Link to={'/dashboard'} className="btn btn-primary btn-sm float-end">
                                    Back
                                </Link>
                            </h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={updateRestaurant}>
                                <div className="form-group mb-3">
                                    <label>Restaurant Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={input.name}
                                        className="form-control"
                                        onChange={(e) => handleInput(e)}
                                    />
                                    {/* <span className="text-danger">{input.errorList.name}</span> */}
                                </div>
                                <div className="form-group mb-3">
                                    <label>Restaurant Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={input.address}
                                        className="form-control"
                                        onChange={(e) => handleInput(e)}
                                    />
                                    {/* <span className="text-danger">{input.errorList.address}</span> */}
                                </div>
                                <div className="form-group mb-3">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={input.phoneNumber}
                                        className="form-control"
                                        onChange={(e) => handleInput(e)}
                                    />
                                    {/* <span className="text-danger">{input.errorList.phoneNumber}</span> */}
                                </div>
                                <div className="form-group mb-3">
                                    <label>Pictures</label>
                                    <input
                                        id="imgInput"
                                        type="file"
                                        name="img"
                                        className="form-control"
                                        onChange={(e) => handleInput(e)}
                                    />
                                    {/* <span className="text-danger">{input.errorList.img}</span> */}
                                    {input.imgPreview && (
                                        <img
                                            id="preview"
                                            src={input.imgPreview}
                                            alt="..."
                                            height="200px"
                                            width="200px"
                                            style={{ paddingTop: '10px' }}
                                        />
                                    )}
                                </div>
                                <div className="form-group mb-3">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={input.description}
                                        className="form-control"
                                        onChange={(e) => handleInput(e)}
                                    />
                                    {/* <span className="text-danger">{input.errorList.description}</span> */}
                                </div>
                                <div className="form-group mb-3">
                                    <button type="submit" className="btn btn-primary">
                                        Save Restaurant
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '80px' }}>
            {HTMLData}
        </div>
    );
}

export default EditRestaurant;
