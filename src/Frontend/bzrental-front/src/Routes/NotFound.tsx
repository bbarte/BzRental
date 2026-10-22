import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
            <div className="container">
                <div className="w-50 mx-auto bg-warning-subtle p-4 my-5 rounded border border-warning shadow-sm">
                    <h1>404</h1>
                    <p>
                        Nie znaleziono takiej podstrony!
                    </p>
                    <p>
                        <Link to='/' className="btn btn-outline-dark">Wróć do strony glównej</Link>
                    </p>
                </div>

                <p className="mx-auto w-50">
                    BzRental
                    <br />
                    <b>&copy; Bartosz Zagalski</b>
                </p>
            </div>
        </>
    )
}