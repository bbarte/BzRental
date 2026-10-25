export type InfoMessagesListProps = {
    messages: string[],
    className: string
}

export function InfoMessagesList({messages, className}: InfoMessagesListProps) {
    if (messages.length === 0)
        return null;

    return (
        <>
            <div className={`bg-success-subtle bg-gradient border border-success p-3 rounded shadow-sm slide-in ${className}`}>
                <div className="container">
                    {
                        messages.length === 1 &&
                        messages[0]
                    }
                    {
                        messages.length > 1 &&
                        <ul className="m-0 ps-3">
                            {
                                messages.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))
                            }
                        </ul>
                    }
                </div>
            </div>
        </>
    )
}