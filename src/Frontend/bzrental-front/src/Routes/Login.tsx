import { useState } from "react";
import { useForm } from 'react-hook-form';
import { ErrorMessagesList } from "../Components/ErrorMessagesList";
import BzRentalFooter from "../Components/Layout/BzRentalFooter";
import BzRentalNavbar from "../Components/Layout/BzRentalNavbar";
import Loader from "../Components/Loader";
import type ILoginRequest from "../DAL/Auth/Requests/ILoginRequest";
import { ApiError } from "../DAL/ApiAccess/ApiError";
import AuthService from "../DAL/Auth/Services/AuthService";

export default function Login() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loginErrors, setLoginErrors] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ILoginRequest>({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    async function onSubmit(data: ILoginRequest) {
        setIsLoading(true);

        try {
            await AuthService.login(data);
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.hasCode('Auth.LoginFailed')) {
                    setLoginErrors(['Podane dane logowania są nieprawidłowe']);
                } else if (e.hasCode('Auth.Blocked')) {
                    setLoginErrors(['Użytkownik został zablokowany.']);
                }

                return;
            }
        }
        finally {
            setIsLoading(false);
        }

        alert('Zalogowano!');
    }

    return (
        <>
            <BzRentalNavbar/>

            <div className="container r">
                <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-6">
                        <ErrorMessagesList className="mb-4" errors={loginErrors}/>
                    </div>
                    <div className="col-lg-3"></div>
                </div>
                <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-6">
                        <div className="card loader-host">
                            <div className="card-header">
                                <h4 className="mb-0">Logowanie</h4>
                            </div>
                            <div className="card-body">
                                <div className="card-text">
                                    <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="row mb-2">
                                            <label htmlFor="username" className="col-sm-2 col-form-label">Login:</label>
                                            <div className="col-sm-10">
                                                <input
                                                    type="text" id="username"
                                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                                    {... register('username', {
                                                        required: 'Należy podać login'
                                                    })}
                                                />
                                                
                                                {errors.username && (
                                                    <div className="invalid-feedback">
                                                        {errors.username.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label htmlFor="password" className="col-sm-2 col-form-label">Hasło:</label>
                                            <div className="col-sm-10">
                                                <input
                                                    type="password" id="password"
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                    {... register('password', {
                                                        required: 'Należy podać hasło'
                                                    })}
                                                />

                                                {errors.password && (
                                                    <div className="invalid-feedback">
                                                        {errors.password.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-end">
                                <button className="btn btn-primary" type="submit" form="login-form">Zaloguj się</button>
                            </div>

                            {isLoading && <Loader/>}
                        </div>
                    </div>
                    <div className="col-lg-3"></div>
                </div>
            </div>

            <BzRentalFooter/>
        </>
    )
}