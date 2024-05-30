import React, { useState } from 'react';
import CommentForm from './CommentForm';

const Comment = (props) => {
    const { comment, onVote, onReply, currentUser } = props;
    const [showReplies, setShowReplies] = useState(false);

    const handleVote = (isUpvote, isReply, replyId) => {
        onVote(comment.id, isUpvote, isReply, replyId);
    };

    const handleReply = (replyText) => {
        onReply(comment.id, replyText, currentUser);
    };

    return (
        <div className='w-[60vw] flex flex-col gap-4'>
            <div className="head flex justify-between w-full bg-zinc-200">
                <p className='p-2 text-xl'>{comment.text} &nbsp;<span className='bg-white px-2 font-bold rounded'>{comment.user}</span> </p>
                <div>
                    <div className="mid py-2 px-5">
                        <button className='bg-white rounded px-2' onClick={() => handleVote(true)}>Upvote↑</button>
                        <button className='ml-2 bg-white rounded px-2' onClick={() => handleVote(false)}>Downvote↓</button>
                    </div>
                    <div className='py-2 px-5 flex'>
                        <div>Upvotes: {comment.upvotes}</div>
                        <div className='ml-2'>Downvotes: {comment.downvotes}</div>
                    </div>
                </div>
            </div>
            <button className='w-full mb-4 bg-zinc-200 h-10 font-bold uppercase' onClick={() => setShowReplies(!showReplies)}>
                {showReplies ? 'Hide Replies' : 'Show Replies'}
            </button>
            {showReplies && (
                <div>
                    {comment.replies.map(reply => (
                        <div key={reply.id} className="head flex justify-between w-full bg-zinc-200">
                            <p className='p-2 text-xl'>{reply.text} <span className='bg-white px-2 font-bold rounded'>{reply.user}</span> </p>
                            <div>
                                <div className="mid py-2 px-5">
                                    <button className='bg-white rounded px-2' onClick={() => handleVote(true, true, reply.id)}>Upvote↑</button>
                                    <button className='ml-2 bg-white rounded px-2' onClick={() => handleVote(false, true, reply.id)}>Downvote↓</button>
                                </div>
                                <div className='py-2 px-5 flex'>
                                    <div>Upvotes: {reply.upvotes}</div>
                                    <div className='ml-2'>Downvotes: {reply.downvotes}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <CommentForm onSubmit={handleReply} placeholder="Reply" currentUser={currentUser} />
                </div>
            )}
        </div>
    );
};

export default Comment;
