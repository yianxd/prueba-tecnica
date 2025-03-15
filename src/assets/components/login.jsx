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
        return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
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

          <div className={`alert ${bgColors[alert.type]} d-flex flex-column `} role="alert">
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
      
      <div className="text-center">
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
            <h2 className="">Iniciar Sesión</h2>
            
            <form onSubmit={handleSubmit} noValidate className="main form-control">
              <div className="form-label">
                <label className="" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input form-control`}
                  placeholder="ejemplo@correo.com"
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
                  className={`form-control`}
                  placeholder="Contraseña"
                />
                {!validation.password.valid && formSubmitted && (
                  <p className="text-alert">{validation.password.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="btn btn-success mb-1"
              >
                Iniciar Sesión
              </button>
            </form>
            
            <div className="example">
              <p>Para probar el error: usa error@test.com</p>
            </div>
          </>
        )}
      </div>
    );
  };
  
  export default LoginForm;