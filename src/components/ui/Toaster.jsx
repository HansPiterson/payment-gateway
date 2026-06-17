import { useToast, dismissToast } from './use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:flex-col md:max-w-[420px] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {toasts.map(({ id, title, description, variant }) => (
          <motion.div
            key={id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 300 }}
            dragElastic={0.7}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100 || info.velocity.x > 500) {
                dismissToast(id);
              }
            }}
            className="pointer-events-auto w-full mb-2 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-100 shadow-2xl cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 shrink-0">
              {variant === 'success' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-100"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : variant === 'error' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              )}
            </div>
            <div className="grid gap-1 pointer-events-none">
              {title && <div className="text-sm font-bold">{title}</div>}
              {description && (
                <div className="text-xs text-zinc-400 font-medium">{description}</div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
