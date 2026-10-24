import type { ReactNode } from "react";

export type ModalProps = {
    title: string,
    isOpened: boolean,
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>
    children: ReactNode,
    footerChildren: ReactNode
};

export function Modal({title, setIsOpened, isOpened, children, footerChildren}: ModalProps) {
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

                <div className="modal-dialog modal-dialog-centered modal-dialog scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button className="btn-close" onClick={() => setIsOpened(false)}></button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        <div className="modal-footer">
                            {footerChildren}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}