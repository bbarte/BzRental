export type RatingPresenterProps = {
    rating: number,
    className?: string | null
}

export function RatingPresenter({rating, className}: RatingPresenterProps) {
    if (rating == 0) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
            </div>
        );
    }
    else if (rating >= 0.5 && rating < 1) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star-half-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
            </div>
        );
    }
    else if (rating >= 1 && rating < 1.5) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
            </div>
        );
    }
    else if (rating >= 1.5 && rating < 2) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star-half-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
            </div>
        );
    }
    else if (rating >= 2 && rating < 2.5) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
            </div>
        );
    }
    else if (rating >= 2.5 && rating < 3) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star-half-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
            </div>
        );
    }
    else if (rating >= 3 && rating < 3.5) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
            </div>
        );
    }
    else if (rating >= 3.5 && rating < 4) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star-half-o text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
            </div>
        );
    }
    else if (rating >= 4 && rating < 4.5) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star-o text-dark"></span>
            </div>
        );
    }
    else if (rating >= 4.5 && rating < 5) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star-half-o text-dark"></span>
            </div>
        );
    }
    else if (rating >= 5) {
        return (
            <div className={`${className}`}>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
                <span className="fa fa-star text-dark"></span>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            <span className="fa fa-star-o text-dark"></span>
            <span className="fa fa-star-o text-dark"></span>
            <span className="fa fa-star-o text-dark"></span>
            <span className="fa fa-star-o text-dark"></span>
            <span className="fa fa-star-o text-dark"></span>
        </div>
    );
}