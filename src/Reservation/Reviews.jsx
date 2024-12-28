import { useState, useEffect } from 'react'
import { AiFillStar } from 'react-icons/ai'

function Reviews({ id }) {
    const [review, setReview] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [showAll, setShowAll] = useState(false)
    const reviewsToShow = showAll ? review : review.slice(0, 2)

    useEffect(() => {
        const fetchCarReview = async () => {
        try {
            const response = await fetch(`http://localhost/drive-go/backend/cars/review.php?carID=${id}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            if (!response.ok) {
                throw new Error("Failed to fetch Car review")
            }
            const data = await response.json()
            if (data.error) {
                throw new Error(data.error)
            }

            setReview(data.data)
            setTimeout(() => {
                setLoading(false)
            }, 2000)
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
        }

        fetchCarReview()
    }, [id])

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
            {error ? (
                <div className="text-gray-500 text-center">
                    <p>{error}</p>
                </div>
            ) : loading ? (
                <div className="flex justify-center items-center">
                    <div
                        className="flex items-center mt-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                    >
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                        </span>
                    </div>
                </div>
            ) : (
                <>
                    <h2 className="text-lg sm:text-2xl font-bold mb-4">
                        Reviews{" "}
                        <span className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded text-sm sm:text-base">
                        {review.length}
                        </span>
                    </h2>
                    <div className="space-y-4">
                        {reviewsToShow.map((review, index) => (
                        <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <div className="bg-gray-300 rounded-full h-8 w-8 sm:h-10 sm:w-10"></div>
                                    <p className="font-bold text-sm sm:text-base">
                                    {review.full_name}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1 sm:gap-2 ml-auto">
                                    <p className="text-gray-500 text-xs sm:text-sm">
                                    {review.review_date}
                                    </p>
                                    <div className="flex">
                                    {[...Array(5)].map((_, starIndex) => (
                                        <AiFillStar
                                        key={starIndex}
                                        className={`text-base sm:text-lg ${
                                            starIndex < review.rating
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                        }`}
                                        />
                                    ))}
                                    </div>
                                </div>
                            </div>
                            <p className="mt-2 pl-8 text-gray-700 text-sm sm:text-base">
                            {review.comment}
                            </p>
                        </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg mt-4 text-sm sm:text-base"
                    >
                        {showAll ? "Show Less" : "Show All"}
                    </button>
                </>
            )}
        </div>
    )
}

export default Reviews
