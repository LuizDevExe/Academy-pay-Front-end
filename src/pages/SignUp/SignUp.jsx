import './SignUp.css';
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Box, Input, InputGroup, InputRightElement } from '@chakra-ui/react';

import ProgressBarDataScreen from '../../assets/ProgressBarDataScreen.png';
import ProgressBarPasswordScreen from '../../assets/ProgressBarPasswordScreen.png';
import ProgressBarRegisteredScreen from '../../assets/ProgressBarRegisteredScreen.png';
import RegisteredIcon from '../../assets/RegisteredIcon.png';
import eyeOff from '../../assets/eye-off.svg';
import eye from '../../assets/eye.svg';
import api from '../../services/api';



function App() {

  const [screen, setScreen] = useState('personalData');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });


  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();


  const handleSetForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  const handlePersonalDataScreen = () => {

    setNameError('');
    setEmailError('');

    const midSpace = form.name.indexOf(' ') !== -1 && form.name.indexOf(' ') < form.name.length - 1 && form.name.indexOf(' ') > 0;

    if (!form.name) {
      return setNameError('Este campo deve ser preenchido')
    }

    if (!midSpace) {
      return setNameError('Este campo deve conter nome e sobrenome')
    }

    if (!form.email) {
      return setEmailError('Este campo deve ser preenchido');
    }

    function validateEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    if (!validateEmail(form.email)) {
      return setEmailError('Insira um email válido')
    } else {
      setEmailError('')
    }

    setScreen('passwordScreen')

  };


  async function handleRegister() {

    setPasswordError('');
    setConfirmPasswordError('');

    if (!form.password) {
      return setPasswordError('Este campo deve ser preenchido');
    }

    if (form.password.length < 5) {
      return setPasswordError('A senha deve possuir no mínimo 5 caracteres');
    }

    if (!confirmPassword) {
      return setConfirmPasswordError('Este campo deve ser preenchido');
    }

    if (form.password !== confirmPassword) {
      return setConfirmPasswordError('As senhas não coincidem');
    }

    try {

      await api.post('/registerUser', {
        ...form
      });


    } catch (error) {
      console.log(error);

      if (error.response) {
        setScreen('personalData');
        console.log(error.response.data.message)
        setEmailError(error.response.data.message)
        return
      }
    }

    setScreen('registeredScreen')
  };




  return (

    <div className="container-main-signUp">
      <aside>
        {
          screen === 'personalData' &&
          <aside className="asside-signUp-flux">
            <section>
              <div className="" >
                <img src={ProgressBarDataScreen} alt="" />
              </div>
              <article className="asside-flux-info">
                <div>
                  <h2>Cadastre-se</h2>
                  <p>Por favor, escreva seu nome e e-mail</p>
                </div>
                <div>
                  <h2>Escolha uma senha</h2>
                  <p>Escolha uma senha segura</p>
                </div>
                <div>
                  <h2>Cadastro realizado com sucesso</h2>
                  <p>E-mail e senha cadastrados com sucesso</p>
                </div>
              </article>
            </section>

          </aside>
        }

        {
          screen === 'passwordScreen' &&
          <aside className="asside-signUp-flux">
            <section>
              <div className="" >
                <img src={ProgressBarPasswordScreen} alt="" />
              </div>
              <article className="asside-flux-info">
                <div>
                  <h2>Cadastre-se</h2>
                  <p>Por favor, escreva seu nome e e-mail</p>
                </div>
                <div>
                  <h2>Escolha uma senha</h2>
                  <p>Escolha uma senha segura</p>
                </div>
                <div>
                  <h2>Cadastro realizado com sucesso</h2>
                  <p>E-mail e senha cadastrados com sucesso</p>
                </div>
              </article>
            </section>

          </aside>
        }


        {
          screen === 'registeredScreen' &&
          <aside className="asside-signUp-flux">
            <section>
              <div className="" >
                <img src={ProgressBarRegisteredScreen} alt="" />
              </div>
              <article className="asside-flux-info">
                <div>
                  <h2>Cadastre-se</h2>
                  <p>Por favor, escreva seu nome e e-mail</p>
                </div>
                <div>
                  <h2>Escolha uma senha</h2>
                  <p>Escolha uma senha segura</p>
                </div>
                <div>
                  <h2>Cadastro realizado com sucesso</h2>
                  <p>E-mail e senha cadastrados com sucesso</p>
                </div>
              </article>
            </section>

          </aside>
        }
      </aside>

      <main className="container-main-form">
        {
          screen === 'personalData' &&
          <section className="section-form-singUp">
            <h1>Adicione seus dados</h1>
            <form>

              <div className={!nameError ? 'div-section-form' : 'div-section-form-error'}>
                <label htmlFor="name">Nome*</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Digite seu nome"
                  value={form.name}
                  onChange={handleSetForm}
                />
                {nameError &&
                  <div className='section-form-error'>
                    <span>
                      {nameError}
                    </span>
                  </div>
                }
              </div>

              <div className={!emailError ? 'div-section-form' : 'div-section-form-error'}>
                <label htmlFor="email">E-mail*</label>
                <input
                  type="text"
                  name="email"
                  placeholder="Digite seu e-mail"
                  value={form.email}
                  onChange={handleSetForm}
                />

                {
                  emailError &&
                  <div>
                    <span>
                      {emailError}
                    </span>
                  </div>
                }
              </div>
              <button type='button' onClick={handlePersonalDataScreen}>Continuar</button>
              <p>Já possui uma conta? Faça seu <Link to={'/sign-in'}>Login</Link></p>
            </form>
            <div className='stepper-fucntion'>
              <div id='stepper-fucntion-active'></div>
              <div></div>
              <div></div>
            </div>
          </section>
        }

        {
          screen === 'passwordScreen' &&
          <section className="section-form-singUp">
            <h1>Escolha uma senha</h1>
            <form>

              <div className={!passwordError ? 'div-section-form' : 'div-section-form-error'}>
                <label htmlFor="name">Senha*</label>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Digite sua senha'
                    maxLength={20}
                    value={form.password}
                    onChange={handleSetForm}
                    _focus={{
                      border: '2px solid black',
                      boxShadow: 'none',
                    }}
                    style={{ border: passwordError ? '1px solid #E70000' : '' }}
                  />
                  <InputRightElement width='4.5rem'>
                    <Box
                      h='1.75rem'
                      size='sm'
                      backgroundColor='white'
                      marginTop='8px'
                      marginRight='-20px'
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ?
                        <img
                          src={eyeOff}
                          alt='olho'
                          style={{ height: '1.6rem', cursor: 'pointer' }}
                        />
                        : <img
                          src={eye}
                          alt='olho'
                          style={{ height: '1.6rem', cursor: 'pointer' }}
                        />}
                    </Box>
                  </InputRightElement>
                </InputGroup>
                {
                  passwordError &&
                  <span >
                    {passwordError}
                  </span>
                }
              </div>

              <div className={!confirmPasswordError ? 'div-section-form' : 'div-section-form-error'}>
                <label htmlFor="confirmPassword">Repita a senha*</label>
                {/* <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                /> */}

                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirme sua senha'
                    maxLength={20}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    _focus={{
                      border: '2px solid black',
                      boxShadow: 'none',
                    }}
                    style={{ border: passwordError ? '1px solid #E70000' : '' }}
                  />
                  <InputRightElement width='4.5rem'>
                    <Box
                      h='1.75rem'
                      size='sm'
                      backgroundColor='white'
                      marginTop='8px'
                      marginRight='-20px'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ?
                        <img
                          src={eyeOff}
                          alt='olho'
                          style={{ height: '1.6rem', cursor: 'pointer' }}
                        />
                        : <img
                          src={eye}
                          alt='olho'
                          style={{ height: '1.6rem', cursor: 'pointer' }}
                        />}
                    </Box>
                  </InputRightElement>
                </InputGroup>
                {
                  confirmPasswordError &&
                  <span>
                    {confirmPasswordError}
                  </span>
                }

              </div>
              <button type='button' onClick={handleRegister}>Finalizar cadastro</button>
              <p>Já possui uma conta? Faça seu <Link to={'/sign-in'}>Login</Link></p>
            </form>
            <div className='stepper-fucntion'>
              <div></div>
              <div id='stepper-fucntion-active' ></div>
              <div></div>
            </div>
          </section>

        }

        {
          screen === 'registeredScreen' &&
          <section className="section-form-registered">

            <article className='registered-container'>
              <img src={RegisteredIcon} alt="" />
              <h1>Cadastro realizado com sucesso!</h1>
            </article>
            <button type='button' onClick={() => navigate('/sign-in')}>Ir para login</button>
            <div className='stepper-fucntion-registered'>
              <div></div>
              <div ></div>
              <div id='stepper-fucntion-registered'></div>
            </div>
          </section>
        }
      </main>

    </div>
  );
}

export default App;
