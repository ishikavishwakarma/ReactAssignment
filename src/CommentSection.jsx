import React, { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [sortedBy, setSortedBy] = useState('upvotes');
    const [filterUser, setFilterUser] = useState('');
    const [filteredComments, setFilteredComments] = useState([]);
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        const storedComments = JSON.parse(localStorage.getItem('comments'));
        if (storedComments) {
            setComments(storedComments);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('comments', JSON.stringify(comments));
        filterAndSortComments();
    }, [comments]);

    useEffect(() => {
        filterAndSortComments();
    }, [sortedBy, filterUser]);

    const filterAndSortComments = () => {
        let filtered = [...comments];
        if (filterUser) {
            filtered = filtered.filter(comment => comment.user === filterUser);
        }

        const sortComparator = (a, b) => {
            if (sortedBy === 'upvotes') {
                return b.upvotes - a.upvotes;
            } else if (sortedBy === 'downvotes') {
                return b.downvotes - a.downvotes;
            }
            return 0;
        };

        filtered.sort(sortComparator);
        setFilteredComments(filtered);
    };

    const handleCommentSubmit = (commentText, username) => {
        const newComment = {
            id: Date.now(),
            text: commentText,
            upvotes: 0,
            downvotes: 0,
            user: username,
            timestamp: new Date().toISOString(),
            replies: [],
        };
        setComments([...comments, newComment]);
    };

    const handleVote = (commentId, isUpvote, isReply, replyId) => {
        setComments(prevComments => {
            const newComments = [...prevComments];
            const comment = newComments.find(comment => comment.id === commentId);
            if (comment) {
                if (isReply && replyId) {
                    const reply = comment.replies.find(reply => reply.id === replyId);
                    if (reply) {
                        if (isUpvote) {
                            reply.upvotes += 1;
                        } else {
                            reply.downvotes += 1;
                        }
                    }
                } else {
                    if (isUpvote) {
                        comment.upvotes += 1;
                    } else {
                        comment.downvotes += 1;
                    }
                }
            }
            return newComments;
        });
    };

    const handleReply = (commentId, replyText, username) => {
        setComments(prevComments => {
            const newComments = [...prevComments];
            const comment = newComments.find(comment => comment.id === commentId);
            if (comment) {
                const newReply = {
                    id: Date.now(),
                    text: replyText,
                    upvotes: 0,
                    downvotes: 0,
                    user: username,
                    timestamp: new Date().toISOString(),
                };
                comment.replies.push(newReply);
            }
            return newComments;
        });
    };

    return (
        <div>
            <nav className='h-20 flex items-center bg-zinc-900 justify-center w-full'>
                <h2 className='text-2xl uppercase text-white font-bold'>Comment Section</h2>
            </nav>
            <div className="div py-5 items-center justify-center flex-col flex px-10">
                <div className='w-[60vw] border-b-2 border-zinc-500 items-center px-5 justify-between flex bg-zinc-300 h-20'>
                    <div className="div w-60 flex justify-between">
                        <label className='uppercase font-bold'>Sort by:</label>
                        <select value={sortedBy} className='px-1 rounded' onChange={(e) => setSortedBy(e.target.value)}>
                            <option value="upvotes">Most Upvotes</option>
                            <option value="downvotes">Most Downvotes</option>
                        </select>
                    </div>
                    <div className="div w-80 flex justify-between">
                        <label className='uppercase font-bold'>Filter by user:</label>
                        <input type="text" className='px-1 rounded' value={filterUser} onChange={(e) => setFilterUser(e.target.value)} placeholder="Enter username" />
                    </div>
                </div>
                <div className='w-[60vw] items-center px-5 justify-between flex bg-zinc-300 h-20'>
                    <input
                        type="text"
                        className='px-1 rounded'
                        value={currentUser}
                        onChange={(e) => setCurrentUser(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <CommentForm onSubmit={handleCommentSubmit} placeholder="Add a comment" currentUser={currentUser} />
                {filteredComments.map(comment => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        onVote={handleVote}
                        onReply={handleReply}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
