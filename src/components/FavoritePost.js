import { useEffect, useState } from "react";

import styled from "styled-components";

import "../Post.css";

function FavoritePost({
  fav: {id, user, post, user_id, post_id}, loginId
}) {
  const [userInfo, setUserInfo] = useState("");
  const [postInfo, setPostInfo] = useState("");
  const [isFavorited, setIsFavorited] = useState(true);

  useEffect(() => {
    fetch(`https://devconnect-backend-server.herokuapp.com/users/${post.user_id}`)
      .then((resp) => resp.json())
      .then((data) => {
        setUserInfo({
          username: data[0].username,
          img: data[0].image_url,
        });
      });
    
    fetch(`https://devconnect-backend-server.herokuapp.com/posts/${post_id}`)
    .then(resp => resp.json())
    .then(data => {
        setPostInfo({
            header: data[0].header,
            description: data[0].description,
            image_url: data[0].image_url,
            content: data[0].content_link,
            like_count: data[0].like_count,
            user_id: data[0].user_id
        })
    })
  }, [user_id]);


    const handleClick = () => {
      console.log('hello')
      fetch('https://devconnect-backend-server.herokuapp.com/favorites', {
        method: 'POST',
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({
          user_id: loginId,
          post_id: post_id 
        }),
      })
      .then(res => res.json())
      .then(() => {
        console.log('success')
        setIsFavorited(true)
      })
  }

    

    const handleUnfavorite = (e) => {
      fetch('https://devconnect-backend-server.herokuapp.com/favorites')
      .then(resp => resp.json())
      .then(data => {

        const var1 = data.filter(post => {
          return (post.user_id === loginId) && (post.post_id === post_id)
        })
        
        if (var1 !== []) {
          var1.forEach(fav => {
            fetch(`https://devconnect-backend-server.herokuapp.com/favorites/${fav.id}`, {
              method: 'DELETE'
            })
            .then(resp => resp.json())
            .then(data => window.location.reload(false))
        })
      }
    })
      setIsFavorited(false)
      
    }

    const parseTime = (created_at) => {
      const date = new Date(created_at)
      return date.getTime()
    }

    function timeSince(date) {

      const seconds = Math.floor((new Date().getTime() - date) / 1000);
      console.log(seconds)
      let interval = seconds / 31536000;
    
      if (interval > 1) {
        return Math.floor(interval) + " years";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    }


  return (
    <PostCard>
      <div className="mock-outer">
        <div className="mock-inner">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {isFavorited ? (
              <button
                onClick={(e) => handleUnfavorite(e)}
                className="emoji-button favorite active"
              >
                ★
              </button>
            ) : (
              <button id={id}
                onClick={handleClick}
                className="emoji-button favorite"
              >
                ☆
              </button>
            )}
          </div>
          <div className="fb-group-picrow">
            <img src={userInfo.img} alt="profile"/>
            <div className="fb-group-text-top">
              <div className="fb-group-text">
                <h5 className="fbh5">{userInfo.username}</h5>
                <span className="fb-group-date">{timeSince(parseTime(post.created_at))}</span>
              </div>
            </div>
          </div>
          <a href={postInfo.content} target="_blank" rel="noreferrer">
          <div className="mock-img-all">
            <div className="mock-img">
              <img src={postInfo.image_url} alt="post"/>
            </div>
            <div className="mock-title">
              <div className="mock-title2">
                <div className="mock-title-top">
                  <p>{postInfo.header}</p>
                </div>
                <div className="mock-title-mid">{postInfo.description}</div>
              </div>
            </div>
          </div>
          </a>
          <p>♡ {postInfo.like_count}</p>
          </div>
      </div>
    </PostCard>
  );
}

export default FavoritePost;

const PostCard = styled.div`
  border: 3px solid black;
  position: relative;
  margin: 15px;
  margin-left: 30%;
  margin-right: 30%;
  border-radius: 20px;
  padding: 7px;
  box-shadow: 10px 10px grey;
`;
