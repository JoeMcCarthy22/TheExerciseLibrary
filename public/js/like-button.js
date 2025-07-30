const { useState, useEffect } = React;

function LikeButton({ postId }) {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetch(`/post/${postId}/likes`)
      .then(res => res.json())
      .then(data => setLikes(data.count))
      .catch(() => setLikes(0));
  }, [postId]);

  const handleLike = () => {
    fetch(`/post/${postId}/like`, { method: 'POST' })
      .then(res => res.json())
      .then(data => setLikes(data.count))
      .catch(err => alert('Failed to like post'));
  };

  return React.createElement(
    'div',
    { className: 'd-flex align-items-center' },
    React.createElement('button', {
      className: 'btn btn-primary fa fa-heart me-2',
      onClick: handleLike,
    }),
    React.createElement('span', null, `Likes: ${likes}`)
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('react-like-button');
  if (mount) {
    const postId = mount.getAttribute('data-post-id');
    const root = ReactDOM.createRoot(mount);
    root.render(React.createElement(LikeButton, { postId }));
  }
});
