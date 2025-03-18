import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./login.css";
import 'bootstrap/dist/css/bootstrap.min.css';


const LoginForm = () => {

    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [alert, setAlert] = useState({
      show: false,
      type: '', 
      message: ''
    });
    const [validation, setValidation] = useState({
      email: { valid: true, message: '' },
      password: { valid: true, message: '' }
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
  
    useEffect(() => {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        setIsLoggedIn(true);
        setFormData(prevData => ({
          ...prevData,
          email: foundUser.email
        }));
        showAlert('info', `Sesión recuperada para ${foundUser.email}`);
      }
    }, []);
  

    useEffect(() => {
      if (alert.show) {
        const timer = setTimeout(() => {
          setAlert({ show: false, type: '', message: '' });
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }, [alert]);
  
    const showAlert = (type, message) => {
      setAlert({
        show: true,
        type,
        message
      });
    };
  
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        return { valid: false, message: 'El email es obligatorio' };
      } else if (!emailRegex.test(email)) {
        return { valid: false, message: 'Formato de email inválido' };
      }
      return { valid: true, message: '' };
    };
  

    const validatePassword = (password) => {
      if (!password.trim()) {
        return { valid: false, message: 'La contraseña es obligatoria' };
      } else if (password.length < 8) {
        return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
      }
      return { valid: true, message: '' };
    };
  

    const validateForm = () => {
      const emailValidation = validateEmail(formData.email);
      const passwordValidation = validatePassword(formData.password);
    

      setValidation({
        email: emailValidation,
        password: passwordValidation
      });
      
      return emailValidation.valid && passwordValidation.valid;
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
      

      if (formSubmitted) {
        if (name === 'email') {
          setValidation(prev => ({
            ...prev,
            email: validateEmail(value)
          }));
        } else if (name === 'password') {
          setValidation(prev => ({
            ...prev,
            password: validatePassword(value)
          }));
        }
      }
    };
  

    const handleSubmit = (e) => {
      e.preventDefault();
      setFormSubmitted(true);
      

      if (!validateForm()) {
        showAlert('error', 'Por favor, corrige los errores en el formulario');
        return;
      }
      

      try {

        if (formData.email === 'error@test.com') {
          showAlert('error', 'Credenciales incorrectas');
          return;
        }
        

        const user = {
          email: formData.email,
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        };
        

        localStorage.setItem('user', JSON.stringify(user));
        setIsLoggedIn(true);
        showAlert('success', '¡Sesión iniciada correctamente!');
      } catch (error) {
        showAlert('error', 'Error al iniciar sesión: ' + (error.message || 'Intente nuevamente'));
      }
    };
  

    const handleLogout = () => {
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setFormData({
        email: '',
        password: ''
      });
      setFormSubmitted(false);
      showAlert('info', 'Has cerrado sesión correctamente');
    };
  

    const Alert = () => {
      if (!alert.show) return null;
      
      const bgColors = {
        success: 'alert-success',
        error: 'alert-primary',
        warning: 'alert-danger',
        info: 'alert-primary'
      };
      
      return (

          <div className={`alert-con alert ${bgColors[alert.type]} d-flex flex-column `} role="alert">
          <span className="block sm:inline">{alert.message}</span>
          <div className="mt-3">
          <button 
            className="btn btn-danger w-25 mx-1"
            onClick={() => setAlert({ show: false, type: '', message: '' })}
          >
            Cerrar
          </button>
          </div>
        </div>
      );
    };
  
    return (
      
      <div className="main mb-5">
        {/* Componente de alerta */}
        <div>
        <Alert />
        </div>
        
        {isLoggedIn ? (
          <div className="">
            <h2 className="">¡Sesión iniciada!</h2>
            <p className="mb-4">Has iniciado sesión como: <strong>{formData.email}</strong></p>
            <div className="mb-2">
            <button 
              onClick={handleLogout}
              className="btn btn-danger w-25"
            >
              Cerrar Sesión
            </button>
            </div>

          </div>
        ) : (
          <>
            
            <div className="form-box">
            <span>
            <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="icon-p bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
            </span>
            <form onSubmit={handleSubmit} noValidate className="form-main form-control">
              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input form-control my-1 mx-5`}
                  placeholder="Correo"
                />
                {!validation.email.valid && formSubmitted && (
                  <p className="text-alert">{validation.email.message}</p>
                )}
              </div>
              
              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control pt-2 my-1 mx-5`}
                  placeholder="Contraseña"
                />
                {!validation.password.valid && formSubmitted && (
                  <p className="text-alert">{validation.password.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="btn-log  mb-1"
              >
                Iniciar Sesión
              </button>
            </form>
            
            <div className="example">
              <p>Para probar el error: usa error@test.com</p>
            </div>
            </div>

                     
          </>
        )}
      </div>
    );
  };
  
  export default LoginForm;