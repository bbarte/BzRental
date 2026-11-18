import { useEffect, useState } from "react";
import type IProductAdminDto from "../DAL/Products/Dtos/IProductAdminDto"
import type IPaginationParameters from "../DAL/Shared/Models/IPaginationParameters";
import type IPaginatedList from "../DAL/Shared/Models/IPaginatedList";
import ProductsAdminService from "../DAL/Products/Services/ProductsAdminService";
import type IProductCategoryMinimalDto from "../DAL/Products/Dtos/IProductCategoryMinimalDto";
import ProductsSelectingService from "../DAL/Products/Services/ProductsSelectingService";
import Loader from "./Loader";
import { Paginator } from "./Paginator";
import { ImageFromApi } from "./ImageFromApi";

export type PickProductDialogProps = {
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
    handlePick: (product: IProductAdminDto) => any
};

export function PickProductDialog({setIsOpened, handlePick}: PickProductDialogProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [pagination, setPagination] = useState<IPaginationParameters>({
        pageNumber: 1,
        pageSize: 25
    });

    const [categories, setCategories] = useState<IProductCategoryMinimalDto[]>([]);

    const [filter, setFilter] = useState<string>('');
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const [products, setProducts] = useState<IPaginatedList<IProductAdminDto>>({
        pageNumber: 1,
        pageSize: 25,
        hasNextPage: false,
        items: []
    });

    useEffect(() => {
        refreshCategories();
    }, []);

    useEffect(() => {
        refreshData();
    }, [pagination.pageNumber, categoryId]);

    async function refreshCategories() {
        setIsLoading(true);

        const cats = await ProductsSelectingService.getCategories();

        setCategories([
            {
                id: 0,
                name: '(wszystkie kategorie)'
            },
            ...cats
        ]);

        setIsLoading(false);
    }

    async function refreshData() {
        setIsLoading(true);

        setProducts(await ProductsAdminService.getProducts(
            pagination,
            filter,
            categoryId,
            false,
            ''
        ));

        setIsLoading(false);
    }

    async function handleSearchFormSubmit(e: any) {
        e.preventDefault();

        await refreshData();
    }

    function handlePickBtnClick(prod: IProductAdminDto) {
        handlePick(prod);
        setIsOpened(false);
    }

    return (
        <>
            <div className="loader-host">
                <div className="d-flex flex-row align-items-center justify-content-between mb-3 gap-2">
                    <div className="flex-grow-1">
                        <form onSubmit={handleSearchFormSubmit}>
                            <input type="search" name="search" id="search" className="form-control"
                                placeholder="Szukaj..." value={filter} onChange={(e) => setFilter(e.target.value)}/>
                        </form>
                    </div>
                    <div className="flex-shrink-0">
                        <select name="categoryId" id="categoryId" className="form-select"
                            value={categoryId === null ? 0 : categoryId}
                            onChange={(e) => {
                                if (e.target.value === '0') {
                                    setCategoryId(null);
                                } else {
                                    setCategoryId(+e.target.value);
                                }
                            }}>
                            {
                                categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="fit align-middle">Obrazek</th>
                            <th className="align-middle">Nazwa</th>
                            <th className="fit align-middle">Kategoria</th>
                            <th className="fit"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.items.map(prod => (
                                <tr key={prod.id}>
                                    <td className="fit align-middle">
                                        <ImageFromApi fileName={prod.firstImageFileName} style={{width: '70px'}}/>
                                    </td>
                                    <td className="align-middle">{prod.name}</td>
                                    <td className="fit align-middle">{prod.categoryName}</td>
                                    <td className="fit text-center align-middle">
                                        <button className="btn btn-outline-primary" onClick={() => handlePickBtnClick(prod)}>
                                            <i className="fa fa-chevron-circle-right"></i>
                                            <span className="ms-2">Wybierz</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <Paginator
                    parameters={pagination}
                    list={products}
                    setParameters={setPagination}/>

                {isLoading && <Loader/>}
            </div>
        </>
    );
}