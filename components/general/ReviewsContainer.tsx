import { addReview, deleteReview, fetchReviewsByProduct, updateReview } from '@/lib/api/review';
import { showNotification } from '@/redux/NotificationSlice';
import { Review } from '@/types/Review';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Button } from './Button';
import { ConfirmationModal } from '../modals/ConfirmationModal';

const ReviewsContainer = ({ productId, userId }: { productId: number, userId?: number }) => {
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [rating, setRating] = useState(0)
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [comment, setComment] = useState("")
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [editRating, setEditRating] = useState<number>(0);
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [editComment, setEditComment] = useState<string>('');

    const { data: reviews = [] } = useQuery<Review[]>({
        queryKey: ['review', productId],
        queryFn: () => fetchReviewsByProduct(productId),
    });

    const addReviewMutation = useMutation({
        mutationFn: addReview,
        onSuccess: () => {
            dispatch(showNotification({ message: 'Review added!', type: 'success' }));
            queryClient.invalidateQueries({ queryKey: ['review', productId] });
            queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
            setRating(0);
            setComment('');
        },
        onError: () => {
            dispatch(showNotification({ message: 'Failed to add review', type: 'error' }));
        },
    });

    const updateReviewMutation = useMutation({
        mutationFn: updateReview,
        onSuccess: () => {
            dispatch(showNotification(({ message: 'Review updated!', type: 'success' })));
            queryClient.invalidateQueries({ queryKey: ['review', productId] });
            queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
            setRating(0);
            setComment('');
        },
        onError: () => {
            dispatch(showNotification({ message: 'Failed to update review', type: 'error' }));
        },
    });

    const removeReviewMutation = useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            dispatch(showNotification({ message: 'Review deleted!', type: 'success' }));
            queryClient.invalidateQueries({ queryKey: ['review', productId] });
            queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
        },
        onError: () => {
            dispatch(showNotification({ message: 'Failed to delete review', type: 'error' }));
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return dispatch(showNotification({ message: 'You must be logged in to submit a review', type: 'error' }));
        if (rating === 0 || comment.trim() === '')
            return dispatch(showNotification({ message: 'Please provide a rating and comment', type: 'error' }));
        if (hasUserReviewed) return dispatch(showNotification({ message: 'You have already reviewed this product', type: 'error' }));

        addReviewMutation.mutate({
            productId: productId,
            userId: userId,
            rating,
            comment: comment.trim(),
        });
    };


    const hasUserReviewed = userId
        ? reviews.some(r => r.userId === userId)
        : false;

    const handleDeleteConfirmation = () => {
        if (!selectedReviewId) return;
        removeReviewMutation.mutate(selectedReviewId);
        setShowConfirmationModal(false);
    };

    const isReviewOwner = (reviewUserId: number) => {
        if (!userId) return false;
        return Number(userId) === reviewUserId;
    };

    return (
        <div className='flex flex-col gap-4'>
            <h2 className='title-text'>Customer Reviews</h2>
            {userId ? (
                hasUserReviewed ? (
                    <p className="mb-8 rounded bg-yellow-100 p-4 font-semibold text-yellow-800">
                        You have already submitted a review for this product.
                    </p>
                ) : (
                    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Your rating <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-6 w-6 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-gray-300'} transition-colors duration-300`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Your review <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    className="w-full resize-none rounded-lg border border-gray-300 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    rows={5}
                                    placeholder="Share your thoughts..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                text={addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                                isLoading={addReviewMutation.isPending}
                                type="submit"
                                disabled={rating === 0 || addReviewMutation.isPending}
                            />
                        </form>
                    </div>
                )
            ) : (
                <p className="mb-8 rounded bg-blue-100 p-4 font-semibold text-blue-800">
                    Please login to submit a review.
                </p>
            )}
            <ConfirmationModal
                confirmButtonVariant="danger"
                onClose={() => setShowConfirmationModal(false)}
                isOpen={showConfirmationModal}
                onConfirm={handleDeleteConfirmation}
                description="Are you sure want to delete this review?"
                title="Delete Review"
            />
            <div className="mt-8">
                <h3 className="mb-6 text-2xl font-bold text-gray-800">Customer Reviews</h3>
                {reviews.length === 0 ? (
                    <p className="text-gray-600 italic">
                        No reviews yet. Be the first to share your experience!
                    </p>
                ) : (
                    <div className="space-y-6">
                        {reviews.map(r => (
                            <div
                                key={r.id}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        {r.userId && (
                                            <span className="font-semibold text-gray-800">
                                                {r.user.name}
                                            </span>
                                        )}
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`h-5 w-5 ${star <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </span>
                                        {r.user && isReviewOwner(r.userId) && (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setMenuOpenId(menuOpenId === r.id ? null : r.id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    ⋮
                                                </button>
                                                {menuOpenId === r.id && (
                                                    <div className="absolute right-0 z-10 mt-2 w-28 rounded border border-gray-300 bg-white shadow-md">
                                                        <button
                                                            onClick={() => {
                                                                setEditingReviewId(r.id);
                                                                setEditRating(r.rating);
                                                                setEditComment(r.comment);
                                                                setMenuOpenId(null);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedReviewId(r.id);
                                                                setShowConfirmationModal(true);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Editable Form */}
                                {editingReviewId === r.id ? (
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            if (!editRating || editComment.trim() === '')
                                                return dispatch(showNotification({ message: 'Rating and comment are required', type: 'error' }));

                                            updateReviewMutation.mutate(
                                                {
                                                    id: r.id,
                                                    dataToSend: {
                                                        rating: editRating,
                                                        comment: editComment.trim(),
                                                    },
                                                },
                                                {
                                                    onSuccess: () => setEditingReviewId(null),
                                                }
                                            );
                                        }}
                                        className="space-y-4"
                                    >
                                        {/* Stars */}
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setEditRating(star)}
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`h-6 w-6 ${star <= (hoverRating || editRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-gray-300'} transition-colors duration-300`}
                                                    />
                                                </button>
                                            ))}
                                        </div>

                                        <textarea
                                            className="w-full resize-none rounded-lg border border-gray-300 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            value={editComment}
                                            onChange={e => setEditComment(e.target.value)}
                                        />

                                        <div className="flex gap-2">
                                            <Button
                                                text={updateReviewMutation.isPending ? 'Updating...' : 'Update'}
                                                isLoading={updateReviewMutation.isPending}
                                                type="submit"
                                            />
                                            <Button text="Cancel" onClick={() => setEditingReviewId(null)} />
                                        </div>
                                    </form>
                                ) : (
                                    <p className="leading-relaxed text-gray-700">{r.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReviewsContainer
