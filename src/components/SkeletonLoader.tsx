export default function SkeletonLoader() {
    return (
      <div className="animate-pulse space-y-2">
        <div className="bg-gray-300 h-48 w-full rounded" />
        <div className="bg-gray-300 h-4 w-1/2 rounded" />
        <div className="bg-gray-300 h-4 w-1/3 rounded" />
      </div>
    );
  }