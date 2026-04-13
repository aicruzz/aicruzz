'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { videosApi } from '@/lib/api';
import { socket } from '@/lib/socket';
import type { Video } from '@aicruzz/types';

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const [loadedThumbs, setLoadedThumbs] = useState<Record<string, boolean>>({});
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  // ✅ INITIAL FETCH
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await videosApi.list();
        setVideos(res.data);

        // initialize progress
        const progressInit: Record<string, number> = {};
        res.data.forEach((v: Video) => {
          progressInit[v.id] = (v as any).progress || 0;
        });
        setProgressMap(progressInit);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  // ✅ SOCKET (REALTIME UPDATES)
  useEffect(() => {
    socket.on('video:update', (updatedVideo: Video) => {
      setVideos((prev) => {
        const exists = prev.find((v) => v.id === updatedVideo.id);

        if (exists) {
          return prev.map((v) =>
            v.id === updatedVideo.id
              ? {
                  ...v,
                  ...updatedVideo,
                  url: updatedVideo.url ?? v.url,
                  thumbnailUrl: updatedVideo.thumbnailUrl ?? v.thumbnailUrl,
                }
              : v
          );
        }

        return [updatedVideo, ...prev];
      });

      // update progress if included
      if ((updatedVideo as any).progress !== undefined) {
        setProgressMap((prev) => ({
          ...prev,
          [updatedVideo.id]: (updatedVideo as any).progress,
        }));
      }
    });

    socket.on('video:progress', ({ videoId, progress }) => {
      setProgressMap((prev) => ({
        ...prev,
        [videoId]: progress,
      }));
    });

    return () => {
      socket.off('video:update');
      socket.off('video:progress');
    };
  }, []);

  // ✅ POLLING (fallback for reliability)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await videosApi.list();

        setVideos(res.data);

        const progressUpdate: Record<string, number> = {};
        res.data.forEach((v: Video) => {
          progressUpdate[v.id] = (v as any).progress || 0;
        });

        setProgressMap(progressUpdate);
      } catch (err) {
        console.error('Polling error', err);
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this video?')) return;

    try {
      await videosApi.delete(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));

      if (activeVideoId === id) setActiveVideoId(null);
    } catch (err) {
      console.error('Delete failed', err);
    }
  }

  return (
    <div className="db-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="db-page-title">My Videos</h1>
          <p className="db-page-sub">
            Manage and preview your AI-generated videos.
          </p>
        </div>

        <Link href="/dashboard/create">
          <button className="btn btn-primary">+ New Video</button>
        </Link>
      </div>

      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="db-card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 180, background: '#eee', animation: 'pulse 1.5s infinite' }} />
              <div style={{ padding: 14 }}>
                <div style={{ height: 14, background: '#eee', marginBottom: 8 }} />
                <div style={{ height: 10, width: '60%', background: '#eee' }} />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="db-card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 50 }}>🎬</div>
          <h3>No videos yet</h3>
          <Link href="/dashboard/create">
            <button className="btn btn-primary">Create Video →</button>
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {videos.map((video) => {
            const progress = progressMap[video.id] || 0;

            const thumbnail =
              video.thumbnailUrl ||
              `https://image.pollinations.ai/prompt/${encodeURIComponent(
                video.prompt || 'video'
              )}`;

            const isLoaded = loadedThumbs[video.id];

            return (
              <div key={video.id} className="db-card" style={{ overflow: 'hidden' }}>
                
                <div
                  style={{
                    height: 180,
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  onClick={() => video.url && setModalVideo(video.url)}
                >
                  {activeVideoId === video.id && video.url ? (
                    <video
                      controls
                      autoPlay
                      playsInline
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    >
                      <source src={video.url} type="video/mp4" />
                    </video>
                  ) : (
                    <>
                      <img
                        src={thumbnail}
                        alt="thumbnail"
                        onLoad={() =>
                          setLoadedThumbs((prev) => ({
                            ...prev,
                            [video.id]: true,
                          }))
                        }
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
                          transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
                          transition: '0.4s ease',
                        }}
                      />

                      {video.url && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.3)',
                        }}>
                          <div style={{
                            width: 55,
                            height: 55,
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 22,
                          }}>
                            ▶
                          </div>
                        </div>
                      )}

                      {(video.status === 'processing' || video.status === 'queued') && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: 6,
                          background: '#ddd',
                        }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${progress}%`,
                              background: '#4f46e5',
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div style={{ padding: 14 }}>
                  <div style={{ fontWeight: 700 }}>
                    {video.prompt?.slice(0, 40) || 'Untitled Video'}
                  </div>

                  <div style={{ fontSize: 12, color: '#777', marginBottom: 10 }}>
                    {video.duration || 10}s · {video.resolution || '1080p'}
                  </div>

                  {video.status === 'processing' && (
                    <div style={{ fontSize: 12, color: '#555' }}>
                      Processing... {progress}%
                    </div>
                  )}

                  {video.status === 'failed' && (
                    <div style={{ fontSize: 12, color: 'red' }}>
                      Failed
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {video.url && (
                      <>
                        <button
                          className="btn btn-sm"
                          onClick={() =>
                            setActiveVideoId(
                              activeVideoId === video.id ? null : video.id
                            )
                          }
                        >
                          {activeVideoId === video.id ? '✖ Close' : '▶ Preview'}
                        </button>

                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = video.url!;
                            link.setAttribute('download', `video-${video.id}.mp4`);
                            link.setAttribute('target', '_blank');
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                          }}
                        >
                          ⬇ Download
                        </button>
                      </>
                    )}

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(video.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalVideo && (
        <div
          onClick={() => setModalVideo(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <video
            controls
            autoPlay
            playsInline
            preload="metadata"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: 12,
              background: 'black',
            }}
          >
            <source src={modalVideo} type="video/mp4" />
          </video>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}