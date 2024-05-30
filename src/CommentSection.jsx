import React, { useState, useEffect } from 'react';


const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [sortedBy, setSortedBy] = useState('newest');
    const [filterUser, setFilterUser] = useState('');
    const [filteredComments, setFilteredComments] = useState([]);

    useEffect(() => {
        const storedComments = JSON.parse(localStorage.getItem('comments'));
        if (storedComments) {
            setComments(storedComments);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('comments', JSON.stringify(comments));
        filterComments();
    }, [comments]);

    useEffect(() => {
        filterComments();
    }, [sortedBy, filterUser]);

    const filterComments = () => {
        let filtered = [...comments];
        if (filterUser) {
            filtered = filtered.filter(comment => comment.user === filterUser);
        }
        if (sortedBy === 'newest') {
            filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } else if (sortedBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        } 
        setFilteredComments(filtered);
    };

    const handleCommentSubmit = (commentText) => {
        const newComment = {
            id: Date.now(),
            text: commentText,
            upvotes: 0,
            downvotes: 0,
            user: 'Ishika', 
            timestamp: new Date().toISOString(),
            replies: [],
        };
        setComments([...comments, newComment]);
    };

    const handleVote = (commentId, isUpvote) => {
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    upvotes: isUpvote ? comment.upvotes + 1 : comment.upvotes,
                    downvotes: isUpvote ? comment.downvotes : comment.downvotes + 1,
                };
            }
            return comment;
        });
        setComments(updatedComments);
    };

    const ReplyHandler = (commentId, replyText) => {
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [
                        ...comment.replies,
                        {
                            id: Date.now(),
                            text: replyText,
                            upvotes: 0,
                            downvotes: 0,
                            user: 'Ishika', 
                            timestamp: new Date().toISOString(),
                        }
                    ]
                };
            }
            return comment;
        });
        setComments(updatedComments);
    };

    return (
        <div >
            <nav className='h-20 flex items-center bg-zinc-900 justify-center w-full'>
             <h2 className='text-2xl uppercase text-white font-bold'>Comment Section </h2>
            </nav>
            <div className="div py-5 items-center justify-center flex-col flex px-10">

            <div className=' w-[60vw] border-b-2 border-zinc-500 items-center px-5 justify-between flex  bg-zinc-300 h-20'>
                <div className="div  w-48  flex justify-between">

                <label className='uppercase font-bold'>Sort by:</label>
                <select value={sortedBy} className='px-1 rounded' onChange={(e) => setSortedBy(e.target.value)}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    
                </select>
                </div>
                <div className="div w-80  flex justify-between">

                <label className='uppercase font-bold'>Filter by user:</label>
                <input type="text" className='px-1 rounded' value={filterUser} onChange={(e) => setFilterUser(e.target.value)} placeholder="Enter username" />
            </div>
                </div>
            <CommentForm onCommentSubmit={handleCommentSubmit} />
            {filteredComments.map(comment => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    onVote={handleVote}
                    onReply={ReplyHandler}
                />
            ))}
            </div>
        </div>
    );
};

const Comment = ({ comment, onVote, onReply }) => {
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(false);

    const handleVote = (isUpvote) => {
        onVote(comment.id, isUpvote);
    };

    const ReplyHandler = () => {
        onReply(comment.id, replyText);
        setReplyText('');
    };

    return (
        <div className='w-[60vw] flex flex-col gap-4 '>
            <div className="head flex justify-between w-full  bg-zinc-200">
            <p className='p-2 text-xl'>{comment.text}</p>
            <div>
                <div className="mid py-2 px-5">
                    
                <button  className='bg-white rounded px-2' onClick={() => handleVote(true)}>Upvote↑</button>
               
                <button className='ml-2 bg-white rounded px-2' onClick={() => handleVote(false)}>Downvote↓</button>
                
                </div>
                 <div className='py-2 px-5 flex'>

                <div>Upvotes: {comment.upvotes}</div>
                <div className='ml-2' >Downvotes: {comment.downvotes}</div>
                 </div>
            </div>
            </div>
            <button className='w-full mb-4 bg-zinc-200 h-10 font-bold uppercase' onClick={() => setShowReplies(!showReplies)}>
                {showReplies ? 'Hide Replies' : 'Show Replies'}
            </button>
            {showReplies && (
                <div>
                    {comment.replies.map(reply => (
                        // <div key={reply.id}>
                        //     <p>{reply.text}</p>
                        //     <div>
                        //         <button onClick={() => handleVote(true)}>Upvote</button>
                        //         <span>Upvotes: {reply.upvotes}</span>
                        //         <button onClick={() => handleVote(false)}>Downvote</button>
                        //         <span>Downvotes: {reply.downvotes}</span>
                        //     </div>
                        // </div>
                         <div key={reply.id} className="head flex justify-between w-full  bg-zinc-200">
                         <p className='p-2 text-xl'>{reply.text}</p>
                         <div>
                             <div className="mid py-2 px-5">
                                 
                             <button  className='bg-white rounded px-2' onClick={() => handleVote(true)}>Upvote↑</button>
                            
                             <button className='ml-2 bg-white rounded px-2' onClick={() => handleVote(false)}>Downvote↓</button>
                             
                             </div>
                              <div className='py-2 px-5 flex'>
             
                             <div>Upvotes: {comment.upvotes}</div>
                             <div className='ml-2' >Downvotes: {comment.downvotes}</div>
                              </div>
                         </div>
                         </div>
                    ))}
                     <div className=' w-[60vw] items-center px-5 justify-between flex  bg-zinc-300 h-20'>
     
            <div className="div flex justify-between  w-full">

            <textarea value={replyText} className='py-1 px-2 rounded-md focus:outline-zinc-600' rows={1} cols={50} onChange={(e) => setReplyText(e.target.value)} placeholder="Reply"></textarea>
            <button className='px-5 rounded font-bold bg-white' onClick={ReplyHandler}>Submit Reply</button>
            </div>
     
        </div>
                      </div>
            )}
        </div>
    );
};

const CommentForm = ({ onCommentSubmit }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onCommentSubmit(commentText);
        setCommentText('');
    };
    return (
        <div className=' w-[60vw] items-center px-5 justify-between flex  bg-zinc-300 h-20'>
        <form className='w-full' onSubmit={handleSubmit}>
            <div className="div flex justify-between  w-full">

            <textarea value={commentText} className='py-1 px-2 rounded-md focus:outline-zinc-600' rows={1} cols={50} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment"></textarea>
            <button className='px-5 rounded font-bold bg-white' type="submit">Submit</button>
            </div>
        </form>
        </div>

    );
};


export default CommentSection;
