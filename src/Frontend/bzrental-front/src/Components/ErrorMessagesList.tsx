export type ErrorMessagesListProps = {
    errors: string[],
    className: string
}

export function ErrorMessagesList({errors, className}: ErrorMessagesListProps) {
    if (errors.length === 0)
        return null;

    return (
        <>
            <div className={`bg-danger-subtle bg-gradient border border-danger p-3 rounded shadow-sm slide-in ${className}`}>
                <div className="container">
                    <ul className="m-0 ps-3">
                        {
                            errors.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}