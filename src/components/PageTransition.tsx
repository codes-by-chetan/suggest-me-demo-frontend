import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
};

export function PageTransition({ children, className = "", delay = 0 }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ ...pageTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered container for lists and grids
export function StaggerContainer({ 
  children, 
  className = "", 
  staggerChildren = 0.1,
  delayChildren = 0 
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren,
            delayChildren
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual staggered item
export function StaggerItem({ 
  children, 
  className = "",
  index = 0 
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.div
      variants={{
        initial: {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "tween",
            ease: "easeOut",
            duration: 0.4
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide-in animation for cards
export function SlideInCard({ 
  children, 
  className = "",
  direction = "up",
  delay = 0 
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: 30, x: 0 };
      case "down": return { y: -30, x: 0 };
      case "left": return { y: 0, x: 30 };
      case "right": return { y: 0, x: -30 };
      default: return { y: 30, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition(),
        scale: 0.95
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        x: 0,
        scale: 1
      }}
      transition={{ 
        type: "tween",
        ease: "easeOut",
        duration: 0.4,
        delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade-in animation
export function FadeIn({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.3 
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}