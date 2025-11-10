import React, { useState, useRef, useEffect } from 'react';
import { useTheme, colorThemes, ThemeMode, ColorTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';

export function ThemeSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, colorTheme, setMode, setColorTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const themeModes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> }
  ];

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Small delay to prevent immediate closing when opening
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <Button 
        variant={isOpen ? "secondary" : "ghost"} 
        size="sm" 
        onClick={handleToggle}
        className="relative cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Palette className="w-5 h-5" />
      </Button>

      {/* Popover Content */}
      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-72 z-[100] shadow-lg border animate-in fade-in-0 zoom-in-95 duration-200">
          <CardContent className="p-3 space-y-3">
            <div>
              <h4 className="font-medium leading-none mb-2 text-sm">Appearance</h4>
              <RadioGroup
                value={mode}
                onValueChange={(value: string) => setMode(value as ThemeMode)}
                className="flex gap-2"
              >
                {themeModes.map((themeMode) => (
                  <div key={themeMode.value} className="flex-1">
                    <RadioGroupItem
                      value={themeMode.value}
                      id={themeMode.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={themeMode.value}
                      className="flex flex-col items-center justify-center space-y-1 rounded-md border-2 border-muted bg-popover p-1.5 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                    >
                      {themeMode.icon}
                      {/* <span className="text-xs">{themeMode.label}oo</span> */}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <hr className="border-border" />

            <div>
              <h4 className="font-medium leading-none mb-2 text-sm">Color Theme</h4>
              <div className="grid grid-cols-1 gap-1.5">
                {Object.entries(colorThemes).map(([key, theme]) => (
                  <Button
                    key={key}
                    variant={colorTheme === key ? 'secondary' : 'ghost'}
                    className="justify-start h-auto p-1.5 transition-colors"
                    onClick={() => setColorTheme(key as ColorTheme)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex gap-1">
                        <div 
                          className="w-3 h-3 rounded-full border border-border/50"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border border-border/50"
                          style={{ backgroundColor: theme.primaryDark || theme.primary }}
                        />
                      </div>
                      <span className="flex-1 text-left text-xs">{theme.name}</span>
                      {colorTheme === key && <Check className="w-3 h-3" />}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}