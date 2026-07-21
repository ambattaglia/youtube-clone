import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import jack from '../../assets/jack.png';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';

const PlayVideo = ({ videoId }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [dislikeCount, setDislikeCount] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  const fetchVideoData = async () => {
    try {
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(videoDetails_url);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setApiData(data.items[0]);
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const fetchDislikeData = async () => {
    try {
      const res = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.dislikes === 'number') {
          setDislikeCount(data.dislikes);
        }
      }
    } catch (error) {
      console.error("Error fetching dislike count:", error);
    }
  };

  const fetchOtherData = async () => {
    if (!apiData || !apiData.snippet) return;

    try {
      // Fetch channel data
      const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const channelRes = await fetch(channelData_url);
      const channelJson = await channelRes.json();
      if (channelJson.items && channelJson.items.length > 0) {
        setChannelData(channelJson.items[0]);
      }

      // Fetch comments (top 50)
      const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
      const commentRes = await fetch(comment_url);
      const commentJson = await commentRes.json();
      if (commentJson.items) {
        setCommentData(commentJson.items);
      }
    } catch (error) {
      console.error("Error fetching channel/comment data:", error);
    }
  };

  useEffect(() => {
    fetchVideoData();
    fetchDislikeData();
    setIsLiked(false);
    setIsDisliked(false);
    setIsSubscribed(false);
  }, [videoId]);

  useEffect(() => {
    if (apiData) {
      fetchOtherData();
    }
  }, [apiData]);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
      if (isDisliked) setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      if (isLiked) setIsLiked(false);
    }
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newCommentItem = {
      snippet: {
        topLevelComment: {
          snippet: {
            authorDisplayName: "You",
            authorProfileImageUrl: user_profile,
            textDisplay: newCommentText.trim(),
            publishedAt: new Date().toISOString(),
            likeCount: 0
          }
        }
      }
    };

    setCommentData([newCommentItem, ...commentData]);
    setNewCommentText("");
  };

  const rawLikes = apiData?.statistics?.likeCount ? Number(apiData.statistics.likeCount) : 0;
  const displayLikes = rawLikes + (isLiked ? 1 : 0);

  const rawDislikes = dislikeCount !== null 
    ? dislikeCount 
    : (rawLikes ? Math.floor(rawLikes * 0.03) : 0);
  const displayDislikes = rawDislikes + (isDisliked ? 1 : 0);

  const baseSubscribers = channelData ? Number(channelData.statistics?.subscriberCount || 0) : 0;
  const displaySubscribers = baseSubscribers + (isSubscribed ? 1 : 0);

  return (
    <div className='play-video'>   
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title={apiData?.snippet?.title || "Video player"}
      ></iframe>
      
      <h3>{apiData ? apiData.snippet.title : "Loading..."}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics?.viewCount) : "0"} Views &bull;{" "}
          {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
        </p>

        <div className="actions">
          <span 
            onClick={handleLike} 
            style={{ cursor: 'pointer', opacity: isLiked ? 1 : 0.85, fontWeight: isLiked ? 'bold' : 'normal' }}
            title="Like"
          >
            <img src={like} alt="like" />
            {value_converter(displayLikes)}
          </span>
          <span 
            onClick={handleDislike} 
            style={{ cursor: 'pointer', opacity: isDisliked ? 1 : 0.85, fontWeight: isDisliked ? 'bold' : 'normal' }}
            title="Dislike"
          >
            <img src={dislike} alt="dislike" />
            {value_converter(displayDislikes)}
          </span>
          <span><img src={share} alt="share" />Share</span>
          <span><img src={save} alt="save" />Save</span>
        </div>
      </div>

      <hr />

      <div className="publisher">
        <img 
          src={channelData?.snippet?.thumbnails?.default?.url || jack} 
          alt="channel logo" 
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = jack;
          }}
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : "Channel Name"}</p>
          <span>{value_converter(displaySubscribers)} Subscribers</span>
        </div>
        <button 
          onClick={handleSubscribe} 
          style={{
            backgroundColor: isSubscribed ? "#5a5a5a" : "#red",
            background: isSubscribed ? "#5a5a5a" : "#cc0000",
            cursor: "pointer",
            transition: "0.2s smooth"
          }}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      <div className="vid-description">
        <p>{apiData ? apiData.snippet.description.slice(0, 300) : "Description"}</p>
        <hr />
        <h4>{commentData.length > 0 ? commentData.length : (apiData ? value_converter(apiData.statistics?.commentCount) : 0)} Comments</h4>
        
        {/* Comment Input Box */}
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
          <img src={user_profile} alt="user" style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              borderBottom: '1px solid #ccc',
              outline: 'none',
              padding: '5px',
              fontSize: '14px'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '6px 14px',
              background: '#065fd4',
              color: '#fff',
              border: 'none',
              borderRadius: '18px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Comment
          </button>
        </form>

        {commentData.length > 0 ? (
          commentData.slice(0, 50).map((item, index) => {
            const comment = item.snippet.topLevelComment.snippet;
            return (
              <div className="comment" key={index}>
                <img 
                  src={comment.authorProfileImageUrl || user_profile} 
                  alt="user profile" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = user_profile;
                  }}
                  style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <h3>
                    {comment.authorDisplayName} <span>{moment(comment.publishedAt).fromNow()}</span>
                  </h3>
                  <p dangerouslySetInnerHTML={{ __html: comment.textDisplay }}></p>
                  <div className="comment-action">
                    <img src={like} alt="like" />
                    <span>{value_converter(comment.likeCount || 0)}</span>
                    <img src={dislike} alt="dislike" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No comments available</p>
        )}
      </div>
    </div>
  );
};

export default PlayVideo;