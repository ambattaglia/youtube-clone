import React, { useEffect, useState } from 'react';
import './Recommended.css';
import { API_KEY, value_converter } from '../../data';
import { Link } from 'react-router-dom';

const Recommended = ({ categoryId }) => {
  const [apiData, setApiData] = useState([]);

  const fetchData = async () => {
    try {
      const cat = categoryId || 0;
      const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${cat}&key=${API_KEY}`;
      const res = await fetch(relatedVideo_url);
      const data = await res.json();
      if (data.items) {
        setApiData(data.items);
      }
    } catch (error) {
      console.error("Error fetching recommended videos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return (
    <div className='recommended'>
      {apiData.map((item, index) => {
        return (
          <Link 
            to={`/video/${item.snippet.categoryId}/${item.id}`} 
            key={index} 
            className="side-video-list"
          >
            <img className="small-thumbnail" src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
            <div className="vid-info">
              <h4>{item.snippet.title}</h4>
              <p>{item.snippet.channelTitle}</p>
              <p className="recommended-views">{value_converter(item.statistics.viewCount)} Views</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Recommended;