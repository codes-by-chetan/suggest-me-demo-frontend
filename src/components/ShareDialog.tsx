import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Link2,
  Check,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  url?: string;
}

export function ShareDialog({
  isOpen,
  onClose,
  title,
  description,
  url = window.location.href,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url;
  const shareText = `${title} - ${description}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-950',
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-sky-50 dark:hover:bg-sky-950',
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-50 dark:hover:bg-green-950',
      onClick: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-orange-50 dark:hover:bg-orange-950',
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
      },
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this recommendation</DialogTitle>
          {/* <DialogDescription>
            Share "{title}" with your friends and family
          </DialogDescription> */}
        </DialogHeader>

        {/* Share Options */}
        <div className="grid grid-cols-2 gap-3 py-4">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.name}
                variant="outline"
                className={`flex  gap-2 transition-colors ${option.color}`}
                onClick={option.onClick}
              >
                <Icon className="w-6 h-6" />
                {/* <span className="text-sm">{option.name}</span> */}
              </Button>
            );
          })}
        </div>

        {/* Copy Link Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Or copy link</label>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              type="button"
              size="icon"
              variant={copied ? 'default' : 'outline'}
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
