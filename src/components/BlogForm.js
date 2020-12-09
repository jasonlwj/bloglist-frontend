import React from 'react'

const BlogForm = ({ title, handleTitleChange, url, handleUrlChange, addBlog }) => (
	<form onSubmit={addBlog}>
		<div>
			title: <input value={title} onChange={handleTitleChange} />
		</div>
		<div>
			url: <input value={url} onChange={handleUrlChange} />
		</div>
		<button>create</button>
	</form>
)

export default BlogForm
