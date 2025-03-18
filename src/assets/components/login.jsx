import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./login.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

const LoginForm = () => {


    //datos
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
    //Login
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //alertas
    const [alert, setAlert] = useState({
      show: false,
      type: '', 
      message: ''
    });
    //validaciones
    const [validation, setValidation] = useState({
      email: { valid: true, message: '' },
      password: { valid: true, message: '' }
    });
    //formulario-enviado
    const [formSubmitted, setFormSubmitted] = useState(false);
    //ver contraseña

    const [showPassword, setShowPassword] = useState(false);
  
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
        }, 300000)
        
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

          <div className={`alert-container alert ${bgColors[alert.type]} mx-5 d-flex text-center position-absolute`} role="alert">
          <span className="block sm:inline">{alert.message}</span>
          <button 
            className="btn btn-close "
            onClick={() => setAlert({ show: false, type: '', message: '' })}
          ></button>
        </div>
      );
    };
  
    return (
      
      <div className="main ">
        {/* Componente de alerta */}

        <Alert />

        
        <div className="form">
        
        {isLoggedIn ? (
          <div className="container-log text-center py-5">
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
            <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="icon-p bi bi-person-circle mt-1 pt-1" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
            </span>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} noValidate className="form-main form-control">
              <div className="container-info mb-3">
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
              
              <div className="container-info mb-3 position-relative">
                <input
                  type= {showPassword ? "text": "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control pt-2 my-1 mx-5 `}
                  placeholder="Contraseña"
                />
                <span
                  className="eye-icon position-absolute"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashFill /> : <EyeFill />}
                </span>
                {!validation.password.valid && formSubmitted && (
                  <p className="text-alert">{validation.password.message}</p>
                )}

              </div>
              <a href="">Recuperar Contraseña</a>
              <div className="btns d-flex my-1">

              <button
                type="submit"
                className="btn-log p-2"
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                className="btn-crear p-2"
              >
                Crear Cuenta
              </button>
              </div>

            </form>
            
            <div className="example">
              <p>Para probar el error: error@test.com</p>
            </div>
            </div>

                     
          </>
        )}
        </div>

      </div>
    );
  };
  
  export default LoginForm;