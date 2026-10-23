import { useState } from "react";
import AuthService from "../DAL/Auth/Services/AuthService";
import { BzRentalNavbar } from "../Components/Layout/BzRentalNavbar";
import BzRentalFooter from "../Components/Layout/BzRentalFooter";
import { ErrorMessage, useForm } from "react-hook-form";
import type IRegisterUserRequest from "../DAL/Users/Requests/IRegisterUserRequest";
import { ErrorMessagesList } from "../Components/ErrorMessagesList";
import Loader from "../Components/Loader";
import UsersService from "../DAL/Users/Services/UsersService";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../DAL/ApiAccess/ApiError";

type RegisterFormData = {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    repeatPassword: string
}

export default function Register() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    async function handleLogout(): Promise<void> {
        setIsUserLoggedIn(false);
    }

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<string[]>([]);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<RegisterFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            repeatPassword: ''
        }
    });

    async function onSubmit(data: RegisterFormData) {
        setApiErrors([]);

        if (data.password !== data.repeatPassword) {
            setApiErrors(['Podane hasła nie zgadzają się!']);

            return;
        }

        setIsLoading(true);

        try {
            await UsersService.registerUser({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                password: data.password
            });
        }
        catch (e) {
            if (e instanceof ApiError) {
                setApiErrors(e.getTranslations([
                    {
                        code: 'Users.UsernameTaken',
                        msg: 'Podana nazwa użytkownika jest już zajęta!'
                    }
                ]));

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }

        navigate('/login', {
            state: {
                infoMessages: ['Zarejestrowano użytkownika!']
            }
        });
    }

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container">
                <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-6">
                        <ErrorMessagesList
                            className="mb-4"
                            errors={apiErrors}/>
                    </div>
                    <div className="col-lg-3"></div>
                </div>
                <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-6">
                        <div className="card loader-host">
                            <div className="card-header">
                                <h4 className="mb-0">
                                    Rejestracja
                                </h4>
                            </div>
                            <div className="card-body">
                                <div className="card-text">
                                    <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="row mb-2">
                                            <label htmlFor="firstName" className="col-sm-4 col-form-label">Imię:</label>
                                            <div className="col-sm-8">
                                                <input
                                                    type="text" id="firstName" maxLength={100}
                                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                                    {... register('firstName', {
                                                        required: 'Należy podać imię'
                                                    })}
                                                />
                                                
                                                {errors.firstName && (
                                                    <div className="invalid-feedback">
                                                        {errors.firstName.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <label htmlFor="lastName" className="col-sm-4 col-form-label">Nazwisko:</label>
                                            <div className="col-sm-8">
                                                <input
                                                    type="text" id="lastName" maxLength={100}
                                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                                    {... register('lastName', {
                                                        required: 'Należy podać nazwisko'
                                                    })}
                                                />
                                                
                                                {errors.lastName && (
                                                    <div className="invalid-feedback">
                                                        {errors.lastName.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <label htmlFor="username" className="col-sm-4 col-form-label">Login:</label>
                                            <div className="col-sm-8">
                                                <input
                                                    type="text" id="username" maxLength={25}
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
                                        <div className="row mb-2">
                                            <label htmlFor="password" className="col-sm-4 col-form-label">Hasło:</label>
                                            <div className="col-sm-8">
                                                <input
                                                    type="password" id="password" maxLength={255}
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
                                        <div className="row mb-2">
                                            <label htmlFor="repeatPassword" className="col-sm-4 col-form-label">Powtórzone hasło:</label>
                                            <div className="col-sm-8">
                                                <input
                                                    type="password" id="repeatPassword" maxLength={255}
                                                    className={`form-control ${errors.repeatPassword ? 'is-invalid' : ''}`}
                                                    {... register('repeatPassword', {
                                                        required: 'Należy ponownie wpisać hasło'
                                                    })}
                                                />
                                                
                                                {errors.repeatPassword && (
                                                    <div className="invalid-feedback">
                                                        {errors.repeatPassword.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-end">
                                <button className="btn btn-primary" type="submit" form="register-form">
                                    Zarejestruj
                                </button>
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