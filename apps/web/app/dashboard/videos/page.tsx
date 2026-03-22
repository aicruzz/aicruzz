'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { videosApi } from '@/lib/api';
import type { Video } from '@aicruzz/types';

const statusVariant: Record<string, 'done' | 'proc' | 'queued' | 'failed'> = {
  done: 'done', processing: 'proc', queued: 'queued', failed: 'failed',
};
const statusLabel: Record<string, string> = {
  done: 'Completed', processing: 'Processing', queued: 'Queued', failed: 'Failed',
};
const gradients = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#f7971e,#ffd200)',
  'linear-gradient(135deg,#a8edea,#fed6e3)',
];

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    videosApi.list()
      .then((r) => setVideos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this video?')) return;
    await videosApi.delete(id);
    setVideos((v) => v.filter((vid) => vid.id !== id));
  }

  return (
    <div className="db-content">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 className="db-page-title">My Videos</h1>
          <p className="db-page-sub">Manage and download your generated videos.</p>
        </div>
        <Link href="/dashboard/create">
          <button className="btn btn-primary">+ Create New Video</button>
        </Link>
      </div>

      <div className="db-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="spinner" style={{ margin: '0 auto', borderColor: 'rgba(47,107,255,0.15)', borderTopColor: 'var(--blue)' }} />
          </div>
        ) : videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎬</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No videos yet</div>
            <div style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 24 }}>Create your first AI video to get started</div>
            <Link href="/dashboard/create">
              <button className="btn btn-primary">Create Your First Video →</button>
            </Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Type</th>
                <th>Resolution</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v, i) => (
                <tr key={v.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 52, height: 36, borderRadius: 7, background: gradients[i % gradients.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎬</div>
                      <span style={{ fontWeight: 700, color: 'var(--text)' }}>{v.title}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-2)', textTransform: 'capitalize' }}>{v.type?.replace(/_/g, ' ')}</td>
                  <td style={{ color: 'var(--text-2)' }}>{v.resolution || '—'}</td>
                  <td><Badge variant={statusVariant[v.status] || 'queued'}>{statusLabel[v.status] || v.status}</Badge></td>
                  <td style={{ color: 'var(--text-2)' }}>{new Date(v.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {v.status === 'done' && v.url && (
                        <a href={v.url} target="_blank" rel="noreferrer">
                          <button className="btn btn-outline btn-sm">⬇ Download</button>
                        </a>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
