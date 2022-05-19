import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Dashboard from '~/pages/Dashboard';
import AddRestaurant from '~/pages/AddRestaurant';
import EditRestaurant from '~/pages/EditRestaurant';
import ViewRestaurant from '~/pages/ViewRestaurant';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/dashboard', component: Dashboard },
    { path: '/add-restaurant', component: AddRestaurant },
    { path: '/edit-restaurant/:id', component: EditRestaurant },
    { path: '/restaurant/:id', component: ViewRestaurant },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
