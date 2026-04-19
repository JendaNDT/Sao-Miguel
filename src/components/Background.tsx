export default function Background({ dynamic }: { dynamic: boolean }) {
  if (!dynamic) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 dark:bg-emerald-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-teal-400/20 dark:bg-teal-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-blue-400/20 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
    </div>
  );
}
