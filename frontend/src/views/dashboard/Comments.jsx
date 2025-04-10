import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useBlog } from '../../hooks/useBlog';
import { AppContext } from '../../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CommentItem = ({ comment, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { getReplies, addReply, loading } = useBlog();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { isLoggedin } = useContext(AppContext);

  const fetchReplies = async () => {
    setLoadingReplies(true);
    const result = await getReplies(comment.id);
    setReplies(result);
    setLoadingReplies(false);
    setShowReplies(true);
  };

  const toggleReplies = () => {
    if (!showReplies && replies.length === 0) {
      fetchReplies();
    } else {
      setShowReplies(!showReplies);
    }
  };

  const handleReply = async (data) => {
    const result = await addReply(comment.id, data.comment);
    if (result) {
      setShowReplyForm(false);
      reset();
      fetchReplies();
    }
  };

  return (
    <div className="border-l-4 border-gray-200 pl-4 mb-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-medium">{comment.user?.username || 'Anonymous'}</span>
          <span className="text-gray-500 text-sm ml-2">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        {isLoggedin && (
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Reply
          </button>
        )}
      </div>
      
      <div className="text-gray-700 mb-2">{comment.comment}</div>
      
      {replies.length > 0 || comment.get_replies?.length > 0 ? (
        <button 
          onClick={toggleReplies} 
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center"
        >
          {showReplies ? 'Hide replies' : 'Show replies'} 
          <span className="ml-1">({replies.length || comment.get_replies?.length})</span>
        </button>
      ) : null}
      
      {showReplyForm && (
        <form onSubmit={handleSubmit(handleReply)} className="mb-4">
          <textarea
            {...register('comment', { required: 'Reply cannot be empty' })}
            className="w-full border rounded p-2 text-sm"
            placeholder="Write a reply..."
            rows={2}
          />
          {errors.comment && (
            <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>
          )}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="mr-2 px-3 py-1 text-xs text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
            >
              {loading ? <LoadingSpinner /> : 'Reply'}
            </button>
          </div>
        </form>
      )}
      
      {loadingReplies && (
        <div className="py-2">
          <LoadingSpinner />
        </div>
      )}
      
      {showReplies && replies.length > 0 && (
        <div className="ml-4 mt-4">
          {replies.map(reply => (
            <div key={reply.id} className="border-l-4 border-gray-100 pl-4 mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="font-medium">{reply.user?.username || 'Anonymous'}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(reply.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-gray-700">{reply.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Comments = ({ blogId }) => {
  const { getComments, addComment, loading } = useBlog();
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { isLoggedin } = useContext(AppContext);

  useEffect(() => {
    const fetchComments = async () => {
      const result = await getComments(blogId);
      setComments(result);
      setLoadingComments(false);
    };
    
    fetchComments();
  }, [blogId]);

  const onSubmit = async (data) => {
    const result = await addComment(blogId, data.comment);
    if (result) {
      reset();
      // Refresh comments
      const updatedComments = await getComments(blogId);
      setComments(updatedComments);
    }
  };

  return (
    <div>
      {isLoggedin && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <textarea
            {...register('comment', { required: 'Comment cannot be empty' })}
            className="w-full border rounded-md p-3"
            placeholder="Write a comment..."
            rows={4}
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
          )}
          <div className="mt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {loading ? <LoadingSpinner /> : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      {loadingComments ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : comments.length > 0 ? (
        <div>
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default Comments;