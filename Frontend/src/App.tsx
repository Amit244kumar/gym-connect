import "./global.css";

import React from 'react';
import { BrowserRouter as Router, Routes, Route, createRoutesFromElements } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
// import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'sonner';
// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import OwnerRegister from './pages/OwnerRegister';
import OwnerDashboard from './pages/OwnerDashboard';
import MemberRegister from './pages/MemberRegister';
import MemberDashboard from './pages/MemberDashboard';
import NotFound from './pages/NotFound';
import {AppRouters} from "./pages/routes";
function App() {
  return (
    <Provider store={store}>
      {/* <AuthProvider> */}
      <Toaster richColors position="top-center" duration={4000}  visibleToasts={3} />
      <AppRouters />
      {/* </AuthProvider> */}
    </Provider>
  );
}

export default App;
