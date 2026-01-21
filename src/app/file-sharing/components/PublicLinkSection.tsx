'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PublicLinkSectionProps {
  fileId: string;
  isPublicLinkEnabled: boolean;
  onTogglePublicLink: (enabled: boolean) => void;
}

const PublicLinkSection = ({
  fileId,
  isPublicLinkEnabled,
  onTogglePublicLink,
}: PublicLinkSectionProps) => {
  const [linkSettings, setLinkSettings] = useState({
    password: '',
    expiryDate: '',
    allowDownload: true,
    allowComments: false,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const publicLinkUrl = `https://clouddrive.app/share/${fileId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicLinkUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const generateQRCode = () => {
    // Mock QR code generation
    alert('QR Code generated for mobile sharing');
  };

  return (
    <div className="space-y-4">
      {/* Toggle Section */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Icon name="LinkIcon" size={18} className="text-primary" />
            Public link sharing
          </h3>
          <p className="caption text-muted-foreground mt-1">
            Anyone with the link can access this file
          </p>
        </div>
        <button
          onClick={() => onTogglePublicLink(!isPublicLinkEnabled)}
          className={`
            relative w-12 h-6 rounded-full transition-smooth
            ${isPublicLinkEnabled ? 'bg-primary' : 'bg-muted-foreground/30'}
          `}
          aria-label="Toggle public link"
          aria-pressed={isPublicLinkEnabled}
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-brand transition-smooth
              ${isPublicLinkEnabled ? 'translate-x-6' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {/* Link Display and Actions */}
      {isPublicLinkEnabled && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={publicLinkUrl}
              readOnly
              className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              aria-label="Public share link"
            />
            <button
              onClick={handleCopyLink}
              className={`
                px-6 py-2.5 rounded-md text-sm font-medium transition-smooth
                ${
                  copySuccess
                    ? 'bg-success text-success-foreground'
                    : 'bg-secondary text-secondary-foreground hover:shadow-brand-lg'
                }
              `}
            >
              {copySuccess ? (
                <span className="flex items-center gap-2">
                  <Icon name="CheckIcon" size={16} />
                  Copied
                </span>
              ) : (
                'Copy'
              )}
            </button>
            <button
              onClick={generateQRCode}
              className="px-4 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-smooth"
              aria-label="Generate QR code"
            >
              <Icon name="QrCodeIcon" size={20} />
            </button>
          </div>

          {/* Advanced Settings Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-primary hover:underline transition-smooth"
          >
            <Icon
              name={showAdvanced ? 'ChevronUpIcon' : 'ChevronDownIcon'}
              size={16}
            />
            Advanced settings
          </button>

          {/* Advanced Settings Panel */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
              {/* Password Protection */}
              <div>
                <label
                  htmlFor="link-password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Password protection (optional)
                </label>
                <input
                  id="link-password"
                  type="password"
                  value={linkSettings.password}
                  onChange={(e) =>
                    setLinkSettings({ ...linkSettings, password: e.target.value })
                  }
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label
                  htmlFor="expiry-date"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Link expiry date (optional)
                </label>
                <input
                  id="expiry-date"
                  type="date"
                  value={linkSettings.expiryDate}
                  onChange={(e) =>
                    setLinkSettings({ ...linkSettings, expiryDate: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                />
              </div>

              {/* Permission Toggles */}
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-foreground">Allow downloads</span>
                  <input
                    type="checkbox"
                    checked={linkSettings.allowDownload}
                    onChange={(e) =>
                      setLinkSettings({
                        ...linkSettings,
                        allowDownload: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring transition-smooth"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-foreground">Allow comments</span>
                  <input
                    type="checkbox"
                    checked={linkSettings.allowComments}
                    onChange={(e) =>
                      setLinkSettings({
                        ...linkSettings,
                        allowComments: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring transition-smooth"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicLinkSection;