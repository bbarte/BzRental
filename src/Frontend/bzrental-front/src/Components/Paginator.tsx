import type React from "react";
import type IPaginatedList from "../DAL/Shared/Models/IPaginatedList";
import type IPaginationParameters from "../DAL/Shared/Models/IPaginationParameters";

export type PaginatorProps = {
    parameters: IPaginationParameters,
    list: IPaginatedList<any>,
    setParameters: React.Dispatch<React.SetStateAction<IPaginationParameters>>,
    className?: string | null
};

export function Paginator({parameters, list, setParameters, className}: PaginatorProps) {
    function handleGoToFirstPage() {
        if (parameters.pageNumber === 1)
            return;

        setParameters(prev => ({
            ...prev,
            pageNumber: 1
        }));
    }
    
    function handleGoToPrevPage() {
        if (parameters.pageNumber === 1)
            return;

        setParameters(prev => ({
            ...prev,
            pageNumber: prev.pageNumber - 1
        }));
    }
    
    function handleGoToNextPage() {
        if (!list.hasNextPage)
            return;

        setParameters(prev => ({
            ...prev,
            pageNumber: prev.pageNumber + 1
        }));
    }

    return (
        <div className={`d-flex align-items-center flex-wrap gap-3 ${className}`}>
          <ul className="pagination m-0">
            <li className="page-item">
                <a style={{cursor: 'pointer'}} className="page-link" onClick={handleGoToFirstPage}>
                    <i className="fa fa-step-backward"></i>
                    {/* <span className="ms-2">Pierwsza</span> */}
                </a>
            </li>
            <li className="page-item">
                <a style={{cursor: 'pointer'}} className={`page-link ${parameters.pageNumber > 1 ? '' : 'disabled'}`} onClick={handleGoToPrevPage}>
                    <i className="fa fa-arrow-left"></i>
                    <span className="ms-2">Poprzednia</span>
                </a>
            </li>
            <li className="page-item">
                <a style={{cursor: 'pointer'}} className={`page-link ${list.hasNextPage ? '' : 'disabled'}`} onClick={handleGoToNextPage}>
                    <i className="fa fa-arrow-right"></i>
                    <span className="ms-2">Następna</span>
                </a>
            </li>
          </ul>
          <div>
            strona&nbsp;{parameters.pageNumber}
          </div>
        </div>
    )
}