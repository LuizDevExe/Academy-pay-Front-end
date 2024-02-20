import { Box, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErroPopUp from '../../assets/ErroPopUp.svg'
import eyeOff from '../../assets/eye-off.svg'
import eye from '../../assets/eye.svg'
import api from '../../services/api'
import { encryptAndStore } from '../../utils/storage'
import './SignIn.css'

function SignIn() {

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate("/home");
        }
    }, [])

    const handleSetForm = (event) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    }

    async function handleLogin() {
        setEmailError('');
        setPasswordError('');

        try {
            if (!loginData.email) {
                return setEmailError('Campo obrigatório');
            }

            if (!loginData.password) {
                return setPasswordError('Senha incorreta');
            }

            const response = await api.post('/login', {
                ...loginData
            })

            const { token } = response.data;
            const { id, name } = response.data.user;

            const dataToEncryptToken = { token: `${token}` };
            encryptAndStore('token', dataToEncryptToken);

            const dataToEncryptId = { id: `${id}` };
            encryptAndStore('id', dataToEncryptId);

            const dataToEncryptName = { name: `${name}` };
            encryptAndStore('name', dataToEncryptName);


            navigate('/home')
        } catch (error) {

            if (error.response) {

                if(error.response.data.message){
                    setError("Erro interno do servidor");
                    setIsOpen(true);
                }

                if(error.response.data.message === "Usuário não encontrado"){
                    setError(error.response.data.message);
                    setIsOpen(true);
                }

                if(error.response.data.message === "Email ou senha inválidos"){
                    setError(error.response.data.message);
                    setIsOpen(true);
                }
  
                setTimeout(() => {
                    setIsOpen(false);
                }, 5000);
            }
        }

    }

    return (
        <div className='container-main-signIn'>
            <aside className="asside-signIn">
                <h2>Gerencie todos os pagamentos da sua empresa em um só lugar.</h2>
            </aside>

            <main className="container-main-signIn-form">

                <section className="section-signIn-form">
                    <h1>Faça seu login!</h1>
                    <form className='signIn-form'>

                        <div className={emailError ? 'signIn-form-div-error' : 'signIn-form-div'}>
                            <label htmlFor="email">E-mail*</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Digite seu e-mail"
                                onChange={handleSetForm}
                            />
                            {
                                emailError &&
                                <span>
                                    {emailError}
                                </span>
                            }
                        </div>

                        <div className={passwordError ? 'signIn-form-div-error' : 'signIn-form-div'}>
                            <div id='change-password-section'>
                                <label htmlFor="password">Senha*</label>
                                <Link>Esqueceu a senha?</Link>
                            </div>
                            <InputGroup size='md'>
                                    <Input
                                        pr='4.5rem'
                                        name='password'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Digite sua senha'
                                        maxLength={20}
                                        value={loginData.password}
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
                                <span>
                                    {passwordError}
                                </span>
                            }
                        </div>
                        <button type='button' onClick={handleLogin}>Continuar</button>
                        <p>Ainda não possui uma conta? <Link to={'/sign-up'}>Cadastre-se</Link></p>
                    </form>
                </section>
                {
                    isOpen &&
                    <div className='pop-up-message-error'>
                        <img src={ErroPopUp} alt="" />
                        {error}
                    </div>
                }
            </main>
        </div>
    )
}

export default SignIn