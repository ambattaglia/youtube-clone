import React, { useEffect, useState } from 'react'
import './Feed.css'
import { Link } from 'react-router-dom'
import { API_KEY } from '../../data'
import moment from 'moment';


const value_converter = (value) => {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value;
};

const Feed = ({ category }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;

    const response = await fetch(videoList_url);
    const json = await response.json();
    setData(json.items || []);
  };

  useEffect(() => {
    fetchData();
  }, [category]);

return (
  <div className="feed">
    {data.map((item, index) => {
      return (
        <Link 
          to={`/video/${item.snippet.categoryId}/${item.id}`} 
          className="card" 
          key={item.id}
        >
          <img src={item.snippet.thumbnails.medium.url} alt="" />
          <h2>{item.snippet.title}</h2>
          <h3>{item.snippet.channelTitle}</h3>
          <p>
            {value_converter(item.statistics.viewCount)} views &bull; 
            {moment(item.snippet.publishedAt).fromNow() }
          </p>
        </Link>
      );
    })}
  </div>
);
};

export default Feed;
