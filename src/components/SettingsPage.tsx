import { useState } from "react";
import { User } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import {
  User as UserIcon,
  Mail,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Palette,
  Database,
  HelpCircle,
  Info,
  Camera,
  Globe,
  MessageSquare,
  Users,
  Heart,
  Tag,
  Smartphone,
  Laptop,
  LogOut,
  Trash2,
  Download,
  Upload,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";
import { SwipeableTabs } from "./SwipeableTabs";
import {
  useTheme,
  colorThemes,
  ThemeMode,
  ColorTheme,
} from "../contexts/ThemeContext";

interface SettingsPageProps {
  currentUser: User;
  onUpdateProfile?: (updates: Partial<User>) => void;
  onBack?: () => void;
}

export function SettingsPage({
  currentUser,
  onUpdateProfile,
  onBack,
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("account");
  const { mode, colorTheme, setMode, setColorTheme } =
    useTheme();

  // Account settings
  const [displayName, setDisplayName] = useState(
    currentUser.displayName,
  );
  const [username, setUsername] = useState(
    currentUser.username,
  );
  const [bio, setBio] = useState(currentUser.bio || "");
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [isEditingProfile, setIsEditingProfile] =
    useState(false);

  // Privacy settings
  const [profileVisibility, setProfileVisibility] =
    useState("public");
  const [whoCanMessage, setWhoCanMessage] =
    useState("everyone");
  const [whoCanTag, setWhoCanTag] = useState("everyone");
  const [showActivity, setShowActivity] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [showWatchlist, setShowWatchlist] = useState(true);

  // Notification settings
  const [emailNotifications, setEmailNotifications] =
    useState(true);
  const [pushNotifications, setPushNotifications] =
    useState(true);
  const [notifyNewFollowers, setNotifyNewFollowers] =
    useState(true);
  const [notifyLikes, setNotifyLikes] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyRecommendations, setNotifyRecommendations] =
    useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyDigest, setNotifyDigest] = useState(false);

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Data settings
  const [dataUsageMode, setDataUsageMode] = useState("auto");
  const [autoplayVideos, setAutoplayVideos] = useState(true);
  const [cacheSize, setCacheSize] = useState([50]);

  const handleProfileUpdate = () => {
    // Simulate profile update
    if (onUpdateProfile) {
      onUpdateProfile({
        displayName,
        username,
        bio,
      });
    }

    toast.success("Profile updated successfully!");
    setIsEditingProfile(false);
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    toast.info("Avatar upload would open here");
  };

  const handlePasswordChange = () => {
    toast.success("Password change email sent to your inbox");
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(
      twoFactorEnabled
        ? "Two-factor authentication disabled"
        : "Two-factor authentication enabled",
    );
  };

  const handleExportData = () => {
    toast.info(
      "Preparing your data export. You'll receive an email when it's ready.",
    );
  };

  const handleDeleteAccount = () => {
    toast.error(
      "Account deletion requires additional confirmation",
    );
  };

  const themeModes: {
    value: ThemeMode;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "light",
      label: "Light",
      icon: <Sun className="w-5 h-5" />,
    },
    {
      value: "dark",
      label: "Dark",
      icon: <Moon className="w-5 h-5" />,
    },
    {
      value: "system",
      label: "System",
      icon: <Monitor className="w-5 h-5" />,
    },
  ];

  // Account Tab Content
  const accountContent = (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile details and photo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative group">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                />
                <AvatarFallback>
                  {currentUser.displayName[0]}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleAvatarChange}
                className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">
                {currentUser.displayName}
              </h3>
              <p className="text-sm text-muted-foreground">
                @{currentUser.username}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleAvatarChange}
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </div>

          <Separator />

          {/* Edit Profile Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) =>
                    setDisplayName(e.target.value)
                  }
                  disabled={!isEditingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    @
                  </span>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                disabled={!isEditingProfile}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/160 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  disabled={!isEditingProfile}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  disabled={!isEditingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  disabled={!isEditingProfile}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {!isEditingProfile ? (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleProfileUpdate}>
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>
            Your activity on Suggest.Me
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl mb-1">
                {currentUser.followersCount}
              </div>
              <div className="text-sm text-muted-foreground">
                Followers
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl mb-1">
                {currentUser.followingCount}
              </div>
              <div className="text-sm text-muted-foreground">
                Following
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl mb-1">147</div>
              <div className="text-sm text-muted-foreground">
                Reviews
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl mb-1">23</div>
              <div className="text-sm text-muted-foreground">
                Recommendations
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Privacy Tab Content
  const privacyContent = (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Control who can see your content and interact with
            you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Who can see your profile
                </p>
              </div>
              <Select
                value={profileVisibility}
                onValueChange={setProfileVisibility}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    Everyone
                  </SelectItem>
                  <SelectItem value="followers">
                    Followers
                  </SelectItem>
                  <SelectItem value="private">
                    Only Me
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <Label>Who Can Message You</Label>
                <p className="text-sm text-muted-foreground">
                  Control message requests
                </p>
              </div>
              <Select
                value={whoCanMessage}
                onValueChange={setWhoCanMessage}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">
                    Everyone
                  </SelectItem>
                  <SelectItem value="followers">
                    Followers
                  </SelectItem>
                  <SelectItem value="following">
                    People I Follow
                  </SelectItem>
                  <SelectItem value="none">No One</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <Label>Who Can Tag You</Label>
                <p className="text-sm text-muted-foreground">
                  In recommendations and posts
                </p>
              </div>
              <Select
                value={whoCanTag}
                onValueChange={setWhoCanTag}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">
                    Everyone
                  </SelectItem>
                  <SelectItem value="followers">
                    Followers
                  </SelectItem>
                  <SelectItem value="none">No One</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Activity Status</Label>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're active
                </p>
              </div>
              <Switch
                checked={showActivity}
                onCheckedChange={setShowActivity}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Favorites</Label>
                <p className="text-sm text-muted-foreground">
                  Display your favorite content on profile
                </p>
              </div>
              <Switch
                checked={showFavorites}
                onCheckedChange={setShowFavorites}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Watchlist</Label>
                <p className="text-sm text-muted-foreground">
                  Display your watchlist on profile
                </p>
              </div>
              <Switch
                checked={showWatchlist}
                onCheckedChange={setShowWatchlist}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blocked Users</CardTitle>
          <CardDescription>
            Manage users you've blocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              You haven't blocked anyone yet. Blocked users
              won't be able to see your profile or interact with
              you.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );

  // Notifications Tab Content
  const notificationsContent = (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose how you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-4">
                Notification Channels
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your
                        device
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">
                Activity Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <Label>New Followers</Label>
                  </div>
                  <Switch
                    checked={notifyNewFollowers}
                    onCheckedChange={setNotifyNewFollowers}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                    <Label>Likes on Your Content</Label>
                  </div>
                  <Switch
                    checked={notifyLikes}
                    onCheckedChange={setNotifyLikes}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <Label>Comments on Your Reviews</Label>
                  </div>
                  <Switch
                    checked={notifyComments}
                    onCheckedChange={setNotifyComments}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-muted-foreground" />
                    <Label>New Recommendations</Label>
                  </div>
                  <Switch
                    checked={notifyRecommendations}
                    onCheckedChange={setNotifyRecommendations}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <Label>New Messages</Label>
                  </div>
                  <Switch
                    checked={notifyMessages}
                    onCheckedChange={setNotifyMessages}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <Label>Weekly Digest</Label>
                  </div>
                  <Switch
                    checked={notifyDigest}
                    onCheckedChange={setNotifyDigest}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Appearance Tab Content
  const appearanceContent = (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme Mode</CardTitle>
          <CardDescription>
            Choose your preferred theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themeModes.map((themeMode) => (
              <button
                key={themeMode.value}
                onClick={() => setMode(themeMode.value)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  mode === themeMode.value
                    ? "border-primary bg-primary/10"
                    : "border-muted bg-card hover:bg-accent"
                }`}
              >
                <div
                  className={
                    mode === themeMode.value
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                >
                  {themeMode.icon}
                </div>
                <span className="text-sm">
                  {themeMode.label}
                </span>
                {mode === themeMode.value && (
                  <Check className="w-4 h-4 text-primary absolute top-2 right-2" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Color Theme</CardTitle>
          <CardDescription>
            Select your favorite color palette
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(colorThemes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setColorTheme(key as ColorTheme)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  colorTheme === key
                    ? "border-primary bg-primary/10"
                    : "border-muted bg-card hover:bg-accent"
                }`}
              >
                <div className="flex gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-border/50"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded-full border-2 border-border/50"
                    style={{
                      backgroundColor:
                        theme.primaryDark || theme.primary,
                    }}
                  />
                </div>
                <span className="flex-1 text-left">
                  {theme.name}
                </span>
                {colorTheme === key && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Security Tab Content
  const securityContent = (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Button
                variant="outline"
                onClick={handlePasswordChange}
                className="w-full sm:w-auto"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                We'll send you an email to reset your password
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleEnable2FA}
              />
            </div>

            {twoFactorEnabled && (
              <Alert>
                <Check className="w-4 h-4" />
                <AlertDescription>
                  Two-factor authentication is enabled. You'll
                  need to enter a code from your authenticator
                  app when logging in.
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Login Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified of new logins
                </p>
              </div>
              <Switch
                checked={loginAlerts}
                onCheckedChange={setLoginAlerts}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage devices where you're logged in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Current Device</p>
                <p className="text-sm text-muted-foreground">
                  Chrome on Windows • Active now
                </p>
              </div>
            </div>
            <Badge variant="secondary">Current</Badge>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">iPhone 13</p>
                <p className="text-sm text-muted-foreground">
                  Safari • Last active 2 days ago
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Data & Storage Tab Content
  const dataContent = (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Usage</CardTitle>
          <CardDescription>
            Manage how the app uses your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <Label>Data Saver Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce data usage
                </p>
              </div>
              <Select
                value={dataUsageMode}
                onValueChange={setDataUsageMode}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="wifi">
                    Wi-Fi Only
                  </SelectItem>
                  <SelectItem value="always">Always</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Autoplay Videos</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically play video previews
                </p>
              </div>
              <Switch
                checked={autoplayVideos}
                onCheckedChange={setAutoplayVideos}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Cache Size</Label>
                <span className="text-sm text-muted-foreground">
                  {cacheSize[0]} MB
                </span>
              </div>
              <Slider
                value={cacheSize}
                onValueChange={setCacheSize}
                max={200}
                step={10}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Cache images and data for faster loading
              </p>
            </div>

            <Button variant="outline" className="w-full">
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Data</CardTitle>
          <CardDescription>
            Download or delete your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Your Data
          </Button>
          <p className="text-sm text-muted-foreground">
            Request a copy of all your data including reviews,
            recommendations, and activity.
          </p>

          <Separator />

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Deleting your account is permanent and cannot be
              undone. All your data will be permanently removed.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );

  // Help & Support Tab Content
  const helpContent = (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Help Center</CardTitle>
          <CardDescription>
            Get help and support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <span>FAQs</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <span>Contact Support</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <span>Report a Problem</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <span>Feature Requests</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Community Guidelines</CardTitle>
          <CardDescription>
            Learn about our community standards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <span>Community Rules</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <span>Content Policy</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // About Tab Content
  const aboutContent = (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>About Suggest.Me</CardTitle>
          <CardDescription>
            Learn more about the app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <h2 className="text-3xl mb-2">Suggest.Me</h2>
            <Badge variant="secondary">Version 1.0.0</Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              <span>Terms of Service</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              <span>Privacy Policy</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              <span>Open Source Licenses</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              <span>Acknowledgements</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <Separator />

          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Suggest.Me</p>
            <p className="mt-1">
              Made with ❤️ for content lovers
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    {
      value: "account",
      label: "Account",
      icon: <UserIcon className="w-4 h-4" />,
      content: accountContent,
    },
    {
      value: "privacy",
      label: "Privacy",
      icon: <Shield className="w-4 h-4" />,
      content: privacyContent,
    },
    {
      value: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
      content: notificationsContent,
    },
    {
      value: "appearance",
      label: "Appearance",
      icon: <Palette className="w-4 h-4" />,
      content: appearanceContent,
    },
    {
      value: "security",
      label: "Security",
      icon: <Lock className="w-4 h-4" />,
      content: securityContent,
    },
    {
      value: "data",
      label: "Data",
      icon: <Database className="w-4 h-4" />,
      content: dataContent,
    },
    {
      value: "help",
      label: "Help",
      icon: <HelpCircle className="w-4 h-4" />,
      content: helpContent,
    },
    {
      value: "about",
      label: "About",
      icon: <Info className="w-4 h-4" />,
      content: aboutContent,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-[100]"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl flex items-center gap-2">
                <SettingsIcon className="w-6 h-6" />
                Settings
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6">
        <SwipeableTabs
          tabs={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
        />
      </div>
    </div>
  );
}