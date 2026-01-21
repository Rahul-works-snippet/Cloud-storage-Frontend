'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AddPeopleFormProps {
  onAddUser: (email: string, permission: 'viewer' | 'editor') => void;
}

const AddPeopleForm = ({ onAddUser }: AddPeopleFormProps) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'viewer' | 'editor'>('viewer');
  const [emailError, setEmailError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockContacts = [
    'john.doe@example.com',
    'jane.smith@example.com',
    'robert.johnson@example.com',
    'emily.davis@example.com',
    'michael.wilson@example.com',
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError('');

    if (value.length > 0) {
      const filtered = mockContacts.filter((contact) =>
        contact.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    onAddUser(email.trim(), permission);
    setEmail('');
    setPermission('viewer');
    setEmailError('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setEmail(suggestion);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email-input"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Add people
        </label>
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                id="email-input"
                type="text"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onFocus={() => email.length > 0 && setShowSuggestions(true)}
                placeholder="Enter email address"
                className={`
                  w-full px-4 py-2.5 bg-muted border rounded-md text-sm text-foreground 
                  placeholder:text-muted-foreground focus:outline-none focus:ring-2 
                  focus:ring-ring transition-smooth
                  ${emailError ? 'border-destructive' : 'border-border'}
                `}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
              />

              {/* Email Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-brand-lg z-50 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth text-left"
                    >
                      <Icon
                        name="UserIcon"
                        size={16}
                        className="text-muted-foreground"
                      />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select
              value={permission}
              onChange={(e) =>
                setPermission(e.target.value as 'viewer' | 'editor')
              }
              className="px-4 py-2.5 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              aria-label="Select permission level"
            >
              <option value="viewer">Can view</option>
              <option value="editor">Can edit</option>
            </select>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth"
            >
              Add
            </button>
          </div>

          {emailError && (
            <p
              id="email-error"
              className="mt-1.5 text-sm text-destructive flex items-center gap-1"
            >
              <Icon name="ExclamationCircleIcon" size={16} />
              {emailError}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-md border border-border">
        <Icon
          name="InformationCircleIcon"
          size={18}
          className="text-muted-foreground flex-shrink-0 mt-0.5"
        />
        <p className="caption text-muted-foreground">
          People you add will receive an email invitation with access to this file.
          They can view or edit based on the permission level you set.
        </p>
      </div>
    </form>
  );
};

export default AddPeopleForm;