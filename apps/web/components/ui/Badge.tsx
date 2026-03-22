type BadgeVariant = 'done' | 'proc' | 'queued' | 'failed' | 'free' | 'starter' | 'pro' | 'studio';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant = 'free', children }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
