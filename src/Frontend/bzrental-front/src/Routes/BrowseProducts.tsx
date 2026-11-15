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
import type { ISearchProductsFieldValueFilter, ISearchProductsRequest } from "../DAL/Products/Requests/ISearchProductsRequest";
import type IProductFieldInfoDto from "../DAL/Products/Dtos/ProductFieldInfoDto";
import type IProductCategoryDistinctFieldValuesDto from "../DAL/Products/Dtos/IProductCategoryDistinctFieldValuesDto";
import { ProductsCategoryFieldType } from "../DAL/Products/Dtos/IProductCategoryFieldDto";

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

    const [categoryDistinctFieldValues, setCategoryDistinctFieldValues] = useState<IProductCategoryDistinctFieldValuesDto[]>([]);

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
        setCategoryDistinctFieldValues(await ProductsSelectingService.getDistinctCategoryFieldValues(+categoryId!));

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
                            <div className="col-md-3">
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
                                                <input type="text" name="name" id="name" className="form-control form-control-sm"
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
                                                        <div className="input-group input-group-sm">
                                                            <input type="number" name="dailyPriceFrom" id="dailyPriceFrom" className="form-control" step="0.01"
                                                                value={searchRequest.dailyPriceFrom ?? ''} onChange={(e) => setSearchRequest({
                                                                    ...searchRequest,
                                                                    dailyPriceFrom: e.target.value === '' ? undefined : +e.target.value
                                                                })} min={0} placeholder="od"/>
                                                            <div className="input-group-text">zł</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        -
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="input-group input-group-sm">
                                                            <input type="number" name="dailyPriceTo" id="dailyPriceTo" className="form-control" step="0.01"
                                                                value={searchRequest.dailyPriceTo ?? ''} onChange={(e) => setSearchRequest({
                                                                    ...searchRequest,
                                                                    dailyPriceTo: e.target.value === '' ? undefined : +e.target.value
                                                                })} min={0} placeholder="do"/>
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
                                                        <div className="input-group input-group-sm">
                                                            <input type="number" name="ratingFrom" id="ratingFrom" className="form-control" min="1" max="5"
                                                                value={searchRequest.ratingFrom ?? ''} onChange={(e) => setSearchRequest({
                                                                    ...searchRequest,
                                                                    ratingFrom: e.target.value === '' ? undefined : +e.target.value
                                                                })} placeholder="od"/>
                                                            <div className="input-group-text">
                                                                <i className="fa fa-star-o"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        -
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="input-group input-group-sm">
                                                            <input type="number" name="ratingTo" id="ratingTo" className="form-control" min="1" max="5"
                                                                value={searchRequest.ratingTo ?? ''} onChange={(e) => setSearchRequest({
                                                                    ...searchRequest,
                                                                    ratingTo: e.target.value === '' ? undefined : +e.target.value
                                                                })} placeholder="do"/>
                                                            <div className="input-group-text">
                                                                <div className="fa fa-star-o"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <hr />

                                            <div className="">
                                                <div className="">
                                                    {
                                                        categoryDistinctFieldValues.map(field => (
                                                            <div className="mb-2" key={field.id}>
                                                                <div className="mb-2">
                                                                    <div className="form-check">
                                                                        <input type="checkbox" name={`field-chk-${field.id}`} id={`field-chk-${field.id}`} className="form-check-input"
                                                                            checked={searchRequest.fieldValueFilters.some(x => x.fieldId === field.id)}
                                                                            onChange={(e) => {
                                                                                if (!e.target.checked) {
                                                                                    setSearchRequest({
                                                                                        ...searchRequest,
                                                                                        fieldValueFilters: searchRequest.fieldValueFilters.filter(x => x.fieldId !== field.id)
                                                                                    });
                                                                                } else {
                                                                                    setSearchRequest({
                                                                                        ...searchRequest,
                                                                                        fieldValueFilters: [
                                                                                            ...searchRequest.fieldValueFilters,
                                                                                            {
                                                                                                fieldId: field.id,
                                                                                                allowedTextValues: [],
                                                                                                exactBoolValue: false
                                                                                            }
                                                                                        ]
                                                                                    })
                                                                                }
                                                                            }}/>
                                                                        <label htmlFor={`field-chk-${field.id}`} className="form-check-label">
                                                                            {field.name}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    searchRequest.fieldValueFilters.some(x => x.fieldId === field.id) &&
                                                                    <div className="ms-4 p-2 py-0 border-start border-3 ps-3">
                                                                        {
                                                                            field.type === ProductsCategoryFieldType.Text &&
                                                                            <>
                                                                                {
                                                                                    field.items.map((item, idx) => (
                                                                                        <div className="form-check" key={idx}>
                                                                                            <input type="checkbox" name={`field-${field.id}-item-${idx}-chk`} id={`field-${field.id}-item-${idx}-chk`} className="form-check-input"
                                                                                                checked={
                                                                                                    searchRequest.fieldValueFilters
                                                                                                        .find(x => x.fieldId === field.id)
                                                                                                        ?.allowedTextValues.some(x => x === item) ?? false
                                                                                                }
                                                                                                onChange={(e) => {
                                                                                                    const isChecked = e.target.checked;

                                                                                                    setSearchRequest({
                                                                                                        ...searchRequest,
                                                                                                        fieldValueFilters: searchRequest.fieldValueFilters.map(filter =>
                                                                                                            filter.fieldId === field.id
                                                                                                            ? {
                                                                                                                ...filter,
                                                                                                                allowedTextValues: isChecked
                                                                                                                    ? [...filter.allowedTextValues, item]
                                                                                                                    : filter.allowedTextValues.filter(x => x !== item)
                                                                                                            }
                                                                                                            : filter
                                                                                                        )
                                                                                                    })
                                                                                                }}/>
                                                                                            <label htmlFor={`field-${field.id}-item-${idx}-chk`} className="form-check-label">
                                                                                                {
                                                                                                    item.trim() === '' ? '(pusta wartość)' : `${item} ${field.unitName ?? ''}`
                                                                                                }
                                                                                            </label>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </>
                                                                        }
                                                                        {
                                                                            field.type === ProductsCategoryFieldType.Boolean &&
                                                                            <>
                                                                                <select name={`field-${field.id}-bool-select`} id={`field-${field.id}-bool-select`} className="form-select form-select-sm"
                                                                                    value={
                                                                                        searchRequest.fieldValueFilters.find(x => x.fieldId === field.id)!.exactBoolValue === undefined
                                                                                            ? '0'
                                                                                            : searchRequest.fieldValueFilters.find(x => x.fieldId === field.id)!.exactBoolValue === false
                                                                                                ? '0'
                                                                                                : '1'
                                                                                    }
                                                                                    onChange={(e) => {
                                                                                        const bValue = e.target.value === '0' ? false : true;

                                                                                        setSearchRequest({
                                                                                            ...searchRequest,
                                                                                            fieldValueFilters: searchRequest.fieldValueFilters.map(filter =>
                                                                                                filter.fieldId === field.id
                                                                                                ? {
                                                                                                    ...filter,
                                                                                                    exactBoolValue: bValue
                                                                                                }
                                                                                                : filter
                                                                                            )
                                                                                        })
                                                                                    }}>
                                                                                    <option value="0">nie</option>
                                                                                    <option value="1">tak</option>
                                                                                </select>
                                                                            </>
                                                                        }
                                                                        {
                                                                            (field.type === ProductsCategoryFieldType.Integer || field.type === ProductsCategoryFieldType.Decimal) &&
                                                                            <>
                                                                                <div className="input-group input-group-sm mb-2">
                                                                                    <input type="number" name={`field-${field.id}-exact-number`} id={`field-${field.id}-exact-number`} className="form-control form-control-sm" placeholder="dokładna wartość" step="0.01"
                                                                                        value={
                                                                                            searchRequest.fieldValueFilters.find(x => x.fieldId === field.id)!
                                                                                                .exactNumberValue ?? ''
                                                                                        }
                                                                                        onChange={(e) => {
                                                                                            setSearchRequest({
                                                                                                ...searchRequest,
                                                                                                fieldValueFilters: searchRequest.fieldValueFilters.map(filter =>
                                                                                                    filter.fieldId === field.id
                                                                                                    ? {
                                                                                                        ...filter,
                                                                                                        exactNumberValue: e.target.value === '' ? undefined : +e.target.value
                                                                                                    }
                                                                                                    : filter
                                                                                                )
                                                                                            })
                                                                                        }}/>
                                                                                    
                                                                                    {
                                                                                        field.unitName?.trim() !== '' &&
                                                                                        <div className="input-group-text">
                                                                                            {field.unitName}
                                                                                        </div>
                                                                                    }
                                                                                </div>

                                                                                <div className="d-flex align-items-center flex-row gap-2">
                                                                                    <div className="flex-grow-1">
                                                                                        <input type="number" name={`field-${field.id}-number-from`} id={`field-${field.id}-number-from`} className="form-control form-control-sm" placeholder="od"
                                                                                            value={
                                                                                                searchRequest.fieldValueFilters.find(x => x.fieldId === field.id)!
                                                                                                    .numberValueFrom ?? ''   
                                                                                            }
                                                                                            onChange={(e) => {
                                                                                                setSearchRequest({
                                                                                                    ...searchRequest,
                                                                                                    fieldValueFilters: searchRequest.fieldValueFilters.map(filter =>
                                                                                                        filter.fieldId === field.id
                                                                                                        ? {
                                                                                                            ...filter,
                                                                                                            numberValueFrom: e.target.value === '' ? undefined : +e.target.value
                                                                                                        }
                                                                                                        : filter
                                                                                                    )
                                                                                                })
                                                                                            }}/>
                                                                                    </div>
                                                                                    <div className="flex-shrink-0">
                                                                                        -
                                                                                    </div>
                                                                                    <div className="flex-grow-1">
                                                                                        <input type="number" name={`field-${field.id}-number-to`} id={`field-${field.id}-number-to`} className="form-control form-control-sm" placeholder="do"
                                                                                            value={
                                                                                                searchRequest.fieldValueFilters.find(x => x.fieldId === field.id)!
                                                                                                    .numberValueTo ?? ''
                                                                                            }
                                                                                            onChange={(e) => {
                                                                                                setSearchRequest({
                                                                                                    ...searchRequest,
                                                                                                    fieldValueFilters: searchRequest.fieldValueFilters.map(filter =>
                                                                                                        filter.fieldId === field.id
                                                                                                        ? {
                                                                                                            ...filter,
                                                                                                            numberValueTo: e.target.value === '' ? undefined : +e.target.value
                                                                                                        }
                                                                                                        : filter
                                                                                                    )
                                                                                                })
                                                                                            }}/>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        }
                                                                    </div>
                                                                }
                                                            </div>
                                                        ))
                                                    }
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
                            <div className="col-md-9">
                                
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