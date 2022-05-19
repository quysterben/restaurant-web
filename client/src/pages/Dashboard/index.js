import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    let navigate = useNavigate();

    const [list, setList] = useState({
        restaurants: [],
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
        } else {
            axios.get(`/sanctum/csrf-cookie`).then((response) => {
                axios.get(`/api/restaurantsUser`).then((res) => {
                    if (res.data.status === 200) {
                        setList({
                            restaurants: res.data.restaurants,
                            loading: false,
                        });
                    } else {
                        setList({
                            loading: true,
                        });
                    }
                });
            });
        }
    }, [navigate]);

    const deleteRestaurant = (e, id) => {
        const deleteBtn = e.currentTarget;
        deleteBtn.innerText = 'Deleting';
        axios.get(`/sanctum/csrf-cookie`).then((response) => {
            axios.delete(`/api/delete-restaurant/${id}`).then((res) => {
                if (res.data.status === 200) {
                    deleteBtn.closest('tr').remove();
                    Swal.fire({
                        icon: 'success',
                        text: res.data.message,
                    });
                }
            });
        });
    };

    var HTMLTable = '';
    if (list.loading) {
        HTMLTable = (
            <tr>
                <td colSpan="9">
                    <h2>Loading...</h2>
                </td>
            </tr>
        );
    } else {
        HTMLTable = list.restaurants.map((item) => {
            return (
                <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.address}</td>
                    <td>{item.phoneNumber}</td>
                    <td>
                        <img src={`${item.img}`} alt="" height="100px" width="100px" />
                    </td>
                    <td style={{ fontSize: '10px' }}>{item.description}</td>
                    <td>
                        <Link to={`/edit-restaurant/${item.id}`} className="btn btn-success btn-sm">
                            Edit
                        </Link>
                    </td>
                    <td>
                        <button
                            id="deleteBtn"
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={(e) => deleteRestaurant(e, item.id)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            );
        });
    }

    return (
        <div className="container" style={{ marginTop: '80px' }}>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4>
                                Restaurants Data
                                <Link to="/add-restaurant" className="btn btn-primary btn-sm float-end">
                                    Add
                                </Link>
                            </h4>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Restaurant Name</th>
                                        <th>Address</th>
                                        <th>Phone</th>
                                        <th>Picture</th>
                                        <th>Description</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>{HTMLTable}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
