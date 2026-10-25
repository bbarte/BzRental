import type { ReactNode } from "react";

export type ModalProps = {
    title: string,
    isOpened: boolean,
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>
    children: ReactNode,
    footerChildren?: ReactNode | null,
    className?: string | null
};

export function Modal({title, setIsOpened, isOpened, children, footerChildren, className}: ModalProps) {
    if (!isOpened)
        return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div
                className="modal fade show d-block"
                tabIndex={-1}
                role="dialog"
            >

                <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${className}`}>
                    <div className="modal-content shadow slide-in">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button className="btn-close" onClick={() => setIsOpened(false)}></button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        {
                            footerChildren != null &&
                            <div className="modal-footer">
                                {footerChildren}
                            </div>
                        }
                    </div>
                </div>

            </div>
        </>
    )
}