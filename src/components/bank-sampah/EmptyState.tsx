export default function EmptyState({
  icon,
  title,
  desc,
  isError = false,
}: {
  icon: string;
  title: string;
  desc: string;
  isError?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5 mb-5 text-4xl">
        {icon}
      </div>
      <h2 className={`text-xl font-black mb-2 ${isError ? "text-red-700" : "text-black"}`}>
        {title}
      </h2>
      <p className="text-sm text-black/50 max-w-sm leading-relaxed">{desc}</p>
    </div>
  );
}