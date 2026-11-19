import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import AuthService from "../DAL/Auth/Services/AuthService";
import { BzRentalNavbar } from "../Components/Layout/BzRentalNavbar";
import BzRentalFooter from "../Components/Layout/BzRentalFooter";
import Loader from "../Components/Loader";
import type IProductDetailsDto from "../DAL/Products/Dtos/IProductDetailsDto";
import type IProductFieldInfoDto from "../DAL/Products/Dtos/ProductFieldInfoDto";
import ProductsSelectingService from "../DAL/Products/Services/ProductsSelectingService";
import { RatingPresenter } from "../Components/RatingPresenter";
import { ImageFromApi } from "../Components/ImageFromApi";
import { ProductsCategoryFieldType } from "../DAL/Products/Dtos/IProductCategoryFieldDto";
import type IAddUpdateProductReviewRequest from "../DAL/Products/Requests/IAddUpdateProductReviewRequest";
import type IPaginationParameters from "../DAL/Shared/Models/IPaginationParameters";
import type IPaginatedList from "../DAL/Shared/Models/IPaginatedList";
import type IProductReviewDto from "../DAL/Products/Dtos/IProductReviewDto";
import ProductUserReviewsService from "../DAL/Products/Services/ProductUserReviewsService";
import { Paginator } from "../Components/Paginator";
import { InfoMessagesList } from "../Components/InfoMessagesList";
import type IIsProductRentedByUserDto from "../DAL/Products/Dtos/IIsProductRentedByUserDto";
import type IPlanProductRentingRequest from "../DAL/ProductsRenting/Requests/IPlanProductRentingRequest";
import { type IProductAvailabilityDto } from "../DAL/Products/Dtos/IProductAvailabilityDto";
import { ErrorMessagesList } from "../Components/ErrorMessagesList";
import { ApiError } from "../DAL/ApiAccess/ApiError";
import ProductsRentingService from "../DAL/ProductsRenting/Services/ProductsRentingService";
import { ProductRentingStatus } from "../DAL/ProductsRenting/Dtos/IProductRentingDto";

export default function Product() {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    async function handleLogout(): Promise<void> { setIsUserLoggedIn(false); navigate('/'); }

    const {id} = useParams<{id: string}>();
    const [searchParams] = useSearchParams();

    const initialRentingStartDate = searchParams.get('rentingStartDate');
    const initialRentingEndDate = searchParams.get('rentingEndDate');

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [product, setProduct] = useState<IProductDetailsDto>({
        id: 0, name: '', description: '', dailyPrice: 0, categoryId: 0,
        categoryName: '', imageFileNames: [], rating: 0, reviewsCount: 0,
        fieldValues: []
    });
    const [categoryFields, setCategoryFields] = useState<IProductFieldInfoDto[]>([]);

    // opinie

    const [addUpdateReviewRequest, setAddUpdateReviewRequest] = useState<IAddUpdateProductReviewRequest>({
        rating: 3,
        content: ''
    });

    const [usersReview, setUsersReview] = useState<IProductReviewDto | undefined>(undefined);

    const [reviewsOrderBy, setReviewsOrderBy] = useState<string>('');
    const [reviewsPagination, setReviewsPagination] = useState<IPaginationParameters>({
        pageNumber: 1,
        pageSize: 25
    });
    const [reviews, setReviews] = useState<IPaginatedList<IProductReviewDto>>({
        pageNumber: 1,
        pageSize: 25,
        hasNextPage: false,
        items: []
    });

    const [reviewsInfoMessages, setReviewsInfoMessages] = useState<string[]>([]);

    // wypożyczenia

    const [isProductRentedByUser, setIsProductRentedByUser] = useState<IIsProductRentedByUserDto>({
        isIt: false,
        rentingId: 0,
        status: ''
    });

    const [planProductRentingRequest, setPlanProductRentingRequest] = useState<IPlanProductRentingRequest>({
        startDate: '',
        endDate: '',
        userComments: ''
    });

    const [rentingAvaibility, setRentingAvailibilty] = useState<IProductAvailabilityDto>({
        isAvailable: false,
        plannedRentings: []
    });

    useEffect(() => {
        refreshRentingAvaibility();
    }, [planProductRentingRequest.startDate, planProductRentingRequest.endDate]);

    const [rentingsInfoMessages, setRentingsInfoMessages] = useState<string[]>([]);
    const [rentingsErrorMessages, setRentingsErrorMessages] = useState<string[]>([]);

    async function refreshRentingAvaibility() {
        if (isProductRentedByUser.isIt ||
            !planProductRentingRequest.startDate ||
            !planProductRentingRequest.endDate
        )
        {
            return;
        }

        setRentingAvailibilty(await ProductsSelectingService.checkProductAvailability(
            +id!,
            planProductRentingRequest.startDate,
            planProductRentingRequest.endDate
        ));
    }

    // ---

    useEffect(() => {
        if (!initialRentingStartDate || !initialRentingEndDate) {
            navigate('/');
            return;
        }

        setPlanProductRentingRequest({
            ...planProductRentingRequest,
            startDate: initialRentingStartDate,
            endDate: initialRentingEndDate
        });

        refreshData();
    }, []);

    useEffect(() => {
        refreshProductReviews();
    }, [reviewsPagination.pageNumber, reviewsOrderBy])

    async function refreshData() {
        setIsLoading(true);

        const prod = await ProductsSelectingService.getProductById(+id!);

        setProduct(prod);
        setCategoryFields(await ProductsSelectingService.getCategoryFields(prod.categoryId));
        await refreshProductsRentingInfo();

        await refreshUsersReview();

        setIsLoading(false);
    }

    async function refreshProduct() {
        setProduct(await ProductsSelectingService.getProductById(+id!));
        await refreshProductsRentingInfo();
    }

    async function refreshProductsRentingInfo() {
        setIsProductRentedByUser(await ProductsSelectingService.checkIfProductIsRentedByUser(+id!));
    }

    async function refreshUsersReview() {
        try {
            const usersReview = await ProductUserReviewsService.getUsersReview(+id!);
            setUsersReview(usersReview);

            setAddUpdateReviewRequest({
                rating: usersReview.rating,
                content: usersReview.content
            });
        }
        catch {
            setUsersReview(undefined);
            setAddUpdateReviewRequest({
                rating: 3,
                content: ''
            });
        }
    }

    async function refreshProductReviews() {
        setIsLoading(true);

        setReviews(await ProductUserReviewsService.getReviews(
            +id!,
            reviewsPagination,
            reviewsOrderBy
        ));

        setIsLoading(false);
    }

    async function handleUsersReviewFormSubmit(e: any) {
        e.preventDefault();

        setReviewsInfoMessages([]);

        if (addUpdateReviewRequest.content.trim() === '')
            return;
        
        setIsLoading(true);

        if (!usersReview) {
            await ProductUserReviewsService.addReview(
                +id!,
                addUpdateReviewRequest
            );

            setReviewsInfoMessages(['Opublikowano opinię!']);

            await refreshUsersReview();
            await refreshProductReviews();
            await refreshProduct();
        } else {
            await ProductUserReviewsService.updateReview(
                usersReview.id,
                addUpdateReviewRequest
            );

            setReviewsInfoMessages(['Zaktualizowano opinię!']);

            await refreshUsersReview();
            await refreshProductReviews();
            await refreshProduct();
        }

        setIsLoading(false);
    }

    async function handleDeleteUsersReview() {
        if (!usersReview)
            return;

        if (!confirm('Czy na pewno chcesz usunąć swoją opinię'))
            return;

        setIsLoading(true);

        await ProductUserReviewsService.deleteReview(usersReview.id);

        setReviewsInfoMessages(['Usunięto opinię!']);

        await refreshUsersReview();
        await refreshProductReviews();
        await refreshProduct();

        setIsLoading(false);
    }

    async function handlePlanRentingFormSubmit(e: any) {
        e.preventDefault();

        if (isProductRentedByUser.isIt)
            return;

        setRentingsInfoMessages([]);
        setRentingsErrorMessages([]);

        refreshRentingAvaibility();

        if (!planProductRentingRequest.startDate || !planProductRentingRequest.endDate) {
            setRentingsErrorMessages(['Należy podać okres wypożyczenia!']);
            return;
        }

        if (planProductRentingRequest.startDate > planProductRentingRequest.endDate) {
            setRentingsErrorMessages(['Podane ramy czasowe są nieprawidłowe!']);
            return;
        }

        const today = new Date().toLocaleDateString('en-CA');

        if (planProductRentingRequest.startDate < today) {
            setRentingsErrorMessages(['Data rozpoczęcia nie może być przeszła!']);
            return;
        }
        
        if (planProductRentingRequest.endDate < today) {
            setRentingsErrorMessages(['Data zakończenia nie może być przeszła!']);
            return;
        }

        if (planProductRentingRequest.startDate == planProductRentingRequest.endDate) {
            setRentingsErrorMessages(['Okres wypożyczenia musi trwać co najmniej jeden dzień!']);
            return;
        }

        setIsLoading(true);

        try {
            await ProductsRentingService.planRenting(
                +id!,
                planProductRentingRequest
            );
        }
        catch (e) {
            if (e instanceof ApiError) {
                setRentingsErrorMessages(e.getTranslations([
                    {
                        code: 'ProductsRenting.AlreadyReservedByUser',
                        msg: 'Zaplanowano już wypożyczenie tego przedmiotu w tych ramach czasowych'
                    },
                    {
                        code: 'ProductsRenting.NotAvailable',
                        msg: 'Przedmiot jest niedostępny w podanych ramach czasowych'
                    }
                ]));

                return;
            }
        }
        finally {
            await refreshProductsRentingInfo();
            await refreshRentingAvaibility();

            setIsLoading(false);
        }

        setRentingsInfoMessages(['Zaplanowano wypożyczenie przedmiotu!']);
    }

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container pt-4">
                <div className="row g-3">
                    <div className="col-8">
                        <div className="carousel slide rounded shadow carousel-fade" id="mainGalleryCarousel" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {
                                    product.imageFileNames.map((path, idx) => (
                                        <div key={path} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                                            <ImageFromApi fileName={path} className="d-block w-100"/>
                                        </div>
                                    ))
                                }
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#mainGalleryCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"></span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#mainGalleryCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon"></span>
                            </button>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="card shadow-sm mb-3 bg-warning-subtle bg-gradient border border-warning">
                            <div className="card-body">    
                                <h3 className="card-title">
                                    {product.name}
                                </h3>
                                <h5 className="card-title">
                                    {product.dailyPrice} zł/dzień
                                </h5>

                                <div className="d-flex align-items-center gap-2 mt-4">
                                    <span className="badge border border-primary text-primary">{product.categoryName}</span>

                                    <RatingPresenter rating={product.rating}/>
                                    <div>
                                        <span className="fw-bold">{product.rating}</span>&nbsp;
                                        <span className="text-secondary">({product.reviewsCount})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card shadow-sm mb-3">
                            <div className="card-header">
                                <i className="fa fa-wrench"></i>
                                <span className="ms-2">Specyfikacja</span>
                            </div>
                            <div className="card-body">
                                <div className="small">
                                    {
                                        product.fieldValues.map(field => (
                                            <div className="row" key={field.id}>
                                                {
                                                    categoryFields.some(x => x.id === field.id) &&
                                                    <>
                                                        <div className="col-6">
                                                            <div className="d-flex">
                                                                <div className="text-truncate" title={categoryFields.find(x => x.id === field.id)!.name ?? ''}>
                                                                    {
                                                                        categoryFields.find(x => x.id === field.id)!.name
                                                                    }
                                                                </div>
                                                                <div>:</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            {
                                                                categoryFields.find(x => x.id === field.id)!.type === ProductsCategoryFieldType.Text &&
                                                                <>
                                                                    <div className="text-truncate" title={categoryFields.find(x => x.id === field.id)!.textValue ?? ''}>
                                                                        {
                                                                            field.textValue ?? ''
                                                                        }
                                                                        {
                                                                            categoryFields.find(x => x.id === field.id)!.unitName ?? ''
                                                                        }
                                                                    </div>
                                                                </>
                                                            }
                                                            {
                                                                (categoryFields.find(x => x.id === field.id)!.type === ProductsCategoryFieldType.Integer || categoryFields.find(x => x.id === field.id)!.type === ProductsCategoryFieldType.Decimal) &&
                                                                <>
                                                                    {
                                                                        field.numberValue ?? ''
                                                                    }
                                                                    {
                                                                        categoryFields.find(x => x.id === field.id)!.unitName ?? ''
                                                                    }
                                                                </>
                                                            }
                                                            {
                                                                categoryFields.find(x => x.id === field.id)!.type === ProductsCategoryFieldType.Boolean &&
                                                                <>
                                                                    {
                                                                        field.boolValue === undefined
                                                                            ? <i className="fa fa-times"></i>
                                                                            : field.boolValue === false
                                                                                ? <i className="fa fa-times"></i>
                                                                                : <i className="fa fa-check"></i>
                                                                    }
                                                                </>
                                                            }
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-3 mt-3">
                    <div className="col-8">
                        <div className="card shadow-sm mb-3">
                            <div className="card-header">
                                <i className="fa fa-pencil"></i>
                                <span className="ms-2">Opis</span>
                            </div>
                            <div className="card-body">
                                {product.description}
                            </div>
                        </div>
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <i className="fa fa-comments-o"></i>
                                <span className="ms-2">Opinie</span>
                            </div>
                            <div className="card-body">
                                <InfoMessagesList messages={reviewsInfoMessages} className="mb-3"/>

                                <div className="card mb-3 shadow mb-4">
                                    <div className="card-body">
                                        <form id="review-form" onSubmit={handleUsersReviewFormSubmit}>
                                            <div>
                                                <div className="d-flex gap-2 align-items-center mb-2">
                                                    <RatingPresenter rating={addUpdateReviewRequest.rating}/>
                                                    <input type="range" name="review-rating" id="review-rating" className="form-range" min="1" max="5"
                                                        style={{width: '100px'}} value={addUpdateReviewRequest.rating} onChange={(e) => {
                                                            setAddUpdateReviewRequest({
                                                                ...addUpdateReviewRequest,
                                                                rating: +e.target.value
                                                            })
                                                        }}/>
                                                </div>
                                            </div>
                                            <div>
                                                <textarea name="review-content" id="review-content" className="form-control" maxLength={1024}
                                                    value={addUpdateReviewRequest.content} onChange={(e) => {
                                                        setAddUpdateReviewRequest({
                                                            ...addUpdateReviewRequest,
                                                            content: e.target.value
                                                        })
                                                    }} placeholder="Treść..."></textarea>
                                            </div>
                                            <div>
                                                
                                            </div>
                                        </form>

                                        {
                                            usersReview !== undefined &&
                                            <div className="mt-2 small">
                                                Data publikacji: {new Date(usersReview.createdAt).toLocaleString('pl-PL')}
                                                {
                                                    usersReview.modifiedAt &&
                                                    <>
                                                        <br />
                                                        Data ostatniej edycji: {new Date(usersReview.modifiedAt).toLocaleString('pl-PL')}
                                                    </>
                                                }
                                            </div>
                                        }
                                    </div>
                                    <div className="card-footer d-flex justify-content-end gap-2">
                                        {
                                            usersReview !== undefined &&
                                            <button className="btn btn-outline-danger" onClick={handleDeleteUsersReview}>
                                                <i className="fa fa-trash"></i>
                                                <span className="ms-2">Usuń</span>
                                            </button>
                                        }
                                        <button className="btn btn-success" type="submit" form="review-form"
                                            disabled={addUpdateReviewRequest.content.trim() === ''}>
                                            <i className="fa fa-send"></i>
                                            <span className="ms-2">
                                                {
                                                    usersReview === undefined
                                                        ? 'Wystaw opinię'
                                                        : 'Zaktualizuj opinię'
                                                }
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        Średnia: {product.rating}, wszystkich: {product.reviewsCount}
                                    </div>
                                    <div>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-text text-center">
                                                <i className="fa fa-sort-amount-desc"></i>
                                            </div>
                                            <select name="orderBy" id="orderBy" className="form-select"
                                                value={reviewsOrderBy} onChange={(e) => setReviewsOrderBy(e.target.value)}>
                                                <option value="">(brak sortowania)</option>
                                                <option value="asc(rating)">Ocena: rosnąco</option>
                                                <option value="desc(rating)">Ocena: malejąco</option>
                                                <option value="asc(createdAt)">Data publikacji: rosnąco</option>
                                                <option value="desc(createdAt)">Data publikacji: malejąco</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 mb-4">
                                    {
                                        reviews.items.length === 0 &&
                                        <span>
                                            <div className="bg-warning-subtle border border-warning rounded shadow-sm p-3">
                                                Nikt inny nie wystawił jeszcze opinii temu przedmiotowi
                                            </div>
                                        </span>
                                    }
                                    {
                                        reviews.items.length > 0 &&
                                        <div className="p-2">
                                            {
                                                reviews.items.map(rev => (
                                                    <div key={rev.id} className="card mb-2">
                                                        <div className="card-body">
                                                            <div>
                                                                <div className="d-flex flex-row align-items-center justify-content-between">
                                                                    <div className="d-flex flex-row gap-2 align-items-center gap-3">
                                                                        <div className="bg bg-warning-subtle bg-gradient fs-3 d-flex align-items-center justify-content-center rounded" style={{color: '#997d2b', width: '48px', height: '48px'}}>
                                                                            {rev.createdBy[0]}
                                                                        </div>
                                                                        <div>
                                                                            <div className="fw-semibold">{rev.createdBy}</div>
                                                                            <div className="small">
                                                                                <span>{new Date(rev.createdAt).toLocaleString('pl-PL')}</span>
                                                                                {
                                                                                    rev.modifiedAt &&
                                                                                    <>
                                                                                        <span className="text-secondary ms-2">
                                                                                            <i className="fa fa-pencil"></i>
                                                                                            &nbsp;{new Date(rev.modifiedAt).toLocaleString('pl-PL')}
                                                                                        </span>
                                                                                    </>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <RatingPresenter rating={rev.rating} className="fs-5"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-3">
                                                                {rev.content}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                </div>

                                <Paginator
                                    parameters={reviewsPagination}
                                    list={reviews}
                                    setParameters={setReviewsPagination}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <i className="fa fa-handshake-o"></i>
                                <span className="ms-2">Wypożyczanie</span>
                            </div>
                            <div className="card-body">
                                <InfoMessagesList messages={rentingsInfoMessages} className="mb-2 small border"/>
                                <ErrorMessagesList errors={rentingsErrorMessages} className="mb-2 small"/>

                                {
                                    isProductRentedByUser.isIt &&
                                    <>
                                        <div className="small">
                                            <i className="fa fa-check"></i>
                                            <span className="ms-2">Ten przedmiot jest obecnie wypożyczony przez&nbsp;Ciebie</span>
                                        </div>   
                                        <hr />
                                        <div className="small">
                                            Stan wypożyczenia:&nbsp;
                                            {
                                                isProductRentedByUser.status === ProductRentingStatus.Planned &&
                                                'zaplanowane'
                                            }
                                            {
                                                isProductRentedByUser.status === ProductRentingStatus.InProgress &&
                                                'zatwierdzone, w trakcie'
                                            }
                                        </div>
                                    </>
                                }
                                {
                                    !isProductRentedByUser.isIt &&
                                    <>
                                        <form id="plan-renting-form" onSubmit={handlePlanRentingFormSubmit}>
                                            <div className="mb-2">
                                                Na okres:
                                                <div className="d-flex align-items-center flex-row gap-2 small mt-2">
                                                    <div className="flex-grow-1">
                                                        <input type="date" name="startDate" id="startDate" className="form-control form-control-sm"
                                                            value={planProductRentingRequest.startDate} onChange={(e) => setPlanProductRentingRequest({
                                                                ...planProductRentingRequest,
                                                                startDate: e.target.value
                                                            })}/>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        -
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <input type="date" name="endDate" id="endDate" className="form-control form-control-sm"
                                                            value={planProductRentingRequest.endDate} onChange={(e) => setPlanProductRentingRequest({
                                                                ...planProductRentingRequest,
                                                                endDate: e.target.value
                                                            })}/>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    {
                                                        rentingAvaibility.isAvailable &&
                                                        <div className="text-success">
                                                            <i className="fa fa-check"></i>
                                                            <span className="ms-2">Dostępne w podanych datach</span>
                                                        </div>
                                                    }
                                                    {
                                                        !rentingAvaibility.isAvailable &&
                                                        <>
                                                            <div className="text-danger mb-2">
                                                                <i className="fa fa-times"></i>
                                                                <span className="ms-2">Niedostępne w podanych datach</span>
                                                            </div>
                                                            <div className="card small">
                                                                <div className="card-header">
                                                                    <i className="fa fa-calendar"></i>
                                                                    <span className="ms-2">Najbliższe rezerwacje</span>
                                                                </div>
                                                                <div className="card-body">
                                                                    <ul className="mb-0">
                                                                        {
                                                                            rentingAvaibility.plannedRentings.map((renting, idx) => (
                                                                                <li key={idx}>
                                                                                    {new Date(renting.startDate).toLocaleDateString('pl-PL')}
                                                                                    &nbsp;-&nbsp;
                                                                                    {new Date(renting.endDate).toLocaleDateString('pl-PL')}
                                                                                </li>
                                                                            ))
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                Opcjonalne komentarze:
                                                <textarea name="rentComments" id="rentComments" className="mt-2 form-control form-control-sm" maxLength={512}
                                                    value={planProductRentingRequest.userComments} onChange={(e) => setPlanProductRentingRequest({
                                                        ...planProductRentingRequest,
                                                        userComments: e.target.value
                                                    })}></textarea>
                                            </div>
                                        </form>
                                    </>
                                }
                            </div>
                            <div className="card-footer d-flex flex-row justify-content-end">
                                {
                                    !isProductRentedByUser.isIt &&
                                    <>
                                        <button className="btn btn-success" type="submit" form="plan-renting-form"
                                            disabled={!rentingAvaibility.isAvailable}>
                                            <i className="fa fa-chevron-circle-right"></i>
                                            <span className="ms-2">Wypożycz!</span>
                                        </button>
                                    </>
                                }
                                {
                                    isProductRentedByUser.isIt &&
                                    <>
                                        <Link to='/my-rentings' className="btn btn-primary">
                                            <i className="fa fa-chevron-circle-right"></i>
                                            <span className="ms-2">Zobacz szczegóły</span>
                                        </Link>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading && <Loader/>}

            <BzRentalFooter/>
        </>
    );
}