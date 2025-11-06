import { useEffect, useState, useRef } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface EmojiSuggestion {
  emoji: string;
  name: string;
  keywords: string[];
}

interface EmojiAutocompleteProps {
  query: string;
  onSelect: (emoji: string, nameLength: number) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

// Simplified emoji dataset for autocomplete
const emojiSuggestions: EmojiSuggestion[] = [
  { emoji: '😀', name: 'grinning', keywords: ['face', 'smile', 'happy'] },
  { emoji: '😃', name: 'smiley', keywords: ['face', 'happy', 'joy'] },
  { emoji: '😄', name: 'smile', keywords: ['face', 'happy', 'joy'] },
  { emoji: '😁', name: 'grin', keywords: ['face', 'happy', 'smile'] },
  { emoji: '😆', name: 'laughing', keywords: ['happy', 'joy', 'lol'] },
  { emoji: '😅', name: 'sweat_smile', keywords: ['hot', 'happy'] },
  { emoji: '🤣', name: 'rofl', keywords: ['laughing', 'lol'] },
  { emoji: '😂', name: 'joy', keywords: ['tears', 'weep', 'happy', 'lol'] },
  { emoji: '🙂', name: 'slightly_smiling_face', keywords: ['smile'] },
  { emoji: '🙃', name: 'upside_down', keywords: ['silly'] },
  { emoji: '😉', name: 'wink', keywords: ['flirt', 'smile'] },
  { emoji: '😊', name: 'blush', keywords: ['smile', 'happy', 'pleased'] },
  { emoji: '😇', name: 'innocent', keywords: ['angel'] },
  { emoji: '🥰', name: 'smiling_face_with_hearts', keywords: ['love', 'adore'] },
  { emoji: '😍', name: 'heart_eyes', keywords: ['love', 'crush'] },
  { emoji: '🤩', name: 'star_struck', keywords: ['eyes', 'wow'] },
  { emoji: '😘', name: 'kissing_heart', keywords: ['love', 'kiss'] },
  { emoji: '😋', name: 'yum', keywords: ['tongue', 'lick'] },
  { emoji: '😛', name: 'stuck_out_tongue', keywords: ['silly'] },
  { emoji: '😜', name: 'stuck_out_tongue_winking_eye', keywords: ['silly', 'wink'] },
  { emoji: '🤪', name: 'zany', keywords: ['silly', 'crazy'] },
  { emoji: '😝', name: 'stuck_out_tongue_closed_eyes', keywords: ['silly'] },
  { emoji: '🤑', name: 'money_mouth', keywords: ['rich', 'dollar'] },
  { emoji: '🤗', name: 'hugging', keywords: ['hug'] },
  { emoji: '🤭', name: 'hand_over_mouth', keywords: ['quiet', 'secret'] },
  { emoji: '🤫', name: 'shushing', keywords: ['quiet', 'silent'] },
  { emoji: '🤔', name: 'thinking', keywords: ['hmm', 'think'] },
  { emoji: '🤐', name: 'zipper_mouth', keywords: ['secret', 'quiet'] },
  { emoji: '🤨', name: 'raised_eyebrow', keywords: ['suspicious'] },
  { emoji: '😐', name: 'neutral', keywords: ['meh'] },
  { emoji: '😑', name: 'expressionless', keywords: ['meh'] },
  { emoji: '😶', name: 'no_mouth', keywords: ['mute', 'quiet'] },
  { emoji: '😏', name: 'smirk', keywords: ['smug'] },
  { emoji: '😒', name: 'unamused', keywords: ['meh'] },
  { emoji: '🙄', name: 'rolling_eyes', keywords: ['eyeroll'] },
  { emoji: '😬', name: 'grimacing', keywords: ['awkward'] },
  { emoji: '😔', name: 'pensive', keywords: ['sad'] },
  { emoji: '😪', name: 'sleepy', keywords: ['tired'] },
  { emoji: '🤤', name: 'drooling', keywords: ['hungry'] },
  { emoji: '😴', name: 'sleeping', keywords: ['zzz', 'tired'] },
  { emoji: '😷', name: 'mask', keywords: ['sick', 'ill'] },
  { emoji: '🤒', name: 'thermometer', keywords: ['sick', 'ill'] },
  { emoji: '🤕', name: 'head_bandage', keywords: ['hurt', 'injured'] },
  { emoji: '🤢', name: 'nauseated', keywords: ['sick'] },
  { emoji: '🤮', name: 'vomiting', keywords: ['sick'] },
  { emoji: '🤧', name: 'sneezing', keywords: ['sick', 'achoo'] },
  { emoji: '🥵', name: 'hot', keywords: ['heat', 'sweating'] },
  { emoji: '🥶', name: 'cold', keywords: ['freezing'] },
  { emoji: '😎', name: 'sunglasses', keywords: ['cool'] },
  { emoji: '🤓', name: 'nerd', keywords: ['geek', 'glasses'] },
  { emoji: '🧐', name: 'monocle', keywords: ['stuffy'] },
  { emoji: '😕', name: 'confused', keywords: ['puzzled'] },
  { emoji: '😟', name: 'worried', keywords: ['concern'] },
  { emoji: '🙁', name: 'slightly_frowning', keywords: ['sad'] },
  { emoji: '☹️', name: 'frowning', keywords: ['sad'] },
  { emoji: '😮', name: 'open_mouth', keywords: ['surprise', 'wow'] },
  { emoji: '😯', name: 'hushed', keywords: ['surprise', 'wow'] },
  { emoji: '😲', name: 'astonished', keywords: ['amazed', 'wow'] },
  { emoji: '😳', name: 'flushed', keywords: ['embarrassed'] },
  { emoji: '🥺', name: 'pleading', keywords: ['puppy', 'eyes'] },
  { emoji: '😢', name: 'cry', keywords: ['sad', 'tear'] },
  { emoji: '😭', name: 'sob', keywords: ['sad', 'cry', 'bawling'] },
  { emoji: '😱', name: 'scream', keywords: ['horror', 'shocked'] },
  { emoji: '😞', name: 'disappointed', keywords: ['sad'] },
  { emoji: '😩', name: 'weary', keywords: ['tired'] },
  { emoji: '😫', name: 'tired', keywords: ['exhausted'] },
  { emoji: '🥱', name: 'yawning', keywords: ['tired', 'bored'] },
  { emoji: '😤', name: 'triumph', keywords: ['smug', 'proud'] },
  { emoji: '😡', name: 'rage', keywords: ['angry', 'mad'] },
  { emoji: '😠', name: 'angry', keywords: ['mad', 'annoyed'] },
  { emoji: '🤬', name: 'cursing', keywords: ['angry', 'swearing'] },
  { emoji: '😈', name: 'smiling_imp', keywords: ['devil', 'evil'] },
  { emoji: '👿', name: 'imp', keywords: ['devil', 'evil'] },
  { emoji: '💀', name: 'skull', keywords: ['dead', 'danger'] },
  { emoji: '☠️', name: 'skull_crossbones', keywords: ['danger', 'pirate'] },
  { emoji: '💩', name: 'poop', keywords: ['shit'] },
  { emoji: '🤡', name: 'clown', keywords: ['face'] },
  { emoji: '👻', name: 'ghost', keywords: ['halloween'] },
  { emoji: '👽', name: 'alien', keywords: ['ufo'] },
  { emoji: '🤖', name: 'robot', keywords: ['face'] },
  { emoji: '😺', name: 'smiley_cat', keywords: ['animal'] },
  { emoji: '😸', name: 'smile_cat', keywords: ['animal'] },
  { emoji: '😹', name: 'joy_cat', keywords: ['animal'] },
  { emoji: '😻', name: 'heart_eyes_cat', keywords: ['animal'] },
  { emoji: '😼', name: 'smirk_cat', keywords: ['animal'] },
  { emoji: '😽', name: 'kissing_cat', keywords: ['animal'] },
  { emoji: '🙀', name: 'scream_cat', keywords: ['animal'] },
  { emoji: '😿', name: 'crying_cat_face', keywords: ['animal', 'sad'] },
  { emoji: '😾', name: 'pouting_cat', keywords: ['animal'] },
  { emoji: '👋', name: 'wave', keywords: ['hello', 'hi', 'goodbye'] },
  { emoji: '🤚', name: 'raised_back_of_hand', keywords: ['stop'] },
  { emoji: '✋', name: 'raised_hand', keywords: ['stop', 'high_five'] },
  { emoji: '🖖', name: 'vulcan', keywords: ['spock', 'star_trek'] },
  { emoji: '👌', name: 'ok_hand', keywords: ['okay', 'perfect'] },
  { emoji: '✌️', name: 'victory', keywords: ['peace'] },
  { emoji: '🤞', name: 'fingers_crossed', keywords: ['luck', 'hope'] },
  { emoji: '🤟', name: 'love_you', keywords: ['ily'] },
  { emoji: '🤘', name: 'metal', keywords: ['rock'] },
  { emoji: '🤙', name: 'call_me', keywords: ['shaka'] },
  { emoji: '👈', name: 'point_left', keywords: ['left'] },
  { emoji: '👉', name: 'point_right', keywords: ['right'] },
  { emoji: '👆', name: 'point_up_2', keywords: ['up'] },
  { emoji: '👇', name: 'point_down', keywords: ['down'] },
  { emoji: '☝️', name: 'point_up', keywords: ['up', 'index'] },
  { emoji: '👍', name: 'thumbsup', keywords: ['yes', 'good', 'like', '+1'] },
  { emoji: '👎', name: 'thumbsdown', keywords: ['no', 'bad', 'dislike', '-1'] },
  { emoji: '✊', name: 'fist', keywords: ['punch'] },
  { emoji: '👊', name: 'punch', keywords: ['fist_bump'] },
  { emoji: '👏', name: 'clap', keywords: ['applause', 'bravo'] },
  { emoji: '🙌', name: 'raised_hands', keywords: ['celebrate', 'hooray'] },
  { emoji: '👐', name: 'open_hands', keywords: ['hug'] },
  { emoji: '🤝', name: 'handshake', keywords: ['deal', 'agreement'] },
  { emoji: '🙏', name: 'pray', keywords: ['thank_you', 'namaste', 'please'] },
  { emoji: '✍️', name: 'writing', keywords: ['write'] },
  { emoji: '💪', name: 'muscle', keywords: ['strong', 'bicep'] },
  { emoji: '❤️', name: 'heart', keywords: ['love', 'red'] },
  { emoji: '🧡', name: 'orange_heart', keywords: ['love'] },
  { emoji: '💛', name: 'yellow_heart', keywords: ['love'] },
  { emoji: '💚', name: 'green_heart', keywords: ['love'] },
  { emoji: '💙', name: 'blue_heart', keywords: ['love'] },
  { emoji: '💜', name: 'purple_heart', keywords: ['love'] },
  { emoji: '🖤', name: 'black_heart', keywords: ['evil'] },
  { emoji: '🤍', name: 'white_heart', keywords: ['pure'] },
  { emoji: '🤎', name: 'brown_heart', keywords: ['love'] },
  { emoji: '💔', name: 'broken_heart', keywords: ['sad', 'heartbreak'] },
  { emoji: '❤️‍🔥', name: 'heart_on_fire', keywords: ['love', 'passion'] },
  { emoji: '💕', name: 'two_hearts', keywords: ['love'] },
  { emoji: '💞', name: 'revolving_hearts', keywords: ['love'] },
  { emoji: '💓', name: 'heartbeat', keywords: ['love', 'nervous'] },
  { emoji: '💗', name: 'heartpulse', keywords: ['love', 'nervous'] },
  { emoji: '💖', name: 'sparkling_heart', keywords: ['love'] },
  { emoji: '💘', name: 'cupid', keywords: ['love', 'arrow'] },
  { emoji: '💝', name: 'gift_heart', keywords: ['love', 'chocolates'] },
  { emoji: '🔥', name: 'fire', keywords: ['flame', 'hot', 'lit'] },
  { emoji: '💯', name: '100', keywords: ['score', 'perfect'] },
  { emoji: '✨', name: 'sparkles', keywords: ['shiny'] },
  { emoji: '⭐', name: 'star', keywords: ['night'] },
  { emoji: '🌟', name: 'glowing_star', keywords: ['shiny'] },
  { emoji: '💫', name: 'dizzy', keywords: ['star'] },
  { emoji: '⚡', name: 'zap', keywords: ['lightning', 'thunder'] },
  { emoji: '💥', name: 'boom', keywords: ['collision', 'explode'] },
  { emoji: '✅', name: 'white_check_mark', keywords: ['done', 'complete'] },
  { emoji: '❌', name: 'x', keywords: ['cancel', 'no'] },
  { emoji: '🎉', name: 'tada', keywords: ['party', 'celebration'] },
  { emoji: '🎊', name: 'confetti_ball', keywords: ['party'] },
  { emoji: '🎈', name: 'balloon', keywords: ['party', 'birthday'] },
  { emoji: '🎁', name: 'gift', keywords: ['present', 'birthday'] },
  { emoji: '🏆', name: 'trophy', keywords: ['award', 'winner'] },
  { emoji: '🥇', name: 'first_place', keywords: ['gold', 'winner'] },
  { emoji: '🥈', name: 'second_place', keywords: ['silver'] },
  { emoji: '🥉', name: 'third_place', keywords: ['bronze'] },
  { emoji: '😀', name: 'ok', keywords: ['okay'] },
  { emoji: '👌', name: 'okay', keywords: ['ok', 'perfect'] },
  { emoji: '👍', name: 'yes', keywords: ['thumbsup', 'good'] },
  { emoji: '👎', name: 'no', keywords: ['thumbsdown', 'bad'] },
];

export function EmojiAutocomplete({
  query,
  onSelect,
  onClose,
  position,
}: EmojiAutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter emojis based on query
  const filteredEmojis = emojiSuggestions.filter((emoji) => {
    const searchTerm = query.toLowerCase();
    return (
      emoji.name.includes(searchTerm) ||
      emoji.keywords.some((keyword) => keyword.includes(searchTerm))
    );
  }).slice(0, 8); // Limit to 8 results

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredEmojis.length === 0) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredEmojis.length - 1
          );
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredEmojis.length - 1 ? prev + 1 : 0
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredEmojis[selectedIndex]) {
            onSelect(
              filteredEmojis[selectedIndex].emoji,
              filteredEmojis[selectedIndex].name.length
            );
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredEmojis, selectedIndex, onSelect, onClose]);

  if (filteredEmojis.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed z-[60]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <Card className="shadow-lg border-2 overflow-hidden min-w-[240px]">
        <ScrollArea className="max-h-[240px]">
          <div className="p-1">
            {filteredEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => onSelect(emoji.emoji, emoji.name.length)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded hover:bg-muted transition-colors ${
                  index === selectedIndex ? 'bg-muted' : ''
                }`}
              >
                <span className="text-xl">{emoji.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">:{emoji.name}:</div>
                  {emoji.keywords.length > 0 && (
                    <div className="text-xs text-muted-foreground truncate">
                      {emoji.keywords.slice(0, 3).join(', ')}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
