import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../DAL/Auth/Services/AuthService";
import { BzRentalNavbar } from "../Components/Layout/BzRentalNavbar";
import BzRentalFooter from "../Components/Layout/BzRentalFooter";
import type IProductCategoryMinimalDto from "../DAL/Products/Dtos/IProductCategoryMinimalDto";
import ProductsSelectingService from "../DAL/Products/Services/ProductsSelectingService";
import Loader from "../Components/Loader";

export default function BrowseCategories() {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    async function handleLogout(): Promise<void> { setIsUserLoggedIn(false); navigate('/'); }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [categories, setCategories] = useState<IProductCategoryMinimalDto[]>([]);
    
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        refreshCategories();
    }, []);

    async function refreshCategories() {
        setIsLoading(true);

        try {
            setCategories(await ProductsSelectingService.getCategories());
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container">
                <h1 className="mb-4">Dostępne kategorie</h1>

                <input type="search" name="filter" id="filter" className="form-control" placeholder="Szukaj..."
                    value={filter} onChange={(e) => setFilter(e.target.value)}/>

                <div className="row mt-4 g-2">
                    {
                        categories
                            .filter(x =>
                                x.name.toLowerCase().includes(filter.toLowerCase())
                            )
                            .map(cat => (
                                <div className="col-3" key={cat.id}>
                                    <Link to={`/browse-products?categoryId=${cat.id}`} className="text-decoration-none text-reset ">
                                        <div className="p-2 rounded shadow-sm border">
                                            <div className="d-flex flex-row align-items-center">
                                                <div className="bg bg-warning-subtle bg-gradient fs-3 d-flex align-items-center justify-content-center rounded" style={{color: '#997d2b', width: '48px', height: '48px'}}>
                                                    {cat.name[0].toUpperCase()}
                                                </div>
                                                <div className="fs-5 ms-3">{cat.name}</div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                    }
                </div>
            </div>

            {isLoading && <Loader/>}

            <BzRentalFooter/>
        </>
    );
}