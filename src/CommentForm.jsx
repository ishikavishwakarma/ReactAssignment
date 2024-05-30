import React, { useState } from 'react';

const CommentForm = (props) => {
    const { onSubmit, placeholder, currentUser } = props;
    const [commentText, setCommentText] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!currentUser) {
            alert('Please enter a username');
            return;
        }
        onSubmit(commentText, currentUser);
        setCommentText('');
    };

    return (
        <div className='w-[60vw] items-center px-5 justify-between flex bg-zinc-300 h-20'>
            <form className='w-full' onSubmit={handleSubmit}>
                <div className="div flex justify-between w-full">
                    <textarea
                        value={commentText}
                        className='py-1 px-2 rounded-md focus:outline-zinc-600'
                        rows={1}
                        cols={50}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={placeholder}
                    />
                    <button className='px-5 rounded font-bold bg-white' type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;
