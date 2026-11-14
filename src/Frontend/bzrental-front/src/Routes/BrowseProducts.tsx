import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthService from "../DAL/Auth/Services/AuthService";
import { BzRentalNavbar } from "../Components/Layout/BzRentalNavbar";
import BzRentalFooter from "../Components/Layout/BzRentalFooter";
import Loader from "../Components/Loader";
import type IProductCategoryMinimalDto from "../DAL/Products/Dtos/IProductCategoryMinimalDto";
import ProductsSelectingService from "../DAL/Products/Services/ProductsSelectingService";
import { ErrorMessagesList } from "../Components/ErrorMessagesList";
import { InfoMessagesList } from "../Components/InfoMessagesList";
import type { ISearchProductsRequest } from "../DAL/Products/Requests/ISearchProductsRequest";

export default function BrowseProducts() {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    async function handleLogout(): Promise<void> { setIsUserLoggedIn(false); navigate('/'); }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [apiErrors, setApiErrors] = useState<string[]>([]);
    const [infoMessages, setInfoMessages] = useState<string[]>([]);

    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId');

    const [selectedCategory, setSelectedCategory] = useState<IProductCategoryMinimalDto>({
        id: 0,
        name: ''
    });

    const [filterStartDate, setFilterStartDate] = useState<string>(new Date().toLocaleDateString('en-CA'));
    const [filterEndDate, setFilterEndDate] = useState<string>('');

    const [searchRequest, setSearchRequest] = useState<ISearchProductsRequest>({
        startDate: '',
        endDate: '',
        name: '',
        dailyPriceFrom: undefined,
        dailyPriceTo: undefined,
        ratingFrom: undefined,
        ratingTo: undefined,
        fieldValueFilters: []
    });

    const [orderBy, setOrderBy] = useState<string>('');

    const [wasFirstSearchHit, setWasFirstSearchHit] = useState<boolean>(false);

    useEffect(() => {
        if (!categoryId) {
            navigate('/');
            return;
        }

        refreshInitialData();
    }, []);

    async function refreshInitialData() {
        setIsLoading(true);

        setSelectedCategory(await ProductsSelectingService.getCategoryById(+categoryId!));

        setIsLoading(false);
    }

    async function handleSearchByDates() {
        setApiErrors([]);
        setInfoMessages([]);

        if (!filterStartDate || !filterEndDate) {
            setApiErrors(['Należy podać zakres dat do wyszukania!']);
            return;
        }

        if (filterStartDate > filterEndDate) {
            setApiErrors(['Podane ramy czasowe są nieprawidłowe!']);
            return;
        }

        const today = new Date().toLocaleDateString('en-CA');
        
        if (filterStartDate < today) {
            setApiErrors(['Data rozpoczęcia nie może być przeszła!']);
            return;
        }

        if (filterEndDate < today) {
            setApiErrors(['Data zakończenia nie może być przeszła!']);
            return;
        }

        if (filterStartDate == filterEndDate) {
            setApiErrors(['Okres wypożyczenia musi trwać co najmniej jeden dzień!']);
            return;
        }

        setSearchRequest({
            ...searchRequest,
            startDate: filterStartDate,
            endDate: filterEndDate
        });
        
        setWasFirstSearchHit(true);
        
        await refreshData();
    }

    async function refreshData() {
        setIsLoading(true);
        
        setIsLoading(false);
    }

    function handleSearchFormSubmit() {
        
    }

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container">
                <h1 className="mb-4">
                    Przedmioty w kategorii:&nbsp;
                    <span className="fw-light">
                        {selectedCategory.name.toLocaleLowerCase()}
                    </span>
                </h1>

                <ErrorMessagesList errors={apiErrors} className="mb-3"/>
                <InfoMessagesList messages={infoMessages} className="mb-3"/>

                <div className="mb-4 bg-light p-2 px-3 rounded rounded shadow border">
                    <div className="row">
                        <div className="col-9">
                            <div className="d-flex align-items-center gap-2 ">
                                W okresie:
                                <input type="date" name="startDate" id="startDate" className="form-control w-auto ms-3"
                                    value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)}/>
                                -
                                <input type="date" name="endDate" id="endDate" className="form-control w-auto"
                                    value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)}/>

                                <button className={`btn ${wasFirstSearchHit ? 'btn-outline-primary' : 'btn-primary'}`} onClick={handleSearchByDates}>
                                    <i className="fa fa-search"></i>
                                    <span className="ms-2">Szukaj</span>
                                </button>
                            </div>
                        </div>
                        <div className="col-3">
                            {
                                wasFirstSearchHit &&
                                <>
                                    <div className="input-group">
                                        <div className="input-group-text text-center">
                                            <i className="fa fa-sort-amount-desc"></i>
                                        </div>
                                        <select name="orderBy" id="orderBy" className="form-select"
                                            value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
                                            <option value="">(brak sortowania)</option>
                                            <option value="asc(name)">Nazwa: rosnąco</option>
                                            <option value="desc(name)">Nazwa: malejąco</option>
                                            <option value="asc(dailyPrice)">Cena za dzień: rosnąco</option>
                                            <option value="desc(dailyPrice)">Cena za dzień: malejąco</option>
                                            <option value="asc(rating)">Ocena: rosnąco</option>
                                            <option value="desc(rating)">Ocena: malejąco</option>
                                        </select>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>

                {
                    wasFirstSearchHit &&
                    <>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="card shadow-sm">
                                    <div className="card-header">
                                        <i className="fa fa-filter"></i>
                                        <span className="ms-2">Filtry</span>
                                    </div>
                                    <div className="card-body">
                                        <form id="search-form" onSubmit={handleSearchFormSubmit}>
                                            <div className="mb-2">
                                                Nazwa:
                                            </div>
                                            <div className="mb-2">
                                                <input type="text" name="name" id="name" className="form-control"
                                                    value={searchRequest.name} onChange={(e) => setSearchRequest({
                                                        ...searchRequest,
                                                        name: e.target.value
                                                    })} maxLength={512}/>
                                            </div>

                                            <div className="mb-2">
                                                Zakres cenowy:
                                            </div>
                                            <div className="mb-2">
                                                <div className="d-flex align-items-center flex-row gap-2">
                                                    <div className="flex-grow-1">
                                                        <div className="input-group">
                                                            <input type="number" name="dailyPriceFrom" id="dailyPriceFrom" className="form-control" step="0.01"
                                                                value={searchRequest.dailyPriceFrom ?? ''} onChange={(e) => setSearchRequest({
                                                                    ...searchRequest,
                                                                    dailyPriceFrom: e.target.value === '' ? undefined : +e.target.value
                                                                })} min={0}/>
                                                            <div className="input-group-text">zł</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        -
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="input-group">
                                                            <input type="number" name="dailyPriceTo" id="dailyPriceTo" className="form-control" step="0.01"
                                                                value={searchRequest.dailyPriceTo ?? ''} onChange={(e) => setSearchRequest({
                                                                    ...searchRequest,
                                                                    dailyPriceTo: e.target.value === '' ? undefined : +e.target.value
                                                                })} min={0}/>
                                                            <div className="input-group-text">zł</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                Zakres ocen:
                                            </div>
                                            <div className="mb-2">
                                                <div className="d-flex align-items-center flex-row gap-2">
                                                    <div className="flex-grow-1">
                                                        <div className="input-group">
                                                            <input type="number" name="ratingFrom" id="ratingFrom" className="form-control" min="1" max="5"
                                                                value={searchRequest.ratingFrom ?? ''} onChange={(e) => setSearchRequest({
                                                                    ...searchRequest,
                                                                    ratingFrom: e.target.value === '' ? undefined : +e.target.value
                                                                })}/>
                                                            <div className="input-group-text">
                                                                <i className="fa fa-star-o"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        -
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="input-group">
                                                            <input type="number" name="ratingTo" id="ratingTo" className="form-control" min="1" max="5"
                                                                value={searchRequest.ratingTo ?? ''} onChange={(e) => setSearchRequest({
                                                                    ...searchRequest,
                                                                    ratingTo: e.target.value === '' ? undefined : +e.target.value
                                                                })}/>
                                                            <div className="input-group-text">
                                                                <div className="fa fa-star-o"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="card-footer d-flex justify-content-end">
                                        <button className="btn btn-primary" type="submit" form="search-form">
                                            <i className="fa fa-search"></i>
                                            <span className="ms-2">Filtruj</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti fuga voluptatum et neque blanditiis porro dicta odio a corrupti in inventore, impedit aliquid rem iste doloribus illo libero voluptatibus numquam.
                                Nihil corporis velit assumenda consequuntur inventore architecto adipisci libero odio quod labore, reiciendis ratione illo quaerat placeat consectetur molestias ab quasi eveniet, quae ut sequi, quos accusamus. Quae, accusantium? Autem?
                                Pariatur quaerat officiis corrupti sequi, dolorem quasi impedit omnis eaque minima consequuntur nihil assumenda quae. Corrupti debitis, sit possimus nemo unde nobis repellat rerum delectus facere quos accusamus neque itaque?
                                Vitae veniam enim quasi ullam harum sit doloribus illo, ea tempora et dolore repellendus odio modi accusantium quos ipsa, veritatis sequi? Autem suscipit aliquid saepe quos corrupti inventore dolore reiciendis.
                                Deleniti maiores quia obcaecati molestiae sit, repellendus possimus quibusdam. Fuga delectus libero hic provident at rem odit beatae facere nobis sed possimus optio similique, cum placeat id voluptates sit omnis.
                                Quis labore consequuntur temporibus soluta. Nemo mollitia ipsam adipisci eum officiis in. Ex nesciunt odit delectus? Cum nihil ipsam aut deleniti ipsa, architecto possimus veniam, recusandae iste accusamus alias debitis.
                                Possimus, voluptatem! Ad cumque modi, error, illo quia sapiente corrupti voluptatem pariatur eligendi, veritatis quibusdam. Est, porro commodi? Libero tempora similique unde mollitia cumque voluptatibus iusto officiis doloribus corporis at!
                                Voluptas, quidem quas unde earum quos sunt soluta magnam et tempore! Facere esse minima voluptas modi maiores. Aliquid praesentium maiores beatae suscipit minus a vel, dignissimos pariatur, corporis fugiat quibusdam.
                                Omnis, assumenda consectetur accusamus iure optio sapiente eveniet nostrum quibusdam delectus nemo consequuntur quisquam repellendus sint sunt quasi maiores nam reiciendis quos ipsam fugit soluta atque modi. Numquam, impedit magnam.
                                Nesciunt ratione voluptas, maxime tempore cupiditate provident? Vel libero excepturi minus doloribus consequuntur eum adipisci et dolorum odit temporibus. Dignissimos accusamus natus iure eligendi inventore eos eum vero sunt aperiam.
                                Nemo eius similique nulla? Optio assumenda ab reiciendis soluta? Sed saepe repudiandae recusandae earum ut dignissimos possimus doloremque placeat, vel sint hic aliquid, voluptatem dolores similique perspiciatis libero, alias quidem.
                                Quae, illo. Dolorum quam nemo minus, iure magnam iste tempore! Modi distinctio ipsa, voluptate aliquid eos itaque vero ab architecto obcaecati nihil. Tempora quia accusamus, dolor hic consectetur quam porro!
                                Dolor corporis quasi tempore dolores sapiente dolore optio facere impedit beatae id, minus, ab nam quibusdam assumenda unde vel quis doloremque rem? Ab animi consequatur obcaecati in incidunt? Doloribus, necessitatibus?
                                Enim dicta nisi perspiciatis laudantium repellendus repudiandae cum, temporibus molestias vitae fugiat modi beatae, ipsam nam accusamus asperiores autem et placeat sapiente officia illum minus, aperiam minima reiciendis? Velit, perferendis.
                                Aliquid corporis ipsam possimus et repudiandae alias voluptatibus deleniti totam quasi. Nam maiores dolorum sunt quaerat nobis aliquid illum ab. Necessitatibus cum repudiandae repellat ad nisi aliquam ipsam corrupti nemo.
                                Deserunt modi minus dignissimos explicabo quibusdam mollitia dolore praesentium unde assumenda illum. Quisquam ea molestias deleniti ipsam obcaecati accusamus velit nulla vitae facere! Consectetur asperiores aperiam eius, at magni explicabo?
                                Illum praesentium maiores ipsam. Dolores error vel iure. Quod esse eos sapiente vitae animi debitis quia nihil itaque distinctio temporibus consequuntur quam harum, at rerum ipsa id quos placeat laborum.
                                Modi illo ullam, quidem inventore quos praesentium ut doloribus, quod architecto atque placeat quo error aliquam impedit perferendis consequuntur tenetur nisi. Illo eaque, in ipsum consequuntur ut perspiciatis non debitis.
                            </div>
                        </div>
                    </>
                }
            </div>

            {isLoading && <Loader/>}

            <BzRentalFooter/>
        </>
    );
}