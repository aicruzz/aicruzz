import Badge from '@/components/ui/Badge';
import type { Video } from '@aicruzz/types';

interface VideoCardProps {
  video: Video;
  onDelete?: (id: string) => void;
}

const statusVariant: Record<string, 'done' | 'proc' | 'queued' | 'failed'> = {
  done: 'done',
  processing: 'proc',
  queued: 'queued',
  failed: 'failed',
};

const statusLabel: Record<string, string> = {
  done: 'Completed',
  processing: 'Processing',
  queued: 'Queued',
  failed: 'Failed',
};

const gradients = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#f7971e,#ffd200)',
  'linear-gradient(135deg,#a8edea,#fed6e3)',
];

export default function VideoCard({ video, onDelete }: VideoCardProps) {
  const grad = gradients[video.id.charCodeAt(0) % gradients.length];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{
        width: 60, height: 40, borderRadius: 8,
        background: grad,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>
        🎬
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {video.title}
        </div>
        <Badge variant={statusVariant[video.status] || 'queued'}>
          {statusLabel[video.status] || video.status}
        </Badge>
      </div>
      {onDelete && (
        <button
          className="btn btn-danger btn-sm"
          style={{ flexShrink: 0 }}
          onClick={() => onDelete(video.id)}
        >
          🗑
        </button>
      )}
    </div>
  );
}
