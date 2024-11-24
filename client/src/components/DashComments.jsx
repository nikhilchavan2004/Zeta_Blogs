import { Modal, Table, Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import PropTypes from 'prop-types';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        
        if (res.ok) {
          setComments(data.comments);
          setShowMore(data.comments.length >= 9);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to fetch comments');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    if (loadingMore) return;
    
    const startIndex = comments.length;
    try {
      setLoadingMore(true);
      setError(null);
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        setShowMore(data.comments.length >= 9);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to load more comments');
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDeleteComment = async () => {
    if (deleteLoading) return;
    
    try {
      setDeleteLoading(true);
      setError(null);
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to delete comment');
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!currentUser?.isAdmin) {
    return <p className='text-center py-3'>Access denied.</p>;
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-500 py-3'>
        {error}
      </div>
    );
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {comments.map((comment) => (
                <Table.Row 
                  key={comment._id}
                  className='bg-white dark:border-gray-700 dark:bg-gray-800'
                >
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div className='max-w-xs truncate'>
                      {comment.content}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>
                    <div className='max-w-xs truncate'>
                      {comment.postId}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className='max-w-xs truncate'>
                      {comment.userId}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              disabled={loadingMore}
              className='w-full text-teal-500 self-center text-sm py-7 hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loadingMore ? 'Loading...' : 'Show more'}
            </button>
          )}
        </>
      ) : (
        <p className='text-center py-3'>No comments found.</p>
      )}
      
      <Modal
        show={showModal}
        onClose={() => !deleteLoading && setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button 
                color='failure' 
                onClick={handleDeleteComment}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Yes, I\'m sure'}
              </Button>
              <Button 
                color='gray' 
                onClick={() => setShowModal(false)}
                disabled={deleteLoading}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

DashComments.propTypes = {
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    isAdmin: PropTypes.bool
  })
};