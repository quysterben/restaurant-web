import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AddRestaurant() {
    let navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('auth_token')) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You havent logged in yet!',
            });
            navigate('/');
        }
    }, [navigate]);

    const [input, setInput] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        img: {},
        imgPreview: '',
        description: '',
        errorList: [],
    });

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

    const saveRestaurant = (e) => {
        e.preventDefault();

        const fData = new FormData();
        fData.append('img', input.img);
        fData.append('name', input.name);
        fData.append('address', input.address);
        fData.append('phoneNumber', input.phoneNumber);
        fData.append('description', input.description);

        axios.get(`/sanctum/csrf-cookie`).then((response) => {
            axios.post(`/api/add-restaurant`, fData).then((res) => {
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
    return (
        <div className="container" style={{ marginTop: '80px' }}>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4>
                                Add Restaurant
                                <Link to={'/dashboard'} className="btn btn-primary btn-sm float-end">
                                    Back
                                </Link>
                            </h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={saveRestaurant}>
                                <div className="form-group mb-3">
                                    <label>Restaurant Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={input.name}
                                        className="form-control"
                                        onChange={(e) => handleInput(e)}
                                    />
                                    <span className="text-danger">{input.errorList.name}</span>
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
                                    <span className="text-danger">{input.errorList.address}</span>
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
                                    <span className="text-danger">{input.errorList.phoneNumber}</span>
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
                                    <span className="text-danger">{input.errorList.img}</span>
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
                                    <span className="text-danger">{input.errorList.description}</span>
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
        </div>
    );
}

export default AddRestaurant;
