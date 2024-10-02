import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Header from './components/Header';
import Register from './components/Register';
import UserDetails from './components/UserDetails';
import Login from './components/Login';
import Home from './components/Home';
import Contact from './components/Contact';
import AdminPanel from './components/admin/AdminPanel';
import About from './components/About';
import SeatDetails from './components/SeatDetails';
import BusLayout from './components/SeatDetails';

// Define the type for your route configuration
interface RouteConfig {
  path: string;
  element: React.ReactElement;
}

const routes: RouteConfig[] = [
  { path: '/', element: <Home/> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/register', element: <Register /> },
  { path: '/user-details', element: <UserDetails /> },
  { path: '/login', element: <Login /> },
  { path: '/admin-panel', element: <AdminPanel /> },
  { path: '/seat-details', element: <BusLayout /> },
];

const AppRouter: React.FC = () => {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
