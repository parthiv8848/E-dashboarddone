import './App.css';
import Nav from './components/Nav'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Privetcomponents from './components/Privetcomponents';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import Productlist from './components/Productlist';
import UpdateProduct from './components/UpdateProduct';
import Profile from './components/Profile';
// import AddProductImage from './components/AddProductImage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route element={<Privetcomponents />}>
            <Route path="/" element={<Productlist/>} />
            <Route path="add" element={<AddProduct/>} />
           
            <Route path="update/:id" element={<UpdateProduct/>} />
            <Route path="logout" element={<h1> add logout</h1>} />
            <Route path="profile" element={<Profile/>} />
          </Route>

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login/>} />
           </Routes>
      </BrowserRouter>
      <Footer></Footer>
    </div>
  );
}

export default App;
